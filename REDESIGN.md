# Catatan Redesain UI/UX Website BAZNAS — Kelompok 11

Prototipe high-fidelity dari siklus Lean UX (Pertemuan 4). Aturan yang dipakai:

1. **Menu dan beranda** mengikuti rancangan kelompok (`src/imports/Rancangan_Plan.txt` dan wireframe).
2. **Halaman lain** mengikuti isi dan struktur website asli (baznas.go.id). Yang diubah hanya hal yang disebut di file Pertemuan 6–9.
3. Semua halaman memakai kerangka yang sama: navbar → breadcrumb → judul rata kiri → kartu. Tampilan menyesuaikan layar ponsel, tablet, dan desktop.

Evaluasi memakai QUIS (Pertemuan 5). Jalankan dengan `npm i` lalu `npm run dev`.

## Matriks keterlacakan

| Komponen / Halaman | Mengikuti | Perubahan berdasarkan materi | Sumber | Hipotesis |
|---|---|---|---|---|
| Navbar | Rancangan kelompok (tampilan menu tidak diubah) | Menu **maksimal 2 level**: submenu Bayar ZIS (Formulir, Rekening, Kantor Pusat BAZNAS) dinaikkan langsung ke menu Layanan sebagai "Formulir Bayar ZIS", "Rekening Zakat", "Kantor Pusat BAZNAS" | P7 b.i | H1 |
|  |  | "Kalkulator Zakat" ditambahkan ke menu Edukasi ZIS | P7 b.ii | H1 |
|  |  | Pemilih bahasa dari dropdown menjadi chip **ID \| EN \| AR** | P6 b.i | H2 |
|  |  | Layar < 1280 px memakai menu hamburger dengan struktur yang sama (responsif) | – | – |
| **Pencarian global** (navbar, Ctrl+K, `/cari`) | – (situs asli tidak punya pencarian) | Saran otomatis, pencarian per kategori (8 kategori), filter, pengurutan (relevansi/terbaru/terlama/A–Z), riwayat & pencarian populer, sorot kata kunci | P7 (navigasi untuk menemukan informasi), P6 (umpan balik instan) | H1, H2 |
| **Filter & urutan di halaman daftar** | Berita, Baznas TV, Newsletter, Pustaka, Penghargaan, Profil Program, Jaringan Lembaga, Website Daerah, FAQ, Laporan, Rekening | Kotak cari + filter + urutan yang tersimpan di URL sehingga bisa dibagikan dan dibuka langsung dari hasil pencarian | P6 b.v (filter langsung tanpa memuat ulang) | H1 |
| Breadcrumb | Rancangan kelompok (bilah abu-abu) | Tampil di semua halaman, dibuat otomatis dari struktur menu | Rancangan_Plan | H2 |
| Beranda | Rancangan kelompok + wireframe | Pintasan rata kiri, carousel bisa digeser, ringkasan transparansi | P6 a.v, P9 a, P9 c | H1, H5 |
| Back to top | Situs asli | Dipertahankan | P6 a.vi, P7 a.vi | – |
| Layanan › **Formulir Bayar ZIS** | Situs asli bayarzakat: gambar, judul, tab Isi Formulir/Kalkulator, jenis dana, jumlah jiwa/hari/hewan, data diri, metode pembayaran, niat, panggilan 14047 | **Indikator tahapan** (Isi Formulir → Pilih Pembayaran → Selesaikan Pembayaran → Selesai) + **status transaksi** sampai BSZ terkirim | P9 b | H4 |
|  |  | **Pemisah ribuan otomatis** dan tombol **Reset** yang bisa diurungkan | P6 b.iii | H3 |
|  |  | Tab Kalkulator: hasil langsung tanpa tombol Hitung | P8 a | – |
| Layanan › **Rekening Zakat** | Situs asli: 6 kategori (Zakat 28, Infak 17, Sedekah 4, Program Tematik 14, UPZ 2, Zakat Perusahaan 1) dengan nomor rekening resmi dan logo bank | Tab kategori, Program Tematik dikelompokkan per program, tombol Salin, tautan langsung `?kategori=` | P6 (manipulasi langsung) | – |
| Layanan › **Kantor Pusat BAZNAS** | Situs asli "Layanan Pembayaran": kantor pusat, jemput zakat, kasir retail | Peta **tertanam** di halaman, bukan tautan Google Maps | P6 b.iv | – |
| Edukasi ZIS › **Kalkulator Zakat** | Situs asli: Penghasilan, Jasa, Perusahaan, Perdagangan, Emas; nisab; "belum mencapai nisab, KLIK untuk sedekah" | Dipindah ke menu Edukasi ZIS; hasil langsung; pemisah ribuan; Reset | P7 b.ii, P8 a, P6 b.iii | H1, H3 |
| Profil › **Visi dan Misi** | Situs asli (teks Visi & 8 Misi) | Peta **Jaringan BAZNAS interaktif** (zoom, geser, klik → pop-up) | P6 b.ii | H5 |
| Profil › **Struktur BAZNAS** (sebelumnya "Pejabat Baznas") | Situs asli: 11 pimpinan + 3 deputi/sekretaris utama | Kartu per kelompok, pimpinan utama ditonjolkan | – | – |
| Profil › **Profil Program** | Situs asli: 7 bidang program beserta sub-programnya | Tab bidang (satu halaman, tanpa pindah-pindah halaman) | P7 (lebar & dangkal) | H1 |
| Profil › **Penghargaan** | Situs asli: 59 penghargaan 2022–2024 | Ringkasan jumlah per tahun + filter tahun | P6 (manipulasi langsung) | – |
| Profil › **Mitra Baznas** | Situs asli: kolaborasi terbaru + mitra retail/digital | Mitra dikelompokkan (retail, perbankan, pembayaran digital) | – | – |
| Layanan › **Register Penerima Zakat** | Situs asli: WhatsApp Layanan Mustahik | Alur 4 langkah yang jelas + tombol WhatsApp | P9 (visibilitas tahapan) | H4 |
| Layanan › **Register Relawan**, **Register Label Taat Zakat** | Program Kerelawanan (bidang Kebencanaan); Label Taat Zakat | Formulir dengan validasi inline | P4 (pencegahan kesalahan) | – |
| Berita › **Berita Program, Siaran Pers, Artikel** | Judul & ringkasan terbaru dari situs asli | Berita utama + daftar, tautan ke artikel lengkap | – | – |
| Berita › **Baznas TV** | Video YouTube asli | Video diputar langsung di halaman | P6 a.viii | – |
| Berita › **Newsletter** | Situs asli: edisi 2024–2025 | Kartu edisi + unduh | – | – |
| **PPID** | ppid.baznas.go.id (tidak dapat diakses saat penyusunan) | Kategori informasi publik (UU 14/2008) + alur permohonan + tautan ke situs PPID | – | – |
| Informasi Lainnya › **Panduan Brand, Pustaka, Jaringan Lembaga** | Situs asli (logo & unduhan; 13 publikasi; 20 LAZ, 10 lembaga Islam, 12 lembaga pendidikan) | Pencarian & filter tahun (Pustaka), tab jenis lembaga | P6 | – |
| Footer › **Kontak, Kebijakan Privasi** | Situs asli (call center 14047, WA, email resmi; 8 butir kebijakan) | Kanal kontak yang bisa langsung diklik + peta tertanam | P6 b.iv | – |
| Informasi Lainnya › **Laporan** | Situs asli: Laporan Keuangan Audited 2024–2012 + Laporan Bulanan 2025–2010 | Ikon mata diganti **ikon folder/unduh**; **filter tahun** | P6 b.v | – |
|  |  | **Ringkasan visual** (grafik + tampilan tabel) | P9 c | H5 |
| Informasi Lainnya › **Website Baznas Daerah** | Situs asli: Provinsi / Kabupaten / Kota | Tautan diberi **affordance** (warna, garis bawah, ikon eksternal) | P6 b.vi | – |
| FAQ (footer) | Situs asli: 11 pertanyaan berstruktur accordion | Dipertahankan | P8 e | – |
| Konfirmasi Zakat | Situs asli (formulir konfirmasi) | Validasi inline | P4 (heuristik pencegahan kesalahan) | – |
| Halaman lain | – | Halaman "belum termasuk prototipe" dengan breadcrumb dan tautan ke halaman aslinya di baznas.go.id | – | – |

## Konsistensi & responsif

- Semua halaman memakai lebar kontainer `max-w-7xl`, jarak tepi 16/24 px, warna hijau `#1a7a3a`, kartu bersudut 12 px, dan tinggi input 44 px.
- **Ponsel & tablet (< 1280 px):**
  - menu hamburger,
  - kolom ditumpuk,
  - tab bisa digeser horizontal.
- **Desktop (≥ 1280 px):** tampilan menu persis seperti rancangan awal.
- **Aksesibilitas:**
  - tautan "Lewati ke konten",
  - fokus keyboard terlihat,
  - dukungan *reduced motion*,
  - label ARIA,
  - tabel alternatif untuk grafik.

## Catatan

- Angka keuangan, statistik, jumlah kab/kota, nomor VA, dan tarif fitrah/fidyah/kurban adalah **data ilustrasi**, dan sudah diberi label di halaman.
- Nomor rekening di halaman Rekening Zakat adalah **rekening resmi** dari baznas.go.id/rekening. Nama bank mengikuti logo pada situs asli karena beberapa label teks di situs asli tidak sesuai logonya.
- Konten halaman Profil, Berita, Layanan, dan Informasi disarikan dari baznas.go.id pada 27 September 2026. Formulir pendaftaran bersifat simulasi (data tidak dikirim).
- **Tiga bahasa penuh (ID | EN | AR).** Semua teks antarmuka diterjemahkan: menu, isi halaman, data berita/FAQ, pesan validasi, notifikasi, label aksesibilitas, placeholder, nama bulan, dan tanggal. Mode Arab memakai arah kanan-ke-kiri (RTL). Yang sengaja tidak diterjemahkan: teks di dalam gambar banner, nama merek (bank, e-wallet, gerai), nama kota/kabupaten, nomor, dan alamat email.
  - Kamus ada di `src/app/lib/locales/en.ts` dan `ar.ts`, dengan kunci berupa teks Bahasa Indonesia aslinya.
  - Menambah teks baru: tulis `t("Teks Indonesia")` di komponen (atau `tx("...")` untuk data), lalu tambahkan terjemahannya di kedua kamus. Saat `npm run dev`, teks yang belum diterjemahkan tercatat di atribut `data-i18n-missing` pada elemen `<html>`.
  - Bahasa juga bisa dipilih lewat alamat, misalnya `?lang=en` atau `?lang=ar`.
- Tombol akses cepat melayang (PPID, Layanan Mustahik, Bayar Zakat, Konfirmasi Zakat, Transfer Zakat) dihapus atas keputusan kelompok. Pembayaran tetap mudah dijangkau lewat pintasan di beranda dan menu Layanan. Konfirmasi Zakat bisa dibuka dari footer, halaman Rekening, dan FAQ.
- Alamat lama `/layanan/bayar-zis/formulir`, `/rekening`, dan `/kantor` otomatis dialihkan ke alamat baru.
