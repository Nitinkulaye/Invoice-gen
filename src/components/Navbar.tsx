import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Edit3,
  Loader2,
  ChevronDown,
  Coins
} from 'lucide-react';
import { Currency } from '../types/invoice';
import { CURRENCIES } from '../constants/currencies';

interface NavbarProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onLoadSample: () => void;
  onReset: () => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  isGeneratingPDF: boolean;
  pdfProgress: string;
  activeTab: 'form' | 'preview';
  setActiveTab: (tab: 'form' | 'preview') => void;
  lastSavedText: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  onLoadSample,
  onReset,
  onPrint,
  onDownloadPDF,
  isGeneratingPDF,
  pdfProgress,
  activeTab,
  setActiveTab,
  lastSavedText,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs no-print">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  Invoice<span className="text-indigo-600">Craft</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {currentCurrency.symbol} {currentCurrency.code}
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-500 sm:block">
                Professional Invoice Generator · Private & Free
              </p>
            </div>
          </div>

          {/* Controls & Actions Container */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Currency Selector Dropdown */}
            <div className="relative">
              <label htmlFor="header-currency-select" className="sr-only">
                Select Currency
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors shadow-2xs">
                <span className="pl-2 pr-1 text-slate-500 hidden xs:inline-flex">
                  <Coins className="h-3.5 w-3.5 text-indigo-600" />
                </span>
                <select
                  id="header-currency-select"
                  value={currentCurrency.code}
                  onChange={(e) => {
                    const found = CURRENCIES.find((c) => c.code === e.target.value);
                    if (found) onCurrencyChange(found);
                  }}
                  className="appearance-none bg-transparent py-1.5 pl-2 pr-6 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none"
                  title="Change Currency"
                >
                  {CURRENCIES.map((cur) => (
                    <option key={cur.code} value={cur.code}>
                      {cur.symbol} {cur.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Autosave status indicator (Desktop only) */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 font-medium px-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{lastSavedText}</span>
            </div>

            {/* Load Sample Button */}
            <button
              id="btn-load-sample"
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors"
              title="Load sample invoice"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="hidden md:inline">Sample</span>
            </button>

            {/* Reset Button */}
            <button
              id="btn-reset-invoice"
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 shadow-2xs transition-colors"
              title="Reset invoice"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Print Invoice Button */}
            <button
              id="btn-print-invoice"
              type="button"
              onClick={onPrint}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Download PDF Button */}
            <button
              id="btn-download-pdf"
              type="button"
              disabled={isGeneratingPDF}
              onClick={onDownloadPDF}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              title="Download Invoice as PDF"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                  <span className="hidden sm:inline">{pdfProgress || 'Exporting...'}</span>
                  <span className="sm:hidden">PDF</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-white" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden font-bold">PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dedicated Segmented Tab Strip */}
        <div className="lg:hidden pb-2.5 pt-1">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-inner">
            <button
              id="mobile-tab-edit"
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
              <span>Edit Invoice</span>
            </button>
            <button
              id="mobile-tab-preview"
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="h-3.5 w-3.5 text-indigo-600" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
