import { InvoiceData } from '../types/invoice';
import { DEFAULT_CURRENCY } from '../constants/currencies';

// Helper to format date YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDueDateString(daysAhead: number = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateInvoiceNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `INV-${year}-${randomNum}`;
}

export const BLANK_INVOICE: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: getTodayDateString(),
  dueDate: getDueDateString(14),
  status: 'PENDING',
  seller: {
    name: '',
    email: '',
    phone: '',
    address: '',
    cityStateZip: '',
    country: '',
    taxId: '',
    website: '',
  },
  customer: {
    name: '',
    email: '',
    phone: '',
    address: '',
    cityStateZip: '',
    country: '',
    referenceNo: '',
  },
  items: [
    {
      id: 'item-1',
      description: '',
      quantity: 1,
      unitPrice: 0,
    },
  ],
  taxRate: 0,
  discountRate: 0,
  discountType: 'percentage',
  shipping: 0,
  amountPaid: 0,
  currency: DEFAULT_CURRENCY,
  notes: 'Thank you for your business! Please remit payment within the specified due date.',
  paymentTerms: 'Payment is due within 14 days of invoice issue date. Late payments may incur a 1.5% monthly fee.',
  paymentDetails: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingOrSwift: '',
    otherNotes: '',
  },
  companyLogo: null,
  themeColor: 'indigo',
  templateStyle: 'modern',
};

export const SAMPLE_INVOICE: InvoiceData = {
  invoiceNumber: 'INV-2026-8492',
  invoiceDate: getTodayDateString(),
  dueDate: getDueDateString(30),
  status: 'PENDING',
  seller: {
    name: 'Vanguard Digital Studios',
    email: 'billing@vanguardstudio.in',
    phone: '+91 98765 43210',
    address: 'Indiranagar, 100 Feet Road, 4th Block',
    cityStateZip: 'Bengaluru, Karnataka 560038',
    country: 'India',
    taxId: 'GSTIN 29AAAAA0000A1Z5',
    website: 'https://vanguardstudio.in',
  },
  customer: {
    name: 'Meridian Global Enterprises',
    email: 'accounts-payable@meridianglobal.in',
    phone: '+91 91234 56789',
    address: 'Bandra Kurla Complex, Level 14',
    cityStateZip: 'Mumbai, Maharashtra 400051',
    country: 'India',
    referenceNo: 'PO-2026-0941',
  },
  items: [
    {
      id: 'item-1',
      description: 'Design System Architecture & Multi-Platform Component Library (Figma + React)',
      quantity: 1,
      unitPrice: 85000.00,
    },
    {
      id: 'item-2',
      description: 'Web Application Frontend Engineering Sprint (TypeScript, Tailwind CSS)',
      quantity: 40,
      unitPrice: 2500.00,
    },
    {
      id: 'item-3',
      description: 'Performance Optimization & Core Web Vitals Audit',
      quantity: 1,
      unitPrice: 35000.00,
    },
    {
      id: 'item-4',
      description: 'Cloud Infrastructure & Automated CI/CD Deployment Setup',
      quantity: 1,
      unitPrice: 25000.00,
    },
  ],
  taxRate: 18.0,
  discountRate: 5,
  discountType: 'percentage',
  shipping: 0,
  amountPaid: 0,
  currency: DEFAULT_CURRENCY,
  notes: 'Thank you for choosing Vanguard Digital Studios! All project source deliverables and Figma design files have been transferred.',
  paymentTerms: 'Payment due within 30 days of issue date. Bank transfer / NEFT / RTGS / UPI preferred.',
  paymentDetails: {
    bankName: 'HDFC Bank Ltd.',
    accountName: 'Vanguard Digital Studios',
    accountNumber: '50200012345678',
    routingOrSwift: 'HDFC0001234 / UPI: vanguard@hdfcbank',
    otherNotes: 'Please reference invoice number INV-2026-8492 with your payment remittance.',
  },
  companyLogo: null,
  themeColor: 'indigo',
  templateStyle: 'modern',
};
