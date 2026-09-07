export interface ReceiptItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  discount?: number;
  note?: string;
}

export interface HeaderLine {
  id: string;
  text: string;
  isBold: boolean;
}

export interface StoreProfile {
  logoUrl?: string;
  logoWidth: number;
  showLogo: boolean;
  lines: HeaderLine[];
  // Backwards compatibility
  name?: string;
  slogan?: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface ReceiptInfoLine {
  id: string;
  label: string;
  value: string;
  isBold: boolean;
}

export interface TransactionInfo {
  lines: ReceiptInfoLine[];
  // Backwards compatibility
  receiptNo?: string;
  date?: string;
  time?: string;
  cashier?: string;
  customerName?: string;
  tableOrOrderNo?: string;
  paymentMethod?: string;
}

export interface ReceiptCalculation {
  subtotal: number;
  discountAmount: number;
  taxPercent: number;
  taxEnabled: boolean;
  serviceCharge: number;
  serviceChargeEnabled: boolean;
  grandTotal: number;
  paymentMethod: string;
  paidAmount: number;
  change: number;
}

export interface FooterLine {
  id: string;
  text: string;
  isBold: boolean;
}

export interface ReceiptFooter {
  lines: FooterLine[];
  showQrCode: boolean;
  qrCodeData: string;
  showBarcode: boolean;
  barcodeData: string;
  // Backwards compatibility
  noteLine1?: string;
  noteLine2?: string;
  customFooterText?: string;
}

export interface PrintSettings {
  paperWidth: '58mm' | '80mm';
  baseFontSize: number; // e.g. 8 to 16 px
  fontFamily: string; // e.g. 'Share Tech Mono', 'Courier New', 'JetBrains Mono', 'VT323', etc.
  lineHeight: number; // e.g. 1.2 to 1.6
  fontSize?: 'small' | 'normal' | 'large';
  separatorStyle: 'dashed' | 'dotted' | 'solid' | 'double' | 'star';
  uppercaseItems: boolean;
}

export interface FullReceiptData {
  store: StoreProfile;
  transaction: TransactionInfo;
  items: ReceiptItem[];
  calculation: ReceiptCalculation;
  footer: ReceiptFooter;
  settings: PrintSettings;
}
