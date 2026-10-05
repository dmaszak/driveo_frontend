# RANGKUMAN TIGA AKTOR UTAMA SISTEM DRIVEO
### Berdasarkan Dokumen Acuan: `SRS_DOKUMEN.md` (v1.0) & `RENCANA-HALAMAN.md`

---

## 1. Pendahuluan & Gambaran Umum Sistem
**DriveO** adalah platform infrastruktur digital tiga lapis (*Marketplace, Sistem Operasional Rental, dan Trust Layer*) untuk ekosistem persewaan kendaraan lokal di **Daerah Istimewa Yogyakarta (DIY)**. 

Platform ini menyelesaikan friksi fragmentasi operasional dan krisis kepercayaan antara pihak penyewa dan pemilik rental melalui empat pilar utama:
1. **Seluruh Pembayaran On-Platform dengan Rekening Penampung Aman (*Escrow Guarantee*)**: Uang sewa dan deposit jaminan ditahan di rekening penampung resmi pihak ketiga berizin sampai serah terima sah dan sewa selesai.
2. **Kunci Serah Terima (*Handover*) Terbuka Hanya Saat Lunas**: Mencegah penipuan dan penahanan unit secara sepihak.
3. **Transparansi Tarif Penuh (*Price All-In*)**: Menghilangkan biaya siluman dengan menampilkan tarif sewa + deposit jaminan + biaya antar-jemput secara gamblang.
4. **Verifikasi Dua Arah & Bukti Digital**: e-KYC KTP/SIM penyewa, verifikasi NIB/STNK mitra, checklist inspeksi bodi/odometer/BBM digital, serta komparasi foto sebelum dan sesudah sewa.

---

## 2. Pemetaan Tiga Aktor Utama

Sesuai konsolidasi fungsi internal sistem, aktor DriveO terbagi menjadi **3 Aktor Utama**:
1. **Penyewa (*Renter*)** — Konsumen / Pengguna Jasa
2. **Rental (*Mitra / Merchant*)** — Pemilik Usaha Persewaan Kendaraan
3. **Admin (*Backoffice Platform*)** — Pengelola Pusat yang mengonsolidasikan fungsi **Super Admin, Tim Verifikasi, Customer Support (CS), dan Tim Mediasi**.

```text
                                  ┌──────────────────────────────────────────────┐
                                  │             PORTAL BACKOFFICE                │
                                  │                   ADMIN                      │
                                  │   (Super Admin • Verifikasi • CS • Mediasi)  │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                        Audit & Mediasi  │  Pengawasan Escrow & Legalitas
                                                         │
                        ┌────────────────────────────────┴───────────────────────────────┐
                        ▼                                                                ▼
         ┌──────────────────────────────┐       Rekening Penampung        ┌──────────────────────────────┐
         │           PENYEWA            │            (ESCROW)             │            RENTAL            │
         │   Booking • e-KYC • Bayar    ├────────────────────────────────►│   Armada • Kalender • Payout │
         │   Inspeksi Serah Terima      │◄────────────────────────────────┤   Inspeksi Serah Terima      │
         └──────────────────────────────┘        Checklist Bersama        └──────────────────────────────┘
```

---

## 3. Rincian Aktor 1: Penyewa (*Renter*)

### A. Kewenangan & Kapabilitas (Apa Saja yang Bisa Dilakukan)
* **Penelusuran & Pencarian Bebas**: Menjelajahi katalog agregat mobil/motor berplat AB di Yogyakarta tanpa wajib login terlebih dahulu (*discovery stage*).
* **Komparasi Spesifikasi**: Membandingkan fitur, kapasitas, transmisi, dan harga all-in dari hingga 3 mobil berbeda secara berdampingan.
* **Verifikasi e-KYC**: Mengunggah foto KTP dan SIM resmi (SIM A untuk mobil, SIM C untuk motor) untuk mendapatkan status penyewa terverifikasi.
* **Reservasi dengan Penguncian Jadwal**: Memilih tanggal sewa dan titik lokasi penjemputan (Bandara YIA Kulon Progo, Stasiun Tugu, Lempuyangan, Malioboro, atau Garasi Mitra), lalu mengunci unit kendaraan agar tidak disewa pengguna lain.
* **Persetujuan Kontrak Sewa Digital**: Membaca klausul hak, kewajiban, dan sanksi denda, lalu menyetujui Perjanjian Sewa Elektronik secara *click-to-accept* sebelum transaksi keuangan.
* **Pembayaran Bergaransi Escrow**: Melakukan pembayaran Down Payment (DP) atau Bayar Penuh ke rekening penampung aman dengan batas waktu pembayaran (*countdown timer* 15 menit).
* **Pelunasan On-Platform**: Melunasi sisa tagihan saat sesi serah terima unit secara digital (via QRIS / Virtual Account), sehingga uang tetap terlindungi dalam sistem escrow.
* **Inspeksi Digital Bersama**: Bersama pihak rental memeriksa checklist fisik bodi kendaraan (baret/penyok), indikator volume bahan bakar, angka odometer, dan mengunggah foto 4 sisi kendaraan saat serah terima (*handover*) dan saat pengembalian (*return*).
* **Pengajuan Bantuan & Eskalasi Sengketa**: Menghubungi customer support jika mobil mogok di jalan, atau mengajukan komplain resmi ke Tim Mediasi jika deposit ditahan sepihak oleh rental.
* **Pemberian Rating Dua Arah**: Memberikan penilaian bintang (1–5) dan testimoni objektif kepada pihak rental setelah masa sewa tuntas.
* **Pengelolaan Hak Privasi Data**: Melihat, memperbarui, atau menarik persetujuan pemrosesan data pribadi sesuai amanat UU PDP No. 27/2022.

### B. Fitur-Fitur Wajib untuk Penyewa
Dipetakan ke halaman frontend (*RENCANA-HALAMAN.md Halaman #1 s.d. #38*):
1. **Marketplace & Mesin Pencari Agregat** (`/`, `/cari`, `/listing/[id]`):
   * Filter titik serah-terima populer DIY (YIA, Tugu, Lempuyangan, dll).
   * Filter transmisi (Matic/Manual), kategori kendaraan, kapasitas penumpang, dan jenis bahan bakar.
   * *Freshness Telemetry Tag*: Indikator visual real-time ("Diperbarui 15m lalu" / "Perlu Konfirmasi Ulang").
2. **Kalkulator Transparansi Tarif (*Price All-In*)**:
   * Rincian terbuka tanpa biaya siluman: Tarif Sewa Harian + Deposit Jaminan (dicairkan kembali 100%) + Biaya Pengantaran.
3. **Komparasi Unit Berdampingan** (`/bandingkan`):
   * Tampilan tabel komparasi teknis hingga 3 armada sekaligus.
4. **Alur Checkout & Perjanjian Sewa Elektronik** (`/pesan/[listingId]`):
   * Form pemesanan terintegrasi dengan penampil klausul perjanjian sewa elektronik ber-audit trail.
5. **Gateway Pembayaran Escrow** (`/booking/[id]/bayar`):
   * Penampil Virtual Account / QRIS dinamis dengan countdown timer 15 menit dan verifikasi otomatis.
6. **Pelacak Alur Sewa (*State Stepper Real-time*)** (`/booking/[id]`):
   * Visualisasi 8 tahapan pesanan: *Menunggu DP $\rightarrow$ Menunggu Konfirmasi Rental $\rightarrow$ Terkonfirmasi $\rightarrow$ Menunggu Pelunasan $\rightarrow$ Dalam Sewa $\rightarrow$ Selesai*.
7. **Modul Inspeksi Digital Serah Terima & Pengembalian** (`/booking/[id]/serah-terima` & `/booking/[id]/pengembalian`):
   * Checklist bodi interaktif, form input angka odometer & bar bensin, serta modul kamera upload foto 4 sisi kendaraan.
8. **Modul e-KYC & Pengaturan Akun Privasi** (`/akun/verifikasi`, `/akun/privasi`):
   * Pengunggahan KTP/SIM dengan panduan framing OCR serta manajemen *consent* data pribadi.
9. **Pusat Tiket Sengketa & Bantuan** (`/sengketa/[id]`, `/bantuan`):
   * Form pembukaan tiket komplain dan pelacak status mediasi klaim deposit.

---

## 4. Rincian Aktor 2: Rental (*Mitra / Merchant*)

### A. Kewenangan & Kapabilitas (Apa Saja yang Bisa Dilakukan)
* **Pendaftaran Usaha & Legalitas Mitra**: Mengajukan kemitraan rental dengan melampirkan berkas Nomor Induk Berusaha (NIB via OSS), identitas penanggung jawab (KTP PJ), dan bukti contoh kepemilikan STNK armada.
* **Manajemen Katalog Armada**: Menambah, mengedit, atau menonaktifkan unit kendaraan berplat AB, nomor rangka/mesin, foto galeri asli, kapasitas, dan spesifikasi teknis.
* **Penetapan Kebijakan Tarif & Deposit**: Mengatur tarif sewa dasar harian, besaran uang deposit jaminan yang wajar, serta biaya jasa antar-jemput ke lokasi tertentu di DIY.
* **Manajemen Kalender Ketersediaan Multi-Kanal**: Menandai tanggal ketersediaan armada, termasuk kemampuan memblokir tanggal secara manual (*manual block*) untuk pesanan offline/WhatsApp agar tidak terjadi *double-booking*.
* **Konfirmasi Booking Masuk**: Meninjau rincian pemesan dan riwayat reputasi penyewa sebelum menyetujui atau menolak permohonan booking (memiliki batas SLA konfirmasi, misal maks 2 jam).
* **Inspeksi Serah Terima & Pengembalian Fisik**: Memeriksa kendaraan bersama penyewa dan menandatangani checklist digital serah terima di garasi/lokasi pertemuan. Form ini terkunci otomatis jika penyewa belum melunasi pembayaran via platform.
* **Pengajuan Klaim Kerusakan (*Claim Window 24 Jam*)**: Mengajukan klaim ganti rugi terhadap uang deposit jaminan dalam batas waktu maksimal 24 jam setelah kendaraan dikembalikan, wajib menyertakan foto perbandingan dan estimasi kuitansi perbaikan.
* **Pemantauan Arus Keuangan Transparan ("Dana Saya")**: Memantau posisi setiap rupiah transaksi sewa: *Ditahan di Rekening Escrow $\rightarrow$ Dijadwalkan Cair H+1 $\rightarrow$ Berhasil Ditransfer ke Rekening Bank Mitra*.
* **Pendaftaran Rekening Payout**: Mendaftarkan nomor rekening bank usaha (BCA, Mandiri, BRI, BNI) dengan verifikasi kepemilikan untuk tujuan pencairan dana sewa.
* **Delegasi Akses Karyawan (*Sub-Role Multi-User*)**: Mengundang karyawan rental dan memberikan batasan hak akses sesuai fungsi kerja (*Staff Operasional* vs *Staff Keuangan*).
* **Pemberian Ulasan Reputasi Penyewa**: Memberikan ulasan dan skor kepada penyewa untuk membangun rekam jejak penyewa yang bertanggung jawab di Yogyakarta.

### B. Fitur-Fitur Wajib untuk Rental
Dipetakan ke halaman frontend (*RENCANA-HALAMAN.md Halaman #39 s.d. #57*):
1. **Portal Onboarding Mitra** (`/mitra/onboarding`):
   * Wizard pendaftaran profil bisnis, upload NIB, surat kuasa PJ, dan persetujuan Perjanjian Kemitraan Merchant.
2. **Dashboard Operasional Utama** (`/mitra/dashboard`):
   * Widget ringkasan harian: Pesanan baru menunggu respons, unit yang wajib diantar hari ini, unit yang kembali hari ini, dan saldo sewa berjalan di escrow.
3. **Katalog Armada & Dokumen Unit** (`/mitra/kendaraan`, `/mitra/kendaraan/tambah`, `/mitra/kendaraan/[id]/edit`):
   * Form registrasi unit Plat AB, galeri foto, tanggal jatuh tempo pajak STNK, dan pengatur status (Tersedia / Sedang Disewa / Servis / Non-Aktif).
4. **Kalender Ketersediaan Cerdas** (`/mitra/kalender`):
   * Visual matrix kalender seluruh unit mobil, fitur blok tanggal cepat untuk pesanan offline WhatsApp, dan sinkronisasi otomatis dari booking online DriveO.
5. **Manajemen Order & Konfirmasi Booking** (`/mitra/booking`, `/mitra/booking/[id]`):
   * Tinjauan calon penyewa (status verifikasi e-KYC, rating masa lalu), batas waktu respons konfirmasi, dan tombol Setujui / Tolak.
6. **Alat Inspeksi Serah Terima & Pengembalian** (`/mitra/booking/[id]/handover`, `/mitra/booking/[id]/return`):
   * Checklist digital interaktif: bodi, ban cadangan, STNK asli, dongkrak, level BBM, dan komparasi foto 4 sisi.
7. **Modul Pengajuan Klaim Deposit** (`/mitra/klaim/ajukan`, `/mitra/klaim/[id]`):
   * Form pelaporan kerusakan dalam claim window 24 jam dengan lampiran foto sebelum vs sesudah dan estimasi biaya bengkel.
8. **Dashboard Keuangan "Dana Saya"** (`/mitra/dana`, `/mitra/dana/rekening`, `/mitra/dana/laporan`):
   * Ledger immutable per transaksi, status pencairan dana (H+1 setelah sewa selesai), manajemen rekening bank, dan unduhan file laporan rekapitulasi bulanan.
9. **Manajemen Staf Rental** (`/mitra/staf`):
   * Pengelolaan akun staf: `STAFF_OPERASIONAL` (akses unit & checklist tanpa akses keuangan) dan `STAFF_KEUANGAN` (akses rekap dana tanpa wewenang mengubah rekening bank tujuan).

---

## 5. Rincian Aktor 3: Admin (*Backoffice Platform*)
*(Mengonsolidasikan fungsi **Super Admin, Tim Verifikasi, Customer Support, dan Tim Mediasi** ke dalam satu portal terpadu)*

### A. Kewenangan & Kapabilitas (Apa Saja yang Bisa Dilakukan)

#### 1. Kapabilitas Super Admin (Tata Kelola & Konfigurasi)
* Mengelola konfigurasi parameter global platform: besaran komisi platform, batas waktu pembayaran (*expiry timeout*), batas waktu konfirmasi rental (SLA 2 jam), dan batas waktu claim window (24 jam).
* Mengontrol status seluruh akun pengguna di ekosistem (menangguhkan / memblokir penyewa nakal atau rental yang melanggar SOP).
* Memeriksa catatan log audit sistem yang tidak dapat dimanipulasi (*immutable audit trail*) untuk kebutuhan investigasi kepatuhan.
* Menangani kegagalan teknis perbankan: melakukan eksekusi ulang pencairan dana (*retry payout*) atau eksekusi pengembalian dana manual (*manual refund*) jika terjadi kendala pada payment gateway.

#### 2. Kapabilitas Tim Verifikasi (e-KYC & Legalitas Usaha)
* Memeriksa dan meneliti antrean pengajuan e-KYC penyewa yang membutuhkan peninjauan manual (kasus foto buram, NIK tidak cocok, atau keaslian SIM yang meragukan).
* Memeriksa keabsahan berkas legalitas usaha mitra rental baru: validasi NIB pada database OSS, kesesuaian KTP penanggung jawab, dan keabsahan contoh STNK unit.
* Memberikan keputusan: **Menyetujui (*Approve*)**, **Menolak (*Reject*)**, atau **Meminta Perbaikan Dokumen**.

#### 3. Kapabilitas Customer Support (Layanan Bantuan & Kepatuhan PP 80/2019)
* Mengelola antrean tiket pertanyaan, kendala teknis, dan aduan darurat dari penyewa maupun rental (misal kendala gagal bayar, unit mogok di perjalanan, atau akun terkunci).
* Mengirimkan notifikasi darurat atau pesan operasional langsung ke pengguna terkait.
* Melakukan eskalasi kasus ke Tim Mediasi jika aduan menyangkut perselisihan ganti rugi atau penahanan dana.

#### 4. Kapabilitas Tim Mediasi (Resolusi Sengketa & Klaim Deposit)
* Menginvestigasi kasus sengketa klaim deposit antara penyewa dan pemilik rental secara netral dan objektif.
* Mengakses rekam jejak digital lengkap: membandingkan foto bodi saat serah terima vs foto saat pengembalian (*Side-by-Side Photo Comparison*), serta data log BBM dan odometer.
* Mengeluarkan putusan mediasi yang mengikat sistem:
  * *Mencairkan deposit 100% kembali ke penyewa* (klaim rental ditolak).
  * *Meneruskan deposit 100% ke rental* (terbukti penyewa merusak kendaraan).
  * *Split pemotongan deposit proporsional* (biaya bengkel riil dipotongkan dari deposit, sisanya dikembalikan ke penyewa).
* Mengeskalasi kasus ke pihak kepolisian/hukum jika ditemukan indikasi tindak pidana penipuan atau penggelapan unit kendaraan.

### B. Fitur-Fitur Wajib untuk Admin Backoffice
Dipetakan ke halaman frontend (*RENCANA-HALAMAN.md Halaman #61 s.d. #80*):
1. **Pusat Komando & Metrik Platform** (`/admin/dashboard`):
   * Ringkasan live statistik: Total transaksi aktif di DIY, total dana aman di rekening escrow, tingkat sengketa (*dispute rate*), dan rasio pemenuhan armada.
2. **Antrean Verifikasi e-KYC & Mitra Rental** (`/admin/verifikasi/penyewa`, `/admin/verifikasi/mitra`, `/admin/verifikasi/[id]`):
   * Penampil dokumen KTP/SIM/NIB dengan URL aman berumur pendek (*signed URL*).
   * Tombol aksi verifikator: Setujui, Tolak (pilihan alasan standar), Minta Dokumen Tambahan.
3. **Pusat Manajemen Pengguna & Mitra** (`/admin/pengguna`, `/admin/mitra`, `/admin/mitra/[id]`):
   * Tabel master data seluruh penyewa dan rental mitra, skor reputasi, riwayat transaksi, serta fitur suspend/blokir akun.
4. **Pusat Resolusi Sengketa & Mediasi Klaim** (`/admin/sengketa`, `/admin/sengketa/[id]`):
   * Workspace investigasi sengketa: penampil foto komparasi *Before vs After* berdampingan, catatan checklist kedua pihak, dan log obrolan klarifikasi.
   * Panel penetapan putusan alokasi dana: *Refund Penuh*, *Bayar Penuh ke Rental*, atau *Split Sebagian*.
5. **Pusat Kontrol Escrow, Payout & Refund** (`/admin/keuangan/escrow`, `/admin/keuangan/payout`, `/admin/keuangan/refund`):
   * Monitor saldo rekening penampung escrow secara real-time.
   * Tabel antrean eksekusi payout harian ke bank mitra dengan tombol *Retry Manual* jika gateway perbankan timeout.
   * Modul eksekusi refund teraudit.
6. **Pusat Layanan Bantuan / Helpdesk CS** (`/admin/support/tiket`, `/admin/support/[id]`):
   * Manajemen antrean tiket komplain, penetapan prioritas kasus, status penanganan (Open, Investigasi, Resolved), dan template respon cepat.
7. **Pusat Audit Log & Keamanan Sistem** (`/admin/audit/log`, `/admin/pengaturan`):
   * Tabel penelusuran audit trail immutable: setiap perpindahan dana, login staf, dan pengubahan data pribadi terekam dengan timestamp WIB dan alamat IP.
   * Pengaturan parameter biaya dan SLA sistem.

---

## 6. Matriks Otorisasi Berbasis Peran (RBAC Matrix)
Berdasarkan Bab 12 `SRS_DOKUMEN.md`, hak akses antar-aktor ditegakkan secara ketat pada setiap fitur:

| Kapabilitas / Fitur | Penyewa (*Renter*) | Rental (*Merchant*) | Admin (*Internal Backoffice*) |
|---|---|---|---|
| **Melihat Listing Publik** | Baca (*View*) | Baca (*View*) | Baca (*View*) |
| **Membuat Pesanan (Booking)** | Buat/Ubah (*CRUD*) milik sendiri | Tidak Ada Akses | Buat atas nama penyewa *(Fase Concierge)* |
| **Kelola Armada & Dokumen Unit** | Tidak Ada Akses | Buat/Ubah (*CRUD*) miliknya | Baca (*View*) & Moderasi |
| **Konfirmasi / Tolak Booking** | Tidak Ada Akses | Setujui / Tolak (*Approve/Reject*) | Tidak Ada Akses |
| **Upload Dokumen e-KYC / Legalitas** | Unggah Dokumen Pribadi | Unggah Dokumen Usaha & Unit | Tidak Ada Akses |
| **Review & Verifikasi Dokumen** | Tidak Ada Akses | Tidak Ada Akses | Setujui / Tolak (*Approve/Reject*) |
| **Pengisian Checklist Serah Terima** | Isi & Setujui miliknya | Isi & Setujui miliknya | Baca (*View*) untuk investigasi |
| **Membuka Tiket Sengketa** | Buka untuk booking miliknya | Buka untuk booking miliknya | Tidak Ada Akses (sebagai penengah) |
| **Penetapan Putusan Mediasi** | Tidak Ada Akses | Tidak Ada Akses | **Putusan Sah (*Approve/Reject*)** |
| **Eksekusi Payout & Refund** | Tidak Ada Akses | Tidak Ada Akses | **Eksekusi Sistem & Manual Override** |
| **Melihat Riwayat Dana / Ledger** | Riwayat transaksi pribadi | Riwayat pencairan usahanya | **Seluruh Mutasi Transaksi Platform** |
| **Moderasi & Pemblokiran Akun** | Tidak Ada Akses | Tidak Ada Akses | **Kontrol Penuh (*Suspend/Block*)** |
| **Melihat Log Audit Sistem** | Tidak Ada Akses | Tidak Ada Akses | **Akses Penuh (*Audit Trail*)** |

---

## 7. Kesimpulan & Nilai Tambah Desain Sistem
Struktur tiga aktor ini menjamin bahwa sistem DriveO berjalan seimbang dan aman:
* **Penyewa merasa tenang** karena uang sewa dan deposit tidak langsung masuk ke kantong rental sebelum unit diserahkan dalam kondisi baik.
* **Rental merasa terlindungi** karena identitas penyewa telah divalidasi resmi lewat e-KYC, pembayaran lunas dijamin oleh escrow, dan ada jaminan klaim deposit 24 jam bila unit dirusak.
* **Admin bertindak sebagai wasit netral dan regulator** yang memiliki visibilitas menyeluruh untuk memverifikasi dokumen, mencairkan dana sesuai SLA, dan menyelesaikan sengketa berdasarkan bukti digital autentik.
