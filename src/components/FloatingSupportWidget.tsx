import React, { useState, useEffect, useRef } from 'react';
import { Headset, X, Facebook } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { playCinematicIntroSound } from '../utils/voiceUtils';

export const FloatingSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      playCinematicIntroSound("How can we assist you today?");
    }
  };

  return (
    <div 
      ref={widgetRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
    >
      {/* Expanded Floating Options Drawer */}
      {isOpen && (
        <div 
          className="mb-3 flex flex-col items-end gap-3 animate-fade-in transition-all duration-300"
          role="menu"
          aria-label="Customer Support Options"
        >
          {/* 1. Facebook Page Bubble Button */}
          <div className="flex items-center gap-2.5 group">
            <span className="bg-[#0A1E54] text-[#F8F3EA] text-xs font-mono px-3 py-1.5 rounded-xl shadow-lg border border-[#C9A66B]/30 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
              Official Facebook Page
            </span>
            <a
              href="https://www.facebook.com/share/1bjdW3mmQ4/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-13 h-13 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white ring-2 ring-[#1877F2]/30"
              aria-label="Connect with Patowary Fashion Facebook page"
              title="Patowary Fashion Facebook Page"
              onClick={() => setIsOpen(false)}
            >
              <Facebook className="w-6 h-6 fill-white text-[#1877F2]" />
            </a>
          </div>

          {/* 2. WhatsApp Support Bubble Button */}
          <div className="flex items-center gap-2.5 group">
            <span className="bg-[#0A1E54] text-[#F8F3EA] text-xs font-mono px-3 py-1.5 rounded-xl shadow-lg border border-[#C9A66B]/30 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
              WhatsApp (+880 1730 943993)
            </span>
            <a
              href="https://wa.me/8801730943993"
              target="_blank"
              rel="noopener noreferrer"
              className="w-13 h-13 bg-[#25D366] hover:bg-[#1ebd54] text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white ring-2 ring-[#25D366]/30"
              aria-label="Connect with Patowary Fashion WhatsApp support"
              title="WhatsApp Customer Care (01730943993)"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.81 0c3.142.001 6.098 1.222 8.322 3.448 2.224 2.225 3.443 5.18 3.443 8.322-.002 6.486-5.328 11.812-11.81 11.812-2.001-.001-3.97-.513-5.727-1.488L0 24zm6.49-4.22c1.54.916 3.51 1.455 5.253 1.456 5.378 0 9.754-4.373 9.756-9.75c.002-2.603-1.01-5.051-2.85-6.892C16.806 2.753 14.36 1.74 11.81 1.74c-5.38 0-9.755 4.375-9.757 9.75-.001 1.84.482 3.633 1.398 5.197L2.483 20.82l4.064-1.04zm11.395-5.36c-.295-.148-1.745-.862-2.013-.96-.268-.099-.463-.148-.658.148-.195.297-.756.96-.926 1.157-.17.198-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.474-1.751-1.647-2.047-.172-.296-.018-.456.13-.603.133-.133.296-.34.444-.51.148-.17.197-.29.295-.49.099-.199.05-.373-.025-.52-.075-.148-.658-1.587-.902-2.172-.237-.57-.48-.492-.66-.502-.17-.008-.364-.01-.559-.01-.195 0-.511.073-.778.362-.268.29-.988.966-.988 2.355 0 1.39 1.012 2.73 1.157 2.928.145.197 1.992 3.042 4.825 4.26.674.29 1.2.463 1.61.593.678.215 1.294.185 1.782.112.543-.081 1.744-.713 1.992-1.401.248-.69.248-1.282.173-1.402-.073-.12-.268-.19-.564-.34z"/>
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Main Single Floating Toggle Button with Headset Icon */}
      <button
        type="button"
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white ring-2 ${
          isOpen 
            ? 'bg-[#0A1E54] text-white ring-stone-400 rotate-90 shadow-stone-800/20' 
            : 'bg-gradient-to-br from-[#0A1E54] to-[#1A3070] text-[#C9A66B] ring-[#C9A66B]/50 hover:shadow-[#0A1E54]/30'
        }`}
        aria-label={isOpen ? "Close customer support options" : "Open customer support options"}
        aria-expanded={isOpen}
        title={isOpen ? "Close support options" : "Customer Support"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Headset className="w-6 h-6 text-[#C9A66B] transition-transform hover:scale-110" />
            {/* Subtle active pulse dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
};
