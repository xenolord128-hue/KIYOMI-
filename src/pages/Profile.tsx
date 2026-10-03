import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ShieldCheck, 
  LogOut, 
  MapPin, 
  Package, 
  CreditCard, 
  Check, 
  Copy,
  ExternalLink,
  X
} from 'lucide-react';
import { playCinematicIntroSound } from '../utils/voiceUtils';
import { OFFICIAL_LOGO_URL } from '../components/BrandLogo';
import { updatePageSEO } from '../utils/seoUtils';
import { sendFormViaEmailJS } from '../lib/emailjs';

export const Profile: React.FC = () => {
  const { user, isAdmin, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Page mode: 'profile' or 'edit'
  const [isEditing, setIsEditing] = useState(location.hash === '#edit-profile');

  // Profile data states
  const [displayName, setDisplayName] = useState(user?.displayName || 'Mahafuzur Rahman');
  const [handle, setHandle] = useState(() => {
    const saved = localStorage.getItem('patowary_user_handle');
    if (saved) return saved;
    if (user?.displayName) return user.displayName.toLowerCase().replace(/\s+/g, '');
    if (user?.email) return user.email.split('@')[0];
    return 'mahafuzur';
  });
  const [bio, setBio] = useState(() => {
    return localStorage.getItem('patowary_user_bio') || 
      'Fashion enthusiast • Patowary Fashion community member. Discovering clean looks, everyday essentials and premium style.';
  });
  const [photoURL, setPhotoURL] = useState(user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  // Delivery & Location states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [locationCity, setLocationCity] = useState('Dhaka, Bangladesh');

  // Stats & Invoices
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Modal overlays
  const [activeModal, setActiveModal] = useState<'addresses' | 'orders' | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Sync mode with hash
  useEffect(() => {
    setIsEditing(location.hash === '#edit-profile');
  }, [location.hash]);

  // Load saved autofill data & orders
  useEffect(() => {
    if (user) {
      if (user.displayName) setDisplayName(user.displayName);
      if (user.photoURL) setPhotoURL(user.photoURL);

      const autofillStr = localStorage.getItem('patowary_profile_autofill');
      if (autofillStr) {
        try {
          const data = JSON.parse(autofillStr);
          if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
          if (data.shippingAddress) {
            setShippingAddress(data.shippingAddress);
            setLocationCity(data.shippingAddress.split(',').pop()?.trim() || 'Bangladesh');
          }
        } catch (e) {}
      }

      // Past orders count
      const storedOrders = localStorage.getItem('patowary_local_orders');
      if (storedOrders) {
        try {
          const list = JSON.parse(storedOrders);
          setPastOrders(Array.isArray(list) ? list : []);
        } catch (e) {}
      }

      // Wishlist items count
      const storedWishlist = localStorage.getItem('patowary_wishlist');
      if (storedWishlist) {
        try {
          const wlist = JSON.parse(storedWishlist);
          setWishlistCount(Array.isArray(wlist) ? wlist.length : 0);
        } catch (e) {}
      }
    }
  }, [user]);

  // Update SEO
  useEffect(() => {
    updatePageSEO(
      isEditing ? 'Edit Profile | Patowary Fashion' : `${displayName} (@${handle}) | Patowary Fashion`,
      'Patowary Fashion Member Profile. Manage style preferences, orders, and delivery addresses.'
    );
  }, [isEditing, displayName, handle]);

  // Photo change handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Please upload an image smaller than 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPhotoURL(ev.target.result as string);
        playCinematicIntroSound("Photo updated");
      }
    };
    reader.readAsDataURL(file);
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = displayName.trim() || 'User';
    const cleanHandle = handle.trim().replace(/^@/, '') || 'user';
    const cleanBio = bio.trim();

    localStorage.setItem('patowary_user_handle', cleanHandle);
    localStorage.setItem('patowary_user_bio', cleanBio);

    const autofillData = {
      fullName: cleanName,
      phoneNumber: phoneNumber.trim(),
      shippingAddress: shippingAddress.trim()
    };
    localStorage.setItem('patowary_profile_autofill', JSON.stringify(autofillData));

    try {
      await updateProfile(cleanName, photoURL);
      sendFormViaEmailJS({
        formType: 'Profile Settings Update Form',
        name: cleanName,
        email: user?.email || '',
        message: `Profile updated for @${cleanHandle}`,
        subject: `Profile Updated: ${cleanName}`,
        customFields: {
          'Display Name': cleanName,
          'Username': cleanHandle,
          'Account Email': user?.email || 'N/A',
        },
      }).catch(() => {});
    } catch (err) {}

    setSaveSuccessNotice(true);
    playCinematicIntroSound("Profile updated successfully.");
    setTimeout(() => {
      setSaveSuccessNotice(false);
      setIsEditing(false);
      navigate('/profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handleShare = () => {
    const profileUrl = window.location.href.split('#')[0];
    if (navigator.share) {
      navigator.share({
        title: `${displayName} — Patowary Fashion Profile`,
        text: `Discover ${displayName}'s style on Patowary Fashion`,
        url: profileUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(profileUrl);
      setShareCopied(true);
      playCinematicIntroSound("Profile link copied");
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleSignOut = () => {
    logout();
    playCinematicIntroSound("Signed out");
    navigate('/');
  };

  // Unauthorized Cover View
  if (!user) {
    return (
      <div className="profile-page-root flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/85 border border-[#0A1E54]/10 p-8 rounded-3xl text-center space-y-6 shadow-xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-[#0A1E54] text-[#C9A66B] mx-auto flex items-center justify-center font-bold text-xl shadow-lg">
            <img src={OFFICIAL_LOGO_URL} alt="Patowary Fashion" className="w-10 h-10 object-contain rounded-lg" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-[#0A1E54]">Client Authentication Required</h2>
            <p className="text-xs text-stone-600 mt-2 font-sans">
              Please sign in to access your personal Patowary Fashion profile, order history, and exclusive member benefits.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link to="/login" className="profile-btn profile-btn-primary w-full py-3.5">
              Sign In to Your Account
            </Link>
            <Link to="/register" className="profile-btn profile-btn-soft w-full py-3">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Edit Profile Subpage View
  if (isEditing) {
    return (
      <div className="profile-page-root animate-fade-in text-left">
        <div className="edit-profile-shell">
          
          <button 
            type="button" 
            className="edit-back-btn" 
            onClick={() => {
              setIsEditing(false);
              navigate('/profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            &larr; {t("Back to Profile")}
          </button>

          <section className="edit-profile-card">
            <div className="edit-profile-head">
              <h1>{t("Edit Profile")}</h1>
              <p>{t("Update your profile information and profile picture.")}</p>
            </div>

            {saveSuccessNotice && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t("Profile updated successfully!")}</span>
              </div>
            )}

            {/* Photo Editor */}
            <div className="profile-photo-editor">
              <img 
                className="edit-avatar-preview" 
                src={photoURL} 
                alt={displayName} 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div>
                <strong style={{ display: 'block', color: '#0A1E54', fontSize: '14px' }}>
                  {t("Profile Picture")}
                </strong>
                <span style={{ display: 'block', color: '#87909e', fontSize: '11px', margin: '5px 0 10px' }}>
                  {t("JPG, PNG or WEBP recommended (Max 3MB).")}
                </span>
                <label className="photo-upload-label" htmlFor="photoInput">
                  {t("Change Photo")}
                </label>
                <input 
                  id="photoInput" 
                  type="file" 
                  accept="image/png,image/jpeg,image/webp" 
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveProfile}>
              <div className="edit-form-grid">
                
                <div className="edit-field">
                  <label htmlFor="nameInput">{t("Full Name")}</label>
                  <input 
                    id="nameInput" 
                    type="text"
                    required
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="Your Full Name"
                  />
                </div>

                <div className="edit-field">
                  <label htmlFor="handleInput">{t("Username")}</label>
                  <input 
                    id="handleInput" 
                    type="text"
                    value={handle} 
                    onChange={(e) => setHandle(e.target.value)} 
                    placeholder="username"
                  />
                </div>

                <div className="edit-field">
                  <label htmlFor="phoneInput">{t("Mobile Phone Number")}</label>
                  <input 
                    id="phoneInput" 
                    type="tel"
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    placeholder="+880 1XXXXXXXXX"
                  />
                </div>

                <div className="edit-field">
                  <label htmlFor="addressInput">{t("Default Delivery Address")}</label>
                  <input 
                    id="addressInput" 
                    type="text"
                    value={shippingAddress} 
                    onChange={(e) => {
                      setShippingAddress(e.target.value);
                      setLocationCity(e.target.value.split(',').pop()?.trim() || 'Bangladesh');
                    }} 
                    placeholder="House, Road, Area, Dhaka"
                  />
                </div>

                <div className="edit-field full">
                  <label htmlFor="bioInput">{t("Bio / About You")}</label>
                  <textarea 
                    id="bioInput" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Tell the community about your style..."
                  />
                </div>

              </div>

              <div className="edit-form-actions">
                <button 
                  type="button" 
                  className="profile-btn profile-btn-soft" 
                  onClick={() => {
                    setIsEditing(false);
                    navigate('/profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {t("Cancel")}
                </button>
                <button type="submit" className="profile-btn profile-btn-primary">
                  {t("Save Changes")}
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    );
  }

  // Main Profile View (matching user's exact HTML layout)
  return (
    <div className="profile-page-root animate-fade-in text-left">
      <main className="profile-container">

        {/* Breadcrumb */}
        <div className="profile-breadcrumb">
          {t("Account")} <b>›</b> <span>{t("Profile")}</span>
        </div>

        {/* Share notification banner */}
        {shareCopied && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              {t("Profile link copied to clipboard!")}
            </span>
            <Copy className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        )}

        {/* Hero Card */}
        <section className="profile-hero">
          <div className="profile-top">
            <div className="avatar-wrap">
              <img 
                className="profile-avatar-img" 
                src={photoURL} 
                alt={displayName} 
                id="profileAvatar"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <i className="online-dot" title="Active Member"></i>
            </div>

            <div className="profile-identity">
              <div className="profile-name-row">
                <h1 className="profile-name-title" id="displayName">{displayName}</h1>
                <span className="verified-badge" title="Verified Member">✓</span>
              </div>
              <div className="profile-handle" id="displayHandle">@{handle}</div>
              <p className="profile-bio" id="displayBio">{bio}</p>
              
              <div className="profile-badges">
                <span className="profile-badge-pill gold">✦ {t("Premium Member")}</span>
                <span className="profile-badge-pill blue">{t("Verified Account")}</span>
                {isAdmin && (
                  <span className="profile-badge-pill gold bg-[#C9A66B]/20 border border-[#C9A66B]/40 text-[#0A1E54] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#C9A66B]" />
                    <span>Admin</span>
                  </span>
                )}
              </div>
            </div>

            <div className="profile-hero-actions">
              <button 
                type="button" 
                className="profile-btn profile-btn-primary" 
                onClick={() => {
                  setIsEditing(true);
                  navigate('/profile#edit-profile');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {t("Edit Profile")}
              </button>

              <button 
                type="button" 
                className="profile-btn profile-btn-soft" 
                onClick={handleShare}
              >
                {t("Share")}
              </button>
            </div>
          </div>
        </section>

        {/* 4 Stats Boxes */}
        <section className="profile-stats">
          <div className="profile-stat-box cursor-pointer" onClick={() => setActiveModal('orders')}>
            <strong>{pastOrders.length > 0 ? pastOrders.length : '24'}</strong>
            <span>{t("Total Orders")}</span>
          </div>
          <div className="profile-stat-box cursor-pointer" onClick={() => navigate('/shop')}>
            <strong>{wishlistCount > 0 ? wishlistCount : '18'}</strong>
            <span>{t("Wishlist Items")}</span>
          </div>
          <div className="profile-stat-box">
            <strong>12</strong>
            <span>{t("Reviews")}</span>
          </div>
          <div className="profile-stat-box">
            <strong>2025</strong>
            <span>{t("Member Since")}</span>
          </div>
        </section>

        {/* Main 2-Column Grid */}
        <section className="profile-content-grid">
          
          {/* Card 1: Account Information */}
          <div className="profile-card">
            <div className="profile-card-title">
              <h2>{t("Account Information")}</h2>
              <span>{t("Personal details")}</span>
            </div>
            <div className="profile-info-list">
              <div className="profile-info-item">
                <label>{t("Full Name")}</label>
                <p id="infoName">{displayName}</p>
              </div>
              <div className="profile-info-item">
                <label>{t("Username")}</label>
                <p id="infoHandle">@{handle}</p>
              </div>
              <div className="profile-info-item">
                <label>{t("Email")}</label>
                <p>{user.email || 'customer@patowary.com'}</p>
              </div>
              <div className="profile-info-item">
                <label>{t("Location")}</label>
                <p>{locationCity}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Activity */}
          <div className="profile-card">
            <div className="profile-card-title">
              <h2>{t("Recent Activity")}</h2>
              <span>{t("Latest")}</span>
            </div>
            <div className="profile-activity-list">
              <div className="profile-activity-item">
                <i className="profile-activity-dot"></i>
                <div>
                  <strong>{t("Profile information updated")}</strong>
                  <small>{t("Recently")}</small>
                </div>
              </div>
              <div className="profile-activity-item">
                <i className="profile-activity-dot"></i>
                <div>
                  <strong>{t("Added an item to wishlist")}</strong>
                  <small>{t("2 days ago")}</small>
                </div>
              </div>
              <div className="profile-activity-item">
                <i className="profile-activity-dot"></i>
                <div>
                  <strong>{t("Completed an order")}</strong>
                  <small>{t("5 days ago")}</small>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Quick Navigation 3-Card Grid */}
        <section className="profile-quick-grid">
          
          <button 
            type="button" 
            className="profile-quick-box" 
            onClick={() => setActiveModal('addresses')}
          >
            <div className="qicon">⌖</div>
            <strong>{t("Saved Addresses")}</strong>
            <span>{t("Manage delivery addresses")}</span>
          </button>

          <button 
            type="button" 
            className="profile-quick-box" 
            onClick={() => setActiveModal('orders')}
          >
            <div className="qicon">▣</div>
            <strong>{t("Order History & Invoices")}</strong>
            <span>{t("View tracking & receipts")}</span>
          </button>

          <button 
            type="button" 
            className="profile-quick-box" 
            onClick={() => {
              setIsEditing(true);
              navigate('/profile#edit-profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="qicon">⚙</div>
            <strong>{t("Account Settings")}</strong>
            <span>{t("Security, picture & bio")}</span>
          </button>

        </section>

        {/* Admin Portal Shortcut if Admin */}
        {isAdmin && (
          <div className="mt-4 p-5 rounded-2xl bg-[#0A1E54] text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#C9A66B]" />
              <div>
                <h4 className="font-serif font-bold text-sm">Administrator Control Atelier</h4>
                <p className="text-[11px] text-white/70">Manage boutique inventory, upload photos/videos, view real-time orders.</p>
              </div>
            </div>
            <Link to="/admin" className="px-4 py-2 bg-[#C9A66B] text-[#0A1E54] text-xs font-bold rounded-xl hover:bg-white transition-colors">
              Access Admin
            </Link>
          </div>
        )}

        {/* Sign Out Button */}
        <div className="mt-8 pt-6 border-t border-stone-200/60 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-mono">
            Signed in as: <b className="text-[#0A1E54]">{user.email}</b>
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("Sign Out")}</span>
          </button>
        </div>

      </main>

      {/* Addresses Modal */}
      {activeModal === 'addresses' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <button 
              type="button" 
              onClick={() => setActiveModal(null)} 
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0A1E54] text-[#C9A66B] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5 text-[#C9A66B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A1E54]">{t("Saved Delivery Address")}</h3>
                <span className="text-[11px] text-stone-500">{t("Used for express 1-click checkout")}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Receiver Name</label>
                <p className="text-xs font-bold text-[#0A1E54]">{displayName}</p>
                
                <label className="text-[10px] uppercase font-bold text-stone-400 block mt-3 mb-1">Phone Number</label>
                <p className="text-xs font-bold text-[#0A1E54]">{phoneNumber || t("No phone saved yet")}</p>

                <label className="text-[10px] uppercase font-bold text-stone-400 block mt-3 mb-1">Shipping Address</label>
                <p className="text-xs font-bold text-[#0A1E54]">{shippingAddress || t("No address saved yet")}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setActiveModal(null);
                    setIsEditing(true);
                    navigate('/profile#edit-profile');
                  }}
                  className="profile-btn profile-btn-primary text-xs"
                >
                  {t("Update Address in Edit Profile")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders / Invoices Modal */}
      {activeModal === 'orders' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-left max-h-[85vh] overflow-y-auto">
            <button 
              type="button" 
              onClick={() => setActiveModal(null)} 
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0A1E54] text-[#C9A66B] flex items-center justify-center font-bold">
                <Package className="w-5 h-5 text-[#C9A66B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A1E54]">{t("Order History & Invoices")}</h3>
                <span className="text-[11px] text-stone-500">{t("Your placed orders and digital receipts")}</span>
              </div>
            </div>

            {pastOrders.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <p className="text-xs text-stone-600 font-medium">
                  {t("You haven't placed any online orders yet.")}
                </p>
                <Link 
                  to="/shop" 
                  onClick={() => setActiveModal(null)}
                  className="profile-btn profile-btn-primary inline-flex text-xs"
                >
                  {t("Explore Collections")}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {pastOrders.map((ord, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#C9A66B] font-bold">INVOICE #{ord.orderId || ord.transactionId || idx + 1}</span>
                        <h4 className="text-xs font-bold text-[#0A1E54]">{ord.productOrService || 'Patowary Boutique Purchase'}</h4>
                      </div>
                      <span className="text-xs font-bold text-[#0A1E54]">{ord.total || ord.price || 'BDT Paid'}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-200">
                      <span>Method: {ord.paymentMethod || 'Cash on Delivery'}</span>
                      <span className="text-emerald-700 font-bold">Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
