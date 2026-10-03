import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  PackageCheck, 
  Truck, 
  Radio, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Sparkles,
  AlertCircle,
  Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface OrderProgressBarProps {
  status: string; // 'Received' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Completed' | string
  createdAt?: string;
  orderId?: string;
  className?: string;
  theme?: 'dark' | 'light';
  showDetailsCard?: boolean;
}

interface StepConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const OrderProgressBar: React.FC<OrderProgressBarProps> = ({
  status = 'Processing',
  createdAt,
  orderId,
  className = '',
  theme = 'dark',
  showDetailsCard = true
}) => {
  const { t } = useLanguage();

  const STEPS: StepConfig[] = [
    {
      id: 'Received',
      title: t('Order Placed'),
      subtitle: t('Confirmed'),
      description: t('Order recorded in digital dispatch ledger. Verification completed.'),
      icon: Package
    },
    {
      id: 'Processing',
      title: t('Processing'),
      subtitle: t('Quality Check & Pack'),
      description: t('Garments inspected, tagged, and packed in luxury dust bags at Dhaka atelier.'),
      icon: PackageCheck
    },
    {
      id: 'Shipped',
      title: t('In Transit'),
      subtitle: t('Handed to Courier'),
      description: t('Parcel handed over to Steadfast / Pathao express courier for city transit.'),
      icon: Truck
    },
    {
      id: 'Out for Delivery',
      title: t('Out for Delivery'),
      subtitle: t('Rider En Route'),
      description: t('Delivery agent is out in your local area heading to your doorstep.'),
      icon: Radio
    },
    {
      id: 'Completed',
      title: t('Delivered'),
      subtitle: t('Verified at Doorstep'),
      description: t('Package handed over, open-box inspection verified, and payment collected.'),
      icon: CheckCircle2
    }
  ];

  // Dynamic status index resolver (supports variations)
  const getActiveStepIndex = (statusStr: string): number => {
    const s = (statusStr || '').trim().toLowerCase();
    if (s.includes('complete') || s.includes('deliver') || s.includes('received by customer')) return 4;
    if (s.includes('out') || s.includes('rider') || s.includes('enroute') || s.includes('en route')) return 3;
    if (s.includes('ship') || s.includes('transit') || s.includes('dispatch')) return 2;
    if (s.includes('process') || s.includes('pack') || s.includes('atelier')) return 1;
    return 0; // Default to 'Received'
  };

  const activeIndex = getActiveStepIndex(status);
  const currentStep = STEPS[activeIndex] || STEPS[1];
  const progressPercent = (activeIndex / (STEPS.length - 1)) * 100;

  const isDark = theme === 'dark';

  return (
    <div className={`w-full space-y-6 ${className}`}>
      
      {/* 1. Header Progress Summary Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {activeIndex === 4 ? t('COMPLETED') : t('LIVE SHIPPING RADAR')}
          </span>
          <span className={`text-xs font-mono font-bold ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            {t('Step')} {activeIndex + 1} {t('of')} {STEPS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            {t('Current Status')}:
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#C9A66B]/20 text-[#C9A66B] border border-[#C9A66B]/40 text-xs font-mono font-bold uppercase tracking-wide">
            {currentStep.title}
          </span>
        </div>
      </div>

      {/* 2. Visual Step-by-Step Stepper Component */}
      <div className="relative pt-4 pb-2 px-2 sm:px-6">
        {/* Continuous Connecting Line Background */}
        <div 
          className={`absolute top-9 left-6 right-6 sm:left-12 sm:right-12 h-1 rounded-full -z-0 ${
            isDark ? 'bg-white/10' : 'bg-stone-200'
          }`} 
        />

        {/* Dynamic Glowing Progress Fill Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-9 left-6 sm:left-12 h-1 bg-gradient-to-r from-emerald-500 via-[#C9A66B] to-[#C9A66B] rounded-full shadow-[0_0_12px_rgba(201,166,107,0.6)] -z-0"
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-5 gap-1 sm:gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isPending = idx > activeIndex;
            const Icon = step.icon;

            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center text-center group cursor-default"
              >
                {/* Node Circle */}
                <div className="relative flex items-center justify-center">
                  {/* Active Radar Pulse Ring for Current Step */}
                  {isCurrent && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-[#C9A66B] -z-10"
                    />
                  )}

                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                      isCurrent
                        ? 'bg-[#C9A66B] text-[#0A1E54] ring-4 ring-[#C9A66B]/30 shadow-[0_0_15px_rgba(201,166,107,0.5)] font-bold'
                        : isCompleted
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-500/40'
                        : isDark
                        ? 'bg-[#0A1E54] text-white/30 border border-white/15'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </motion.div>
                </div>

                {/* Step Title Label */}
                <div className="mt-3 space-y-0.5 max-w-[85px] sm:max-w-[120px]">
                  <span 
                    className={`block text-[10px] sm:text-xs font-mono font-bold uppercase tracking-tight leading-tight ${
                      isCurrent 
                        ? 'text-[#C9A66B]' 
                        : isCompleted 
                        ? (isDark ? 'text-white' : 'text-[#0A1E54]') 
                        : (isDark ? 'text-white/40' : 'text-stone-400')
                    }`}
                  >
                    {step.title}
                  </span>
                  
                  {/* Step Subtitle / Status indicator */}
                  <span 
                    className={`hidden sm:block text-[9px] font-sans leading-tight ${
                      isCurrent 
                        ? 'text-[#C9A66B]/80 font-medium' 
                        : isCompleted 
                        ? 'text-emerald-400/90' 
                        : 'text-stone-500'
                    }`}
                  >
                    {isCurrent ? t('In Progress') : isCompleted ? t('Completed') : step.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Real-Time Stage Insights Details Card */}
      {showDetailsCard && (
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            isDark 
              ? 'bg-white/5 border-white/10 text-white' 
              : 'bg-stone-50/90 border-stone-200 text-stone-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#C9A66B]/15 text-[#C9A66B] shrink-0 mt-0.5 border border-[#C9A66B]/30">
                <currentStep.icon className="w-5 h-5" />
              </div>
              
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs sm:text-sm font-mono font-bold uppercase tracking-wide ${isDark ? 'text-white' : 'text-[#0A1E54]'}`}>
                    {currentStep.title} — {currentStep.subtitle}
                  </h4>
                  {activeIndex < 4 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C9A66B]/20 text-[#C9A66B] text-[9px] font-mono uppercase font-bold">
                      <span className="w-1 h-1 rounded-full bg-[#C9A66B] animate-ping" />
                      ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-mono uppercase font-bold">
                      COMPLETED
                    </span>
                  )}
                </div>
                
                <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-white/80' : 'text-stone-600'}`}>
                  {currentStep.description}
                </p>
              </div>
            </div>

            {/* Stage Quick Facts */}
            <div className={`flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l ${isDark ? 'border-white/10' : 'border-stone-200'} pt-3 sm:pt-0 sm:pl-5 shrink-0 text-left sm:text-right text-[11px] font-mono gap-1`}>
              <div className="flex items-center gap-1.5 text-[#C9A66B] font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {activeIndex >= 3 ? t('Doorstep Arrival Imminent') : t('Est. 24-48h Delivery')}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('Open Box Inspection')}</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
};
