import { Currency, InvoiceItem } from '../types/invoice';

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + (qty * price);
  }, 0);
}

export function calculateDiscount(
  subtotal: number,
  discountRate: number,
  discountType: 'percentage' | 'fixed'
): number {
  const rate = Number(discountRate) || 0;
  if (rate <= 0 || subtotal <= 0) return 0;
  if (discountType === 'percentage') {
    return Math.min(subtotal, (subtotal * rate) / 100);
  }
  return Math.min(subtotal, rate);
}

export function calculateTax(
  taxableAmount: number,
  taxRate: number
): number {
  const rate = Number(taxRate) || 0;
  if (rate <= 0 || taxableAmount <= 0) return 0;
  return (taxableAmount * rate) / 100;
}

export function calculateTotal(
  subtotal: number,
  discountAmount: number,
  taxAmount: number,
  shipping: number = 0
): number {
  const ship = Number(shipping) || 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  return Math.max(0, taxableSubtotal + taxAmount + ship);
}

export function calculateBalanceDue(total: number, amountPaid: number = 0): number {
  const paid = Number(amountPaid) || 0;
  return Math.max(0, total - paid);
}

export function formatCurrency(amount: number, currency: Currency): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    const locale = currency.code === 'INR' ? 'en-IN' : 'en-US';
    // Format with 2 decimal places and proper locale comma grouping
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);

    return `${currency.symbol}${formattedNumber}`;
  } catch {
    return `${currency.symbol}${safeAmount.toFixed(2)}`;
  }
}
