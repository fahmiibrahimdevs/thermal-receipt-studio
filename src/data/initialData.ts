import { FullReceiptData } from '../types';

export const defaultReceiptData: FullReceiptData = {
  store: {
    name: 'KOPI NUSANTARA & ROASTERY',
    slogan: 'Artisan Coffee & Good Moments',
    logoUrl: '',
    logoWidth: 80,
    showLogo: false,
    address: 'Jl. Sudirman No. 45, Jakarta Selatan\nDKI Jakarta 12190',
    phone: '0812-3456-7890',
    website: 'www.kopinusantara.id'
  },
  transaction: {
    receiptNo: 'INV-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-0042',
    date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    cashier: 'Fahmi Ibrahim',
    customerName: 'Budi Santoso',
    tableOrOrderNo: 'Meja 07',
    paymentMethod: 'Tunai'
  },
  items: [
    {
      id: '1',
      name: 'Kopi Susu Gula Aren (L)',
      qty: 2,
      price: 24000,
      discount: 0,
      note: 'Less Sugar, Ice Normal'
    },
    {
      id: '2',
      name: 'Croissant Butter Artisan',
      qty: 1,
      price: 28000,
      discount: 3000,
      note: 'Warm Heated'
    },
    {
      id: '3',
      name: 'Manual Brew V60 Gayo',
      qty: 1,
      price: 32000,
      discount: 0
    }
  ],
  calculation: {
    subtotal: 105000,
    discountAmount: 3000,
    taxPercent: 10,
    taxEnabled: true,
    serviceCharge: 5000,
    serviceChargeEnabled: false,
    grandTotal: 112200,
    paidAmount: 150000,
    change: 37800
  },
  footer: {
    noteLine1: 'Terima kasih atas kunjungan Anda!',
    noteLine2: 'Barang yang sudah dibeli tidak dapat ditukar',
    customFooterText: 'Follow IG: @kopinusantara.id',
    showQrCode: true,
    qrCodeData: 'https://kopinusantara.id/feedback',
    showBarcode: false,
    barcodeData: 'INV202609070042'
  },
  settings: {
    paperWidth: '58mm',
    baseFontSize: 11,
    fontFamily: 'Share Tech Mono',
    lineHeight: 1.35,
    separatorStyle: 'dashed',
    uppercaseItems: true
  }
};

export const samplePresets: Record<string, Partial<FullReceiptData>> = {
  cafe: {
    store: {
      name: 'KOPI NUSANTARA & ROASTERY',
      slogan: 'Artisan Coffee & Good Moments',
      logoUrl: '',
      logoWidth: 80,
      showLogo: false,
      address: 'Jl. Sudirman No. 45, Jakarta Selatan',
      phone: '0812-3456-7890',
      website: 'www.kopinusantara.id'
    },
    items: [
      { id: '1', name: 'Kopi Susu Gula Aren', qty: 2, price: 24000 },
      { id: '2', name: 'Butter Croissant', qty: 1, price: 28000 },
      { id: '3', name: 'Americano Ice', qty: 1, price: 22000 }
    ],
    footer: {
      noteLine1: 'Terima kasih atas kunjungan Anda!',
      noteLine2: 'Wifi Password: ngopiduluya',
      customFooterText: 'Instagram: @kopinusantara.id',
      showQrCode: true,
      qrCodeData: 'https://kopinusantara.id',
      showBarcode: false,
      barcodeData: 'INV-CAFE-001'
    }
  },
  retail: {
    store: {
      name: 'MINIMARKET JAYA ABADI',
      slogan: 'Belanja Hemat & Lengkap Setiap Hari',
      logoUrl: '',
      logoWidth: 80,
      showLogo: false,
      address: 'Jl. Merdeka Barat No. 12, Bandung',
      phone: '0857-1234-5678',
      website: ''
    },
    items: [
      { id: '1', name: 'Minyak Goreng 2L', qty: 1, price: 34500 },
      { id: '2', name: 'Beras Premium 5kg', qty: 1, price: 74000 },
      { id: '3', name: 'Gula Pasir 1kg', qty: 2, price: 17500 },
      { id: '4', name: 'Air Mineral 600ml', qty: 3, price: 3500 }
    ],
    footer: {
      noteLine1: 'Terima kasih telah berbelanja!',
      noteLine2: 'Komplain wajib sertakan struk ini max 1x24 jam',
      customFooterText: 'Layanan Konsumen: 0800-123-4567',
      showQrCode: false,
      qrCodeData: '',
      showBarcode: true,
      barcodeData: '8992761001234'
    }
  },
  service: {
    store: {
      name: 'NEXA TECH COMPUTER & REPAIR',
      slogan: 'Solusi Service Laptop & PC Terpercaya',
      logoUrl: '',
      logoWidth: 80,
      showLogo: false,
      address: 'Gedung Harco Mangga Dua Lt. 2 Blok B-14',
      phone: '0813-8888-9999',
      website: 'www.nexatech.my.id'
    },
    items: [
      { id: '1', name: 'Jasa Install Ulang OS & Driver', qty: 1, price: 100000 },
      { id: '2', name: 'SSD NVMe M.2 512GB Gen3', qty: 1, price: 475000 },
      { id: '3', name: 'Thermal Paste Artic MX-4', qty: 1, price: 50000 }
    ],
    footer: {
      noteLine1: 'Garansi Servis 30 Hari sejak nota diterbitkan',
      noteLine2: 'Segel rusak / human error membatalkan garansi',
      customFooterText: 'Terima kasih atas kepercayaan Anda!',
      showQrCode: true,
      qrCodeData: 'https://nexatech.my.id/cek-garansi',
      showBarcode: true,
      barcodeData: 'SRV-2026-9081'
    }
  }
};
