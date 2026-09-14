import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Printer, 
  Download, 
  CheckCircle2,
  Clock,
  AlertCircle,
  FileEdit,
  Loader2
} from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { 
  calculateSubtotal, 
  calculateDiscount, 
  calculateTax, 
  calculateTotal, 
  calculateBalanceDue, 
  formatCurrency 
} from '../utils/calculations';
import { THEME_PALETTES } from '../utils/themeStyles';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  onPrint: () => void;
  onDownloadPDF: () => void;
  isGeneratingPDF?: boolean;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onPrint,
  onDownloadPDF,
  isGeneratingPDF = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.95);

  const subtotal = calculateSubtotal(invoice.items);
  const discountAmount = calculateDiscount(subtotal, invoice.discountRate, invoice.discountType);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = calculateTax(taxableAmount, invoice.taxRate);
  const total = calculateTotal(subtotal, discountAmount, taxAmount, invoice.shipping);
  const balanceDue = calculateBalanceDue(total, invoice.amountPaid);

  const theme = THEME_PALETTES[invoice.themeColor] || THEME_PALETTES.indigo;

  // Format date helper for human reading
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800 uppercase tracking-wider shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Paid
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3 py-0.5 text-xs font-bold text-rose-800 uppercase tracking-wider shadow-2xs">
            <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
            Overdue
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700 uppercase tracking-wider shadow-2xs">
            <FileEdit className="h-3.5 w-3.5 text-slate-500" />
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-0.5 text-xs font-bold text-amber-800 uppercase tracking-wider shadow-2xs">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Toolbar for Preview */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white mb-3 shadow-xs text-slate-700 no-print">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            A4 Live Preview
          </span>
        </div>

        {/* Zoom Controls & Quick Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(0.65, prev - 0.1))}
              className="p-1 rounded hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium px-1 text-slate-700 min-w-[38px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(1.25, prev + 0.1))}
              className="p-1 rounded hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(0.95)}
              className="p-1 rounded hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Print"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            disabled={isGeneratingPDF}
            onClick={onDownloadPDF}
            className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-60"
            title="Download PDF"
          >
            {isGeneratingPDF ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <Download className="h-3.5 w-3.5 text-white" />
            )}
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Preview Paper Scroll Container */}
      <div className="flex-1 overflow-auto rounded-xl border border-slate-200 bg-slate-200/50 p-2 sm:p-5 flex justify-center items-start shadow-inner min-h-[500px]">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.1s ease-out',
          }}
          className="w-full max-w-[800px] my-1"
        >
          {/* THE REAL A4 INVOICE SHEET */}
          <div
            id="invoice-print-area"
            className="bg-white text-slate-900 rounded-lg shadow-xl ring-1 ring-slate-900/5 min-h-[1080px] p-8 sm:p-12 relative flex flex-col justify-between"
            style={{ width: '100%', boxSizing: 'border-box' }}
          >
            {/* Top Accent Strip (Executive & Modern) */}
            {invoice.templateStyle === 'executive' && (
              <div className={`h-2.5 w-full -mt-8 sm:-mt-12 -mx-8 sm:-mx-12 mb-8 ${theme.headerBg}`} />
            )}

            <div>
              {/* HEADER ROW: LOGO / COMPANY + INVOICE METADATA */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200">
                {/* Left: Brand / Logo */}
                <div className="max-w-[420px]">
                  {invoice.companyLogo ? (
                    <div className="mb-4">
                      <img
                        src={invoice.companyLogo}
                        alt={invoice.seller.name || 'Company Logo'}
                        className="h-14 max-w-[200px] object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-sm ${theme.headerBg}`}>
                        {invoice.seller.name ? invoice.seller.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                          {invoice.seller.name || 'Your Company Name'}
                        </h2>
                      </div>
                    </div>
                  )}

                  {invoice.companyLogo && (
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-1">
                      {invoice.seller.name || 'Your Company Name'}
                    </h2>
                  )}

                  {/* Seller Details */}
                  <div className="text-xs text-slate-600 space-y-0.5 leading-relaxed">
                    {invoice.seller.address && <p>{invoice.seller.address}</p>}
                    {(invoice.seller.cityStateZip || invoice.seller.country) && (
                      <p>
                        {[invoice.seller.cityStateZip, invoice.seller.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {invoice.seller.taxId && (
                      <p className="font-mono text-[11px] text-slate-500 pt-0.5">
                        Tax ID / VAT: {invoice.seller.taxId}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-1 text-slate-500 text-[11px]">
                      {invoice.seller.email && <span>{invoice.seller.email}</span>}
                      {invoice.seller.phone && <span>{invoice.seller.phone}</span>}
                      {invoice.seller.website && <span>{invoice.seller.website}</span>}
                    </div>
                  </div>
                </div>

                {/* Right: Invoice Title & Meta */}
                <div className="text-left sm:text-right space-y-2 sm:self-start">
                  <div className="flex sm:justify-end items-center gap-3">
                    <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${theme.accentText}`}>
                      INVOICE
                    </h1>
                  </div>

                  <div className="sm:flex sm:justify-end">
                    {getStatusBadge()}
                  </div>

                  <div className="pt-2 text-xs space-y-1">
                    <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                      <span className="font-medium text-slate-500">Invoice Number:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {invoice.invoiceNumber || 'INV-001'}
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                      <span className="font-medium text-slate-500">Invoice Date:</span>
                      <span className="font-semibold text-slate-900">
                        {formatDisplayDate(invoice.invoiceDate)}
                      </span>
                    </div>
                    <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                      <span className="font-medium text-slate-500">Payment Due:</span>
                      <span className="font-semibold text-slate-900">
                        {formatDisplayDate(invoice.dueDate)}
                      </span>
                    </div>
                    {invoice.customer.referenceNo && (
                      <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                        <span className="font-medium text-slate-500">PO / Reference:</span>
                        <span className="font-mono text-slate-900">
                          {invoice.customer.referenceNo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CLIENT / BILL TO SECTION */}
              <div className="py-6 border-b border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Billed To
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {invoice.customer.name || 'Client / Recipient Name'}
                    </h3>
                    <div className="text-xs text-slate-600 space-y-0.5 mt-1 leading-relaxed">
                      {invoice.customer.address && <p>{invoice.customer.address}</p>}
                      {(invoice.customer.cityStateZip || invoice.customer.country) && (
                        <p>
                          {[invoice.customer.cityStateZip, invoice.customer.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      <div className="pt-1 text-[11px] text-slate-500 space-y-0.5">
                        {invoice.customer.email && <p>{invoice.customer.email}</p>}
                        {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Summary Callout Box */}
                  <div className={`p-4 rounded-xl border ${theme.badgeBorder} ${theme.subtleBg} sm:text-right flex flex-col justify-center`}>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Total Balance Due
                    </span>
                    <div className={`text-2xl sm:text-3xl font-extrabold font-mono mt-1 ${theme.accentText}`}>
                      {formatCurrency(balanceDue, invoice.currency)}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Due by {formatDisplayDate(invoice.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* LINE ITEMS TABLE */}
              <div className="py-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b-2 border-slate-900 ${theme.tableHeaderBg}`}>
                      <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-900 w-12 text-center">
                        #
                      </th>
                      <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-900">
                        Item Description
                      </th>
                      <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-900 text-right w-20">
                        Qty
                      </th>
                      <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-900 text-right w-28">
                        Rate
                      </th>
                      <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-slate-900 text-right w-28">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {invoice.items.length === 0 || (invoice.items.length === 1 && !invoice.items[0].description && invoice.items[0].unitPrice === 0) ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-slate-400 italic">
                          No line items added yet. Add items in the left editor.
                        </td>
                      </tr>
                    ) : (
                      invoice.items.map((item, idx) => {
                        const qty = Number(item.quantity) || 0;
                        const price = Number(item.unitPrice) || 0;
                        const lineTotal = qty * price;
                        return (
                          <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-3 text-xs font-mono text-slate-400 text-center align-top">
                              {String(idx + 1).padStart(2, '0')}
                            </td>
                            <td className="py-3 px-3 text-xs text-slate-800 align-top">
                              <p className="font-semibold text-slate-900">
                                {item.description || 'Service or product description'}
                              </p>
                            </td>
                            <td className="py-3 px-3 text-xs text-slate-700 text-right font-mono align-top">
                              {qty}
                            </td>
                            <td className="py-3 px-3 text-xs text-slate-700 text-right font-mono align-top">
                              {formatCurrency(price, invoice.currency)}
                            </td>
                            <td className="py-3 px-3 text-xs font-bold text-slate-900 text-right font-mono align-top">
                              {formatCurrency(lineTotal, invoice.currency)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* TOTALS & SUMMARY SECTION */}
              <div className="pt-2 pb-6 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                  {/* Left Col: Payment Details & Terms */}
                  <div className="sm:col-span-7 space-y-4">
                    {/* Bank Details */}
                    {(invoice.paymentDetails.bankName ||
                      invoice.paymentDetails.accountNumber ||
                      invoice.paymentDetails.routingOrSwift) && (
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                          Payment Instructions (Bank Transfer / Wire)
                        </span>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600">
                          {invoice.paymentDetails.bankName && (
                            <div>
                              <span className="text-slate-400 text-[10px] block">Bank:</span>
                              <span className="font-medium text-slate-800">
                                {invoice.paymentDetails.bankName}
                              </span>
                            </div>
                          )}
                          {invoice.paymentDetails.accountName && (
                            <div>
                              <span className="text-slate-400 text-[10px] block">Beneficiary:</span>
                              <span className="font-medium text-slate-800">
                                {invoice.paymentDetails.accountName}
                              </span>
                            </div>
                          )}
                          {invoice.paymentDetails.accountNumber && (
                            <div>
                              <span className="text-slate-400 text-[10px] block">Account / IBAN:</span>
                              <span className="font-medium text-slate-800 font-mono">
                                {invoice.paymentDetails.accountNumber}
                              </span>
                            </div>
                          )}
                          {invoice.paymentDetails.routingOrSwift && (
                            <div>
                              <span className="text-slate-400 text-[10px] block">SWIFT / Routing:</span>
                              <span className="font-medium text-slate-800 font-mono">
                                {invoice.paymentDetails.routingOrSwift}
                              </span>
                            </div>
                          )}
                        </div>
                        {invoice.paymentDetails.otherNotes && (
                          <p className="mt-2 pt-1 border-t border-slate-200 text-[11px] text-slate-500">
                            {invoice.paymentDetails.otherNotes}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Terms */}
                    {invoice.paymentTerms && (
                      <div className="text-xs">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-0.5">
                          Payment Terms
                        </span>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {invoice.paymentTerms}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {invoice.notes && (
                      <div className="text-xs">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-0.5">
                          Notes & Remarks
                        </span>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {invoice.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Col: Mathematical Calculations */}
                  <div className="sm:col-span-5 sm:pl-4 space-y-2 text-xs">
                    {/* Subtotal */}
                    <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {formatCurrency(subtotal, invoice.currency)}
                      </span>
                    </div>

                    {/* Discount */}
                    {discountAmount > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                        <span>
                          Discount {invoice.discountType === 'percentage' ? `(${invoice.discountRate}%)` : ''}:
                        </span>
                        <span className="font-semibold font-mono">
                          -{formatCurrency(discountAmount, invoice.currency)}
                        </span>
                      </div>
                    )}

                    {/* Tax */}
                    {invoice.taxRate > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                        <span>Tax ({invoice.taxRate}%):</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          +{formatCurrency(taxAmount, invoice.currency)}
                        </span>
                      </div>
                    )}

                    {/* Shipping */}
                    {invoice.shipping > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                        <span>Shipping / Fees:</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          +{formatCurrency(invoice.shipping, invoice.currency)}
                        </span>
                      </div>
                    )}

                    {/* Grand Total */}
                    <div className="flex justify-between py-2 border-b-2 border-slate-900 text-sm font-bold text-slate-900">
                      <span>Total:</span>
                      <span className="font-mono text-base">
                        {formatCurrency(total, invoice.currency)}
                      </span>
                    </div>

                    {/* Amount Paid if applicable */}
                    {invoice.amountPaid > 0 && (
                      <div className="flex justify-between py-1 text-slate-600">
                        <span>Deposit Paid:</span>
                        <span className="font-semibold font-mono text-slate-700">
                          -{formatCurrency(invoice.amountPaid, invoice.currency)}
                        </span>
                      </div>
                    )}

                    {/* Balance Due Highlight */}
                    <div className={`flex justify-between items-center p-2.5 rounded-lg ${theme.badgeBg} border ${theme.badgeBorder} mt-2`}>
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                        Balance Due:
                      </span>
                      <span className={`font-mono text-base font-extrabold ${theme.accentText}`}>
                        {formatCurrency(balanceDue, invoice.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INVOICE FOOTER */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-600">
                  {invoice.seller.name || 'Invoice'}
                </span>
                <span>•</span>
                <span>Invoice #{invoice.invoiceNumber || 'INV-001'}</span>
              </div>
              <div className="text-slate-400">
                Thank you for your business!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
