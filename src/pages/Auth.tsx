import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Chrome, 
  Fingerprint, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

export const Auth: React.FC = () => {
  const { user, login, signup, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isLognMode, setIsLognMode] = useState(true);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  
  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Forgot password elements
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Status handlers
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password creation rules state checks
  const ruleMinLength = password.length >= 8;
  const ruleUppercase = /[A-Z]/.test(password);
  const ruleLowercase = /[a-z]/.test(password);
  const ruleDigit = /\d/.test(password);
  const ruleSpecial = /[^A-Za-z0-9]/.test(password);
  const rulesAllPassed = ruleMinLength && ruleUppercase && ruleLowercase && ruleDigit && ruleSpecial;

  // If already logged in, redirect home
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    // Initial email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg(t("INVALID SECURE EMAIL COORDINATES FORM / ইমেইল সঠিক নয়"));
      setLoading(false);
      return;
    }

    if (isLognMode) {
      if (password.length < 6) {
        setErrorMsg(t("SECURITY GATE MANDATES A MINIMUM 6-CHARACTER KEY / পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"));
        setLoading(false);
        return;
      }
      try {
        await login(email, password);
        playCinematicIntroSound("Login completed. Welcome back to the Kiyomi guild.");
        navigate('/profile');
      } catch (err: any) {
        setErrorMsg(err.message || "AUTHENTIC FAULT OCCURED DURING CREDENTIAL CHECKING");
      } finally {
        setLoading(false);
      }
    } else {
      // Signup Mode validation rules
      if (!displayName.trim()) {
        setErrorMsg(t("PLEASE SUPPLY A NOMINAL USERNAME SIGNATURE / নাম লিখুন"));
        setLoading(false);
        return;
      }

      if (!rulesAllPassed) {
        setErrorMsg(t("PASSWORD DOES NOT MEET ALL CRITERIA / পাসওয়ার্ডের সকল শর্তাবলী মেনে চলুন"));
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg(t("PASSWORDS DO NOT MATCH / পাসওয়ার্ড দুটি মেলেনি"));
        setLoading(false);
        return;
      }

      try {
        await signup(email, password, displayName);
        playCinematicIntroSound("Registration recorded. Welcome to the Kiyomi clothing guild.");
        navigate('/profile');
      } catch (err: any) {
        setErrorMsg(err.message || "AUTHENTIC FAULT OCCURED DURING CREDENTIAL CHECKING");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignInClick = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      playCinematicIntroSound("Google authentication verified. Welcome back client.");
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err.message || "GOOGLE GATE REJECTED CREDENTIALS");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setErrorMsg(t("PROVIDE A VALID REGISTERED EMAIL ADDRESS / সঠিক ইমেইল দিন"));
      setLoading(false);
      return;
    }

    // Standard secure mock link sending timeout state simulation
    setTimeout(() => {
      setForgotSuccess(true);
      setLoading(false);
      playCinematicIntroSound("Security recovery link transmitted successfully. Check your spam and inbox directory.");
    }, 1200);
  };

  // Render Forgot Password mode interface
  if (isForgotPasswordMode) {
    return (
      <div id="auth-portal-view" className="bg-[#E9FDFD] min-h-screen py-16 flex items-center justify-center font-sans selection:bg-[#003E2C] selection:text-white">
        <div className="max-w-md w-full mx-4 bg-white border border-[#6F7973]/30 p-8 rounded-2xl shadow-xl space-y-8 relative overflow-hidden">
          {/* Accent decoration ribbon using brand palette */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#003E2C]" />

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#E9FDFD] text-[#003E2C] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <RefreshCw className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h2 className="text-xl font-serif font-extrabold tracking-[0.1em] text-[#0C1E1F] uppercase">
              RECOVER PASSWORD
            </h2>
            <p className="text-[11px] text-[#6F7973] uppercase tracking-wider font-mono">
              পাসওয়ার্ড পুনরুদ্ধার করুন
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 text-xs text-rose-900 flex gap-2 items-start font-medium leading-relaxed shadow-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {forgotSuccess ? (
            <div className="bg-[#E9FDFD] border border-[#003E2C]/20 rounded-xl p-5 text-center space-y-4">
              <CheckCircle className="w-10 h-10 text-[#003E2C] mx-auto" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#0C1E1F] uppercase tracking-wide">
                  RECOVERY TICKET TRANSMITTED!
                </h4>
                <p className="text-[11px] text-[#6F7973] leading-relaxed">
                  আমরা আপনার রিসিভার ইমেইলে সুরক্ষিত পাসওয়ার্ড রিসেট লিংক প্রেরণ করেছি। দয়া করে আপনার স্প্যাম ও ইনবক্স ফোল্ডার গুলো চেক করুন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(false);
                  setIsForgotPasswordMode(false);
                  setErrorMsg(null);
                }}
                className="w-full py-2.5 bg-[#003E2C] text-white font-mono text-[10px] tracking-widest font-extrabold rounded-lg uppercase hover:bg-[#CBF23D] hover:text-[#0C1E1F] transition-all cursor-pointer"
              >
                RETURN TO SIGN IN
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[9px] font-mono uppercase tracking-widest text-[#6F7973] font-bold">
                  {t("REGISTERED EMAIL ADDRESS / ইমেইল ঠিকানা")}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="E.G. USER@HOST.COM"
                    className="w-full bg-[#E9FDFD]/30 border border-[#6F7973]/30 pl-9 pr-3 py-3 rounded-lg text-xs focus:outline-none focus:border-[#003E2C] hover:border-[#6F7973]/50 transition-colors font-mono uppercase tracking-wider"
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-3.5 text-[#6F7973]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003E2C] text-white hover:bg-[#CBF23D] hover:text-[#0C1E1F] text-xs font-mono tracking-widest font-extrabold uppercase py-3.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-98 transition-all"
              >
                {loading ? "TRANSMITTING..." : "SEND RESET CODE"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordMode(false);
                  setErrorMsg(null);
                }}
                className="w-full py-2 text-center text-xs text-[#003E2C] hover:underline font-mono uppercase font-bold tracking-widest block"
              >
                &larr; {t("BACK TO SIGN IN / ফিরে যান")}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="auth-portal-view" className="bg-[#E9FDFD] min-h-screen py-16 flex items-center justify-center font-sans selection:bg-[#003E2C] selection:text-white">
      <div className="max-w-md w-full mx-4 bg-white border border-[#6F7973]/30 p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Visual colored top accent bar from the requested palette */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#003E2C]" />

        {/* Brand identity header */}
        <div className="text-center space-y-2">
          <Fingerprint className="w-10 h-10 text-[#003E2C] mx-auto animate-pulse" />
          <h2 className="text-xl font-serif font-extrabold tracking-[0.1em] text-[#0C1E1F] uppercase leading-none">
            {isLognMode ? "GUILD ACCESS" : "SIGN UP MEMBERSHIP"}
          </h2>
          <span className="text-[10px] bg-[#CBF23D] text-[#0C1E1F] py-1 px-3 text-[9px] font-mono tracking-widest font-bold uppercase rounded-full inline-block mt-1">
            {isLognMode ? "Secure Authentication Access" : "Create Private Digital Vault Code"}
          </span>
        </div>

        {/* Dynamic Error display */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 text-xs text-rose-900 flex gap-2 items-start font-medium leading-relaxed">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* For Sign-up: Display Username input field */}
          {!isLognMode && (
            <div className="space-y-1">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-[#6F7973] font-extrabold">
                {t("NOMINAL PROFILE NAME / আপনার নাম")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="E.G. MAHAFUZUR RAHAMAN"
                  className="w-full bg-[#E9FDFD]/30 border border-[#6F7973]/30 pl-9 pr-3 py-3 rounded-lg text-xs focus:outline-none focus:border-[#003E2C] hover:border-[#6F7973]/50 transition-colors font-mono uppercase tracking-wider"
                />
                <User className="w-4 h-4 absolute left-3 top-3.5 text-[#6F7973]" />
              </div>
            </div>
          )}

          {/* Email coordinate input */}
          <div className="space-y-1">
            <label className="block text-[9px] font-mono uppercase tracking-widest text-[#6F7973] font-extrabold">
              {t("EMAIL COORDINATE / ইমেইল ঠিকানা")}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E.G. USER@KIYOMI.COM"
                className="w-full bg-[#E9FDFD]/30 border border-[#6F7973]/30 pl-9 pr-3 py-3 rounded-lg text-xs focus:outline-none focus:border-[#003E2C] hover:border-[#6F7973]/50 transition-colors font-mono uppercase tracking-wider"
              />
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-[#6F7973]" />
            </div>
          </div>

          {/* Password secure block input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-[#6F7973] font-extrabold">
                {t("SECURE ACCESS PASSWORD / পাসওয়ার্ড")}
              </label>
              {isLognMode && (
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordMode(true)}
                  className="text-[9px] text-[#003E2C] hover:underline font-mono font-bold tracking-widest uppercase cursor-pointer"
                >
                  {t("Forgot Password? / পাসওয়ার্ড ভুলে গেছেন?")}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full bg-[#E9FDFD]/30 border border-[#6F7973]/30 pl-9 pr-3 py-3 rounded-lg text-xs focus:outline-none focus:border-[#003E2C] hover:border-[#6F7973]/50 transition-colors font-mono tracking-widest text-lg"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#6F7973]" />
            </div>
          </div>

          {/* If REGISTERING: Confirm Password block input + PASSWORD RULES LIST */}
          {!isLognMode && (
            <>
              <div className="space-y-1">
                <label className="block text-[9px] font-mono uppercase tracking-widest text-[#6F7973] font-bold">
                  {t("CONFIRM PASSWORD / পাসওয়ার্ড নিশ্চিত করুন")}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="******"
                    className="w-full bg-[#E9FDFD]/30 border border-[#6F7973]/30 pl-9 pr-3 py-3 rounded-lg text-xs focus:outline-none focus:border-[#003E2C] hover:border-[#6F7973]/50 transition-colors font-mono tracking-widest text-lg"
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#6F7973]" />
                </div>
              </div>

              {/* Password strength checklist block - visually designed to look extremely premium */}
              <div className="p-3 bg-[#E9FDFD]/50 border border-[#6F7973]/15 rounded-lg space-y-1.5 font-mono text-[9px] text-stone-700">
                <span className="block text-[8px] text-[#003E2C] uppercase tracking-widest font-extrabold mb-1">
                  🔑 {t("SYSTEM RULES TO REGISTER / পাসওয়ার্ডের নিয়মাবলী:")}
                </span>
                
                <div className="flex items-center gap-1.5">
                  {ruleMinLength ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                  )}
                  <span className={ruleMinLength ? "text-emerald-700" : "text-stone-550"}>
                    {t("Must be at least 8 characters / অন্তত ৮ অক্ষর")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {ruleUppercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                  )}
                  <span className={ruleUppercase ? "text-emerald-700" : "text-stone-550"}>
                    {t("At least one Uppercase letter / অন্তত ১টি বড় হাতের অক্ষর A-Z")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {ruleLowercase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                  )}
                  <span className={ruleLowercase ? "text-emerald-700" : "text-stone-550"}>
                    {t("At least one Lowercase letter / অন্তত ১টি ছোট হাতের অক্ষর a-z")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {ruleDigit ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                  )}
                  <span className={ruleDigit ? "text-emerald-700" : "text-stone-550"}>
                    {t("At least one Numeric digit / অন্তত ১টি সংখ্যা 0-9")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {ruleSpecial ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                  )}
                  <span className={ruleSpecial ? "text-emerald-700" : "text-stone-550"}>
                    {t("At least one Special character / অন্তত ১টি বিশেষ চিহ্ন; e.g. @, #, $, %")}
                  </span>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003E2C] hover:bg-[#CBF23D] hover:text-[#0C1E1F] text-[#FFFFFF] text-xs font-mono tracking-[0.15em] font-extrabold uppercase py-3.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
          >
            {loading ? "AUTHENTICATING..." : isLognMode ? t("SIGN IN / প্রবেশ করুন") : t("CREATE DISPATCH KEY / রেজিস্ট্রেশন করুন")} 
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-3 text-stone-400 font-mono text-[8px] tracking-widest uppercase">OR CONNECT WITH</span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        {/* Google Authentication quick bypass */}
        <button
          onClick={handleGoogleSignInClick}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-sans text-sm py-3 px-4 rounded-md flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <Chrome className="w-5 h-5 text-slate-600" />
          <span className="font-medium">Sign in with Google</span>
        </button>

        {/* Switch forms mode block */}
        <div className="text-center pt-2 border-t border-stone-100">
          <button
            onClick={() => {
              setIsLognMode(!isLognMode);
              setErrorMsg(null);
            }}
            className="text-xs font-serif text-[#003E2C] hover:text-[#0C1E1F] underline font-bold focus:outline-none cursor-pointer"
          >
            {isLognMode ? t("New Customer? Create your account / নতুন অ্যাকাউন্ট খুলুন") : t("Already registered? Sign in / লগইন করুন")}
          </button>
        </div>

        <div className="text-center">
          <span className="text-[8px] font-mono text-[#6F7973] flex items-center justify-center gap-1 uppercase select-none">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-bounce" /> Account synced securely with server-side gateway.
          </span>
        </div>

      </div>
    </div>
  );
};
