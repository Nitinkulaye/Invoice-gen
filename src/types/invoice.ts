export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface SellerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  country: string;
  taxId: string; // e.g. VAT / EIN / GST number
  website: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  country: string;
  referenceNo?: string; // PO Number or Project Reference
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export type ThemeColor = 'indigo' | 'emerald' | 'blue' | 'slate' | 'violet' | 'rose' | 'amber';
export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT';
export type TemplateStyle = 'modern' | 'minimal' | 'executive';

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingOrSwift: string;
  otherNotes: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  seller: SellerInfo;
  customer: CustomerInfo;
  items: InvoiceItem[];
  taxRate: number; // percentage (e.g. 10 for 10%)
  discountRate: number; // percentage or fixed
  discountType: 'percentage' | 'fixed';
  shipping: number;
  amountPaid: number;
  currency: Currency;
  notes: string;
  paymentTerms: string;
  paymentDetails: PaymentDetails;
  companyLogo: string | null;
  themeColor: ThemeColor;
  templateStyle: TemplateStyle;
}
