import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Smartphone, 
  Share2, 
  ArrowRight, 
  Check, 
  ExternalLink,
  Tag,
  Sparkles,
  Layers,
  Facebook,
  Instagram,
  Heart,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Copy,
  Sliders,
  Cpu,
  Monitor,
  Shield,
  Zap,
  MousePointer2,
  X,
  Plus
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { motion, AnimatePresence } from 'motion/react';

export const BrandPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    { name: "Adnan Chowdhury", text: "The KIYOMI Chrono X1 smartwatch has incredible display performance and premium titanium weight. Truly exceptional engineering!", date: "Today" },
    { name: "Maliha Rahman", text: "I ordered the Neo-Type mechanical keypad yesterday. The typing acoustics are extremely elegant and well-tuned.", date: "Yesterday" }
  ]);

  // Figma Loader Simulation states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Calibrating grid vectors...");
  const [milestones, setMilestones] = useState({
    grid: false,
    vector: false,
    specs: false,
    canvas: false
  });

  // Generate shareable link representation
  const shareableUrl = `${window.location.origin}/#/portfolio`;

  useEffect(() => {
    // Elegant incremental progress simulation for Figma design canvas
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Auto transition out of loader in a bit
          setTimeout(() => {
            setIsLoading(false);
            playCinematicIntroSound("Kiyomi guild design portfolio has compiled successfully.");
          }, 600);
          return 100;
        }
        
        const increment = Math.floor(Math.random() * 15) + 5;
        const nextVal = Math.min(prev + increment, 100);

        // Update milestones based on progress values
        if (nextVal >= 25 && nextVal < 50) {
          setLoadingStatus("Aligning high-fidelity AMOLED layouts...");
          setMilestones(m => ({ ...m, grid: true }));
        } else if (nextVal >= 50 && nextVal < 70) {
          setLoadingStatus("Assembling aerospace alloy frame specifications...");
          setMilestones(m => ({ ...m, vector: true }));
        } else if (nextVal >= 70 && nextVal < 90) {
          setLoadingStatus("Configuring zero-latency mechanical feedback loops...");
          setMilestones(m => ({ ...m, specs: true }));
        } else if (nextVal >= 90) {
          setLoadingStatus("Compiling design layer templates...");
          setMilestones(m => ({ ...m, canvas: true }));
        }

        return nextVal;
      });
    }, 280);

    return () => clearInterval(timer);
  }, []);

  const handleCopyPortfolioLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareableUrl);
      } else {
        // Fallback for sandboxed iframes or older browsers
        const tempInput = document.createElement("input");
        tempInput.value = shareableUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      setCopiedLink(true);
      playCinematicIntroSound("Kiyomi studio portfolio link copied. Share it proudly.");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn("Failed to copy link automatically:", err);
      alert(`Your portfolio link: ${shareableUrl}`);
    }
  };

  const handlePostQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    
    setCommentsList(prev => [
      { name: commentName.trim(), text: commentText.trim(), date: "Just now" },
      ...prev
    ]);
    setCommentName('');
    setCommentText('');
    playCinematicIntroSound("Your query and appreciation has been logged into the Kiyomi design catalog ledger.");
  };

  // Cursor initial positions for Figma multiplayer rendering inside loader screen
  const multiplayerCursors = [
    { name: "Abrar (Design)", color: "#A259FF", x: "12%", y: "45%", delay: 0 },
    { name: "Fahim (Haptics)", color: "#F24E1E", x: "78%", y: "25%", delay: 0.5 },
    { name: "KiyomiBot (Spec)", color: "#1ABC9C", x: "42%", y: "82%", delay: 0.2 },
    { name: "Sadman (Core)", color: "#18A0FB", x: "65%", y: "65%", delay: 0.8 }
  ];

  return (
    <div className="bg-[#080B10] min-h-screen text-stone-200 selection:bg-[#CBF23D] selection:text-[#080B10] font-sans antialiased relative overflow-x-hidden">
      
      {/* 1. FIGMA MULTIPLAYER CANVAS INTRO LOADER SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="figma-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] bg-[#0E1117] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
          >
            {/* Grid background representation mimicking Figma Workspace */}
            <div 
              className="absolute inset-0 opacity-[0.06]" 
              style={{
                backgroundImage: `
                  radial-gradient(ellipse at center, transparent 20%, #0E1117 100%),
                  linear-gradient(to right, #ffffff 1px, transparent 1px),
                  linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                `,
                backgroundSize: '100%, 32px 32px'
              }}
            />

            {/* Custom vector target circle in the background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-zinc-800/40 pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-dashed border-zinc-800/30 pointer-events-none" />

            {/* Figma-Style Multiplayer Floating Cursors Autonomous Motion */}
            {multiplayerCursors.map((cursor, idx) => (
              <motion.div
                key={idx}
                className="absolute flex items-start gap-1 p-1 pointer-events-none z-10"
                initial={{ left: "50%", top: "50%" }}
                animate={{
                  left: [cursor.x, `${parseInt(cursor.x) + 8}%`, `${parseInt(cursor.x) - 4}%`, cursor.x],
                  top: [cursor.y, `${parseInt(cursor.y) - 10}%`, `${parseInt(cursor.y) + 5}%`, cursor.y]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: cursor.delay
                }}
              >
                <MousePointer2 className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] rotate-[270deg]" style={{ color: cursor.color, fill: cursor.color }} />
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full text-white shadow-md select-none tracking-wide" style={{ backgroundColor: cursor.color }}>
                  {cursor.name}
                </span>
                {/* Simulated connection path */}
                <svg className="absolute top-2.5 left-2.5 w-40 h-20 -z-10 overflow-visible opacity-20">
                  <path d="M0,0 Q30,10 60,-20 T120,10" fill="none" stroke={cursor.color} strokeWidth="1.5" strokeDasharray="3,3" />
                </svg>
              </motion.div>
            ))}

            {/* Central Loader Widget Box */}
            <div className="relative text-center max-w-md w-full space-y-8 z-20">
              
              {/* Figma Vector Pen Layout Indicator */}
              <div className="flex justify-center flex-col items-center space-y-3">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#CBF23D]/10 rounded-full blur-xl animate-pulse" />
                  <div className="h-16 w-16 bg-gradient-to-tr from-[#9B51E0] via-[#F24E1E] to-[#CBF23D] rounded-3xl p-0.5 shadow-2xl flex items-center justify-center transform hover:rotate-12 transition-transform">
                    <div className="h-full w-full bg-[#0E1117] rounded-[22px] flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-[#CBF23D] animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <h2 className="text-[13px] font-mono uppercase tracking-[0.3em] text-[#CBF23D] font-extrabold">KIYOMI STUDIO</h2>
                    <span className="text-[8px] bg-white/15 px-1.5 py-0.5 rounded text-white font-mono uppercase">V1.04</span>
                  </div>
                  <h1 className="text-xl font-serif tracking-[0.15em] font-extrabold text-white text-center uppercase">CONSTRUCTING CANVAS</h1>
                </div>
              </div>

              {/* Progress Milestones Checklist */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 text-left space-y-2.5 max-w-xs mx-auto backdrop-blur-md">
                <div className="flex items-center justify-between text-[8px] font-mono tracking-widest text-[#CBF23D] border-b border-white/5 pb-1.5 uppercase font-bold">
                  <span>Workspace Checklist</span>
                  <span>4 Slots</span>
                </div>
                <div className="space-y-2 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${milestones.grid ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-zinc-700 text-transparent"}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className={milestones.grid ? "text-stone-300 line-through opacity-60" : "text-stone-400"}>Figma Mesh Established</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${milestones.vector ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-zinc-700 text-transparent"}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className={milestones.vector ? "text-stone-300 line-through opacity-60" : "text-stone-400"}>Sizing AMOLED Displays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${milestones.specs ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-zinc-700 text-transparent"}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className={milestones.specs ? "text-stone-300 line-through opacity-60" : "text-stone-400"}>Mapping GaN Power Grids</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${milestones.canvas ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-zinc-700 text-transparent"}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className={milestones.canvas ? "text-stone-300 line-through opacity-60" : "text-stone-400"}>Spawning Interactive Portfolios</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                  <span className="animate-pulse">{loadingStatus}</span>
                  <span className="font-bold text-white">{loadingProgress}%</span>
                </div>
                
                <div className="h-1.5 w-full bg-zinc-800/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#9B51E0] via-[#FD1D1D] to-[#CBF23D] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Instant bypass buttons mimicking software developer testing */}
              <button 
                onClick={() => {
                  setIsLoading(false);
                  playCinematicIntroSound("Bypassing design sandbox sequence.");
                }}
                className="text-[9px] font-mono tracking-widest text-zinc-550 hover:text-white uppercase transition-colors px-3 py-1.5 border border-white/5 hover:border-white/20 rounded-full inline-block cursor-pointer"
              >
                SKIP INTRO ANIMATION
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PORTFOLIO WEBSITE CONTENT STAGE (AFTER SUCCESSFUL FIGMA LOAD) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        
        {/* TOP FIGMA-STYLE WORKSPACE HEADER BAR */}
        <header className="bg-[#121824] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative z-40">
          
          <div className="flex items-center gap-4">
            {/* Logo area */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#CBF23D] rounded-lg p-1.5 flex items-center justify-center text-slate-950 font-black text-sm select-none">
                K
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-mono tracking-widest font-black text-white hover:text-[#CBF23D] transition-colors leading-none uppercase">
                    KIYOMI GUILD
                  </h1>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded uppercase leading-none">
                    ONLINE
                  </span>
                </div>
                <span className="text-[8px] font-mono text-zinc-400 tracking-wider">SECURE DIGITAL WORKSPACE PLATFORM</span>
              </div>
            </div>

            <span className="hidden lg:block h-6 w-[1px] bg-white/10 mx-2" />

            {/* Menu items inside navigation header */}
            <nav className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-zinc-400 uppercase">
              <a href="#designer-canvas" className="px-3 py-1.5 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">Canvas</a>
              <a href="#bento-manifesto" className="px-3 py-1.5 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">Values</a>
              <a href="#expert-connectivity" className="px-3 py-1.5 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">Coordinates</a>
              <a href="#enquiry-ledger" className="px-3 py-1.5 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">Live Ledger</a>
            </nav>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Boutique Route and Link Copy */}
            <Link 
              to="/" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] tracking-widest font-extrabold uppercase rounded-lg border border-white/5 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#CBF23D]" /> MAIN BOUTIQUE
            </Link>

            <button
              onClick={handleCopyPortfolioLink}
              className="px-4 py-2 bg-[#CBF23D] hover:bg-white text-slate-950 font-mono text-[9px] tracking-widest font-black uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow-md shadow-[#CBF23D]/10"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>SHARE SITE</span>
                </>
              )}
            </button>
          </div>

        </header>

        {/* HERO BANNER - STANDALONE Figma DESIGN WORKSPACE */}
        <section id="designer-canvas" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#121824] border border-white/5 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          
          {/* Subtle design blueprint grid behind hero */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{
              backgroundImage: `
                linear-gradient(to right, #ffffff 1px, transparent 1px),
                linear-gradient(to bottom, #ffffff 1px, transparent 1px)
              `,
              backgroundSize: '16px 16px'
            }}
          />

          <div className="lg:col-span-7 space-y-6 relative z-10 text-left">
            <div className="inline-flex items-center gap-2 bg-[#CBF23D]/10 border border-[#CBF23D]/25 px-3.5 py-1.5 rounded-full text-[#CBF23D] font-mono text-[9px] uppercase tracking-widest leading-none font-extrabold">
              <Sparkles className="w-3 h-3 text-[#CBF23D] animate-pulse" /> HIGH-FIDELITY SMARTPHONE &amp; WEARABLES PORTFOLIO
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white uppercase tracking-tight leading-none">
                WE ENGINEER THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CBF23D] via-teal-400 to-[#A259FF]">ULTIMATE GADGETS</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed max-w-xl">
                Kiyomi represents the pinnacle of electronic craftsmanship in Dhaka. By utilizing premium display arrays, titanium-infused alloys, and high-frequency tactile acoustics, we craft gadgets that act as natural extensions of the hyper-urban designer.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="px-6 py-3 bg-[#CBF23D] hover:bg-white text-slate-950 font-mono text-[10px] tracking-widest font-extrabold uppercase rounded-xl transition-all inline-flex items-center gap-2 group cursor-pointer"
              >
                EXPLORE SPECIMENS 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>1 Year Verified Brand Warranty</span>
              </div>
            </div>
          </div>

          {/* Interactive simulated Figma viewport on the right (highly creative layout) */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-[#090C11] border border-white/10 rounded-2xl p-4 overflow-hidden shadow-2xl space-y-4 text-left group">
              
              {/* Figma Window Tabs */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase">viewport_preview_v2.canvas</span>
                <div className="w-5" />
              </div>

              {/* Blueprint Gadget Rendering Details */}
              <div className="space-y-3 relative p-4 rounded-xl bg-slate-950/40 border border-white/[0.03]">
                
                {/* Simulated Anchor Resizing handles on the card corners */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-[#18A0FB] -translate-x-1/2 -translate-y-1/2 border border-white" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-[#18A0FB] translate-x-1/2 -translate-y-1/2 border border-white" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#18A0FB] -translate-x-1/2 translate-y-1/2 border border-white" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#18A0FB] translate-x-1/2 translate-y-1/2 border border-white" />

                <div className="flex justify-between items-start">
                  <span className="text-[7.5px] font-mono text-indigo-400 tracking-wider uppercase block">DEVICE PARAMETERS</span>
                  <span className="text-[7.5px] font-mono text-zinc-500 block hover:text-white uppercase">W: 1440px H: 900px</span>
                </div>

                <div className="flex items-center gap-3.5">
                  <Cpu className="w-8 h-8 text-[#CBF23D] shrink-0 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-white uppercase">CHRONO-X BOARD</h3>
                    <p className="text-[9px] text-[#CBF23D] font-mono uppercase tracking-wide">AMOLED 1.43&rdquo; | Dual-Core SoC</p>
                  </div>
                </div>

                {/* Progress bar inside interactive blueprint card */}
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-400">
                    <span>THERMAL INTEGRITY</span>
                    <span>99.8% STABLE</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[99.8%] bg-[#CBF23D]" />
                  </div>
                </div>

              </div>

              {/* Quick dynamic metrics table info */}
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                <div className="p-2 border border-white/5 rounded-lg bg-white/5">
                  <span className="text-zinc-500 block uppercase">HAPTICS STIFFNESS</span>
                  <span className="text-white font-extrabold uppercase mt-1 block">Tuned mechanical</span>
                </div>
                <div className="p-2 border border-white/5 rounded-lg bg-white/5">
                  <span className="text-zinc-500 block uppercase">SOUND ACCOUSTIC</span>
                  <span className="text-white font-extrabold uppercase mt-1 block">ANC 48dB active</span>
                </div>
              </div>
              
              {/* Figma dynamic hover coordinate badge */}
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-[#18A0FB] text-white text-[7.5px] font-mono rounded select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                #CHRONO13X_GROUP
              </div>

            </div>
          </div>

        </section>

        {/* CORE VALUES & TECH SPECS BENTO GRID */}
        <section id="bento-manifesto" className="space-y-6 text-left">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[9px] font-mono text-[#CBF23D] tracking-[0.25em] uppercase font-bold">MANUFACTURER PHILOSOPHY &amp; PARAMETERS</span>
            <h2 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wide mt-1">THE KIYOMI SPECIFICATION LEDGER</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Box 1 (Span 8): Brand Manifesto */}
            <div className="md:col-span-8 bg-[#121824] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
              <span className="text-[8px] font-mono tracking-widest text-[#CBF23D] uppercase font-extrabold bg-[#CBF23D]/10 px-2 py-1 rounded">OUR MANIFESTO</span>
              <h3 className="text-lg font-serif italic text-white uppercase">Pure Quality Is Absolute.</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                KIYOMI is built upon precision and original execution. We strongly reject low-grade duplicate chipsets, unstable Bluetooth protocols, and fragile plastic parts that plague today's gadget marketplaces. Our core mission is strictly aligned with sourcing premium components—alloy casings, dynamic drivers, and robust AMOLED elements—to deliver clean, authentic hardware directly to modern power users in Dhaka and beyond.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">MATERIALS SELECTION</span>
                  <h4 className="text-xs font-mono font-bold text-[#CBF23D] uppercase">AMOLED Displays &amp; Titanium Frames</h4>
                  <p className="text-[10px] text-zinc-400">Ensuring outstanding screen contrast, color range, and maximum drop security.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">CHARGE STANDARDS</span>
                  <h4 className="text-xs font-mono font-bold text-[#CBF23D] uppercase">Gallium Nitride Power Grid</h4>
                  <p className="text-[10px] text-zinc-400">Miniaturized power adaptors providing massive current safely without thermal throttling.</p>
                </div>
              </div>
            </div>

            {/* Box 2 (Span 4): Workspace Telemetry metrics */}
            <div className="md:col-span-4 bg-gradient-to-br from-[#0c241b] to-[#121824] border border-[#CBF23D]/10 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              
              <div className="space-y-2">
                <span className="text-[8px] font-mono tracking-widest text-[#CBF23D] uppercase font-extrabold block">WORKSPACE SYSTEM STATUS</span>
                <h3 className="text-lg font-serif text-white uppercase">LIVE ENVELOPE telemetry</h3>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[8px] text-zinc-500 uppercase block leading-none">QUALITY INTEGRITY</span>
                  <span className="text-white font-bold flex items-center gap-1.5 mt-1">
                    <ShieldCheck className="w-4 h-4 text-[#CBF23D]" /> 100% ORIGINAL PARTS
                  </span>
                </div>
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[8px] text-zinc-500 uppercase block leading-none">PRODUCT CLASSIFICATION</span>
                  <span className="text-white font-bold block mt-1">PREMIUM GADGETS GUILD</span>
                </div>
                <div>
                  <span className="text-[8px] text-zinc-500 uppercase block leading-none">BASE LOCATION CENTER</span>
                  <span className="text-white font-bold block mt-1">GULSHAN-2, DHAKA</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] text-[#CBF23D] font-mono uppercase bg-white/5 p-3 rounded-xl border border-white/5 text-center font-bold">
                  Coupon Code: KIYOMIVIP
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* CONNECTIVITY CHANNELS & PHONE ASSIST */}
        <section id="expert-connectivity" className="space-y-6 text-left">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[9px] font-mono text-[#CBF23D] tracking-[0.25em] uppercase font-bold">SECURED REDIRECT CORRIDORS</span>
            <h2 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wide mt-1">CONNECT WITH KIYOMI EXPERTS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* WhatsApp Premium Desk Cell */}
            <div className="p-6 bg-[#001D15]/80 border border-emerald-500/10 rounded-3xl flex flex-col justify-between space-y-6">
              
              <div className="space-y-3">
                <span className="text-[8px] font-mono text-[#CBF23D] font-extrabold uppercase tracking-widest bg-[#CBF23D]/10 px-2.5 py-1 rounded inline-block">
                  AUTHENTIC CHAT DESK
                </span>
                <h3 className="text-lg font-serif font-extrabold text-white">
                  SPECS CONSULTATION &amp; ORDER SUPPORT via WHATSAPP
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Have specific size or layout preferences? Speak directly with our verified Gulshan apparel and gadget dispatch representatives on WhatsApp. Our customer center coordinates specs, provides tracking, and assists with real-time hardware allocations.
                </p>
              </div>

              <div className="pt-2">
                <a 
                  href="https://wa.me/8801633701001" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => playCinematicIntroSound("Redirecting to the verified Kiyomi WhatsApp desk.")}
                  className="w-full inline-flex py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] tracking-widest font-extrabold uppercase rounded-xl items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg active:scale-99"
                >
                  <Smartphone className="w-4 h-4 text-[#CBF23D]" /> CHAT WITH REPRESENTATIVE (+8801633701001)
                </a>
              </div>

            </div>

            {/* Social media direct links */}
            <div className="p-6 bg-[#121824] border border-white/5 rounded-3xl flex flex-col justify-between space-y-6">
              
              <div className="space-y-3">
                <span className="text-[8px] font-mono text-[#CBF23D] font-extrabold uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded inline-block">
                  SOCIAL DIRECTORIES
                </span>
                <h3 className="text-lg font-serif font-extrabold text-white">
                  FOLLOW SYSTEM DRIPS &amp; LAUNCH CHRONICLES
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Join our verified social networks to browse daily haptic setups, community typewriter videos, dynamic AMOLED benchmarks, and immediate information concerning seasonal hardware discounts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a 
                  href="https://www.facebook.com/share/19JHtW2Eft/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => playCinematicIntroSound("Opening official Facebook network.")}
                  className="inline-flex py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-mono text-[10px] tracking-widest font-extrabold uppercase rounded-xl items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Facebook className="w-4 h-4" /> FACEBOOK CHANNEL
                </a>

                <a 
                  href="https://www.instagram.com/kiyomi_express?igsh=MW9maTVjczhkbzM5bQ==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => playCinematicIntroSound("Redirecting to brand Instagram feeds.")}
                  className="inline-flex py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white font-mono text-[10px] tracking-widest font-extrabold uppercase rounded-xl items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-101"
                >
                  <Instagram className="w-4 h-4" /> INSTAGRAM GRID
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* EXPERT ADVICE LEDGER / CLIENT QUERIES FORM */}
        <section id="enquiry-ledger" className="space-y-6 text-left">
          
          <div className="border-b border-white/10 pb-2">
            <span className="text-[9px] font-mono text-[#CBF23D] tracking-[0.25em] uppercase font-bold">INTERACTIVE SANDBOX</span>
            <h2 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wide mt-1 font-extrabold">SUBMIT ACCESS ENQUIRY</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side Form (Span 7) */}
            <div className="lg:col-span-7 bg-[#121824] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Provide your custom haptic request, mechanical switch advice, or general smartwatch configuration queries below. Our certified technologist team logs every message in the local directory.
              </p>

              <form onSubmit={handlePostQuery} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-550 font-bold">YOUR FULL NAME</label>
                    <input 
                      type="text" 
                      required
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="E.G. MAHAFUZUR RAHAMAN" 
                      className="w-full bg-[#080B10]/85 border border-white/10 focus:border-[#CBF23D]/30 p-3 rounded-xl text-xs text-white font-mono uppercase outline-none focus:bg-[#0E131E]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-550 font-bold">COORDINATE OR EMAIL</label>
                    <input 
                      type="text" 
                      placeholder="E.G. CONRAD@KIYOMI.SHIELD" 
                      className="w-full bg-[#080B10]/85 border border-white/10 focus:border-[#CBF23D]/30 p-3 rounded-xl text-xs text-white font-mono uppercase outline-none focus:bg-[#0E131E]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-550 font-bold">SPECIFICATION QUERY OR COMMENT DETAILS</label>
                  <textarea 
                    required
                    rows={4} 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="WRITE SPECIFIC QUESTIONS CONCERNING AMOLED THERBALS, MECH SWITCH ACOUSTICS, OR LOGISTIC TIMES..." 
                    className="w-full bg-[#080B10]/85 border border-white/10 focus:border-[#CBF23D]/30 p-3 rounded-xl text-xs text-white outline-none focus:bg-[#0E131E]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#CBF23D] hover:bg-white text-slate-950 font-mono text-[10px] tracking-widest font-black uppercase rounded-xl transition-all shadow-md hover:scale-[1.01] active:scale-99 cursor-pointer"
                >
                  TRANSMIT FILE TO LEDGER
                </button>
              </form>
            </div>

            {/* Right side Live queries (Span 5) */}
            <div className="lg:col-span-5 bg-[#121824] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[8.5px] font-mono text-[#CBF23D] uppercase tracking-widest font-extrabold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> LIVE REVIEWS &amp; INQUIRIES
                </span>
                <span className="text-[7px] font-mono text-zinc-500 uppercase font-bold">2 FILES ARCHIVED</span>
              </div>

              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {commentsList.map((c, i) => (
                  <div key={i} className="p-4 bg-[#080B10]/60 border border-white/5 rounded-2xl space-y-2 text-xs text-left relative group">
                    <div className="flex justify-between items-center font-mono">
                      <strong className="text-white uppercase tracking-wider font-bold text-[10px]">{c.name}</strong>
                      <span className="text-[8px] text-zinc-500 font-bold uppercase">{c.date}</span>
                    </div>
                    <p className="text-zinc-400 font-sans italic leading-relaxed text-[11px]">&rdquo;{c.text}&rdquo;</p>
                    
                    {/* Simulated vector handle */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#CBF23D] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

            </div>

          </div>

        </section>

        {/* BRIGHT METALLIC BOTTOM FOOTER */}
        <footer className="text-center py-8 border-t border-white/5 mt-10 space-y-4">
          
          <div className="flex justify-center gap-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()} KIYOMI BRAND GUILD</span>
            <span>&bull;</span>
            <span>GULSHAN PREMIUM DISPATCH CENTER</span>
          </div>

          <div className="flex justify-center">
            <Link 
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#CBF23D] hover:text-white uppercase tracking-widest hover:underline transition-colors"
            >
              &larr; BACK TO ACTIVE CATALOG 
            </Link>
          </div>

          <p className="text-[8px] font-mono text-zinc-700 max-w-md mx-auto leading-relaxed uppercase">
            Authorized standalone workspace interface. External coordinates secure under AES-256 digital telemetry standards.
          </p>

        </footer>

      </div>
    </div>
  );
};
