/** Ambil hanya digit dari teks masukan pengguna. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

// Pemisah ribuan mengikuti bahasa aktif: "." untuk Indonesia, "," untuk Inggris/Arab.
let thousandSeparator = ".";
export function setThousandSeparator(separator: string) {
  thousandSeparator = separator;
}

/** "20000000" -> "20.000.000" (atau "20,000,000" untuk EN/AR). */
export function formatThousands(value: string | number): string {
  const digits = typeof value === "number" ? String(Math.round(value)) : digitsOnly(value);
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
}

export function parseRupiah(value: string): number {
  const digits = digitsOnly(value);
  return digits ? Number(digits) : 0;
}

export function formatRupiah(value: number): string {
  return "Rp " + formatThousands(Math.max(0, Math.round(value)));
}

/** Ringkas: 4.070.000.000 -> "Rp 4,07 M", 1.250.000.000.000 -> "Rp 1,25 T". */
export function formatRupiahCompact(value: number): string {
  const units: [number, string][] = [
    [1e12, "T"],
    [1e9, "M"],
    [1e6, "Jt"],
  ];
  for (const [base, suffix] of units) {
    if (value >= base) {
      return `Rp ${(value / base).toLocaleString("id-ID", { maximumFractionDigits: 2 })} ${suffix}`;
    }
  }
  return formatRupiah(value);
}
