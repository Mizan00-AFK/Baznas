import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { CALC_MODES, ZakatCalculator } from "../components/ZakatCalculator";
import { tx } from "../lib/i18n";

/**
 * Kalkulator Zakat — jenis kalkulator mengikuti baznas.go.id/kalkulatorzakat.
 * Perubahan: dipindah ke menu Edukasi ZIS (P7), hasil langsung tanpa tombol
 * Hitung (P8a), pemisah ribuan & Reset (P6 b.iii).
 */
export function KalkulatorZakat() {
  return (
    <>
      <PageHeader title={tx("Kalkulator Zakat")}
        description={tx("Layanan untuk mempermudah perhitungan jumlah zakat yang harus ditunaikan sesuai ketentuan syariah. Hasil langsung diperbarui saat Anda mengetik.")}
      />
      <PageBody>
        <Card>
          <ZakatCalculator
            modes={[CALC_MODES.penghasilan, CALC_MODES.jasa, CALC_MODES.perusahaan, CALC_MODES.perdagangan, CALC_MODES.emas]}
          />
        </Card>
      </PageBody>
    </>
  );
}
