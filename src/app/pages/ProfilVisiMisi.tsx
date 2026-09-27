import { AttributionControl, CircleMarker, MapContainer, Popup, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ExternalLink } from "lucide-react";
import { Card, PageBody, PageHeader } from "../components/PageHeader";
import { PROVINCES } from "../data/content";
import { tx, useI18n } from "../lib/i18n";

/** Teks Visi & Misi mengikuti baznas.go.id/baznas-profile. */
const MISI = [
  tx("Memperkuat tata kelola zakat nasional dengan sistem manajemen yang modern dan akuntabel antara lain melalui digitalisasi dan modernisasi."),
  tx("Memperkuat SDM Amil yang kompeten, adaptif, dan sejahtera untuk pengelolaan zakat yang efektif."),
  tx("Memperkuat jaringan kelembagaan BAZNAS hingga tingkat desa sebagai ujung tombak pelayanan zakat berbasis komunitas."),
  tx("Meningkatkan koordinasi dan kolaborasi lintas Kementerian/Lembaga, pemerintah daerah, LAZ, dan pemangku kepentingan zakat untuk mendukung pencapaian program nasional pemerintah."),
  tx("Memperkuat riset dan inovasi untuk meningkatkan efektivitas, akuntabilitas, dan dampak pengelolaan zakat."),
  tx("Meningkatkan pengumpulan zakat, infak, dan sedekah secara nasional melalui penguatan inovasi layanan dan perluasan basis muzaki."),
  tx("Mengakselerasi pengentasan kemiskinan dan ketimpangan melalui pendistribusian dan pendayagunaan zakat yang transformatif dan berdampak."),
  tx("Mengukuhkan Indonesia sebagai model zakat dunia."),
];

export function ProfilVisiMisi() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={tx("Visi dan Misi")} description={tx("Profil Badan Amil Zakat Nasional (BAZNAS) Republik Indonesia.")} />
      <PageBody>
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <Card className="bg-[#1a7a3a] text-white border-transparent">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">{t("Visi")}</h2>
              <p className="mt-3 text-xl font-bold leading-snug sm:text-2xl">
                {t("Menjadi Model Pengelola Dana Umat untuk Kemajuan dan Kesejahteraan")}
              </p>
            </Card>
            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">{t("Misi")}</h2>
              <ol className="mt-3 space-y-3">
                {MISI.map((m, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-gray-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-[#1a7a3a]">{i + 1}</span>
                    {t(m)}
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          {/* Peta Jaringan BAZNAS interaktif (Pertemuan 6 b.ii) */}
          <Card className="p-0 sm:p-0 overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">{t("Jaringan BAZNAS")}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {t("Perbesar atau geser peta, lalu klik titik provinsi untuk melihat detail kantor BAZNAS di daerah tersebut.")}
              </p>
            </div>
            <div className="isolate h-[360px] sm:h-[480px]" dir="ltr">
              <MapContainer bounds={[[6.2, 94.8], [-11.2, 141.2]]} minZoom={3} scrollWheelZoom={false} zoomControl={false} attributionControl={false} className="h-full w-full">
                <AttributionControl prefix={'<a href="https://leafletjs.com">Leaflet</a>'} />
                <ZoomControl key={t("Perbesar")} position="topleft" zoomInTitle={t("Perbesar")} zoomOutTitle={t("Perkecil")} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {PROVINCES.map((p) => (
                  <CircleMarker
                    key={p.slug}
                    center={[p.lat, p.lng]}
                    radius={6 + Math.sqrt(p.units) * 1.4}
                    pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#1a7a3a", fillOpacity: 0.9 }}
                  >
                    <Popup>
                      <div className="min-w-44" dir="auto">
                        <div className="text-base font-bold text-gray-900">{t("BAZNAS Provinsi {name}", { name: t(p.name) })}</div>
                        <div className="text-sm text-gray-500">{t("Kantor di {city}", { city: p.city })}</div>
                        <div className="mt-2 text-sm">
                          {t("{n} BAZNAS kabupaten/kota*", { n: p.units })}
                        </div>
                        <a href={`https://${p.slug}.baznas.go.id`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold">
                          {t("Kunjungi website")} <ExternalLink size={13} />
                        </a>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500 sm:px-6">
              {t("Ukuran titik sebanding dengan jumlah kabupaten/kota. *Angka ilustrasi untuk prototipe.")}
            </p>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
