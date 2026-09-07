import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Printer, Download, Sparkles, Info, Eye, CheckCircle2 } from 'lucide-react';
import { FullReceiptData } from './types';
import { defaultReceiptData, samplePresets } from './data/initialData';
import { Navbar } from './components/Navbar';
import { SidebarEditor } from './components/SidebarEditor';
import { ThermalReceipt } from './components/ThermalReceipt';

export function App() {
  const [data, setData] = useState<FullReceiptData>(() => {
    const saved = localStorage.getItem('thermal_receipt_data');
    if (saved) {
      try {
        return JSON.parse(saved);
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
      const updated: FullReceiptData = {
        ...data,
        ...preset,
        store: { ...data.store, ...(preset.store || {}) },
        items: preset.items || data.items,
        footer: { ...data.footer, ...(preset.footer || {}) }
      };
      setData(updated);
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
      const link = document.createElement('a');
      link.download = `Nota-${data.transaction.receiptNo || '58mm'}.png`;
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
        <main className="flex-1 h-full bg-[#070b14] overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start relative">
          
          {/* Ambient Glow behind paper */}
          <div className="absolute top-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Quick Guidance Box on Top */}
          <div className="max-w-md w-full mb-6 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all"
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
