import React, { useState } from 'react';
import { Printer, Download, Save, RotateCcw, Sparkles, Check, FileText } from 'lucide-react';

interface NavbarProps {
  onPrint: () => void;
  onDownloadImage: () => void;
  onSaveProfile: () => void;
  onReset: () => void;
  isDownloading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onPrint,
  onDownloadImage,
  onSaveProfile,
  onReset,
  isDownloading
}) => {
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    onSaveProfile();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  return (
    <header className="no-print relative border-b border-slate-800/90 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
      {/* Top subtle glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Printer className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  THERMAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">58MM STUDIO</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono">
                  Windows POS Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Template Struk Printer Thermal Fleksibel & Siap Cetak
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            
            {/* Reset */}
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Reset data nota ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Save Profile */}
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Simpan profil toko ke browser"
            >
              {saveToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-slate-400" />
                  <span>Simpan Template</span>
                </>
              )}
            </button>

            {/* Download Image */}
            <button
              onClick={onDownloadImage}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Unduh struk nota sebagai gambar PNG"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{isDownloading ? 'Menyimpan...' : 'Unduh PNG'}</span>
            </button>

            {/* Primary Print Button */}
            <button
              onClick={onPrint}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-all"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>CETAK NOTA (PRINT)</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
