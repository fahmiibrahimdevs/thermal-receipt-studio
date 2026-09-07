export function formatRupiah(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('id-ID').format(val);
}

export function generateReceiptNo(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${y}${m}${d}-${rand}`;
}
