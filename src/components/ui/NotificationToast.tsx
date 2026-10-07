import React from 'react';
import { useApp } from '../../store/AppContext';
import { Bell, CheckCircle2, AlertCircle, TrendingUp, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification, currentRole } = useApp();

  // Filter notifications relevant to current role
  const relevant = notifications.filter(
    (n) => n.targetRole === 'all' || n.targetRole === currentRole
  ).slice(0, 3);

  if (relevant.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[90%] pointer-events-none">
      {relevant.map((n) => {
        const isOrder = n.type === 'order';
        const isEarn = n.type === 'earnings';
        const isAlert = n.type === 'alert';

        return (
          <div
            key={n.id}
            className="pointer-events-auto bg-white/98 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-3.5 shadow-lg flex items-start gap-3 animate-in slide-in-from-top-4 duration-300"
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isOrder
                  ? 'bg-[#FF6B35]/10 text-[#FF6B35]'
                  : isEarn
                  ? 'bg-green-100 text-green-700'
                  : isAlert
                  ? 'bg-red-100 text-red-700'
                  : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {isOrder ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isEarn ? (
                <TrendingUp className="w-4 h-4" />
              ) : isAlert ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-neutral-900 leading-tight">{n.title}</h5>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
              <span className="text-[10px] text-neutral-400 font-mono mt-1 block">{n.timestamp}</span>
            </div>

            <button
              onClick={() => dismissNotification(n.id)}
              className="text-neutral-400 hover:text-neutral-700 p-1 -mr-1 -mt-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
