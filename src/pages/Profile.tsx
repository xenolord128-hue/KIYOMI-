import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Lock, 
  LogOut, 
  ClipboardList, 
  Truck, 
  MapPin, 
  Save, 
  Phone,
  Camera,
  CheckCircle,
  Sliders,
  ChevronRight,
  Award
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';
import { sendFormViaEmailJS } from '../lib/emailjs';

const sparkles = [
  { width: 2, deg: 25, duration: 11 },
  { width: 1, deg: 100, duration: 18 },
  { width: 1, deg: 280, duration: 5 },
  { width: 2, deg: 200, duration: 3 },
  { width: 2, deg: 30, duration: 20 },
  { width: 2, deg: 300, duration: 9 },
  { width: 1, deg: 250, duration: 4 },
  { width: 2, deg: 210, duration: 8 },
  { width: 2, deg: 100, duration: 9 },
  { width: 1, deg: 15, duration: 13 },
  { width: 1, deg: 75, duration: 18 },
  { width: 2, deg: 65, duration: 6 },
];

export const Profile: React.FC = () => {
  const { user, isAdmin, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { locale, toggleLanguage, t } = useLanguage();

  // Active Profile Section tab selection
  const [activeTab, setActiveTab] = useState<'history' | 'settings' | 'autofill'>('history');

  // Billing autofill form states
  const [autofillName, setAutofillName] = useState('');
  const [autofillPhone, setAutofillPhone] = useState('');
  const [autofillAddress, setAutofillAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings / Account Change states
  const [editName, setEditName] = useState(user?.displayName || '');
  const [editPhoto, setEditPhoto] = useState(user?.photoURL || '');
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [pastOrders, setPastOrders] = useState<any[]>([]);

  // Load user data on hook trigger
  useEffect(() => {
    if (user) {
      setEditName(user.displayName || '');
      setEditPhoto(user.photoURL || '');
      
      // Load saved autofill profile details
      const autofillStr = localStorage.getItem('patowary_profile_autofill');
      if (autofillStr) {
        try {
          const data = JSON.parse(autofillStr);
          setAutofillName(data.fullName || '');
          setAutofillPhone(data.phoneNumber || '');
          setAutofillAddress(data.shippingAddress || '');
        } catch (e) {}
      }
    }
  }, [user]);

  // Load Past Orders
  useEffect(() => {
    const storedInvoices = localStorage.getItem('patowary_local_orders');
    if (storedInvoices) {
      try {
        setPastOrders(JSON.parse(storedInvoices));
      } catch (err) {}
    }
  }, []);

  const handleSignOutClick = () => {
    logout();
    playCinematicIntroSound("Session terminated. Thank you for visiting Patowary Fashion.");
    navigate('/');
  };

  // Convert File Input upload metadata to dataURL string safely
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(locale === 'bn' ? "২ মেগাবাইটের কম সাইজের ছবি দিন" : "Please upload an image smaller than 2MB");
      return;
    }

    setLoadingUpload(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditPhoto(reader.result as string);
      setLoadingUpload(false);
      playCinematicIntroSound("Profile image imported successfully.");
    };
    reader.readAsDataURL(file);
  };

  // Save Settings Tab
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      await updateProfile(editName.trim(), editPhoto);

      // Transmit profile settings update via EmailJS
      try {
        await sendFormViaEmailJS({
          formType: 'Profile Settings Update Form',
          name: editName.trim(),
          email: user?.email || '',
          message: 'Customer updated their client profile display name/photo.',
          subject: `Profile Updated: ${editName.trim()}`,
          customFields: {
            'Display Name': editName.trim(),
            'Account Email': user?.email || 'Not provided',
          },
        });
      } catch (err) {
        console.error('[EmailJS] Profile settings email notification failed:', err);
      }

      setSettingsSuccess(true);
      playCinematicIntroSound("Profile update synced successfully.");
      setTimeout(() => setSettingsSuccess(false), 2500);
    } catch (err) {
      alert("Error saving settings");
    }
  };

  // Save Autofill Data
  const handleSaveAutofill = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fullName: autofillName.trim(),
      phoneNumber: autofillPhone.trim(),
      shippingAddress: autofillAddress.trim()
    };
    localStorage.setItem('patowary_profile_autofill', JSON.stringify(payload));

    // Transmit shipping autofill profile via EmailJS
    try {
      await sendFormViaEmailJS({
        formType: 'Shipping Autofill Profile Form',
        name: autofillName.trim(),
        phone: autofillPhone.trim(),
        address: autofillAddress.trim(),
        deliveryAddress: autofillAddress.trim(),
        email: user?.email || '',
        subject: `Shipping Profile Saved: ${autofillName.trim()}`,
        customFields: {
          'Full Name': autofillName.trim(),
          'Mobile Line': autofillPhone.trim(),
          'Delivery Warehouse Address': autofillAddress.trim(),
          'Account Email': user?.email || 'Not provided',
        },
      });
    } catch (err) {
      console.error('[EmailJS] Shipping autofill email notification failed:', err);
    }

    setSaveSuccess(true);
    playCinematicIntroSound("Autofill parameters updated successfully.");
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Render guest mode cover layout if unauthorized
  if (!user) {
    return (
      <div id="unauthorized-profile-stage" className="bg-[#F8F3EA] min-h-screen py-20 flex items-center justify-center font-sans text-left">
        <div className="max-w-md w-full mx-4 glass-panel border border-white p-8 text-center space-y-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-md border-2 border-[#C9A66B]/50 bg-white p-0.5">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Patowary Fashion Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-serif font-bold tracking-wide text-[#0A1E54] uppercase">CLIENT PORTAL: GUEST</h1>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              {t("Please sign in with your credentials or register a new client account.", "পাসওয়ার্ড দিয়ে অ্যাকাউন্টে লগইন করুন অথবা নতুন রেজিস্ট্রেশন সম্পন্ন করুন।")}
            </p>
          </div>
          <div className="pt-2">
            <Link 
              to="/auth"
              className="block w-full text-center py-3.5 bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] rounded-xl font-mono text-xs tracking-wider uppercase font-bold shadow-md transition-all active:scale-98"
            >
              {t("Sign In / Register Now", "সাইন ইন / রেজিস্ট্রেশন করুন")}
            </Link>
          </div>
          <Link to="/" className="inline-block text-xs font-mono tracking-wider text-[#0A1E54] hover:underline uppercase font-bold">
            &larr; {t("Head Back Home", "হোম পেজে ফিরুন")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-page-stage" className="bg-[#F8F3EA] min-h-screen py-8 md:py-16 font-sans text-left relative overflow-hidden">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10 relative z-10">
        
        {/* VIP CLIENT CARD */}
        <div className="bg-[#0A1E54] border border-[#1A3070] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          
          {/* Decorative Gold ribbon at the top of card */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0A1E54] via-[#C9A66B] to-[#1A3070]" />
          
          <div className="absolute top-6 right-6 hidden md:block text-[9px] font-mono tracking-[0.3em] text-[#C9A66B]/60 select-none uppercase pointer-events-none">
            [ PATOWARY FASHION SECURE ID: #{user.email?.slice(0, 4)}-A ]
          </div>

          {/* USER IDENTITY BRAND CARD */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 pb-8 border-b border-white/10 relative z-10">
            
            {/* Circle Avatar with custom glowing aura */}
            <div className="relative shrink-0 group">
              <div className="relative bg-[#1A3070] rounded-2xl p-1 border-2 border-[#C9A66B]/60 shadow-xl">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Member Avatar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-stone-900 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#C9A66B] text-[#0A1E54] p-1.5 rounded-xl shadow-lg border border-[#0A1E54]">
                <Award className="w-4 h-4 text-[#0A1E54]" />
              </div>
            </div>
 
            {/* User credentials */}
            <div className="space-y-3 flex-grow mt-2 sm:mt-0">
              <div className="space-y-1.5">
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="text-[9px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold bg-[#C9A66B]/15 py-1 px-3.5 rounded-full border border-[#C9A66B]/30 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#C9A66B] rounded-full animate-pulse" />
                    PATOWARY FASHION MEMBER
                  </span>
                  {isAdmin && (
                    <span className="text-[9px] font-mono tracking-widest text-emerald-300 uppercase font-bold bg-emerald-500/15 py-1 px-3 rounded-full border border-emerald-500/30 inline-flex items-center gap-1">
                      <Lock className="w-3 h-3" /> ROOT ADMIN
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase tracking-tight">
                  {user.displayName || 'Patowary Member'}
                </h1>
              </div>

              {/* Verified Badge & Email Metadata block */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-xs font-mono text-white/70">
                <div className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded-lg border border-white/10">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider">VERIFIED PASSPORT</span>
                </div>
                <span className="text-white/20 hidden sm:inline">&bull;</span>
                <span className="lowercase font-bold text-[#C9A66B] truncate max-w-[200px] sm:max-w-none inline-block">
                  {user.email}
                </span>
                <span className="text-white/20 hidden sm:inline">&bull;</span>
                <span className="font-mono text-white/50 text-[10px]">
                  ID: <span className="text-white">#{user.uid?.slice(0, 8).toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Logout interactive trigger */}
            <div className="shrink-0 pt-1 w-full sm:w-auto">
              <button 
                onClick={handleSignOutClick}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-500/20 font-mono text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4" /> {t("SECURE LOGOUT", "লগআউট")}
              </button>
            </div>
          </div>

          {/* VIP SWITCHBOARD CONTROL */}
          <div className="pt-6 mt-6 border-t border-white/10 relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.04] border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono tracking-wider text-[#C9A66B] uppercase font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A66B] animate-pulse inline-block" />
                {t("SECURE PROTOCOL", "ড্যাশবোর্ড মেনু")}
              </span>
              
              <div className="flex flex-wrap gap-2.5 justify-center">
                <button
                  onClick={() => {
                    setActiveTab('history');
                    playCinematicIntroSound("Order list loaded.");
                  }}
                  className={`py-2 px-4 rounded-xl font-mono text-xs tracking-wider font-bold uppercase transition-all select-none cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    activeTab === 'history'
                      ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md font-bold'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>INVOICES ({pastOrders.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    playCinematicIntroSound("Account details settings toggled.");
                  }}
                  className={`py-2 px-4 rounded-xl font-mono text-xs tracking-wider font-bold uppercase transition-all select-none cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    activeTab === 'settings'
                      ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md font-bold'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>SETUP</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('autofill');
                    playCinematicIntroSound("Shipping address loaded.");
                  }}
                  className={`py-2 px-4 rounded-xl font-mono text-xs tracking-wider font-bold uppercase transition-all select-none cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    activeTab === 'autofill'
                      ? 'bg-[#C9A66B] text-[#0A1E54] shadow-md font-bold'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>AUTOFILL</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* CONTAINER SHEETS FOR TABS */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: SHIPPING HISTORY & TRACKING */}
            {activeTab === 'history' && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel border border-white rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-left"
              >
                <div className="flex items-center gap-3 border-b border-stone-200 pb-5">
                  <div className="p-2.5 bg-[#0A1E54]/10 rounded-xl text-[#0A1E54]">
                    <ClipboardList className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[9px] bg-[#0A1E54]/10 text-[#0A1E54] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">HISTORY MODULE</span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#0A1E54] mt-0.5">
                      {t("SHIPPING INVOICE RECORDS / আপনার অর্ডারের তালিকা")} ({pastOrders.length})
                    </h3>
                  </div>
                </div>

                {pastOrders.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-stone-100 text-[#0A1E54] rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Truck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-mono tracking-wider uppercase text-[#0A1E54] font-bold">
                        {t("No shipment history recorded", "কোনো অর্ডার হিস্ট্রি পাওয়া যায়নি")}
                      </h4>
                      <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed">
                        {t("Explore our modern streetwear catalog to place your first order and begin live tracking.", "আমাদের ট্রেন্ডিং স্ট্রিটওয়্যার ঘুরে প্রথম অর্ডার সম্পন্ন করুন।")}
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link 
                        to="/products"
                        className="inline-block px-8 py-3.5 bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono tracking-wider uppercase font-bold rounded-xl transition-all shadow-sm"
                      >
                        {t("Explore Catalog", "ক্যাটালগ দেখুন")}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastOrders.map((order) => (
                      <div 
                        key={order.id} 
                        onClick={() => navigate(`/track-order?id=${order.id}`)}
                        className="border border-stone-200 bg-white hover:border-[#0A1E54] rounded-2xl p-5 sm:p-6 transition-all cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md group relative overflow-hidden"
                      >
                        <div className="space-y-2 font-mono">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-[#C9A66B]/20 text-[#0A1E54] font-bold px-3 py-1 rounded-lg uppercase leading-none border border-[#C9A66B]/40">
                              BDT {order.totalPrice}
                            </span>
                            <span className="text-[10px] bg-[#0A1E54] text-white font-bold px-3 py-1 rounded-lg leading-none uppercase">
                              #{order.id}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-stone-600">
                            <MapPin className="w-4 h-4 text-[#0A1E54] shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-md font-semibold text-stone-800">{order.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="text-right">
                            <span className="block text-[8px] text-stone-400 font-mono uppercase font-bold tracking-wider mb-0.5">STATUS</span>
                            <span className="text-xs font-bold font-mono text-[#0A1E54] uppercase bg-stone-100 px-3 py-1 rounded-lg inline-block">
                              {order.status || 'Received'}
                            </span>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-[#0A1E54] group-hover:bg-[#0A1E54] group-hover:text-white transition-all shrink-0">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: PROFILE PHOTO & NAME SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel border border-white rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-left"
              >
                <div className="flex items-center gap-3 border-b border-stone-200 pb-5">
                  <div className="p-2.5 bg-[#0A1E54]/10 rounded-xl text-[#0A1E54]">
                    <Sliders className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[9px] bg-[#0A1E54]/10 text-[#0A1E54] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">ACCOUNT MANAGEMENT</span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#0A1E54] mt-0.5">
                      {t("UPDATE IDENTIFICATION GATEWAY / নাম ও প্রোফাইল ছবি পরিবর্তন")}
                    </h3>
                  </div>
                </div>

                {settingsSuccess && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-xs text-emerald-900 font-mono tracking-wider flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                    <strong>{t("Your profile updates were saved successfully!", "প্রোফাইল তথ্য সফলভাবে সেভ হয়েছে!")}</strong>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl">
                  
                  {/* File Profile Upload box with camera overlay */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold">
                      {t("PROFILE PICTURE UPLOAD / নতুন প্রোফাইল ছবি")}
                    </label>
                    
                    <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap bg-white p-4 rounded-2xl border border-stone-200">
                      <div className="relative group select-none shrink-0">
                        <img 
                          src={editPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                          alt="Previsual" 
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#0A1E54] object-cover bg-white"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="space-y-2 flex-grow">
                        {loadingUpload ? (
                          <span className="block text-xs font-mono text-[#0A1E54] animate-pulse">PROCESSING IMAGE...</span>
                        ) : (
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-xs font-mono file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-mono file:font-bold file:uppercase file:bg-[#0A1E54] file:text-white hover:file:bg-[#1A3070] file:cursor-pointer file:transition-all"
                          />
                        )}
                        <p className="text-[10px] text-stone-500 uppercase leading-relaxed font-mono">
                          PNG or JPEG images supported. Maximum size 2MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Editable Name fields */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold">
                      {t("FULL NAME / আপনার নাম")}
                    </label>
                    <input 
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="ENTER FULL REAL NAME"
                      className="w-full bg-white border border-stone-300 focus:border-[#0A1E54] py-3.5 px-4 rounded-xl text-xs focus:outline-none font-mono uppercase text-stone-900 tracking-wider transition-all"
                    />
                  </div>

                  {/* LANGUAGE TRANSLATION OPTION */}
                  <div className="pt-4 border-t border-stone-200 space-y-3">
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#0A1E54] font-bold">
                      {t("🌐 SYSTEM LANGUAGE / সাইটের ভাষা পরিবর্তন")}
                    </label>
                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      {t("Switch between English and Bengali across the entire store.", "ইংরেজি এবং বাংলার মধ্যে যেকোনো ভাষা বেছে নিন।")}
                    </p>
                    
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (locale !== 'en') toggleLanguage();
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                          locale === 'en' 
                            ? 'bg-[#0A1E54] text-white shadow-xs' 
                            : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (locale !== 'bn') toggleLanguage();
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                          locale === 'bn' 
                            ? 'bg-[#0A1E54] text-white shadow-xs' 
                            : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        🇧🇩 বাংলা
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#0A1E54] hover:bg-[#1A3070] text-white font-mono text-xs tracking-wider font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save className="w-4 h-4 text-[#C9A66B]" /> {t("SAVE PROFILE INFO", "প্রোফাইল সেভ করুন")}
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 3: AUTOFILL PARAMETER SETTINGS */}
            {activeTab === 'autofill' && (
              <motion.div
                key="autofill-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel border border-white rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-left"
              >
                <div className="flex items-center gap-3 border-b border-stone-200 pb-5">
                  <div className="p-2.5 bg-[#0A1E54]/10 rounded-xl text-[#0A1E54]">
                    <MapPin className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[9px] bg-[#0A1E54]/10 text-[#0A1E54] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">1-CLICK CHECKOUT</span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#0A1E54] mt-0.5">
                      {t("AUTOFILL CHECKOUT CREDENTIALS / অটোফিল চেকআউট ডাটা")}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {locale === 'bn' 
                    ? "এখানে আপনার শিপিং ও ডেলিভারি তথ্যগুলো আগে থেকেই সেভ করে রাখুন। এর ফলে অর্ডার করার সময় আপনার নাম, মোবাইল ও ঠিকানা স্বয়ংক্রিয়ভাবে ফিল হয়ে যাবে।"
                    : "Save your default shipping credentials in advance. This ensures your name, phone number, and address are automatically populated during checkout."
                  }
                </p>

                {saveSuccess && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-xs text-emerald-900 font-mono tracking-wider flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                    <strong>{t("Autofill parameters saved successfully!", "অটোফিল তথ্য সফলভাবে সেভ হয়েছে!")}</strong>
                  </div>
                )}

                <form onSubmit={handleSaveAutofill} className="space-y-5 max-w-xl">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold">
                        {t("CONSIGNEE FULL NAME / যোগাযোগের নাম")}
                      </label>
                      <input 
                        type="text"
                        required
                        value={autofillName}
                        onChange={(e) => setAutofillName(e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full bg-white border border-stone-300 focus:border-[#0A1E54] py-3.5 px-4 rounded-xl text-xs focus:outline-none font-mono uppercase tracking-wider transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold">
                        {t("ACTIVE MOBILE NUMBER / মোবাইল নাম্বার")}
                      </label>
                      <div className="relative">
                        <input 
                          type="tel"
                          required
                          value={autofillPhone}
                          onChange={(e) => setAutofillPhone(e.target.value)}
                          placeholder="e.g. 017XXXXXXXX"
                          className="w-full bg-white border border-stone-300 focus:border-[#0A1E54] pl-10 pr-4 py-3.5 rounded-xl text-xs focus:outline-none font-mono tracking-wider transition-all"
                        />
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold">
                      {t("DOORSTEP DELIVERY ADDRESS / ডেলিভারি ঠিকানা")}
                    </label>
                    <textarea 
                      required
                      rows={3}
                      value={autofillAddress}
                      onChange={(e) => setAutofillAddress(e.target.value)}
                      placeholder="House, Road, Area, Thana, District"
                      className="w-full bg-white border border-stone-300 focus:border-[#0A1E54] p-4 rounded-xl text-xs focus:outline-none font-sans text-stone-900 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#0A1E54] hover:bg-[#1A3070] text-white font-mono text-xs tracking-wider font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save className="w-4 h-4 text-[#C9A66B]" /> {t("COMMIT AUTOFILL DATA", "অটোফিল ডাটা সেভ করুন")}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM REDIRECT TO BRAND PORTFOLIO */}
        <div className="bg-[#0A1E54] text-white p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left relative overflow-hidden shadow-xl border border-[#1A3070]">
          <div className="space-y-2 z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A66B] uppercase font-bold block">
              PATOWARY FASHION MANIFESTO
            </span>
            <h4 className="text-base sm:text-lg font-serif font-bold text-white uppercase">
              Explore Our Brand Heritage &amp; Craftsmanship
            </h4>
            <p className="text-xs text-white/80 max-w-xl leading-relaxed">
              {t("Learn about our design ethos, heavyweight fabrication, and tailoring philosophy.", "আমাদের ব্র্যান্ড দর্শন, ফেব্রিক কোয়ালিটি ও ডিজাইন দর্শন সম্পর্কে বিস্তারিত জানুন।")}
            </p>
          </div>

          <Link
            to="/brand"
            className="px-6 py-3.5 bg-[#C9A66B] hover:bg-[#d6b47c] text-[#0A1E54] font-mono text-xs tracking-wider font-bold uppercase rounded-xl transition-all shrink-0 z-10 shadow-md"
          >
            {t("DISCOVER PORTFOLIO", "ব্র্যান্ড পরিচিতি")} &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};
