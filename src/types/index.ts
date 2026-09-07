export interface ReceiptItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  discount?: number;
  note?: string;
}

export interface StoreProfile {
  name: string;
  slogan: string;
  logoUrl?: string;
  logoWidth: number;
  showLogo: boolean;
  address: string;
  phone: string;
  website?: string;
}

export interface TransactionInfo {
  receiptNo: string;
  date: string;
  time: string;
  cashier: string;
  customerName?: string;
  tableOrOrderNo?: string;
  paymentMethod: string;
}

export interface ReceiptCalculation {
  subtotal: number;
  discountAmount: number;
  taxPercent: number;
  taxEnabled: boolean;
  serviceCharge: number;
  serviceChargeEnabled: boolean;
  grandTotal: number;
  paidAmount: number;
  change: number;
}

export interface ReceiptFooter {
  noteLine1: string;
  noteLine2: string;
  customFooterText?: string;
  showQrCode: boolean;
  qrCodeData: string;
  showBarcode: boolean;
  barcodeData: string;
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
