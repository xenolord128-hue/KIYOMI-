import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { updatePageSEO } from '../utils/seoUtils';
import { sendFormViaEmailJS } from '../lib/emailjs';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { ReCaptcha } from '../components/ReCaptcha';
import { verifyRecaptchaToken } from '../utils/recaptcha';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Facebook,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order Enquiry');
  const [message, setMessage] = useState('');

  // reCAPTCHA verification token
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    updatePageSEO('Contact Customer Care | Patowary Fashion', 'Reach out to Patowary Fashion customer support for order enquiries, sizing guidance, and delivery assistance.');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // Enforce Google reCAPTCHA security verification
    if (!recaptchaToken) {
      setErrorMessage(t("Please complete the reCAPTCHA security verification below.", "দয়া করে নিচের রিক্যাপচা যাচাইকরণটি সম্পন্ন করুন।"));
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const verification = await verifyRecaptchaToken(recaptchaToken);
    if (!verification.success) {
      setErrorMessage(verification.error || t("Security verification failed. Please try again.", "নিরাপত্তা যাচাই ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"));
      setSubmitting(false);
      return;
    }

    const result = await sendFormViaEmailJS({
      formType: 'Customer Care Contact Inquiry Form',
      name: name.trim(),
      email: email.trim() || 'No email provided',
      phone: phone.trim() || 'No phone provided',
      message: message.trim(),
      subject: `[Patowary Care] ${subject}: ${name.trim()}`,
      customFields: {
        'Customer Name': name.trim(),
        'Topic / Subject': subject,
        'Phone Number': phone.trim() || 'N/A',
        'Customer Email': email.trim() || 'N/A',
      },
    });

    if (result.success) {
      setSubmitted(true);
      playCinematicIntroSound("Your message has been sent to Patowary Fashion support desk.");
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else {
      setErrorMessage(result.error || 'Failed to dispatch inquiry. Please reach us via WhatsApp.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#111827] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold">
            PATOWARY CUSTOMER DESK
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0A1E54]">
            {t("How Can We Help You?", "আমরা কীভাবে আপনাকে সাহায্য করতে পারি?")}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            {t("Have questions about our drop sizes, fabric weights, or delivery tracking? Our dedicated team is available 6 days a week.", "সাইজ, ফেব্রিক বা ডেলিভারি সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।")}
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Cards: Contact channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Card */}
            <div className="bg-[#0A1E54] text-[#F8F3EA] rounded-3xl p-6 sm:p-8 border border-[#C9A66B]/30 space-y-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">Instant WhatsApp Care</h3>
                  <span className="text-[10px] font-mono tracking-wider text-[#C9A66B] uppercase">Fastest Response</span>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                Connect directly with our Dhaka styling and delivery team for quick sizing advice and order tracking.
              </p>

              <a
                href="https://wa.me/8801633701001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25D366] hover:bg-[#1ebd54] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <span>Chat on WhatsApp (+880 1633 701001)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Information Cards */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0A1E54]/10 shadow-sm space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0A1E54]/5 text-[#0A1E54] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Studio Location</h4>
                  <p className="text-sm font-bold text-[#0A1E54] mt-0.5">Dhaka, Bangladesh</p>
                  <p className="text-xs text-stone-500">Central Distribution Hub & Design Atelier</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0A1E54]/5 text-[#0A1E54] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Email Inquiries</h4>
                  <p className="text-sm font-bold text-[#0A1E54] mt-0.5">lord79915@gmail.com</p>
                  <p className="text-xs text-stone-500">Invoices, drops, and bulk styling requests</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0A1E54]/5 text-[#0A1E54] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Operating Hours</h4>
                  <p className="text-sm font-bold text-[#0A1E54] mt-0.5">Saturday – Thursday</p>
                  <p className="text-xs text-stone-500">10:00 AM – 10:00 PM (BST)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-2 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-[#0A1E54]/5 text-[#0A1E54] flex items-center justify-center shrink-0">
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">Facebook Community</h4>
                  <a
                    href="https://www.facebook.com/share/19JHtW2Eft/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-[#0A1E54] hover:text-[#C9A66B] transition-colors flex items-center gap-1 mt-0.5"
                  >
                    <span>Patowary Fashion Official Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0A1E54]/10 shadow-sm space-y-6">
              
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0A1E54]">
                  {t("Send Us a Message", "আমাদের একটি বার্তা পাঠান")}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Fill in your details below and our customer desk will respond within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-emerald-900">
                    {t("Inquiry Dispatched Successfully!", "আপনার বার্তা সফলভাবে পাঠানো হয়েছে!")}
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Thank you for contacting Patowary Fashion. A representative will get in touch with you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 rounded-full bg-[#0A1E54] text-white text-xs font-mono uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1 font-bold">
                        {t("Your Name", "আপনার নাম")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tanvir Patowary"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#0A1E54] focus:outline-none focus:border-[#0A1E54]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1 font-bold">
                        {t("Phone Number", "মোবাইল নম্বর")} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#0A1E54] focus:outline-none focus:border-[#0A1E54]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1 font-bold">
                        {t("Email Address", "ইমেইল")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#0A1E54] focus:outline-none focus:border-[#0A1E54]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1 font-bold">
                        {t("Subject / Reason", "বিষয়")}
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#0A1E54] focus:outline-none focus:border-[#0A1E54]"
                      >
                        <option value="Order Tracking">Order Delivery & Tracking</option>
                        <option value="Size & Sizing Guide">Size & Sizing Inquiries</option>
                        <option value="Return / Size Replacement">Return / Size Replacement</option>
                        <option value="Wholesale / Bulk Order">Wholesale / Bulk Order</option>
                        <option value="General Feedback">General Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1 font-bold">
                      {t("Message", "আপনার বার্তা")} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("Write your inquiry details here...", "এখানে আপনার বার্তা লিখুন...")}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#0A1E54] focus:outline-none focus:border-[#0A1E54] resize-none"
                    />
                  </div>

                  {/* Google reCAPTCHA Security Verification */}
                  <ReCaptcha
                    onVerify={(tok) => setRecaptchaToken(tok)}
                    onExpire={() => setRecaptchaToken(null)}
                    onError={() => setRecaptchaToken(null)}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{t("Dispatch Message", "বার্তা পাঠান")}</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
