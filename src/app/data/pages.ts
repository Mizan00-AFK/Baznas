// Konten halaman Profil, Layanan, Berita, dan Informasi — disarikan dari baznas.go.id (diakses 27 Sep 2026).
// Teks bertanda tx() diterjemahkan saat ditampilkan (lihat lib/locales). Nama orang, merek, dan lembaga tidak diterjemahkan.
import { tx } from "../lib/i18n";

/* ===================== PROFIL ===================== */

/** baznas.go.id/struktur-baznas */
export const STRUKTUR = [
  {
    group: tx("Jajaran Pimpinan"),
    people: [
      { name: "Dr. Ir. H. Sodik Mudjahid, M.Sc", role: tx("Ketua BAZNAS RI") },
      { name: "Dr. H. Zainut Tauhid Sa'adi, M.Si", role: tx("Wakil Ketua BAZNAS RI") },
      { name: "Hj. Saidah Sakwan, MA", role: tx("Pimpinan") },
      { name: "Dr. H. Rizaludin Kurniawan S.Ag, M.Si. CFRM", role: tx("Pimpinan") },
      { name: "H. Idy Muzayyad, S.HI, M.Si", role: tx("Pimpinan") },
      { name: "H. Syarifuddin, S.Ag., ME", role: tx("Pimpinan") },
      { name: "Dr. H. Mokhamad Mahdum, MIDEc, Ak, CPA", role: tx("Pimpinan") },
      { name: "Hj. Neyla Saida Anwar, SS., SE., SH., M.Hum", role: tx("Pimpinan") },
      { name: "Prof. Dr. H. Abu Rokhmad, M.Ag", role: tx("Pimpinan Ex-Officio Kementerian Agama RI") },
      { name: "H. Mochamad Agus Rofiudin", role: tx("Pimpinan Ex-Officio Kementerian Keuangan RI") },
      { name: "Dr. Drs. H. Agus Fatoni, M.Si", role: tx("Pimpinan Ex-Officio Kementerian Dalam Negeri") },
    ],
  },
  {
    group: tx("Deputi dan Sekretaris Utama"),
    people: [
      { name: "Subhan Cholid, Lc, MA", role: tx("Sekretaris Utama") },
      { name: "H. M. Arifin Purwakananta, S.I.Kom., M.IKom., CWC., CFRM.", role: tx("Deputi Mobilisasi dan Pengumpulan") },
      { name: "Dr. H. M. Imdadun Rahmat, M.Si", role: tx("Deputi Pendistribusian, Pendayagunaan dan Pemberdayaan") },
    ],
  },
];

/** baznas.go.id/program/* */
export const PROGRAMS = [
  {
    id: "kemanusiaan",
    name: tx("Kemanusiaan"),
    items: [
      { name: tx("Paket Logistik Keluarga"), desc: tx("Bantuan paket sembako dalam kemasan yang layak diberikan kepada mustahik untuk memenuhi kebutuhan pokok.") },
      { name: tx("Bank Makanan"), desc: tx("Bantuan makanan siap saji bagi mustahik di wilayah kantong kemiskinan.") },
      { name: tx("Bantuan Sosial Kemanusiaan"), desc: tx("Bantuan tunai bagi mustahik perorangan atau keluarga untuk memenuhi kebutuhan hidup selama satu bulan.") },
      { name: tx("Santunan Yatim dan Dhuafa"), desc: tx("Bantuan kontribusi kegiatan santunan yang dikelola oleh lembaga sosial Islam atau ormas Islam.") },
      { name: tx("Bantuan Penyandang Disabilitas"), desc: tx("Bantuan bagi lembaga sosial Islam yang membantu penyandang disabilitas atau bagi individu penyandang disabilitas.") },
      { name: tx("Bantuan Rumah Layak Huni"), desc: tx("Program renovasi rumah yang bekerja sama dengan Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR).") },
      { name: tx("Zakat Fitrah"), desc: tx("BAZNAS menyalurkan zakat fitrah dalam bentuk beras kepada mustahik 8 asnaf.") },
      { name: tx("Kurban"), desc: tx("BAZNAS memberikan jaminan kaum Muslimin menunaikan ibadah kurban secara mudah, aman, dan sesuai syariah.") },
      { name: tx("Fidyah"), desc: tx("BAZNAS mengumpulkan dan mendistribusikan fidyah untuk disalurkan kepada orang miskin.") },
    ],
  },
  {
    id: "kesehatan",
    name: tx("Kesehatan"),
    items: [
      {
        name: tx("Layanan Dalam Gedung (Kuratif)"),
        desc: tx("Pelayanan penunjang medis di Rumah Sehat BAZNAS: poli umum, IGD, operasi minor, psikologi, spesialis, gigi, rawat inap, KB, dan fisioterapi."),
      },
    ],
  },
  {
    id: "pendidikan-dakwah",
    name: tx("Pendidikan dan Dakwah"),
    items: [
      { name: tx("Beasiswa Cendekia BAZNAS"), desc: tx("Dana pendidikan demi terjaminnya keberlangsungan pendidikan bagi mahasiswa dari keluarga kurang mampu serta sebagai pertanggungjawaban antargenerasi.") },
      { name: tx("Sekolah Cendekia BAZNAS (SCB)"), desc: tx("Sekolah unggulan bebas biaya dan berasrama bagi dhuafa berprestasi, berdiri di atas tanah wakaf seluas 1,5 hektare di Kabupaten Bogor.") },
      { name: tx("Dakwah BAZNAS"), desc: tx("Penyaluran di bidang dakwah yang berfokus pada mualaf, kaum marginal, wilayah 3T (Terdepan, Terluar, dan Tertinggal), prasarana ibadah, aktivitas keislaman, serta advokasi riqab.") },
      { name: tx("Permohonan Publik Bidang Pendidikan & Dakwah"), desc: tx("Penyaluran berdasarkan pengajuan proposal dari mustahik kepada BAZNAS di bidang pendidikan dan dakwah.") },
    ],
  },
  {
    id: "kebencanaan",
    name: tx("Kebencanaan"),
    items: [
      { name: tx("Penanganan Kebencanaan"), desc: tx("Penanganan kebencanaan melalui langkah rescue, relief, recovery, dan reconstruction.") },
      { name: tx("Penanganan Risiko Bencana (PRB)"), desc: tx("Penanganan risiko bencana melalui edukasi kebencanaan.") },
      { name: tx("Kerelawanan"), desc: tx("Kerelawanan melalui rekrutmen dan pelatihan relawan.") },
    ],
  },
  {
    id: "ekonomi-pedesaan",
    name: tx("Ekonomi Pedesaan"),
    items: [
      { name: tx("Balai Ternak"), desc: tx("Program pengembangan ekonomi mustahik di sektor peternakan.") },
      { name: tx("Lumbung Pangan"), desc: tx("Program pemberdayaan ekonomi mustahik pedesaan di bidang pertanian melalui pendekatan agribisnis berkelanjutan.") },
      { name: tx("Zakat Community Development (ZCD)"), desc: tx("Program pemberdayaan melalui komunitas dan desa dengan mengintegrasikan aspek dakwah, ekonomi, pendidikan, kesehatan, dan kemanusiaan.") },
      { name: tx("Pemberdayaan UMKM"), desc: tx("Program pemberdayaan usaha produktif mustahik untuk mengembangkan usaha dan memperluas lapangan kerja.") },
    ],
  },
  {
    id: "ekonomi-perkotaan",
    name: tx("Ekonomi Perkotaan"),
    items: [
      { name: tx("ZMart"), desc: tx("Pemberdayaan ekonomi dalam bentuk usaha ritel mikro untuk mengatasi kemiskinan di wilayah urban.") },
      { name: tx("ZChicken"), desc: tx("Pemberdayaan ekonomi mustahik di bidang kuliner berupa produk ayam krispi.") },
      { name: tx("Z-Auto"), desc: tx("Pemberdayaan UMKM di bidang usaha bengkel motor yang dikelola para mustahik.") },
      { name: tx("Santripreneur"), desc: tx("Pemberdayaan UMKM bagi pelaku usaha lulusan pesantren dan santri tingkat akhir.") },
      { name: tx("Bank Zakat Mikro"), desc: tx("Layanan keuangan mikro yang mendayagunakan dana ZIS-DSKL bagi mustahik pelaku usaha mikro.") },
      { name: tx("BAZNAS Microfinance Desa"), desc: tx("Fasilitas modal dan keuangan bagi masyarakat menengah ke bawah untuk mengatasi praktik rente.") },
      { name: tx("BAZNAS Microfinance Masjid"), desc: tx("Layanan keuangan mikro berbasis masjid yang mendayagunakan dana zakat, infak, dan sedekah.") },
    ],
  },
  {
    id: "optimasi-produk",
    name: tx("Optimasi dan Pemasaran Produk"),
    items: [{ name: tx("Z-Coffee"), desc: tx("Pemberdayaan ekonomi mustahik sebagai unit hilir berbasis produk hulu berupa kopi.") }],
  },
];

/** baznas.go.id/penghargaan — `local: true` berarti nama penghargaan berbahasa Indonesia dan diterjemahkan. */
/** baznas.go.id/penghargaan — `local: true`: nama penghargaan berbahasa Indonesia (diterjemahkan); `org`: nama penyelenggara (tidak diterjemahkan). */
export const AWARDS: { year: number; title: string; by?: string; org?: string; local?: boolean }[] = [
  { year: 2024, title: tx("Mitra Perumahan dan Penanganan Kawasan Kumuh"), by: tx("Kementerian Pekerjaan Umum"), local: true },
  { year: 2024, title: "Indonesia Customer Service Quality & Champions 2024", org: "Business Digest" },
  { year: 2024, title: "Best Halal Financial Support", org: "Indonesia Halal Industry Awards" },
  { year: 2024, title: "Community Marketing Program of the Year", org: "Marketeers Editor's Choice Award 2024" },
  { year: 2024, title: "Integrated Service Channel of the Year", org: "Marketeers Editor's Choice Award 2024" },
  { year: 2024, title: "Brand Enhancements of the Year", org: "Marketeers Editor's Choice Award 2024" },
  { year: 2024, title: "Top GRC Awards 2024 #3 Stars", org: "TopBusiness" },
  { year: 2024, title: tx("Opini Wajar Tanpa Pengecualian (WTP)"), by: tx("Audit laporan keuangan"), local: true },
  { year: 2024, title: "TOP BRAND 2024", by: tx("Kategori Zakat dan Amal") },
  { year: 2024, title: "Brand Management & Original Brand", org: "SWA" },
  { year: 2024, title: "Global Good Governance (3G) Awards 2024", by: tx("Pengembangan Masyarakat & Filantropi") },
  { year: 2024, title: "TOP Leader on CSR Commitment 2024" },
  { year: 2024, title: "TOP CSR Award 2024 (5 Stars)" },
  { year: 2024, title: tx("Penghargaan Bupati Bulukumba"), by: tx("Kontribusi ekonomi dan kesejahteraan"), local: true },
  { year: 2024, title: "ISO 9001:2015", by: tx("Sistem Manajemen Mutu") },
  { year: 2024, title: "SNI ISO 37001:2016", by: tx("Sistem Manajemen Anti Penyuapan") },
  { year: 2024, title: tx("Penghargaan BKKBN"), local: true },
  { year: 2024, title: tx("Tokoh Inspiratif Jawa Tengah"), org: "Prof. Dr. KH Noor Achmad MA.", local: true },
  { year: 2023, title: tx("Anugerah Keterbukaan Informasi Publik (KIP)"), local: true },
  { year: 2023, title: "ISO 9001:2015", by: tx("Sistem Manajemen Mutu") },
  { year: 2023, title: "Indonesian CSR Awards 2023", by: tx("Kategori Emas") },
  { year: 2023, title: "Top Digital Implementation 2023 (4 Stars)" },
  { year: 2023, title: tx("Lembaga Filantropi Layanan Terbaik"), org: "Anugerah Syariah Republika 2023", local: true },
  { year: 2023, title: "Top Human Capital Awards 2023 (4 Stars)" },
  { year: 2023, title: "The Best Innovation in Marketing", org: "Marketing Award 2023" },
  { year: 2023, title: "The Best Marketing Driving Company", org: "Marketing Award 2023" },
  { year: 2023, title: "Global Islamic Finance Award (GIFA) 2023" },
  { year: 2023, title: "Indonesia Digital Customer Engagement Champions", org: "SWA" },
  { year: 2023, title: "Indonesia Innovation Awards 2023" },
  { year: 2023, title: "TOP CSR Awards 2023 (4 Stars)" },
  { year: 2023, title: "3G Leadership Award in Community Development & Philanthropy 2023" },
  { year: 2023, title: "Best Digital Marketing Team", org: "SWA" },
  { year: 2023, title: "Top Leader on Digital Implementation 2023", org: "Prof. Dr. KH. Noor Achmad MA." },
  { year: 2023, title: "The Best in Marketing Campaign 'Excellent'", org: "Marketing Award 2023" },
  { year: 2023, title: tx("Tokoh Wanita Penggerak Zakat"), org: "Hj. Saidah Sakwan, MA", local: true },
  { year: 2023, title: "TOP Leader on CSR Commitment 2023", org: "M. Arifin Purwakananta" },
  { year: 2023, title: "3G Championship Award in Capacity Building 2023" },
  { year: 2023, title: tx("Penghargaan BKKBN 2023"), by: tx("Program Bangga Kencana dan Percepatan Penurunan Stunting"), local: true },
  { year: 2022, title: "Top Digital on Business Solution of Zakat Management 2022 (SIMBA)" },
  { year: 2022, title: tx("Penggiat Ekonomi Sosial Syariah"), org: "Bank Indonesia Award", local: true },
  { year: 2022, title: tx("Fundraising Zakat Terbaik 2022"), org: "IFA Award", local: true },
  { year: 2022, title: tx("Inovasi Fundraising Terbaik 2022"), org: "IFA Award", local: true },
  { year: 2022, title: tx("Akuntabilitas Terbaik"), org: "Anugerah Syariah Republika 2022", local: true },
  { year: 2022, title: "Indonesia Original Brand", org: "SWA" },
  { year: 2022, title: "Best Sales Team", org: "Indonesia Sales Team Championship 2022" },
  { year: 2022, title: "Top Brand Awards 2022", by: tx("Kategori Zakat dan Amal") },
  { year: 2022, title: tx("Opini Wajar Tanpa Pengecualian (WTP)"), by: tx("Laporan keuangan 2021"), local: true },
  { year: 2022, title: "Top CSR Award 2022", by: tx("Mitra Pengelolaan CSR") },
  { year: 2022, title: "Top Digital Implementation 2022 (4 Stars)" },
  { year: 2022, title: "Top Leader on Digital Implementation 2022", org: "Ir. H. M. Nadratuzzaman Hosen, Ph.D" },
  { year: 2022, title: tx("Fundraiser Terbaik 2022"), org: "IFA Award", local: true },
  { year: 2022, title: tx("Fundraising Digital Terbaik 2022"), org: "IFA Award", local: true },
  { year: 2022, title: "Best of The Best Customer Experience Team 2022", org: "SWA" },
  { year: 2022, title: "3G Leadership Award in Community Development & Philanthropy 2022" },
  { year: 2022, title: "3G Championship Award in Capacity Building 2022" },
  { year: 2022, title: "#MakinBerkah Award", by: tx("Mitra Zakat, Infak, dan Sedekah") },
  { year: 2022, title: "The Best Chief Innovation & Information Technology" },
  { year: 2022, title: "TOP Leader on CSR Commitment 2022", org: "Rizaludin Kurniawan, M.Si." },
  { year: 2022, title: "Top 5 Millennial Women Favourite Brand 2022", by: tx("Kategori Donasi Sosial Online") },
];

/** baznas.go.id/mitra-baznas + mitra pembayaran pada halaman layanan */
export const MITRA_STORIES = [
  { partner: "SiCepat Ekspres", text: tx("Program #IndahnyaRamadhan Tebar 1001 Kebaikan untuk Masjid bersama BAZNAS selama Ramadan.") },
  { partner: "Askrindo", text: tx("Kerja sama kegiatan khitanan massal di Rumah Sehat BAZNAS.") },
  { partner: "Unilever Indonesia", text: tx("Penyaluran bantuan kepada 44 yayasan panti asuhan binaan BAZNAS.") },
];

export const MITRA_GROUPS = [
  { name: tx("Mitra Retail"), items: ["Alfamart", "Alfamidi", "Dan+Dan", "Indomaret", "Lotte Grosir", "Pegadaian"] },
  { name: tx("Mitra Perbankan"), items: ["BSI", "Bank Mandiri", "BCA", "BRI", "BNI", "Bank Muamalat", "CIMB Niaga Syariah", "Bank Mega Syariah", "Permata Bank"] },
  { name: tx("Mitra Pembayaran Digital"), items: ["QRIS", "GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"] },
];

/* ===================== BERITA ===================== */

export type NewsItem = { date: string; title: string; summary?: string; author?: string };

/** baznas.go.id/berita/program-kemanusiaan */
export const BERITA_PROGRAM: NewsItem[] = [
  { date: "2026-08-27", title: tx("BAZNAS Distribusikan Kaki Prostetik untuk Penyandang Disabilitas di Bogor"), summary: tx("BAZNAS mendistribusikan alat bantu berjalan berupa kaki prostetik kepada penyandang disabilitas di Cibinong, Kabupaten Bogor, Jawa Barat.") },
  { date: "2026-08-03", title: tx("Paket Logistik BAZNAS Bantu Pemulihan Masyarakat Terdampak Bencana di Sibolga"), summary: tx("BAZNAS menyalurkan 100 paket logistik keluarga bagi masyarakat terdampak banjir bandang dan tanah longsor di empat kecamatan.") },
  { date: "2026-04-14", title: tx("Bantu Penyintas Banjir, Dapur Umum ZChicken BAZNAS Hadir di Baturaja"), summary: tx("Program ZChicken mendirikan dapur umum dan menyediakan 200 paket makanan siap saji bagi korban banjir di Ogan Komering Ulu.") },
  { date: "2026-02-04", title: tx("BAZNAS Penuhi Kebutuhan Logistik Keluarga di Jabodetabek"), summary: tx("Bantuan biaya hidup dan Paket Logistik Keluarga untuk masyarakat dengan keterbatasan ekonomi di wilayah Jabodetabek.") },
  { date: "2026-02-04", title: tx("BAZNAS Distribusikan Kaki Prostetik untuk Penyandang Disabilitas di Jakarta Utara"), summary: tx("Pendistribusian alat bantu berjalan berupa kaki prostetik kepada penyandang disabilitas di Kelurahan Pelumpang, Jakarta Utara.") },
  { date: "2026-01-23", title: tx("BAZNAS Distribusikan Tangan Prostetik untuk Penyandang Disabilitas di Bogor"), summary: tx("Pendistribusian tangan prostetik untuk penyandang disabilitas di Desa Cijeruk, Kabupaten Bogor.") },
];

/** baznas.go.id/news-all */
export const SIARAN_PERS: NewsItem[] = [
  { date: "2026-09-25", title: tx("BAZNAS RI dan Komite Bantuan Kepresidenan Palestina Perkuat Kerja Sama Kemanusiaan"), summary: tx("BAZNAS RI menandatangani Nota Kesepahaman (MoU) bersama Komite Bantuan Kepresidenan Palestina.") },
  { date: "2026-09-25", title: tx("Bertemu BAZNAS, Komite Kepresidenan Palestina Ungkap Kondisi Kritis Kemanusiaan"), summary: tx("Ketua Komite Bantuan Kepresidenan Negara Palestina mengungkapkan gambaran kondisi kritis kemanusiaan yang dihadapi masyarakat Palestina.") },
  { date: "2026-09-25", title: tx("BAZNAS RI Kembali Raih IHYA 2026 Kategori Dukungan Program Halal Terbaik"), summary: tx("BAZNAS RI kembali meraih penghargaan Indonesia Halal Industry Awards (IHYA) 2026.") },
  { date: "2026-09-24", title: tx("BAZNAS RI Gandeng OKP, Pastikan Bantuan Pendidikan bagi 1.000 Mahasiswa NTT Tepat Sasaran"), summary: tx("BAZNAS RI berkolaborasi dengan Organisasi Kemasyarakatan Pemuda dalam penyaluran bantuan pendidikan bagi 1.000 mahasiswa.") },
  { date: "2026-09-24", title: tx("BAZNAS RI Raih Penghargaan Indonesia Responsible Business Awards 2026"), summary: tx("BAZNAS RI meraih penghargaan atas kontribusi program yang dinilai memberikan dampak bagi penerima manfaat.") },
  { date: "2026-09-24", title: tx("BAZNAS RI dan UPZ IKA UNPAD Tandatangani MoU Perkuat Pemberdayaan Masjid"), summary: tx("BAZNAS RI bersama UPZ IKA UNPAD menandatangani MoU terkait penguatan Masjid Raya UNPAD.") },
  { date: "2026-09-24", title: tx("BAZNAS RI Lakukan Monev, Pastikan Beasiswa Pascasarjana Berdampak Optimal"), summary: tx("BAZNAS RI melakukan monitoring dan evaluasi Program Beasiswa guna memastikan dampak dan manfaat yang optimal.") },
  { date: "2026-09-24", title: tx("BAZNAS Beri Layanan Kesehatan Gratis dan Bantuan Pangan untuk Mualaf di Batam"), summary: tx("Melalui Rumah Sehat BAZNAS, BAZNAS memberikan layanan pemeriksaan kesehatan gratis kepada warga mualaf.") },
];

/** baznas.go.id/artikel-all */
export const ARTIKEL: NewsItem[] = [
  { date: "2026-09-25", title: tx("Sedekah Subuh Rabiul Awal: 7 Keutamaan dan Cara Mengamalkannya Setiap Hari"), author: "Humas BAZNAS RI" },
  { date: "2026-09-25", title: tx("Zakat Penghasilan Rabiul Awal: 3 Langkah Mudah Menghitung dan Menunaikan Zakat"), author: "Humas BAZNAS RI" },
  { date: "2026-09-24", title: tx("Infak Online Rabiul Awal: 9 Manfaat Infak di Era Digital yang Jarang Diketahui"), author: "Humas BAZNAS RI" },
  { date: "2026-09-24", title: tx("Sedekah Online Rabiul Awal: 5 Keutamaan Sedekah Digital yang Perlu Diketahui"), author: "Humas BAZNAS RI" },
  { date: "2026-09-23", title: tx("Apakah Boleh Puasa di Bulan Rabiul Akhir, Ini 5 Hal yang Wajib Diketahui"), author: "Humas BAZNAS RI" },
  { date: "2026-09-23", title: tx("Apakah Ada Puasa Khusus Rabiul Akhir, Ini Penjelasan yang Sering Dicari Umat Muslim"), author: "Humas BAZNAS RI" },
  { date: "2026-09-23", title: tx("Keutamaan Bulan Rabiul Akhir: 7 Amalan yang Dapat Menambah Pahala"), author: "Humas BAZNAS RI" },
  { date: "2026-09-23", title: tx("Rabiul Akhir Bulan yang Penuh Berkah, 5 Fakta yang Harus Diketahui"), author: "Humas BAZNAS RI" },
];

/** baznas.go.id/video-all (YouTube) */
export const VIDEOS = [
  { id: "EFZ39zmiRIM", date: "2026-09-25", title: tx("BAZNAS dan LAZ Muhajir Hadir untuk Palestina Lewat Ratusan Porsi Makanan Hangat") },
  { id: "NQaXQHlU_Vs", date: "2026-09-23", title: tx("BAZNAS Volunteer Gelar Aksi Sosial dan Edukasi Bencana Bersama Warga") },
  { id: "vkk0Z3xV7ho", date: "2026-09-23", title: tx("Beli Bisto, Ikut Sedekah! BAZNAS RI Hadirkan Program Kemanusiaan") },
  { id: "EVmR_Wv8HGY", date: "2026-09-22", title: tx("BAZNAS RI Gandeng LPAI Dukung Perlindungan Anak Rentan") },
  { id: "RLgXPTpByn0", date: "2026-09-22", title: tx("Pertama dalam Sejarah MTQ Nasional, Teman Tuli Buktikan Syiar Al-Qur'an Bisa Lewat Bahasa Isyarat") },
  { id: "gp5bHUKFtgI", date: "2026-09-22", title: tx("BAZNAS RI dan Kemenag Hadirkan Pesantren Nyaman Belajar di 700 Pesantren") },
  { id: "UCnDigpMdwI", date: "2026-09-17", title: tx("Dukung Penyintas Bencana, Reindo Syariah Salurkan Bantuan melalui BAZNAS") },
  { id: "yG4fSAw8eWM", date: "2026-09-17", title: tx("BAZNAS RI Kembali Raih Indonesia Most Reputable Companies Award 2026") },
];

/** baznas.go.id/newsletter-all */
export const NEWSLETTERS = [
  { year: 2025, month: 3 },
  { year: 2025, month: 1 },
  { year: 2024, month: 10 },
  { year: 2024, month: 9 },
  { year: 2024, month: 7 },
  { year: 2024, month: 6 },
  { year: 2024, month: 5 },
  { year: 2024, month: 4 },
];

/* ===================== INFORMASI LAINNYA ===================== */

/** baznas.go.id/pustaka */
export const PUSTAKA = [
  { title: tx("Kajian Nisab Zakat Pendapatan dan Jasa 2026"), year: 2026, author: "PUSKAS BAZNAS", pages: 58, desc: tx("Kajian penetapan nisab zakat pendapatan dan jasa tahun 2026.") },
  { title: tx("Pemberdayaan Zakat, Infak dan Sedekah Berbasis Pesantren"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-5858-07-4", pages: 92, desc: tx("Potensi pesantren dalam pemberdayaan ekonomi umat melalui ZIS.") },
  { title: tx("Indeks Kesiapan Digital Organisasi Pengelola Zakat"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-5858-06-7", pages: 65, desc: tx("Panduan teknis untuk mengukur kesiapan digital organisasi pengelola zakat.") },
  { title: tx("Perjalanan Kebangkitan BAZNAS"), year: 2021, author: "BAZNAS", pages: 403, desc: tx("Catatan dua dekade capaian BAZNAS dalam pengelolaan zakat.") },
  { title: tx("Kajian Zakat Perusahaan Publik Indonesia 2021"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-6614-94-5", pages: 169, desc: tx("Kajian zakat perusahaan berdasarkan UU No. 23 Tahun 2011.") },
  { title: tx("Indeks Kesehatan Organisasi Pengelola Zakat"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-6614-85-3", pages: 130, desc: tx("Variabel dan rumus untuk mengukur kesehatan keuangan dan manajemen organisasi pengelola zakat.") },
  { title: tx("Implementasi Indeks Pembangunan Zakatnomics 2021"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-6614-96-9", pages: 82, desc: tx("Penguatan kapasitas kelembagaan untuk mewujudkan potensi zakat Indonesia.") },
  { title: tx("Rencana Strategis BAZNAS 2020-2025"), year: 2021, author: "BAZNAS", pages: 146, desc: tx("Keputusan Ketua BAZNAS tentang rencana strategis lembaga.") },
  { title: tx("Standar Laboratorium Manajemen Zakat"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-5858-01-2", pages: 224, desc: tx("Pedoman praktik laboratorium bagi mahasiswa program studi manajemen zakat.") },
  { title: tx("Panduan Kodifikasi Program Zakat Berbasis Matriks SDGs"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-5858-03-6", pages: 84, desc: tx("Menghubungkan agenda SDGs dengan misi zakat mengentaskan kemiskinan.") },
  { title: tx("Panduan Manajemen Risiko Organisasi Pengelola Zakat"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-5858-04-3", pages: 138, desc: tx("Pentingnya manajemen risiko bagi lembaga pengelola dana amanah umat.") },
  { title: tx("Outlook Zakat Indonesia 2022"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-5858-05-0", pages: 150, desc: tx("Gambaran umum, statistik, analisis strategis, serta tantangan dan peluang zakat.") },
  { title: tx("Indeks Koordinasi Organisasi Pengelola Zakat"), year: 2021, author: "PUSKAS BAZNAS", isbn: "978-623-6614-95-2", pages: 106, desc: tx("Alat evaluasi fungsi koordinasi organisasi pengelola zakat sesuai regulasi.") },
];

/** baznas.go.id/lembaga-amil-zakat | lembaga-islam | lembaga-pendidikan */
export const LEMBAGA = [
  {
    id: "laz",
    name: tx("Lembaga Amil Zakat"),
    desc: tx("Lembaga Amil Zakat tingkat nasional yang telah mendapat rekomendasi BAZNAS."),
    items: [
      { name: "LAZ Al Irsyad Al Islamiyyah", sk: "579/ANG/BAZNAS/X/2020", web: "alirsyad.or.id" },
      { name: "LAZ Baitul Maal Hidayatullah", sk: "625/ANG/BAZNAS/XI/2020", web: "bmh.or.id" },
      { name: "LAZ Baitulmaal Muamalat", sk: "206/ANG/BAZNAS/III/2021", web: "baitulmaalmuamalat.org" },
      { name: "LAZ Daarut Tauhid", sk: "B.411/Set.BAZNAS/IV/2022", web: "dtpeduli.org" },
      { name: "LAZ Dana Sosial Al Falah Surabaya", sk: "919/ANG/BAZNAS/X/2021", web: "ydsf.org" },
      { name: "LAZ Dewan Da'wah Islamiyah Indonesia", sk: "R/054/BPR1-BHKL/KETUA/KD.02.05/IV/2022", web: "laznasdewandakwah.or.id" },
      { name: "LAZ Djalaludin Pane Foundation", sk: "326-01/ANG/BAZNAS/III/2020", web: "djalaluddinpane.org" },
      { name: "LAZ Dompet Dhuafa Republika", sk: "207/ANG/BAZNAS/III/2021", web: "dompetdhuafa.org" },
      { name: "LAZ Indosat", sk: "R/3334/BPR1-BHKL/KETUA/KD.02.05/III/2025", web: "zisindosat.id" },
      { name: "LAZ Inisiatif Zakat Indonesia", sk: "569/ANG/BAZNAS/X/2020", web: "izi.or.id" },
      { name: "LAZ LAGZIS Peduli", sk: "461/ANG/BAZNAS/VII/2020" },
      { name: "LAZ LAZIS NU", sk: "202/ANG/BAZNAS/I/2022", web: "nucare.id" },
      { name: "LAZ Lembaga Manajemen Infak Ukhuwah Islamiyah", sk: "352/ANG/BAZNAS/IV/2021", web: "lmizakat.org" },
      { name: "LAZ Muhammadiyah", sk: "209/ANG/BAZNAS/I/2022", web: "lazismu.org" },
      { name: "LAZ Nurul Hayat", sk: "570/ANG/BAZNAS/X/2020", web: "nurulhayat.org" },
      { name: "LAZ Panti Yatim Indonesia Al Fajr", sk: "R/3299/BPR1-BHKL/KETUA/KD.02.05/VIII/2024", web: "pantiyatim.or.id" },
      { name: "LAZ Perkumpulan Al Jamiyatul Washliyah", sk: "R/4628/BPR1-BHKL/KETUA/KD.02.05/VI/2025", web: "alzis.id" },
      { name: "LAZ Perkumpulan Persatuan Islam", sk: "R/056/BPR1-BHKL/KETUA/KD.02.05/IV/2022", web: "pzu.or.id" },
      { name: "LAZ Perkumpulan Syarikat Islam", sk: "R/0146/BPR1-BHKL/KETUA/KD.02.05/I/2024" },
      { name: "LAZ Pesantren Islam Al-Azhar", sk: "205/ANG/BAZNAS/III/2021", web: "alazharpeduli.com" },
    ],
  },
  {
    id: "islam",
    name: tx("Lembaga Islam"),
    desc: tx("Organisasi dan lembaga Islam yang menjadi jaringan BAZNAS."),
    items: [
      { name: "Majelis Ulama Indonesia (MUI)", web: "mui.or.id" },
      { name: "Nahdlatul Ulama (NU)", web: "nu.or.id" },
      { name: "Muhammadiyah", web: "muhammadiyah.or.id" },
      { name: "Al-Irsyad", web: "alirsyad.or.id" },
      { name: "Al Washliyah", web: "alwashliyah.id" },
      { name: "Dewan Dakwah Islamiyah Indonesia (DDII)", web: "dewandakwah.com" },
      { name: "Dewan Masjid Indonesia (DMI)", web: "dmi.or.id" },
      { name: "Ikatan Cendekiawan Muslim Indonesia (ICMI)", web: "icmijabar.com" },
      { name: "Nahdlatul Wathan (NW)", web: "nw.or.id" },
      { name: "Persatuan Islam (Persis)", web: "persis.or.id" },
    ],
  },
  {
    id: "pendidikan",
    name: tx("Lembaga Pendidikan"),
    desc: tx("Perguruan tinggi dengan program studi zakat dan wakaf."),
    items: [
      { name: "IAIN Bengkulu", web: "iainbengkulu.ac.id" },
      { name: "IAIN Langsa", web: "iainlangsa.ac.id" },
      { name: "IAIN Palangkaraya", web: "iain-palangkaraya.ac.id" },
      { name: "IAIN Purwokerto", web: "uinsaizu.ac.id" },
      { name: "IAIN Surakarta", web: "iain-surakarta.ac.id" },
      { name: "IAIN Batusangkar", web: "iainbatusangkar.ac.id" },
      { name: "IAIN Kudus", web: "iainkudus.ac.id" },
      { name: "IAIN Padangsidimpuan", web: "iain-padangsidimpuan.ac.id" },
      { name: "IAIN ParePare", web: "iainpare.ac.id" },
      { name: "IAIN Ponorogo", web: "iainponorogo.ac.id" },
      { name: "Institut Ilmu Al-Qur'an (IIQ) Jakarta", web: "iiq.ac.id" },
      { name: "STAI Aceh Tamiang", web: "staiat.mysch.id" },
    ],
  },
];

/** baznas.go.id/kebijakan-privasi */
export const PRIVASI = [
  { h: tx("Kewajiban Pengelola Situs atas Data Pengguna"), p: tx("Pengelola menjaga kerahasiaan data pengguna dan tidak menampilkan atau memberikannya kepada pihak lain tanpa perjanjian tertulis terlebih dahulu, kecuali diwajibkan oleh ketentuan hukum, perintah pengadilan, atau aparat yang berwenang.") },
  { h: tx("Tanggung Jawab Pengelola"), p: tx("Pengelola hanya bertanggung jawab atas data yang diberikan langsung oleh pengguna, bukan atas pertukaran data antarpengguna.") },
  { h: tx("Hak Mengubah Ketentuan"), p: tx("Pengelola berhak mengubah ketentuan terkait data pengguna tanpa pemberitahuan terlebih dahulu, dengan tetap menjaga kerahasiaan data.") },
  { h: tx("Data Geo-Location"), p: tx("Dikumpulkan dengan persetujuan pengguna untuk fungsi presensi dan manajemen SDM, disimpan dengan aman, dan tidak dibagikan kepada pihak ketiga kecuali diwajibkan hukum.") },
  { h: tx("Data Bluetooth"), p: tx("Dimanfaatkan untuk mendukung perangkat seperti printer thermal dan hanya dikumpulkan saat dibutuhkan dengan persetujuan pengguna.") },
  { h: tx("Penyimpanan Informasi"), p: tx("Data disimpan hingga masa kerja pengguna di BAZNAS berakhir.") },
  { h: tx("Perubahan Kebijakan"), p: tx("BAZNAS dapat mengubah kebijakan privasi ini sewaktu-waktu dan mengimbau pengguna untuk meninjaunya secara berkala.") },
];

/** Kategori informasi publik sesuai UU No. 14 Tahun 2008 (situs PPID: ppid.baznas.go.id) */
export const PPID_KATEGORI = [
  { h: tx("Informasi Berkala"), p: tx("Informasi yang wajib disediakan dan diumumkan secara rutin, seperti profil lembaga, program, dan laporan keuangan.") },
  { h: tx("Informasi Serta Merta"), p: tx("Informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum, diumumkan tanpa penundaan.") },
  { h: tx("Informasi Setiap Saat"), p: tx("Informasi yang wajib tersedia dan dapat diminta kapan saja oleh masyarakat.") },
  { h: tx("Informasi Dikecualikan"), p: tx("Informasi yang tidak dapat dibuka untuk publik sesuai ketentuan peraturan perundang-undangan.") },
];

export const PPID_LANGKAH = [
  tx("Ajukan permohonan informasi melalui situs PPID, email, atau datang langsung ke kantor BAZNAS."),
  tx("Lengkapi identitas diri dan rincian informasi yang dibutuhkan beserta tujuan penggunaannya."),
  tx("Petugas PPID memproses permohonan dan memberikan tanggapan sesuai jangka waktu yang diatur undang-undang."),
  tx("Jika tidak puas dengan tanggapan, pemohon dapat mengajukan keberatan kepada atasan PPID."),
];
