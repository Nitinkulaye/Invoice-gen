import React from 'react';
import { AlertTriangle, X, Trash2, Sparkles } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClear: () => void;
  onConfirmLoadSample: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmClear,
  onConfirmLoadSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs no-print">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 id="reset-modal-title" className="text-base font-bold text-slate-900">
              Reset Invoice?
            </h3>
            <p className="text-xs text-slate-500">
              Choose an action for your invoice draft.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Resetting will replace the current draft information saved in your local browser storage.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              onConfirmClear();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-200 py-2.5 px-4 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear to Blank Invoice
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmLoadSample();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 py-2.5 px-4 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Load Sample Invoice
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 py-2 px-4 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
