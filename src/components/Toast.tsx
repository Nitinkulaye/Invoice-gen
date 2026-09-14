import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none no-print">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgClass = 'bg-white border-slate-200 text-slate-800 shadow-lg';
        let iconClass = 'text-emerald-600';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          bgClass = 'bg-white border-rose-200 text-rose-900 shadow-lg';
          iconClass = 'text-rose-600';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgClass = 'bg-white border-indigo-200 text-indigo-900 shadow-lg';
          iconClass = 'text-indigo-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-medium max-w-sm transition-all shadow-md ${bgClass}`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />
            <span className="flex-1">{toast.text}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
