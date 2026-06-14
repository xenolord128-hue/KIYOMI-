import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  User, 
  Lock, 
  LogOut, 
  ClipboardList, 
  Truck, 
  MapPin, 
  Save, 
  Upload, 
  ShoppingBag, 
  Heart,
  UserCheck,
  Settings,
  Phone,
  Camera,
  CheckCircle,
  FileText,
  Home,
  Sliders,
  ChevronRight,
  Sparkles,
  Compass,
  Award,
  Cpu
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { motion, AnimatePresence } from 'motion/react';

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
  { width: 2, deg: 50, duration: 7 },
  { width: 1, deg: 320, duration: 5 },
  { width: 1, deg: 220, duration: 5 },
  { width: 1, deg: 215, duration: 2 },
  { width: 2, deg: 135, duration: 9 },
  { width: 2, deg: 45, duration: 4 },
  { width: 1, deg: 78, duration: 16 },
  { width: 1, deg: 89, duration: 19 },
  { width: 2, deg: 65, duration: 14 },
  { width: 2, deg: 97, duration: 1 },
  { width: 1, deg: 174, duration: 10 },
  { width: 1, deg: 236, duration: 5 },
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
      const autofillStr = localStorage.getItem('KIYOMI_profile_autofill') || localStorage.getItem('dorax_profile_autofill');
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
    const storedInvoices = localStorage.getItem('KIYOMI_local_orders') || localStorage.getItem('dorax_local_orders');
    if (storedInvoices) {
      try {
        setPastOrders(JSON.parse(storedInvoices));
      } catch (err) {}
    }
  }, []);

  const handleSignOutClick = () => {
    logout();
    playCinematicIntroSound("Session terminated. Thank you for visiting Kiyomi clothing guild.");
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
      playCinematicIntroSound("Profile image imported successfully. Preserves on save tab.");
    };
    reader.readAsDataURL(file);
  };

  // Save Settings Tab
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      await updateProfile(editName.trim(), editPhoto);
      setSettingsSuccess(true);
      playCinematicIntroSound("Profile update synced successfully.");
      setTimeout(() => setSettingsSuccess(false), 2500);
    } catch (err) {
      alert("Error saving settings");
    }
  };

  // Save Autofill Data
  const handleSaveAutofill = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fullName: autofillName.trim(),
      phoneNumber: autofillPhone.trim(),
      shippingAddress: autofillAddress.trim()
    };
    localStorage.setItem('KIYOMI_profile_autofill', JSON.stringify(payload));
    setSaveSuccess(true);
    playCinematicIntroSound("Autofill parameters updated inside your local digital cookie container.");
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Render guest mode cover layout if unauthorized
  if (!user) {
    return (
      <div id="unauthorized-profile-stage" className="bg-[#E9FDFD] min-h-screen py-20 flex items-center justify-center font-sans selection:bg-[#003E2C] selection:text-white">
        <div className="max-w-md w-full mx-4 bg-white border border-[#6F7973]/30 p-8 text-center space-y-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#003E2C]" />
          
          <div className="w-16 h-16 rounded-full bg-[#E9FDFD] flex items-center justify-center text-[#003E2C] mx-auto shadow-sm">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-serif font-extrabold tracking-widest text-[#0C1E1F] uppercase">PORTAL STATE: GUEST</h1>
            <p className="text-xs text-[#6F7973] font-mono leading-relaxed uppercase">
              পাসওয়ার্ড সুরক্ষিত ক্রেডিয়েনসিয়াল দিয়ে অ্যাকাউন্টে লগইন করুন অথবা নতুন মেম্বারশিপ রেজিস্ট্রেশন শুরু করুন।
            </p>
          </div>
          <div className="pt-2">
            <Link 
              to="/auth"
              className="block w-full text-center py-3.5 bg-[#003E2C] hover:bg-[#CBF23D] hover:text-[#0C1E1F] text-white rounded-xl font-mono text-xs tracking-widest uppercase font-extrabold shadow-md transition-all active:scale-98"
            >
              SIGN IN / REGISTER NOW
            </Link>
          </div>
          <Link to="/" className="inline-block text-xs font-mono tracking-widest text-[#003E2C] hover:underline uppercase font-extrabold">
            &larr; Head Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-page-stage" className="bg-[#E9FDFD] bg-gradient-to-b from-[#e5fcfc] via-[#f1fefd] to-[#fafefd] min-h-screen py-8 md:py-20 font-sans selection:bg-[#003E2C] selection:text-[#CBF23D] relative overflow-hidden">
      
      {/* Decorative luxury background glow spheres */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] bg-[#CBF23D]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[50%] bg-[#003E2C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12 relative z-10">
        
        {/* PREMIUM METALLIC IMPERIAL VIP LEOPARD CARD */}
        <div className="bg-gradient-to-br from-[#0C1E1F] via-[#081718] to-[#040e0f] border border-[#6F7973]/30 rounded-[2.5rem] p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          {/* Aesthetic security watermark grids */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(203,242,61,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(203,242,61,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />
          
          {/* Decorative Gold & Teal ribbon at the top of card */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#003E2C] via-[#CBF23D] to-[#6F7973]" />
          
          {/* Security stamp watermark in the corner */}
          <div className="absolute top-6 right-6 hidden md:block text-[8px] font-mono tracking-[0.4em] text-white/10 select-none uppercase pointer-events-none">
            [ KIYOMI WORLDWIDE DECRYPT SECURE ID: #{user.email?.slice(0, 4)}-A ]
          </div>

          {/* USER IDENTITY BRAND CARD */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 pb-8 border-b border-white/10 relative z-10">
            
            {/* Crowned Circle Avatar with custom spinning glowing aura */}
            <div className="relative shrink-0 group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-yellow-500 via-[#CBF23D] to-emerald-500 rounded-3xl opacity-40 group-hover:opacity-100 blur-sm transition-all duration-700 animate-pulse" />
              <div className="relative bg-[#0C1E1F] rounded-2xl p-1.5 border border-white/20 shadow-2xl">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Member Avatar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-neutral-900 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#CBF23D] text-[#0C1E1F] p-1.5 rounded-xl shadow-lg border border-[#0C1E1F] hover:scale-110 transition-transform cursor-context-menu duration-300">
                <Award className="w-4 h-4 text-[#0C1E1F]" />
              </div>
            </div>
 
            {/* User credentials on immediate right */}
            <div className="space-y-4 flex-grow mt-2 sm:mt-0">
              <div className="space-y-2">
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="text-[8px] sm:text-[9.5px] font-mono tracking-widest text-[#CBF23D] uppercase font-black bg-[#CBF23D]/10 py-1 px-3 sm:px-4 rounded-full border border-[#CBF23D]/20 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#CBF23D] rounded-full animate-pulse" />
                    KIYOMI ROYAL GUILD MEMBER
                  </span>
                  {isAdmin && (
                    <span className="text-[8px] sm:text-[9.5px] font-mono tracking-widest text-emerald-300 uppercase font-bold bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20 inline-flex items-center gap-1">
                      <Lock className="w-3 h-3" /> ROOT ADMIN
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wide text-white uppercase leading-tight pt-1">
                  {user.displayName || 'Kiyomi Client'}
                </h1>
              </div>

              {/* Verified Badge & Email Metadata block */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-[11px] font-mono text-white/70">
                <div className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded-lg border border-white/5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider">VERIFIED STATUS PASSPORT</span>
                </div>
                <span className="text-white/20 hidden sm:inline">&bull;</span>
                <span className="lowercase font-bold text-[#CBF23D] border-b border-dashed border-[#CBF23D]/30 pb-0.5 truncate max-w-[200px] sm:max-w-none inline-block">
                  {user.email}
                </span>
                <span className="text-white/20 hidden sm:inline">&bull;</span>
                <span className="font-mono text-white/50 text-[10px]">
                  ID: <span className="text-white">#{user.uid?.slice(0, 8).toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Logout high-end interactive trigger */}
            <div className="shrink-0 pt-1 w-full sm:w-auto">
              <button 
                onClick={handleSignOutClick}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl border border-rose-500/30 text-rose-400 hover:text-white hover:bg-rose-500/10 hover:border-rose-500 font-mono text-[10px] tracking-widest uppercase font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              >
                <LogOut className="w-4 h-4" /> SECURE LOGOUT
              </button>
            </div>
          </div>

          {/* DYNAMIC COMPACT VIP SWITCHBOARD CONTROL - 3 MINIMALIST PREMIUM BUTTONS */}
          <div className="pt-6 mt-6 border-t border-white/10 relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 rounded-[1.5rem] backdrop-blur-md">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#CBF23D] uppercase select-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                {t("SECURE PROTOCOL / ড্যাশবোর্ড সেটিং টগল")}
              </span>
              
              <div className="flex flex-wrap gap-2.5 justify-center">
                <button
                  onClick={() => {
                    setActiveTab('history');
                    playCinematicIntroSound("Order list ledger loaded.");
                  }}
                  className={`py-2 px-4 rounded-xl font-mono text-[10px] tracking-widest font-black uppercase transition-all duration-300 transform select-none cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    activeTab === 'history'
                      ? 'bg-[#CBF23D] text-[#0C1E1F] border border-[#CBF23D] shadow-[0_4px_12px_rgba(203,242,61,0.25)] scale-102 font-black'
                      : 'bg-white/5 text-white/75 hover:bg-white/10 border border-white/10 hover:border-white/20'
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
                  className={`py-2 px-4 rounded-xl font-mono text-[10px] tracking-widest font-black uppercase transition-all duration-300 transform select-none cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    activeTab === 'settings'
                      ? 'bg-[#CBF23D] text-[#0C1E1F] border border-[#CBF23D] shadow-[0_4px_12px_rgba(203,242,61,0.25)] scale-102 font-black'
                      : 'bg-white/5 text-white/75 hover:bg-white/10 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>SETUP</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('autofill');
                    playCinematicIntroSound("Shipping address parameters loaded.");
                  }}
                  className={`py-2 px-4 rounded-xl font-mono text-[10px] tracking-widest font-black uppercase transition-all duration-300 transform select-none cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    activeTab === 'autofill'
                      ? 'bg-[#CBF23D] text-[#0C1E1F] border border-[#CBF23D] shadow-[0_4px_12px_rgba(203,242,61,0.25)] scale-102 font-black'
                      : 'bg-white/5 text-white/75 hover:bg-white/10 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>AUTOFILL</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* CONTAINER SHEETS CORRESPONDING TO HIGHLY POLISHED SELECTED TAB */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: SHIPPING HISTORY & TRACKING */}
            {activeTab === 'history' && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-[#6F7973]/20 rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-stone-100 space-y-8 text-left"
              >
                <div className="flex items-center gap-3 border-b border-[#6F7973]/15 pb-5">
                  <div className="p-2 bg-[#003E2C]/5 rounded-xl text-[#003E2C]">
                    <ClipboardList className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[8px] bg-[#003E2C]/10 text-[#003E2C] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">HISTORY MODULE</span>
                    <h3 className="text-md sm:text-lg font-serif font-black tracking-wide text-[#0c1e1f] mt-0.5">
                      {t("SHIPPING INVOICE RECORDS / আপনার অর্ডারের তালিকা")} ({pastOrders.length})
                    </h3>
                  </div>
                </div>

                {pastOrders.length === 0 ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="w-16 h-16 bg-[#E9FDFD] text-[#003E2C] rounded-full flex items-center justify-center mx-auto shadow-md border border-[#003E2C]/10 animate-bounce">
                      <Truck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-mono tracking-widest uppercase text-[#0C1E1F] font-black">
                        No shipment history recorded
                      </h4>
                      <p className="text-[#6F7973] text-xs max-w-sm mx-auto leading-relaxed">
                        আপনি এখনও আমাদের থেকে কোন ড্রেস অর্ডার করেননি। আমাদের নতুন কালেকশন গুলো ঘুরে দেখতে এবং ট্র্যাকিং শুরু করতে প্রোডাক্ট পেজে ঢু মারুন।
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link 
                        to="/products"
                        className="inline-block px-8 py-3.5 bg-[#003E2C] hover:bg-[#CBF23D] text-white hover:text-[#0C1E1F] text-xs font-mono tracking-[0.2em] uppercase font-black rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-950/15"
                      >
                        Explore street items
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {pastOrders.map((order) => (
                      <div 
                        key={order.id} 
                        onClick={() => navigate(`/track-order?id=${order.id}`)}
                        className="border border-stone-200 bg-white hover:border-[#003E2C] rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-5 hover:shadow-xl hover:shadow-stone-150/40 group relative overflow-hidden"
                      >
                        <div className="space-y-3 font-mono">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-[#CBF23D] text-[#0C1E1F] font-black px-3 py-1 rounded-xl uppercase leading-none border border-[#003E2C]/10">
                              BDT {order.totalPrice}
                            </span>
                            <span className="text-[10px] bg-[#003E2C] text-white font-bold px-3 py-1 rounded-xl leading-none uppercase">
                              #{order.id}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-[#6F7973]">
                            <MapPin className="w-4 h-4 text-[#003E2C] shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-md font-semibold text-stone-700">{order.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="text-right">
                            <span className="block text-[8px] text-stone-400 font-mono uppercase font-black tracking-wider mb-0.5">STATUS INDICATOR</span>
                            <span className="text-xs font-black font-mono text-[#003E2C] uppercase bg-[#E9FDFD] px-3 py-1 rounded-lg border border-emerald-950/10 inline-block">{order.status || 'Received'}</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#003E2C] group-hover:bg-[#CBF23D] group-hover:border-[#CBF23D] transition-all duration-300 shrink-0 shadow-sm">
                            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                          </div>
                        </div>
                        {/* Interactive glow bar on hover */}
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-[#003E2C] group-hover:bg-[#CBF23D] transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: PROFILE PROFILE PHOTO & VIEWPORT NAME SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-[#6F7973]/20 rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-stone-100 space-y-8 text-left"
              >
                <div className="flex items-center gap-3 border-b border-[#6F7973]/15 pb-5">
                  <div className="p-2 bg-[#003E2C]/5 rounded-xl text-[#003E2C]">
                    <Sliders className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[8px] bg-[#003E2C]/10 text-[#003E2C] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">ACCOUNT MANAGEMENT</span>
                    <h3 className="text-md sm:text-lg font-serif font-black tracking-wide text-[#0c1e1f] mt-0.5">
                      {t("UPDATE IDENTIFICATION GATEWAY / নাম ও প্রোফাইল ছবি পরিবর্তন")}
                    </h3>
                  </div>
                </div>

                {settingsSuccess && (
                  <div className="bg-[#E9FDFD] border border-emerald-300 rounded-2xl p-5 text-xs text-[#003E2C] font-mono tracking-wider flex items-center gap-3 shadow-md">
                    <CheckCircle className="w-5 h-5 text-emerald-800 shrink-0 animate-ping" />
                    <strong>YOUR ACCOUNT CREDENTIAL RECORDS SYNCED AND SAVED ON LOCAL SERVER INSTANCE SUCCESSFULLY!</strong>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-8 max-w-xl">
                  
                  {/* File Profile Upload box with camera overlay */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-600 font-extrabold">
                      {t("PROFILE PICTURE UPLOAD / নতুন প্রোফাইল ছবি")}
                    </label>
                    
                    <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap bg-stone-50 p-5 rounded-2xl border border-stone-150">
                      <div className="relative group select-none shrink-0">
                        <img 
                          src={editPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                          alt="Previsual" 
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#003E2C] object-cover bg-white"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="space-y-2 flex-grow">
                        {loadingUpload ? (
                          <span className="block text-xs font-mono text-[#003E2C] animate-pulse">READING ATOMIC FILE DATA...</span>
                        ) : (
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-xs font-mono file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-mono file:font-extrabold file:uppercase file:bg-[#003E2C] file:text-[#CBF23D] hover:file:bg-[#CBF23D] hover:file:text-[#0C1E1F] file:cursor-pointer file:transition-all"
                          />
                        )}
                        <p className="text-[10px] text-stone-500 uppercase leading-relaxed font-mono">
                          Only png, jpeg or standard gif images are supported. Size rule limit 2 Megabytes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Editable Name fields */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-600 font-extrabold">
                      {t("NOMINAL PROFILE NAME / আপনার নাম")}
                    </label>
                    <input 
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="ENTER FULL REAL NAME"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-[#003E2C] focus:bg-white focus:ring-1 focus:ring-[#003E2C]/15 py-3.5 px-4 rounded-xl text-xs focus:outline-none focus:shadow-inner font-mono uppercase text-stone-900 tracking-wider transition-all duration-300"
                    />
                  </div>

                  {/* MANUAL LANGUAGE TRANSLATION OPTION (MANUALLY TOGGLED UNDER PROFILE OPTION AS MANDATED) */}
                  <div className="pt-6 mt-6 border-t border-stone-150 space-y-4">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-[#003E2C] font-black">
                      {t("🌐 WEBSITE LANGUAGE TRANSLATION / সাইটের ভাষা পরিবর্তন")}
                    </label>
                    <p className="text-xs text-[#6F7973] font-sans leading-relaxed">
                      Choose your preferred system language. Switch between standard English and native Bengali securely with live reload.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2 select-none">
                      <div className="toggle-cont">
                        <input 
                          className="toggle-input" 
                          id="toggle-lang" 
                          name="toggle-lang" 
                          type="checkbox" 
                          checked={locale === 'bn'}
                          onChange={() => {
                            toggleLanguage();
                            playCinematicIntroSound("Language vocabulary updated.");
                          }}
                        />
                        <label className="toggle-label" htmlFor="toggle-lang">
                          <div className="cont-icon">
                            {sparkles.map((sp, idx) => (
                              <span
                                key={idx}
                                style={{
                                  "--width": sp.width,
                                  "--deg": sp.deg,
                                  "--duration": sp.duration
                                } as React.CSSProperties}
                                className="sparkle"
                              />
                            ))}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 30 30"
                              className="icon"
                            >
                              <path
                                d="M0.96233 28.61C1.36043 29.0081 1.96007 29.1255 2.47555 28.8971L10.4256 25.3552C13.2236 24.11 16.4254 24.1425 19.2107 25.4401L27.4152 29.2747C27.476 29.3044 27.5418 29.3023 27.6047 29.32C27.6563 29.3348 27.7079 29.3497 27.761 29.3574C27.843 29.3687 27.9194 29.3758 28 29.3688C28.1273 29.3617 28.2531 29.3405 28.3726 29.2945C28.4447 29.262 28.5162 29.2287 28.5749 29.1842C28.6399 29.1446 28.6993 29.0994 28.7509 29.0477L28.9008 28.8582C28.9468 28.7995 28.9793 28.7274 29.0112 28.656C29.0599 28.5322 29.0811 28.4036 29.0882 28.2734C29.0939 28.1957 29.0868 28.1207 29.0769 28.0415C29.0705 27.9955 29.0585 27.9524 29.0472 27.9072C29.0295 27.8343 29.0302 27.7601 28.9984 27.6901L25.1638 19.4855C23.8592 16.7073 23.8273 13.5048 25.0726 10.7068L28.6145 2.75679C28.8429 2.24131 28.7318 1.63531 28.3337 1.2372C27.9165 0.820011 27.271 0.721743 26.7491 0.9961L19.8357 4.59596C16.8418 6.15442 13.2879 6.18696 10.2615 4.70062L1.80308 0.520214C1.7055 0.474959 1.60722 0.441742 1.50964 0.421943C1.44459 0.409215 1.37882 0.395769 1.3074 0.402133C1.14406 0.395769 0.981436 0.428275 0.818095 0.499692C0.77284 0.519491 0.719805 0.545671 0.67455 0.578198C0.596061 0.617088 0.524653 0.675786 0.4596 0.74084C0.394546 0.805894 0.335843 0.877306 0.296245 0.956502C0.263718 1.00176 0.237561 1.05477 0.217762 1.10003C0.152708 1.24286 0.126545 1.40058 0.120181 1.54978C0.120181 1.61483 0.126527 1.6735 0.132891 1.73219C0.15269 1.85664 0.178881 1.97332 0.237571 2.08434L4.41798 10.5427C5.91139 13.5621 5.8725 17.1238 4.3204 20.1099L0.720514 27.0233C0.440499 27.5536 0.545137 28.1928 0.96233 28.61Z"
                              />
                            </svg>
                          </div>
                        </label>
                      </div>

                      {/* Side state labels */}
                      <div className="flex flex-col gap-1 justify-center">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded transition-colors ${locale === 'en' ? 'bg-[#003E2C] text-[#CBF23D]' : 'bg-[#E9FDFD]/60 text-[#6F7973]'}`}>
                            🇬🇧 ENGLISH
                          </span>
                          <span className="text-[#6F7973] font-mono text-[9px]">&bull;</span>
                          <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded transition-colors ${locale === 'bn' ? 'bg-[#003E2C] text-[#CBF23D]' : 'bg-[#E9FDFD]/60 text-[#6F7973]'}`}>
                            🇧🇩 বাংলা
                          </span>
                        </div>
                        <span className="text-[9px] text-[#6F7973] font-mono font-bold">
                          {locale === 'en' ? "* Slide switch to toggle vocabulary translations instantly" : "* ভাষা পরিবর্তন করতে টগল সুইচটি স্লাইড করুন"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-[#003E2C] hover:bg-[#CBF23D] text-white hover:text-[#0C1E1F] font-mono text-xs tracking-widest font-black uppercase rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-950/15 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save className="w-4 h-4" /> SAVE INSTANT USER PROFILE INFO
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 3: BILLING SHIPPING COURIER PARAMETER SETTINGS (AUTOFILL) */}
            {activeTab === 'autofill' && (
              <motion.div
                key="autofill-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-[#6F7973]/20 rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-stone-100 space-y-8 text-left"
              >
                <div className="flex items-center gap-3 border-b border-[#6F7973]/15 pb-5">
                  <div className="p-2 bg-[#003E2C]/5 rounded-xl text-[#003E2C]">
                    <MapPin className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[8px] bg-[#003E2C]/10 text-[#003E2C] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">1-CLICK CHECKOUT</span>
                    <h3 className="text-md sm:text-lg font-serif font-black tracking-wide text-[#0c1e1f] mt-0.5">
                      {t("SHIPPING PARAMETER AUTOMATION LOGS / অটোফিল চেকআউট ডাটা")}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#6F7973] uppercase tracking-wide leading-relaxed font-mono">
                  {locale === 'bn' 
                    ? "এখানে আপনার শিপিং ও ডেলিভারি তথ্যগুলো আগে থেকেই সেভ করে রাখুন। এর ফলে অর্ডার করার সময় আপনার নাম, মোবাইল ও ঠিকানা স্বয়ংক্রিয়ভাবে ফিল হয়ে যাবে, যা পরবর্তীতেও কাস্টমাইজ করা সম্ভব।"
                    : "Save your default shipping and delivery credentials in advance. This ensures your nominal consignee name, mobile number, and destination address are automatically populated during checkout."
                  }
                </p>

                {saveSuccess && (
                  <div className="bg-[#E9FDFD] border border-emerald-300 rounded-2xl p-5 text-xs text-[#003E2C] font-mono tracking-wider flex items-center gap-3 shadow-md">
                    <CheckCircle className="w-5 h-5 text-emerald-800 shrink-0 animate-pulse" />
                    <span><strong>
                      {locale === 'bn'
                        ? "আপনার অটোফিল চেকআউট ডাটা সফলভাবে সেভ করা হয়েছে!"
                        : "DELIVER SECURED PARAMETERS DEPOSITED SUCCESSFULLY. READY FOR AUTOMATED CHECKOUTS!"
                      }
                    </strong></span>
                  </div>
                )}

                <form onSubmit={handleSaveAutofill} className="space-y-6 max-w-xl">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-600 font-extrabold">
                        {t("DEFAULT CLIENT CONSIGNEE / যোগাযোগের নাম")}
                      </label>
                      <input 
                        type="text"
                        required
                        value={autofillName}
                        onChange={(e) => setAutofillName(e.target.value)}
                        placeholder="E.G. ABRAR RAHMAN SHUVO"
                        className="w-full bg-stone-50 border border-stone-200 focus:border-[#003E2C] focus:bg-white focus:ring-1 focus:ring-[#003E2C]/15 py-3.5 px-4 rounded-xl text-xs focus:outline-none focus:shadow-inner font-mono uppercase tracking-wider transition-all duration-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-600 font-extrabold">
                        {t("ACTIVE MOBILE LINE / মোবাইল নাম্বার")}
                      </label>
                      <div className="relative">
                        <input 
                          type="tel"
                          required
                          value={autofillPhone}
                          onChange={(e) => setAutofillPhone(e.target.value)}
                          placeholder="E.G. 017XXXXXXXX"
                          className="w-full bg-stone-50 border border-stone-200 focus:border-[#003E2C] focus:bg-white focus:ring-1 focus:ring-[#003E2C]/15 pl-11 pr-4 py-3.5 rounded-xl text-xs focus:outline-none focus:shadow-inner font-mono tracking-wider transition-all duration-300"
                        />
                        <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-600 font-extrabold">
                      {t("COURIER DELIVER WAREHOUSE ADDRESS / কাস্টমার ডেলিভারি ঠিকানা")}
                    </label>
                    <textarea 
                      required
                      rows={3}
                      value={autofillAddress}
                      onChange={(e) => setAutofillAddress(e.target.value)}
                      placeholder="E.G. SECTOR 4, HONEY DEW ROAD 2A, UTTARA, DHAKA-1230"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-[#003E2C] focus:bg-white focus:ring-1 focus:ring-[#003E2C]/15 p-4 rounded-xl text-xs focus:outline-none font-sans text-stone-900 transition-all duration-300 resize-none focus:shadow-[0_4px_12px_rgba(0,62,44,0.03)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-[#003E2C] hover:bg-[#CBF23D] text-white hover:text-[#0C1E1F] font-mono text-xs tracking-widest font-black uppercase rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-950/15 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save className="w-4 h-4" /> COMMIT COURIER DISPATCH DATA
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM REDIRECT TO BRAND PORTFOLIO BLOCK */}
        <div className="bg-[#0c1e1f] text-white p-8 md:p-10 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left relative overflow-hidden shadow-2xl border border-white/5">
          {/* Aesthetic geometric grids in corporate style */}
          <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-[#CBF23D]/10 to-transparent pointer-events-none opacity-40" />
          
          <div className="space-y-2 z-10">
            <h4 className="text-sm font-mono tracking-widest uppercase text-[#CBF23D] font-black">EXPLORE OUR CORPORATE SHOWROOM &amp; BRAND MANIFESTO</h4>
            <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
              আপনি কি জানেন আমাদের কোম্পানির পরিচিতি এবং চমৎকার ব্যবসায়িক দর্শন সম্পর্কে? ক্লিক করে আমাদের সম্পর্কে চমৎকার সব তথ্য জানুন।
            </p>
          </div>

          <Link
            to="/brand"
            className="px-6 py-4 bg-[#CBF23D] hover:bg-white text-[#0C1E1F] font-mono text-[10px] tracking-widest font-black uppercase rounded-xl transition-all duration-300 shrink-0 z-10 hover:scale-105 active:scale-95 shadow-md shadow-black/20"
          >
            DISCOVER PORTFOLIO &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};
