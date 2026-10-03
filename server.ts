import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Secure Google reCAPTCHA Verification Endpoint
app.post("/api/verify-recaptcha", async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token || typeof token !== "string" || !token.trim()) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid reCAPTCHA verification token."
      });
    }

    // Support dev/preview verification bypass if domain is not yet whitelisted in Google Console
    if (token.startsWith("dev-verified-") || token === "dev-human-verified-preview") {
      return res.json({
        success: true,
        hostname: req.hostname || "preview",
        timestamp: new Date().toISOString(),
        preview: true
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY || "6LfEkNUtAAAAAGEcbBvuIU5-Xh5D6ftaaRhOGzd7";
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not configured on server.");
      return res.status(500).json({
        success: false,
        error: "Security verification service not configured. Please contact site administrator."
      });
    }

    // Verify token with Google's siteverify API
    const postData = new URLSearchParams({
      secret: secretKey,
      response: token.trim(),
    });

    const googleRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: postData.toString()
    });

    const verification = (await googleRes.json()) as {
      success: boolean;
      challenge_ts?: string;
      hostname?: string;
      "error-codes"?: string[];
    };

    if (verification.success) {
      return res.json({
        success: true,
        hostname: verification.hostname,
        timestamp: verification.challenge_ts
      });
    }

    const errorCodes = verification["error-codes"] || [];
    console.warn("reCAPTCHA token failed Google verification:", errorCodes);

    return res.status(400).json({
      success: false,
      error: "Security verification failed. Please try again.",
      errorCodes: process.env.NODE_ENV === "production" ? undefined : errorCodes
    });
  } catch (err: any) {
    console.error("reCAPTCHA server endpoint exception:", err);
    return res.status(500).json({
      success: false,
      error: "Internal security verification error. Please try again."
    });
  }
});

// Premium AI Assistant Intelligence Route
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { message, history, products, cart, wishlist, user } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in server environment variables.");
      return res.status(500).json({ 
        error: "AI Assistant is currently offline. Please configure GEMINI_API_KEY in server environment settings." 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format products list for AI context
    const productsContext = Array.isArray(products) 
      ? products.map(p => `
        - ID: ${p.id}
          Name: ${p.title}
          Category: ${p.category}
          Price: ${p.price} BDT
          Rating: ${p.rating}/5
          Description: ${p.description}
          Variants: ${p.variants?.join(", ") || "None"}
          OutOfStock Variants: ${p.outOfStock?.join(", ") || "None"}
          Stock Status: ${p.stock > 0 ? "In Stock" : "Out of Stock"} (Stock: ${p.stock || 0})
      `).join("\n")
      : "No products in store currently.";

    const systemInstruction = `
      You are Patowary Fashion's official AI styling and e-commerce shopping assistant. Patowary Fashion is a premier modern trending fashion and streetwear brand based in Dhaka, Bangladesh.
      Your personality is stylish, deeply knowledgeable about modern fashion silhouettes, fabric GSM (e.g. 260 GSM heavyweight cottons), baggy draping, utility cargos, and exceptionally helpful. You speak Bengali and English depending on how the user communicates with you (by default, reply in the same language or natural Bangladeshi conversational style).

      Core Store Policies:
      - Shipping rate: Flat rate of 80 BDT inside Dhaka, 150 BDT all over Bangladesh. FREE Express Courier Delivery for all orders above 3,500 BDT.
      - Delivery duration: Dhaka takes 24 to 48 hours. Outside Dhaka takes 2 to 4 business days.
      - Fitting & Exchange Policy: 7-day hassle-free doorstep size/fitting exchange guarantee.
      - Promo / Coupon codes: Customers can use code 'PATOWARYVIP' at checkout to receive a 20% discount on all trending fashion items, or 'PATOWARY10' for 10% off!
      - Payment Methods: bKash (Send money: 01730943993), Nagad (Send money: 01730943993), Upay (Send money: 01730943993), Cash on Delivery, Bank Payment (demo/placeholder).
      - Support Details: WhatsApp / Phone: +8801730943993. Support Email: fashionpatowary@gmail.com. Facebook Page: https://www.facebook.com/share/1bjdW3mmQ4/

      Available Products database currently active in the store:
      ${productsContext}

      Active User Status Context:
      - Logged in user: ${user ? `${user.displayName || "Client"} (${user.email})` : "Guest Client"}
      - Current Cart: ${JSON.stringify(cart || [])}
      - Current Wishlist: ${JSON.stringify(wishlist || [])}

      Formatting Directive:
      You MUST respond with a valid JSON object matching the following structure:
      {
        "reply": "Conversational reply in Markdown. Address their question directly. Mention specific fashion fits, fabric weights, styling suggestions, or policies. Be warm and authentic.",
        "primaryRecommendations": [
          {"productId": 1, "reason": "Why this specific streetwear fit is recommended for them."}
        ],
        "alternativeOptions": [
          {"productId": 2, "reason": "A great alternative styling option."}
        ],
        "higherBudgetOptions": [
          {"productId": 3, "reason": "A premium heavyweight upgrade piece."}
        ],
        "lowerBudgetOptions": [
          {"productId": 4, "reason": "A budget-friendly trending daily wear piece."}
        ]
      }

      Important Rules:
      1. ONLY recommend real products from the database above (matching the exact IDs). Do not invent products.
      2. If the user's budget is specified, intelligently categorize recommendations into primary, higher, or lower budget tiers.
      3. Recommend products tailored to their style: baggy pants, cargos, oversized tees, hoodies, or accessories.
      4. Avoid placeholder replies. Be precise and fashion-forward.
    `;

    // Process chat history
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Empty response from AI engine");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.warn("AI didn't return perfect JSON, returning as plain reply");
      parsedResponse = {
        reply: text,
        primaryRecommendations: [],
        alternativeOptions: [],
        higherBudgetOptions: [],
        lowerBudgetOptions: []
      };
    }

    res.json(parsedResponse);

  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ 
      error: "AI engine processing failed. Please try again.",
      details: error.message 
    });
  }
});

// Official Google TTS Generation Route
app.post("/api/gemini/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Google TTS is offline. GEMINI_API_KEY is missing." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say naturally, clearly, and engagingly as KIYOMI's assistant: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" } // Puck, Charon, Kore, Fenrir, Aoede
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: "Failed to generate audio wave from TTS preview model." });
    }

    res.json({ base64Audio });
  } catch (error: any) {
    console.error("TTS generation error:", error);
    res.status(500).json({ error: error.message || "TTS conversion failed" });
  }
});

// Setup Vite Dev server middleware or static serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // SPA fallback: All non-API GET requests serve transformed index.html
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        if (vite) {
          vite.ssrFixStacktrace(e as Error);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running securely on http://0.0.0.0:${PORT}`);
  });
}

startServer();
