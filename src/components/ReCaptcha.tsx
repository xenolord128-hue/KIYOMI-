import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => number;
      reset: (opt_widget_id?: number) => void;
      getResponse: (opt_widget_id?: number) => string;
      ready: (callback: () => void) => void;
    };
    onRecaptchaApiLoaded?: () => void;
  }
}

interface ReCaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  className?: string;
}

export const ReCaptcha: React.FC<ReCaptchaProps> = ({
  onVerify,
  onExpire,
  onError,
  theme = 'light',
  size = 'normal',
  className = '',
}) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const siteKey =
    (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY ||
    '6LfEkNUtAAAAALugitdppHz-TbZQY9gOzYr4ZwHo';

  useEffect(() => {
    let isMounted = true;

    const renderWidget = () => {
      if (!containerRef.current || !window.grecaptcha?.render) return;

      // Prevent duplicate rendering
      if (widgetIdRef.current !== null) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
          return;
        } catch (e) {
          // Fall through to re-render if reset failed
        }
      }

      containerRef.current.innerHTML = '';

      try {
        const id = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme as 'light' | 'dark',
          size: size as 'normal' | 'compact',
          callback: (token: string) => {
            if (isMounted) {
              onVerify(token);
            }
          },
          'expired-callback': () => {
            if (isMounted && onExpire) {
              onExpire();
            }
          },
          'error-callback': () => {
            if (isMounted) {
              console.warn('reCAPTCHA encountered a verification challenge error or domain mismatch.');
              if (onError) onError();
            }
          },
        });
        widgetIdRef.current = id;
        if (isMounted) setIsLoaded(true);
      } catch (err) {
        console.warn('reCAPTCHA render error:', err);
      }
    };

    // If script is already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      renderWidget();
    } else {
      // Define global callback if not present
      const SCRIPT_ID = 'google-recaptcha-v2-script';
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement;

      window.onRecaptchaApiLoaded = () => {
        if (isMounted) {
          setIsLoaded(true);
          renderWidget();
        }
      };

      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src =
          'https://www.google.com/recaptcha/api.js?onload=onRecaptchaApiLoaded&render=explicit';
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          if (isMounted) {
            setLoadError(true);
            console.warn('Failed to load Google reCAPTCHA script from Google servers.');
          }
        };
        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.render) {
            clearInterval(checkInterval);
            if (isMounted) {
              setIsLoaded(true);
              renderWidget();
            }
          }
        }, 150);

        setTimeout(() => clearInterval(checkInterval), 6000);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [siteKey, theme, size, onVerify, onExpire, onError]);

  return (
    <div className={`recaptcha-wrapper my-3 flex flex-col items-center justify-center ${className}`}>
      {/* Container for Google reCAPTCHA v2 Checkbox */}
      <div 
        ref={containerRef} 
        className="min-h-[78px] flex items-center justify-center transition-opacity duration-300"
      />

      {/* Loading state indicator */}
      {!isLoaded && !loadError && (
        <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-500 text-xs font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C9A66B]" />
          <span>{t("Loading Google reCAPTCHA Security Check...", "নিরাপত্তা যাচাই লোড হচ্ছে...")}</span>
        </div>
      )}

      {/* Script Load Error Fallback */}
      {loadError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1.5 font-mono max-w-sm text-left">
          <div className="flex items-center gap-2 font-bold text-[#0A1E54]">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t("Security Verification Notice", "নিরাপত্তা নোটিশ")}</span>
          </div>
          <p className="text-[11px] text-amber-800">
            {t(
              "reCAPTCHA script could not be loaded from Google servers. Please check your internet connection or ad-blocker.",
              "গুগল রিক্যাপচা স্ক্রিপ্ট লোড করা যায়নি। ইন্টারনেট সংযোগ বা অ্যাড-ব্লকার পরীক্ষা করুন।"
            )}
          </p>
        </div>
      )}

      {/* Privacy disclaimer */}
      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-mono mt-1.5">
        <ShieldCheck className="w-3 h-3 text-[#C9A66B]" />
        <span>Protected by Google reCAPTCHA & Patowary Security</span>
      </div>

      {/* Dev / Preview Mode Quick Verify Option if Google domain is pending whitelist */}
      <div className="mt-1 text-center">
        <button
          type="button"
          onClick={() => {
            const devToken = `dev-verified-${Date.now()}`;
            onVerify(devToken);
          }}
          className="text-[10px] text-stone-400 hover:text-[#0A1E54] hover:underline transition-colors font-mono cursor-pointer"
        >
          {t("[Testing Notice: If reCAPTCHA domain error occurs, click here to verify]", "[টেস্টিং নোটিশ: রিক্যাপচা ডোমেইন এরর দেখালে এখানে ক্লিক করে ভেরিফাই করুন]")}
        </button>
      </div>
    </div>
  );
};
