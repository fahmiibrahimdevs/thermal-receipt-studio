import React, { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import { FullReceiptData } from '../types';
import { formatRupiah } from '../utils/format';

interface ThermalReceiptProps {
  data: FullReceiptData;
  isPrintVersion?: boolean;
}

export const ThermalReceipt = React.forwardRef<HTMLDivElement, ThermalReceiptProps>(({
  data,
  isPrintVersion = false
}, ref) => {
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  // Render Barcode dynamically if enabled
  useEffect(() => {
    if (data.footer.showBarcode && data.footer.barcodeData && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, data.footer.barcodeData, {
          format: "CODE128",
          width: 1.4,
          height: 32,
          displayValue: true,
          fontSize: 10,
          font: "monospace",
          margin: 0,
        });
      } catch (err) {
        console.error("Barcode generation error:", err);
      }
    }
  }, [data.footer.showBarcode, data.footer.barcodeData]);

  // Separator line characters
  const getSeparatorLine = () => {
    switch (data.settings.separatorStyle) {
      case 'dotted':
        return '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . .';
      case 'solid':
        return '────────────────────────────────────────────────────────';
      case 'double':
        return '════════════════════════════════════════════════════════';
      case 'star':
        return '* * * * * * * * * * * * * * * * * * * * * * * * * * * *';
      case 'dashed':
      default:
        return '- - - - - - - - - - - - - - - - - - - - - - - - - - - -';
    }
  };

  const is58mm = data.settings.paperWidth === '58mm';
  // 58mm width on screen preview is roughly 276px wide to match realistic physical thermal paper
  const containerWidthClass = is58mm ? 'w-[276px] max-w-[276px]' : 'w-[360px] max-w-[360px]';

  // Dynamic font sizing & family
  const baseFontSize = data.settings.baseFontSize || 11;
  const fontFamily = data.settings.fontFamily || 'Share Tech Mono';
  const lineHeight = data.settings.lineHeight || 1.35;

  const dynamicStyles: React.CSSProperties = {
    fontFamily: `'${fontFamily}', 'JetBrains Mono', 'Courier New', monospace`,
    fontSize: `${baseFontSize}px`,
    lineHeight: lineHeight,
    ['--receipt-font-family' as any]: `'${fontFamily}', 'JetBrains Mono', 'Courier New', monospace`,
    ['--receipt-font-size' as any]: `${baseFontSize}px`,
    ['--receipt-line-height' as any]: `${lineHeight}`,
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  return (
    <div
      ref={ref}
      className={`thermal-paper select-none text-black bg-white ${
        isPrintVersion ? 'print-container' : `${containerWidthClass} mx-auto p-4 rounded-sm`
      }`}
      style={dynamicStyles}
    >
      {/* 1. Header: Logo & Dynamic Store Info Lines */}
      <div className="text-center space-y-1 mb-2">
        {data.store.showLogo && data.store.logoUrl && (
          <div className="flex justify-center mb-2">
            <img
              src={data.store.logoUrl}
              alt="Logo Toko"
              style={{ width: `${data.store.logoWidth}px`, maxWidth: '100%' }}
              className="object-contain filter grayscale contrast-125"
            />
          </div>
        )}

        {(data.store.lines || []).map((line, idx) => (
          <p
            key={line.id || idx}
            className={`leading-tight ${
              line.isBold
                ? 'font-bold text-[1.15em] tracking-tight uppercase'
                : 'text-[0.9em] text-gray-800'
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>

      {/* Separator */}
      <div className="overflow-hidden text-center text-gray-600 my-1 text-[0.9em] select-none whitespace-nowrap leading-none">
        {getSeparatorLine()}
      </div>

      {/* 2. Transaction Details (Dynamic Label & Value) */}
      {(data.transaction.lines || []).length > 0 && (
        <div className="space-y-0.5 text-[0.92em] mb-1.5">
          {data.transaction.lines.map((line, idx) => (
            <div key={line.id || idx} className="flex justify-between items-start gap-2">
              <span className="shrink-0">{line.label}:</span>
              <span className={`text-right break-words ${line.isBold ? 'font-bold' : ''}`}>
                {line.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Separator */}
      <div className="overflow-hidden text-center text-gray-600 my-1 text-[0.9em] select-none whitespace-nowrap leading-none">
        {getSeparatorLine()}
      </div>

      {/* 3. Item List (58mm 2-Row Optimized Layout) */}
      <div className="space-y-1.5 mb-2">
        {data.items.map((item, index) => {
          const itemSubtotal = (item.qty * item.price) - (item.discount || 0);
          return (
            <div key={item.id || index} className="space-y-0.5">
              {/* Row 1: Item Name */}
              <div className="font-bold text-gray-900 leading-tight text-[1em]">
                {data.settings.uppercaseItems ? item.name.toUpperCase() : item.name}
              </div>

              {/* Row 2: Qty x Price and Subtotal */}
              <div className="flex justify-between text-gray-800 text-[0.95em]">
                <span>
                  {item.qty} x {formatRupiah(item.price)}
                  {item.discount ? (
                    <span className="text-[0.85em] text-gray-600 ml-1">
                      (-{formatRupiah(item.discount)})
                    </span>
                  ) : null}
                </span>
                <span className="font-bold text-right">
                  {formatRupiah(itemSubtotal)}
                </span>
              </div>

              {/* Optional Item Note */}
              {item.note && (
                <div className="text-[0.85em] text-gray-600 italic pl-2">
                  * {item.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Separator */}
      <div className="overflow-hidden text-center text-gray-600 my-1 text-[0.9em] select-none whitespace-nowrap leading-none">
        {getSeparatorLine()}
      </div>

      {/* 4. Calculations & Totals */}
      <div className="space-y-1 text-[0.95em]">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold">{formatRupiah(data.calculation.subtotal)}</span>
        </div>

        {data.calculation.discountAmount > 0 && (
          <div className="flex justify-between text-gray-800">
            <span>Diskon Nota:</span>
            <span>-Rp {formatRupiah(data.calculation.discountAmount)}</span>
          </div>
        )}

        {data.calculation.taxEnabled && (
          <div className="flex justify-between text-gray-800">
            <span>Pajak ({data.calculation.taxPercent}%):</span>
            <span>
              Rp {formatRupiah(Math.round(data.calculation.subtotal * (data.calculation.taxPercent / 100)))}
            </span>
          </div>
        )}

        {data.calculation.serviceChargeEnabled && data.calculation.serviceCharge > 0 && (
          <div className="flex justify-between text-gray-800">
            <span>Biaya Layanan:</span>
            <span>Rp {formatRupiah(data.calculation.serviceCharge)}</span>
          </div>
        )}

        {/* Separator before Total */}
        <div className="overflow-hidden text-center text-gray-600 my-1 text-[0.9em] select-none whitespace-nowrap leading-none">
          {getSeparatorLine()}
        </div>

        {/* GRAND TOTAL (Big & Bold) */}
        <div className="flex justify-between items-baseline font-black text-black py-0.5 text-[1.2em]">
          <span>TOTAL:</span>
          <span className="text-[1.25em]">Rp {formatRupiah(data.calculation.grandTotal)}</span>
        </div>

        {/* Payment Method & Paid */}
        <div className="flex justify-between pt-0.5">
          <span>Bayar ({data.calculation.paymentMethod || 'Tunai'}):</span>
          <span className="font-semibold">Rp {formatRupiah(data.calculation.paidAmount)}</span>
        </div>

        <div className="flex justify-between items-baseline font-bold text-black pt-0.5 text-[1.05em]">
          <span>KEMBALIAN:</span>
          <span className="text-[1.15em]">
            {data.calculation.change < 0 ? (
              <span className="text-red-700">Kurang Rp {formatRupiah(Math.abs(data.calculation.change))}</span>
            ) : (
              `Rp ${formatRupiah(data.calculation.change)}`
            )}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="overflow-hidden text-center text-gray-600 my-1.5 text-[0.9em] select-none whitespace-nowrap leading-none">
        {getSeparatorLine()}
      </div>

      {/* 5. Footer Notes & QR / Barcode */}
      <div className="text-center space-y-1.5 mt-2">
        {(data.footer.lines || []).map((line, idx) => (
          <p
            key={line.id || idx}
            className={`leading-tight ${
              line.isBold ? 'font-bold text-[0.95em]' : 'text-[0.88em] text-gray-700'
            }`}
          >
            {line.text}
          </p>
        ))}

        {/* QR Code */}
        {data.footer.showQrCode && data.footer.qrCodeData && (
          <div className="flex flex-col items-center justify-center pt-2 pb-1">
            <div className="p-1.5 bg-white border border-black inline-block">
              <QRCodeSVG
                value={data.footer.qrCodeData}
                size={84}
                level="M"
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
            <span className="text-[0.75em] text-gray-600 mt-0.5">Scan QR / Pembayaran</span>
          </div>
        )}

        {/* Barcode */}
        {data.footer.showBarcode && data.footer.barcodeData && (
          <div className="flex justify-center pt-1 overflow-hidden">
            <svg ref={barcodeRef} className="max-w-full" />
          </div>
        )}
      </div>

    </div>
  );
});

ThermalReceipt.displayName = 'ThermalReceipt';
