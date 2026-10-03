import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Facebook, 
  CheckCircle, 
  AlertTriangle,
  Check,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';
import { sendFormViaEmailJS } from '../lib/emailjs';
import { updatePageSEO } from '../utils/seoUtils';
import { useLocation } from 'react-router-dom';
import { HumanVerificationModal, isUserHumanVerified, setHumanVerified } from '../components/HumanVerificationModal';

export const Auth: React.FC = () => {
  const { user, login, signup, loginWithGoogle, loginWithFacebook } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode state: 'login' | 'register'
  const isInitialRegister = location.pathname.includes('/register');
  const isInitialForgot = location.pathname.includes('/forgot-password');

  const [authMode, setAuthMode] = useState<'login' | 'register'>(isInitialRegister ? 'register' : 'login');
  const [slideDirection, setSlideDirection] = useState<number>(isInitialRegister ? 1 : -1);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(isInitialForgot);
  
  // One-time human verification modal for unauthenticated users
  const [showVerifyModal, setShowVerifyModal] = useState(() => !isUserHumanVerified());

  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Status handlers
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync mode when URL path changes (e.g. browser back/forward)
  useEffect(() => {
    if (location.pathname.includes('/register')) {
      setAuthMode('register');
      setIsForgotPasswordMode(false);
      updatePageSEO('Create Account | Patowary Fashion');
    } else if (location.pathname.includes('/forgot-password')) {
      setIsForgotPasswordMode(true);
      updatePageSEO('Reset Password | Patowary Fashion');
    } else {
      setAuthMode('login');
      setIsForgotPasswordMode(false);
      updatePageSEO('Sign In | Patowary Fashion');
    }
  }, [location.pathname]);

  // Password rules for registration
  const ruleMinLength = password.length >= 8;
  const ruleUppercase = /[A-Z]/.test(password);
  const ruleLowercase = /[a-z]/.test(password);
  const ruleDigit = /\d/.test(password);
  const ruleSpecial = /[^A-Za-z0-9]/.test(password);
  const rulesAllPassed = ruleMinLength && ruleUppercase && ruleLowercase && ruleDigit && ruleSpecial;

  const isForAdmin = new URLSearchParams(window.location.search).get('redirect') === '/admin';

  // If already logged in, redirect to requested redirect path or profile
  React.useEffect(() => {
    if (user) {
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/profile');
      }
    }
  }, [user, navigate]);

  const switchMode = (newMode: 'login' | 'register') => {
    if (newMode === authMode) return;
    setSlideDirection(newMode === 'register' ? 1 : -1);
    setAuthMode(newMode);
    setIsForgotPasswordMode(false);
    setErrorMsg(null);
    navigate(newMode === 'register' ? `/register${location.search}` : `/login${location.search}`);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg(t("Please enter a valid email address"));
      setLoading(false);
      return;
    }

    if (authMode === 'login') {
      if (password.length < 6) {
        setErrorMsg(t("Password must be at least 6 characters"));
        setLoading(false);
        return;
      }
      try {
        await login(email, password);
        playCinematicIntroSound("Login completed. Welcome to Patowary Fashion.");
        navigate('/profile');
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!displayName.trim()) {
        setErrorMsg(t("Please provide your full name"));
        setLoading(false);
        return;
      }

      if (!rulesAllPassed) {
        setErrorMsg(t("Please meet all password requirements"));
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg(t("Passwords do not match"));
        setLoading(false);
        return;
      }

      try {
        await signup(email, password, displayName);
        
        // Transmit customer registration details via EmailJS
        try {
          await sendFormViaEmailJS({
            formType: 'Customer Registration Form',
            name: displayName.trim(),
            email: email.trim(),
            message: 'New customer account registration submitted.',
            subject: `New Customer Registration: ${displayName.trim()}`,
            customFields: {
              'Full Name': displayName.trim(),
              'Registered Email': email.trim(),
              'Account Status': 'Customer Registered',
            },
          });
        } catch (mailErr) {
          console.error('[EmailJS] Registration email notification error:', mailErr);
        }

        playCinematicIntroSound("Registration recorded. Welcome to Patowary Fashion.");
        navigate('/profile');
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to create account. Please try again.");
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
      playCinematicIntroSound("Google authentication verified. Welcome to Patowary Fashion.");
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In failed or was cancelled.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignInClick = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithFacebook();
      playCinematicIntroSound("Facebook authentication verified. Welcome to Patowary Fashion.");
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err.message || 'Facebook Sign-In failed or was cancelled.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setLoading(true);
    setErrorMsg(null);

    // Transmit password reset request via EmailJS
    await sendFormViaEmailJS({
      formType: 'Password Recovery Request Form',
      email: forgotEmail.trim(),
      message: 'Customer requested a password recovery link.',
      subject: `Password Recovery Request: ${forgotEmail.trim()}`,
      customFields: {
        'Request Type': 'Password Recovery',
        'Customer Email': forgotEmail.trim(),
      },
    });

    setForgotSuccess(true);
    setLoading(false);
    playCinematicIntroSound("Password recovery link transmitted.");
  };

  // Swipe animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 160 : -160,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -160 : 160,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    })
  };

  // Forgot password view
  if (isForgotPasswordMode) {
    return (
      <div id="auth-portal-view" className="min-h-screen py-16 flex items-center justify-center font-sans px-4 bg-gradient-to-b from-[#F8F3EA] via-[#efe8da] to-[#F8F3EA] relative">
        <div className="max-w-md w-full glass-panel border border-white/80 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 text-left relative overflow-hidden backdrop-blur-xl bg-white/85">
          {/* Subtle gold decorative glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#0A1E54]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-md border-2 border-[#C9A66B]/60 bg-white p-1">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Patowary Fashion Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#0A1E54]">
              {t("Recover Password")}
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              {t("Enter your account email to receive reset instructions")}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex gap-2 items-center">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {forgotSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 relative z-10">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-[#0A1E54]">
                {t("Reset Link Sent!")}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                {t("We have sent password reset details to your inbox and notification system.")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(false);
                  setIsForgotPasswordMode(false);
                  setErrorMsg(null);
                }}
                className="w-full py-3 bg-[#0A1E54] hover:bg-[#1A3070] text-white font-mono text-xs tracking-wider font-bold rounded-xl uppercase transition-all cursor-pointer shadow-md"
              >
                {t("Return to Sign In")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono uppercase text-stone-600 font-bold tracking-wider">
                  {t("Registered Email Address")}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@patowary.com"
                    className="w-full bg-white/90 border border-stone-300 pl-10 pr-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#0A1E54] focus:ring-2 focus:ring-[#0A1E54]/10 transition-all font-sans"
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-3.5 text-stone-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99]"
              >
                <span>{loading ? t("Sending...") : t("Send Reset Link")}</span>
                <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordMode(false);
                  setErrorMsg(null);
                }}
                className="w-full text-center text-xs text-[#0A1E54] hover:underline font-semibold block pt-2 cursor-pointer"
              >
                &larr; {t("Back to Sign In")}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="auth-portal-view" className="min-h-screen py-12 sm:py-16 flex items-center justify-center font-sans text-left px-4 bg-gradient-to-b from-[#F8F3EA] via-[#efe8da] to-[#F8F3EA] relative">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#C9A66B]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#0A1E54]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="max-w-md w-full glass-panel border border-white/80 p-6 sm:p-9 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl bg-white/85">
        
        {/* Subtle decorative glass glow line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A1E54] via-[#C9A66B] to-[#0A1E54]" />

        {/* Brand identity header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-md border-2 border-[#C9A66B]/60 bg-white p-1">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Patowary Fashion Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0A1E54] tracking-tight">
            Patowary Fashion
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A1E54]/5 border border-[#0A1E54]/10">
            <Sparkles className="w-3 h-3 text-[#C9A66B]" />
            <span className="text-[10px] font-mono tracking-widest text-[#0A1E54] uppercase font-bold">
              {t("OFFICIAL CLIENT PORTAL")}
            </span>
          </div>
        </div>

        {/* Administrator Accreditation Notice if redirected from /admin */}
        {isForAdmin && (
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-300/80 rounded-2xl flex items-start gap-2.5 text-left shadow-xs">
            <Lock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-[11px] leading-tight text-amber-900 font-sans">
              <span className="font-bold block uppercase tracking-wider text-[10px] text-amber-800 mb-0.5">
                {t("Administrator Sign-In Required")}
              </span>
              <span>
                {t("To access the Central Store Admin Terminal (/admin), please log in with your authorized store administrator credentials.")}
              </span>
            </div>
          </div>
        )}

        {/* Swipe Toggle Segmented Slider */}
        <div className="relative bg-stone-100/90 p-1 rounded-2xl flex border border-stone-200/80 mb-6 shadow-inner">
          <motion.div
            className="absolute top-1 bottom-1 rounded-xl bg-[#0A1E54] shadow-md"
            initial={false}
            animate={{
              left: authMode === 'login' ? '4px' : '50%',
              right: authMode === 'login' ? '50%' : '4px',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />

          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`relative z-10 flex-1 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer text-center ${
              authMode === 'login' ? 'text-white' : 'text-stone-600 hover:text-[#0A1E54]'
            }`}
          >
            {t("SIGN IN")}
          </button>

          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`relative z-10 flex-1 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer text-center ${
              authMode === 'register' ? 'text-white' : 'text-stone-600 hover:text-[#0A1E54]'
            }`}
          >
            {t("REGISTER")}
          </button>
        </div>

        {/* Dynamic Error display */}
        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex gap-2 items-start font-medium leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Swipeable Animated Form Area */}
        <div className="relative overflow-hidden min-h-[300px]">
          <AnimatePresence mode="wait" custom={slideDirection}>
            {authMode === 'login' ? (
              <motion.div
                key="login-form"
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full space-y-4"
              >
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase text-stone-600 font-bold tracking-wider">
                      {t("Email Address")}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@patowary.com"
                        className="w-full bg-white border border-stone-300 pl-10 pr-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#0A1E54] focus:ring-2 focus:ring-[#0A1E54]/10 transition-all font-sans"
                      />
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-stone-400" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-mono uppercase text-stone-600 font-bold tracking-wider">
                        {t("Password")}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordMode(true)}
                        className="text-[11px] text-[#0A1E54] hover:underline font-semibold cursor-pointer"
                      >
                        {t("Forgot Password?")}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-stone-300 pl-10 pr-3 py-3 rounded-xl text-xs focus:outline-none focus:border-[#0A1E54] focus:ring-2 focus:ring-[#0A1E54]/10 transition-all font-sans"
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-stone-400" />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99] mt-2"
                  >
                    <span>{loading ? t("Authenticating...") : t("SIGN IN")}</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full space-y-4"
              >
                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase text-stone-600 font-bold tracking-wider">
                      {t("Full Name")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full bg-white border border-stone-300 pl-10 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0A1E54] focus:ring-2 focus:ring-[#0A1E54]/10 transition-all font-sans"
                      />
                      <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase text-stone-600 font-bold tracking-wider">
                      {t("Email Address")}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@patowary.com"
                        className="w-full bg-white border border-stone-300 pl-10 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0A1E54] focus:ring-2 focus:ring-[#0A1E54]/10 transition-all font-sans"
                      />
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase text-stone-600 font-bold tracking-wider">
                      {t("Password")}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-stone-300 pl-10 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0A1E54] focus:ring-2 focus:ring-[#0A1E54]/10 transition-all font-sans"
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono uppercase text-stone-600 font-bold tracking-wider">
                      {t("Confirm Password")}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-stone-300 pl-10 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#0A1E54] focus:ring-2 focus:ring-[#0A1E54]/10 transition-all font-sans"
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    </div>
                  </div>

                  {/* Password strength checklist */}
                  <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 space-y-1 text-[10px] font-mono">
                    <div className={`flex items-center gap-1.5 ${ruleMinLength ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {ruleMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${ruleUppercase && ruleLowercase ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {ruleUppercase && ruleLowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Uppercase & Lowercase letters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${ruleDigit && ruleSpecial ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {ruleDigit && ruleSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Number & Special character (!@#$)</span>
                    </div>
                  </div>

                  {/* Register Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0A1E54] hover:bg-[#1A3070] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99] mt-2"
                  >
                    <span>{loading ? t("Registering...") : t("CREATE ACCOUNT")}</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Social Authentication: Google & Facebook */}
        <div className="space-y-3 pt-4 border-t border-stone-200/80 mt-4">
          <div className="relative flex items-center justify-center">
            <span className="bg-white/90 px-3 text-[10px] text-stone-400 uppercase font-mono tracking-wider">
              {t("OR CONNECT WITH")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignInClick}
              disabled={loading}
              className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300/80 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="truncate">Google</span>
            </button>

            {/* Facebook Sign In */}
            <button
              type="button"
              onClick={handleFacebookSignInClick}
              disabled={loading}
              className="bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <Facebook className="w-4 h-4 fill-white text-[#1877F2] shrink-0" />
              <span className="truncate">Facebook</span>
            </button>
          </div>
        </div>

        {/* Bottom Switch Note */}
        <div className="pt-4 text-center text-xs text-stone-600">
          <span>{authMode === 'login' ? t("Don't have an account?") : t("Already have an account?")} </span>
          <button
            type="button"
            onClick={() => switchMode(authMode === 'login' ? 'register' : 'login')}
            className="text-[#0A1E54] font-bold hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
          >
            {authMode === 'login' ? t("Create one now") : t("Sign In here")}
          </button>
        </div>

        {/* Terms and Privacy policy note */}
        <div className="mt-3 text-center text-[10px] text-stone-500 font-sans leading-normal">
          <span>{t("By continuing, you agree to our")} </span>
          <Link to="/terms" className="text-[#0A1E54] font-semibold underline hover:text-[#C9A66B]">
            {t("Terms of Service")}
          </Link>
          <span> {t("and")} </span>
          <Link to="/privacy" className="text-[#0A1E54] font-semibold underline hover:text-[#C9A66B]">
            {t("Privacy Policy")}
          </Link>
        </div>

        {/* Security badge */}
        <div className="mt-3 pt-2.5 border-t border-stone-200/50 flex items-center justify-center gap-2 text-[10px] text-stone-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t("256-BIT ENCRYPTED FIREBASE AUTHENTICATION")}</span>
        </div>

      </div>

      {/* One-Time Human Verification Modal for Logged-Out Visitors */}
      <HumanVerificationModal
        isOpen={showVerifyModal && !user}
        onClose={() => setShowVerifyModal(false)}
        onVerified={() => {
          setShowVerifyModal(false);
          setAuthMode('register');
          navigate('/register');
          playCinematicIntroSound("Verification passed. Opening registration.");
        }}
      />
    </div>
  );
};
