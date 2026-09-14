import React from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { InvoiceItem, Currency } from '../types/invoice';
import { formatCurrency } from '../utils/calculations';

interface LineItemsFormProps {
  items: InvoiceItem[];
  currency: Currency;
  onUpdateItem: (index: number, field: keyof InvoiceItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onDuplicateItem: (index: number) => void;
}

export const LineItemsForm: React.FC<LineItemsFormProps> = ({
  items,
  currency,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onDuplicateItem,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Line Items ({items.length})
          </h3>
          <p className="text-xs text-slate-500">
            Add billable tasks, services, or products.
          </p>
        </div>
        <button
          id="btn-add-line-item-top"
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const qty = Number(item.quantity) || 0;
          const price = Number(item.unitPrice) || 0;
          const lineTotal = qty * price;

          return (
            <div
              key={item.id || index}
              className="group relative rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all hover:border-slate-300 hover:bg-white shadow-2xs"
            >
              <div className="grid grid-cols-12 gap-2.5 items-start">
                {/* Mobile Item header */}
                <div className="col-span-12 flex items-center justify-between sm:hidden pb-1 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">
                    #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDuplicateItem(index)}
                      className="p-1 text-slate-500 hover:text-indigo-600 rounded"
                      title="Duplicate item"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description input */}
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Description / Service
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => onUpdateItem(index, 'description', e.target.value)}
                    placeholder="e.g. Website Design & Development Sprint"
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      onUpdateItem(index, 'quantity', isNaN(val) ? 0 : val);
                    }}
                    placeholder="1"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Price ({currency.symbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.unitPrice === 0 ? '' : item.unitPrice}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      onUpdateItem(index, 'unitPrice', isNaN(val) ? 0 : val);
                    }}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono shadow-2xs"
                  />
                </div>

                {/* Total & actions */}
                <div className="col-span-4 sm:col-span-2 flex flex-col sm:items-end justify-between">
                  <div className="w-full text-left sm:text-right">
                    <span className="block text-xs font-medium text-slate-600 mb-1">
                      Total
                    </span>
                    <span className="block py-1.5 text-xs font-bold text-slate-900 font-mono truncate">
                      {formatCurrency(lineTotal, currency)}
                    </span>
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden sm:flex items-center gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => onDuplicateItem(index)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                      title="Duplicate item"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add item bottom button */}
      <button
        id="btn-add-line-item-bottom"
        type="button"
        onClick={onAddItem}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700 shadow-2xs"
      >
        <Plus className="h-4 w-4 text-indigo-600" />
        Add Line Item
      </button>
    </div>
  );
};
