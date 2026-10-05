# ROADMAP IMPLEMENTASI FRONTEND DRIVEO (v3.0)
### Berdasarkan Dokumen Acuan: `SRS_DOKUMEN.md` (v1.0) & `RENCANA-HALAMAN.md`
> **Standar Desain:** UI/UX Pro Max (Clean Light Mode, *Zero AI-Slop*, Tipografi *Plus Jakarta Sans* + *Inter Tabular*, Touch Target $\ge 44\times 44$px, Palet Visual Otentik Yogyakarta).  
> **Cakupan Total:** 80 Halaman (60 Sisi Pengguna + 20 Backoffice Admin) + 25 Komponen/Dialog Interaktif.  
> **Urutan Pengerjaan:** Sesuai instruksi: **(1) Aktor Penyewa & Marketplace Publik $\rightarrow$ (2) Aktor Pemilik Rental $\rightarrow$ (3) Aktor Admin Backoffice**.

---

## RINGKASAN STATUS FASE PENGERJAAN

```text
[X] FASE 0 : Setup Sistem, Shell & Error Handling (#58, #59, #60) ----------- SELESAI (100%)
[X] FASE 1 : Landing Page & Gerbang Autentikasi 3 Role (#1, #10–#14) -------- SELESAI (100%)
[X] FASE 2 : Marketplace Publik & Komparasi Armada (#2–#9) ----------------- SELESAI (100%)
[X] FASE 3 : Profil Penyewa, Hak Privasi UU PDP & e-KYC (#15–#17) ---------- SELESAI (100%)
[X] FASE 4 : Booking, Kontrak Elektronik & Bayar Escrow (#18–#22) ----------- SELESAI (100%)
[X] FASE 5 : Pelunasan, Serah Terima & Pengembalian Unit (#23–#26) ---------- SELESAI (100%)
[X] FASE 6 : Ulasan Dua Arah, Bantuan CS & Tiket Sengketa (#27–#32) --------- SELESAI (100%)
[X] FASE 7 : Onboarding Mitra Rental, Legalitas NIB & Kontrak (#33–#35) ----- SELESAI (100%)
[ ] FASE 8 : Manajemen Armada Plat AB, STNK & Listing Mobil (#36–#41) ------- TAHAP BERIKUTNYA
[ ] FASE 9 : Kalender Ketersediaan Multi-Kanal & Operasional (#42–#47) ------ SISI MITRA RENTAL
[ ] FASE 10: Serah Terima Mitra, Klaim Deposit & "Dana Saya" (#48–#57) ------ SISI MITRA RENTAL
[ ] FASE 11: Pusat Komando Admin, Verifikasi e-KYC & Legalitas (#61–#66) ---- SISI ADMIN BACKOFFICE
[ ] FASE 12: Pusat Mediasi Sengketa, Escrow, CS & Audit Log (#67–#80) ------- SISI ADMIN BACKOFFICE
[ ] FASE 13: Uji Alur Integrasi End-to-End (E2E) 3 Aktor & QA --------------- FINAL REVIEW
```

---

## TAHAPAN YANG SUDAH SELESAI (100% VERIFIED)

### [x] FASE 0: SETUP SISTEM, SHELL & ERROR HANDLING
*Target: Menyiapkan infrastruktur Next.js 16 App Router, desain token UI/UX Pro Max, dan 3 halaman penanganan sistem.*
- [x] Konfigurasi token Tailwind CSS v4 di `app/globals.css` (Palet warna Jogja Sunrise, `.tabular-nums`, target sentuh $\ge 44$px).
- [x] Setup Root Layout di `app/layout.tsx` (Plus Jakarta Sans + Inter Tabular, SEO metadata).
- [x] **Halaman #58 (`app/not-found.tsx`)**: 404 Not Found dengan search bar dan shortcut titik jemput DIY.
- [x] **Halaman #59 (`app/403/page.tsx`)**: 403 Forbidden dengan kartu panduan hak akses RBAC (Penyewa vs Rental vs Admin).
- [x] **Halaman #60 (`app/error.tsx` & `app/global-error.tsx`)**: Error Boundary penangkap kegagalan runtime dengan ID korelasi CS.

### [x] FASE 1: LANDING PAGE GUEST & GERBANG AUTENTIKASI 3 ROLE
*Target: Halaman beranda visual otentik Yogyakarta berlatar foto keluarga dan modul autentikasi lengkap.*
- [x] **Halaman #1 (`app/page.tsx`)**: Beranda Publik / Guest:
  - Header Navbar model *transparent glass rounded* (`backdrop-blur-xl bg-white/70 rounded-full`).
  - Hero section berlatar foto keluarga & mobil SUV berlatar Tugu Jogja dan Merapi (`/images/hero-jogja-family.jpg`).
  - Widget mesin pencari armada DIY (Titik jemput YIA/Tugu/Lempuyangan/Malioboro/Sleman/Bantul, tanggal, dan tipe mobil).
  - Tiga Lapis Nilai DriveO (Marketplace, Operasional Digital, Trust Layer Escrow).
  - Tab kategori filter cepat (MPV, SUV, City Car, EV).
  - Katalog armada unggulan Plat AB dengan Price All-In, garansi deposit 100%, dan Freshness Tag.
  - *Guest Auth Intercept Modal* (mengarahkan pengunjung untuk login/daftar saat klik "Pesan").
- [x] **Halaman #10 (`app/daftar/page.tsx`)**: Registrasi dengan *Dual Role Switcher*:
  - Tab Penyewa (`FR-AUTH-001`): Nama KTP, WhatsApp, Email, Sandi + Strength meter, Checkbox UU PDP.
  - Tab Mitra Rental (`FR-RENTAL-001`): Nama usaha komersial, Nama PJ KTP, WhatsApp, Email, Wilayah DIY, Alamat garasi.
- [x] **Halaman #11 (`app/masuk/page.tsx`)**: Login terpadu Email / WhatsApp + Sandi (`FR-AUTH-002`), *Rate limiting* & respon netral (`SEC-001`), *Rental Context Selector* untuk staf, dan *Quick Demo Personas* (8 Role).
- [x] **Halaman #12 (`app/lupa-password/page.tsx`)**: Permintaan reset sandi netral + *cooldown timer* 60 detik.
- [x] **Halaman #13 (`app/reset-password/page.tsx`)**: Pembuatan sandi baru + indikator kekuatan sandi.
- [x] **Halaman #14 (`app/verifikasi-email/page.tsx`)**: Status instruksi aktivasi email baru + tombol kirim ulang.

---

## BAGIAN I: SISI AKTOR PENYEWA & MARKETPLACE PUBLIK

### FASE 2: MARKETPLACE PUBLIK, DETAIL ARMADA & KOMPARASI
> **Halaman yang dibangun:** Halaman #2 s.d. #9 pada `RENCANA-HALAMAN.md`
- [x] **Halaman #2: Katalog Pencarian Penuh (`app/cari/page.tsx`)**
  - Filter komprehensif: Lokasi jemput DIY, harga min-max, transmisi (Matic/Manual), kategori, bahan bakar, rating rental min 4.5+.
  - Sorting: Rekomendasi, Harga Terendah, Rating Tertinggi, Data Paling Segar.
  - Algoritma Penurunan Peringkat Listing Basi (`FR-LISTING-004` & `BR-027`): Tag "Perlu Konfirmasi Ulang".
  - Notifikasi Ambang Likuiditas Mikro (`BR-024`): Pesan jujur jika unit di klaster tersebut terbatas.
- [x] **Halaman #3: Detail Lengkap Kendaraan (`app/listing/[id]/page.tsx`)**
  - Galeri foto multi-sudut resolusi tinggi dengan viewer pop-up.
  - Rincian *Price All-In* interaktif (`BR-026`): Tarif harian sewa + Deposit jaminan (cair 100%) + Biaya antar-jemput.
  - Spesifikasi teknis mobil lengkap (kapasitas kursi, koper, mesin cc, ground clearance, fitur keselamatan TSS/ADAS).
  - Profil ringkas mitra rental pengelola (legalitas terverifikasi, rating bintang, jumlah sewa selesai).
  - Kalender ketersediaan interaktif unit tersebut.
  - Tombol aksi: "Pesan Sekarang" (cek auth) & "Tambah ke Komparasi".
- [x] **Halaman #4: Halaman Komparasi Armada (`app/bandingkan/page.tsx`)**
  - Tampilan perbandingan matriks 2–3 mobil berdampingan (`FR-SEARCH-003`).
  - Komparasi tarif harian, besaran deposit, transmisi, kapasitas bagasi, efisiensi BBM, dan skor reputasi mitra.
  - Kemampuan menghapus mobil dari komparasi dan langsung memesan dari tabel komparasi.
- [x] **Halaman #5: Profil Publik Mitra Rental (`app/rental/[id]/page.tsx`)**
  - Informasi resmi mitra: Alamat garasi, jam operasional, NIB terverifikasi, rating agregat.
  - Daftar seluruh armada mobil Plat AB yang dimiliki rental tersebut.
  - Ulasan dan testimoni terverifikasi dari penyewa terdahulu (`FR-REVIEW-003`).
- [x] **Halaman #6: Halaman Edukasi Kemitraan (`app/jadi-mitra/page.tsx`)**
  - Penjelasan keuntungan digitalisasi rental bagi pemilik armada lokal di Yogyakarta.
  - Skema perlindungan e-KYC anti-penggelapan dan simulasi pencairan dana sewa.
- [x] **Halaman #7: Syarat & Ketentuan Sewa (`app/syarat-ketentuan/page.tsx`)**
  - Klausul transparansi hak dan kewajiban penyewa, batas wilayah operasional sewa di DIY, dan kebijakan lepas kunci.
- [x] **Halaman #8: Kebijakan Privasi (`app/kebijakan-privasi/page.tsx`)**
  - Kebijakan kepatuhan terhadap UU Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022).
- [x] **Halaman #9: Pusat Bantuan & FAQ (`app/bantuan/page.tsx`)**
  - FAQ lengkap alur sewa dan cara kerja rekening escrow.
  - Formulir pengaduan langsung ke Customer Support (kepatuhan PP 80/2019).

### FASE 3: PROFIL PENYEWA, PENGATURAN PRIVASI & e-KYC KTP/SIM
> **Halaman yang dibangun:** Halaman #15 s.d. #17 pada `RENCANA-HALAMAN.md`
- [x] **Halaman #15: Profil Akun Penyewa (`app/akun/page.tsx`)**
  - Tampilan dan edit data diri (Nama, No WhatsApp, Foto Profil; Email terkunci).
  - Status lencana verifikasi identitas (Belum Verifikasi / Menunggu Review / Verified).
  - Ringkasan statistik sewa penyewa (total booking selesai, rating reputasi penyewa).
- [x] **Halaman #16: Pengaturan Privasi & Hak Hapus Data (`app/akun/privasi/page.tsx`)**
  - Manajemen persetujuan data pribadi (*Consent Management* - `FR-USER-003`).
  - Formulir Hak Penghapusan Data (*Right to be Forgotten* - `FR-USER-004`).
  - Proteksi sistem: Menolak/menunda penghapusan akun jika ada transaksi sewa aktif atau deposit yang belum selesai.
- [x] **Halaman #17: Verifikasi Identitas Elektronik / e-KYC (`app/akun/verifikasi/page.tsx`)**
  - Form upload KTP asli dengan panduan framing foto anti-buram (`FR-VERIFICATION-001`).
  - Form upload SIM A (mobil) atau SIM C (motor) aktif yang wajib untuk sewa lepas kunci.
  - Simulasi validasi format otomatis dan status progres (Disubmit $\rightarrow$ Diproses $\rightarrow$ Disetujui/Ditolak).

### FASE 4: ALUR BOOKING, KONTRAK SEWA ELEKTRONIK & PEMBAYARAN ESCROW
> **Halaman yang dibangun:** Halaman #18 s.d. #22 pada `RENCANA-HALAMAN.md`
- [x] **Halaman #18: Formulir Pemesanan Kendaraan (`app/pesan/[listingId]/page.tsx`)**
  - Pemilihan tanggal & jam mulai/selesai sewa dengan kalkulasi otomatis durasi sewa.
  - Pemilihan titik antar-jemput di DIY (Bandara YIA, Stasiun Tugu, Lempuyangan, dll).
  - Rincian kalkulasi biaya All-In transparan (`BR-026`).
  - Pilihan skema pembayaran: **Bayar DP** (20-30%) ATAU **Bayar Penuh di Awal** (dengan perk prioritas konfirmasi - `FR-PAYMENT-002`).
  - Penguncian slot armada sementara (`FR-BOOKING-001`).
- [x] **Halaman #19: Perjanjian Sewa Elektronik (`app/booking/[id]/perjanjian/page.tsx`)**
  - Penampil klausul kontrak sewa elektronik: Aturan lepas kunci, denda keterlambatan, tanggung jawab bensin & kerusakan.
  - Tombol persetujuan digital *click-to-accept* dengan pencatatan audit trail (IP address, timestamp WIB - `BR-017`).
- [x] **Halaman #20: Gateway Pembayaran Escrow (`app/booking/[id]/bayar/page.tsx`)**
  - Instruksi bayar QRIS dinamis & nomor Virtual Account bank resmi.
  - *Countdown Timer* kedaluwarsa bayar 15 menit (`FR-PAYMENT-005`).
  - Simulasi pembayaran sukses otomatis dan update posisi dana ke `DITAHAN_ESCROW`.
- [x] **Halaman #21: Riwayat Transaksi Saya (`app/booking/page.tsx`)**
  - Tab pemisah: Transaksi Aktif, Selesai, dan Dibatalkan (`FR-USER-005`).
  - Kartu ringkasan pesanan dengan status operasional dan status pembayaran escrow.
- [x] **Halaman #22: Detail Pesanan & Pelacak Alur Sewa (`app/booking/[id]/page.tsx`)**
  - *Booking State Stepper*: Pelacak visual 8 tahapan alur sewa secara real-time.
  - Rincian pergerakan dana (*Ledger immutable per booking* - `BR-031`).
  - Informasi kontak mitra rental dan tombol aksi kontekstual (Bayar Pelunasan, Checklist Serah Terima, Batalkan).

### FASE 5: PELUNASAN, SERAH TERIMA, PENGEMBALIAN & KLAIM DEPOSIT
> **Halaman yang dibangun:** Halaman #23 s.d. #26 pada `RENCANA-HALAMAN.md`
- [x] **Halaman #23: Pembayaran Pelunasan On-Platform (`app/booking/[id]/pelunasan/page.tsx`)**
  - Penerbitan link/QRIS pelunasan sisa sewa on-platform saat hari H serah terima (`FR-PAYMENT-003`).
  - Sistem penguncian otomatis: Checklist serah terima terkunci rapat sebelum status pelunasan LUNAS (`FR-HANDOVER-001`).
- [x] **Halaman #24: Digital Checklist Serah Terima Unit (`app/booking/[id]/serah-terima/page.tsx`)**
  - Checklist inspeksi kondisi fisik: Catatan baret/penyok bodi, posisi bar bensin, dan angka odometer km (`FR-HANDOVER-003`).
  - Pengambilan/upload foto wajib 4 sisi kendaraan (depan, belakang, sisi kanan, sisi kiri).
  - Tanda tangan digital konfirmasi serah terima bersama mitra rental (`FR-HANDOVER-004`).
- [x] **Halaman #25: Digital Checklist Pengembalian Unit (`app/booking/[id]/pengembalian/page.tsx`)**
  - Checklist inspeksi pengembalian unit saat sewa berakhir (`FR-RETURN-002`).
  - Penampil komparasi foto *Side-by-Side* (Foto saat Serah Terima vs Foto saat Pengembalian).
  - Perhitungan otomatis denda keterlambatan jika melewati masa tenggang (*grace period* - `FR-RETURN-004`).
  - Konfirmasi pengembalian unit selesai dan aktivasi jendela waktu klaim 24 jam (*Claim Window* - `FR-DEPOSIT-002`).
- [x] **Halaman #26: Pengajuan Perpanjangan Masa Sewa (`app/booking/[id]/perpanjang/page.tsx`)**
  - Pemilihan tanggal selesai baru saat mobil masih dalam sewa (`FR-BOOKING-007`).
  - Pemeriksaan otomatis jadwal unit di kalender mitra rental dan penerbitan tagihan tambahan.

### FASE 6: ULASAN DUA ARAH, SENGKETA & PUSAT NOTIFIKASI
> **Halaman yang dibangun:** Halaman #27 s.d. #32 pada `RENCANA-HALAMAN.md`
- [x] **Halaman #27: Formulir Ulasan Dua Arah (`app/booking/[id]/ulasan/page.tsx`)**
  - Input rating bintang 1–5 dan ulasan kondisi mobil serta pelayanan rental.
  - *Eligibility Gate* (`FR-REVIEW-002`): Hanya transaksi dengan status `SELESAI` yang diizinkan mengulas.
- [x] **Halaman #28: Formulir Pembukaan Sengketa (`app/booking/[id]/sengketa/baru/page.tsx`)**
  - Pembukaan komplain resmi: Kategori masalah (unit mogok, klaim deposit sepihak, mobil tidak sesuai).
  - Upload bukti pendukung (foto, bukti chat, rekaman).
- [x] **Halaman #29: Halaman Detail & Timeline Mediasi Sengketa (`app/sengketa/[id]/page.tsx`)**
  - Timeline mediasi independen bersama Tim Mediasi DriveO.
  - Tampilan bukti perbandingan foto dan notifikasi putusan alokasi dana deposit.
- [x] **Halaman #30: Riwayat Ulasan Akun (`app/akun/ulasan/page.tsx`)**
  - Ulasan yang pernah diberikan penyewa dan reputasi yang diterima dari pihak rental.
- [x] **Halaman #31: Pusat Pesan Notifikasi In-App (`app/notifikasi/page.tsx`)**
  - Daftar pesan notifikasi: Notifikasi Transaksi Uang, Keamanan, dan Sistem (`FR-NOTIFICATION-003`).
- [x] **Halaman #32: Pengaturan Preferensi Notifikasi (`app/akun/notifikasi/page.tsx`)**
  - Pengaturan kanal notifikasi: WhatsApp (prioritas), Web Push, dan Email.

---

## BAGIAN II: SISI AKTOR PEMILIK RENTAL (MITRA / MERCHANT)

### FASE 7: ONBOARDING MITRA RENTAL, LEGALITAS NIB & KONTRAK
> **Halaman yang dibangun:** Halaman #33 s.d. #35 pada `RENCANA-HALAMAN.md`
- [x] **Halaman #33: Pendaftaran Profil Usaha Rental (`app/mitra/daftar/page.tsx`)**
  - Profil bisnis rental: Nama legal badan usaha/perorangan, alamat garasi di DIY, jam operasional, kontak darurat.
- [x] **Halaman #34: Wizard Verifikasi Legalitas Dokumen Usaha (`app/mitra/verifikasi/page.tsx`)**
  - Upload dokumen NIB (Nomor Induk Berusaha via OSS) / Izin Usaha (`FR-RENTAL-002` & `BR-036`).
  - Upload foto KTP Penanggung Jawab dan bukti foto garasi fisik di Yogyakarta.
  - Pelacak progres peninjauan oleh Tim Verifikasi DriveO.
- [x] **Halaman #35: Persetujuan Perjanjian Kemitraan Merchant (`app/mitra/perjanjian/page.tsx`)**
  - Kontrak kemitraan resmi: Ketentuan komisi platform, jaminan escrow, aturan SOP serah terima, dan sanksi pembatalan sepihak.

### FASE 8: MANAJEMEN ARMADA PLAT AB, DOKUMEN STNK & LISTING MOBIL
> **Halaman yang dibangun:** Halaman #36 s.d. #41 pada `RENCANA-HALAMAN.md`
- [x] **Halaman #36: Daftar Katalog Armada Rental (`app/mitra/kendaraan/page.tsx`)**
  - Manajemen seluruh armada berplat AB milik rental (`FR-VEHICLE-001..005`).
  - Status unit: Tersedia, Sedang Disewa, Servis Rutin, Non-Aktif.
- [x] **Halaman #37: Tambah Armada Mobil Baru (`app/mitra/kendaraan/baru/page.tsx`)**
  - Input merk, model, tahun, transmisi (Matic/Manual), kapasitas, nomor rangka, nomor mesin, dan Plat AB.
  - Upload galeri foto asli kendaraan (minimal 3 foto interior & eksterior).
  - Upload berkas STNK asli dan tanggal jatuh tempo pajak tahunan.
- [x] **Halaman #38: Detail & Edit Armada Mobil (`app/mitra/kendaraan/[id]/page.tsx`)**
  - Edit spesifikasi, riwayat servis, update dokumen pajak, dan tombol nonaktifkan unit.
- [x] **Halaman #39: Manajemen Listing Marketplace (`app/mitra/listing/page.tsx`)**
  - Tab status: Listing Aktif, Draft, Non-Aktif, dan Arsip (`FR-LISTING-001..005`).
  - Peringatan listing berstatus basi (*stale listing warning*).
- [x] **Halaman #40: Pembuatan Listing Baru (`app/mitra/listing/baru/page.tsx`)**
  - Hubungkan ke armada terverifikasi.
  - Pengaturan tarif harian sewa, besaran deposit jaminan, dan tarif antar-jemput ke titik populer DIY (`FR-LISTING-002`).
  - Pratinjau tampilan harga All-In yang akan dilihat oleh penyewa.
- [x] **Halaman #41: Edit Listing & Konfirmasi Kebaruan Data (`app/mitra/listing/[id]/page.tsx`)**
  - Penyesuaian tarif musiman (liburan/weekend).
  - Tombol **"Konfirmasi Data Masih Akurat"** untuk mereset timer *Freshness Telemetry* agar listing kembali ke peringkat teratas.

### FASE 9: KALENDER KETERSEDIAAN MULTI-KANAL & OPERASIONAL BOOKING
> **Halaman yang dibangun:** Halaman #42 s.d. #47 pada `RENCANA-HALAMAN.md`
- [x] **Halaman #42: Kalender Ketersediaan Multi-Kanal (`app/mitra/kalender/page.tsx`)**
  - Visual matrix kalender seluruh unit mobil (`BR-028`).
  - Fitur **Blokir Manual Tanggal Pesanan WhatsApp / Offline** (`BR-029`) agar jadwal tidak bentrok dengan pesanan online DriveO.
- [x] **Halaman #43: Dashboard Operasional Utama Rental (`app/mitra/dashboard/page.tsx`)**
  - Ringkasan komando harian: Booking baru masuk butuh konfirmasi, unit keluar hari ini, unit kembali hari ini, dan saldo sewa berjalan di escrow.
  - Peringatan batas waktu respons konfirmasi (SLA timer).
- [x] **Halaman #44: Penerimaan Undangan Staf Rental (`app/mitra/staf/terima-undangan/page.tsx`)**
  - Halaman aktivasi akun karyawan yang diundang oleh pemilik rental (`FR-RENTAL-004`).
- [x] **Halaman #45: Manajemen Pesanan Booking Masuk (`app/mitra/booking/page.tsx`)**
  - Tabel pesanan baru dengan *countdown SLA timer* (maksimal 2 jam sebelum otomatis batal - `FR-BOOKING-008`).
  - Filter pesanan berdasarkan status operasional (Menunggu Konfirmasi, Terkonfirmasi, Siap Diambil, Dalam Sewa, Selesai).
- [x] **Halaman #46: Detail Konfirmasi Booking Masuk (`app/mitra/booking/[id]/page.tsx`)**
  - Profil calon penyewa: Status e-KYC terverifikasi, riwayat sewa masa lalu, dan foto selfie pencocokan identitas (`FR-VERIFICATION-005`).
  - Tombol **Setujui Pesanan** ATAU **Tolak Pesanan** (dengan alasan standar).
- [x] **Halaman #47: Manajemen Staf Karyawan Multi-User (`app/mitra/staf/page.tsx`)**
  - Undang staf baru dan tentukan peran: `STAFF_OPERASIONAL` (cek booking & serah terima) atau `STAFF_KEUANGAN` (lihat laporan tanpa ubah rekening).

### FASE 10: SERAH TERIMA MITRA, KLAIM DEPOSIT & KEUANGAN "DANA SAYA"
> **Halaman yang dibangun:** Halaman #48 s.d. #57 pada `RENCANA-HALAMAN.md`
- [ ] **Halaman #48: Form Inspeksi Serah Terima Sisi Rental (`app/mitra/booking/[id]/handover/page.tsx`)**
  - Validasi fisik bersama penyewa di stasiun/bandara/garasi, cek pelunasan lunas, dan persetujuan handover digital.
- [ ] **Halaman #49: Form Inspeksi Pengembalian Sisi Rental (`app/mitra/booking/[id]/return/page.tsx`)**
  - Pengecekan unit saat kembali: Cek bodi, indikator bensin, dan pembacaan odometer.
- [ ] **Halaman #50: Pengajuan Klaim Kerusakan Deposit (`app/mitra/klaim/ajukan/page.tsx`)**
  - Formulir klaim ganti rugi dalam batas waktu *claim window 24 jam* (`FR-DEPOSIT-003`).
  - Upload bukti komparasi foto kerusakan baru dan estimasi rincian biaya bengkel.
- [ ] **Halaman #51 & #52: Daftar & Detail Status Klaim Kerusakan (`app/mitra/klaim/page.tsx` & `[id]`)**
  - Pelacak status klaim: Menunggu Tinjauan Mediasi, Disetujui, Ditolak, atau Selesai Kompromi.
- [ ] **Halaman #53: Dashboard Keuangan "Dana Saya" (`app/mitra/dana/page.tsx`)**
  - Transparansi posisi dana sewa per booking (`FR-PAYOUT-003`): *Ditahan di Escrow $\rightarrow$ Dijadwalkan Cair H+1 $\rightarrow$ Berhasil Ditransfer ke Bank*.
  - Riwayat mutasi dana *immutable* lengkap dengan nomor referensi transfer bank.
- [ ] **Halaman #54: Pengaturan Rekening Bank Payout (`app/mitra/dana/rekening/page.tsx`)**
  - Pendaftaran rekening bank usaha (BCA, Mandiri, BRI, BNI).
  - Prosedur verifikasi rekening anti-fraud via uji transfer nominal mikro acak (`BR-037`).
- [ ] **Halaman #55: Rekapitulasi Pembukuan & Laporan Unduhan (`app/mitra/dana/laporan/page.tsx`)**
  - Ringkasan pendapatan bersih, potongan komisi platform, dan tombol unduh laporan bulanan (CSV/PDF - `FR-PAYOUT-005`).
- [ ] **Halaman #56: Database Pelanggan Rental (`app/mitra/pelanggan/page.tsx`)**
  - Daftar penyewa yang pernah menyewa di rental tersebut untuk mempermudah layanan pelanggan setia.
- [ ] **Halaman #57: Manajemen Reputasi & Balas Ulasan (`app/mitra/ulasan/page.tsx`)**
  - Daftar rating & review yang diterima armada rental.
  - Fitur **Tanggapan Resmi Mitra** (*Merchant Response* - `FR-REVIEW-001`) untuk menanggapi ulasan penyewa secara profesional.

---

## BAGIAN III: SISI AKTOR ADMIN (INTERNAL BACKOFFICE)

### FASE 11: PUSAT KOMANDO ADMIN, VERIFIKASI e-KYC & LEGALITAS MITRA
> **Halaman yang dibangun:** Halaman #61 s.d. #66 pada `RENCANA-HALAMAN.md`
- [ ] **Halaman #61: Dashboard Eksekutif & Statistik Platform (`app/admin/dashboard/page.tsx`)**
  - Metrik utama: Total transaksi aktif di DIY, total dana mengendap di rekening penampung escrow, *dispute rate*, rasio armada aktif.
  - Grafik tren pemesanan di stasiun vs bandara YIA.
- [ ] **Halaman #62: Antrean Verifikasi e-KYC Penyewa (`app/admin/verifikasi/penyewa/page.tsx`)**
  - Daftar permohonan e-KYC KTP & SIM yang membutuhkan review manual verifikator (`FR-VERIFICATION-003`).
- [ ] **Halaman #63: Antrean Verifikasi Legalitas Mitra Rental (`app/admin/verifikasi/mitra/page.tsx`)**
  - Daftar permohonan mitra rental baru: Tinjauan legalitas berkas NIB dan kesesuaian penanggung jawab.
- [ ] **Halaman #64: Meja Kerja Verifikator Dokumen (`app/admin/verifikasi/[id]/page.tsx`)**
  - Penampil dokumen KTP/SIM/NIB resolusi tinggi melalui tautan aman terenkripsi (*signed URL* - `SEC-004`).
  - Tombol keputusan: **Setujui e-KYC**, **Tolak (dengan alasan terstruktur)**, atau **Minta Foto Ulang**.
- [ ] **Halaman #65: Master Data & Manajemen Pengguna (`app/admin/pengguna/page.tsx`)**
  - Pencarian seluruh akun penyewa di platform (`FR-ADMIN-001`).
  - Tombol kontrol keamanan: Tangguhkan akun (*suspend*) atau blokir penyewa bermasalah.
- [ ] **Halaman #66: Master Data & Moderasi Mitra Rental (`app/admin/mitra/page.tsx`)**
  - Daftar seluruh usaha rental di DIY, skor kepatuhan armada, rasio sengketa, dan kontrol status kemitraan (`FR-ADMIN-002`).

### FASE 12: PUSAT MEDIASI SENGKETA, KEUANGAN ESCROW, CS & AUDIT LOG
> **Halaman yang dibangun:** Halaman #67 s.d. #80 pada `RENCANA-HALAMAN.md`
- [ ] **Halaman #67: Detail Lengkap & Audit Kemitraan Rental (`app/admin/mitra/[id]/page.tsx`)**
  - Inspeksi armada terdaftar, akun staf terikat, dan riwayat sengketa rental.
- [ ] **Halaman #68: Moderasi Katalog Listing (`app/admin/listing/page.tsx`)**
  - Pengawasan kelayakan foto dan kewajaran tarif sewa armada di marketplace DIY (`FR-ADMIN-003`).
- [ ] **Halaman #69 & #70: Monitoring Transaksi & Detail Lifecycle (`app/admin/transaksi/page.tsx` & `[id]`)**
  - Monitoring seluruh transaksi aktif di Yogyakarta secara real-time (`FR-ADMIN-004`).
  - Inspeksi detail riwayat state machine operasional dan state machine keuangan.
- [ ] **Halaman #71: Daftar Kasus Sengketa Aktif (`app/admin/sengketa/page.tsx`)**
  - Antrean sengketa klaim deposit yang masuk ke meja Tim Mediasi DriveO.
- [ ] **Halaman #72: Workspace Investigasi Sengketa & Putusan Mediasi (`app/admin/sengketa/[id]/page.tsx`)**
  - Meja kerja mediator: Penampil komparasi foto *Side-by-Side* kondisi bodi mobil saat serah terima vs saat pengembalian (`FR-DISPUTE-002`).
  - Evaluasi log checklist BBM & odometer.
  - Panel eksekusi putusan mediasi mengikat (`FR-DISPUTE-004`): *Cairkan Deposit Penuh ke Penyewa*, *Teruskan ke Rental*, atau *Split Sebagian Biaya Bengkel*.
- [ ] **Halaman #73: Pusat Kontrol Rekening Penampung Escrow (`app/admin/keuangan/escrow/page.tsx`)**
  - Monitoring saldo keseluruhan dana sewa & deposit yang ditahan di payment gateway berizin.
- [ ] **Halaman #74: Oversight Payout & Retry Transfer Bank (`app/admin/keuangan/payout/page.tsx`)**
  - Antrean jadwal payout H+1 ke rekening bank mitra rental (`FR-PAYOUT-001/002`).
  - Tombol *Retry Manual* jika terjadi kegagalan jaringan API perbankan (`FR-PAYOUT-004`).
- [ ] **Halaman #75: Manajemen & Persetujuan Refund Manual (`app/admin/keuangan/refund/page.tsx`)**
  - Penanganan kasus pengembalian dana manual untuk pembatalan darurat atau putusan mediasi (`FR-ADMIN-005`).
- [ ] **Halaman #76 & #77: Helpdesk Layanan Pengaduan CS (`app/admin/support/tiket/page.tsx` & `[id]`)**
  - Sistem ticketing keluhan pengguna (kepatuhan wajib PP No. 80 Tahun 2019).
  - Penanganan masalah gagal bayar, unit mogok di perjalanan, dan eskalasi kasus.
- [ ] **Halaman #78: Penelusuran Log Audit Sistem (`app/admin/audit/log/page.tsx`)**
  - Tabel catatan audit peristiwa yang tidak dapat dimanipulasi (*immutable audit trail* - `FR-AUDIT-001..003`).
  - Pencatatan seluruh mutasi uang, login staf, dan pengubahan data sensitif lengkap dengan timestamp WIB dan alamat IP.
- [ ] **Halaman #79: Pengaturan Parameter Sistem Platform (`app/admin/pengaturan/page.tsx`)**
  - Konfigurasi persentase komisi platform, batas durasi timer bayar (15m), SLA respons rental (2 jam), dan batas waktu claim window deposit (24 jam).
- [ ] **Halaman #80: Pusat Rekapitulasi & Laporan Eksekutif (`app/admin/laporan/page.tsx`)**
  - Rekapitulasi bulanan performa platform dan tombol ekspor data.

---

### FASE 13: INTEGRASI LINTAS-AKTOR END-TO-END (E2E) & CONCIERGE MVP
> **Target:** Validasi kelancaran siklus transaksi lengkap antara ketiga aktor tanpa friksi.
- [ ] **Simulasi Siklus Lengkap (*Full Journey*)**:
  1. *Penyewa* mencari mobil di Bandara YIA $\rightarrow$ Kunci slot $\rightarrow$ Tanda tangan kontrak digital $\rightarrow$ Bayar DP ke escrow.
  2. *Mitra Rental* menerima notifikasi $\rightarrow$ Meninjau e-KYC $\rightarrow$ Menyetujui booking dalam SLA 2 jam.
  3. *Kedua Pihak* bertemu di lokasi $\rightarrow$ Penyewa melunasi via QRIS $\rightarrow$ Kunci terbuka $\rightarrow$ Isi checklist bodi & foto 4 sisi.
  4. *Penyewa* menggunakan mobil $\rightarrow$ Mengembalikan unit $\rightarrow$ Mitra cek kondisi fisik $\rightarrow$ Pengembalian tuntas.
  5. *Sistem* menahan deposit selama claim window 24 jam $\rightarrow$ Tidak ada klaim $\rightarrow$ Deposit otomatis dicairkan kembali 100% ke penyewa $\rightarrow$ Dana sewa dicairkan ke rekening mitra pada H+1.
  6. *Kedua Pihak* saling memberikan ulasan reputasi bintang 1–5.
- [ ] **Simulasi Alur Sengketa (*Dispute Journey*)**:
  - Simulasi rental klaim baret bodi $\rightarrow$ Penyewa membantah $\rightarrow$ Mediator membuka perbandingan foto $\rightarrow$ Putusan mediasi split dana.
- [ ] **Mode Concierge MVP (20 Booking Pertama)**:
  - Verifikasi kemampuan tim inti bertindak atas nama pengguna (*acting on behalf*) dengan pencatatan audit log bertanda khusus.
- [ ] **Pengujian Aksesibilitas & Kompatibilitas Mobile**:
  - Uji seluruh 80 halaman pada viewport smartphone (375px), tablet (768px), dan laptop/desktop (1440px).
- [ ] **Final Build Verification**: `npm run build` sukses dengan 0 error dan 0 warning.
