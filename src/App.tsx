import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Printer, Download, Info } from 'lucide-react';
import { FullReceiptData } from './types';
import { defaultReceiptData, samplePresets } from './data/initialData';
import { Navbar } from './components/Navbar';
import { SidebarEditor } from './components/SidebarEditor';
import { ThermalReceipt } from './components/ThermalReceipt';

// Data Migration & Normalizer (defensive against legacy localStorage schema)
function migrateReceiptData(parsed: any): FullReceiptData {
  if (!parsed || typeof parsed !== 'object') {
    return defaultReceiptData;
  }

  // 1. Migrate store lines
  let storeLines = parsed.store?.lines;
  if (!Array.isArray(storeLines) || storeLines.length === 0) {
    storeLines = [];
    if (parsed.store?.name) storeLines.push({ id: '1', text: parsed.store.name, isBold: true });
    if (parsed.store?.slogan) storeLines.push({ id: '2', text: parsed.store.slogan, isBold: false });
    if (parsed.store?.address) storeLines.push({ id: '3', text: parsed.store.address, isBold: false });
    if (parsed.store?.phone) storeLines.push({ id: '4', text: `Telp: ${parsed.store.phone}`, isBold: false });
    if (parsed.store?.website) storeLines.push({ id: '5', text: parsed.store.website, isBold: false });
    if (storeLines.length === 0) {
      storeLines = defaultReceiptData.store.lines;
    }
  }

  // 2. Migrate transaction info lines
  let transLines = parsed.transaction?.lines;
  if (!Array.isArray(transLines) || transLines.length === 0) {
    transLines = [];
    if (parsed.transaction?.receiptNo) transLines.push({ id: '1', label: 'No. Nota', value: parsed.transaction.receiptNo, isBold: true });
    if (parsed.transaction?.date) transLines.push({ id: '2', label: 'Tanggal', value: parsed.transaction.date, isBold: false });
    if (parsed.transaction?.time) transLines.push({ id: '3', label: 'Waktu', value: parsed.transaction.time, isBold: false });
    if (parsed.transaction?.cashier) transLines.push({ id: '4', label: 'Kasir', value: parsed.transaction.cashier, isBold: false });
    if (parsed.transaction?.customerName) transLines.push({ id: '5', label: 'Pelanggan', value: parsed.transaction.customerName, isBold: false });
    if (parsed.transaction?.tableOrOrderNo) transLines.push({ id: '6', label: 'No. Meja', value: parsed.transaction.tableOrOrderNo, isBold: true });
    if (transLines.length === 0) {
      transLines = defaultReceiptData.transaction.lines;
    }
  }

  // 3. Migrate footer lines
  let footerLines = parsed.footer?.lines;
  if (!Array.isArray(footerLines) || footerLines.length === 0) {
    footerLines = [];
    if (parsed.footer?.noteLine1) footerLines.push({ id: '1', text: parsed.footer.noteLine1, isBold: true });
    if (parsed.footer?.noteLine2) footerLines.push({ id: '2', text: parsed.footer.noteLine2, isBold: false });
    if (parsed.footer?.customFooterText) footerLines.push({ id: '3', text: parsed.footer.customFooterText, isBold: false });
    if (footerLines.length === 0) {
      footerLines = defaultReceiptData.footer.lines;
    }
  }

  const paymentMethod = parsed.calculation?.paymentMethod || parsed.transaction?.paymentMethod || 'Tunai';

  return {
    ...defaultReceiptData,
    ...parsed,
    store: {
      ...defaultReceiptData.store,
      ...(parsed.store || {}),
      lines: storeLines
    },
    transaction: {
      ...defaultReceiptData.transaction,
      ...(parsed.transaction || {}),
      lines: transLines
    },
    calculation: {
      ...defaultReceiptData.calculation,
      ...(parsed.calculation || {}),
      paymentMethod
    },
    footer: {
      ...defaultReceiptData.footer,
      ...(parsed.footer || {}),
      lines: footerLines
    },
    settings: {
      ...defaultReceiptData.settings,
      ...(parsed.settings || {})
    }
  };
}

export function App() {
  const [data, setData] = useState<FullReceiptData>(() => {
    const saved = localStorage.getItem('thermal_receipt_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return migrateReceiptData(parsed);
      } catch (e) {}
    }
    return defaultReceiptData;
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const receiptPreviewRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Auto-save changes to localStorage
  useEffect(() => {
    localStorage.setItem('thermal_receipt_data', JSON.stringify(data));
  }, [data]);

  // Save profile toast
  const handleSaveProfile = () => {
    localStorage.setItem('thermal_receipt_profile', JSON.stringify(data.store));
    localStorage.setItem('thermal_receipt_data', JSON.stringify(data));
  };

  // Load preset
  const handleLoadPreset = (key: string) => {
    const preset = samplePresets[key];
    if (preset) {
      const merged = migrateReceiptData({
        ...data,
        ...preset,
        store: { ...data.store, ...(preset.store || {}) },
        transaction: { ...data.transaction, ...(preset.transaction || {}) },
        items: preset.items || data.items,
        calculation: { ...data.calculation, ...(preset.calculation || {}) },
        footer: { ...data.footer, ...(preset.footer || {}) }
      });
      setData(merged);
    }
  };

  // Reset data
  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin me-reset seluruh nota ke pengaturan awal?')) {
      setData(defaultReceiptData);
      localStorage.removeItem('thermal_receipt_data');
    }
  };

  // Trigger Windows Print Dialog
  const handlePrint = () => {
    window.print();
  };

  // Download as PNG
  const handleDownloadImage = async () => {
    if (!receiptPreviewRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(receiptPreviewRef.current, {
        pixelRatio: 3,
        backgroundColor: '#ffffff'
      });
      const receiptNo = data.transaction.lines?.find(l => 
        l.label.toLowerCase().includes('nota') || 
        l.label.toLowerCase().includes('inv') || 
        l.label.toLowerCase().includes('trx')
      )?.value || '58mm';

      const sanitizedNo = receiptNo.replace(/[^a-zA-Z0-9_-]/g, '_');
      const link = document.createElement('a');
      link.download = `Nota-${sanitizedNo}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Gagal mengunduh gambar nota:', err);
      alert('Gagal mengekspor gambar nota. Silakan gunakan tombol Cetak Nota.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Top Navbar */}
      <Navbar
        onPrint={handlePrint}
        onDownloadImage={handleDownloadImage}
        onSaveProfile={handleSaveProfile}
        onReset={handleReset}
        isDownloading={isDownloading}
      />

      {/* Main Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-61px)] overflow-hidden no-print">
        
        {/* Left: Configuration & Input Editor */}
        <aside className="w-full lg:w-[480px] xl:w-[520px] shrink-0 h-full border-r border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col">
          <SidebarEditor
            data={data}
            onChange={setData}
            onSaveProfile={handleSaveProfile}
            onLoadPreset={handleLoadPreset}
          />
        </aside>

        {/* Right: Realistic 58mm Thermal Receipt Preview Canvas */}
        <main className="flex-1 h-full bg-[#080d1a] overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start relative">
          {/* Quick Guidance Box on Top */}
          <div className="max-w-md w-full mb-6 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 shadow-sm">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Info className="w-4 h-4" />
              <span>Petunjuk Cetak Windows (Print 58mm):</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Di jendela print browser/Windows: pilih printer thermal Anda, atur <strong>Margin: None / Minimum</strong>, dan hilangkan centang <em>"Headers and footers"</em> agar hasil pas tanpa jeda kosong.
            </p>
          </div>

          {/* Live Thermal Paper Mockup Container */}
          <div className="relative group my-auto pb-10">
            
            {/* Top jagged edge illustration */}
            <div className="w-[276px] mx-auto h-2 bg-gradient-to-r from-transparent via-slate-700/40 to-transparent mb-1 rounded-full opacity-60" />

            {/* The Actual Receipt Component (Preview) */}
            <div className="transition-transform duration-200 group-hover:scale-[1.01]">
              <ThermalReceipt
                ref={receiptPreviewRef}
                data={data}
              />
            </div>

            {/* Quick Floating Print Button below paper */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>CETAK STRUK SEKARANG</span>
              </button>
            </div>

          </div>

        </main>

      </div>

      {/* DEDICATED PRINT CONTAINER (Hidden on Screen, Visible only during window.print()) */}
      <div id="receipt-to-print" className="hidden print:block">
        <ThermalReceipt
          ref={printRef}
          data={data}
          isPrintVersion={true}
        />
      </div>

    </div>
  );
}
