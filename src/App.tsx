import React, { useState, useEffect, useCallback } from 'react';
import { Currency, InvoiceData } from './types/invoice';
import { SAMPLE_INVOICE, BLANK_INVOICE } from './data/sampleInvoice';
import { DEFAULT_CURRENCY } from './constants/currencies';
import { Navbar } from './components/Navbar';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { ResetModal } from './components/ResetModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { exportInvoiceToPDF } from './utils/pdfGenerator';
import { calculateSubtotal, calculateDiscount, calculateTax, calculateTotal, formatCurrency } from './utils/calculations';
import { 
  Download, 
  Eye, 
  Edit3, 
  Printer, 
  Loader2 
} from 'lucide-react';

const STORAGE_KEY = 'invoicecraft_draft_v1';

export default function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If user's stored draft was in USD, switch to INR default per request
        if (parsed.currency?.code === 'USD') {
          parsed.currency = DEFAULT_CURRENCY;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read draft from localStorage', e);
    }
    return SAMPLE_INVOICE;
  });

  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Saved to browser');

  // Add toast helper
  const addToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
      const now = new Date();
      setLastSavedTime(`Saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (e) {
      console.error('Failed to save draft to localStorage', e);
    }
  }, [invoice]);

  // Calculations for quick mobile bar
  const subtotal = calculateSubtotal(invoice.items);
  const discountAmount = calculateDiscount(subtotal, invoice.discountRate, invoice.discountType);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = calculateTax(taxableAmount, invoice.taxRate);
  const currentTotal = calculateTotal(subtotal, discountAmount, taxAmount, invoice.shipping);

  // Actions
  const handleLoadSample = () => {
    setInvoice(SAMPLE_INVOICE);
    addToast('Sample invoice loaded successfully.', 'info');
  };

  const handleClearToBlank = () => {
    setInvoice(BLANK_INVOICE);
    addToast('Invoice reset to blank draft.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    setPdfProgress('Rendering...');

    try {
      await exportInvoiceToPDF('invoice-print-area', {
        filename: invoice.invoiceNumber ? `Invoice-${invoice.invoiceNumber}` : 'Invoice',
        onProgress: (step) => setPdfProgress(step),
      });
      addToast('Invoice PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Opening print dialog to Save as PDF...', 'info');
      window.print();
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Sticky Header */}
      <Navbar
        currentCurrency={invoice.currency}
        onCurrencyChange={(newCurrency: Currency) => {
          setInvoice((prev) => ({
            ...prev,
            currency: newCurrency,
          }));
          addToast(`Currency switched to ${newCurrency.name}`, 'info');
        }}
        onLoadSample={handleLoadSample}
        onReset={() => setIsResetModalOpen(true)}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        isGeneratingPDF={isGeneratingPDF}
        pdfProgress={pdfProgress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastSavedText={lastSavedTime}
      />

      {/* Main Content Area: Two-column layout on Desktop */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: EDIT FORM */}
          <div
            className={`lg:col-span-6 xl:col-span-6 ${
              activeTab === 'form' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="mb-4 flex items-center justify-between no-print">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Invoice Details
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in your invoice details below. Preview updates automatically.
                </p>
              </div>

              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                >
                  <Eye className="h-3.5 w-3.5 text-indigo-600" />
                  View Preview
                </button>
              </div>
            </div>

            <InvoiceForm invoice={invoice} onChange={setInvoice} />
          </div>

          {/* RIGHT COLUMN: LIVE INVOICE PREVIEW */}
          <div
            className={`lg:col-span-6 xl:col-span-6 lg:sticky lg:top-20 ${
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="mb-4 flex items-center justify-between no-print">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Live Preview
                </h2>
                <p className="text-xs text-slate-500">
                  Actual document rendering matching your export.
                </p>
              </div>

              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                >
                  <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                  Back to Editor
                </button>
              </div>
            </div>

            <InvoicePreview
              invoice={invoice}
              onPrint={handlePrint}
              onDownloadPDF={handleDownloadPDF}
              isGeneratingPDF={isGeneratingPDF}
            />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Action Bar (visible on small screens for instant preview/PDF) */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-sm p-3 lg:hidden shadow-lg no-print">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Total Amount
            </span>
            <span className="text-base font-extrabold text-slate-900 font-mono">
              {formatCurrency(currentTotal, invoice.currency)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'form' ? 'preview' : 'form')}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              {activeTab === 'form' ? (
                <>
                  <Eye className="h-3.5 w-3.5 text-indigo-600" />
                  Preview
                </>
              ) : (
                <>
                  <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                  Edit Form
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isGeneratingPDF}
              onClick={handleDownloadPDF}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
              ) : (
                <Download className="h-3.5 w-3.5 text-white" />
              )}
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500 no-print pb-20 lg:pb-4">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">InvoiceCraft</span>
            <span>—</span>
            <span>Private & Client-Side Invoice Maker</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Drafts stay securely in your browser's localStorage. No registration required.
          </p>
        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmClear={handleClearToBlank}
        onConfirmLoadSample={handleLoadSample}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
