import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { updatePageSEO } from '../utils/seoUtils';
import { TrackMyOrder } from '../components/TrackMyOrder';
import { 
  ArrowLeft, 
  ShoppingBag, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const TrackOrder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const { t } = useLanguage();

  useEffect(() => {
    if (initialId) {
      updatePageSEO(`Tracking Order #${initialId} | Patowary Logistics`);
    } else {
      updatePageSEO('Track My Order | Live Shipping Radar');
    }
  }, [initialId]);

  const handleOrderFound = (order: any) => {
    if (order?.id && order.id !== searchParams.get('id')) {
      setSearchParams({ id: order.id });
    }
  };

  return (
    <div id="tracking-page-container" className="bg-[#F8F3EA] min-h-screen text-[#111827] py-10 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Breadcrumb & Action bar */}
        <div className="flex items-center justify-between text-xs font-mono">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-[#0A1E54] uppercase tracking-wider transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("Back to Store", "হোম পেজে ফিরুন")}</span>
          </Link>

          <div className="flex items-center gap-4 text-stone-500">
            <Link
              to="/orders"
              className="hover:text-[#0A1E54] hover:underline uppercase tracking-wider"
            >
              {t("My Orders Archive", "আমার অর্ডারসমূহ")}
            </Link>
            <span>•</span>
            <Link
              to="/contact"
              className="hover:text-[#0A1E54] hover:underline uppercase tracking-wider"
            >
              {t("Support Desk", "হেল্পডেস্ক")}
            </Link>
          </div>
        </div>

        {/* Central Core Feature Component: TrackMyOrder */}
        <TrackMyOrder
          initialOrderId={initialId}
          onOrderFound={handleOrderFound}
        />

        {/* Guarantee Banner */}
        <div className="pt-6 border-t border-[#0A1E54]/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl border border-stone-200/60">
            <ShieldCheck className="w-5 h-5 text-[#C9A66B] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-mono uppercase font-bold text-[#0A1E54]">Open Box Inspection</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">Check sizes and fabric quality right at your doorstep before payment.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl border border-stone-200/60">
            <Truck className="w-5 h-5 text-[#C9A66B] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-mono uppercase font-bold text-[#0A1E54]">Express Doorstep</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">Fast delivery nationwide across all 64 districts in Bangladesh.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl border border-stone-200/60">
            <HelpCircle className="w-5 h-5 text-[#C9A66B] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-mono uppercase font-bold text-[#0A1E54]">Dedicated Support</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">Live WhatsApp concierge assistance for size queries and delivery updates.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
