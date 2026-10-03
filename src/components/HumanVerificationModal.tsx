import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import { ReCaptcha } from './ReCaptcha';
import { useLanguage } from '../contexts/LanguageContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';

interface HumanVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified?: () => void;
}

export const isUserHumanVerified = (): boolean => {
  return localStorage.getItem('patowary_human_verified') === 'true';
};

export const setHumanVerified = () => {
  localStorage.setItem('patowary_human_verified', 'true');
};

export const HumanVerificationModal: React.FC<HumanVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerifySuccess = (token: string) => {
    setIsVerifying(true);
    setHumanVerified();
    playCinematicIntroSound("Human verification completed. Welcome to Patowary Fashion.");

    setTimeout(() => {
      setIsVerifying(false);
      onClose();
      if (onVerified) {
        onVerified();
      } else {
        // Automatically open the registration page as requested
        navigate('/register');
      }
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-left"
      role="dialog"
      aria-modal="true"
      aria-labelledby="human-verification-title"
    >
      <div className="bg-[#F8F3EA] border-2 border-[#0A1E54]/20 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-[#0A1E54] p-1.5 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1E54] text-[#C9A66B] flex items-center justify-center font-bold shadow-md shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#C9A66B]" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#C9A66B] font-bold block">
              PATOWARY SECURITY
            </span>
            <h3 id="human-verification-title" className="text-lg font-serif font-black text-[#0A1E54]">
              Human Security Verification
            </h3>
          </div>
        </div>

        {/* Informative text */}
        <p className="text-xs text-stone-600 leading-relaxed font-sans">
          Please complete the one-time human verification below. Once verified, the registration page will automatically open.
        </p>

        {/* ReCaptcha Widget Container */}
        <div className="bg-white/90 border border-stone-200 p-4 rounded-2xl flex justify-center shadow-inner">
          <ReCaptcha
            onVerify={handleVerifySuccess}
            onExpire={() => {}}
            onError={() => {}}
          />
        </div>

        {/* Loading Spinner during automatic transition */}
        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#0A1E54] py-2 bg-[#C9A66B]/20 rounded-xl font-bold animate-pulse">
            <div className="w-4 h-4 border-2 border-[#0A1E54] border-t-transparent rounded-full animate-spin" />
            <span>Verified! Opening Registration Page...</span>
          </div>
        )}

        <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono text-stone-500">
          <span>One-time verification only</span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-600 hover:text-[#0A1E54] font-bold underline cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
