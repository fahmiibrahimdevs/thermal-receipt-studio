import { FullReceiptData } from '../types';

export const defaultReceiptData: FullReceiptData = {
  store: {
    logoUrl: '',
    logoWidth: 80,
    showLogo: false,
    lines: [
      { id: '1', text: 'KOPI NUSANTARA & ROASTERY', isBold: true },
      { id: '2', text: 'Artisan Coffee & Good Moments', isBold: false },
      { id: '3', text: 'Jl. Sudirman No. 45, Jakarta Selatan', isBold: false },
      { id: '4', text: 'Telp/WA: 0812-3456-7890', isBold: false },
      { id: '5', text: 'www.kopinusantara.id', isBold: false }
    ]
  },
  transaction: {
    lines: [
      { id: '1', label: 'No. Nota', value: 'INV-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-0042', isBold: true },
      { id: '2', label: 'Tanggal', value: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }), isBold: false },
      { id: '3', label: 'Waktu', value: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), isBold: false },
      { id: '4', label: 'Kasir', value: 'Fahmi Ibrahim', isBold: false },
      { id: '5', label: 'Pelanggan', value: 'Budi Santoso', isBold: false },
      { id: '6', label: 'No. Meja', value: 'Meja 07', isBold: true }
    ]
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
    paymentMethod: 'Tunai',
    paidAmount: 150000,
    change: 37800
  },
  footer: {
    lines: [
      { id: '1', text: 'Terima kasih atas kunjungan Anda!', isBold: true },
      { id: '2', text: 'Barang yang sudah dibeli tidak dapat ditukar', isBold: false },
      { id: '3', text: 'Follow IG: @kopinusantara.id', isBold: false }
    ],
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
      logoUrl: '',
      logoWidth: 80,
      showLogo: false,
      lines: [
        { id: '1', text: 'KOPI NUSANTARA & ROASTERY', isBold: true },
        { id: '2', text: 'Artisan Coffee & Good Moments', isBold: false },
        { id: '3', text: 'Jl. Sudirman No. 45, Jakarta Selatan', isBold: false },
        { id: '4', text: 'Telp: 0812-3456-7890', isBold: false },
        { id: '5', text: 'www.kopinusantara.id', isBold: false }
      ]
    },
    transaction: {
      lines: [
        { id: '1', label: 'No. Nota', value: 'INV-CAFE-001', isBold: true },
        { id: '2', label: 'Tanggal', value: '07 Sep 2026', isBold: false },
        { id: '3', label: 'Waktu', value: '20:00', isBold: false },
        { id: '4', label: 'Kasir', value: 'Barista 1', isBold: false },
        { id: '5', label: 'No. Meja', value: 'Meja 05', isBold: true }
      ]
    },
    items: [
      { id: '1', name: 'Kopi Susu Gula Aren', qty: 2, price: 24000 },
      { id: '2', name: 'Butter Croissant', qty: 1, price: 28000 },
      { id: '3', name: 'Americano Ice', qty: 1, price: 22000 }
    ],
    calculation: {
      subtotal: 74000,
      discountAmount: 0,
      taxPercent: 10,
      taxEnabled: false,
      serviceCharge: 0,
      serviceChargeEnabled: false,
      grandTotal: 74000,
      paymentMethod: 'QRIS',
      paidAmount: 74000,
      change: 0
    },
    footer: {
      lines: [
        { id: '1', text: 'Terima kasih atas kunjungan Anda!', isBold: true },
        { id: '2', text: 'Wifi Password: ngopiduluya', isBold: false },
        { id: '3', text: 'Instagram: @kopinusantara.id', isBold: false }
      ],
      showQrCode: true,
      qrCodeData: 'https://kopinusantara.id',
      showBarcode: false,
      barcodeData: 'INV-CAFE-001'
    }
  },
  retail: {
    store: {
      logoUrl: '',
      logoWidth: 80,
      showLogo: false,
      lines: [
        { id: '1', text: 'MINIMARKET JAYA ABADI', isBold: true },
        { id: '2', text: 'Belanja Hemat & Lengkap Setiap Hari', isBold: false },
        { id: '3', text: 'Jl. Merdeka Barat No. 12, Bandung', isBold: false },
        { id: '4', text: 'Telp: 0857-1234-5678', isBold: false }
      ]
    },
    transaction: {
      lines: [
        { id: '1', label: 'No. Transaksi', value: 'TRX-89210', isBold: true },
        { id: '2', label: 'Tanggal', value: '07/09/2026 14:20', isBold: false },
        { id: '3', label: 'Kasir', value: 'Siti Rahma', isBold: false },
        { id: '4', label: 'POS Terminal', value: 'POS-02', isBold: false }
      ]
    },
    items: [
      { id: '1', name: 'Minyak Goreng 2L', qty: 1, price: 34500 },
      { id: '2', name: 'Beras Premium 5kg', qty: 1, price: 74000 },
      { id: '3', name: 'Gula Pasir 1kg', qty: 2, price: 17500 },
      { id: '4', name: 'Air Mineral 600ml', qty: 3, price: 3500 }
    ],
    calculation: {
      subtotal: 154000,
      discountAmount: 4000,
      taxPercent: 11,
      taxEnabled: false,
      serviceCharge: 0,
      serviceChargeEnabled: false,
      grandTotal: 150000,
      paymentMethod: 'Tunai',
      paidAmount: 150000,
      change: 0
    },
    footer: {
      lines: [
        { id: '1', text: 'Terima kasih telah berbelanja!', isBold: true },
        { id: '2', text: 'Komplain wajib sertakan struk ini max 1x24 jam', isBold: false },
        { id: '3', text: 'Layanan Konsumen: 0800-123-4567', isBold: false }
      ],
      showQrCode: false,
      qrCodeData: '',
      showBarcode: true,
      barcodeData: '8992761001234'
    }
  },
  service: {
    store: {
      logoUrl: '',
      logoWidth: 80,
      showLogo: false,
      lines: [
        { id: '1', text: 'NEXA TECH COMPUTER & REPAIR', isBold: true },
        { id: '2', text: 'Solusi Service Laptop & PC Terpercaya', isBold: false },
        { id: '3', text: 'Gedung Harco Mangga Dua Lt. 2 Blok B-14', isBold: false },
        { id: '4', text: 'Telp/WA: 0813-8888-9999', isBold: false },
        { id: '5', text: 'www.nexatech.my.id', isBold: false }
      ]
    },
    transaction: {
      lines: [
        { id: '1', label: 'No. Service', value: 'SRV-2026-9081', isBold: true },
        { id: '2', label: 'Tgl Masuk', value: '05 Sep 2026', isBold: false },
        { id: '3', label: 'Tgl Selesai', value: '07 Sep 2026', isBold: false },
        { id: '4', label: 'Pelanggan', value: 'Fajar Kurniawan', isBold: false },
        { id: '5', label: 'Unit / Seri', value: 'Asus ROG G14', isBold: false },
        { id: '6', label: 'Teknisi', value: 'Agus P.', isBold: false }
      ]
    },
    items: [
      { id: '1', name: 'Jasa Install Ulang OS & Driver', qty: 1, price: 100000 },
      { id: '2', name: 'SSD NVMe M.2 512GB Gen3', qty: 1, price: 475000 },
      { id: '3', name: 'Thermal Paste Artic MX-4', qty: 1, price: 50000 }
    ],
    calculation: {
      subtotal: 625000,
      discountAmount: 25000,
      taxPercent: 0,
      taxEnabled: false,
      serviceCharge: 0,
      serviceChargeEnabled: false,
      grandTotal: 600000,
      paymentMethod: 'Transfer BCA',
      paidAmount: 600000,
      change: 0
    },
    footer: {
      lines: [
        { id: '1', text: 'Garansi Servis 30 Hari sejak nota diterbitkan', isBold: true },
        { id: '2', text: 'Segel rusak / human error membatalkan garansi', isBold: false },
        { id: '3', text: 'Terima kasih atas kepercayaan Anda!', isBold: false }
      ],
      showQrCode: true,
      qrCodeData: 'https://nexatech.my.id/cek-garansi',
      showBarcode: true,
      barcodeData: 'SRV-2026-9081'
    }
  }
};
