import React, { useState } from 'react';
import { 
  Store, Receipt, ShoppingCart, Calculator, FileText, Settings, 
  Plus, Trash2, RefreshCw, Upload, Image as ImageIcon, QrCode, 
  Barcode, Check, Sparkles, ChevronDown, ChevronRight, Type,
  ArrowUp, ArrowDown, Clock, Hash
} from 'lucide-react';
import { FullReceiptData, ReceiptItem, HeaderLine, ReceiptInfoLine, FooterLine } from '../types';
import { generateReceiptNo, formatRupiah } from '../utils/format';

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

  // Helpers for generic sections
  const updateStore = (field: string, value: any) => {
    onChange({ ...data, store: { ...data.store, [field]: value } });
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

  // 1. DYNAMIC STORE HEADER LINES
  const addHeaderLine = () => {
    const newLine: HeaderLine = {
      id: Date.now().toString(),
      text: '',
      isBold: false
    };
    onChange({
      ...data,
      store: {
        ...data.store,
        lines: [...(data.store.lines || []), newLine]
      }
    });
  };

  const updateHeaderLine = (index: number, field: keyof HeaderLine, value: any) => {
    const newLines = [...(data.store.lines || [])];
    newLines[index] = { ...newLines[index], [field]: value };
    onChange({
      ...data,
      store: {
        ...data.store,
        lines: newLines
      }
    });
  };

  const removeHeaderLine = (index: number) => {
    const newLines = (data.store.lines || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      store: {
        ...data.store,
        lines: newLines
      }
    });
  };

  const moveHeaderLine = (index: number, direction: 'up' | 'down') => {
    const lines = [...(data.store.lines || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= lines.length) return;
    const temp = lines[index];
    lines[index] = lines[target];
    lines[target] = temp;
    onChange({
      ...data,
      store: {
        ...data.store,
        lines
      }
    });
  };

  // 2. DYNAMIC TRANSACTION INFO LINES
  const addInfoLine = (label = '', value = '', isBold = false) => {
    const newLine: ReceiptInfoLine = {
      id: Date.now().toString(),
      label,
      value,
      isBold
    };
    onChange({
      ...data,
      transaction: {
        ...data.transaction,
        lines: [...(data.transaction.lines || []), newLine]
      }
    });
  };

  const updateInfoLine = (index: number, field: keyof ReceiptInfoLine, value: any) => {
    const newLines = [...(data.transaction.lines || [])];
    newLines[index] = { ...newLines[index], [field]: value };
    onChange({
      ...data,
      transaction: {
        ...data.transaction,
        lines: newLines
      }
    });
  };

  const removeInfoLine = (index: number) => {
    const newLines = (data.transaction.lines || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      transaction: {
        ...data.transaction,
        lines: newLines
      }
    });
  };

  const moveInfoLine = (index: number, direction: 'up' | 'down') => {
    const lines = [...(data.transaction.lines || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= lines.length) return;
    const temp = lines[index];
    lines[index] = lines[target];
    lines[target] = temp;
    onChange({
      ...data,
      transaction: {
        ...data.transaction,
        lines
      }
    });
  };

  const addCurrentTimeInfo = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    addInfoLine('Waktu', `${dateStr} ${timeStr}`, false);
  };

  const addReceiptNoInfo = () => {
    addInfoLine('No. Nota', generateReceiptNo(), true);
  };

  // 3. DYNAMIC FOOTER LINES
  const addFooterLine = () => {
    const newLine: FooterLine = {
      id: Date.now().toString(),
      text: '',
      isBold: false
    };
    onChange({
      ...data,
      footer: {
        ...data.footer,
        lines: [...(data.footer.lines || []), newLine]
      }
    });
  };

  const updateFooterLine = (index: number, field: keyof FooterLine, value: any) => {
    const newLines = [...(data.footer.lines || [])];
    newLines[index] = { ...newLines[index], [field]: value };
    onChange({
      ...data,
      footer: {
        ...data.footer,
        lines: newLines
      }
    });
  };

  const removeFooterLine = (index: number) => {
    const newLines = (data.footer.lines || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      footer: {
        ...data.footer,
        lines: newLines
      }
    });
  };

  const moveFooterLine = (index: number, direction: 'up' | 'down') => {
    const lines = [...(data.footer.lines || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= lines.length) return;
    const temp = lines[index];
    lines[index] = lines[target];
    lines[target] = temp;
    onChange({
      ...data,
      footer: {
        ...data.footer,
        lines
      }
    });
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
                Atur diskon nota, PPN, metode bayar, nominal uang bayar, dan kembalian.
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

              {/* METODE PEMBAYARAN (Moved to Calculation Tab) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300">
                  Metode Pembayaran
                </label>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Tunai', 'QRIS', 'Transfer BCA', 'Transfer Mandiri', 'Debit Card', 'Kartu Kredit', 'ShopeePay', 'GoPay'].map((method) => {
                    const isSelected = (data.calculation.paymentMethod || 'Tunai') === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => updateCalc('paymentMethod', method)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={data.calculation.paymentMethod || ''}
                  onChange={(e) => updateCalc('paymentMethod', e.target.value)}
                  placeholder="Atau ketik metode kustom (cth: Voucher, OVO, dll)..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
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
            TAB 3: PROFIL TOKO (Dinamis Baris Header Rata Tengah)
            ================================================================= */}
        {activeTab === 'store' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Store className="w-4 h-4 text-cyan-400" />
                  Profil & Header Toko
                </h3>
                <p className="text-[11px] text-slate-400">
                  Logo dan baris teks header toko dinamis (berurutan rata tengah).
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

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              
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

              {/* Dynamic Header Lines */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Header Baris Toko ({(data.store.lines || []).length} Baris)
                  </label>
                  <span className="text-[10px] text-slate-500">Urut dari atas ke bawah</span>
                </div>

                <div className="space-y-2">
                  {(data.store.lines || []).map((line, idx) => (
                    <div
                      key={line.id || idx}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 hover:border-slate-700 transition-colors"
                    >
                      <span className="text-[10px] font-mono text-cyan-400/80 w-5 text-center shrink-0">
                        #{idx + 1}
                      </span>

                      <input
                        type="text"
                        value={line.text}
                        onChange={(e) => updateHeaderLine(idx, 'text', e.target.value)}
                        placeholder={`Header baris ke-${idx + 1} (cth: Nama Toko, Alamat, Telp)...`}
                        className={`flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 ${
                          line.isBold ? 'font-bold text-cyan-300' : ''
                        }`}
                      />

                      {/* Bold Checkbox */}
                      <label
                        className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 cursor-pointer select-none bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 shrink-0"
                        title="Cetak tebal baris ini di nota"
                      >
                        <input
                          type="checkbox"
                          checked={line.isBold}
                          onChange={(e) => updateHeaderLine(idx, 'isBold', e.target.checked)}
                          className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-3.5 h-3.5"
                        />
                        <span className={line.isBold ? 'text-cyan-400 font-bold' : 'text-slate-400'}>Bold</span>
                      </label>

                      {/* Move buttons */}
                      <div className="flex items-center shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveHeaderLine(idx, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-25"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (data.store.lines || []).length - 1}
                          onClick={() => moveHeaderLine(idx, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-25"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeHeaderLine(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                        title="Hapus baris ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addHeaderLine}
                  className="w-full py-2.5 border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Header Baris ke-{(data.store.lines || []).length + 1}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================
            TAB 4: INFO TRANSAKSI (Dinamis Label & Value)
            ================================================================= */}
        {activeTab === 'trans' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-cyan-400" />
                  Informasi & Header Nota
                </h3>
                <p className="text-[11px] text-slate-400">
                  Label dan nilai dapat Anda tentukan sendiri secara dinamis.
                </p>
              </div>

              {/* Quick helper buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={addCurrentTimeInfo}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-[11px] text-cyan-300 flex items-center gap-1 transition-colors"
                  title="Tambah baris waktu saat ini"
                >
                  <Clock className="w-3 h-3" />
                  <span>+ Waktu</span>
                </button>
                <button
                  type="button"
                  onClick={addReceiptNoInfo}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-[11px] text-cyan-300 flex items-center gap-1 transition-colors"
                  title="Tambah baris nomor nota acak"
                >
                  <Hash className="w-3 h-3" />
                  <span>+ No. Nota</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-200">
                  Daftar Baris Info ({(data.transaction.lines || []).length})
                </span>
                <span className="text-[10px] text-slate-500">Format 2 kolom di struk (Label : Value)</span>
              </div>

              <div className="space-y-2.5">
                {(data.transaction.lines || []).map((line, idx) => (
                  <div
                    key={line.id || idx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/50">
                        Baris #{idx + 1}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Bold Value Checkbox */}
                        <label
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 cursor-pointer select-none px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 hover:border-slate-700"
                          title="Cetak tebal nilai/value pada struk"
                        >
                          <input
                            type="checkbox"
                            checked={line.isBold}
                            onChange={(e) => updateInfoLine(idx, 'isBold', e.target.checked)}
                            className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-3.5 h-3.5"
                          />
                          <span className={line.isBold ? 'text-cyan-400 font-bold' : 'text-slate-400'}>Bold</span>
                        </label>

                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveInfoLine(idx, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-25"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (data.transaction.lines || []).length - 1}
                          onClick={() => moveInfoLine(idx, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-25"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeInfoLine(idx)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                          title="Hapus baris info ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                          Nama Label
                        </label>
                        <input
                          type="text"
                          value={line.label}
                          onChange={(e) => updateInfoLine(idx, 'label', e.target.value)}
                          placeholder="Cth: No. Nota, Kasir, Plat..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                          Isi / Nilai
                        </label>
                        <input
                          type="text"
                          value={line.value}
                          onChange={(e) => updateInfoLine(idx, 'value', e.target.value)}
                          placeholder="Cth: INV-001, Fahmi, B 1234 CD..."
                          className={`w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 ${
                            line.isBold ? 'font-bold text-cyan-300' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addInfoLine('', '', false)}
                className="w-full py-2.5 border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris Informasi ke-{(data.transaction.lines || []).length + 1}</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 5: FOOTER & QR/BARCODE (Dinamis Baris Pesan)
            ================================================================= */}
        {activeTab === 'footer' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Catatan Kaki & QR Code
              </h3>
              <p className="text-[11px] text-slate-400">
                Pesan penutup struk dinamis (rata tengah), serta kode QR / Barcode.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              
              {/* Dynamic Footer Lines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Pesan Penutup Struk ({(data.footer.lines || []).length} Baris)
                  </label>
                  <span className="text-[10px] text-slate-500">Urut dari atas ke bawah</span>
                </div>

                <div className="space-y-2">
                  {(data.footer.lines || []).map((line, idx) => (
                    <div
                      key={line.id || idx}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 hover:border-slate-700 transition-colors"
                    >
                      <span className="text-[10px] font-mono text-cyan-400/80 w-5 text-center shrink-0">
                        #{idx + 1}
                      </span>

                      <input
                        type="text"
                        value={line.text}
                        onChange={(e) => updateFooterLine(idx, 'text', e.target.value)}
                        placeholder={`Pesan baris ke-${idx + 1} (cth: Terima kasih, Garansi, dll)...`}
                        className={`flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 ${
                          line.isBold ? 'font-bold text-cyan-300' : ''
                        }`}
                      />

                      {/* Bold Checkbox */}
                      <label
                        className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 cursor-pointer select-none bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 shrink-0"
                        title="Cetak tebal baris ini di nota"
                      >
                        <input
                          type="checkbox"
                          checked={line.isBold}
                          onChange={(e) => updateFooterLine(idx, 'isBold', e.target.checked)}
                          className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-3.5 h-3.5"
                        />
                        <span className={line.isBold ? 'text-cyan-400 font-bold' : 'text-slate-400'}>Bold</span>
                      </label>

                      {/* Move buttons */}
                      <div className="flex items-center shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveFooterLine(idx, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-25"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (data.footer.lines || []).length - 1}
                          onClick={() => moveFooterLine(idx, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-25"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeFooterLine(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                        title="Hapus baris ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addFooterLine}
                  className="w-full py-2.5 border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pesan Baris ke-{(data.footer.lines || []).length + 1}</span>
                </button>
              </div>

              {/* QR Code Toggle & Data */}
              <div className="pt-3 border-t border-slate-800">
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
