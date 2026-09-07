import React, { useState } from 'react';
import { 
  Store, Receipt, ShoppingCart, Calculator, FileText, Settings, 
  Plus, Trash2, RefreshCw, Upload, Image as ImageIcon, QrCode, 
  Barcode, Check, Sparkles, ChevronDown, ChevronRight, Type
} from 'lucide-react';
import { FullReceiptData, ReceiptItem } from '../types';
import { generateReceiptNo, formatRupiah } from '../utils/format';
import { samplePresets } from '../data/initialData';

interface SidebarEditorProps {
  data: FullReceiptData;
  onChange: (newData: FullReceiptData) => void;
  onSaveProfile: () => void;
  onLoadPreset: (presetKey: string) => void;
}

export const SidebarEditor: React.FC<SidebarEditorProps> = ({
  data,
  onChange,
  onSaveProfile,
  onLoadPreset
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'trans' | 'items' | 'calc' | 'footer' | 'settings'>('items');

  // Helpers
  const updateStore = (field: string, value: any) => {
    onChange({ ...data, store: { ...data.store, [field]: value } });
  };

  const updateTrans = (field: string, value: any) => {
    onChange({ ...data, transaction: { ...data.transaction, [field]: value } });
  };

  const updateCalc = (field: string, value: any) => {
    const newCalc = { ...data.calculation, [field]: value };
    recalcTotal(data.items, newCalc);
  };

  const updateFooter = (field: string, value: any) => {
    onChange({ ...data, footer: { ...data.footer, [field]: value } });
  };

  const updateSettings = (field: string, value: any) => {
    onChange({ ...data, settings: { ...data.settings, [field]: value } });
  };

  // Recalculate Totals
  const recalcTotal = (items: ReceiptItem[], calc = data.calculation) => {
    const subtotal = items.reduce((acc, item) => {
      const itemSub = (item.qty * item.price) - (item.discount || 0);
      return acc + itemSub;
    }, 0);

    let taxAmount = 0;
    if (calc.taxEnabled) {
      taxAmount = Math.round(subtotal * (calc.taxPercent / 100));
    }

    let serviceAmount = 0;
    if (calc.serviceChargeEnabled) {
      serviceAmount = calc.serviceCharge;
    }

    const discountAmount = calc.discountAmount || 0;
    const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount + serviceAmount);
    const paid = calc.paidAmount || grandTotal;
    const change = paid - grandTotal;

    onChange({
      ...data,
      items,
      calculation: {
        ...calc,
        subtotal,
        grandTotal,
        paidAmount: paid,
        change
      }
    });
  };

  // Item modifications
  const addItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      name: 'Item Baru',
      qty: 1,
      price: 15000,
      discount: 0
    };
    const newItems = [...data.items, newItem];
    recalcTotal(newItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    recalcTotal(newItems);
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) {
      alert('Minimal harus ada 1 item pada nota.');
      return;
    }
    const newItems = data.items.filter((_, i) => i !== index);
    recalcTotal(newItems);
  };

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        updateStore('logoUrl', base64);
        updateStore('showLogo', true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick cash buttons
  const setQuickCash = (amount: number) => {
    updateCalc('paidAmount', amount);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border-r border-slate-800">
      
      {/* Tab Navigation Icons */}
      <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'items'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Barang ({data.items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calc')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'calc'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Kalkulasi</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'store'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Profil Toko</span>
        </button>

        <button
          onClick={() => setActiveTab('trans')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'trans'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Info Nota</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'footer'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Footer & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'settings'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Format & Font</span>
        </button>
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        
        {/* =================================================================
            TAB 1: DAFTAR BARANG
            ================================================================= */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  Daftar Barang ({data.items.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Item otomatis di-format 2 baris agar muat pas di kertas thermal 58mm.
                </p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 relative group hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/50">
                      #{idx + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900 transition-colors"
                      title="Hapus baris ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Name */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      Nama Barang / Jasa
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      placeholder="Contoh: Kopi Susu Gula Aren"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Qty, Price, Discount in Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        Harga (Rp)
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={item.price}
                        onChange={(e) => updateItem(idx, 'price', parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        Diskon (Rp)
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={item.discount || 0}
                        onChange={(e) => updateItem(idx, 'discount', parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Optional Note */}
                  <div>
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={(e) => updateItem(idx, 'note', e.target.value)}
                      placeholder="Catatan item (opsional, cth: Less Ice / Size L)"
                      className="w-full px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 italic"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="w-full py-2.5 border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Baris Barang Lagi</span>
            </button>
          </div>
        )}

        {/* =================================================================
            TAB 2: KALKULASI & PEMBAYARAN
            ================================================================= */}
        {activeTab === 'calc' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                Kalkulasi, Pajak & Pembayaran
              </h3>
              <p className="text-[11px] text-slate-400">
                Atur diskon nota, PPN, nominal uang bayar, dan kembalian.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              
              {/* Subtotal Display */}
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Subtotal Item:</span>
                <span className="font-mono font-bold text-slate-100 text-sm">
                  Rp {formatRupiah(data.calculation.subtotal)}
                </span>
              </div>

              {/* Diskon Keseluruhan */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Diskon Nota / Potongan Promo (Rp)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={data.calculation.discountAmount || 0}
                  onChange={(e) => updateCalc('discountAmount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Toggle PPN / Pajak */}
              <div className="pt-1 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.calculation.taxEnabled}
                      onChange={(e) => updateCalc('taxEnabled', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>Aktifkan Pajak / PPN</span>
                  </label>
                  {data.calculation.taxEnabled && (
                    <span className="font-mono text-xs text-cyan-400">
                      +Rp {formatRupiah(Math.round(data.calculation.subtotal * (data.calculation.taxPercent / 100)))}
                    </span>
                  )}
                </div>

                {data.calculation.taxEnabled && (
                  <div className="flex items-center gap-2 pl-5">
                    <span className="text-xs text-slate-400">Tarif Pajak (%):</span>
                    <input
                      type="number"
                      value={data.calculation.taxPercent}
                      onChange={(e) => updateCalc('taxPercent', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                )}
              </div>

              {/* Toggle Biaya Layanan */}
              <div className="pt-1 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.calculation.serviceChargeEnabled}
                      onChange={(e) => updateCalc('serviceChargeEnabled', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>Biaya Layanan / Ongkir</span>
                  </label>
                  {data.calculation.serviceChargeEnabled && (
                    <span className="font-mono text-xs text-cyan-400">
                      +Rp {formatRupiah(data.calculation.serviceCharge)}
                    </span>
                  )}
                </div>

                {data.calculation.serviceChargeEnabled && (
                  <div className="pl-5">
                    <input
                      type="number"
                      step="1000"
                      value={data.calculation.serviceCharge}
                      onChange={(e) => updateCalc('serviceCharge', parseInt(e.target.value) || 0)}
                      placeholder="Nominal (Rp)"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}
              </div>

              {/* GRAND TOTAL HIGHLIGHT */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex justify-between items-center">
                <span className="text-xs font-bold text-cyan-300 uppercase">Grand Total:</span>
                <span className="text-lg font-black font-mono text-cyan-400">
                  Rp {formatRupiah(data.calculation.grandTotal)}
                </span>
              </div>

              {/* Jumlah Bayar & Pecahan Cepat */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300">
                  Nominal Uang Diterima / Bayar (Rp)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={data.calculation.paidAmount}
                  onChange={(e) => updateCalc('paidAmount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-400"
                />

                {/* Quick Cash Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setQuickCash(data.calculation.grandTotal)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-400 transition-colors"
                  >
                    Uang Pas
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickCash(50000)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 transition-colors"
                  >
                    50.000
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickCash(100000)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 transition-colors"
                  >
                    100.000
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickCash(200000)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 transition-colors"
                  >
                    200.000
                  </button>
                </div>
              </div>

              {/* Kembalian Result */}
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="font-semibold text-slate-400">Kembalian:</span>
                <span className={`font-mono font-bold text-sm ${data.calculation.change < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  Rp {formatRupiah(data.calculation.change)}
                </span>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================
            TAB 3: PROFIL TOKO
            ================================================================= */}
        {activeTab === 'store' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Store className="w-4 h-4 text-cyan-400" />
                  Identitas Usaha / Toko
                </h3>
                <p className="text-[11px] text-slate-400">
                  Pengaturan nama toko, alamat, dan logo pada struk.
                </p>
              </div>

              <button
                type="button"
                onClick={onSaveProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all"
                title="Simpan profil toko ke browser agar tidak hilang"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Profil</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
              
              {/* Logo Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Logo Toko (Thermal Monokrom)
                </label>
                
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 cursor-pointer text-xs text-slate-300 transition-colors">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Upload Logo Baru</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {data.store.logoUrl && (
                    <button
                      type="button"
                      onClick={() => updateStore('showLogo', !data.store.showLogo)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        data.store.showLogo
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {data.store.showLogo ? 'Logo: Tampil' : 'Logo: Disembunyikan'}
                    </button>
                  )}
                </div>

                {data.store.logoUrl && data.store.showLogo && (
                  <div className="mt-2.5 flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">Ukuran Logo:</span>
                    <input
                      type="range"
                      min="40"
                      max="140"
                      value={data.store.logoWidth}
                      onChange={(e) => updateStore('logoWidth', parseInt(e.target.value))}
                      className="flex-1 accent-cyan-400"
                    />
                    <span className="text-xs font-mono text-slate-300">{data.store.logoWidth}px</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Usaha / Toko *
                </label>
                <input
                  type="text"
                  value={data.store.name}
                  onChange={(e) => updateStore('name', e.target.value)}
                  placeholder="Contoh: KAFE KOPI NUSANTARA"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 uppercase font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Slogan / Keterangan Toko
                </label>
                <input
                  type="text"
                  value={data.store.slogan}
                  onChange={(e) => updateStore('slogan', e.target.value)}
                  placeholder="Contoh: Nikmatnya Kopi Asli Indonesia"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={data.store.address}
                  onChange={(e) => updateStore('address', e.target.value)}
                  placeholder="Alamat tempat usaha..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={data.store.phone}
                    onChange={(e) => updateStore('phone', e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Website / Akun Sosmed
                  </label>
                  <input
                    type="text"
                    value={data.store.website || ''}
                    onChange={(e) => updateStore('website', e.target.value)}
                    placeholder="www.tokoanda.id"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================
            TAB 4: INFO TRANSAKSI
            ================================================================= */}
        {activeTab === 'trans' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-cyan-400" />
                Informasi & Header Nota
              </h3>
              <p className="text-[11px] text-slate-400">
                Atur nomor nota, kasir, pelanggan, dan metode pembayaran.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
              
              {/* No. Nota with Generate Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Nomor Nota / Faktur
                  </label>
                  <button
                    type="button"
                    onClick={() => updateTrans('receiptNo', generateReceiptNo())}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Baru</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={data.transaction.receiptNo}
                  onChange={(e) => updateTrans('receiptNo', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="text"
                    value={data.transaction.date}
                    onChange={(e) => updateTrans('date', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Waktu
                  </label>
                  <input
                    type="text"
                    value={data.transaction.time}
                    onChange={(e) => updateTrans('time', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Kasir & Pelanggan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Kasir
                  </label>
                  <input
                    type="text"
                    value={data.transaction.cashier}
                    onChange={(e) => updateTrans('cashier', e.target.value)}
                    placeholder="Kasir 1"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Pelanggan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={data.transaction.customerName || ''}
                    onChange={(e) => updateTrans('customerName', e.target.value)}
                    placeholder="Nama Pelanggan"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* No. Meja & Metode Bayar */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    No. Meja / Order
                  </label>
                  <input
                    type="text"
                    value={data.transaction.tableOrOrderNo || ''}
                    onChange={(e) => updateTrans('tableOrOrderNo', e.target.value)}
                    placeholder="Meja 01 / Bungkus"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={data.transaction.paymentMethod}
                    onChange={(e) => updateTrans('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Tunai">Tunai / Cash</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Transfer BCA">Transfer BCA</option>
                    <option value="Transfer Mandiri">Transfer Mandiri</option>
                    <option value="Debit Card">Kartu Debit</option>
                    <option value="ShopeePay">ShopeePay</option>
                    <option value="GoPay">GoPay</option>
                    <option value="OVO">OVO</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================
            TAB 5: FOOTER & QR/BARCODE
            ================================================================= */}
        {activeTab === 'footer' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Catatan Kaki & QR Code
              </h3>
              <p className="text-[11px] text-slate-400">
                Pesan penutup, garansi, serta QR Code pembayaran/website.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pesan Baris 1 (Besar & Tebal)
                </label>
                <input
                  type="text"
                  value={data.footer.noteLine1}
                  onChange={(e) => updateFooter('noteLine1', e.target.value)}
                  placeholder="Terima kasih atas kunjungan Anda!"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pesan Baris 2 (Ketentuan Toko)
                </label>
                <input
                  type="text"
                  value={data.footer.noteLine2}
                  onChange={(e) => updateFooter('noteLine2', e.target.value)}
                  placeholder="Barang yang sudah dibeli tidak dapat ditukar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Teks Kustom Tambahan
                </label>
                <input
                  type="text"
                  value={data.footer.customFooterText || ''}
                  onChange={(e) => updateFooter('customFooterText', e.target.value)}
                  placeholder="Contoh: Follow IG @toko.anda"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* QR Code Toggle & Data */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.footer.showQrCode}
                    onChange={(e) => updateFooter('showQrCode', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Cetak QR Code di Bawah Nota</span>
                </label>

                {data.footer.showQrCode && (
                  <div>
                    <input
                      type="text"
                      value={data.footer.qrCodeData}
                      onChange={(e) => updateFooter('qrCodeData', e.target.value)}
                      placeholder="Masukkan URL atau Kode QRIS"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Dapat diisi link Google Maps, link WhatsApp, link pembayaran, atau QRIS.
                    </p>
                  </div>
                )}
              </div>

              {/* Barcode Toggle & Data */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.footer.showBarcode}
                    onChange={(e) => updateFooter('showBarcode', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <Barcode className="w-4 h-4 text-indigo-400" />
                  <span>Cetak Barcode No. Nota</span>
                </label>

                {data.footer.showBarcode && (
                  <div>
                    <input
                      type="text"
                      value={data.footer.barcodeData}
                      onChange={(e) => updateFooter('barcodeData', e.target.value)}
                      placeholder="Kode Barcode (huruf & angka)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* =================================================================
            TAB 6: PENGATURAN CETAK & PRESET
            ================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                Format Cetak & Presets
              </h3>
              <p className="text-[11px] text-slate-400">
                Pengaturan layout khusus printer thermal 58mm atau 80mm.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
              
              {/* Paper Width */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lebar Kertas Thermal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSettings('paperWidth', '58mm')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      data.settings.paperWidth === '58mm'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    58mm (Standar POS)
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSettings('paperWidth', '80mm')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      data.settings.paperWidth === '80mm'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    80mm (Lebar)
                  </button>
                </div>
              </div>

              {/* Pilihan Font Family */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Font Family (Jenis Huruf Struk)</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {data.settings.fontFamily || 'Share Tech Mono'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'Share Tech Mono', name: 'Share Tech Mono', note: 'Standar Struk POS Modern' },
                    { id: 'Courier Prime', name: 'Courier Prime', note: 'Mesin Tik Klasik Kontras' },
                    { id: 'JetBrains Mono', name: 'JetBrains Mono', note: 'Sangat Tajam & Presisi' },
                    { id: 'Roboto Mono', name: 'Roboto Mono', note: 'Rapi & Geometris' },
                    { id: 'Space Mono', name: 'Space Mono', note: 'Gaya Modern Tech' },
                    { id: 'VT323', name: 'VT323 (Dot Matrix)', note: 'Kasir Retro / Jadul' },
                    { id: 'Courier New', name: 'Courier New', note: 'Bawaan Windows Klasik' },
                    { id: 'Consolas', name: 'Consolas', note: 'Bawaan Windows Rapi' }
                  ].map((f) => {
                    const isSelected = (data.settings.fontFamily || 'Share Tech Mono') === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateSettings('fontFamily', f.id)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 shadow-sm shadow-cyan-500/20'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-bold text-slate-100 truncate"
                            style={{ fontFamily: `'${f.id}', monospace` }}
                          >
                            {f.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {f.note}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ukuran Font (Base Font Size Slider & Stepper) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Ukuran Font Dasar (Font Size)
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateSettings('baseFontSize', Math.max(8, (data.settings.baseFontSize || 11) - 0.5))}
                      className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 flex items-center justify-center text-xs font-bold"
                      title="Perkecil Font"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-700 min-w-[50px] text-center">
                      {data.settings.baseFontSize || 11}px
                    </span>
                    <button
                      type="button"
                      onClick={() => updateSettings('baseFontSize', Math.min(16, (data.settings.baseFontSize || 11) + 0.5))}
                      className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 flex items-center justify-center text-xs font-bold"
                      title="Perbesar Font"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="8"
                  max="16"
                  step="0.5"
                  value={data.settings.baseFontSize || 11}
                  onChange={(e) => updateSettings('baseFontSize', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />

                {/* Quick Font Size Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {[
                    { label: '9px (Kecil)', val: 9 },
                    { label: '10px (Kompak)', val: 10 },
                    { label: '11px (Standar POS)', val: 11 },
                    { label: '12.5px (Besar)', val: 12.5 },
                    { label: '14px (Jumbo)', val: 14 }
                  ].map((p) => {
                    const isSelected = (data.settings.baseFontSize || 11) === p.val;
                    return (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => updateSettings('baseFontSize', p.val)}
                        className={`px-2 py-0.5 rounded-lg border text-[10px] transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Jarak Baris (Line Height) */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Jarak Antar Baris (Line Spacing)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Rapat (1.20)', val: 1.2 },
                    { label: 'Normal (1.35)', val: 1.35 },
                    { label: 'Renggang (1.50)', val: 1.5 }
                  ].map((lh) => {
                    const isSelected = (data.settings.lineHeight || 1.35) === lh.val;
                    return (
                      <button
                        key={lh.val}
                        type="button"
                        onClick={() => updateSettings('lineHeight', lh.val)}
                        className={`py-1.5 px-2 rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        {lh.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Separator Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gaya Garis Pemisah (Divider)
                </label>
                <select
                  value={data.settings.separatorStyle}
                  onChange={(e) => updateSettings('separatorStyle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="dashed">Garis Putus-putus (- - - - -)</option>
                  <option value="dotted">Titik-titik (. . . . .)</option>
                  <option value="solid">Garis Lurus Padat (───────)</option>
                  <option value="double">Garis Ganda (═══════)</option>
                  <option value="star">Bintang (* * * * *)</option>
                </select>
              </div>

              {/* UPPERCASE Items */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.settings.uppercaseItems}
                    onChange={(e) => updateSettings('uppercaseItems', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Otomatis Huruf Kapital (UPPERCASE) pada Nama Barang</span>
                </label>
              </div>

              {/* Sample Presets */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Muat Contoh Preset Template</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onLoadPreset('cafe')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200 transition-colors text-center"
                  >
                    ☕ Kafe / Resto
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadPreset('retail')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200 transition-colors text-center"
                  >
                    🛒 Minimarket
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoadPreset('service')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200 transition-colors text-center"
                  >
                    🔧 Servis / Jasa
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
