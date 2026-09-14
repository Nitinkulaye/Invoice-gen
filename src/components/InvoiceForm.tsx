import React, { useRef } from 'react';
import { 
  Building2, 
  User, 
  Calendar, 
  Upload, 
  X, 
  Percent, 
  CreditCard, 
  Palette, 
  ChevronDown
} from 'lucide-react';
import { 
  InvoiceData, 
  InvoiceItem, 
  InvoiceStatus, 
  ThemeColor, 
  TemplateStyle 
} from '../types/invoice';
import { CURRENCIES } from '../constants/currencies';
import { LineItemsForm } from './LineItemsForm';
import { THEME_PALETTES } from '../utils/themeStyles';

interface InvoiceFormProps {
  invoice: InvoiceData;
  onChange: (updatedInvoice: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deep update helper
  const updateField = (path: string[], value: any) => {
    const updated = JSON.parse(JSON.stringify(invoice)) as InvoiceData;
    let current: any = updated;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(updated);
  };

  // Line items handlers
  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...invoice, items: newItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    onChange({ ...invoice, items: [...invoice.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    const newItems = invoice.items.filter((_, i) => i !== index);
    onChange({ ...invoice, items: newItems });
  };

  const handleDuplicateItem = (index: number) => {
    const itemToClone = invoice.items[index];
    const cloned: InvoiceItem = {
      ...itemToClone,
      id: `item-${Date.now()}`,
      description: itemToClone.description ? `${itemToClone.description} (Copy)` : '',
    };
    const newItems = [...invoice.items];
    newItems.splice(index + 1, 0, cloned);
    onChange({ ...invoice, items: newItems });
  };

  // Logo upload handler
  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WEBP).');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert('Image file size is too large (max 3MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ ...invoice, companyLogo: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleDropLogo = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    onChange({ ...invoice, companyLogo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Status options
  const statusOptions: { label: string; value: InvoiceStatus }[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Draft', value: 'DRAFT' },
  ];

  // Quick payment presets
  const applyPaymentTermsPreset = (type: string) => {
    if (type === 'net15') {
      onChange({
        ...invoice,
        paymentTerms: 'Payment is due within 15 days of invoice issue date. Thank you for your business.',
      });
    } else if (type === 'net30') {
      onChange({
        ...invoice,
        paymentTerms: 'Net 30 days. Payments received after 30 days are subject to a 1.5% monthly late fee.',
      });
    } else if (type === 'dueReceipt') {
      onChange({
        ...invoice,
        paymentTerms: 'Payment is due immediately upon receipt of this invoice.',
      });
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* SECTION 1: INVOICE META & STATUS */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Calendar className="h-4 w-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Invoice Details & Currency
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Invoice Number */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Invoice Number
            </label>
            <input
              id="input-invoice-number"
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => updateField(['invoiceNumber'], e.target.value)}
              placeholder="INV-2026-001"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Issue Date
            </label>
            <input
              id="input-invoice-date"
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => updateField(['invoiceDate'], e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Due Date
            </label>
            <input
              id="input-due-date"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateField(['dueDate'], e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Currency
            </label>
            <div className="relative">
              <select
                id="select-currency"
                value={invoice.currency.code}
                onChange={(e) => {
                  const found = CURRENCIES.find((c) => c.code === e.target.value);
                  if (found) updateField(['currency'], found);
                }}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.code} ({cur.symbol}) - {cur.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Status Badge Selection */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-600">Status:</span>
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField(['status'], opt.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  invoice.status === opt.value
                    ? opt.value === 'PAID'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : opt.value === 'OVERDUE'
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : opt.value === 'DRAFT'
                      ? 'bg-slate-700 text-white font-bold shadow-xs'
                      : 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: SELLER (YOUR BUSINESS) & LOGO */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Seller Information (Your Business)
            </h2>
          </div>
        </div>

        {/* Logo Upload Box */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Company Logo (Optional)
          </label>
          {invoice.companyLogo ? (
            <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="h-14 w-28 relative flex items-center justify-center p-1.5 rounded bg-white border border-slate-200 overflow-hidden shadow-2xs">
                <img
                  src={invoice.companyLogo}
                  alt="Company Logo"
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">Logo Attached</p>
                <p className="text-[11px] text-slate-500">Rendered in the invoice header</p>
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropLogo}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 text-center cursor-pointer transition-colors hover:border-indigo-500 hover:bg-indigo-50/20"
            >
              <Upload className="h-5 w-5 text-slate-400 mb-1" />
              <p className="text-xs font-medium text-slate-700">
                Click to upload logo or drag & drop
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, SVG or WEBP (Max 3MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleLogoUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Business details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Business / Freelancer Name *
            </label>
            <input
              id="input-seller-name"
              type="text"
              value={invoice.seller.name}
              onChange={(e) => updateField(['seller', 'name'], e.target.value)}
              placeholder="e.g. Vanguard Digital Studios"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="input-seller-email"
              type="email"
              value={invoice.seller.email}
              onChange={(e) => updateField(['seller', 'email'], e.target.value)}
              placeholder="billing@vanguardstudio.io"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              id="input-seller-phone"
              type="text"
              value={invoice.seller.phone}
              onChange={(e) => updateField(['seller', 'phone'], e.target.value)}
              placeholder="+1 (415) 890-3421"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Street Address
            </label>
            <input
              id="input-seller-address"
              type="text"
              value={invoice.seller.address}
              onChange={(e) => updateField(['seller', 'address'], e.target.value)}
              placeholder="548 Market Street, Suite 390"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              City, State, Zip Code
            </label>
            <input
              id="input-seller-city"
              type="text"
              value={invoice.seller.cityStateZip}
              onChange={(e) => updateField(['seller', 'cityStateZip'], e.target.value)}
              placeholder="San Francisco, CA 94104"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Country
            </label>
            <input
              id="input-seller-country"
              type="text"
              value={invoice.seller.country}
              onChange={(e) => updateField(['seller', 'country'], e.target.value)}
              placeholder="United States"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tax ID / VAT / GST / EIN
            </label>
            <input
              id="input-seller-taxid"
              type="text"
              value={invoice.seller.taxId}
              onChange={(e) => updateField(['seller', 'taxId'], e.target.value)}
              placeholder="US-EIN 94-3829104"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Website
            </label>
            <input
              id="input-seller-website"
              type="text"
              value={invoice.seller.website}
              onChange={(e) => updateField(['seller', 'website'], e.target.value)}
              placeholder="https://vanguardstudio.io"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: CUSTOMER (BILL TO) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <User className="h-4 w-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Customer Information (Bill To)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Client / Company Name *
            </label>
            <input
              id="input-customer-name"
              type="text"
              value={invoice.customer.name}
              onChange={(e) => updateField(['customer', 'name'], e.target.value)}
              placeholder="e.g. Meridian Global Enterprises"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Client Email
            </label>
            <input
              id="input-customer-email"
              type="email"
              value={invoice.customer.email}
              onChange={(e) => updateField(['customer', 'email'], e.target.value)}
              placeholder="invoices@meridianglobal.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Client Phone
            </label>
            <input
              id="input-customer-phone"
              type="text"
              value={invoice.customer.phone}
              onChange={(e) => updateField(['customer', 'phone'], e.target.value)}
              placeholder="+1 (212) 555-0198"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Billing Address
            </label>
            <input
              id="input-customer-address"
              type="text"
              value={invoice.customer.address}
              onChange={(e) => updateField(['customer', 'address'], e.target.value)}
              placeholder="767 Fifth Avenue, Floor 24"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              City, State, Zip Code
            </label>
            <input
              id="input-customer-city"
              type="text"
              value={invoice.customer.cityStateZip}
              onChange={(e) => updateField(['customer', 'cityStateZip'], e.target.value)}
              placeholder="New York, NY 10153"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Country
            </label>
            <input
              id="input-customer-country"
              type="text"
              value={invoice.customer.country}
              onChange={(e) => updateField(['customer', 'country'], e.target.value)}
              placeholder="United States"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              PO Number / Client Project Reference
            </label>
            <input
              id="input-customer-po"
              type="text"
              value={invoice.customer.referenceNo || ''}
              onChange={(e) => updateField(['customer', 'referenceNo'], e.target.value)}
              placeholder="e.g. PO-2026-0941"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: LINE ITEMS */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <LineItemsForm
          items={invoice.items}
          currency={invoice.currency}
          onUpdateItem={handleUpdateItem}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onDuplicateItem={handleDuplicateItem}
        />
      </div>

      {/* SECTION 5: TAX, DISCOUNT & ADJUSTMENTS */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Percent className="h-4 w-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Tax, Discount & Adjustments
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tax Percentage */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Tax Rate (%)
            </label>
            <div className="relative">
              <input
                id="input-tax-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={invoice.taxRate === 0 ? '' : invoice.taxRate}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateField(['taxRate'], isNaN(val) ? 0 : val);
                }}
                placeholder="0"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-7 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
              />
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
                %
              </span>
            </div>
          </div>

          {/* Discount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-700">Discount</label>
              <div className="flex rounded bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => updateField(['discountType'], 'percentage')}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    invoice.discountType === 'percentage'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => updateField(['discountType'], 'fixed')}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    invoice.discountType === 'fixed'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  {invoice.currency.symbol}
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                id="input-discount-rate"
                type="number"
                min="0"
                step="any"
                value={invoice.discountRate === 0 ? '' : invoice.discountRate}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateField(['discountRate'], isNaN(val) ? 0 : val);
                }}
                placeholder="0"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-7 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
              />
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
                {invoice.discountType === 'percentage' ? '%' : invoice.currency.symbol}
              </span>
            </div>
          </div>

          {/* Shipping / Extra fees */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Shipping / Fees ({invoice.currency.symbol})
            </label>
            <input
              id="input-shipping"
              type="number"
              min="0"
              step="any"
              value={invoice.shipping === 0 ? '' : invoice.shipping}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                updateField(['shipping'], isNaN(val) ? 0 : val);
              }}
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
            />
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Deposit Paid ({invoice.currency.symbol})
            </label>
            <input
              id="input-amount-paid"
              type="number"
              min="0"
              step="any"
              value={invoice.amountPaid === 0 ? '' : invoice.amountPaid}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                updateField(['amountPaid'], isNaN(val) ? 0 : val);
              }}
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: PAYMENT TERMS, BANK DETAILS & NOTES */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <CreditCard className="h-4 w-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Payment Details & Terms
          </h2>
        </div>

        {/* Bank transfer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={invoice.paymentDetails.bankName}
              onChange={(e) => updateField(['paymentDetails', 'bankName'], e.target.value)}
              placeholder="e.g. JPMorgan Chase or Silicon Valley Bank"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Beneficiary / Account Name
            </label>
            <input
              type="text"
              value={invoice.paymentDetails.accountName}
              onChange={(e) => updateField(['paymentDetails', 'accountName'], e.target.value)}
              placeholder="e.g. Vanguard Digital Studios LLC"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Account / IBAN Number
            </label>
            <input
              type="text"
              value={invoice.paymentDetails.accountNumber}
              onChange={(e) => updateField(['paymentDetails', 'accountNumber'], e.target.value)}
              placeholder="e.g. 123456789 or GB29..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Routing / SWIFT / BIC
            </label>
            <input
              type="text"
              value={invoice.paymentDetails.routingOrSwift}
              onChange={(e) => updateField(['paymentDetails', 'routingOrSwift'], e.target.value)}
              placeholder="e.g. SVBKUS6S / 121000358"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
            />
          </div>
        </div>

        {/* Payment terms with quick presets */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-700">Payment Terms</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => applyPaymentTermsPreset('dueReceipt')}
                className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Due on Receipt
              </button>
              <button
                type="button"
                onClick={() => applyPaymentTermsPreset('net15')}
                className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Net 15
              </button>
              <button
                type="button"
                onClick={() => applyPaymentTermsPreset('net30')}
                className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Net 30
              </button>
            </div>
          </div>
          <input
            type="text"
            value={invoice.paymentTerms}
            onChange={(e) => updateField(['paymentTerms'], e.target.value)}
            placeholder="e.g. Net 30 days. Direct ACH transfer or Wire preferred."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
          />
        </div>

        {/* Client Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Client Notes / Remarks
          </label>
          <textarea
            rows={2}
            value={invoice.notes}
            onChange={(e) => updateField(['notes'], e.target.value)}
            placeholder="Thank you for your business! Please feel free to reach out with any questions."
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
          />
        </div>
      </div>

      {/* SECTION 7: INVOICE STYLING & ACCENT THEME */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Palette className="h-4 w-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Accent Color & Layout Style
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Accent Color */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Color Theme
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(THEME_PALETTES) as ThemeColor[]).map((colorKey) => {
                const palette = THEME_PALETTES[colorKey];
                const isSelected = invoice.themeColor === colorKey;
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => updateField(['themeColor'], colorKey)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-600 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${palette.brandDot}`} />
                    <span className="capitalize">{colorKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Style */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Layout Style
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['modern', 'minimal', 'executive'] as TemplateStyle[]).map((style) => {
                const isSelected = invoice.templateStyle === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => updateField(['templateStyle'], style)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium text-center capitalize transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-600 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
