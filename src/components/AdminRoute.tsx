import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1E54] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-3 border-[#C9A66B] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-widest text-[#C9A66B] uppercase font-bold">
          VERIFYING ADMIN CREDENTIALS...
        </span>
      </div>
    );
  }

  // Not logged in -> redirect to login with admin redirect param
  if (!user) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  // Logged in but not admin -> Access Denied Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] bg-[#F8F3EA] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-red-600 uppercase font-bold">
              SECURITY PROTOCOL 403
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#0A1E54]">
              Access Denied
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              This terminal is reserved for Patowary Fashion system administrators. Your account (<strong className="font-mono text-[#0A1E54]">{user.email}</strong>) does not have elevated privileges.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              to="/profile"
              className="w-full py-3 rounded-full bg-[#0A1E54] hover:bg-[#1A3070] text-[#F8F3EA] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md active:scale-95"
            >
              Return to My Account
            </Link>
            <Link
              to="/"
              className="w-full py-3 rounded-full border border-stone-200 text-stone-600 hover:text-[#0A1E54] text-xs font-mono uppercase tracking-wider font-bold transition-all"
            >
              Back to Store Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
