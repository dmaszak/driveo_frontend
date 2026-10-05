# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## DriveO — Infrastruktur Digital untuk Ekosistem Rental Kendaraan Lokal

| Field | Nilai |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 4 Oktober 2026 |
| **Status** | Draft — menunggu validasi (lihat Bagian 19) |
| **Sumber Kebenaran** | Proposal DriveO v3 (4 Oktober 2026) |
| **Audiens** | Backend Developer, Frontend Developer, UI/UX Designer, QA/Tester, System Architect |

> **Dokumen ini BUKAN dokumen marketing.** Setiap requirement dapat dilacak kembali ke Proposal DriveO v3 melalui Requirement Traceability Matrix (Bagian 18). Hal yang belum final di proposal ditandai eksplisit (*TBD / Validation Required / Legal Validation Required / Business Decision Required*) dan **TIDAK** dijadikan requirement final.

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Gambaran Umum Sistem](#2-gambaran-umum-sistem)
3. [Business Process](#3-business-process)
4. [Functional Requirements](#4-functional-requirements)
5. [Detail Modul](#5-detail-modul)
6. [Business Rules](#6-business-rules)
7. [State Machine](#7-state-machine)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Data Requirements](#9-data-requirements)
10. [External System Integration](#10-external-system-integration)
11. [API Requirements](#11-api-requirements)
12. [Authorization Matrix](#12-authorization-matrix)
13. [Error & Exception Handling](#13-error--exception-handling)
14. [Security Requirements](#14-security-requirements)
15. [Audit & Observability](#15-audit--observability)
16. [Testing Requirements](#16-testing-requirements)
17. [MVP vs Future Development](#17-mvp-vs-future-development)
18. [Requirement Traceability Matrix](#18-requirement-traceability-matrix)
19. [Open Questions & Validation Backlog](#19-open-questions--validation-backlog)
20. [SRS Quality Review](#20-srs-quality-review)

---

# 1. Pendahuluan
## 1.1 Tujuan Dokumen
Dokumen ini mendefinisikan kebutuhan perangkat lunak sistem DriveO secara lengkap, konsisten, dan dapat diuji, sebagai acuan tunggal bagi tim produk, engineering, desain, dan QA dalam membangun MVP. Dokumen ini: 

1. Menerjemahkan Proposal DriveO v3 menjadi requirement teknis yang presisi (siapa melakukan apa, dalam kondisi apa, dengan hasil apa, dan apa yang terjadi saat gagal). 

2. Memisahkan secara tegas antara requirement yang sudah ditetapkan, asumsi, dan hal yang masih membutuhkan validasi/keputusan bisnis/legal. 

3. Menetapkan state machine, business rules, matriks otorisasi, dan kebutuhan integrasi sebagai kontrak antar-subsistem. 

4. Menyediakan dasar traceability (proposal → requirement → API → test) dan backlog validasi agar keputusan yang belum final tidak mengendap diam-diam. 

Dokumen ini tidak menggantikan dokumen legal (T&C, Kebijakan Privasi, Perjanjian Merchant), desain UI/UX detail, atau SOP operasional lapangan — ketiganya dirujuk sebagai dokumen turunan. 

## 1.2 Tujuan Sistem
Menyediakan infrastruktur digital tiga lapis — Marketplace, Sistem Operasional Rental, dan Trust Layer — yang memungkinkan: 

1. **Penyewa** menemukan, membandingkan, memesan, dan membayar sewa kendaraan dari banyak rental lokal dalam satu alur terdokumentasi dengan perlindungan dana. 

2. **Rental** mendigitalisasi operasional harian (katalog, kalender, booking, riwayat pelanggan, keuangan) dan menjangkau pelanggan baru di luar jaringan personalnya. 

3. **Kedua pihak** bertransaksi dengan orang asing secara aman melalui verifikasi dua pihak, perjanjian sewa elektronik, dokumentasi serah terima, deposit, dan reputasi dua arah. 

4. **Platform** memfasilitasi seluruh pembayaran (DP + pelunasan) on-platform dengan mekanisme escrow via payment gateway berizin, transparan penuh ke rental, tanpa dana mengendap di rekening operasional. 

Keberhasilan sistem diukur dari metrik yang ditetapkan proposal (lihat 2.7): likuiditas mikro pilot, akurasi ketersediaan, booking terselesaikan, tingkat sengketa, dan margin per booking — seluruhnya masih dalam status validasi. 

## 1.3 Ruang Lingkup
#### Masuk dalam lingkup (MVP):
1. Sewa **lepas kunci** untuk **motor & mobil** di **Daerah Istimewa Yogyakarta** (pilot). 

2. Alur end-to-end: discovery → search → comparison → booking → DP (on-platform, escrow) → verifikasi identitas → konfirmasi rental → handover → pelunasan (on-platform) → masa sewa → pengembalian → settlement/payout → review dua arah. 

3. Penanganan deposit (claim window 24 jam), klaim, refund, dispute/mediasi. 

4. Dashboard operasional rental: katalog kendaraan, kalender ketersediaan, manajemen booking (termasuk pencatatan booking nonplatform), riwayat pelanggan, Riwayat Dana, layar Dana Saya, rekap/laporan. 

5. Trust layer: e-KYC penyewa (KTP + SIM), verifikasi mitra rental (identitas penanggung jawab, NIB/izin usaha, dokumen kendaraan), perjanjian sewa elektronik, checklist + foto serah terima/pengembalian, deposit, rating dua arah. 

6. Notifikasi instan (push + WhatsApp) untuk setiap event uang, dan notifikasi operasional lainnya. 

7. Seluruh pembayaran difasilitasi via platform dengan escrow; transparansi dana penuh ke rental. 

**Bentuk aplikasi:** responsive web application (bukan native mobile app) — keputusan sadar dari proposal untuk kecepatan validasi. 

## 1.4 Out of Scope
1. **Fase pilot:** layanan dengan sopir, sewa korporat, kota di luar DIY, asuransi sebagai produk, paid listing. 

2. **Future development** (didefinisikan di Bagian 17, dilarang masuk ke requirement MVP): paid listing, sewa dengan sopir, segmen korporat, kemitraan asuransi, ekspansi kota, TTE (tanda tangan elektronik) tersertifikasi. 

3. **Non-goals teknologi:** native mobile app, ML/AI, telematika kendaraan. 

4. **Di luar peran sistem:** DriveO adalah perantara + penyedia sistem; BUKAN pemilik kendaraan, BUKAN pihak dalam perjanjian sewa, dan TIDAK menanggung kerugian atas kerusakan/kehilangan — [LEGAL VALIDATION REQUIRED] atas rumusan finalnya. 

5. Pembentukan badan usaha, rekrutmen skala, dan penggalangan dana (disebut di proposal sebagai zona di luar scope dokumen). 

## 1.5 Definisi dan Terminologi
|**Istilah**|**Definisi**|
|---|---|
|Escrow|Mekanisme penampungan dana transaksi oleh payment gateway berizin. Dana bukan milik operasional DriveO dan tidak boleh diperlakukan sebagai saldo bebas.|
|DP (Down Payment)|Uang muka yang dibayar penyewa saat booking, on-platform. Besaran = TBD / Validation Required (hipotesis proposal 20–30% adalah asumsi, bukan ketetapan).|
|Pelunasan|Sisa pembayaran yang dilunasi penyewa saat serah terima, on-platform, via link/QRIS yang dibuat otomatis.|
|Bayar Penuh di Awal|Opsi opt-in membayar 100% di muka; mendapat perk prioritas konfirmasi; sekaligus menjadi data willingness.|
|Claim window|24 jam setelah pengembalian terkonfirmasi, selama deposit ditahan untuk klaim kerusakan yang baru ditemukan.|
|Handover|Serah terima unit: checklist + foto kondisi (body, odometer/BBM, kelengkapan) oleh kedua pihak. Terkunci sampai status LUNAS.|
|Payout|Penerusan dana sewa (dikurangi komisi) ke rental, H+1 setelah pengembalian terkonfirmasi.|
|Ledger / Riwayat Dana|Catatan immutable per booking atas setiap event keuangan (timestamp + nomor referensi); tidak bisa diedit siapa pun.|
|Dana Saya|Layar transparansi dana untuk rental: status per booking (ditahan→dalam perjalanan→ditransfer +referensi bank) + rekap bulanan unduhan.|
|e-KYC|Verifikasi identitas elektronik: upload KTP + SIM (wajib untuk lepas kunci), OCR + validitas format otomatis, review manual untuk kasus meragukan.|
|Perjanjian sewa elektronik|Dokumen syarat, tarif, denda, dan tanggung jawab yang disetujui secara digital (click-to-accept + audit trail) SEBELUM pembayaran.|
|Reputasi dua arah|Rating penyewa↔rental yang hanya dapat diberikan dari transaksi terselesaikan (anti fake review).|
|Disintermediasi|Pengalihan transaksi ke luar platform. Strategi: proteksi hanya on-platform; seluruh pembayaran via platform; reputasi hanya tumbuh dari transaksi tercatat.|
|Concierge MVP|20 booking pertama dilayani manual untuk memvalidasi alur sebelum otomasi (fase, bukan fitur permanen).|
|Likuiditas mikro|Definisi ambang pilot: tanggal populer menampilkan≥10 unit dari≥5 rental per klaster [ASUMSI YANG HARUS DIUJI].|
|Harga all-in|Harga final yang ditampilkan: tarif + deposit + biaya antar-jemput (bila ada).|
|BookingState|State operasional booking (MENUNGGU_DP … SELESAI).|
|EscrowState|State keuangan per booking (MENUNGGU_DANA … DITERUSKAN). Dipisahkan dari BookingState (lihat 7.1–7.2).|
|TBD|To Be Defined — belum ditetapkan, menunggu validasi/keputusan.|



## 1.6 Referensi Proposal
|**ID**|**Dokumen / Bagian**|**Peran dalam SRS**|
|---|---|---|
|REF-01|Proposal DriveO v3 — Batasan Proposal (tiga zona)|Menentukan apa yang boleh dijadikan requirement final vs yang harus ditandai TBD|
|REF-02|Executive Summary + Bab III.2 (Cara Kerja End-to-End)|Sumber utama alur transaksi & keputusan desain kunci|
|REF-03|Bab III.3 (Kepercayaan Sisi Rental)|Sumber requirement transparansi dana & state machine|
|REF-04|Bab III.4 (Fitur per Problem)|Sumber pemetaan problem→fitur|
|REF-05|Bab VI (Model Bisnis)|Sumber alur dana, komisi, membership|
|REF-06|Bab VII (Trust & Safety)|Sumber 4 lapis trust & skenario kegagalan|
|REF-07|Bab VIII (Go-to-Market & Roadmap)|Sumber scope MVP vs future; concierge MVP|
|REF-08|Bab IX (Risiko)|Sumber requirement mitigasi (fraud, sengketa, data)|
|REF-09|Lampiran A (Rencana Validasi)|Sumber backlog validasi (Bagian 19)|
|REF-10|Lampiran B (Peta Regulasi)|Sumber requirement kepatuhan (UU PDP, UU ITE, PP 80/2019, UU 8/1999, pajak)|



# 2. Gambaran Umum Sistem
## 2.1 Problem Statement
Ekosistem rental kendaraan lokal berjalan di atas kanal terfragmentasi: 

1. **Sisi penyewa:** tidak ada satu tempat untuk menemukan, membandingkan, dan memesan kendaraan dari banyak rental lokal dengan informasi harga dan ketersediaan yang dapat dipercaya. Calon penyewa menghubungi banyak rental satu per satu via chat/telepon untuk menanyakan harga dan ketersediaan — proses manual dan berulang. 

2. **Sisi rental:** operasional berjalan di kanal yang tidak terhubung — chat untuk booking, spreadsheet/catatan untuk jadwal, ingatan untuk riwayat pelanggan. Akibatnya: waktu admin terbuang untuk pertanyaan berulang, risiko double booking, dan ketergantungan pada pelanggan yang sudah kenal sehingga sulit menjangkau pasar baru. 

3. **Kepercayaan:** tidak ada mekanisme standar untuk bertransaksi dengan orang asing — verifikasi identitas, perjanjian tertulis, dokumentasi kondisi unit, dan penyelesaian sengketa semuanya informal. 

Kesimpulan proposal: masalahnya bukan kekurangan supply atau demand, melainkan **tidak adanya agregator terintegrasi yang sekaligus mempertemukan keduanya, mendigitalisasi operasional rental, dan menyediakan lapisan kepercayaan** . 

## 2.2 Solusi DriveO
DriveO adalah infrastruktur digital tiga lapis untuk ekosistem rental kendaraan lokal (pilot: DIY): 

1. **Marketplace** — discovery, search, filter, comparison, listing, dan booking agregat multi-rental dengan harga all-in dan penanda kebaruan data. 

2. **Sistem Operasional Rental** — dashboard terpusat: katalog kendaraan, kalender ketersediaan, manajemen booking (termasuk nonplatform), riwayat pelanggan, Riwayat Dana, dan laporan/rekap. 

3. **Trust Layer** — verifikasi identitas dua pihak, perjanjian sewa elektronik, dokumentasi serah terima, deposit, dan reputasi dua arah, ditambah dukungan dispute/mediasi. 

Keputusan desain kunci (tidak boleh diubah tanpa persetujuan product): 

1. **Seluruh pembayaran via platform** — DP saat booking + pelunasan saat serah terima, keduanya on-platform, dengan escrow via payment gateway berizin. Menutup celah disintermediasi: proteksi (refund, mediasi) hanya berlaku untuk transaksi on-platform. 

2. **Handover terkunci sampai LUNAS** — checklist serah terima tidak dapat diisi sebelum pelunasan terkonfirmasi. Sistem yang mencegah, bukan rental yang mengecek. 

3. **Transparansi dana penuh ke rental** — state machine per booking, notifikasi instan setiap event uang, Riwayat Dana immutable, layar Dana Saya, jadwal payout tertulis. 

4. **Trust dua arah** — penyewa dilindungi escrow + refund + dokumentasi; rental dilindungi verifikasi penyewa + perjanjian elektronik + deposit + transparansi dana. 

## 2.3 Konsep Tiga Lapis
|**Lapis**|**Fungsi**|**Nilai jika lapis lain gagal**|
|---|---|---|
|1. Marketplace|Mendatangkan demand: pencarian, perbandingan, pemesanan|Tanpa operasional & trust: booking tidak bisa dipenuhi dengan aman→demand kecewa|
|2. Sistem|Membuat supply betah tinggal:|Tanpa marketplace & trust: hanya jadi software admin tanpa|
|Operasional|digitalisasi kerja harian rental|order baru dan tanpa keberanian terima orang asing|
|3. Trust Layer|Membuat orang asing berani bertransaksi|Tanpa marketplace & operasional: verifikasi tanpa transaksi adalah biaya tanpa guna|



Prinsip proposal: **satu lapis gagal → dua lainnya kehilangan makna** . Requirement di Bagian 4–5 didistribusikan ke tiga lapis ini dan diuji keterkaitannya di Bagian 20. 

## 2.4 Target Pengguna
|**Segmen**|**Profil**|**Kebutuhan utama**|**Sensitivitas harga**|
|---|---|---|---|
|Wisatawan domestik|Kunjungan 2–4 hari|Booking cepat; kepastian unit tersedia|Sedang — membayar untuk kepastian|
|Mahasiswa & personal lokal|Domisili Yogyakarta|Harga terjangkau; sewa fleksibel; mudah repeat|Tinggi — sensitif fee tambahan|
|Rental kecil–menengah|Armada provisional 5–30 unit [ASUMSI YANG HARUS DIUJI]; operasional via WhatsApp tanpa staf digital khusus|Order incremental; admin lebih ringan; pelanggan baru|—|



Bukan target awal (dikeluarkan dari MVP): rental besar yang sudah mapan (insentif join rendah), rental yang "sudah penuh dari WhatsApp", segmen korporat (fase lanjutan). 

## 2.5 Aktor Sistem
|**Aktor**|**Tanggung jawab dalam sistem**|
|---|---|
|Penyewa|Registrasi, verifikasi identitas, pencarian–booking–pembayaran, handover/return, review|
|Rental/Merchant|Registrasi & verifikasi mitra, kelola kendaraan/listing/kalender, konfirmasi booking, handover/return, pantau dana, terima payout, review|
|Admin|Moderasi listing/pengguna/transaksi; konfigurasi platform. (Pilot: dirangkap tim inti)|
|Tim Verifikasi|Review manual e-KYC & dokumen mitra untuk kasus meragukan|
|Customer Support|Kanal keluhan & bantuan pengguna/rental (wajib per PP 80/2019)|
|Tim Mediasi|Menangani klaim & sengketa berdasar bukti dokumentasi|
|Payment Gateway<br>(eksternal)|Memproses pembayaran; menampung dana (escrow); webhook status|
|Vendor e-KYC<br>(eksternal)|OCR + validitas format dokumen identitas (PROVIDER TBD)|
|Notification Provider<br>(eksternal)|Push notification, WhatsApp, email (PROVIDER TBD)|
|Sistem (Background Scheduler)|Aktor tambahan — DIBENARKAN karena diperlukan untuk otomasi berbasis waktu: kedaluwarsa link pembayaran, batal otomatis tanpa konfirmasi, pelepasan deposit otomatis, penjadwalan payout|



## 2.6 Konteks Sistem
```text
                        ┌─────────────────────────────────┐
                        │            DRIVEO               │
                        │  (Responsive Web Application)   │
                        │                                 │
  Penyewa ─────────────►│  Marketplace                    │◄───────────── Rental/Merchant
  (browser)             │  Sistem Operasional             │   (browser)
                        │  Trust Layer                    │
                        │  Ledger / Escrow State          │
                        └─────────────────────────────────┘
                           │           │           │
                           ▼           ▼           ▼
                    Payment Gateway  Vendor e-KYC  Notification
                    (escrow,         (OCR KTP+SIM) (push/WA/email)
                     webhook)
                           │
                           ▼
                    Object/File Storage
                    (foto & dokumen terenkripsi)

  Admin / Verifikasi / Support / Mediasi ──► Backoffice (RBAC)
```

Batasan konteks: 

1. DriveO tidak menyimpan dana di rekeningnya sendiri; dana dipegang payment gateway (escrow). 

2. DriveO meminimalkan penyimpanan citra identitas — dipertimbangkan vendor e-KYC sebagai pemroses data. 

3. Semua aktor manusia mengakses via browser (web responsif); tidak ada aplikasi native pada MVP. 

## 2.7 Asumsi dan Constraint
#### Asumsi (dari proposal — harus diuji, lihat Bagian 19):
1. A1: Besaran DP 20–30% dapat diterima pasar. 

2. A2: Rental kecil–menengah berarmada 5–30 unit adalah segmen awal yang tepat. 

3. A3: Ambang likuiditas mikro ( ≥ 10 unit dari ≥ 5 rental per klaster pada tanggal populer) cukup untuk pengalaman demand yang baik. 

4. A4: Link pembayaran yang kedaluwarsa dalam X menit dapat diterima pengguna. 

5. A5: SLA konfirmasi rental 2 jam realistis untuk operasional rental. 

6. A6: Retensi data verifikasi 90 hari memadai dan dapat diterima. 

7. A7: Target pilot ( ≥ 30 rental aktif, ≥ 500 booking, sengketa <5%) dapat dicapai dalam 12 bulan. 

8. A8: Perilaku negosiasi dapat diakomodasi mekanisme terstruktur (bukan harga mati kaku) — mekanisme pastinya TBD. 

9. A9: Budaya DP yang mapan menjadi fondasi penerimaan skema pembayaran. 

#### Constraint:
1. C1: Platform = responsive web app; bukan native (keputusan sadar untuk kecepatan validasi). 

2. C2: Tidak ada ML/AI dan telematika pada MVP. 

3. C3: Dana tidak boleh mengendap di rekening operasional DriveO (prinsip escrow). 

4. C4: Platform tidak menalangi refund dari kantong sendiri. 

5. C5: Proteksi hanya untuk transaksi on-platform. 

6. C6: Kepatuhan: UU PDP 27/2022, UU ITE, PP 80/2019 (PMSE), UU 8/1999; finalisasi struktur escrow & dokumen legal oleh profesional pada pre-launch. 

7. C7: Pada pilot, peran backoffice (Admin/Verifikasi/Support/Mediasi) dirangkap tim inti secara manual — SOP terbentuk dari kasus nyata sebelum diotomasi. Sistem tetap harus mendukung peran-peran tersebut sebagai peran logis yang berbeda (RBAC). 

8. C8: Batas jujur double booking: sistem mengurangi, bukan menghilangkan, double booking selama order paralel via WhatsApp masih ada. 

# 3. Business Process
Notasi status: `BookingState` = B:xxx, `EscrowState` = E:xxx (lihat Bagian 7). Setiap proses mencantumkan Actor, Trigger, Preconditions, Main Flow, Alternative Flow, Exception Flow, Postconditions, Business Rules. 

## 3.1 Discovery
- **Actor:** Penyewa (belum/tanpa login). 
- **Trigger:** Penyewa membuka halaman utama / landing.
- **Preconditions:** Ada listing aktif dari rental terverifikasi. 

- **Main Flow:** 

1. Sistem menampilkan listing agregat multi-rental yang tersedia. 

2. Setiap kartu listing menampilkan: foto, jenis kendaraan, harga all-in, lokasi rental, status verifikasi rental, rating, dan penanda "diperbarui X menit/jam lalu". 

3. Penyewa dapat menelusuri tanpa login. 
- **Alternative Flow:** Jika belum ada listing yang memenuhi ambang likuiditas, sistem menampilkan pesan jujur tentang ketersediaan terbatas (bukan hasil palsu). 

- **Exception Flow:** Layanan pencarian gagal → tampilkan pesan error + opsi coba lagi; tidak menampilkan data basi sebagai data segar. 
- **Postconditions:** Penyewa melihat daftar awal yang jujur tentang kebaruan datanya. 
- **Business Rules:** BR-025 (penanda kebaruan), BR-026 (harga all-in), BR-027 (listing basi turun peringkat + label). 

## 3.2 Search
- **Actor:** Penyewa. 
- **Trigger:** Penyewa mengisi kriteria: lokasi, tanggal sewa, jenis kendaraan, rentang harga. 
- **Preconditions:** Sama dengan 3.1. 

#### Main Flow:
1. Penyewa memasukkan kriteria pencarian. 

2. Sistem memfilter listing berdasarkan kriteria + ketersediaan kalender per unit pada rentang tanggal. 

3. Hasil diurutkan (relevansi/harga/rating — opsi sortir tersedia). 

4. Setiap hasil mencantumkan penanda kebaruan data. 
- **Alternative Flow:** Tidak ada hasil → sistem menyarankan pelonggaran kriteria (tanggal/jenis/lokasi) tanpa mengarang ketersediaan. 
- **Exception Flow:** Kriteria tidak valid (mis. tanggal selesai < tanggal mulai) → tolak dengan pesan yang jelas. 
- **Postconditions:** Daftar hasil yang konsisten dengan kriteria dan ketersediaan. 
- **Business Rules:** BR-025, BR-026, BR-027, BR-028 (ketersediaan dari kalender per unit). 

## 3.3 Comparison
- **Actor:** Penyewa. 
- **Trigger:** Penyewa memilih 2+ listing untuk dibandingkan. 
- **Preconditions:** Hasil pencarian tersedia. 

#### Main Flow:
1. Sistem menampilkan perbandingan berdampingan: harga all-in (tarif + deposit + antar-jemput), spesifikasi unit, syarat sewa, profil rental (status verifikasi, rating, jumlah booking terselesaikan), dan penanda kebaruan. 

2. Penyewa memilih satu listing untuk dilanjutkan ke booking. 
- **Alternative Flow:** Penyewa kembali ke hasil pencarian tanpa memilih. 

- **Exception Flow:** Listing yang dibandingkan menjadi tidak tersedia di tengah jalan → tandai dan keluarkan dari perbandingan dengan penjelasan. 
- **Postconditions:** Satu listing terpilih untuk booking. 
- **Business Rules:** BR-026, BR-036 (status verifikasi rental tampil), BR-013 (rating dari transaksi terselesaikan). 

## 3.4 Booking
- **Actor:** Penyewa. 
- **Trigger:** Penyewa menekan "Booking" pada listing terpilih dan mengisi tanggal/jam serta data yang diperlukan. 
- **Preconditions:** Listing aktif; slot tersedia pada rentang tanggal (kalender per unit); penyewa menyetujui perjanjian sewa elektronik (lihat 3.x — persetujuan terjadi SEBELUM pembayaran, BR-017). 

#### Main Flow:
1. Sistem membuat booking dengan B:MENUNGGU_DP, E:MENUNGGU_DANA; slot kalender dikunci (BR-028). 

2. Sistem menghitung rincian: tarif × durasi, deposit, biaya antar-jemput (bila ada), DP (besaran TBD), dan menampilkannya transparan. 

3. Sistem menerbitkan link pembayaran DP dengan masa kedaluwarsa (X menit, TBD). 

4. Sistem mengirim notifikasi link pembayaran ke penyewa. 

- **Alternative Flow:** Penyewa memilih opt-in "Bayar Penuh di Awal" → total = 100% (BR-003), tetap tercatat sebagai satu payment record bertipe FULL. 
- **Exception Flow:** Slot ternyata sudah terkunci (race condition / order WA paralel) → booking gagal dibuat dengan pesan jujur; tawarkan unit/tanggal alternatif (batas jujur C8). 
- **Postconditions:** Booking B:MENUNGGU_DP; slot terkunci; link DP aktif. 
- **Business Rules:** BR-001, BR-003, BR-005, BR-017, BR-028, BR-037. 

## 3.5 DP Payment
- **Actor:** Penyewa, Payment Gateway, Sistem (scheduler). 
- **Trigger:** Penyewa membuka link pembayaran DP dan menyelesaikan pembayaran via PG. 
- **Preconditions:** Booking B:MENUNGGU_DP; link belum kedaluwarsa. 

#### Main Flow:
1. Penyewa membayar DP via PG; dana masuk escrow (E:DITAHAN_ESCROW), event `dp_paid` dicatat di ledger (BR-031). 

2. Webhook PG diterima, diverifikasi signature, diproses idempotent → booking menjadi B:MENUNGGU_KONFIRMASI_RENTAL. 

3. Notifikasi instan (push + WhatsApp) dikirim ke rental (event uang) dan ke penyewa (tanda terima). 

4. Timer SLA konfirmasi rental dimulai. 
- **Alternative Flow:** Penyewa membayar penuh di awal (opt-in) → E:LUNAS langsung; tetap menunggu konfirmasi rental. 

#### Exception Flow:
Pembayaran gagal → booking tetap B:MENUNGGU_DP selama link belum kedaluwarsa; penyewa bisa coba lagi. 

- Link kedaluwarsa (timer X menit) → Sistem membatalkan booking (B:KEDALUWARSA), membuka slot, mencatat event; tidak ada dana yang tertahan. 

Webhook duplikat/terlambat → diabaikan berdasar idempotency key; state tidak berubah ganda. 
- **Postconditions:** B:MENUNGGU_KONFIRMASI_RENTAL (atau KEDALUWARSA); E:DITAHAN_ESCROW (atau tetap MENUNGGU_DANA). 
- **Business Rules:** BR-001, BR-004, BR-005, BR-031, BR-032. 

## 3.6 Identity Verification
- **Actor:** Penyewa, Vendor e-KYC, Tim Verifikasi, Sistem. 
- **Trigger:** Setelah DP diterima (atau paralel sejak booking dibuat — implementasi boleh paralel selama hasil tersedia sebelum handover; persetujuan perjanjian tetap sebelum pembayaran). 
- **Preconditions:** Booking B:MENUNGGU_KONFIRMASI_RENTAL atau lebih lanjut; booking bertipe lepas kunci. 

#### Main Flow:
1. Penyewa mengupload KTP + SIM dengan consent eksplisit terpisah (BR-040). 

2. Vendor e-KYC melakukan OCR + validitas format otomatis. 

3. Jika lolos otomatis → status DISETUJUI; jika meragukan → BUTUH_REVIEW_MANUAL oleh Tim Verifikasi. 

4. Hasil (ringkasan, bukan citra mentah bila dimungkinkan) diteruskan ke rental sebagai bahan konfirmasi (BR-015). 
- **Alternative Flow:** Dokumen ditolak → penyewa dapat upload ulang dengan alasan yang jelas. 

- **Exception Flow:** Dokumen terindikasi palsu → tolak + blokir akun (BR-033); vendor e-KYC down → antrean retry + notifikasi status ke penyewa. 
- **Postconditions:** VerificationState DISETUJUI/DITOLAK; data terenkripsi dengan akses RBAC. 
- **Business Rules:** BR-014, BR-015, BR-016, BR-033, BR-039, BR-040. 

## 3.7 Rental Confirmation
- **Actor:** Rental/Merchant, Sistem (scheduler). 
- **Trigger:** Notifikasi booking baru (DP sudah diterima + hasil verifikasi tersedia). 
- **Preconditions:** Booking B:MENUNGGU_KONFIRMASI_RENTAL; dalam masa SLA. 

#### Main Flow:
1. Rental meninjau booking: tanggal, unit, data verifikasi penyewa (ringkasan), dan rincian dana (berapa yang akan diterima, komisi transparan — BR-030). 

2. Rental menekan Konfirmasi → B:TERKONFIRMASI; event `booking_confirmed` dicatat; notifikasi ke penyewa. 

- **Alternative Flow:** Rental menolak → B:DITOLAK_RENTAL; DP kembali penuh ke penyewa (refund dari escrow, BR-010); slot dibuka. 

- **Exception Flow:** SLA terlampaui tanpa aksi → Sistem otomatis membatalkan (B:DIBATALKAN, alasan: tanpa konfirmasi), DP kembali penuh (BR-006); penalti reputasi dapat dipertimbangkan sesuai kebijakan (TBD). 
- **Postconditions:** B:TERKONFIRMASI (atau batal/tolak dengan refund penuh). 
- **Business Rules:** BR-006, BR-010, BR-012 (untuk varian pembatalan rental), BR-030. 

## 3.8 Handover
- **Actor:** Rental/Merchant, Penyewa. 
- **Trigger:** Kedua pihak bertemu untuk serah terima unit pada waktu yang disepakati. 

- **Preconditions:** B:TERKONFIRMASI; E:LUNAS (pelunasan sudah diterima — lihat 3.9). Checklist dalam keadaan TERKUNCI sampai LUNAS. 

#### Main Flow:
1. Setelah E:LUNAS, sistem membuka kunci checklist serah terima. 

2. Kedua pihak mengisi checklist + mengunggah foto kondisi: body, odometer/BBM, kelengkapan (BR-018). 

3. Kedua pihak mengkonfirmasi serah terima di aplikasi → HandoverState SELESAI; booking menjadi B:DALAM_SEWA; event `handover_completed` dicatat. 

- **Alternative Flow:** Salah satu pihak tidak bisa hadir tepat waktu → koordinasi ulang via aplikasi/CS; booking tetap B:TERKONFIRMASI sampai handover selesai. 

- **Exception Flow:** Checklist dibuka padahal belum LUNAS (upaya bypass) → sistem menolak dan mencatat upaya akses; unit tidak boleh diserahkan sebelum LUNAS. 
- **Postconditions:** B:DALAM_SEWA; dokumen serah terima tersimpan sebagai acuan tunggal sengketa. 
- **Business Rules:** BR-007, BR-018. 

## 3.9 Final Payment
- **Actor:** Penyewa, Payment Gateway. 
- **Trigger:** Saat serah terima — aplikasi membuatkan link/QRIS pelunasan otomatis. 
- **Preconditions:** B:TERKONFIRMASI (atau B:MENUNGGU_PELUNASAN sebagai sub-status handover); DP sudah di escrow. 

#### Main Flow:
1. Sistem membuat payment record PELUNASAN sebesar sisa tagihan; menampilkan link/QRIS. 

2. Penyewa melunasi via PG → dana masuk escrow; E:DITAHAN_ESCROW → E:LUNAS; event `final_payment_received` dicatat. 

3. Sistem membuka kunci checklist handover (BR-007); notifikasi ke kedua pihak. 

- **Alternative Flow:** Sudah bayar penuh di awal (BR-003) → langkah ini dilewati; E sudah LUNAS sejak awal. 
- **Exception Flow:** Pembayaran gagal/kedaluwarsa → checklist tetap terkunci; penyewa dapat mencoba lagi; booking TIDAK otomatis batal pada tahap ini (kebijakan penanganan TBD — masuk OQ). 
- **Postconditions:** E:LUNAS; checklist terbuka. 
- **Business Rules:** BR-002, BR-003, BR-004, BR-007, BR-031, BR-032. 

## 3.10 Rental Period
- **Actor:** Penyewa, Rental. 
- **Trigger:** Handover selesai. 
- **Preconditions:** B:DALAM_SEWA. 

#### Main Flow:
1. Masa sewa berjalan sesuai tanggal yang disepakati. 

2. Perpanjangan hanya via platform (BR-034): penyewa mengajukan, rental menyetujui, pembayaran tambahan via platform → tanggal selesai diperbarui, slot kalender disesuaikan. 
- **Alternative Flow:** Tidak ada perpanjangan → masa sewa berakhir sesuai jadwal. 
- **Exception Flow:** Kendaraan mogok → rental wajib mengganti unit atau refund proporsional (BR-022, besaran TBD). 
- **Postconditions:** B:DALAM_SEWA hingga waktu pengembalian tiba. 
- **Business Rules:** BR-022, BR-034. 

## 3.11 Return
- **Actor:** Penyewa, Rental. 
- **Trigger:** Waktu pengembalian tiba / penyewa menginisiasi pengembalian di aplikasi. 
- **Preconditions:** B:DALAM_SEWA. 

#### Main Flow:
1. Kedua pihak mengisi checklist + foto pengembalian yang sama dengan saat handover (BR-018). 

2. Rental mengkonfirmasi pengembalian → ReturnState SELESAI; event `return_completed` dicatat; booking menjadi B:SELESAI (menunggu settlement). 

3. Timer claim window deposit 24 jam dimulai (BR-009). 
- **Alternative Flow:** Pengembalian terlambat → denda per jam sesuai perjanjian (BR-020); selisih ditagih via platform. 
- **Exception Flow:** Penyewa tidak mengembalikan (indikasi penggelapan) → BR-023: data verifikasi + perjanjian diserahkan untuk proses hukum; akun diblokir; dana ditahan mengikuti arahan mediasi/hukum. 
- **Postconditions:** B:SELESAI (operasional); E:LUNAS menunggu payout; deposit masuk claim window. 

- **Business Rules:** BR-018, BR-020, BR-023. 

## 3.12 Deposit Handling
- **Actor:** Sistem (scheduler), Rental, Tim Mediasi. 
- **Trigger:** Pengembalian terkonfirmasi (otomatis) atau klaim dari rental (manual). 
- **Preconditions:** Deposit tertahan di escrow; ReturnState SELESAI. 

#### Main Flow (tanpa klaim):
1. Selama 24 jam claim window, deposit berstatus DITAHAN. 

2. Jika tidak ada klaim → Sistem otomatis melepas deposit kembali ke penyewa (D: DILEPAS); event dicatat; notifikasi ke penyewa. 

#### Alternative Flow (dengan klaim):
1. Rental membuat klaim dalam 24 jam dengan bukti (foto perbandingan handover vs return). 

2. Deposit DIBEKUKAN_KLAIM sampai mediasi selesai (BR-009). 

3. Tim Mediasi memutuskan berdasar bukti: potong sebagian/seluruh untuk ganti rugi, atau lepas penuh ke penyewa. 
- **Exception Flow:** Klaim diajukan setelah 24 jam → ditolak otomatis (kecuali kebijakan pengecualian TBD).
- **Postconditions:** Deposit DILEPAS atau DIPOTONG sesuai hasil mediasi; semua perpindahan tercatat di ledger.
- **Business Rules:** BR-009, BR-019, BR-031. 

## 3.13 Settlement/Payout
- **Actor:** Sistem (scheduler), Payment Gateway. 
- **Trigger:** H+1 setelah pengembalian terkonfirmasi (dan tidak ada sengketa/claim yang membekukan dana). 
- **Preconditions:** B:SELESAI; ReturnState SELESAI; E:LUNAS; tidak ada dispute/claim aktif yang membekukan dana sewa. 

#### Main Flow:
1. Sistem membuat payout: dana sewa − komisi (besaran komisi TBD; ditampilkan transparan per booking, BR-030). 

2. PG mengeksekusi transfer ke rekening rental → E:DITERUSKAN; event `payout_completed` + referensi bank dicatat. 

3. Layar Dana Saya diperbarui: ditahan → dalam perjalanan → ditransfer; notifikasi instan ke rental (BR-032). 

- **Alternative Flow:** Di fase awal, payout dapat dieksekusi manual same-day oleh founder (under-promise, over-deliver) — dicatat sebagai payout manual dengan referensi yang sama. 

- **Exception Flow:** Payout gagal (rekening salah/gangguan bank) → PayoutState GAGAL → retry terjadwal; rental dinotifikasi dengan alasan dan estimasi; dana tetap di escrow (tidak hilang). 
- **Postconditions:** E:DITERUSKAN; rental dapat mencocokkan referensi di mutasi bank. 
- **Business Rules:** BR-008, BR-030, BR-031, BR-032. 

## 3.14 Review
- **Actor:** Penyewa, Rental. 
- **Trigger:** Booking B:SELESAI dan payout selesai (transaksi terselesaikan). 
- **Preconditions:** Transaksi terselesaikan; belum pernah memberi review untuk booking ini. 

#### Main Flow:
1. Kedua pihak dapat memberi rating + ulasan satu sama lain. 

2. Sistem memvalidasi eligibilitas (hanya transaksi terselesaikan — anti fake review, BR-013). 

3. Review tampil di profil masing-masing dan memengaruhi reputasi. 

- **Alternative Flow:** Salah satu pihak tidak memberi review dalam batas waktu (TBD) → kesempatan hangus; tidak ada penalti. 
- **Exception Flow:** Upaya review ganda / review untuk booking batal → ditolak. 

- **Postconditions:** Reputasi dua arah tercatat. 
- **Business Rules:** BR-013. 

## 3.15 Cancellation
- **Actor:** Penyewa, Rental, Sistem. 
- **Trigger:** Permintaan batal dari salah satu pihak, atau kondisi otomatis.
- **Preconditions:** Booking belum B:DALAM_SEWA (pembatalan setelah handover mengikuti alur dispute/pengembalian dini — kebijakan TBD). 

#### Main Flow (batal oleh penyewa):
1. Penyewa mengajukan pembatalan → sistem menghitung refund bertingkat berdasar H-berapa (kebijakan TBD, BR-011). 

2. Refund dieksekusi dari dana escrow yang ditahan (BR-010); slot dibuka; event dicatat. 

#### Main Flow (batal oleh rental):
1. Refund penuh ke penyewa + penalti reputasi rental + bantuan realokasi unit pengganti (BR-012). 

**Exception/otomatis:** Link DP kedaluwarsa → B:KEDALUWARSA (BR-005); tanpa konfirmasi rental → B:DIBATALKAN + DP kembali penuh (BR-006). 
- **Postconditions:** B:DIBATALKAN/KEDALUWARSA/DITOLAK_RENTAL; E:DIREFUND_PENUH/SEBAGIAN; slot terbuka. 
- **Business Rules:** BR-005, BR-006, BR-010, BR-011, BR-012. 

## 3.16 Dispute
- **Actor:** Penyewa, Rental, Tim Mediasi, Customer Support. 

- **Trigger:** Klaim kerusakan, unit tak sesuai, keterlambatan bermasalah, dugaan penggelapan, atau ketidaksepakatan lain yang tidak selesai bilateral. 
- **Preconditions:** Ada booking/transaksi terkait; bukti dokumentasi (checklist + foto) tersedia sebagai acuan. 

#### Main Flow:
1. Pihak yang dirugikan membuka sengketa via aplikasi/CS dengan melampirkan bukti. 

2. Dana terkait DIBEKUKAN (BR-009 untuk deposit; dana sewa ditahan dari payout). 

3. Tim Mediasi memeriksa bukti (foto handover vs return sebagai acuan tunggal), memfasilitasi kesepakatan. 

4. Hasil: potong/lepas deposit, refund sebagian/penuh, atau ganti unit — dieksekusi dari dana yang ditahan; event dicatat. 

- **Alternative Flow:** Sengketa buntu → diserahkan ke mekanisme hukum; platform menyediakan paket dokumentasi lengkap (BR024). 

- **Exception Flow:** Dugaan penggelapan → BR-023 (data untuk proses hukum; blokir akun). Dokumen palsu → BR-033. 

- **Postconditions:** DisputeState SELESAI_DISETUJUI / DIESKALASI_HUKUM; dana dicairkan sesuai keputusan; kedua pihak dinotifikasi dengan alasan tertulis. 

- **Business Rules:** BR-009, BR-019, BR-023, BR-024, BR-033, BR-037. 

# 4. Functional Requirements
Sumber: Proposal DriveO v3. Aturan penulisan: tidak mengarang angka/fitur; semua yang belum final ditandai TBD dengan status validasi; baseline = responsive web application. Kode BR-001 s/d BR-044 merujuk definisi kanonis di Bagian 6. 

Format per FR: ID, Name, Actor, Priority, Description, Precondition, Trigger, Main Flow (bernomor), Alternative Flow, Exception, Postcondition, Business Rules (BR-xxx), Dependencies, Validation Status. 

## 4.1 AUTH — Autentikasi & Otorisasi Dasar
### FR-AUTH-001 — Registrasi Penyewa

- **Actor:** Penyewa (calon). 

- **Priority:** Critical. 

- **Description:** Individu membuat akun penyewa dengan identitas kontak yang terverifikasi sehingga akun dapat digunakan untuk booking, pembayaran, dan verifikasi identitas. Registrasi tidak otomatis memberikan akses ke fungsi rental; peran ditetapkan terpisah (FR-AUTH-005). 

- **Precondition:** Calon penyewa belum memiliki akun dengan email/nomor WA yang sama; halaman registrasi dapat diakses tanpa login. 
- **Trigger:** Calon penyewa mengisi form registrasi dan menekan "Daftar". 

- **Main Flow:** 

1. Calon penyewa memasukkan nama lengkap, email, nomor WhatsApp, dan kata sandi (memenuhi kebijakan kekuatan sandi). 

2. Sistem memvalidasi format dan keunikan email/nomor WA. 

3. Sistem membuat akun berstatus BELUM_TERVERIFIKASI dan mengirim kode OTP ke email/nomor WA. 

4. Calon penyewa memasukkan OTP yang benar dalam batas waktu yang ditetapkan ([TECHNICAL DECISION REQUIRED] untuk durasi OTP). 

5. Sistem menandai akun TERVERIFIKASI KONTAK dan membuat sesi login awal. 

- **Alternative Flow:** (a) OTP kedaluwarsa/salah → sistem mengizinkan kirim ulang OTP terbatas (rate-limited). (b) Registrasi via akun pihak ketiga (mis. Google) — apabila diputuskan menjadi bagian MVP → Business Decision Required; jika tidak tersedia, calon penyewa hanya dapat mendaftar via form. 

- **Exception:** Email/nomor WA sudah terdaftar → sistem menolak dengan pesan jelas dan menawarkan reset password atau login. OTP gagal melebihi batas percobaan → akun dikunci sementara dari verifikasi OTP; calon penyewa dapat meminta ulang setelah jeda. 

- **Postcondition:** Akun penyewa berstatus TERVERIFIKASI KONTAK; akun dapat login; belum ada data e-KYC (diisi kemudian pada alur verifikasi identitas). 

- **Business Rules:** BR-040 (consent eksplisit saat pengumpulan data pribadi); kebijakan kekuatan sandi dan OTP bersifat teknis — [TECHNICAL DECISION REQUIRED]. 

- **Dependencies:** FR-NOTIFICATION-001 (pengiriman OTP), FR-AUDIT-001 (audit pembuatan akun).
- **Validation Status:** Defined. 

### FR-AUTH-002 — Login

- **Actor:** Penyewa, Rental/Merchant, Admin, Tim Verifikasi, Customer Support, Tim Mediasi. 
- **Priority:** Critical. 

- **Description:** Pengguna terdaftar masuk ke sistem dengan kredensialnya sehingga mendapatkan sesi dan token akses sesuai perannya. Sistem membedakan akun penyewa dan akun rental sejak registrasi (FR-AUTH-001 / FR-RENTAL-001).
- **Precondition:** Pengguna memiliki akun terdaftar dengan status aktif. 

- **Trigger:** Pengguna memasukkan email/nomor WA + kata sandi (atau kredensial pihak ketiga bila tersedia) dan menekan "Masuk".
- **Main Flow:** 

1. Pengguna memasukkan kredensial. 

2. Sistem memverifikasi kredensial terhadap hash yang tersimpan. 

3. Jika valid, sistem menerbitkan access token dan refresh token sesuai peran pengguna. 

4. Sistem mencatat event login ke audit trail. 

- **Alternative Flow:** (a) Login pihak ketiga bila didukung (lihat FR-AUTH-001 alternative). (b) Akun dengan multi-peran (mis. staf rental): sistem meminta pemilihan konteks kerja setelah login (lihat FR-RENTAL-004). 

- **Exception:** Kredensial salah → pesan generik tanpa membocorkan akun mana yang salah; percobaan berulang melebihi ambang → penguncian sementara akun (ambang = [TECHNICAL DECISION REQUIRED]). Akun nonaktif/diblokir → login ditolak dengan alasan yang tidak membuka celah enumerasi berlebihan. 

- **Postcondition:** Pengguna terautentikasi dengan peran yang benar; token aktif; event login tercatat. 

- **Business Rules:** Mekanisme token (JWT/session), masa berlaku token, dan ambang lockout = [TECHNICAL DECISION REQUIRED].
- **Dependencies:** FR-AUTH-001, FR-AUTH-005. 
- **Validation Status:** Defined. 

### FR-AUTH-003 — Logout & Refresh Token

- **Actor:** Semua pengguna terautentikasi. 

- **Priority:** High. 

- **Description:** Pengguna dapat keluar sehingga sesi dan token aksesnya tidak lagi berlaku; sistem juga menyediakan mekanisme perpanjangan sesi via refresh token tanpa memaksa login ulang selama refresh token masih valid. 

- **Precondition:** Pengguna memiliki sesi/token aktif. 

- **Trigger:** (a) Pengguna menekan "Keluar". (b) Access token kedaluwarsa dan klien meminta refresh dengan refresh token yang valid. 

- **Main Flow:** 

1. Logout: sistem membatalkan (revoke) access token dan refresh token milik sesi tersebut; klien menghapus token lokal. 

2. Refresh: sistem memvalidasi refresh token (belum kedaluwarsa, belum di-revoke, cocok dengan perangkat/sesi bila diterapkan); sistem menerbitkan pasangan token baru dan me-revoke yang lama (rotasi). 

3. Sistem mencatat event logout/refresh ke audit trail. 

- **Alternative Flow:** "Keluar dari semua perangkat": pengguna dapat me-revoke seluruh refresh token miliknya (berguna bila perangkat hilang). 

- **Exception:** Refresh token tidak valid/kedaluwarsa/di-revoke → permintaan ditolak; pengguna diarahkan login ulang. Token yang direvoke dipakai kembali → sistem menolak dan mencatat sebagai anomali potensial (kaitan pencegahan fraud). 
- **Postcondition:** Sesi berakhir (logout) atau sesi diperpanjang dengan token baru (refresh); token lama tidak dapat dipakai lagi. 
- **Business Rules:** Masa berlaku token, strategi rotasi, dan daftar token di-revoke = [TECHNICAL DECISION REQUIRED]. 

- **Dependencies:** FR-AUTH-002. 

- **Validation Status:** Defined. 

### FR-AUTH-004 — Reset Password

- **Actor:** Penyewa, Rental/Merchant, Admin, dan peran internal lain. 
- **Priority:** High. 
- **Description:** Pengguna yang lupa kata sandi dapat mengatur ulang melalui tautan/kode sekali pakai yang dikirim ke kontak terverifikasinya, tanpa bantuan manual, dengan masa berlaku terbatas. 
- **Precondition:** Pengguna memiliki akun dengan email/nomor WA terverifikasi. 
- **Trigger:** Pengguna menekan "Lupa Kata Sandi" dan memasukkan email/nomor WA. 

- **Main Flow:** 

1. Pengguna memasukkan email/nomor WA. 

2. Jika terdaftar, sistem menerbitkan token reset sekali pakai dengan masa berlaku terbatas ([TECHNICAL DECISION REQUIRED]) dan mengirimkannya ke kontak terverifikasi. 

3. Pengguna membuka tautan/memasukkan kode, lalu menetapkan kata sandi baru yang memenuhi kebijakan. 

4. Sistem mengganti hash sandi, me-revoke seluruh sesi/token aktif pengguna tersebut, dan mencatat event ke audit trail. 

5. Sistem mengirim notifikasi konfirmasi bahwa sandi telah diubah. 

- **Alternative Flow:** Pengguna meminta kirim ulang token reset → dibatasi rate limit; token lama otomatis tidak berlaku. 

- **Exception:** Token reset kedaluwarsa/sudah dipakai/tidak cocok → permintaan ditolak; pengguna harus mengulang dari awal. Kontak tidak terdaftar → sistem memberi respons generik (tidak membocorkan keberadaan akun). 

- **Postcondition:** Kata sandi baru aktif; seluruh sesi lama tidak berlaku; event tercatat. 

- **Business Rules:** Masa berlaku token reset dan kebijakan sandi = [TECHNICAL DECISION REQUIRED].
- **Dependencies:** FR-AUTH-002, FR-NOTIFICATION-001, FR-AUDIT-001. 

- **Validation Status:** Defined. 

### FR-AUTH-005 — Penetapan Peran (Role Assignment)

- **Actor:** Sistem; Admin (untuk peran internal dan persetujuan peran rental). 

- **Priority:** Critical. 

- **Description:** Setiap akun memiliki tepat satu peran primer (Penyewa, Rental/Merchant, atau peran internal: Admin, Tim Verifikasi, Customer Support, Tim Mediasi) yang menentukan hak akses di seluruh sistem. Peran primer ditetapkan saat registrasi (penyewa vs pendaftar rental) dan tidak dapat diubah sendiri oleh pengguna; peran internal hanya ditetapkan oleh Admin. Satu individu dapat memegang akun terpisah untuk peran berbeda (mis. pemilik rental yang juga menyewa sebagai penyewa memakai dua akun).
- **Precondition:** Akun terdaftar dan kontak terverifikasi. 

- **Trigger:** (a) Registrasi selesai → peran primer ditetapkan sesuai jalur pendaftaran. (b) Admin menetapkan/mengubah peran internal atau menyetujui peran rental setelah verifikasi mitra. 

- **Main Flow:** 

1. Pada registrasi penyewa: sistem menetapkan peran PENYEWA. 

2. Pada registrasi rental: akun dibuat dengan peran calon RENTAL berstatus MENUNGGU_VERIFIKASI_MITRA; peran RENTAL aktif hanya setelah verifikasi mitra disetujui (FR-RENTAL-002). 

3. Admin menetapkan peran internal (Admin/Verifikasi/CS/Mediasi) melalui konsol admin; perubahan peran dicatat di audit trail dengan alasan. 

4. Setiap permintaan API/aksi UI melewati pemeriksaan peran (otorisasi) sebelum dieksekusi. 

- **Alternative Flow:** Akun staf rental (FR-RENTAL-004): pemilik rental mengundang staf; staf mendapat peran STAFF_RENTAL yang terikat pada satu rental dengan hak terbatas. 

- **Exception:** Pengguna mencoba mengakses fungsi di luar perannya → akses ditolak (403) dan dicatat. Upaya eskalasi peran via API → ditolak dan dicatat sebagai anomali keamanan. 

- **Postcondition:** Setiap akun memiliki peran yang jelas dan ditegakkan di seluruh sistem; perubahan peran teraudit. 

- **Business Rules:** Matriks otorisasi kanonis didefinisikan di Bagian 12; RBAC ditegakkan di sisi server, bukan hanya di UI.
- **Dependencies:** FR-AUTH-001, FR-RENTAL-001, FR-RENTAL-002, FR-AUTH-002. 

- **Validation Status:** Defined. 

## 4.2 USER — Profil Penyewa & Data Pribadi
### FR-USER-001 — Lihat Profil

- **Actor:** Penyewa. 

- **Priority:** High. 

- **Description:** Penyewa dapat melihat data profilnya sendiri (identitas dasar, kontak, status verifikasi e-KYC, dan ringkasan reputasi) sebagai satu sumber kebenaran sebelum booking, sehingga ia tahu data apa yang akan diteruskan ke rental. 

- **Precondition:** Penyewa terautentikasi. 
- **Trigger:** Penyewa membuka halaman "Profil Saya". 

- **Main Flow:** 

1. Penyewa membuka halaman profil. 

2. Sistem menampilkan nama, email, nomor WA, foto profil (bila ada), status verifikasi identitas 

- (belum/diproses/terverifikasi/ditolak), dan ringkasan rating sebagai penyewa. 

3. Sistem TIDAK menampilkan citra dokumen KTP/SIM mentah di halaman profil reguler; dokumen hanya dapat dilihat melalui alur verifikasi yang teraudit (kaitan BR-039). 

- **Alternative Flow:** Penyewa belum menyelesaikan e-KYC → sistem menampilkan ajakan (call-to-action) melengkapi verifikasi dengan penjelasan manfaatnya. 

- **Exception:** Data profil tidak ditemukan/rusak → sistem menampilkan pesan kesalahan dan mencatat insiden; tidak menampilkan stack trace ke pengguna. 
- **Postcondition:** Penyewa melihat profilnya secara akurat dan terkini. 
- **Business Rules:** BR-039 (akses data sensitif berbasis peran + pencatatan akses). 
- **Dependencies:** FR-AUTH-002, FR-VERIFICATION-001. 
- **Validation Status:** Defined. 

### FR-USER-002 — Ubah Profil

- **Actor:** Penyewa. 
- **Priority:** High. 
- **Description:** Penyewa dapat memperbarui data profil non-sensitif (nama tampilan, foto profil, nomor WA, preferensi notifikasi) dengan perubahan tercatat dan, untuk kontak, melalui verifikasi ulang agar data kontak yang dipakai untuk OTP/notifikasi selalu 

valid. 
- **Precondition:** Penyewa terautentikasi. 
- **Trigger:** Penyewa mengubah field profil dan menyimpan. 

#### Main Flow:
1. Penyewa mengubah field yang diizinkan. 

2. Sistem memvalidasi format setiap field. 

3. Jika nomor WA/email diubah: sistem mengirim OTP ke kontak baru; perubahan kontak baru efektif setelah OTP terverifikasi (kontak lama tetap dipakai sampai saat itu). 

4. Sistem menyimpan perubahan beserta timestamp dan mencatat event ke audit trail. 

- **Alternative Flow:** Penyewa mengunggah foto profil → file divalidasi (tipe, ukuran) sebelum disimpan di object storage. 

- **Exception:** Format tidak valid/kontak baru sudah dipakai akun lain → perubahan ditolak per-field dengan pesan jelas; perubahan field lain yang valid tetap dapat disimpan (parsial per-field, bukan all-or-nothing — keputusan teknis antarmuka, dicatat di sini sebagai perilaku yang diharapkan). 
- **Postcondition:** Profil diperbarui; kontak baru terverifikasi bila diubah; perubahan teraudit. 
- **Business Rules:** BR-040 (consent untuk data yang dikumpulkan); validasi file mengikuti aturan keamanan file (Bagian 14).
- **Dependencies:** FR-AUTH-002, FR-NOTIFICATION-001. 
- **Validation Status:** Defined. 

### FR-USER-003 — Kelola Consent Data

- **Actor:** Penyewa, Rental/Merchant. 
- **Priority:** Critical. 
- **Description:** Pengguna memberikan dan dapat menarik kembali persetujuan (consent) yang eksplisit dan terpisah untuk setiap tujuan pemrosesan data pribadi (khususnya upload dokumen identitas untuk verifikasi), sesuai UU PDP 27/2022. Consent dicatat dengan versi teks, waktu, dan tujuan; penarikan consent memicu alur penanganan data (FR-USER-004). 
- **Precondition:** Pengguna terautentikasi. 

- **Trigger:** (a) Pengguna pertama kali mengunggah dokumen identitas. (b) Pengguna membuka "Pengaturan Privasi" untuk melihat/menarik consent. 

#### Main Flow:
1. Sebelum upload dokumen, sistem menampilkan teks consent yang terpisah dari syarat & ketentuan umum: tujuan (verifikasi identitas & penanganan sengketa), pihak yang memproses (DriveO dan/atau vendor e-KYC), dan masa retensi. 

2. Pengguna mencentang persetujuan secara eksplisit (tidak pre-checked). 

3. Sistem menyimpan record consent: user_id, tujuan, versi teks, timestamp, kanal pemberian. 

4. Pada penarikan consent: sistem mencatat penarikan, menampilkan konsekuensi (mis. verifikasi tidak dapat dilanjutkan, akun/booking terdampak), dan mengarahkan ke FR-USER-004 bila pengguna meminta penghapusan data. 

- **Alternative Flow:** Consent diberikan via vendor e-KYC (apabila vendor menjadi pemroses data dan DriveO meminimalkan penyimpanan citra — lihat Bagian H source pack) → sistem tetap mencatat status consent dan referensinya. 

- **Exception:** Pengguna menolak consent → upload dokumen diblokir; alur verifikasi tidak dapat dilanjutkan; pengguna diberi penjelasan, bukan sekadar error. 

- **Postcondition:** Setiap pemrosesan data identitas didasari record consent yang valid dan dapat diaudit; penarikan tercatat.
- **Business Rules:** BR-040; pemetaan regulasi UU PDP di Bagian H source pack (bukan nasihat hukum) — struktur final [LEGAL VALIDATION REQUIRED]. 
- **Dependencies:** FR-VERIFICATION-001, FR-USER-004, FR-AUDIT-001. 
- **Validation Status:** Legal Validation Required (teks consent final dan skema pemroses data menunggu validasi legal). 

### FR-USER-004 — Pengajuan Hapus Data

- **Actor:** Penyewa, Rental/Merchant. 
- **Priority:** High. 
- **Description:** Pengguna dapat mengajukan penghapusan data pribadinya (hak hapus menurut UU PDP). Sistem memproses sesuai masa retensi yang berlaku: data identitas dihapus setelah masa retensi, sedangkan data transaksi yang wajib disimpan untuk keperluan hukum/audit dipertahankan dalam bentuk minimal/anonymized sesuai ketentuan. 
- **Precondition:** Pengguna terautentikasi; tidak ada booking aktif/sengketa terbuka yang membutuhkan data tersebut (atau penghapusan ditunda sampai kewajiban selesai). 
- **Trigger:** Pengguna mengajukan "Hapus Data Saya" dari Pengaturan Privasi. 

#### Main Flow:
1. Pengguna mengajukan penghapusan dan mengonfirmasi pemahaman konsekuensi (akun tidak dapat dipakai untuk verifikasi/booking baru). 

2. Sistem memeriksa kewajiban retensi: booking aktif, sengketa terbuka, kewajiban pajak/hukum. 

3. Jika ada kewajiban yang belum selesai → penghapusan dijadwalkan (ditunda) dan pengguna diberi tahu kapan akan dieksekusi. 

4. Jika tidak ada halangan → sistem menghapus/anonymize data pribadi sesuai kebijakan retensi, mempertahankan hanya data yang wajib disimpan menurut hukum dalam bentuk minimal. 

5. Sistem mencatat pengajuan, keputusan, dan eksekusi ke audit trail; pengguna menerima konfirmasi. 

- **Alternative Flow:** Penarikan consent tanpa penghapusan penuh → sistem menghentikan pemrosesan untuk tujuan tersebut namun mempertahankan data yang masih dibutuhkan untuk kewajiban hukum. 

- **Exception:** Penghapusan diminta saat sengketa terbuka → ditolak sementara dengan penjelasan dan estimasi waktu (status: PENDING_KEWAJIBAN). 

- **Postcondition:** Data pribadi dihapus/dianonymize sesuai ketentuan; record pengajuan teraudit; pengguna menerima bukti penyelesaian. 
- **Business Rules:** BR-038 (retensi data — TBD legal); BR-016 (retensi data verifikasi 90 hari — TBD/Validation Required).
- **Dependencies:** FR-USER-003, FR-AUDIT-001. 
- **Validation Status:** Legal Validation Required. 

### FR-USER-005 — Riwayat Transaksi Penyewa

- **Actor:** Penyewa. 

- **Priority:** High. 

- **Description:** Penyewa dapat melihat seluruh riwayat booking-nya (aktif, selesai, dibatalkan) beserta status pembayaran, tautan ke perjanjian sewa elektronik yang disetujui, dokumentasi serah terima, dan kuitansi/referensi pembayaran, sebagai bukti transaksi dan dasar pengajuan keluhan/sengketa. 

- **Precondition:** Penyewa terautentikasi. 
- **Trigger:** Penyewa membuka "Riwayat / Transaksi Saya". 

- **Main Flow:** 

1. Sistem menampilkan daftar booking milik penyewa, terurut terbaru, dengan status booking dan status pembayaran per booking. 

2. Penyewa memilih satu booking → sistem menampilkan detail: unit, rental, periode, rincian biaya (DP, pelunasan, deposit), referensi pembayaran, perjanjian yang disetujui (versi + waktu), checklist & foto handover/return, dan status refund bila ada. 

3. Setiap event keuangan menampilkan nomor referensi dan timestamp (konsisten dengan prinsip Riwayat Dana, BR-031). 

- **Alternative Flow:** Penyewa mengunduh ringkasan transaksi (format unduhan = [TECHNICAL DECISION REQUIRED], mis. PDF). 
- **Exception:** Booking milik pengguna lain diminta via URL langsung → akses ditolak (otorisasi per-pemilik). 

- **Postcondition:** Penyewa memiliki visibilitas penuh atas riwayat transaksinya. 

- **Business Rules:** BR-031 (riwayat dana immutable + referensi); BR-032 (notifikasi tiap event uang — riwayat ini adalah tampilan pasifnya). 

- **Dependencies:** FR-BOOKING-001, FR-PAYMENT-001, FR-HANDOVER-001. 

- **Validation Status:** Defined. 

## 4.3 RENTAL — Manajemen Merchant
### FR-RENTAL-001 — Registrasi Rental

- **Actor:** Calon Rental/Merchant. 
- **Priority:** Critical. 

- **Description:** Pemilik usaha rental mendaftarkan usahanya sebagai calon mitra DriveO. Berbeda dengan registrasi penyewa, akun rental tidak aktif untuk menerima booking sebelum verifikasi mitra disetujui (FR-RENTAL-002), sehingga marketplace tidak menampilkan rental yang belum terverifikasi. 
- **Precondition:** Pendaftar belum memiliki akun rental aktif dengan identitas usaha yang sama. 
- **Trigger:** Calon rental mengisi form pendaftaran mitra dan menekan "Daftar sebagai Mitra". 

- **Main Flow:** 

1. Calon rental memasukkan data usaha: nama usaha, nama penanggung jawab (PJ), kontak usaha (email/WA), alamat/kota operasional (DIY untuk pilot), dan kata sandi akun. 

2. Sistem memvalidasi format dan keunikan; membuat akun berperan calon RENTAL berstatus MENUNGGU_VERIFIKASI_MITRA; mengirim OTP verifikasi kontak usaha. 

3. Setelah kontak terverifikasi, sistem mengarahkan ke pengunggahan dokumen mitra (FR-RENTAL-002). 

- **Alternative Flow:** Pendaftar sudah memiliki akun penyewa → sistem menawarkan menautkan (link) akun, bukan menggabungkan peran; kedua akun tetap terpisah dengan peran masing-masing (konsisten FR-AUTH-005). 
- **Exception:** Identitas usaha sudah terdaftar aktif → pendaftaran ditolak; pendaftar diarahkan ke CS untuk klaim kepemilikan usaha (anti-duplikasi mitra fiktif). 

- **Postcondition:** Akun calon rental tercatat MENUNGGU_VERIFIKASI_MITRA; belum dapat membuat listing/booking. 

- **Business Rules:** BR-036 (verifikasi mitra prasyarat aktif); BR-040 (consent saat pengumpulan data usaha). 

- **Dependencies:** FR-AUTH-005, FR-RENTAL-002, FR-NOTIFICATION-001. 
- **Validation Status:** Defined. 

### FR-RENTAL-002 — Verifikasi Dokumen Mitra (NIB/Identitas PJ/Dokumen Kendaraan)

- **Actor:** Rental/Merchant (mengunggah); Tim Verifikasi (menilai); Admin (keputusan akhir/blokir). 
- **Priority:** Critical. 
- **Description:** Calon rental mengunggah dokumen kemitraan — identitas penanggung jawab, NIB/izin usaha (verifikasi via OSS), dan dokumen kendaraan (STNK dkk, lihat FR-VEHICLE-004) — untuk dinilai Tim Verifikasi sebelum akun diaktifkan, sesuai Trust Layer lapis 1 (BR-036) dan kewajiban PP 80/2019. 
- **Precondition:** Akun calon rental MENUNGGU_VERIFIKASI_MITRA; kontak usaha terverifikasi. 
- **Trigger:** Calon rental mengunggah paket dokumen dan menekan "Ajukan Verifikasi". 

- **Main Flow:** 

1. Calon rental mengunggah: (a) identitas PJ (KTP), (b) NIB/izin usaha, (c) dokumen kendaraan untuk unit awal — disertai consent eksplisit (BR-040). 

2. Sistem menyimpan terenkripsi (BR-039), membuat tiket verifikasi, dan memberi tahu Tim Verifikasi. 

3. Tim Verifikasi memeriksa kelengkapan, keaslian indikasi awal, dan kesesuaian NIB via OSS; hasilnya: DISETUJUI / DITOLAK (dengan alasan rinci) / BUTUH_KELENGKAPAN. 

4. Jika DISETUJUI → Admin (atau otomatis bila didelegasikan — mekanisme persetujuan = Business Decision Required) mengaktifkan akun menjadi AKTIF_TERVERIFIKASI; rental menerima notifikasi dan dapat membuat listing. 

5. Jika DITOLAK/BUTUH_KELENGKAPAN → rental menerima alasan dan dapat memperbaiki/mengunggah ulang (maksimal pengulangan = Business Decision Required). 

- **Alternative Flow:** Verifikasi identitas PJ memakai vendor e-KYC (OCR + validitas format, BR-014) bila diputuskan untuk mitra juga — PROVIDER TBD. 

- **Exception:** Dokumen terindikasi palsu → BR-033: pengajuan ditolak, akun diblokir, kasus diteruskan ke Admin; pendaftar diberi tahu tanpa membuka detail metode deteksi. 
- **Postcondition:** Rental AKTIF_TERVERIFIKASI (atau tetap menunggu/ditolak dengan alasan tercatat); seluruh penilaian teraudit. 

- **Business Rules:** BR-036; BR-033; BR-039; BR-040. 
- **Dependencies:** FR-RENTAL-001, FR-VEHICLE-004, FR-AUTH-005. 
- **Validation Status:** Legal Validation Required (daftar dokumen final & dasar hukum verifikasi NIB via OSS). 

### FR-RENTAL-003 — Kelola Profil Rental

- **Actor:** Rental/Merchant (pemilik atau staf berhak). 
- **Priority:** High. 

- **Description:** Rental mengelola profil publik usahanya (nama usaha, logo, deskripsi, alamat/kota, jam operasional, kontak layanan, kebijakan antar-jemput) yang tampil di pencarian dan halaman perbandingan, sehingga penyewa mendapat informasi usaha yang akurat. 
- **Precondition:** Rental AKTIF_TERVERIFIKASI; pengguna berhak kelola profil. 
- **Trigger:** Rental mengubah field profil dan menyimpan. 

#### Main Flow:
1. Rental mengubah field profil yang diizinkan. 

2. Sistem memvalidasi format; menyimpan; memperbarui penanda kebaruan (BR-025) karena profil adalah bagian informasi publik. 

3. Perubahan tercatat di audit trail. 

- **Alternative Flow:** Perubahan nama usaha atau alamat kota → memerlukan peninjauan ulang ringan oleh Tim Verifikasi/Admin (mencegah penyamaran identitas usaha); status profil menjadi DALAM_PENINJAUAN sampai disetujui. 
- **Exception:** Konten profil melanggar ketentuan (mis. klaim palsu, kontak di luar kanal resmi untuk mengarahkan off-platform) → Admin dapat menolak perubahan / memberi peringatan (moderasi listing, PP 80/2019). 
- **Postcondition:** Profil publik akurat dan terkini; perubahan sensitif teraudit. 
- **Business Rules:** BR-025; kewajiban moderasi konten (PP 80/2019 — peta regulasi, bukan nasihat hukum). 

- **Dependencies:** FR-RENTAL-001. 
- **Validation Status:** Defined. 

### FR-RENTAL-004 — Kelola Staf Rental (Multi-User)

- **Actor:** Rental/Merchant (pemilik). 
- **Priority:** Medium. 

- **Description:** Pemilik rental mengundang staf dengan akun dan hak terbatas (mis. kelola booking & handover tanpa akses keuangan penuh), sehingga operasional harian dapat didelegasikan tanpa membagikan kredensial pemilik. Cakupan multi-user per tier membership mengikuti keputusan tier (proposal: Pro ke atas). 
- **Precondition:** Rental AKTIF_TERVERIFIKASI; pemilik terautentikasi. 
- **Trigger:** Pemilik mengundang staf via email/nomor WA dan menetapkan peran staf. 
- **Main Flow:** 

1. Pemilik memasukkan kontak staf dan memilih peran: STAFF_OPERASIONAL (booking, handover, return) atau STAFF_KEUANGAN (lihat riwayat dana, tanpa ubah rekening) — matriks rinci di Bagian 12. 

2. Sistem mengirim undangan; staf mendaftar/menautkan akun dan menerima peran STAFF_RENTAL yang terikat pada rental tersebut. 

3. Setiap aksi staf tercatat dengan identitas staf (bukan pemilik) di audit trail. 

4. Pemilik dapat mencabut akses staf kapan pun; pencabutan segera me-revoke sesi staf. 

- **Alternative Flow:** Staf bekerja untuk lebih dari satu rental → satu akun staf dapat terikat ke beberapa rental dengan konteks kerja yang dipilih saat login (FR-AUTH-002 alternative). 
- **Exception:** Upaya staf mengakses fungsi di luar perannya (mis. ubah rekening payout) → ditolak (403) dan dicatat. 

- **Postcondition:** Staf memiliki akses terbatas yang teraudit; pemilik tetap memegang kendali penuh. 
- **Business Rules:** Matriks otorisasi Bagian 12; BR-039 (pencatatan akses). 

- **Dependencies:** FR-AUTH-002, FR-AUTH-005. 

- **Validation Status:** Business Decision Required (tier mana yang mendapat multi-user & jumlah kursi staf — mengikuti keputusan membership; harga TBD). 

### FR-RENTAL-005 — Persetujuan Perjanjian Merchant

- **Actor:** Rental/Merchant (pemilik/PJ). 
- **Priority:** Critical. 

- **Description:** Sebelum akun rental diaktifkan, PJ menyetujui Perjanjian Kemitraan Merchant (hak/kewajiban, komisi, kebijakan payout/refund, larangan disintermediasi, tanggung jawab data) secara digital dengan audit trail, sejajar dengan BR-017 untuk sisi penyewa. 
- **Precondition:** Dokumen mitra dinyatakan lengkap (dalam alur FR-RENTAL-002). 
- **Trigger:** Sistem menampilkan teks perjanjian merchant versi berlaku untuk disetujui. 

- **Main Flow:** 

1. Sistem menampilkan teks perjanjian versi berlaku (dengan nomor versi dan tanggal). 

2. PJ membaca dan mencentang persetujuan eksplisit (tidak pre-checked), lalu menekan "Setujui". 

3. Sistem menyimpan record: rental_id, versi perjanjian, hash teks, timestamp, identitas PJ, kanal persetujuan. 

4. Persetujuan menjadi prasyarat aktivasi akun (FR-RENTAL-002 langkah 4). 

- **Alternative Flow:** Versi perjanjian diperbarui → rental aktif diminta menyetujui ulang versi baru dalam tenggang waktu (tenggang = Business Decision Required); tanpa persetujuan ulang → akun dibatasi sementara (tidak dapat menerima booking baru). 

- **Exception:** PJ menolak perjanjian → akun tidak dapat diaktifkan; pendaftar diberi tahu dan dapat mengajukan banding ke CS.
- **Postcondition:** Ada bukti persetujuan yang sah dan teraudit sebelum rental beroperasi. 

- **Business Rules:** BR-017 (prinsip click-to-accept + audit trail, diterapkan dua sisi); BR-037 (poin anti-disintermediasi menjadi bagian perjanjian). 

- **Dependencies:** FR-RENTAL-002. 
- **Validation Status:** Legal Validation Required (teks perjanjian final menunggu validasi legal). 

### FR-RENTAL-006 — Pengaturan Rekening Payout

- **Actor:** Rental/Merchant (pemilik). 
- **Priority:** Critical. 
- **Description:** Rental mendaftarkan dan memverifikasi rekening bank tujuan payout (BR-008) sebelum payout pertama dapat diproses, dengan verifikasi kepemilikan agar dana tidak salah kirim — titik kritis anti-fraud keuangan. 
- **Precondition:** Rental AKTIF_TERVERIFIKASI; pengguna adalah pemilik (bukan staf). 
- **Trigger:** Pemilik memasukkan data rekening dan meminta verifikasi. 

#### Main Flow:
1. Pemilik memasukkan: bank, nomor rekening, nama pemilik rekening (harus sesuai nama usaha/PJ — aturan kesesuaian = Business Decision Required/Legal). 

2. Sistem memvalidasi format, lalu melakukan verifikasi kepemilikan: uji transfer mikro nominal kecil yang harus dikonfirmasi pemilik, atau verifikasi via PG (metode final = [TECHNICAL DECISION REQUIRED]). 

3. Setelah terverifikasi → rekening berstatus TERVERIFIKASI dan menjadi tujuan payout default. 

4. Perubahan rekening di kemudian hari mengulang verifikasi penuh; selama verifikasi ulang berjalan, payout ditahan sementara dengan notifikasi jelas (BR-032). 

- **Alternative Flow:** Rental memiliki beberapa rekening → satu default + lainnya cadangan (dukungan multi-rekening = Business Decision Required). 

- **Exception:** Nama pemilik rekening tidak sesuai → verifikasi ditolak; rental harus memperbaiki atau menghubungi CS dengan dokumen pendukung. 

- **Postcondition:** Tepat satu rekening terverifikasi menjadi tujuan payout; perubahan teraudit. 
- **Business Rules:** BR-008 (payout H+1); BR-032 (notifikasi tiap event uang — termasuk penahanan payout). 

- **Dependencies:** FR-RENTAL-001; FR-PAYOUT-001 (Bagian 4B). 
- **Validation Status:** Defined (metode verifikasi = Technical Decision Required). 

### FR-RENTAL-007 — Nonaktifkan Rental

- **Actor:** Rental/Merchant (pemilik); Admin (penonaktifan paksa). 

- **Priority:** High. 

- **Description:** Rental menonaktifkan akun usahanya (tutup sementara/permanen) atau Admin menonaktifkan paksa karena pelanggaran, sehingga seluruh listing turun dari marketplace namun kewajiban transaksi berjalan dan riwayat tetap utuh. 

- **Precondition:** Untuk sukarela: tidak ada booking aktif (DALAM_SEWA) yang belum selesai — booking future harus dibatalkan dulu sesuai FR-BOOKING-005. Untuk paksa: keputusan Admin dengan alasan tercatat. 
- **Trigger:** Pemilik menekan "Nonaktifkan Akun" dan mengonfirmasi / Admin mengeksekusi penonaktifan paksa. 

- **Main Flow (sukarela):** 

1. Sistem memeriksa booking aktif/future; jika ada → blokir dengan daftar yang harus diselesaikan. 

2. Jika bersih → status rental NONAKTIF; seluruh listing AKTIF otomatis unpublish (FR-LISTING-003); payout yang sudah terjadwal tetap diproses (hak keuangan tidak hangus). 

3. Event tercatat; penyewa dengan booking future yang dibatalkan mendapat refund sesuai kebijakan. 

- **Main Flow (paksa oleh Admin):** status DIBLOKKIR dengan alasan (mis. dokumen palsu BR-033, dugaan penggelapan BR-023); dana dalam escrow ditahan mengikuti aturan sengketa/mediasi; rental diberi tahu kanal banding via CS. 

- **Alternative Flow:** Reaktivasi → rental mengajukan ulang; dokumen yang kedaluwarsa harus diperbarui; verifikasi ulang ringan oleh Tim Verifikasi. 

- **Exception:** Penonaktifan saat dana DIBEKUKAN_KLAIM → status nonaktif dicatat, namun dana tetap mengikuti hasil mediasi (tidak bisa "kabur" dari klaim dengan menutup akun). 

- **Postcondition:** Rental tidak tampil di marketplace; kewajiban & riwayat tetap terjaga dan teraudit. 

- **Business Rules:** BR-033; BR-023; BR-008 (payout terjadwal tetap jalan); BR-010 (refund dari dana ditahan). 

- **Dependencies:** FR-RENTAL-001, FR-BOOKING-005, FR-LISTING-003. 

- **Validation Status:** Defined. 

## 4.4 VEHICLE — Manajemen Kendaraan
### FR-VEHICLE-001 — Tambah Kendaraan

- **Actor:** Rental/Merchant (pemilik atau staf berhak). 
- **Priority:** Critical. 

- **Description:** Rental mendaftarkan satu unit kendaraan ke katalog armadanya dengan identitas unik (nomor polisi) dan spesifikasi, sebagai prasyarat membuat listing (FR-LISTING-001) dan mengelola ketersediaan. 
- **Precondition:** Rental berstatus AKTIF_TERVERIFIKASI; pengguna memiliki hak kelola kendaraan. 
- **Trigger:** Rental mengisi form "Tambah Kendaraan" dan menyimpan. 

#### Main Flow:
1. Rental memasukkan: nomor polisi (unik per rental), jenis (motor/mobil — pilot DIY), merek, model/tahun, transmisi, 

- kapasitas/BBM (untuk mobil), warna, nomor rangka/mesin (data internal sensitif), dan status awal (TERSEDIA/NONAKTIF). 

2. Sistem memvalidasi format dan keunikan nomor polisi dalam lingkup rental tersebut (duplikat antar rental berbeda dimungkinkan karena armada berbeda — keputusan lingkup unik dicatat di sini). 

3. Sistem membuat record kendaraan berstatus DRAFT_DATA (belum punya dokumen & foto lengkap) dan mencatat event ke audit trail. 
- **Alternative Flow:** Tambah banyak sekaligus (bulk import via template) — termasuk MVP hanya bila diputuskan; jika tidak, Business Decision Required / Future. 
- **Exception:** Nomor polisi sudah terdaftar di rental yang sama → ditolak dengan pesan jelas. Data wajib kosong → validasi per-field. 

- **Postcondition:** Kendaraan tercatat di katalog rental; belum dapat dibuat listing sampai dokumen/foto minimum terpenuhi (aturan di FR-LISTING-001). 

- **Business Rules:** BR-036 (dokumen kendaraan bagian dari verifikasi mitra — kendaraan tanpa dokumen valid tidak boleh tampil di marketplace); retensi data kendaraan mengikuti BR-038 (TBD legal). 
- **Dependencies:** FR-RENTAL-001/002, FR-AUDIT-001. 
- **Validation Status:** Defined. 

### FR-VEHICLE-002 — Ubah Data Kendaraan

- **Actor:** Rental/Merchant (pemilik atau staf berhak). 
- **Priority:** High. 

- **Description:** Rental memperbarui data kendaraan (mis. status operasional, spesifikasi koreksi) dengan perubahan tercatat; perubahan pada atribut yang tampil di listing aktif memicu penanda kebaruan data (BR-025) agar informasi di marketplace tetap jujur. 
- **Precondition:** Kendaraan milik rental yang login; pengguna berhak kelola kendaraan. 
- **Trigger:** Rental mengubah field kendaraan dan menyimpan. 

#### Main Flow:
1. Rental mengubah field yang diizinkan. 

2. Sistem memvalidasi dan menyimpan; mencatat perubahan (field, nilai lama/baru, aktor, waktu) ke audit trail. 

3. Jika kendaraan memiliki listing AKTIF dan field yang berubah tampil di listing (harga diatur di FR-LISTING-002; spesifikasi/foto di sini) → sistem memperbarui timestamp "diperbarui" pada listing terkait (BR-025). 

- **Alternative Flow:** Perubahan nomor polisi → diperlakukan sebagai penggantian identitas unit; sistem meminta konfirmasi eksplisit dan mencatat sebagai event khusus (mencegah manipulasi riwayat). 
- **Exception:** Kendaraan sedang dalam booking aktif (TERKONFIRMASI/DALAM_SEWA) → perubahan atribut operasional kritis (mis. nonaktifkan) dibatasi/diperingatkan; sistem mencegah perubahan yang merusak booking berjalan. 
- **Postcondition:** Data kendaraan terkini; perubahan teraudit; penanda kebaruan listing diperbarui bila relevan. 
- **Business Rules:** BR-025; BR-027 (jika perubahan menandai pembaruan, listing tidak dianggap basi). 

- **Dependencies:** FR-VEHICLE-001, FR-LISTING-001. 

- **Validation Status:** Defined. 

### FR-VEHICLE-003 — Upload Foto Kendaraan

- **Actor:** Rental/Merchant (pemilik atau staf berhak). 
- **Priority:** High. 
- **Description:** Rental mengunggah foto unit (eksterior, interior, detail) yang menjadi foto resmi listing, dengan validasi file dan penyimpanan aman, karena foto adalah bukti kondisi awal pada sengketa kerusakan (BR-019) dan materi perbandingan (P1).
- **Precondition:** Kendaraan milik rental; pengguna berhak kelola kendaraan. 
- **Trigger:** Rental mengunggah satu/lebih file foto pada halaman kendaraan. 

#### Main Flow:
1. Rental memilih file foto. 

2. Sistem memvalidasi: tipe file gambar yang diizinkan, ukuran maksimum, dan pemindaian dasar malware ([TECHNICAL DECISION REQUIRED] untuk daftar tipe/batas). 

3. File disimpan di object storage dengan akses terkontrol; metadata (timestamp upload, uploader) dicatat. 

4. Rental menetapkan satu foto sebagai foto utama; urutan foto dapat diatur. 

- **Alternative Flow:** Ganti/hapus foto → foto lama diarsipkan (tidak dihapus permanen selama masa retensi bukti) dan penggantian tercatat. 
- **Exception:** File tidak valid/terlalu besar → ditolak dengan pesan jelas; tidak ada file parsial yang tersimpan sebagai foto resmi.
- **Postcondition:** Kendaraan memiliki foto resmi berversi; siap menjadi materi listing. 

- **Business Rules:** Aturan keamanan file mengikuti Bagian 14 (validasi tipe/ukuran, storage terenkripsi); BR-019 (foto sebagai dasar klaim — foto resmi menjadi pembanding). 
- **Dependencies:** FR-VEHICLE-001; integrasi object storage (Bagian 10.5).
- **Validation Status:** Defined. 

### FR-VEHICLE-004 — Kelola Dokumen Kendaraan

- **Actor:** Rental/Merchant (pemilik atau staf berhak); Tim Verifikasi (melihat/menilai). 
- **Priority:** Critical. 
- **Description:** Rental mengunggah dan memperbarui dokumen kendaraan (STNK, dan dokumen lain yang dipersyaratkan — daftar final [LEGAL VALIDATION REQUIRED]) sebagai bagian verifikasi mitra (BR-036). Dokumen kedaluwarsa memicu peringatan dan dapat 

menonaktifkan listing sampai diperbarui, karena unit tanpa dokumen valid tidak boleh disewakan via platform. 
- **Precondition:** Kendaraan milik rental; untuk penilaian: Tim Verifikasi terautentikasi. 
- **Trigger:** (a) Rental mengunggah/memperbarui dokumen. (b) Sistem mendeteksi masa berlaku dokumen akan/habis. 

- **Main Flow:** 

1. Rental mengunggah dokumen per jenis yang dipersyaratkan, beserta tanggal terbit dan masa berlaku bila ada. 

2. Sistem menyimpan terenkripsi dengan akses RBAC; mencatat event upload. 

3. Tim Verifikasi menilai dokumen (setuju/tolak dengan alasan) sebagai bagian FR-RENTAL-002. 

4. Scheduler memeriksa masa berlaku: H-menjelang kedaluwarsa (ambang = [TECHNICAL DECISION REQUIRED]) → notifikasi ke rental; jika kedaluwarsa → listing aktif unit tersebut otomatis di-unpublish sementara sampai dokumen diperbarui. 

- **Alternative Flow:** Dokumen ditolak → rental mengunggah ulang; riwayat penolakan tersimpan. 
- **Exception:** Dokumen terindikasi palsu → BR-033 (tolak/blokir) berlaku; kasus diteruskan ke Admin. 

- **Postcondition:** Setiap kendaraan aktif memiliki dokumen valid yang terverifikasi; dokumen kedaluwarsa tidak bisa lolos ke marketplace. 
- **Business Rules:** BR-036; BR-033; BR-039 (akses dokumen sensitif RBAC + pencatatan akses). 
- **Dependencies:** FR-VEHICLE-001, FR-RENTAL-002, FR-NOTIFICATION-001. 
- **Validation Status:** Legal Validation Required (daftar dokumen final dan perlakuan dokumen kedaluwarsa menunggu validasi legal). 

### FR-VEHICLE-005 — Nonaktifkan Kendaraan

- **Actor:** Rental/Merchant (pemilik atau staf berhak). 

- **Priority:** High. 

- **Description:** Rental menonaktifkan unit (mis. perawatan, dijual) sehingga tidak dapat di-booking dan listing-nya turun dari marketplace, tanpa menghapus riwayat transaksi unit tersebut. 

- **Precondition:** Kendaraan milik rental; tidak ada booking aktif yang memakai unit pada periode penonaktifan (atau rental menyelesaikan/membatalkan booking terdampak dulu sesuai kebijakan pembatalan). 
- **Trigger:** Rental menekan "Nonaktifkan" pada kendaraan dan mengonfirmasi. 

- **Main Flow:** 

1. Rental memilih kendaraan dan alasan penonaktifan (perawatan/dijual/lainnya). 

2. Sistem memeriksa booking aktif/future yang memakai unit: jika ada → proses diblokir dengan daftar booking terdampak; rental harus menangani booking tersebut dulu (FR-BOOKING-005/006). 

3. Jika bersih → status kendaraan menjadi NONAKTIF; listing aktif terkait otomatis di-unpublish (FR-LISTING-003); event tercatat. 

- **Alternative Flow:** Nonaktif sementara dengan tanggal reaktivasi → scheduler mengaktifkan kembali otomatis pada tanggal tersebut. 
- **Exception:** Upaya nonaktif saat booking DALAM_SEWA memakai unit → ditolak mutlak. 
- **Postcondition:** Unit tidak dapat di-booking; riwayat tetap utuh; listing turun dari pencarian. 

- **Business Rules:** BR-027 (konsistensi dengan aturan listing basi — unit nonaktif tidak dihitung dalam peringkat).
- **Dependencies:** FR-VEHICLE-001, FR-BOOKING-001, FR-LISTING-003. 

- **Validation Status:** Defined. 

## 4.5 LISTING — Tampilan Sewa di Marketplace
### FR-LISTING-001 — Buat Listing dari Kendaraan

- **Actor:** Rental/Merchant (pemilik atau staf berhak). 
- **Priority:** Critical. 

- **Description:** Rental membuat listing sewa dari satu kendaraan terdaftar, yaitu representasi publik unit tersebut di marketplace (judul, deskripsi, syarat sewa, foto). Listing adalah prasyarat unit dapat ditemukan di pencarian; kendaraan tanpa listing tidak tampil di marketplace. 

- **Precondition:** Kendaraan milik rental, berstatus aktif, memiliki foto minimum (jumlah minimum = [TECHNICAL DECISION REQUIRED]/Business Decision Required) dan dokumen valid (FR-VEHICLE-004). 
- **Trigger:** Rental memilih kendaraan dan menekan "Buat Listing". 

- **Main Flow:** 

1. Rental memilih kendaraan sumber (satu kendaraan → satu listing aktif; relasi 1:1 untuk MVP — keputusan desain dicatat di sini). 

2. Rental mengisi: judul, deskripsi, syarat sewa (mis. usia minimum, area pakai — nilai syarat mengikuti template perjanjian; syarat final [LEGAL VALIDATION REQUIRED]), dan memilih foto dari FR-VEHICLE-003. 

3. Sistem membuat listing berstatus DRAFT dan memvalidasi kelengkapan. 

4. Setelah harga diatur (FR-LISTING-002), rental dapat mem-publish (FR-LISTING-003). 

- **Alternative Flow:** Duplikat listing dari kendaraan sejenis → sistem menyalin field non-unik; harga dan foto harus ditetapkan ulang. 

- **Exception:** Kendaraan belum memenuhi prasyarat (foto/dokumen kurang) → pembuatan listing diblokir dengan daftar kekurangan yang jelas. 

- **Postcondition:** Listing DRAFT tercatat dan siap diberi harga lalu di-publish. 

- **Business Rules:** BR-036 (dokumen valid prasyarat tampil); syarat sewa harus konsisten dengan perjanjian elektronik (BR-017) — teks final [LEGAL VALIDATION REQUIRED]. 
- **Dependencies:** FR-VEHICLE-001/003/004, FR-LISTING-002, FR-LISTING-003. 
- **Validation Status:** Defined (dengan catatan legal untuk syarat sewa). 

### FR-LISTING-002 — Atur Harga (Tarif + Deposit + Antar-Jemput)

- **Actor:** Rental/Merchant (pemilik atau staf berhak). 

- **Priority:** Critical. 

- **Description:** Rental menetapkan struktur harga listing: tarif sewa per periode, nominal deposit, dan biaya antar-jemput (bila ada), sehingga harga all-in (BR-026) dapat ditampilkan jujur di pencarian/perbandingan dan dipakai menghitung DP serta pelunasan.
- **Precondition:** Listing DRAFT milik rental; pengguna berhak kelola listing. 
- **Trigger:** Rental mengisi form harga dan menyimpan. 

- **Main Flow:** 

1. Rental memasukkan: tarif per hari (wajib; satuan periode lain = [TECHNICAL DECISION REQUIRED]/Business Decision Required), nominal deposit (wajib; besaran mengikuti kebijakan rental — panduan besaran [VALIDATION REQUIRED] bila proposal menetapkannya), biaya antar-jemput per titik/layanan (opsional). 

2. Sistem memvalidasi: semua nominal > 0 (kecuali antar-jemput boleh 0 bila gratis), format mata uang IDR. 

3. Sistem menghitung dan menampilkan pratinjau harga all-in (BR-026) serta simulasi DP berdasarkan persentase DP yang berlaku (BR-001 — persentase TBD). 

4. Perubahan harga pada listing AKTIF: berlaku untuk booking baru; booking yang sudah dibuat memakai harga saat booking dibuat (prinsip immutability harga per booking). 

- **Alternative Flow:** Harga musiman/promo per tanggal — termasuk MVP hanya bila diputuskan; jika tidak, Business Decision Required / Future. 

- **Exception:** Nominal tidak valid → ditolak per-field. Persentase DP belum ditetapkan (TBD) → simulasi DP menampilkan penanda TBD, bukan angka karangan. 
- **Postcondition:** Listing memiliki struktur harga lengkap dan valid; harga all-in dapat ditampilkan. 
- **Business Rules:** BR-026 (harga all-in); BR-001 (besaran DP TBD — simulasi tidak boleh mengarang angka). 

- **Dependencies:** FR-LISTING-001. 
- **Validation Status:** Defined (besaran deposit & DP mengikuti status validasinya masing-masing). 

### FR-LISTING-003 — Publish / Unpublish

- **Actor:** Rental/Merchant (pemilik atau staf berhak). 
- **Priority:** Critical. 

- **Description:** Rental menerbitkan listing DRAFT ke marketplace (publish) atau menariknya sementara (unpublish) tanpa menghapus data, sehingga rental mengontrol kapan unitnya dapat di-booking. 

- **Precondition:** Untuk publish: listing DRAFT lengkap (data, foto, harga, dokumen kendaraan valid). Untuk unpublish: listing berstatus AKTIF. 
- **Trigger:** Rental menekan "Publish" / "Unpublish" dan mengonfirmasi. 

#### Main Flow (Publish):
1. Sistem menjalankan pemeriksaan kelengkapan akhir (checklist prasyarat). 

2. Jika lolos → status listing menjadi AKTIF, tercatat waktu publish, dan unit mulai tampil di pencarian. 

3. Sistem mencatat event ke audit trail. 

#### Main Flow (Unpublish):
1. Rental mengonfirmasi unpublish (dengan alasan opsional). 

2. Status menjadi NONAKTIF_SEMENTARA; listing hilang dari pencarian; booking yang sudah berjalan tidak terganggu. 
- **Alternative Flow:** Publish terjadwal (aktif pada tanggal tertentu) — termasuk MVP hanya bila diputuskan; jika tidak, Business Decision Required. 

- **Exception:** Pemeriksaan kelengkapan gagal → publish diblokir dengan daftar kekurangan. Unpublish saat unit DALAM_SEWA → listing disembunyikan untuk booking baru, booking berjalan tetap valid (bukan dibatalkan). 

- **Postcondition:** Status listing akurat; marketplace hanya menampilkan listing AKTIF yang memenuhi syarat. 
- **Business Rules:** BR-036; BR-027 (listing yang lama tidak diperbarui diperlakukan sebagai basi). 

- **Dependencies:** FR-LISTING-001, FR-LISTING-002, FR-VEHICLE-004. 
- **Validation Status:** Defined. 

### FR-LISTING-004 — Freshness Listing (Penanda Waktu & Penurunan Peringkat Listing Basi)

- **Actor:** Sistem (Background Scheduler); Penyewa (melihat penanda). 
- **Priority:** High. 

- **Description:** Setiap listing AKTIF membawa penanda waktu pembaruan ("diperbarui X menit/jam lalu") yang tampil di hasil pencarian (BR-025), dan listing yang lama tidak diperbarui otomatis turun peringkat serta berlabel "basi" (BR-027), sehingga masalah P1 (informasi tidak jujur/ketinggalan) teratasi secara sistemik, bukan mengandalkan kedisiplinan rental. 

- **Precondition:** Listing berstatus AKTIF. 

- **Trigger:** (a) Setiap kali listing/ketersediaan/harga diperbarui → timestamp diperbarui. (b) Scheduler berjalan periodik (interval = [TECHNICAL DECISION REQUIRED]). 

- **Main Flow:** 

1. Setiap pembaruan pada listing, harga, foto, atau kalender ketersediaan memperbarui `last_updated_at` listing. 

2. Scheduler mengevaluasi usia `last_updated_at` : melewati ambang basi (ambang = [VALIDATION REQUIRED]/Business Decision Required, TBD) → listing diberi label "perlu pembaruan" dan bobot peringkatnya diturunkan di hasil pencarian. 

3. Rental menerima notifikasi peringatan sebelum dan saat listing dilabeli basi, dengan ajakan memperbarui kalender/harga. 

4. Saat rental memperbarui → label basi hilang dan peringkat pulih. 

- **Alternative Flow:** Rental menandai "tidak ada perubahan, data masih akurat" (konfirmasi freshness tanpa mengubah data) → timestamp diperbarui; disalahgunakan berulang → terdeteksi sebagai pola dan dapat ditinjau Admin (anti-gaming). 

- **Exception:** Scheduler gagal berjalan → kegagalan dicatat dan di-alert ke tim operasional; penanda waktu tetap tampil apa adanya (tidak dikarang). 

- **Postcondition:** Hasil pencarian selalu jujur soal kebaruan data; listing basi tidak mendapat visibilitas setara listing terawat.
- **Business Rules:** BR-025; BR-027. 
- **Dependencies:** FR-LISTING-001, FR-SEARCH-001, FR-NOTIFICATION-001. 
- **Validation Status:** Validation Required (ambang usia "basi" belum divalidasi — TBD). 

### FR-LISTING-005 — Arsip Listing

- **Actor:** Rental/Merchant (pemilik). 
- **Priority:** Medium. 

- **Description:** Rental mengarsipkan listing yang sudah tidak dipakai (mis. unit dijual permanen) sehingga keluar dari manajemen aktif namun riwayat booking-nya tetap dapat diaudit; arsip berbeda dari unpublish sementara (FR-LISTING-003) dan dari nonaktif kendaraan (FR-VEHICLE-005). 
- **Precondition:** Listing milik rental; tidak ada booking aktif/future pada listing tersebut. 
- **Trigger:** Rental memilih "Arsipkan" dan mengonfirmasi. 

#### Main Flow:
1. Sistem memeriksa tidak ada booking aktif/future. 

2. Status listing menjadi ARSIP; tidak tampil di pencarian maupun dashboard aktif (masuk tab arsip). 

3. Event tercatat di audit trail. 

- **Alternative Flow:** Kembalikan dari arsip → status kembali DRAFT (harus melewati pemeriksaan kelengkapan ulang sebelum publish). 
- **Exception:** Masih ada booking future → pengarsipan diblokir sampai booking diselesaikan/dibatalkan. 

- **Postcondition:** Listing terarsip; riwayat utuh dan tetap dapat diaudit. 
- **Business Rules:** Prinsip non-destruktif: arsip tidak menghapus data (konsisten dengan kebutuhan audit & sengketa). 

- **Dependencies:** FR-LISTING-003, FR-BOOKING-001. 

- **Validation Status:** Defined. 

## 4.6 SEARCH — Pencarian & Penemuan
### FR-SEARCH-001 — Pencarian

- **Actor:** Penyewa (termasuk pengunjung belum login untuk tahap discovery). 
- **Priority:** Critical. 

- **Description:** Pengunjung/penyewa mencari unit sewa berdasarkan lokasi, tanggal sewa, dan jenis kendaraan, dan menerima daftar listing AKTIF yang ketersediaannya cocok dengan tanggal diminta, masing-masing dengan harga all-in dan penanda kebaruan data.
- **Precondition:** Minimal input: lokasi (default DIY untuk pilot) dan rentang tanggal; jenis kendaraan opsional. 
- **Trigger:** Pengguna memasukkan kriteria dan menekan "Cari". 

#### Main Flow:
1. Pengguna memasukkan lokasi, tanggal mulai–selesai, dan (opsional) jenis kendaraan. 

2. Sistem memvalidasi tanggal (mulai < selesai; tidak di masa lalu). 

3. Sistem mengambil listing AKTIF yang slot tanggalnya tidak bentrok dengan booking yang mengunci slot (BR-028) pada rental di lokasi tersebut. 

4. Setiap hasil menampilkan: foto utama, judul, nama rental + status verifikasi, rating, harga all-in (BR-026), dan penanda "diperbarui X lalu" (BR-025). 

5. Hasil diurutkanตาม default (aturan sorting default = [VALIDATION REQUIRED]/Business Decision Required; tidak boleh mengarang bahwa "termurah selalu di atas" bila belum diputuskan). 
- **Alternative Flow:** Pencarian tanpa tanggal → sistem menampilkan listing AKTIF dengan label bahwa ketersediaan tanggal belum dicek; pengguna didorong mengisi tanggal sebelum booking. 
- **Exception:** Tanggal tidak valid → ditolak dengan pesan jelas. Tidak ada hasil → sistem menampilkan pesan jujur + saran (ubah tanggal/lokasi), bukan hasil karangan. 
- **Postcondition:** Pengguna mendapat daftar hasil yang jujur soal ketersediaan, harga all-in, dan kebaruan data. 
- **Business Rules:** BR-025; BR-026; BR-027 (listing basi turun peringkat); BR-028 (slot terkunci tidak tampil sebagai tersedia). 
- **Dependencies:** FR-LISTING-003, FR-BOOKING-001 (penguncian slot), FR-LISTING-004. 
- **Validation Status:** Defined (aturan sorting default menunggu keputusan — Business Decision Required). 

### FR-SEARCH-002 — Filter

- **Actor:** Penyewa/pengunjung. 
- **Priority:** High. 
- **Description:** Pengguna mempersempit hasil pencarian dengan filter yang didukung proposal: jenis kendaraan, rentang harga all-in, status verifikasi rental, rating minimum, dan fitur/transmisi, sehingga perbandingan (P1) dapat dilakukan secara adil. 
- **Precondition:** Hasil pencarian tersedia (FR-SEARCH-001). 
- **Trigger:** Pengguna memilih/mengubah kriteria filter. 

#### Main Flow:
1. Pengguna memilih satu/lebih filter dari daftar yang tersedia. 

2. Sistem menerapkan filter ke himpunan hasil secara konsisten (semua filter bersifat AND antar kategori). 

3. Hasil yang tidak memenuhi disembunyikan; jumlah hasil diperbarui. 

- **Alternative Flow:** Kombinasi filter menghasilkan nol hasil → sistem memberi tahu filter mana yang paling restriktif (bila dapat dihitung tanpa mengarang) dan menawarkan melonggarkan. 
- **Exception:** Nilai filter tidak valid (mis. harga min > max) → sistem mengoreksi/menolak dengan pesan jelas. 
- **Postcondition:** Hasil tersaring sesuai kriteria; pengguna memahami mengapa hasil berkurang. 
- **Business Rules:** Filter harga memakai harga all-in (BR-026), bukan tarif dasar saja. 

- **Dependencies:** FR-SEARCH-001. 

- **Validation Status:** Defined. Daftar filter final di atas adalah yang didukung proposal (P1); filter tambahan (mis. berdasarkan fitur ML) = Future/Out of scope. 

### FR-SEARCH-003 — Sorting

- **Actor:** Penyewa/pengunjung. 
- **Priority:** Medium. 
- **Description:** Pengguna mengurutkan hasil pencarian berdasarkan opsi yang tersedia (mis. harga terendah/tertinggi, rating tertinggi, paling baru diperbarui), dengan opsi default yang ditetapkan sebagai keputusan bisnis. 
- **Precondition:** Hasil pencarian tersedia. 
- **Trigger:** Pengguna memilih opsi sorting. 

#### Main Flow:
1. Pengguna memilih opsi dari daftar yang tersedia. 

2. Sistem mengurutkan ulang hasil sesuai opsi; penanda kebaruan tetap tampil (BR-025) apa pun urutannya. 
- **Alternative Flow:** — (tidak ada; sorting bersifat deterministik). 
- **Exception:** Opsi sorting tidak dikenal (parameter manipulasi) → sistem kembali ke default dan mencatat anomali bila berulang. 

- **Postcondition:** Hasil terurut sesuai pilihan pengguna. 

- **Business Rules:** BR-025 (penanda kebaruan tidak boleh disembunyikan oleh sorting); opsi sorting yang memengaruhi visibilitas berbayar (paid listing) = Future, bukan MVP (lihat scope). 

- **Dependencies:** FR-SEARCH-001. 
- **Validation Status:** Business Decision Required (daftar opsi final dan default menunggu keputusan bisnis). 

### FR-SEARCH-004 — Tampilan Ketersediaan & Penanda Kebaruan

- **Actor:** Penyewa/pengunjung. 

- **Priority:** High. 

- **Description:** Pada setiap hasil pencarian dan halaman detail listing, sistem menampilkan status ketersediaan untuk tanggal yang diminta dan penanda kebaruan data ("diperbarui X menit/jam lalu"), sehingga pengguna dapat menilai kepercayaan informasi sebelum booking (inti P1 & P2). 
- **Precondition:** Listing AKTIF ditampilkan sebagai hasil atau detail. 
- **Trigger:** Hasil pencarian di-render / halaman detail listing dibuka. 

- **Main Flow:** 

1. Sistem menghitung ketersediaan: tanggal diminta vs slot yang dikunci booking (BR-028) vs penanda non-platform (bila rental mencatatnya). 

2. Sistem menampilkan status: TERSEDIA / SEBAGIAN (bila rentang tanggal hanya cocok sebagian — perilaku tepat = [TECHNICAL DECISION REQUIRED]) / TIDAK_TERSEDIA, beserta penanda "diperbarui X lalu" (BR-025) dan label basi bila berlaku (BR-027). 

3. Jika rental mencatat order non-platform pada tanggal tersebut (BR-029), tanggal tersebut ditampilkan tidak tersedia dengan penanda sumber "dicatat rental". 

- **Alternative Flow:** Pengguna melihat tanggal di luar cakupan kalender rental → sistem menampilkan "ketersediaan belum dikonfirmasi rental" (jujur, bukan diasumsikan tersedia). 

- **Exception:** Data ketersediaan gagal dimuat → sistem menampilkan status "tidak dapat memastikan" dan menyarankan hubungi rental/CS; tidak menampilkan "tersedia" palsu. 
- **Postcondition:** Pengguna melihat status ketersediaan yang jujur dan dapat diverifikasi. 

- **Business Rules:** BR-025; BR-027; BR-028; BR-029. 

- **Dependencies:** FR-SEARCH-001, FR-LISTING-004, FR-BOOKING-001. 

- **Validation Status:** Defined. 

## 4.7 BOOKING — Pemesanan
### FR-BOOKING-001 — Buat Booking & Kunci Slot

- **Actor:** Penyewa. 

- **Priority:** Critical. 

- **Description:** Penyewa membuat booking untuk satu unit pada rentang tanggal tertentu; pada saat yang sama sistem mengunci slot tanggal tersebut (BR-028) agar tidak terjadi double booking, lalu menerbitkan kewajiban pembayaran DP sebagai langkah berikut.
- **Precondition:** Penyewa terautentikasi; listing AKTIF; slot tanggal tersedia (tidak dikunci booking lain, tidak ditandai non-platform). 

- **Trigger:** Penyewa memilih tanggal, melihat ringkasan biaya, menyetujui perjanjian sewa elektronik (BR-017 — persetujuan SEBELUM pembayaran), lalu menekan "Booking Sekarang". 

- **Main Flow:** 

1. Penyewa memilih tanggal mulai–selesai dan titik antar-jemput (bila ada). 

2. Sistem menampilkan ringkasan: tarif × durasi, deposit, biaya antar-jemput, total all-in (BR-026), nominal DP (BR-001 — tampil sebagai TBD/belum final bila persentase belum ditetapkan; sistem TIDAK mengarang angka), dan teks perjanjian sewa elektronik versi berlaku. 

3. Penyewa mencentang persetujuan perjanjian (click-to-accept; BR-017) — wajib sebelum lanjut. 

4. Sistem membuat booking (BookingState=MENUNGGU_DP, EscrowState=MENUNGGU_DANA), mengunci slot tanggal unit tersebut (BR-028), dan mencatat event booking_created (FR-AUDIT-001). 

5. Sistem menerbitkan link pembayaran DP (FR-BOOKING-002). 

- **Alternative Flow:** Penyewa memilih opsi "Bayar Penuh di Awal" (opt-in, BR-003) → nominal menjadi 100% dan booking mendapat penanda prioritas konfirmasi; alur berikutnya sama. 

- **Exception:** Slot baru saja dikunci pihak lain (race condition) → booking gagal dibuat dengan pesan "unit baru saja dipesan"; tidak ada slot ganda. Persetujuan perjanjian belum dicentang → tombol booking nonaktif; sistem tidak mengizinkan bypass. 

- **Postcondition:** Booking MENUNGGU_DP tercatat; slot terkunci; link DP tersedia; audit trail memiliki booking_created + persetujuan perjanjian (siapa/kapan/versi). 

- **Business Rules:** BR-001; BR-003; BR-017; BR-026; BR-028; BR-037 (proteksi hanya untuk transaksi on-platform — booking ini adalah titik masuk proteksi). 

- **Dependencies:** FR-LISTING-003, FR-SEARCH-004, FR-BOOKING-002, FR-AUDIT-001. 

- **Validation Status:** Defined (besaran DP TBD — lihat BR-001). 

### FR-BOOKING-002 — Penerbitan Link Pembayaran DP

- **Actor:** Sistem (atas permintaan Penyewa). 
- **Priority:** Critical. 

- **Description:** Setelah booking dibuat, sistem menerbitkan link pembayaran DP via payment gateway dengan masa kedaluwarsa X menit (BR-005 — TBD), sehingga penyewa dapat membayar dan slot yang dikunci memiliki batas waktu yang jelas. 

- **Precondition:** Booking berstatus MENUNGGU_DP; belum ada pembayaran DP BERHASIL untuk booking tersebut. 
- **Trigger:** Booking dibuat (otomatis) atau penyewa menekan "Bayar DP" pada booking yang masih MENUNGGU_DP. 

#### Main Flow:
1. Sistem membuat payment record DP (PaymentState=CREATED → MENUNGGU) dan meminta pembuatan link bayar ke PG (nominal = DP sesuai BR-001). 

2. Sistem menampilkan link/QRIS dan hitung mundur masa berlaku (X menit — TBD, BR-005) kepada penyewa. 

3. Sistem mengirim notifikasi berisi link dan batas waktu (BR-032). 

- **Alternative Flow:** Penyewa meminta link baru saat link lama masih berlaku → sistem memakai kembali link yang sama (tidak membuat payment record ganda) selama belum kedaluwarsa. 

- **Exception:** PG gagal membuat link → payment record GAGAL; sistem menampilkan pesan dan tombol "Coba Lagi"; booking tetap MENUNGGU_DP sampai batas kedaluwarsa globalnya (bukan batas link semata) — definisi batas global = [TECHNICAL DECISION REQUIRED] namun tidak boleh melebihi X menit BR-005 secara logika. 

- **Postcondition:** Link DP aktif dengan masa berlaku jelas; payment record tercatat. 

- **Business Rules:** BR-001; BR-005; BR-032. 
- **Dependencies:** FR-BOOKING-001, FR-PAYMENT-001, integrasi PG (Bagian 10.1). 
- **Validation Status:** Validation Required (X menit TBD). 

### FR-BOOKING-003 — Kedaluwarsa Otomatis Booking

- **Actor:** Sistem (Background Scheduler). 
- **Priority:** Critical. 

- **Description:** Booking yang tidak dibayar DP-nya dalam X menit (BR-005) otomatis dibatalkan (BookingState=KEDALUWARSA), slot dibuka kembali, dan penyewa/rental diberi tahu, sehingga slot tidak terkunci selamanya oleh booking yang tidak diselesaikan.
- **Precondition:** Booking berstatus MENUNGGU_DP melewati batas X menit tanpa pembayaran DP BERHASIL. 
- **Trigger:** Scheduler mendeteksi booking melewati batas waktu. 

#### Main Flow:
1. Scheduler menandai booking KEDALUWARSA dan payment record terkait KEDALUWARSA. 

2. Slot tanggal unit dibuka kembali (kunci dilepas). 

3. Sistem mengirim notifikasi ke penyewa ("booking kedaluwarsa, silakan buat ulang") dan ke rental (slot kembali tersedia). 

4. Event tercatat di audit trail. 

- **Alternative Flow:** Pembayaran webhook tiba tepat di batas waktu (race) → prinsip: pembayaran yang sudah BERHASIL di PG sebelum eksekusi scheduler dimenangkan oleh pembayaran (idempotency & rekonsiliasi di FR-PAYMENT-001); booking lanjut ke MENUNGGU_KONFIRMASI_RENTAL. 

- **Exception:** Scheduler gagal berjalan → alert ke operasional; saat scheduler pulih, booking yang lewat batas diproses dengan timestamp kedaluwarsa yang benar (bukan waktu pemulihan). 

- **Postcondition:** Tidak ada booking MENUNGGU_DP yang menggantung melewati batas; slot selalu kembali tersedia.
- **Business Rules:** BR-005. 
- **Dependencies:** FR-BOOKING-001, FR-BOOKING-002, FR-PAYMENT-001. 

- **Validation Status:** Validation Required (X menit TBD). 

### FR-BOOKING-004 — Pembatalan oleh Penyewa

- **Actor:** Penyewa. 
- **Priority:** High. 

- **Description:** Penyewa membatalkan booking-nya sendiri; konsekuensi refund mengikuti kebijakan refund bertingkat berdasarkan H-berapa (BR-011 — TBD) bila DP sudah dibayar, atau tanpa konsekuensi finansial bila DP belum dibayar. 

- **Precondition:** Booking milik penyewa; status masih dapat dibatalkan (MENUNGGU_DP, MENUNGGU_KONFIRMASI_RENTAL, atau TERKONFIRMASI sebelum handover dimulai — batas akhir pembatalan = [LEGAL VALIDATION REQUIRED]/Business Decision Required). 
- **Trigger:** Penyewa menekan "Batalkan Booking" dan mengonfirmasi beserta alasan. 

#### Main Flow:
1. Penyewa mengonfirmasi pembatalan dengan alasan (wajib pilih kategori alasan — untuk analitik sengketa). 

2. Sistem mengubah BookingState menjadi DIBATALKAN (alasan=penyewa). 

3. Jika DP sudah dibayar (EscrowState=DITAHAN_ESCROW): sistem menghitung refund menurut BR-011 (tingkat berdasarkan H- berapa — TBD; sampai ditetapkan, sistem memakai tabel kebijakan yang dikonfigurasi dan menampilkan perhitungannya 

secara transparan, bukan mengarang di kode). 

4. Slot dibuka kembali; notifikasi ke rental; event tercatat. 

- **Alternative Flow:** Pembatalan setelah melewati batas akhir → sistem menolak dan mengarahkan ke alur sengketa/CS (bukan pembatalan sepihak). 

- **Exception:** Refund gagal diproses PG → FR-REFUND mengikuti aturan refund failure (Bagian 13); booking tetap DIBATALKAN namun kewajiban refund tercatat sebagai utang yang harus diselesaikan (EscrowState=DIREFUND_SEBAGIAN/PENUH tertunda — status penyelesaian refund eksplisit). 

- **Postcondition:** Booking DIBATALKAN; slot bebas; refund (bila ada) diproses/transparan. 

- **Business Rules:** BR-010 (refund hanya dari dana ditahan — platform tidak menalangi); BR-011 (bertingkat, TBD); BR-012 tidak berlaku di sini (itu untuk pembatalan oleh rental). 
- **Dependencies:** FR-BOOKING-001, FR-PAYMENT-001, FR-REFUND-001 (modul 5.24). 

- **Validation Status:** Business Decision Required (tabel refund bertingkat TBD) + Legal Validation Required (batas akhir & klausul). 

### FR-BOOKING-005 — Pembatalan oleh Rental

- **Actor:** Rental/Merchant. 
- **Priority:** High. 

- **Description:** Rental membatalkan booking yang sudah dikonfirmasi/dibayar karena alasan operasional (mis. unit rusak mendadak); penyewa mendapat refund PENUH (BR-012), rental mendapat penalti reputasi, dan sistem membantu realokasi ke unit/rental lain bila memungkinkan. 

- **Precondition:** Booking berstatus MENUNGGU_KONFIRMASI_RENTAL atau TERKONFIRMASI (belum handover); rental pemilik booking. 
- **Trigger:** Rental menekan "Batalkan Booking" dengan alasan operasional dan mengonfirmasi. 

#### Main Flow:
1. Rental memilih alasan pembatalan (wajib; kategori operasional). 

2. Sistem mengubah BookingState menjadi DIBATALKAN (alasan=rental). 

3. Jika ada dana ditahan (DP/pelunasan): refund PENUH ke penyewa dari dana yang ditahan (BR-010, BR-012). 

4. Sistem mencatat penalti reputasi pada profil rental (BR-012; mekanisme penalti = Business Decision Required — TBD apakah berupa skor, label, atau penurunan peringkat). 

5. Sistem menawarkan realokasi: menampilkan unit/rental alternatif yang tersedia pada tanggal sama kepada penyewa (bantuan realokasi — kedalaman fitur = Business Decision Required). 

6. Notifikasi ke penyewa (refund + opsi realokasi); event tercatat. 

- **Alternative Flow:** Pembatalan karena force majeure yang terdokumentasi → penalti reputasi dapat ditinjau/dikecualikan oleh Admin (mekanisme pengecualian = Business Decision Required). 
- **Exception:** Upaya pembatalan saat DALAM_SEWA → ditolak; dialihkan ke alur sengketa. 
- **Postcondition:** Penyewa menerima refund penuh; rental tercatat melakukan pembatalan sepihak; slot bebas. 
- **Business Rules:** BR-010; BR-012. 
- **Dependencies:** FR-BOOKING-001, FR-PAYMENT-001. 
- **Validation Status:** Business Decision Required (mekanisme penalti reputasi & realokasi TBD). 

### FR-BOOKING-006 — Penolakan oleh Rental

- **Actor:** Rental/Merchant. 
- **Priority:** High. 
- **Description:** Rental MENOLAK booking yang masih menunggu konfirmasi (belum dikonfirmasi) setelah meninjau hasil verifikasi identitas penyewa (BR-015), karena verifikasi adalah bahan konfirmasi bagi rental. Penolakan berbeda dari pembatalan: terjadi sebelum ada komitmen konfirmasi, dan DP kembali penuh otomatis. 
- **Precondition:** Booking berstatus MENUNGGU_KONFIRMASI_RENTAL; DP sudah dibayar (EscrowState=DITAHAN_ESCROW); rental telah menerima hasil verifikasi penyewa. 
- **Trigger:** Rental menekan "Tolak" beserta alasan penolakan. 

#### Main Flow:
1. Rental memilih alasan penolakan (wajib; mis. verifikasi tidak meyakinkan, syarat tidak terpenuhi). 

2. Sistem mengubah BookingState menjadi DITOLAK_RENTAL. 

3. DP dikembalikan PENUH ke penyewa dari dana yang ditahan (BR-010). 

4. Slot dibuka kembali; notifikasi ke penyewa (alasan yang layak tampil — alasan sensitif difilter agar tidak membuka data pribadi rental); event tercatat. 

- **Alternative Flow:** Rental meminta verifikasi ulang/kelengkapan data dulu via CS sebelum menolak → status tetap MENUNGGU_KONFIRMASI_RENTAL sampai SLA habis (FR terkait konfirmasi di Bagian 4B). 
- **Exception:** Penolakan tanpa alasan → ditolak oleh sistem (alasan wajib untuk audit & analitik). 

- **Postcondition:** Booking DITOLAK_RENTAL; DP kembali penuh; tidak ada penalti reputasi otomatis seperti pada pembatalan sepihak (BR-012 khusus pembatalan, bukan penolakan pra-konfirmasi) — perbedaan ini dicatat eksplisit. 

- **Business Rules:** BR-010; BR-015 (hasil verifikasi sebagai bahan konfirmasi). 
- **Dependencies:** FR-BOOKING-001, FR-VERIFICATION-001, FR-PAYMENT-001. 

- **Validation Status:** Defined. 

### FR-BOOKING-007 — Perpanjangan Masa Sewa

- **Actor:** Penyewa (mengajukan); Rental/Merchant (menyetujui). 

- **Priority:** High. 

- **Description:** Penyewa mengajukan perpanjangan masa sewa VIA PLATFORM (BR-034) — perpanjangan off-platform tidak mendapat proteksi (BR-037); rental menyetujui/menolak, dan biaya tambahan dibayar on-platform sebelum perpanjangan efektif. 

- **Precondition:** Booking berstatus DALAM_SEWA; tidak ada sengketa terbuka pada booking tersebut. 
- **Trigger:** Penyewa mengajukan perpanjangan (tanggal selesai baru) dari halaman booking aktif. 

- **Main Flow:** 

1. Penyewa memilih tanggal selesai baru; sistem memeriksa ketersediaan unit pada tanggal tambahan (tidak bentrok booking lain). 

2. Sistem menghitung biaya tambahan (tarif × durasi tambahan, all-in) dan menampilkannya. 

3. Rental menerima permintaan dan menyetujui/menolak dalam batas waktu (batas waktu respons = [TECHNICAL DECISION REQUIRED]/Business Decision Required; jika lewat → permintaan kedaluwarsa, bukan otomatis setuju). 

4. Jika disetujui → sistem menerbitkan pembayaran tambahan on-platform; setelah BERHASIL, periode booking diperpanjang dan slot tambahan dikunci (BR-028). 

5. Notifikasi ke kedua pihak; event tercatat. 

- **Alternative Flow:** Slot tanggal tambahan tidak tersedia → pengajuan langsung ditolak sistem dengan penjelasan; penyewa dapat mengajukan tanggal lain. 

- **Exception:** Pembayaran tambahan gagal/kedaluwarsa → perpanjangan batal; periode semula tetap berlaku; tidak ada perubahan parsial. 

- **Postcondition:** Periode sewa diperpanjang hanya setelah pembayaran tambahan berhasil; slot terkunci untuk tanggal baru. 

- **Business Rules:** BR-034 (perpanjangan via platform); BR-037 (tanpa proteksi bila off-platform); BR-028 (penguncian slot). 

- **Dependencies:** FR-BOOKING-001, FR-PAYMENT-001. 

- **Validation Status:** Defined. 

### FR-BOOKING-008 — Konfirmasi Booking oleh Rental & Auto-Cancel SLA

- **ID:** FR-BOOKING-008 
- **Name:** Konfirmasi Booking oleh Rental & Auto-Cancel SLA 
- **Actor:** Rental/Merchant (konfirmasi); Sistem/Background Scheduler (auto-cancel). 

- **Priority:** Critical. 

- **Description:** Setelah DP diterima, rental WAJIB mengkonfirmasi atau menolak booking dalam SLA (usulan 2 jam — TBD/Validation Required). Rental melihat rincian booking + ringkasan hasil verifikasi penyewa + rincian dana transparan (berapa yang akan diterima, komisi) sebelum memutuskan. Tanpa aksi dalam SLA → Sistem otomatis membatalkan dan DP kembali penuh ke penyewa. 

- **Precondition:** Booking B:MENUNGGU_KONFIRMASI_RENTAL; dalam masa SLA. 
- **Trigger:** (a) Rental menekan Konfirmasi/Tolak; (b) timer SLA terlampaui (Sistem). 

- **Main Flow (konfirmasi):** 

1. Rental membuka detail booking: tanggal, unit, ringkasan verifikasi penyewa (BR-015), rincian dana (BR-030). 

2. Rental menekan Konfirmasi → B:TERKONFIRMASI; event `booking_confirmed` dicatat (untuk evaluasi SLA); notifikasi ke penyewa. 

- **Main Flow (penolakan):** Rental menekan Tolak + alasan → B:DITOLAK_RENTAL; refund penuh DP otomatis dari escrow (BR-010); slot dibuka; event dicatat. 

- **Alternative Flow:** — 

- **Exception:** E1 — SLA terlampaui tanpa aksi → Sistem: B:DIBATALKAN (alasan: tanpa konfirmasi), refund penuh DP otomatis, slot dibuka, notifikasi ke kedua pihak (BR-006). E2 — Refund otomatis gagal → antrean retry; booking tetap batal; rental/ops dinotifikasi.
- **Postcondition:** Booking TERKONFIRMASI, DITOLAK_RENTAL, atau DIBATALKAN (otomatis); tidak ada booking yang menggantung di MENUNGGU_KONFIRMASI_RENTAL melewati SLA. 

- **Business Rules:** BR-006 (SLA TBD; batal otomatis + DP kembali penuh); BR-010 (refund dari dana ditahan); BR-012 (varian pembatalan sepihak rental pasca-konfirmasi — bukan FR ini); BR-015 (hasil verifikasi sebagai bahan konfirmasi); BR-030 (transparansi dana saat konfirmasi). 

- **Dependencies:** FR-BOOKING-001, FR-PAYMENT-001 (DP), FR-PAYMENT-007 (refund), FR-VERIFICATION-005. 
- **Validation Status:** Defined (mekanisme); Validation Required (durasi SLA — usulan 2 jam belum final). 

Ruang lingkup bagian ini: FR-PAYMENT, FR-VERIFICATION, FR-HANDOVER, FR-RETURN, FR-DEPOSIT, FR-PAYOUT, FR-REVIEW, FRDISPUTE, FR-NOTIFICATION, FR-ADMIN, FR-AUDIT. Baseline: responsive web application (MVP). Semua angka yang belum final ditulis TBD. Acuan state: BookingState, EscrowState, Payment record, dan state lain sesuai Bagian D source pack. 

## 4.8 PAYMENT — Pembayaran & Escrow
### FR-PAYMENT-001 — Bayar DP via Platform

- **Actor:** Penyewa (dengan Payment Gateway sebagai aktor eksternal pemroses) 

- **Priority:** Critical 

- **Description:** Sistem membuat payment record terpisah untuk DP saat booking dibuat, menerbitkan link/pilihan metode pembayaran yang disediakan payment gateway (PG) berizin, dan mencatat hasil pembayaran ke EscrowState booking tanpa pernah menyimpan dana di rekening operasional DriveO. 

- **Precondition:** (1) Booking ada dalam BookingState = MENUNGGU_DP. (2) Penyewa telah menyetujui perjanjian sewa elektronik sebelum pembayaran (BR-017). (3) Besaran DP dihitung dari tarif booking dikali persentase DP. 
- **Trigger:** Penyewa menekan "Bayar DP" pada halaman booking. 

- **Main Flow:** 

1. Sistem menghitung nominal DP dari total nilai sewa × persentase DP yang berlaku. 

2. Sistem membuat payment record baru bertipe `DP` dengan status CREATED → MENUNGGU, terhubung ke booking (relasi 1:N: satu booking dapat memiliki payment DP, payment pelunasan, dan/atau payment full sebagai record terpisah). 

3. Sistem meminta ke PG pembuatan transaksi pembayaran (virtual account/e-wallet/QRIS sesuai metode yang didukung PG) dan menerima payment link/reference. 

4. Sistem menampilkan instruksi pembayaran ke penyewa beserta batas waktu pembayaran (timer kedaluwarsa; durasi = TBD). 

5. Penyewa menyelesaikan pembayaran melalui PG. 

6. PG mengirim webhook konfirmasi ke sistem; sistem memvalidasi dan menandai payment record = BERHASIL (idempotency ditangani FR-PAYMENT-004). 

7. Sistem memperbarui state: EscrowState MENUNGGU_DANA → DITAHAN_ESCROW; BookingState MENUNGGU_DP → MENUNGGU_KONFIRMASI_RENTAL (event `dp_paid` tercatat di Riwayat Dana dengan timestamp dan nomor referensi). 

8. Sistem mengirim notifikasi instan (push + WhatsApp) ke penyewa dan rental. 

- **Alternative Flow:** A1 — Penyewa memilih "Bayar Penuh di Awal" (opt-in): langkah 1–8 tetap berlaku tetapi tipe payment record = `FULL` ; nominal = 100% nilai sewa; penyewa mendapat prioritas konfirmasi rental (BR-003). 

- **Exception:** E1 — Penyewa tidak menyelesaikan pembayaran sebelum batas kedaluwarsa → sistem otomatis membatalkan booking (BookingState = KEDALUWARSA; payment record = KEDALUWARSA), slot dibuka kembali, tidak ada dana tertahan (BR-005). E2 — Webhook tidak sampai/terlambat: payment record tetap MENUNGGU sampai batas; penyewa dapat meminta status ulang (rekonsiliasi via API status PG) sebelum batas kedaluwarsa. 

- **Postcondition:** Payment record DP berstatus BERHASIL; dana DP berada di DITAHAN_ESCROW (dipegang PG, bukan rekening operasional DriveO); booking menunggu konfirmasi rental; audit event `dp_paid` tercatat. 

- **Business Rules:** BR-001 (DP on-platform, besaran TBD); BR-004 (escrow via PG berizin); BR-005 (kedaluwarsa link); BR-017 (perjanjian disetujui sebelum pembayaran); BR-032 (notifikasi tiap event uang); BR-037 (proteksi hanya untuk transaksi on-platform). 

- **Dependencies:** FR-BOOKING-* (booking dibuat), FR-PAYMENT-004 (webhook idempotency), FR-NOTIFICATION-001/002, FR-AUDIT001. 
- **Validation Status:** Defined (besaran DP: Validation Required). 

### FR-PAYMENT-002 — Opt-in Bayar Penuh di Awal

- **Actor:** Penyewa 
- **Priority:** High 

- **Description:** Penyewa dapat memilih membayar 100% nilai sewa di awal sebagai alternatif dari skema DP + pelunasan. Pilihan ini bersifat opt-in, bukan kewajiban, dan memberi perk prioritas konfirmasi oleh rental; sekaligus menjadi data awal willingness to pay.
- **Precondition:** Sama seperti FR-PAYMENT-001, dengan penyewa memilih opsi "Bayar Penuh" sebelum payment record dibuat.
- **Trigger:** Penyewa memilih opsi "Bayar Penuh di Awal" pada langkah pembayaran booking. 

#### Main Flow:
1. Sistem menampilkan konfirmasi opsi: nominal penuh, konsekuensi (tanpa pelunasan saat serah terima), dan manfaat prioritas konfirmasi. 

2. Penyewa mengonfirmasi; sistem membuat payment record bertipe `FULL` dengan nominal 100% nilai sewa. 

3. Alur pembayaran mengikuti langkah 3–6 FR-PAYMENT-001. 

4. Saat BERHASIL: EscrowState MENUNGGU_DANA → LUNAS (total diterima = 100%); BookingState MENUNGGU_DP → MENUNGGU_KONFIRMASI_RENTAL. 

5. Booking ditandai flag `prioritas_konfirmasi = true` sehingga muncul lebih menonjol di daftar konfirmasi rental. 

6. Saat serah terima, checklist langsung TERBUKA tanpa perlu pelunasan (tidak ada payment record pelunasan yang dibuat). 

- **Alternative Flow:** A1 — Penyewa berubah pikiran sebelum membayar: dapat kembali ke opsi DP selama payment record FULL belum dibayar; record FULL dibatalkan (KEDALUWARSA/dibatalkan) dan dibuat ulang sebagai DP. 
- **Exception:** E1 — Jika rental menolak/membatalkan booking setelah pembayaran penuh: refund penuh dari dana yang ditahan (BR012/BR-010), tanpa penalti ke penyewa. 

- **Postcondition:** EscrowState = LUNAS; tidak ada kewajiban pelunasan saat serah terima; audit event tercatat. 
- **Business Rules:** BR-003 (opt-in + prioritas konfirmasi); BR-004; BR-012; BR-037. 

- **Dependencies:** FR-PAYMENT-001, FR-PAYMENT-004, FR-HANDOVER-002 (checklist terbuka karena LUNAS). 

- **Validation Status:** Defined (Besaran "penuh" = 100% adalah definisi sistem; manfaat prioritas: Business Decision Required jika ingin diubah). 

### FR-PAYMENT-003 — Pelunasan via Link/QRIS saat Serah Terima

- **Actor:** Penyewa (dibantu Rental sebagai fasilitator fisik; Sistem sebagai penerbit link) 
- **Priority:** Critical 

- **Description:** Saat serah terima, sistem otomatis menerbitkan link/QRIS pelunasan on-platform untuk sisa nilai sewa (total − DP). Checklist serah terima tetap TERKUNCI (sistem mencegah, bukan sekadar mengecek) sampai payment record pelunasan berstatus BERHASIL dan EscrowState = LUNAS. 

- **Precondition:** (1) BookingState = TERKONFIRMASI (rental telah konfirmasi). (2) Ada payment record DP/FULL berstatus BERHASIL. (3) HandoverState = TERKUNCI. 

- **Trigger:** Rental membuka sesi serah terima (handover) di dashboard, atau sistem otomatis saat waktu pengambilan tiba (waktu serah terima tercapai). 

- **Main Flow:** 

1. Sistem membuat payment record bertipe `PELUNASAN` sebesar (total nilai sewa − DP yang sudah dibayar), status CREATED → MENUNGGU. 

2. Sistem menampilkan QRIS/link pelunasan kepada penyewa (di perangkat penyewa sendiri; rental dapat membantu menampilkan kode di layarnya). 

3. Penyewa membayar via PG; webhook memvalidasi hasil (idempotency per FR-PAYMENT-004). 

4. Saat BERHASIL: EscrowState DITAHAN_ESCROW → LUNAS; HandoverState TERKUNCI → TERBUKA; checklist serah terima dapat diisi (FR-HANDOVER-003). 

5. Notifikasi instan ke kedua pihak bahwa pelunasan diterima dan checklist terbuka. 

- **Alternative Flow:** A1 — Booking bertipe FULL (FR-PAYMENT-002): langkah 1–3 dilewati; sistem langsung membuka kunci (TERKUNCI → TERBUKA). 
- **Exception:** E1 — Penyewa tidak dapat/tidak mau melunasi saat serah terima: checklist tetap TERKUNCI; unit tidak diserahkan; booking dapat dibatalkan dengan kebijakan refund bertingkat (BR-011, TBD) atau dijadwal ulang sesuai kesepakatan — keputusan pembatalan dicatat dengan alasan. E2 — Pembayaran pelunasan gagal/expired: payment record = GAGAL/KEDALUWARSA; sistem dapat menerbitkan ulang link baru (payment record baru bertipe PELUNASAN; record lama tidak dihapus untuk audit). 

- **Postcondition:** EscrowState = LUNAS; HandoverState = TERBUKA; unit siap diserahkan dengan checklist. 

- **Business Rules:** BR-002 (pelunasan on-platform saat serah terima); BR-004; BR-007 (checklist terkunci sampai LUNAS); BR-011 (refund bertingkat, TBD); BR-037. 

- **Dependencies:** FR-PAYMENT-001/002, FR-PAYMENT-004, FR-HANDOVER-001/002/003, FR-NOTIFICATION-001/002.
- **Validation Status:** Defined. 

### FR-PAYMENT-004 — Pemrosesan Webhook PG & Idempotency

- **Actor:** Payment Gateway (pengirim) → Sistem (penerima)
- **Priority:** Critical 

- **Description:** Sistem menerima webhook hasil pembayaran dari PG, memverifikasi keasliannya (signature), dan memprosesnya secara idempotent: webhook duplikat untuk payment reference yang sama tidak pernah mengubah state dua kali atau mencatat dana ganda. 

- **Precondition:** (1) Payment record berstatus MENUNGGU (atau status terminal tertentu untuk kasus khusus). (2) PG mengirim webhook ke endpoint yang telah didaftarkan. (3) Secret/signature key webhook terkonfigurasi di sistem. 
- **Trigger:** HTTP POST webhook dari PG ke endpoint `/webhooks/payment-gateway` . 

#### Main Flow:
1. Sistem menerima payload webhook dan memverifikasi signature (HMAC/shared secret sesuai mekanisme PG) sebelum memproses isi. 

2. Sistem mengekstrak payment reference eksternal dan memetakannya ke payment record internal. 

3. Sistem memeriksa idempotency: jika reference sudah pernah diproses (event tercatat), sistem mengembalikan respons sukses TANPA mengubah state (no-op). 

4. Jika belum diproses dan signature valid: sistem menandai payment record = BERHASIL (atau GAGAL sesuai status PG), memperbarui EscrowState/BookingState sesuai tipe payment, mencatat event di Riwayat Dana dengan timestamp + nomor referensi, dan mencatat audit event. 

5. Sistem memicu notifikasi ke pihak terkait (BR-032). 

6. Sistem mengembalikan HTTP 200 ke PG. 

- **Alternative Flow:** A1 — Webhook datang untuk payment record yang sudah KEDALUWARSA/GAGAL: sistem mencatat event `webhook_late` untuk audit, tidak mengubah state booking yang sudah terminal, dan (jika dana ternyata diterima PG) menandai 

- untuk penanganan manual/refund. 
- **Exception:** E1 — Signature tidak valid: tolak (HTTP 401/403), catat percobaan, tidak ada perubahan state. E2 — Payload tidak dapat dipetakan ke payment record: catat sebagai `webhook_unmapped` untuk investigasi; tidak mengubah state apa pun. E3 — PG mengirim webhook berulang karena tidak menerima 200: ditangani langkah 3 (idempotent). 

- **Postcondition:** Setiap payment reference eksternal menghasilkan tepat satu transisi state; tidak ada double-credit; audit trail lengkap. 
- **Business Rules:** BR-004; BR-031 (ledger immutable); BR-032. 

- **Dependencies:** Integrasi PG (modul 5.13); FR-AUDIT-001; FR-NOTIFICATION-001.
- **Validation Status:** Defined. 

### FR-PAYMENT-005 — Kedaluwarsa Pembayaran

- **Actor:** Sistem (Background Scheduler) 

- **Priority:** Critical 

- **Description:** Payment record yang tidak dibayar dalam batas waktu yang ditentukan otomatis dinyatakan KEDALUWARSA; booking yang menunggu DP otomatis batal (KEDALUWARSA) dan slot unit dibuka kembali. Durasi batas waktu = TBD (validasi diperlukan), bukan angka final. 
- **Precondition:** Payment record bertipe DP berstatus MENUNGGU melewati batas waktu pembayaran. 

- **Trigger:** Scheduler berjalan berkala dan menemukan payment record DP yang melewati deadline, atau event timer saat deadline tercapai. 

#### Main Flow:
1. Scheduler mengidentifikasi payment record DP MENUNGGU yang deadline-nya terlewati. 

2. Sistem mengubah payment record → KEDALUWARSA. 

3. Sistem mengubah BookingState MENUNGGU_DP → KEDALUWARSA; EscrowState tetap MENUNGGU_DANA (tidak ada dana yang pernah tertahan). 

4. Sistem membuka kembali slot unit pada kalender ketersediaan. 

5. Sistem mengirim notifikasi ke penyewa (booking batal karena pembayaran tidak selesai) dan ke rental (slot kembali tersedia). 

6. Audit event `booking_expired` tercatat dengan alasan. 

- **Alternative Flow:** A1 — Payment record PELUNASAN kedaluwarsa: booking TIDAK otomatis batal (DP sudah tertahan); sistem menandai sesi serah terima tertunda; dapat diterbitkan link baru (lihat FR-PAYMENT-003 E2). 

- **Exception:** E1 — Webhook BERHASIL tiba tepat setelah penanda KEDALUWARSA (race): ditangani sebagai `webhook_late` (FRPAYMENT-004 A1); dana dikembalikan/refund, booking tidak dihidupkan otomatis. 

- **Postcondition:** Tidak ada booking menggantung tanpa pembayaran; slot kembali tersedia; tidak ada dana menggantung. 

- **Business Rules:** BR-005 (kedaluwarsa X menit TBD → batal otomatis); BR-028 (kunci slot otomatis — kebalikannya di sini: buka kunci otomatis). 

- **Dependencies:** FR-PAYMENT-001, FR-PAYMENT-004, modul ketersediaan (5.5), FR-NOTIFICATION-001/002. 

- **Validation Status:** Validation Required (durasi batas waktu). 

### FR-PAYMENT-006 — Penanganan Pembayaran Gagal


- **Actor:** Penyewa (Sistem memproses status gagal) 

- **Priority:** High 

- **Description:** Jika PG melaporkan pembayaran GAGAL (saldo tidak cukup, metode ditolak, dibatalkan pengguna di halaman PG), 

- sistem menandai payment record = GAGAL, memberi tahu penyewa dengan alasan yang dapat ditindaklanjuti, dan mengizinkan percobaan ulang dalam batas waktu yang tersisa — tanpa mengubah state booking secara prematur. 

- **Precondition:** Payment record berstatus MENUNGGU; PG mengirim status gagal via webhook atau hasil redirect. 

- **Trigger:** Webhook/redirect PG berstatus gagal diterima sistem. 

- **Main Flow:** 

1. Sistem memverifikasi webhook (FR-PAYMENT-004) dan menandai payment record = GAGAL dengan kode alasan dari PG (diterjemahkan ke bahasa yang mudah dipahami). 

2. Sistem mengirim notifikasi ke penyewa: alasan kegagalan + tombol "Coba Lagi" (jika masih dalam batas waktu pembayaran). 

3. Penyewa memilih coba lagi: sistem membuat payment record BARU bertipe sama (record GAGAL dipertahankan untuk audit) 

- dengan deadline mengikuti sisa waktu booking; alur kembali ke FR-PAYMENT-001/003. 

4. Jika batas waktu habis tanpa pembayaran berhasil: berlaku FR-PAYMENT-005. 

- **Alternative Flow:** A1 — Penyewa memilih metode pembayaran berbeda pada percobaan ulang: didukung selama metode tersebut didukung PG; record baru mencatat metode yang dipakai. 

- **Exception:** E1 — Kegagalan berulang (mis. 3x gagal berurutan): sistem menyarankan metode lain/CS; tidak memblokir akun 

- penyewa (kegagalan bayar ≠ fraud). 

- **Postcondition:** Payment record GAGAL tercatat dengan alasan; penyewa mendapat kesempatan retry yang adil; state booking tidak berubah hingga ada pembayaran berhasil atau kedaluwarsa. 

- **Business Rules:** BR-004; BR-005. 

- **Dependencies:** FR-PAYMENT-001/003/004/005, FR-NOTIFICATION-001. 

- **Validation Status:** Defined (ambang "kegagalan berulang" = Business Decision Required jika ingin dijadikan aturan baku). 

### FR-PAYMENT-007 — Refund (Pembuatan & Eksekusi dari Dana Ditahan)


- **Actor:** Sistem (otomatis) / Admin (persetujuan manual untuk kasus tertentu) 

- **Priority:** Critical 

- **Description:** Refund hanya dapat dibuat dari dana yang sedang ditahan di escrow (DITAHAN_ESCROW/LUNAS) dan tidak pernah menalangi dari kas operasional DriveO. Refund mencakup: pembatalan otomatis (tanpa konfirmasi rental → DP kembali penuh), pembatalan pengguna (bertingkat, TBD), pembatalan rental (penuh), dan kasus sengketa. 

- **Precondition:** (1) Ada dana tertahan pada booking (EscrowState = DITAHAN_ESCROW atau LUNAS). (2) Ada pemicu refund yang sah: 

- batal otomatis, pembatalan pengguna/rental, atau hasil mediasi. (3) Nominal refund ≤ total dana tertahan (sistem menolak refund yang melebihi dana ditahan). 

- **Trigger:** Event pembatalan booking, atau keputusan mediasi, atau persetujuan admin untuk refund manual. 

- **Main Flow:** 

1. Sistem menghitung nominal refund sesuai kebijakan yang berlaku untuk pemicunya: Tanpa konfirmasi rental dalam SLA → 100% DP kembali (BR-006). 

   - Pembatalan oleh rental → 100% (penuh) + penalti reputasi + bantuan realokasi (BR-012). 

   - Pembatalan oleh pengguna → skema bertingkat berdasar H-berapa (BR-011, besaran TBD). 

   - Hasil mediasi → nominal sesuai keputusan mediasi (FR-DISPUTE-004). 

2. Sistem membuat refund record terhubung ke payment record asal dan booking; status = DIPROSES. 

3. Sistem mengeksekusi refund melalui PG ke metode pembayaran asal (atau mekanisme yang didukung PG). 

4. Saat PG mengonfirmasi: refund record = BERHASIL; EscrowState → DIREFUND_PENUH atau DIREFUND_SEBAGIAN (jika hanya sebagian dikembalikan); event tercatat di Riwayat Dana (immutable, bertimestamp + referensi). 

5. Notifikasi instan ke penyewa (dana kembali, estimasi waktu sampai) dan ke rental. 

- **Alternative Flow:** A1 — Refund manual butuh persetujuan: refund record dibuat berstatus MENUNGGU_PERSETUJUAN; Admin menyetujui/menolak (FR-ADMIN-005); baru dieksekusi setelah disetujui. 

- **Exception:** E1 — Eksekusi refund gagal di PG: refund record = GAGAL; sistem menjadwalkan retry (kebijakan retry = [TECHNICAL DECISION REQUIRED]); dana tetap tercatat ditahan hingga refund berhasil — tidak boleh dianggap selesai. E2 — Nominal refund yang diminta > dana tertahan: sistem menolak pembuatan refund (validasi keras, BR-010). 

- **Postcondition:** Dana kembali ke penyewa sesuai kebijakan; EscrowState mencerminkan status refund; tidak ada dana yang ditalangi platform. 

- **Business Rules:** BR-006; BR-010 (refund hanya dari dana ditahan — aturan keras); BR-011 (bertingkat, TBD); BR-012; BR-031; BR-032.
- **Dependencies:** FR-PAYMENT-004 (status via webhook), FR-ADMIN-005 (refund manual), FR-DISPUTE-004, FR-NOTIFICATION-001/002, FR-AUDIT-001. 
- **Validation Status:** Defined (skema bertingkat BR-011: Validation Required). 

### FR-PAYMENT-008 — Riwayat Pembayaran per Booking

- **Actor:** Penyewa, Rental/Merchant 

- **Priority:** High 

- **Description:** Setiap booking memiliki tab "Riwayat Dana" yang menampilkan seluruh event keuangan secara kronologis, immutable (tidak dapat diedit/dihapus), masing-masing bertimestamp dan bernomor referensi — menjadi sumber kebenaran tunggal transparansi dana. 

- **Precondition:** Booking ada (status apa pun); pengguna adalah pihak dalam booking tersebut (penyewa pemilik booking atau rental pemilik listing). 
- **Trigger:** Pengguna membuka tab "Riwayat Dana" pada halaman detail booking. 

- **Main Flow:** 

1. Sistem mengambil seluruh event keuangan booking dari ledger: payment DP/pelunasan/full (dibuat, berhasil, gagal, kedaluwarsa), refund, pemotongan deposit/klaim, payout, komisi. 

2. Setiap event ditampilkan dengan: waktu (timestamp), jenis event, nominal, nomor referensi (PG/internal), dan status. 

3. Untuk rental, event komisi ditampilkan transparan dengan format jelas (contoh format proposal: "Anda terima RpX dari RpY — komisi Z%: RpW"; angka tarif final = TBD). 

4. Data ditampilkan read-only; tidak ada aksi edit/hapus. 

- **Alternative Flow:** A1 — Booking belum memiliki event keuangan: tampilkan status kosong yang informatif ("Belum ada transaksi"). 
- **Exception:** E1 — Pengguna bukan pihak booking: akses ditolak (otorisasi). 

- **Postcondition:** Pengguna melihat riwayat lengkap yang konsisten dengan state aktual; kepercayaan terbangun lewat transparansi.
- **Business Rules:** BR-030 (komisi transparan per booking); BR-031 (riwayat dana immutable); BR-032. 

- **Dependencies:** Semua FR-PAYMENT lain (sebagai produsen event), modul 5.26 (ledger), FR-AUDIT-001. 

- **Validation Status:** Defined. 

### FR-PAYMENT-009 — Pencatatan Pembayaran Cash (Fallback Anti-Disintermediasi)

- **Actor:** Rental/Merchant (pencatat), Sistem. 

- **Priority:** Medium 

- **Description:** Sebagai fallback jujur anti-disintermediasi (proposal Bab V.5): pembayaran tunai yang terjadi di luar platform namun terkait booking platform WAJIB dicatat rental di sistem. Cash tercatat masuk ke GMV booking; komisi tetap dihitung dan ditagih via saldo/tagihan ke rental (BR-035). Dana cash TIDAK masuk escrow dan TIDAK mendapat proteksi escrow (BR-037). 
- **Precondition:** Booking B:TERKONFIRMASI atau B:DALAM_SEWA; rental terautentikasi sebagai pemilik booking. 
- **Trigger:** Rental memilih "Catat pembayaran tunai" pada booking. 

#### Main Flow:
1. Rental memasukkan nominal, jenis (DP/pelunasan), tanggal terima, dan catatan. 

2. Sistem mencatat sebagai payment record bertipe CASH ( `is_escrow = false` ), terpisah dari payment via PG. 

3. Sistem menghitung komisi atas nilai tercatat dan menambahkannya ke saldo tagihan rental. 

4. Event ledger `cash_recorded` dicatat; nominal cash tampil di Riwayat Dana dengan label jelas "tunai tercatat (di luar escrow)". 

5. Notifikasi ke penyewa bahwa pembayaran tunai telah dicatat rental. 

- **Alternative Flow:** A1 — Penyewa menyanggah pencatatan → sengketa dibuka (FR-DISPUTE-001) dengan status cash record disengketakan. 

- **Exception:** E1 — Nominal melebihi sisa tagihan → ditolak. E2 — Rental bukan pemilik booking → ditolak (otorisasi, audit). 

- **Postcondition:** GMV booking mencakup cash tercatat; komisi tertagih via saldo; ledger selalu membedakan dana escrow vs cash.
- **Business Rules:** BR-035 (cash tercatat masuk GMV; komisi via saldo); BR-037 (proteksi hanya transaksi on-platform — porsi cash tidak dilindungi escrow). 

- **Dependencies:** FR-BOOKING-001, FR-PAYMENT-008 (riwayat), modul 5.14, modul 5.26. 
- **Validation Status:** Defined (mekanisme pencatatan); Business Decision Required (apakah pelunasan cash tercatat dapat membuka kunci handover — default: TIDAK sampai diputuskan). 

## 4.9 VERIFICATION — Verifikasi & Perjanjian
### FR-VERIFICATION-001 — Submit KTP + SIM


- **Actor:** Penyewa 

- **Priority:** Critical 

- **Description:** Penyewa mengunggah foto KTP dan SIM sebagai syarat wajib verifikasi identitas untuk sewa lepas kunci. Upload memerlukan consent eksplisit terpisah (UU PDP) yang menyatakan tujuan terbatas: verifikasi identitas dan penanganan sengketa.
- **Precondition:** (1) Penyewa memiliki akun terdaftar. (2) Belum memiliki verifikasi DISETUJUI yang masih berlaku. (3) Penyewa menyetujui consent eksplisit (checkbox terpisah, bukan tersembunyi dalam T&C umum). 
- **Trigger:** Penyewa membuka halaman verifikasi identitas dan mengunggah dokumen. 

- **Main Flow:** 

1. Sistem menampilkan penjelasan: dokumen yang dibutuhkan (KTP + SIM), tujuan penggunaan, dasar consent, dan hak pengguna (akses, tarik consent, hapus data). 

2. Penyewa mencentang consent eksplisit terpisah; sistem mencatat consent (siapa, kapan, versi teks consent) sebagai audit trail. 

3. Penyewa mengunggah foto KTP dan foto SIM (format/jumlah file sesuai validasi: tipe file gambar, ukuran maksimum wajar — batas teknis = [TECHNICAL DECISION REQUIRED]). 

4. Sistem menyimpan file ke storage terenkripsi dengan akses terbatas (RBAC), dan membuat verification record berstatus DISUBMIT. 

5. Sistem meneruskan ke tahap OCR otomatis (FR-VERIFICATION-002). 

- **Alternative Flow:** A1 — Penyewa sudah pernah DISETUJUI dan verifikasi masih berlaku: sistem tidak meminta upload ulang; langsung gunakan status yang ada. 

- **Exception:** E1 — File tidak valid (bukan gambar, rusak, terlalu besar): tolak upload dengan pesan jelas; verification record tidak dibuat/ditetapkan DRAFT. E2 — Consent tidak dicentang: tombol submit nonaktif; proses tidak dapat lanjut (aturan keras UU PDP).
- **Postcondition:** Verification record = DISUBMIT; file tersimpan terenkripsi; consent tercatat. 

- **Business Rules:** BR-014 (KTP+SIM wajib); BR-016 (data terenkripsi, RBAC); BR-039 (akses sensitif RBAC + pencatatan); BR-040 (consent eksplisit terpisah). 
- **Dependencies:** Modul 5.15 (e-KYC), FR-AUDIT-001, modul 5.32 (retensi/penghapusan). 
- **Validation Status:** Defined (masa berlaku verifikasi: Business Decision Required). 

### FR-VERIFICATION-002 — OCR & Validasi Format Otomatis

- **Actor:** Vendor e-KYC (eksternal) / Sistem 

- **Priority:** Critical 
- **Description:** Sistem meneruskan citra dokumen ke vendor e-KYC (PROVIDER TBD) untuk OCR dan pemeriksaan validitas format (bukan verifikasi keaslian ke Dukcapil — batas jujur kemampuan). Hasil otomatis menentukan: lolos, atau butuh review manual.
- **Precondition:** Verification record = DISUBMIT; file dokumen tersedia di storage. 
- **Trigger:** Otomatis setelah FR-VERIFICATION-001 selesai. 

- **Main Flow:** 

1. Sistem mengirim citra dokumen ke vendor e-KYC beserta correlation ID (tidak mengirim data pengguna yang tidak diperlukan — minimisasi data). 

2. Vendor mengembalikan: hasil OCR (nama, NIK, dsb.), skor/flag validitas format, dan alasan jika mencurigakan. 

3. Sistem mencatat hasil ke verification record: VerificationState DISUBMIT → DIPROSES_OTOMATIS. 

4. Jika hasil "bersih": lanjut ke keputusan otomatis DISETUJUI (atau langsung ke FR-VERIFICATION-004 untuk penetapan). Jika "meragukan": VerificationState → BUTUH_REVIEW_MANUAL dan masuk antrean Tim Verifikasi (FR-VERIFICATION-003). 

5. Hasil OCR disimpan terenkripsi; citra asli tetap di storage terenkripsi dengan akses RBAC. 

- **Alternative Flow:** A1 — Vendor tidak merespons/timeout: sistem menandai BUTUH_REVIEW_MANUAL dengan alasan "vendor timeout" agar tidak menggantung. 
- **Exception:** E1 — Vendor mengembalikan indikasi dokumen tidak valid/palsu: sistem menandai BUTUH_REVIEW_MANUAL prioritas tinggi; jika dikonfirmasi palsu pada review → DITOLAK dan akun dapat diblokir (BR-033). 
- **Postcondition:** Verification record memiliki hasil OCR tercatat; routing ke otomatis/manual jelas. 

- **Business Rules:** BR-014; BR-033 (dokumen palsu → tolak/blokir); BR-039. 

- **Dependencies:** FR-VERIFICATION-001, integrasi vendor e-KYC (modul 5.15; PROVIDER TBD), FR-VERIFICATION-003/004. 

- **Validation Status:** Defined (provider: TBD/Business Decision Required; catatan: UU PDP menganjurkan vendor sebagai pemroses data untuk meminimalkan penyimpanan citra oleh DriveO). 

### FR-VERIFICATION-003 — Review Manual Kasus Meragukan

- **Actor:** Tim Verifikasi 

- **Priority:** High 

- **Description:** Kasus yang ditandai meragukan oleh OCR (atau vendor timeout) direview manual oleh Tim Verifikasi yang memiliki akses RBAC ke dokumen. Pada fase pilot, peran ini dirangkap tim inti secara manual. Keputusan: setujui, tolak, atau minta upload ulang. 
- **Precondition:** Verification record = BUTUH_REVIEW_MANUAL; reviewer adalah anggota Tim Verifikasi (otorisasi peran). 
- **Trigger:** Reviewer membuka antrean verifikasi dan memilih satu kasus. 

- **Main Flow:** 

1. Sistem menampilkan ke reviewer: citra dokumen (watermarked/view-only jika memungkinkan), hasil OCR, alasan flag, dan riwayat submit pengguna — dengan setiap akses dicatat (BR-039). 

2. Reviewer memeriksa dan memilih keputusan: SETUJUI, TOLAK (dengan alasan), atau MINTA_UPLOAD_ULANG (dengan instruksi perbaikan, mis. foto buram). 

3. Keputusan dicatat beserta identitas reviewer, waktu, dan alasan → diteruskan ke FR-VERIFICATION-004 untuk penetapan status final. 
- **Alternative Flow:** A1 — Reviewer ragu: dapat menandai "butuh pendapat kedua" dan meneruskan ke reviewer lain; kasus tidak menggantung tanpa pemilik. 

- **Exception:** E1 — Dokumen terindikasi palsu: reviewer menandai flag fraud; berlaku BR-033 (tolak dan blokir akun) setelah konfirmasi. 

- **Postcondition:** Setiap kasus meragukan mendapat keputusan manusia yang teraudit; tidak ada auto-reject buta atas kesalahan OCR. 
- **Business Rules:** BR-014; BR-033; BR-039. 
- **Dependencies:** FR-VERIFICATION-002, FR-VERIFICATION-004, FR-ADMIN-001 (blokir akun). 
- **Validation Status:** Defined (SLA review manual: Business Decision Required). 

### FR-VERIFICATION-004 — Persetujuan / Penolakan Verifikasi

- **Actor:** Sistem (untuk jalur otomatis) / Tim Verifikasi (untuk jalur manual) 

- **Priority:** Critical 

- **Description:** Penetapan status final verification record: DISETUJUI atau DITOLAK. Status DISETUJUI menjadi prasyarat implisit kepercayaan (hasil diteruskan ke rental); DITOLAK dapat di-submit ulang dengan dokumen yang benar. 

- **Precondition:** Verification record = DIPROSES_OTOMATIS (hasil bersih) atau BUTUH_REVIEW_MANUAL (keputusan reviewer sudah diisi). 
- **Trigger:** Hasil OCR bersih diterima, atau reviewer menyelesaikan FR-VERIFICATION-003. 

#### Main Flow:
1. Jalur otomatis: hasil OCR bersih → sistem menetapkan DISETUJUI. 

2. Jalur manual: keputusan reviewer SETUJUI → DISETUJUI; TOLAK → DITOLAK (dengan alasan); MINTA_UPLOAD_ULANG → kembali ke DRAFT dengan instruksi ke penyewa. 

3. Sistem mencatat penetapan (siapa/sistem, kapan, alasan) sebagai audit event `verification_approved` / `verification_rejected` . 

4. Sistem mengirim notifikasi hasil ke penyewa. 

5. Jika DISETUJUI: hasil ringkas diteruskan ke rental saat dibutuhkan (FR-VERIFICATION-005). 

- **Alternative Flow:** A1 — Penyewa yang DITOLAK mengunggah ulang dokumen yang diperbaiki: verification record baru (atau revisi) dibuat; riwayat penolakan tetap tersimpan untuk audit. 

- **Exception:** E1 — Akun diblokir karena dokumen palsu (BR-033): tidak dapat submit ulang; status final DITOLAK + akun nonaktif.
- **Postcondition:** Status verifikasi final dan teraudit; penyewa yang disetujui dapat melanjutkan booking dengan trust badge.
- **Business Rules:** BR-014; BR-015; BR-033. 
- **Dependencies:** FR-VERIFICATION-002/003/005, FR-NOTIFICATION-001. 
- **Validation Status:** Defined. 

### FR-VERIFICATION-005 — Rental Melihat Hasil Verifikasi

- **Actor:** Rental/Merchant 

- **Priority:** High 
- **Description:** Rental menerima hasil verifikasi identitas penyewa sebagai bahan pertimbangan konfirmasi booking — berupa status dan ringkasan yang relevan, BUKAN akses bebas ke citra KTP/SIM (minimisasi data, akses berbasis peran). 

- **Precondition:** (1) Booking ada dan rental adalah pemilik listing. (2) Verification record penyewa = DISETUJUI (atau status terakhir yang relevan). 
- **Trigger:** Rental membuka detail booking yang menunggu konfirmasi. 
- **Main Flow:** 

1. Sistem menampilkan badge status verifikasi penyewa pada detail booking (mis. "Identitas Terverifikasi", tanggal verifikasi). 

2. Rental dapat melihat ringkasan non-sensitif (nama sesuai identitas, status) sebagai bahan konfirmasi. 

3. Citra dokumen KTP/SIM TIDAK ditampilkan ke rental secara default; akses hanya dibuka dalam konteks sengketa resmi melalui Tim Mediasi dengan pencatatan akses (BR-039). 

4. Setiap penayangan status ke rental dicatat secukupnya untuk audit. 
- **Alternative Flow:** A1 — Penyewa belum terverifikasi: badge menampilkan "Belum Terverifikasi"; rental dapat memilih menolak/menunda konfirmasi dengan alasan yang jelas ke penyewa. 
- **Exception:** E1 — Rental meminta akses citra dokumen di luar sengketa: sistem menolak; arahkan ke kanal resmi. 
- **Postcondition:** Rental membuat keputusan konfirmasi berbasis informasi yang memadai tanpa over-eksposur data sensitif.
- **Business Rules:** BR-015 (hasil verifikasi ke rental); BR-016; BR-039. 
- **Dependencies:** FR-VERIFICATION-004, modul otorisasi (5.1). 
- **Validation Status:** Defined (cakupan "ringkasan" yang boleh dilihat rental: Legal Validation Required). 

### FR-VERIFICATION-006 — Retensi & Penghapusan Data Verifikasi

- **Actor:** Penyewa (pemohon hapus) / Sistem (retensi otomatis) 
- **Priority:** High 

- **Description:** Data verifikasi disimpan terenkripsi dengan masa retensi terbatas; penyewa dapat meminta penghapusan (hak hapus UU PDP) dan menarik consent, dengan pengecualian data yang wajib disimpan untuk sengketa/proses hukum yang sedang berjalan. 
- **Precondition:** Verification record ada; pemohon adalah pemilik data (atau Admin dengan dasar hukum). 
- **Trigger:** (a) Permintaan hapus data oleh penyewa; atau (b) masa retensi berakhir (jadwal sistem). 

- **Main Flow:** 

1. Penyewa mengajukan permintaan hapus data / tarik consent melalui pengaturan akun. 

2. Sistem memeriksa: apakah data terkait sengketa aktif atau kewajiban hukum? Jika YA → penghapusan ditunda dengan penjelasan; jika TIDAK → lanjut. 

3. Sistem menghapus citra dokumen dan data OCR dari storage; menyisakan log audit minimal (fakta bahwa verifikasi pernah ada + timestamp, tanpa data sensitif) sesuai kebutuhan audit. 

4. Sistem mengonfirmasi penghapusan ke penyewa. 

5. Secara berkala, scheduler menghapus data yang melewati masa retensi (durasi = TBD, usulan proposal 90 hari → Validation Required). 

- **Alternative Flow:** A1 — Penarikan consent saat booking aktif: sistem menjelaskan konsekuensi (booking berjalan tidak dapat dilanjutkan tanpa verifikasi yang valid; dana yang tertahan mengikuti kebijakan refund). 

- **Exception:** E1 — Data dibutuhkan untuk proses hukum (BR-023): penghapusan ditolak/ditunda; dasar penolakan dicatat dan dikomunikasikan. 

- **Postcondition:** Data sensitif tidak disimpan lebih lama dari yang diperlukan; hak pengguna terpenuhi; kewajiban hukum tetap dipatuhi. 
- **Business Rules:** BR-016 (retensi 90 hari TBD); BR-023; BR-038 (retensi data, TBD legal); BR-040. 
- **Dependencies:** FR-VERIFICATION-001 (consent), modul storage (5.15), FR-AUDIT-001. 
- **Validation Status:** Legal Validation Required (durasi retensi, pengecualian hukum). 

### FR-VERIFICATION-007 — Persetujuan Perjanjian Sewa Elektronik

- **Actor:** Penyewa. 

- **Priority:** Critical 

- **Description:** Sebelum pembayaran apa pun dilakukan, penyewa wajib membaca dan menyetujui perjanjian sewa elektronik (syarat, tarif, denda, tanggung jawab) versi yang berlaku melalui click-to-accept. Persetujuan dicatat dengan audit trail: siapa, kapan, versi dokumen, dan hash konten (BR-017). 
- **Precondition:** Booking B:MENUNGGU_DP sudah dibuat; dokumen perjanjian versi berlaku tersedia. 
- **Trigger:** Penyewa menekan "Setuju" pada teks perjanjian. 
- **Main Flow:** 

1. Sistem menampilkan teks perjanjian versi berlaku (nomor versi + tanggal efektif). 

2. Penyewa memberikan persetujuan eksplisit (checkbox tidak pre-checked). 

3. Sistem mencatat: user_id, timestamp, versi dokumen, hash konten → event audit `agreement_accepted` . 

4. Booking ditandai `agreement_accepted = true` ; link pembayaran DP diaktifkan. 

- **Alternative Flow:** A1 — Penyewa menolak → booking tidak dapat lanjut ke pembayaran; booking dapat dibatalkan penyewa. 

- **Exception:** E1 — Versi perjanjian berubah sebelum accept → tampilkan versi terbaru; persetujuan atas versi lama tidak sah dan harus diulang. 

- **Postcondition:** Tanpa `agreement_accepted = true` , FR-PAYMENT-001 menolak inisiasi pembayaran (422). 

- **Business Rules:** BR-017 (persetujuan SEBELUM pembayaran; click-to-accept + audit trail); BR-043 (batas peran platform — bukan pihak perjanjian). 

- **Dependencies:** FR-BOOKING-001, FR-AUDIT-001. 
- **Validation Status:** Defined (mekanisme); Legal Validation Required (kekuatan hukum & teks final perjanjian). 

## 4.10 HANDOVER — Serah Terima
### FR-HANDOVER-001 — Penguncian Checklist sampai LUNAS

- **Actor:** Sistem 
- **Priority:** Critical 
- **Description:** Checklist serah terima secara sistem TERKUNCI dan tidak dapat diisi selama EscrowState belum LUNAS. Ini adalah pencegahan di level sistem (hard gate), bukan sekadar peringatan — unit tidak boleh diserahkan sebelum pelunasan tercatat.
- **Precondition:** BookingState = TERKONFIRMASI; HandoverState = TERKUNCI. 
- **Trigger:** Setiap upaya membuka/mengisi checklist serah terima (oleh rental atau penyewa). 

- **Main Flow:** 

1. Sistem memeriksa EscrowState booking pada setiap request terkait checklist. 

2. Jika EscrowState ≠ LUNAS: sistem menolak aksi (UI nonaktif + API mengembalikan error otorisasi bisnis) dengan pesan "Checklist terkunci — selesaikan pelunasan terlebih dahulu" dan menampilkan link/QRIS pelunasan. 

3. Penolakan dicatat sebagai audit event ringan (upaya akses) bila diperlukan untuk investigasi. 
- **Alternative Flow:** Tidak ada — aturan ini mutlak untuk skema DP + pelunasan. 
- **Exception:** E1 — Kondisi darurat operasional (mis. sistem PG down total): tidak ada bypass otomatis; penanganan manual oleh Admin dengan pencatatan khusus dan persetujuan eksplisit (kasus luar biasa, bukan alur normal). 
- **Postcondition:** Tidak ada serah terima tercatat tanpa pelunasan; proteksi anti-disintermediasi di titik kritis. 
- **Business Rules:** BR-007 (checklist terkunci sampai LUNAS — aturan keras); BR-002; BR-037. 
- **Dependencies:** FR-PAYMENT-003 (pelunasan), FR-HANDOVER-002. 

- **Validation Status:** Defined. 

### FR-HANDOVER-002 — Pembukaan Kunci setelah Pelunasan

- **Actor:** Sistem 
- **Priority:** Critical 

- **Description:** Segera setelah payment record pelunasan (atau FULL) berstatus BERHASIL dan EscrowState = LUNAS, sistem otomatis membuka kunci checklist (HandoverState TERKUNCI → TERBUKA) dan memberitahu kedua pihak bahwa serah terima dapat dimulai. 
- **Precondition:** HandoverState = TERKUNCI; EscrowState baru saja menjadi LUNAS. 
- **Trigger:** Event `final_payment_received` (atau `full_payment_received` ) dari pemrosesan webhook. 

#### Main Flow:
1. Sistem menerima konfirmasi pembayaran berhasil (FR-PAYMENT-003/002). 

2. Sistem mengubah HandoverState → TERBUKA dan mencatat timestamp pembukaan. 

3. Sistem mengirim notifikasi ke rental ("Pelunasan diterima — checklist serah terima terbuka") dan penyewa ("Silakan lanjutkan serah terima unit"). 

4. Audit event `handover_unlocked` tercatat. 
- **Alternative Flow:** Tidak ada. 
- **Exception:** E1 — Webhook ganda: idempotency (FR-PAYMENT-004) memastikan transisi hanya terjadi sekali. 
- **Postcondition:** Checklist dapat diisi; kedua pihak mendapat kepastian yang sama pada waktu yang sama. 

- **Business Rules:** BR-007; BR-032. 
- **Dependencies:** FR-PAYMENT-002/003/004, FR-HANDOVER-001/003. 
- **Validation Status:** Defined. 

### FR-HANDOVER-003 — Pengisian Checklist + Foto Kondisi

- **Actor:** Rental/Merchant dan Penyewa (keduanya) 
- **Priority:** Critical 

- **Description:** Kedua pihak bersama-sama mengisi checklist kondisi unit (body, odometer/BBM, kelengkapan/aksesoris) dan mengunggah foto kondisi sebagai dokumentasi awal yang menjadi dasar klaim di kemudian hari (BR-019: klaim berdasar foto serah terima). 
- **Precondition:** (1) HandoverState = TERBUKA. (2) Kedua pihak hadir (fisik) pada lokasi serah terima. 
- **Trigger:** Rental atau penyewa membuka form checklist serah terima. 

#### Main Flow:
1. Sistem menampilkan form checklist baku: kondisi body (per panel), odometer/BBM, kelengkapan (STNK, helm, toolkit, dsb. — daftar item = Business Decision Required untuk standardisasi). 

2. Masing-masing pihak (atau salah satu dengan disaksikan pihak lain) mengisi item checklist dan mengunggah foto: tampak depan/belakang/samping, odometer/BBM, dan bagian yang sudah ada cacatnya (close-up). 

3. Foto disimpan ke storage terenkripsi/terkontrol akses, terhubung ke handover record dengan timestamp dan pengunggah. 

4. Sistem menandai HandoverState: TERBUKA → CHECKLIST_DIISI → DIFOTO (setelah foto wajib terunggah). 

5. Sistem memvalidasi kelengkapan: semua item wajib terisi dan foto wajib ada sebelum lanjut ke konfirmasi. 
- **Alternative Flow:** A1 — Ditemukan cacat yang belum tercatat saat pengisian: dicatat sebagai "cacat pra-sewa" dengan foto; menjadi pengecualian klaim di kemudian hari (melindungi penyewa). 
- **Exception:** E1 — Salah satu pihak menolak mengisi: handover tidak dapat dikonfirmasi (FR-HANDOVER-004 mensyaratkan keduanya); booking tetap TERKONFIRMASI; eskalasi ke CS jika buntu. 
- **Postcondition:** Dokumentasi awal lengkap dan disepakati; menjadi baseline objektif untuk return dan klaim. 
- **Business Rules:** BR-018 (checklist + foto kedua pihak); BR-019 (klaim berdasar foto). 
- **Dependencies:** FR-HANDOVER-002/004, modul 5.18/5.19, FR-AUDIT-001. 
- **Validation Status:** Defined (daftar item checklist baku: Business Decision Required). 

### FR-HANDOVER-004 — Konfirmasi Serah Terima Kedua Pihak

- **Actor:** Rental/Merchant dan Penyewa 
- **Priority:** Critical 
- **Description:** Serah terima dinyatakan sah hanya setelah KEDUA pihak menekan konfirmasi (dual confirmation) pada checklist yang sudah lengkap. Setelah itu BookingState → DALAM_SEWA dan masa sewa resmi berjalan. 
- **Precondition:** (1) HandoverState = DIFOTO (checklist + foto lengkap). (2) EscrowState = LUNAS. 
- **Trigger:** Masing-masing pihak menekan "Konfirmasi Serah Terima". 

#### Main Flow:
1. Pihak pertama menekan konfirmasi: sistem mencatat (siapa, kapan) dan menunggu pihak kedua; status interim tercatat. 

2. Pihak kedua menekan konfirmasi: sistem memverifikasi keduanya sudah konfirmasi. 

3. Sistem mengubah HandoverState → DIKONFIRMASI_KEDUA_PIHAK → SELESAI; BookingState TERKONFIRMASI → DALAM_SEWA; waktu mulai sewa dicatat. 

4. Audit event `handover_completed` tercatat (para pihak, waktu, versi checklist). 

5. Notifikasi ke kedua pihak: masa sewa resmi dimulai, waktu pengembalian yang disepakati ditampilkan. 

- **Alternative Flow:** A1 — Pihak pertama konfirmasi, pihak kedua tidak kunjung konfirmasi: sistem mengirim pengingat; jika buntu melewati batas wajar → eskalasi CS (batas waktu = Business Decision Required). 

- **Exception:** E1 — Salah satu pihak membatalkan sebelum konfirmasi kedua: kembali ke status menunggu; tidak ada perubahan BookingState; dana tetap di escrow mengikuti kebijakan pembatalan. 

- **Postcondition:** Serah terima sah dan teraudit; masa sewa berjalan dengan baseline dokumentasi yang disepakati. 

- **Business Rules:** BR-018; BR-007. 
- **Dependencies:** FR-HANDOVER-003, FR-NOTIFICATION-001, FR-AUDIT-001. 
- **Validation Status:** Defined. 

## 4.11 RETURN — Pengembalian
### FR-RETURN-001 — Inisiasi Pengembalian

- **Actor:** Penyewa (atau Rental jika penyewa tidak kooperatif) 

- **Priority:** High 

- **Description:** Pengembalian diinisiasi saat unit dikembalikan (tepat waktu atau terlambat). Sistem mencatat waktu aktual pengembalian dan menentukan apakah terjadi keterlambatan terhadap waktu yang disepakati. 

- **Precondition:** BookingState = DALAM_SEWA. 
- **Trigger:** Penyewa menekan "Kembalikan Unit" atau rental memulai sesi pengembalian di dashboard. 

- **Main Flow:** 

1. Sistem mencatat waktu aktual pengembalian dan membandingkannya dengan waktu pengembalian yang disepakati. 

2. Jika tepat waktu (atau dalam toleransi — toleransi = Business Decision Required): ReturnState MENUNGGU, lanjut ke FRRETURN-002. 

3. Jika terlambat: ReturnState → TERLAMBAT; sistem menghitung denda per jam sesuai perjanjian sewa (BR-020) dan menampilkannya ke kedua pihak. 

4. Audit event `return_initiated` tercatat. 

- **Alternative Flow:** A1 — Penyewa mengajukan perpanjangan sebelum/saat pengembalian: berlaku BR-034 (perpanjangan via platform) — dibuat booking/perpanjangan baru via platform, bukan kesepakatan lisan. 

- **Exception:** E1 — Penyewa tidak mengembalikan dan tidak dapat dihubungi: bukan alur return normal — eskalasi ke 

- sengketa/penggelapan (BR-023, FR-DISPUTE-001). 

- **Postcondition:** Waktu aktual tercatat; status keterlambatan (jika ada) jelas bagi kedua pihak. 

- **Business Rules:** BR-020 (denda telat per jam sesuai perjanjian); BR-034 (perpanjangan via platform); BR-023. 

- **Dependencies:** FR-HANDOVER-004 (masa sewa), FR-RETURN-002/004. 

- **Validation Status:** Defined (toleransi keterlambatan & formula denda: Business Decision Required — denda mengikuti isi perjanjian sewa). 

### FR-RETURN-002 — Checklist + Foto Pengembalian

- **Actor:** Rental/Merchant dan Penyewa 
- **Priority:** Critical 
- **Description:** Kedua pihak mengisi checklist pengembalian dengan item yang SAMA seperti saat serah terima, plus foto kondisi akhir. Perbandingan foto handover vs return menjadi dasar objektif klaim kerusakan (BR-019). 
- **Precondition:** ReturnState = MENUNGGU atau TERLAMBAT (return sudah diinisiasi). 
- **Trigger:** Salah satu pihak membuka form checklist pengembalian. 

- **Main Flow:** 

1. Sistem menampilkan form checklist dengan item yang sama seperti FR-HANDOVER-003, berdampingan dengan data/foto serah terima sebagai pembanding. 

2. Kedua pihak mengisi kondisi akhir dan mengunggah foto akhir (sudut yang sama dengan foto handover). 

3. Sistem menandai ReturnState: → CHECKLIST_DIISI → DIFOTO. 

4. Sistem dapat menandai perbedaan mencolok (mis. item yang tadinya "baik" menjadi "rusak") sebagai flag untuk perhatian rental — penanda, bukan vonis otomatis (tanpa ML/AI di MVP). 

- **Alternative Flow:** A1 — Tidak ada perbedaan kondisi: checklist ditandai "sesuai kondisi awal"; mempercepat konfirmasi. 

- **Exception:** E1 — Penyewa menolak ikut checklist: rental dapat mengisi sepihak dengan foto; kasus ditandai untuk potensi klaim/mediasi; penyewa diberi notifikasi dan tenggat respons. 

- **Postcondition:** Dokumentasi akhir lengkap; dasar klaim (jika ada) objektif dan terdokumentasi. 

- **Business Rules:** BR-018; BR-019 (klaim berdasar foto). 
- **Dependencies:** FR-RETURN-001/003, FR-HANDOVER-003 (baseline), modul 5.19/5.21. 
- **Validation Status:** Defined. 

### FR-RETURN-003 — Konfirmasi Pengembalian

- **Actor:** Rental/Merchant (konfirmasi utama) dan Penyewa 

- **Priority:** Critical 

- **Description:** Rental mengonfirmasi penerimaan unit kembali; penyewa mengonfirmasi pengembalian. Konfirmasi ini adalah trigger bagi: (a) mulai 24 jam claim window deposit, (b) penjadwalan payout H+1, (c) perhitungan komisi. 
- **Precondition:** ReturnState = DIFOTO (checklist + foto pengembalian lengkap). 
- **Trigger:** Rental menekan "Konfirmasi Pengembalian Diterima" dan penyewa menekan "Konfirmasi Pengembalian". 

- **Main Flow:** 

1. Rental mengonfirmasi penerimaan unit (dengan catatan jika ada temuan awal). 

2. Penyewa mengonfirmasi bahwa unit telah dikembalikan. 

3. Sistem mengubah ReturnState → DIKONFIRMASI → SELESAI; BookingState DALAM_SEWA → SELESAI. 

4. Sistem memicu tiga hal sekaligus: (a) DepositState → CLAIM_WINDOW_24JAM (FR-DEPOSIT-002); (b) payout dijadwalkan H+1 (FRPAYOUT-001); (c) komisi dihitung dari nilai sewa penuh (besaran % TBD). 

5. Audit event `return_completed` tercatat; notifikasi ke kedua pihak. 

- **Alternative Flow:** A1 — Rental menemukan kerusakan saat konfirmasi: tetap konfirmasi penerimaan (unit sudah kembali fisik), lalu buat klaim dalam claim window (FR-DEPOSIT-003) — konfirmasi penerimaan ≠ persetujuan kondisi sempurna. 

- **Exception:** E1 — Penyewa tidak menekan konfirmasi: setelah rental konfirmasi + tenggat wajar, sistem dapat menganggap return selesai sepihak dengan catatan; tenggat = Business Decision Required. 

- **Postcondition:** Booking SELESAI; claim window berjalan; payout terjadwal; komisi terhitung. 

- **Business Rules:** BR-008 (payout H+1); BR-009 (claim window 24 jam); BR-019. 

- **Dependencies:** FR-RETURN-002, FR-DEPOSIT-002, FR-PAYOUT-001, FR-NOTIFICATION-001. 

- **Validation Status:** Defined. 

### FR-RETURN-004 — Keterlambatan & Denda

- **Actor:** Sistem (hitung) / Rental (tagih via platform) 

- **Priority:** High 

- **Description:** Keterlambatan pengembalian dikenai denda per jam sesuai yang tertulis di perjanjian sewa elektronik yang telah disetujui. Sistem menghitung, menampilkan, dan mencatat denda; penagihannya melalui platform (bukan tunai langsung) agar tercatat. 
- **Precondition:** ReturnState = TERLAMBAT (waktu aktual > waktu disepakati + toleransi). 
- **Trigger:** FR-RETURN-001 mendeteksi keterlambatan. 

- **Main Flow:** 

1. Sistem menghitung durasi keterlambatan (pembulatan ke atas per jam — aturan pembulatan = Business Decision Required, default mengikuti perjanjian). 

2. Sistem mengambil tarif denda per jam dari perjanjian sewa booking tersebut (BR-020). 

3. Sistem menampilkan rincian denda ke kedua pihak: durasi × tarif = total denda. 

4. Denda dicatat sebagai kewajiban pada booking; penyelesaiannya via platform (ditagihkan ke penyewa; mekanisme potong/debit = Business Decision Required, mis. dari deposit atau tagihan terpisah). 

5. Audit event `late_fee_assessed` tercatat. 

- **Alternative Flow:** A1 — Rental memberikan keringanan/penghapusan denda: dicatat sebagai keputusan rental (siapa, kapan); denda disesuaikan; audit trail menjaga transparansi. 
- **Exception:** E1 — Penyewa menolak denda: menjadi sengketa (FR-DISPUTE-001) dengan perjanjian sebagai bukti. 

- **Postcondition:** Denda terhitung transparan berdasar perjanjian; tidak ada pungutan liar di luar sistem. 
- **Business Rules:** BR-020 (denda telat per jam sesuai perjanjian); BR-037 (semua finansial on-platform). 
- **Dependencies:** FR-RETURN-001, FR-DISPUTE-001, modul 5.17 (perjanjian sebagai sumber tarif). 
- **Validation Status:** Defined (tarif & pembulatan: Business Decision Required per perjanjian). 

## 4.12 DEPOSIT — Deposit & Klaim
### FR-DEPOSIT-001 — Penampilan Besaran Deposit di Listing

- **Actor:** Sistem (menampilkan) / Rental (menetapkan) 

- **Priority:** High 

- **Description:** Besaran deposit ditampilkan secara transparan di listing sebagai bagian dari harga all-in (tarif + deposit + biaya antarjemput bila ada), sehingga penyewa mengetahui total komitmen dana sebelum booking — bukan biaya kejutan saat serah terima.
- **Precondition:** Listing aktif; rental telah menetapkan besaran deposit untuk unit/kategori tersebut. 
- **Trigger:** Penyewa melihat halaman listing atau perbandingan unit. 

- **Main Flow:** 

1. Rental menetapkan besaran deposit per unit/kategori saat mengelola listing (angka = kebijakan rental, ditampilkan apa adanya). 

2. Sistem menampilkan deposit sebagai komponen harga all-in di listing, halaman perbandingan, dan ringkasan booking. 

3. Pada ringkasan booking sebelum pembayaran, sistem merinci: tarif sewa + deposit (ditahan, bukan biaya) + biaya antar-jemput (bila ada). 

- **Alternative Flow:** A1 — Rental tidak menetapkan deposit: sistem menampilkan "Tanpa deposit" secara eksplisit (bukan disembunyikan). 

- **Exception:** E1 — Rental mengubah deposit setelah booking dibuat: tidak berlaku surut untuk booking yang sudah berjalan; perubahan hanya untuk booking baru. 

- **Postcondition:** Penyewa membuat keputusan dengan informasi biaya lengkap; sengketa "tidak tahu ada deposit" dapat dicegah.
- **Business Rules:** BR-026 (harga all-in); BR-009. 
- **Dependencies:** FR-LISTING-* (manajemen listing), FR-BOOKING-* (ringkasan booking). 

- **Validation Status:** Defined. 

### FR-DEPOSIT-002 — Penahanan 24 Jam (Claim Window)

- **Actor:** Sistem (Background Scheduler) 

- **Priority:** Critical 

- **Description:** Setelah pengembalian terkonfirmasi, deposit masuk masa penahanan 24 jam (claim window) untuk memberi kesempatan rental menemukan kerusakan yang tidak terlihat saat checklist. Jika tidak ada klaim dalam 24 jam, deposit dilepas otomatis. 
- **Precondition:** ReturnState = SELESAI (pengembalian terkonfirmasi, FR-RETURN-003). 
- **Trigger:** Event `return_completed` . 

#### Main Flow:
1. Sistem mengubah DepositState → CLAIM_WINDOW_24JAM dan mencatat deadline (waktu konfirmasi + 24 jam). 

2. Sistem memberi tahu rental: "Anda memiliki 24 jam untuk memeriksa unit dan mengajukan klaim jika ada kerusakan." 

3. Sistem memberi tahu penyewa: "Deposit Anda ditahan 24 jam untuk pemeriksaan; akan dilepas otomatis jika tidak ada klaim." 

4. Jika tidak ada klaim hingga deadline: scheduler otomatis mengubah DepositState → DILEPAS; dana deposit dikembalikan ke penyewa via PG; audit event `deposit_released` tercatat. 
- **Alternative Flow:** A1 — Rental mengajukan klaim dalam window: berlaku FR-DEPOSIT-003 (deposit dibekukan, tidak dilepas otomatis). 
- **Exception:** E1 — Scheduler gagal berjalan tepat waktu: pelepasan tetap dieksekusi pada run berikutnya; keterlambatan dicatat; tidak ada penalti ke penyewa atas keterlambatan sistem. 

- **Postcondition:** Deposit kembali ke penyewa tepat waktu bila tidak ada masalah; rental mendapat waktu pemeriksaan yang adil.
- **Business Rules:** BR-009 (deposit 24 jam claim window); BR-019. 

- **Dependencies:** FR-RETURN-003, FR-DEPOSIT-003/006, FR-NOTIFICATION-001. 

- **Validation Status:** Defined (durasi 24 jam adalah ketetapan proposal; perubahan = Business Decision Required). 

### FR-DEPOSIT-003 — Pembuatan Klaim

- **Actor:** Rental/Merchant 
- **Priority:** Critical 

- **Description:** Dalam claim window 24 jam, rental dapat membuat klaim kerusakan dengan melampirkan bukti foto (dibandingkan dengan foto serah terima) dan nominal yang diklaim. Klaim yang sah menjadi dasar pemotongan deposit (BR-019: klaim berdasar foto; deposit menutup lebih dulu). 

- **Precondition:** (1) DepositState = CLAIM_WINDOW_24JAM. (2) Rental adalah pihak booking. (3) Klaim dibuat sebelum deadline window. 
- **Trigger:** Rental menekan "Ajukan Klaim" pada booking yang sudah selesai. 

- **Main Flow:** 

1. Sistem menampilkan form klaim: deskripsi kerusakan, foto bukti kerusakan saat ini, perbandingan dengan foto serah terima (ditampilkan berdampingan), dan nominal yang diklaim (maksimum = nilai deposit yang ditahan). 

2. Rental mengisi dan mengirim klaim; sistem membuat claim record berstatus DIAJUKAN, terhubung ke booking dan deposit. 

3. Sistem mengubah DepositState → DIBEKUKAN_KLAIM (FR-DEPOSIT-004): pelepasan otomatis dibatalkan. 

4. Sistem memberi tahu penyewa: rincian klaim + bukti + tenggat untuk merespons (tenggat = Business Decision Required). 

5. Audit event `claim_created` tercatat. 

- **Alternative Flow:** A1 — Klaim diajukan tetapi nominal melebihi deposit: sistem menolak nominal berlebih (klaim maksimum = deposit); kelebihan menjadi sengketa terpisah di luar deposit (FR-DISPUTE-001). 
- **Exception:** E1 — Klaim diajukan setelah window berakhir: sistem menolak dengan pesan jelas; rental diarahkan ke jalur sengketa umum bila masih ingin menuntut (tanpa jaminan deposit). 

- **Postcondition:** Klaim tercatat dengan bukti; deposit aman (beku) selama proses; penyewa mendapat kesempatan merespons.
- **Business Rules:** BR-009 (klaim → bekukan); BR-019 (klaim berdasar foto, deposit dulu). 
- **Dependencies:** FR-DEPOSIT-002/004, FR-DISPUTE-001 (jika eskalasi), FR-NOTIFICATION-001/002. 
- **Validation Status:** Defined. 

### FR-DEPOSIT-004 — Pembekuan Deposit saat Klaim

- **Actor:** Sistem 
- **Priority:** Critical 
- **Description:** Segera setelah klaim dibuat, deposit yang sedang dalam claim window otomatis DIBEKUKAN: tidak dapat dilepas otomatis, tidak dapat ditarik, dan tetap tercatat hingga klaim/mediasi selesai dengan keputusan final. 
- **Precondition:** Claim record = DIAJUKAN; DepositState = CLAIM_WINDOW_24JAM. 
- **Trigger:** Event `claim_created` . 

#### Main Flow:
1. Sistem mengubah DepositState → DIBEKUKAN_KLAIM dan membatalkan jadwal pelepasan otomatis. 

2. Sistem mengunci dana deposit: setiap upaya pelepasan/penarikan ditolak selama status beku. 

3. Sistem memberi tahu rental ("Deposit dibekukan hingga klaim selesai — alasan, estimasi durasi, cara merespons") dan penyewa. 

4. Status beku tercermin di layar "Dana Saya" rental dan riwayat dana booking dengan alasan yang jelas. 

5. Audit event `deposit_frozen` tercatat. 
- **Alternative Flow:** Tidak ada — pembekuan otomatis dan wajib setiap ada klaim. 
- **Exception:** E1 — Klaim ditarik oleh rental sebelum mediasi: deposit kembali ke CLAIM_WINDOW_24JAM dengan sisa waktu window (atau langsung DILEPAS jika window sudah habis dan tidak ada klaim lain). 
- **Postcondition:** Dana aman selama sengketa; kedua pihak tahu status, alasan, dan durasi. 
- **Business Rules:** BR-009; BR-019. 
- **Dependencies:** FR-DEPOSIT-003/005/006, FR-DISPUTE-003 (mediasi memutuskan nasib deposit). 
- **Validation Status:** Defined. 

### FR-DEPOSIT-005 — Pemotongan Deposit untuk Klaim

- **Actor:** Tim Mediasi (keputusan) / Sistem (eksekusi) 
- **Priority:** Critical 

- **Description:** Berdasarkan hasil mediasi/keputusan yang disepakati, sistem memotong deposit sebesar nominal yang diputuskan untuk menutup klaim (deposit menutup lebih dulu — BR-019). Sisa deposit (jika ada) dilepas ke penyewa. 

- **Precondition:** (1) DepositState = DIBEKUKAN_KLAIM. (2) Ada keputusan final atas klaim: disetujui penyewa, atau diputuskan Tim Mediasi (FR-DISPUTE-004). 
- **Trigger:** Keputusan klaim final tercatat. 

#### Main Flow:
1. Sistem membaca nominal potongan dari keputusan ( ≤ nilai deposit yang dibekukan). 

2. Sistem membuat deduction record: nominal, penerima (rental), dasar keputusan, referensi klaim. 

3. Sistem mengeksekusi: dana potongan diteruskan ke rental (via mekanisme payout/PG); sisa deposit dilepas ke penyewa. 

4. DepositState → DIPOTONG_SEBAGIAN (atau DILEPAS_PENUH jika klaim ditolak seluruhnya — lihat FR-DEPOSIT-006). 

5. Event tercatat di Riwayat Dana (immutable, bertimestamp + referensi); notifikasi ke kedua pihak dengan rincian. 

- **Alternative Flow:** A1 — Penyewa menyetujui klaim secara sukarela sebelum mediasi selesai: sistem mengeksekusi pemotongan sesuai nominal yang disetujui; mediasi ditutup. 
- **Exception:** E1 — Nominal keputusan > deposit yang dibekukan: sistem menolak eksekusi (validasi keras); selisih menjadi piutang sengketa di luar deposit, bukan dipotong paksa dari dana lain. 

- **Postcondition:** Klaim tertutup dengan dana yang jelas asal-usulnya; sisa hak penyewa dikembalikan. 
- **Business Rules:** BR-009; BR-019 (deposit menutup lebih dulu); BR-031. 
- **Dependencies:** FR-DEPOSIT-004, FR-DISPUTE-004, FR-PAYOUT-002 (penyaluran ke rental), FR-NOTIFICATION-001.
- **Validation Status:** Defined. 

### FR-DEPOSIT-006 — Pelepasan Deposit

- **Actor:** Sistem (otomatis) / Tim Mediasi (keputusan tolak klaim) 

- **Priority:** High 
- **Description:** Deposit dilepas (dikembalikan penuh ke penyewa) dalam dua kondisi: (a) claim window 24 jam berakhir tanpa klaim (otomatis), atau (b) klaim ditolak seluruhnya melalui mediasi/penarikan klaim. 

- **Precondition:** (a) DepositState = CLAIM_WINDOW_24JAM dan deadline terlewati tanpa klaim; atau (b) DepositState = DIBEKUKAN_KLAIM dan klaim berstatus DITOLAK/DITARIK. 
- **Trigger:** Scheduler (kasus a) atau keputusan final klaim (kasus b). 

#### Main Flow:
1. Sistem memvalidasi tidak ada klaim aktif yang menahan deposit. 

2. Sistem mengeksekusi pengembalian dana deposit ke penyewa via PG (ke metode asal). 

3. DepositState → DILEPAS (kasus a) atau DILEPAS_PENUH (kasus b, setelah mediasi). 

4. Audit event `deposit_released` tercatat dengan alasan pelepasan. 

5. Notifikasi ke penyewa ("Deposit RpX telah dikembalikan") dan ke rental. 
- **Alternative Flow:** Tidak ada. 

- **Exception:** E1 — Eksekusi pengembalian gagal di PG: status dicatat GAGAL; retry terjadwal ([TECHNICAL DECISION REQUIRED] untuk kebijakan retry); dana tetap tercatat sebagai kewajiban hingga berhasil. 
- **Postcondition:** Tidak ada dana deposit yang menggantung tanpa status jelas. 

- **Business Rules:** BR-009; BR-031; BR-032. 
- **Dependencies:** FR-DEPOSIT-002/004/005, FR-PAYMENT-004 (konfirmasi via webhook). 

- **Validation Status:** Defined. 

## 4.13 PAYOUT — Penerusan Dana
### FR-PAYOUT-001 — Penjadwalan Payout H+1

- **Actor:** Sistem (Background Scheduler) 
- **Priority:** Critical 

- **Description:** Setelah pengembalian terkonfirmasi tanpa sengketa aktif, sistem menjadwalkan payout dana sewa (nilai sewa penuh − komisi) ke rental pada H+1. Ini adalah janji konservatif (under-promise); penyaluran di hari yang sama diusahakan sebagai overdeliver, bukan kewajiban. 

- **Precondition:** (1) BookingState = SELESAI (return terkonfirmasi). (2) EscrowState = LUNAS (atau DITAHAN_ESCROW untuk kasus DPonly yang dibatalkan sesuai kebijakan — payout hanya untuk dana sewa yang sah). (3) Tidak ada sengketa/klaim aktif atas booking. 
- **Trigger:** Event `return_completed` . 

#### Main Flow:
1. Sistem menghitung nominal payout: nilai sewa penuh − komisi (besaran komisi % = TBD, Pricing Validation Required). 

2. Sistem membuat payout record berstatus TERJADWAL dengan jadwal eksekusi H+1 setelah konfirmasi pengembalian. 

3. Payout record terhubung ke booking, rental tujuan, rekening tujuan rental, dan nominal bersih. 

4. Sistem menampilkan payout terjadwal di layar "Dana Saya" rental dengan status "dalam perjalanan — terjadwal". 

5. Audit event `payout_scheduled` tercatat. 

- **Alternative Flow:** A1 — Ada klaim/sengketa aktif: payout DITUNDA (tidak dijadwalkan) hingga sengketa selesai; rental diberi tahu alasan dan estimasi. 

- **Exception:** E1 — Data rekening rental belum lengkap/tidak valid: payout tidak dapat dijadwalkan; sistem meminta rental melengkapi data; diberi tahu eksplisit (bukan gagal diam-diam). 

- **Postcondition:** Rental memiliki kepastian kapan dana datang; tidak ada payout yang "hilang" tanpa jejak. 

- **Business Rules:** BR-008 (payout H+1 minus komisi); BR-030 (komisi transparan); BR-010 (tidak menalangi — payout hanya dari dana tertahan). 
- **Dependencies:** FR-RETURN-003, FR-PAYOUT-002/003, FR-ADMIN-006 (oversight). 

- **Validation Status:** Defined (besaran komisi: Pricing Validation Required). 

### FR-PAYOUT-002 — Eksekusi Payout

- **Actor:** Sistem (via Payment Gateway / mekanisme transfer) 

- **Priority:** Critical 

- **Description:** Pada jadwal H+1, sistem mengeksekusi transfer dana bersih ke rekening rental. Setiap eksekusi tercatat dengan referensi bank; status dilacak hingga BERHASIL. 
- **Precondition:** Payout record = TERJADWAL dan waktu eksekusi tiba; tidak ada sengketa yang muncul setelah penjadwalan. 

- **Trigger:** Scheduler pada waktu eksekusi. 

#### Main Flow:
1. Sistem mengubah payout record → DIPROSES dan memerintahkan transfer via PG/mekanisme yang ditetapkan. 

2. Sistem menerima konfirmasi (webhook/callback) dan mengubah status → BERHASIL beserta referensi bank/transfer. 

3. EscrowState booking → DITERUSKAN. 

4. Event tercatat di Riwayat Dana booking dan layar "Dana Saya" rental ("ditransfer + referensi bank"). 

5. Notifikasi instan ke rental: dana terkirim + nominal bersih + rincian komisi. 

6. Audit event `payout_completed` tercatat. 

- **Alternative Flow:** A1 — Sengketa muncul di antara penjadwalan dan eksekusi: eksekusi DIBATALKAN/DITUNDA; payout record ditandai; dana tetap ditahan hingga sengketa selesai. 

- **Exception:** E1 — Eksekusi gagal (rekening ditolak, gangguan PG): payout record = GAGAL → berlaku FR-PAYOUT-004 (retry).
- **Postcondition:** Dana sampai ke rental dengan jejak referensi yang lengkap; EscrowState final = DITERUSKAN. 

- **Business Rules:** BR-008; BR-031; BR-032. 
- **Dependencies:** FR-PAYOUT-001/003/004, integrasi PG (5.13), FR-AUDIT-001. 

- **Validation Status:** Defined. 

### FR-PAYOUT-003 — Pelacakan Status Payout (Layar "Dana Saya")

- **Actor:** Rental/Merchant 

- **Priority:** High 

- **Description:** Rental dapat memantau seluruh dana miliknya dalam satu layar "Dana Saya" dengan tahapan yang jelas: ditahan → dalam perjalanan → ditransfer (beserta referensi bank), ditambah rekap bulanan yang dapat diunduh. Tidak ada potongan misterius: setiap potongan dirinci. 
- **Precondition:** Rental memiliki akun terverifikasi dan minimal satu booking dengan event keuangan. 
- **Trigger:** Rental membuka layar "Dana Saya". 

#### Main Flow:
1. Sistem menampilkan ringkasan per tahap: (a) Ditahan — dana dalam escrow/claim window/deposit beku (dengan alasan jika dibekukan: alasan, durasi, cara merespons); (b) Dalam perjalanan — payout TERJADWAL/DIPROSES; (c) Ditransfer — payout 

BERHASIL beserta referensi bank dan tanggal. 

2. Setiap baris menampilkan rincian: nilai sewa penuh, komisi (nominal + dasar %), nominal bersih diterima — dengan format transparan (contoh format proposal; tarif final TBD). 

3. Rental dapat mengunduh rekap bulanan (FR-PAYOUT-005). 

4. Data read-only terhadap perhitungan; komplain potongan diarahkan ke CS dengan referensi booking. 

- **Alternative Flow:** A1 — Dana dibekukan karena klaim: baris ditahan menampilkan alasan pembekuan, estimasi durasi, dan tautan ke detail klaim/mediasi. 

- **Exception:** E1 — Selisih perhitungan yang diklaim rental: tidak diubah sepihak; dibuat tiket CS dengan audit trail perhitungan sistem sebagai bukti. 
- **Postcondition:** Rental selalu tahu posisi setiap rupiah dananya; kepercayaan pada platform terjaga. 
- **Business Rules:** BR-008; BR-030 (komisi transparan); BR-031; BR-009 (info pembekuan). 
- **Dependencies:** FR-PAYOUT-001/002, FR-PAYMENT-008 (riwayat per booking), FR-PAYOUT-005. 
- **Validation Status:** Defined. 

### FR-PAYOUT-004 — Kegagalan Payout & Retry

- **Actor:** Sistem (Background Scheduler) 

- **Priority:** High 
- **Description:** Payout yang GAGAL tidak hilang: sistem mencatat alasan kegagalan, memberi tahu rental, dan menjadwalkan ulang eksekusi (retry) hingga berhasil atau hingga batas upaya yang ditentukan — setelah itu eskalasi manual. 
- **Precondition:** Payout record = GAGAL. 
- **Trigger:** Scheduler mendeteksi payout GAGAL yang masih dalam batas retry. 

- **Main Flow:** 

1. Sistem mencatat alasan kegagalan dari PG (rekening tidak valid, gangguan, dsb.). 

2. Sistem memberi tahu rental: kegagalan + alasan + tindakan yang diperlukan (mis. perbaiki data rekening) jika masalah ada di sisi rental. 

3. Jika masalah di sisi PG/sistem: scheduler menjadwalkan ulang eksekusi (retry) dengan jeda wajar. 

4. Retry berhasil → alur FR-PAYOUT-002 langkah 2–6. Retry masih gagal → ulangi hingga batas upaya. 

5. Jika batas upaya tercapai: payout ditandai BUTUH_TINDAK_MANUAL; Admin mendapat peringatan (FR-ADMIN-006); dana tetap tercatat sebagai kewajiban (tidak hangus). 

- **Alternative Flow:** A1 — Rental memperbaiki data rekening: payout dapat dieksekusi ulang manual/terjadwal tanpa menunggu siklus retry penuh. 

- **Exception:** E1 — Dana tidak dapat disalurkan dalam waktu lama: eskalasi ke Admin + CS menghubungi rental; seluruh riwayat upaya tercatat untuk audit. 
- **Postcondition:** Tidak ada payout yang gagal diam-diam; setiap kegagalan punya pemilik tindak lanjut. 
- **Business Rules:** BR-008; BR-032 (notifikasi tiap event uang, termasuk kegagalan). 
- **Dependencies:** FR-PAYOUT-002, FR-ADMIN-006, FR-NOTIFICATION-001/002. 
- **Validation Status:** Defined (jumlah maksimum retry & interval: [TECHNICAL DECISION REQUIRED]). 

### FR-PAYOUT-005 — Rekap Bulanan Unduhan

- **Actor:** Rental/Merchant 
- **Priority:** Medium 
- **Description:** Rental dapat mengunduh rekap bulanan seluruh transaksi keuangannya (payout, komisi, refund, potongan deposit) sebagai dokumen untuk pembukuan dan keperluan pajak (komisi adalah objek pajak — transparansi potongan). 
- **Precondition:** Rental memiliki transaksi pada periode yang diminta. 
- **Trigger:** Rental memilih periode bulan dan menekan "Unduh Rekap". 

#### Main Flow:
1. Sistem mengumpulkan seluruh event keuangan rental pada periode tersebut dari ledger. 

2. Sistem menyusun rekap: per booking — nilai sewa, komisi, potongan deposit/klaim, nominal bersih, tanggal, nomor referensi. 

3. Sistem menghasilkan file unduhan (format = [TECHNICAL DECISION REQUIRED], mis. PDF/CSV) dan mencatat pengunduhan untuk audit. 
- **Alternative Flow:** A1 — Periode tanpa transaksi: unduhan tetap dapat dibuat dengan isi kosong yang dinyatakan eksplisit. 
- **Exception:** E1 — Data periode diklaim tidak lengkap oleh rental: tiket CS dengan referensi; data ledger bersifat immutable sehingga kebenaran dapat diverifikasi. 

- **Postcondition:** Rental memiliki dokumen pembukuan yang konsisten dengan data sistem. 

- **Business Rules:** BR-030; BR-031. 

- **Dependencies:** FR-PAYOUT-003, modul 5.26 (ledger). 

- **Validation Status:** Defined (format file: [TECHNICAL DECISION REQUIRED]). 

## 4.14 REVIEW — Ulasan & Reputasi
### FR-REVIEW-001 — Submit Review Dua Arah

- **Actor:** Penyewa dan Rental/Merchant 

- **Priority:** High 

- **Description:** Setelah booking SELESAI (dan claim window/deposit selesai), kedua pihak dapat saling memberi rating dan ulasan. Review bersifat dua arah: penyewa menilai rental/unit, rental menilai penyewa — menjadi fondasi reputasi dua arah. 

- **Precondition:** (1) BookingState = SELESAI. (2) DepositState = DILEPAS/DILEPAS_PENUH/DIPOTONG_SEBAGIAN (urusan deposit selesai) — atau tidak ada deposit. (3) Pihak belum pernah submit review untuk booking ini (satu review per pihak per booking). 

- **Trigger:** Masing-masing pihak membuka form review pada booking yang selesai. 

- **Main Flow:** 

1. Sistem menampilkan form review: rating (skala = Business Decision Required, mis. 1–5) + ulasan teks + (opsional) aspek terstruktur (kebersihan unit, ketepatan waktu, komunikasi — daftar aspek = Business Decision Required). 

2. Pihak mengisi dan mengirim; sistem membuat review record terhubung ke booking, pemberi, dan penerima. 

3. Sistem memvalidasi eligibilitas (FR-REVIEW-002) sebelum menyimpan. 

4. Audit event `review_submitted` tercatat; notifikasi ke pihak yang direview. 

- **Alternative Flow:** A1 — Salah satu pihak tidak memberi review: tidak wajib; reputasi dihitung dari review yang ada. Batas waktu pemberian review = Business Decision Required. 

- **Exception:** E1 — Upaya review ganda: sistem menolak (satu per pihak per booking). E2 — Ulasan mengandung kata kasar/spam: sistem menandai untuk moderasi (FR-ADMIN-003); tidak auto-publish jika terindikasi pelanggaran berat (aturan moderasi = Business Decision Required). 

- **Postcondition:** Review tercatat dan menjadi bagian reputasi penerima. 

- **Business Rules:** BR-013 (review hanya transaksi terselesaikan, dua arah — anti fake review). 

- **Dependencies:** FR-REVIEW-002/003/004, FR-ADMIN-003 (moderasi). 

- **Validation Status:** Defined (skala & aspek: Business Decision Required). 

### FR-REVIEW-002 — Cek Eligibilitas Review


- **Actor:** Sistem 

- **Priority:** High 

- **Description:** Sistem menegakkan aturan anti fake review: hanya pihak yang terlibat dalam booking yang benar-benar terselesaikan (SELESAI) yang dapat memberi review, satu kali per pihak, dan hanya dalam periode yang ditentukan. 

- **Precondition:** Ada upaya submit review. 
- **Trigger:** Setiap request submit review. 

- **Main Flow:** 

1. Sistem memeriksa: booking ada dan BookingState = SELESAI. 

2. Sistem memeriksa: pengirim adalah penyewa atau rental pada booking tersebut. 

3. Sistem memeriksa: belum ada review dari pengirim untuk booking ini. 

4. Sistem memeriksa: masih dalam periode pemberian review (periode = Business Decision Required). 

5. Jika semua lolos → review disimpan. Jika ada yang gagal → ditolak dengan alasan spesifik. 

- **Alternative Flow:** Tidak ada — semua cek bersifat wajib (AND). 

- **Exception:** E1 — Booking dibatalkan (tidak SELESAI): review tidak dapat diberikan; kekecewaan atas pembatalan disalurkan via penalti reputasi otomatis (BR-012) atau laporan ke CS, bukan via review. 

- **Postcondition:** Integritas data reputasi terjaga; tidak ada review fiktif. 

- **Business Rules:** BR-013; BR-012. 
- **Dependencies:** FR-REVIEW-001. 
- **Validation Status:** Defined. 

### FR-REVIEW-003 — Tampilan Review & Rating

- **Actor:** Penyewa (calon), Rental (profil) 
- **Priority:** High 
- **Description:** Rating agregat dan daftar ulasan ditampilkan pada profil rental dan halaman listing sebagai bahan perbandingan (mendukung P1: problem perbandingan rental). Tampilan jujur: menampilkan jumlah booking terselesaikan sebagai konteks. 
- **Precondition:** Penerima review memiliki minimal satu review yang lolos moderasi. 
- **Trigger:** Pengguna membuka profil rental atau halaman listing. 

- **Main Flow:** 

1. Sistem menghitung rating agregat penerima (rata-rata; formula & pembobotan = Business Decision Required). 

2. Sistem menampilkan: rating agregat, jumlah review, jumlah booking terselesaikan (konteks kepercayaan), dan daftar ulasan terbaru (dengan pagination). 

3. Ulasan yang sedang dalam moderasi tidak ditampilkan hingga lolos. 

- **Alternative Flow:** A1 — Belum ada review: tampilkan status jujur "Belum ada ulasan" beserta status verifikasi rental sebagai sinyal pengganti — bukan rating kosong yang menyesatkan. 

- **Exception:** E1 — Upaya manipulasi terdeteksi (mis. pola review tidak wajar): ditandai untuk Admin; tidak ada penghapusan otomatis tanpa review manusia. 
- **Postcondition:** Calon penyewa mendapat sinyal reputasi yang dapat dipercaya; rental baru tidak dihukum dengan tampilan menyesatkan. 
- **Business Rules:** BR-013. 
- **Dependencies:** FR-REVIEW-001/002, FR-ADMIN-003. 
- **Validation Status:** Defined (formula agregat: Business Decision Required). 

### FR-REVIEW-004 — Dampak Review ke Reputasi

- **Actor:** Sistem 

- **Priority:** Medium 
- **Description:** Rating yang masuk memengaruhi skor reputasi kedua belah pihak yang digunakan untuk: penalti reputasi otomatis (pembatalan oleh rental — BR-012), peringkat/kepercayaan, dan potensi pembatasan akun bagi pola buruk berulang. 
- **Precondition:** Review baru tersimpan dan lolos moderasi. 
- **Trigger:** Event `review_submitted` . 

- **Main Flow:** 

1. Sistem memperbarui skor reputasi penerima (perhitungan = Business Decision Required). 

2. Jika skor turun di bawah ambang yang ditentukan: sistem menerapkan konsekuensi bertingkat (peringatan → penurunan visibilitas listing → pembatasan → penangguhan; ambang & tingkatan = Business Decision Required). 

3. Pembatalan oleh rental memicu penalti reputasi otomatis terpisah (BR-012) di luar mekanisme review. 

4. Perubahan status reputasi dinotifikasikan ke pemilik akun dengan alasan dan cara pemulihan. 

- **Alternative Flow:** A1 — Banding atas penalti: pemilik akun dapat mengajukan banding ke CS/Admin; status ditinjau manual. 
- **Exception:** E1 — Tidak ada — konsekuensi reputasi tidak diterapkan otomatis tanpa ambang yang jelas; ambang wajib diputuskan sebelum fitur aktif. 
- **Postcondition:** Reputasi menjadi insentif perilaku baik yang transparan dan dapat diprediksi. 
- **Business Rules:** BR-012 (penalti reputasi pembatalan rental); BR-013. 
- **Dependencies:** FR-REVIEW-001/003, FR-ADMIN-001 (penangguhan akun). 
- **Validation Status:** Business Decision Required (seluruh ambang & formula reputasi). 

## 4.15 DISPUTE — Sengketa & Mediasi
### FR-DISPUTE-001 — Pembuatan Sengketa

- **Actor:** Penyewa atau Rental/Merchant 

- **Priority:** High 

- **Description:** Pihak yang dirugikan dapat membuka sengketa formal dengan memilih kategori (unit tak sesuai, kerusakan/klaim, keterlambatan/denda, mogok, dugaan penggelapan, dokumen palsu, lainnya) dan menjelaskan kronologi. Sengketa yang dibuka membekukan/menahan dana terkait hingga selesai. 

- **Precondition:** (1) Ada booking yang menjadi objek sengketa. (2) Sengketa belum pernah dibuka untuk objek/masalah yang sama (tidak duplikat). 
- **Trigger:** Pihak menekan "Buka Sengketa" dan mengisi form. 

- **Main Flow:** 

1. Sistem menampilkan form: kategori sengketa, booking terkait, kronologi, nominal yang dipersengketakan (jika ada), dan harapan penyelesaian. 

2. Pihak mengisi dan mengirim; sistem membuat dispute record berstatus DIBUKA dengan nomor tiket sengketa. 

3. Sistem menahan dana terkait: jika terkait deposit → pastikan DIBEKUKAN_KLAIM; jika terkait payout → tunda payout (FRPAYOUT-001 A1). 

4. Sistem memberi tahu pihak lawan: sengketa dibuka + tenggat respons (tenggat = Business Decision Required). 

5. Audit event `dispute_opened` tercatat. 

- **Alternative Flow:** A1 — Sengketa dari klaim deposit yang sudah ada (FR-DEPOSIT-003): dispute record terhubung ke claim record yang sama (tidak duplikat). 

- **Exception:** E1 — Sengketa dibuka untuk booking yang sudah lama selesai melewati batas (batas = Business Decision Required): sistem menolak dengan penjelasan dan mengarahkan ke jalur hukum langsung. 

- **Postcondition:** Sengketa tercatat resmi dengan nomor tiket; dana terkait aman; kedua pihak tahu tenggat. 

- **Business Rules:** BR-009; BR-021 (unit tak sesuai lapor ≤ X jam TBD); BR-022 (mogok TBD); BR-023 (penggelapan); BR-024 (buntu → hukum); BR-033. 
- **Dependencies:** FR-DISPUTE-002/003, FR-DEPOSIT-003/004, FR-PAYOUT-001, FR-NOTIFICATION-006. 
- **Validation Status:** Defined (kategori & tenggat: Business Decision Required; aspek hukum: Legal Validation Required). 

### FR-DISPUTE-002 — Lampiran Bukti

- **Actor:** Penyewa, Rental/Merchant 
- **Priority:** High 

- **Description:** Kedua pihak dapat melampirkan bukti pendukung sengketa: foto (handover/return otomatis terhubung sebagai bukti primer), dokumen, tangkapan layar komunikasi, dan tautan referensi. Bukti primer adalah dokumentasi serah terima/pengembalian yang sudah teraudit (BR-019). 
- **Precondition:** Dispute record = DIBUKA atau MEDIASI; pengunggah adalah pihak dalam sengketa. 
- **Trigger:** Pihak menekan "Tambah Bukti" pada halaman sengketa. 

- **Main Flow:** 

1. Sistem menampilkan opsi lampiran: foto/dokumen baru + bukti yang sudah ada di sistem (foto handover/return, checklist, perjanjian, riwayat pembayaran) yang dapat "dikutip" sebagai bukti tanpa upload ulang. 

2. Pihak mengunggah/memilih bukti; setiap bukti dicatat: pengunggah, waktu, jenis, keterangan. 

3. Bukti dari sistem (foto handover/return) ditandai sebagai "bukti terverifikasi sistem" (timestamp asli terjaga) — bobotnya lebih tinggi dalam mediasi. 

4. Pihak lawan dapat melihat seluruh bukti (transparansi dua arah) dan memberi tanggapan. 
- **Alternative Flow:** A1 — Bukti berupa kesaksian/kronologi tertulis: diterima sebagai keterangan pihak, dicatat, tetapi bobotnya di bawah bukti dokumenter. 
- **Exception:** E1 — File bukti tidak valid/berbahaya: ditolak dengan pesan; upaya upload file berbahaya dicatat untuk keamanan. 
- **Postcondition:** Mediasi berjalan di atas bukti yang terdokumentasi dan transparan bagi kedua pihak. 

- **Business Rules:** BR-019 (klaim berdasar foto); BR-018. 
- **Dependencies:** FR-DISPUTE-001/003, modul 5.19 (foto), FR-AUDIT-001.
- **Validation Status:** Defined. 

### FR-DISPUTE-003 — Alur Mediasi

- **Actor:** Tim Mediasi 

- **Priority:** High 

- **Description:** Tim Mediasi (pada pilot: tim inti secara manual) memfasilitasi penyelesaian sengketa berdasar bukti dokumentasi. Mediasi bersifat fasilitatif: mendorong kesepakatan, bukan memutus sepihak — kecuali para pihak menyetujui mekanisme putusan mediasi dalam perjanjian (Legal Validation Required). 
- **Precondition:** Dispute record = DIBUKA; kedua pihak sudah diberi kesempatan menyampaikan bukti/tanggapan. 
- **Trigger:** Mediator mengambil tiket sengketa dari antrean. 

#### Main Flow:
1. Mediator membuka tiket: melihat kronologi, kategori, bukti kedua pihak (termasuk bukti terverifikasi sistem), riwayat booking/pembayaran, dan perjanjian sewa yang berlaku. 

2. DisputeState → MEDIASI; kedua pihak diberi tahu mediator yang menangani + estimasi waktu. 

3. Mediator berkomunikasi dengan para pihak (via thread sengketa di platform — tercatat) untuk mengklarifikasi dan mengusulkan opsi penyelesaian (ganti unit, refund penuh/sebagian, potong deposit, penjadwalan ulang). 

4. Jika tercapai kesepakatan: kedua pihak menyetujui digital → lanjut FR-DISPUTE-004. 

5. Jika buntu: lanjut FR-DISPUTE-005 (eskalasi hukum). 

- **Alternative Flow:** A1 — Salah satu pihak tidak merespons dalam tenggat: mediator dapat melanjutkan berdasar bukti yang ada; keputusan sepihak hanya jika dasar perjanjian mengizinkan (Legal Validation Required); jika tidak → eskalasi. 

- **Exception:** E1 — Indikasi tindak pidana (penggelapan, dokumen palsu): mediator dapat langsung mengarahkan ke FR-DISPUTE-005 

- + pemblokiran akun (BR-023, BR-033) tanpa menunggu mediasi selesai. 

- **Postcondition:** Setiap sengketa mendapat penanganan manusia yang terdokumentasi; tidak ada sengketa yang menggantung tanpa pemilik. 
- **Business Rules:** BR-021; BR-022; BR-023; BR-024; BR-033. 
- **Dependencies:** FR-DISPUTE-001/002/004/005, FR-DISPUTE-006 (notifikasi), FR-AUDIT-001. 
- **Validation Status:** Legal Validation Required (kewenangan mediasi & putusan). 

### FR-DISPUTE-004 — Aksi Resolusi

- **Actor:** Tim Mediasi (mencatat) / Sistem (mengeksekusi) 
- **Priority:** High 

- **Description:** Kesepakatan/keputusan sengketa diterjemahkan menjadi aksi sistem yang konkret: refund (penuh/sebagian), potong deposit, penjadwalan ulang, atau kombinasi — dieksekusi hanya dari dana yang ditahan, tidak pernah menalangi. 
- **Precondition:** (1) Dispute record = MEDIASI. (2) Ada kesepakatan digital kedua pihak atau keputusan mediasi yang sah. 
- **Trigger:** Mediator mencatat hasil resolusi pada tiket. 

#### Main Flow:
1. Mediator memilih aksi resolusi: JENIS (refund penuh / refund sebagian + nominal / potong deposit + nominal / ganti unit / dijadwal ulang) + nominal + alasan + referensi bukti. 

2. Kedua pihak (untuk kesepakatan) menyetujui digital; sistem mencatat persetujuan (siapa, kapan). 

3. Sistem mengeksekusi sesuai jenis: refund → FR-PAYMENT-007; potong deposit → FR-DEPOSIT-005; ganti unit → booking baru/pengganti via alur booking; penjadwalan ulang → penyesuaian tanggal. 

4. DisputeState → SELESAI_DISETUJUI; dana yang tidak lagi disengketakan dilepas/diteruskan sesuai hasil. 

5. Audit event `dispute_resolved` tercatat lengkap (aksi, nominal, dasar, penyetuju). 

6. Notifikasi hasil ke kedua pihak. 
- **Alternative Flow:** A1 — Resolusi berupa ganti unit: rental menyediakan unit pengganti; jika tidak tersedia → fallback ke refund (penuh/sebagian) sesuai BR-021/BR-022. 

- **Exception:** E1 — Eksekusi finansial gagal: berlaku penanganan kegagalan masing-masing modul (refund gagal → FR-PAYMENT-007 E1); sengketa tidak ditandai selesai hingga eksekusi berhasil. 
- **Postcondition:** Sengketa tertutup dengan aksi yang tereksekusi nyata, bukan sekadar janji. 
- **Business Rules:** BR-010 (tidak menalangi); BR-021; BR-022; BR-031. 
- **Dependencies:** FR-DISPUTE-003, FR-PAYMENT-007, FR-DEPOSIT-005, FR-NOTIFICATION-006. 
- **Validation Status:** Legal Validation Required. 

### FR-DISPUTE-005 — Eskalasi ke Mekanisme Hukum

- **Actor:** Tim Mediasi / Admin 
- **Priority:** Medium 

- **Description:** Jika mediasi buntu, sengketa dieskalasi ke mekanisme hukum di luar platform. Peran platform: menyediakan paket dokumentasi lengkap (perjanjian, identitas terverifikasi, foto handover/return, riwayat pembayaran, thread mediasi) kepada pihak yang menempuh jalur hukum — bukan menjadi penasihat hukum atau pihak dalam perkara (batas peran platform — Legal Validation Required). 
- **Precondition:** Dispute record = MEDIASI dan dinyatakan buntu (kesepakatan tidak tercapai dalam batas upaya/waktu). 
- **Trigger:** Mediator menandai "Eskalasi Hukum" atau salah satu pihak menyatakan akan menempuh jalur hukum. 

#### Main Flow:
1. Mediator mencatat alasan kebuntuan; DisputeState → DIESKALASI_HUKUM. 

2. Sistem menyusun paket dokumentasi: perjanjian sewa elektronik (dengan audit trail persetujuan), data verifikasi identitas (sesuai batas hukum — Legal Validation Required), foto & checklist handover/return, riwayat pembayaran, thread mediasi. 

3. Paket diserahkan melalui mekanisme yang sah kepada pihak yang berhak/penegak hukum (prosedur penyerahan = Legal Validation Required); setiap penyerahan dicatat (kepada siapa, kapan, dasar). 

4. Dana yang disengketakan tetap ditahan/dibekukan hingga ada putusan berkekuatan hukum atau kesepakatan baru. 

5. Jika ada putusan: Admin mencatat dan mengeksekusi sesuai putusan (dengan pendampingan hukum). 

- **Alternative Flow:** A1 — Dugaan penggelapan: akun penyewa diblokir segera (BR-023); data disiapkan untuk proses hukum tanpa menunggu mediasi selesai. 
- **Exception:** Tidak ada — eskalasi adalah status terminal administratif; kelanjutan ada di luar sistem. 

- **Postcondition:** Pihak yang dirugikan memiliki paket bukti yang lengkap dan teraudit; platform tidak melampaui batas perannya.
- **Business Rules:** BR-023 (penggelapan → data untuk hukum, blokir); BR-024 (buntu → hukum); batas peran platform (Legal Validation Required). 
- **Dependencies:** FR-DISPUTE-003, FR-ADMIN-001 (blokir), FR-AUDIT-001. 
- **Validation Status:** Legal Validation Required. 

### FR-DISPUTE-006 — Notifikasi Sengketa

- **Actor:** Sistem (pengirim) / Para pihak + Tim Mediasi (penerima) 
- **Priority:** High 

- **Description:** Setiap perubahan status sengketa dikomunikasikan instan ke para pihak dan mediator: sengketa dibuka, bukti baru, mediator ditugaskan, butuh respons (dengan tenggat), kesepakatan tercapai, dieskalasi. Tidak ada pihak yang "tidak tahu" status kasusnya. 
- **Precondition:** Dispute record ada; ada perubahan status atau event yang perlu dikomunikasikan. 

- **Trigger:** Event sengketa: `dispute_opened` , bukti baru, `mediator_assigned` , permintaan respons, `dispute_resolved` , `dispute_escalated` . 

- **Main Flow:** 

1. Sistem memetakan setiap event sengketa ke template notifikasi (push + WhatsApp + inbox in-app). 

2. Notifikasi mencantumkan: nomor tiket, status baru, tindakan yang diharapkan dari penerima, dan tenggat (jika ada). 

3. Pengiriman dicatat (terkirim/gagal) untuk audit. 

- **Alternative Flow:** A1 — Pihak menonaktifkan salah satu kanal: sistem tetap mengirim via kanal yang tersedia + inbox in-app sebagai fallback yang selalu ada. 

- **Exception:** E1 — Notifikasi gagal terkirim: dicatat; inbox in-app memastikan informasi tetap dapat diakses; tidak menggugurkan tenggat secara otomatis (kebijakan tenggat = Business Decision Required). 

- **Postcondition:** Transparansi proses sengketa terjaga; tenggat yang terlewat tidak dapat berdalih "tidak diberi tahu" tanpa jejak.
- **Business Rules:** BR-032 (semangat notifikasi instan tiap event penting). 

- **Dependencies:** FR-DISPUTE-001/003/004/005, FR-NOTIFICATION-001/002/003. 

- **Validation Status:** Defined. 

## 4.16 NOTIFICATION — Notifikasi
### FR-NOTIFICATION-001 — Push Notification

- **Actor:** Sistem (pengirim) / Penyewa, Rental (penerima) 
- **Priority:** High 

- **Description:** Sistem mengirim push notification instan untuk setiap event penting — terutama setiap event uang (pembayaran diterima, refund, payout, deposit dilepas/dibekukan, klaim) — ke perangkat pengguna yang terdaftar, sebagai bagian dari janji transparansi (BR-032). 

- **Precondition:** (1) Event penting terjadi pada booking/akun pengguna. (2) Pengguna memiliki device token terdaftar dan belum menonaktifkan kategori notifikasi tersebut (FR-NOTIFICATION-004). 

- **Trigger:** Event sistem: `dp_paid` , `final_payment_received` , `booking_confirmed` , `booking_cancelled` , `refund_created` , `payout_scheduled/completed` , `deposit_frozen/released` , `claim_created` , `dispute_opened` , dan sejenisnya. 

#### Main Flow:
1. Event terjadi; sistem memetakan event ke template push (judul + isi singkat + deep link ke halaman relevan). 

2. Sistem mengirim via Notification Provider (PROVIDER TBD) ke device token pengguna. 

3. Sistem mencatat status pengiriman (terkirim/gagal) pada notification log. 

- **Alternative Flow:** A1 — Pengguna menonaktifkan push: event tetap tercatat di inbox in-app (FR-NOTIFICATION-003) sebagai fallback. 

- **Exception:** E1 — Device token kedaluwarsa/tidak valid: sistem menandai token tidak aktif dan berhenti mengirim ke token tersebut (tidak spam error). 

- **Postcondition:** Pengguna mendapat kabar instan atas setiap pergerakan uang/dana tanpa harus membuka aplikasi.
- **Business Rules:** BR-032 (notifikasi instan tiap event uang). 

- **Dependencies:** Semua FR penghasil event; FR-NOTIFICATION-003/004; integrasi Notification Provider (modul 5.27; PROVIDER TBD).
- **Validation Status:** Defined. 

### FR-NOTIFICATION-002 — Notifikasi WhatsApp

- **Actor:** Sistem (pengirim) / Penyewa, Rental (penerima) 

- **Priority:** High 

- **Description:** Sebagai kanal kedua (redundansi) di samping push, sistem mengirim notifikasi WhatsApp untuk event kritis 

- (pembayaran, konfirmasi, pembatalan, sengketa, payout) — mengingat WhatsApp adalah kanal komunikasi utama pengguna rental lokal. Memerlukan consent/opt-in nomor WhatsApp. 

- **Precondition:** (1) Event kritis terjadi. (2) Pengguna memberikan nomor WhatsApp dan consent untuk notifikasi WA. (3) Template pesan sesuai ketentuan provider/kebijakan WhatsApp. 
- **Trigger:** Event kritis yang sama dengan FR-NOTIFICATION-001 (subset prioritas tinggi). 

#### Main Flow:
1. Sistem memetakan event ke template WhatsApp yang disetujui. 

2. Sistem mengirim via Notification Provider / WhatsApp Business API (PROVIDER TBD). 

3. Status pengiriman dicatat pada notification log. 

- **Alternative Flow:** A1 — Nomor WA tidak terdaftar/tidak valid: sistem hanya mengirim push + inbox; tidak memblokir alur bisnis. 

- **Exception:** E1 — Pengiriman WA gagal (rate limit provider, nomor diblokir): dicatat; fallback ke push + inbox; tidak ada retry agresif yang berisiko diblokir provider. 
- **Postcondition:** Event kritis tersampaikan melalui kanal yang paling mungkin dibaca pengguna. 

- **Business Rules:** BR-032. 
- **Dependencies:** FR-NOTIFICATION-001/003/004; integrasi WA (modul 5.27; PROVIDER TBD). 
- **Validation Status:** Defined (daftar event "kritis" yang wajib via WA: Business Decision Required). 

### FR-NOTIFICATION-003 — Inbox In-App

- **Actor:** Penyewa, Rental/Merchant 
- **Priority:** Medium 
- **Description:** Setiap notifikasi yang dikirim sistem juga tersimpan sebagai riwayat di inbox dalam aplikasi (web responsif) — menjadi arsip yang dapat dibuka ulang kapan pun dan fallback saat kanal push/WA gagal atau dinonaktifkan. 
- **Precondition:** Pengguna login; ada notifikasi yang pernah dikirim kepadanya. 
- **Trigger:** Pengguna membuka menu notifikasi/inbox. 

#### Main Flow:
1. Sistem menampilkan daftar notifikasi kronologis (terbaru dulu) dengan status baca/belum dibaca. 

2. Setiap item menampilkan isi lengkap + waktu + tautan ke objek terkait (booking, sengketa, dsb.). 

3. Pengguna dapat menandai dibaca; badge jumlah belum dibaca diperbarui. 
- **Alternative Flow:** A1 — Inbox kosong: tampilkan status kosong yang informatif. 
- **Exception:** Tidak ada — inbox bersifat read-only arsip. 

- **Postcondition:** Tidak ada informasi penting yang hilang hanya karena notifikasi push terlewat. 

- **Business Rules:** BR-032. 
- **Dependencies:** FR-NOTIFICATION-001/002. 
- **Validation Status:** Defined (masa simpan inbox: Business Decision Required; default mengikuti retensi umum BR-038). 

### FR-NOTIFICATION-004 — Preferensi Notifikasi

- **Actor:** Penyewa, Rental/Merchant 

- **Priority:** Medium 

- **Description:** Pengguna dapat mengatur preferensi notifikasi per kategori dan per kanal (push, WhatsApp), kecuali untuk notifikasi yang bersifat wajib hukum/keamanan (mis. konfirmasi pembayaran, sengketa) yang tidak dapat dinonaktifkan sepenuhnya. 

- **Precondition:** Pengguna login. 
- **Trigger:** Pengguna membuka pengaturan notifikasi. 

#### Main Flow:
1. Sistem menampilkan matriks preferensi: kategori (transaksi/uang, booking, sengketa, pemasaran) × kanal (push, WhatsApp). 

2. Pengguna mengubah preferensi; sistem menyimpan. 

3. Kategori wajib (transaksi uang, sengketa, keamanan akun) ditandai "wajib" dan tidak dapat dimatikan — dijelaskan alasannya. 

4. Pengiriman notifikasi selanjutnya menghormati preferensi ini (FR-NOTIFICATION-001/002 memeriksa sebelum kirim). 

- **Alternative Flow:** Tidak ada. 

- **Exception:** E1 — Upaya menonaktifkan kategori wajib via manipulasi request: sistem menolak di sisi server (validasi bukan hanya di UI). 
- **Postcondition:** Pengguna mengontrol kebisingan notifikasi tanpa kehilangan informasi kritis. 
- **Business Rules:** BR-032; BR-040 (consent untuk kanal WA). 
- **Dependencies:** FR-NOTIFICATION-001/002/003. 
- **Validation Status:** Defined. 

## 4.17 ADMIN — Administrasi & Moderasi
CATATAN: Pada fase pilot, peran Admin/Tim Verifikasi/CS/Mediasi dirangkap tim inti secara manual (concierge). FR-ADMIN di bawah adalah kebutuhan fungsional peran tersebut terlepas dari siapa yang menjalankannya. 

### FR-ADMIN-001 — Kelola Pengguna

- **Actor:** Admin 

- **Priority:** High 
- **Description:** Admin dapat mencari, melihat detail, menangguhkan, memblokir, dan memulihkan akun pengguna (penyewa maupun rental) dengan alasan yang tercatat. Pemblokiran bersifat teraudit dan dapat diajukan banding. 
- **Precondition:** Pelaku adalah Admin (otorisasi peran); akun target ada. 

- **Trigger:** Admin membuka manajemen pengguna, atau eskalasi otomatis (dokumen palsu — BR-033; dugaan penggelapan — BR023). 

#### Main Flow:
1. Admin mencari/melihat detail akun: profil, status verifikasi, riwayat booking, riwayat sengketa, dan flag fraud. 

2. Admin memilih aksi: peringatan, penangguhan sementara (dengan durasi), pemblokiran permanen, atau pemulihan — wajib mengisi alasan. 

3. Sistem menerapkan aksi, mencatat (siapa admin, kapan, alasan, durasi) sebagai audit event, dan memberi tahu pemilik akun (alasan + cara banding). 

4. Akun yang diblokir: tidak dapat login/booking; booking berjalan ditangani sesuai kebijakan (dana mengikuti aturan refund/escrow, tidak disita). 

- **Alternative Flow:** A1 — Banding: pemilik akun mengajukan banding; Admin lain (atau yang sama dengan catatan) meninjau; keputusan banding tercatat. 
- **Exception:** E1 — Pemblokiran akun dengan dana tertahan: dana TIDAK disita platform; tetap mengikuti EscrowState dan 

dikembalikan/disalurkan sesuai hak. 

- **Postcondition:** Penegakan aturan akun transparan, teraudit, dan proporsional. 
- **Business Rules:** BR-023; BR-033; BR-039. 

- **Dependencies:** FR-AUDIT-001, modul 5.31. 
- **Validation Status:** Defined (durasi penangguhan & kriteria: Business Decision Required). 

### FR-ADMIN-002 — Moderasi Rental

- **Actor:** Admin 
- **Priority:** High 

- **Description:** Admin memverifikasi dan memoderasi akun rental/mitra: memeriksa identitas penanggung jawab, NIB/izin usaha (via OSS — PP 80/2019), dan dokumen kendaraan (BR-036: verifikasi mitra). Rental yang lolos mendapat badge terverifikasi; yang melanggar dapat ditangguhkan. 
- **Precondition:** Ada pengajuan verifikasi mitra dari rental atau laporan pelanggaran. 
- **Trigger:** Rental mengajukan verifikasi mitra, atau Admin membuka antrean moderasi. 

- **Main Flow:** 

1. Admin memeriksa dokumen: identitas PJ, NIB/izin usaha, dokumen kendaraan yang didaftarkan. 

2. Admin menetapkan: DISETUJUI (badge terverifikasi aktif), DITOLAK (dengan alasan + dapat mengajukan ulang), atau DITANGGUHKAN (untuk pelanggaran). 

3. Keputusan dicatat (siapa, kapan, alasan); rental diberi tahu. 

4. Rental terverifikasi tampil dengan badge pada listing dan profil. 
- **Alternative Flow:** A1 — Verifikasi berkala ulang: rental dapat diminta memperbarui dokumen kedaluwarsa (mis. STNK); status badge ditahan hingga diperbarui. 
- **Exception:** E1 — Dokumen usaha palsu: tolak + blokir (BR-033). 

- **Postcondition:** Hanya rental terverifikasi yang mendapat kepercayaan penuh di marketplace; memenuhi kanal verifikasi mitra PP 80/2019. 
- **Business Rules:** BR-036 (verifikasi mitra); BR-033. 
- **Dependencies:** FR-VERIFICATION-003 (pola review manual), FR-AUDIT-001. 
- **Validation Status:** Legal Validation Required (cakupan verifikasi NIB/OSS). 

### FR-ADMIN-003 — Moderasi Listing

- **Actor:** Admin 
- **Priority:** High 

- **Description:** Admin memoderasi listing kendaraan: memastikan foto, spesifikasi, syarat, dan harga all-in jujur dan sesuai ketentuan; menindak listing basi/menyesatkan (BR-027: listing basi turun peringkat + berlabel). 
- **Precondition:** Ada listing baru/terbit atau laporan dari pengguna. 
- **Trigger:** Listing diterbitkan, atau laporan "listing bermasalah" masuk. 

#### Main Flow:
1. Admin memeriksa listing: kelengkapan info, kewajaran harga all-in, keaslian foto (indikasi), dan kepatuhan syarat. 

2. Admin dapat: menyetujui, meminta perbaikan (dengan catatan), menurunkan peringkat/memberi label "basi" untuk listing yang tidak diperbarui, atau menonaktifkan listing yang menipu. 

3. Setiap tindakan dicatat dengan alasan; rental diberi tahu dan dapat memperbaiki/mengajukan ulang. 
- **Alternative Flow:** A1 — Moderasi ulasan: ulasan yang dilaporkan/mengandung pelanggaran ditinjau; dapat disembunyikan dengan alasan tercatat (mendukung FR-REVIEW-001 E2). 
- **Exception:** E1 — Rental berulang kali membuat listing menipu: eskalasi ke penangguhan akun (FR-ADMIN-001). 
- **Postcondition:** Kualitas dan kejujuran katalog terjaga; memenuhi kewajiban moderasi listing PP 80/2019. 
- **Business Rules:** BR-025 (penanda kebaruan); BR-026 (harga all-in); BR-027 (listing basi). 
- **Dependencies:** FR-ADMIN-001, FR-REVIEW-001, FR-AUDIT-001. 
- **Validation Status:** Defined. 

### FR-ADMIN-004 — Monitoring Transaksi

- **Actor:** Admin 
- **Priority:** High 

- **Description:** Admin memiliki dashboard monitoring seluruh transaksi: booking per state, dana per EscrowState, payout terjadwal/gagal, refund, dan anomali (lonjakan pembatalan, pola fraud). Bersifat read-only operasional; tindakan korektif via FR terkait. 
- **Precondition:** Pelaku adalah Admin. 
- **Trigger:** Admin membuka dashboard monitoring. 

#### Main Flow:
1. Sistem menampilkan agregat real-time: booking aktif per BookingState, total dana per EscrowState, payout 

- TERJADWAL/DIPROSES/GAGAL, refund DIPROSES/GAGAL, sengketa terbuka per kategori. 

2. Sistem menandai anomali untuk ditinjau (definisi anomali = Business Decision Required; tanpa ML di MVP — berbasis aturan ambang sederhana). 

3. Admin dapat drill-down ke detail booking/transaksi; setiap akses ke data sensitif dicatat (BR-039). 

4. Dari temuan, Admin menindaklanjuti via FR-ADMIN-001/005/006 atau eskalasi ke Tim Mediasi. 

- **Alternative Flow:** Tidak ada. 

- **Exception:** E1 — Akses data sensitif (KTP, rekening): hanya dengan alasan tugas dan tercatat; pelanggaran akses menjadi temuan audit internal. 
- **Postcondition:** Operasional terpantau; masalah terdeteksi sebelum membesar. 
- **Business Rules:** BR-031; BR-039. 
- **Dependencies:** Semua FR penghasil state/event; FR-AUDIT-001/002. 
- **Validation Status:** Defined. 

### FR-ADMIN-005 — Persetujuan Refund Manual

- **Actor:** Admin 
- **Priority:** High 

- **Description:** Refund yang tidak tercakup aturan otomatis (kasus khusus, nominal di atas ambang, atau hasil mediasi yang butuh eksekusi manual) memerlukan persetujuan Admin sebelum dieksekusi — sebagai kontrol atas pergerakan dana keluar. 
- **Precondition:** (1) Ada refund record berstatus MENUNGGU_PERSETUJUAN. (2) Pelaku adalah Admin dengan wewenang finansial. 
- **Trigger:** Admin membuka antrean persetujuan refund. 

#### Main Flow:
1. Sistem menampilkan detail: booking, alasan refund, nominal, dana tertahan tersedia, pemohon/asal (otomatis/mediasi/CS), dan riwayat. 

2. Admin memverifikasi nominal ≤ dana tertahan (BR-010 — sistem juga memvalidasi otomatis). 

3. Admin menyetujui → refund record → DIPROSES → eksekusi via PG (FR-PAYMENT-007). Admin menolak → record → DITOLAK dengan alasan; pemohon diberi tahu. 

4. Keputusan dicatat lengkap (siapa, kapan, alasan) sebagai audit event. 
- **Alternative Flow:** A1 — Butuh persetujuan berjenjang untuk nominal besar: ambang & jenjang = Business Decision Required; sistem mendukung status bertingkat. 
- **Exception:** E1 — Nominal melebihi dana tertahan: sistem menolak persetujuan (validasi keras BR-010); Admin tidak dapat override.
- **Postcondition:** Tidak ada dana keluar tanpa jejak persetujuan yang jelas. 
- **Business Rules:** BR-010 (aturan keras); BR-031; BR-039. 
- **Dependencies:** FR-PAYMENT-007, FR-AUDIT-001. 
- **Validation Status:** Defined (ambang persetujuan berjenjang: Business Decision Required). 

### FR-ADMIN-006 — Oversight Payout

- **Actor:** Admin 
- **Priority:** High 

- **Description:** Admin mengawasi payout: melihat antrean TERJADWAL/DIPROSES/GAGAL/BUTUH_TINDAK_MANUAL, menindaklanjuti payout yang gagal berulang, dan memastikan tidak ada dana yang menggantung tanpa pemilik tindak lanjut.
- **Precondition:** Pelaku adalah Admin. 
- **Trigger:** Admin membuka oversight payout, atau peringatan otomatis atas payout BUTUH_TINDAK_MANUAL (FR-PAYOUT-004). 

#### Main Flow:
1. Sistem menampilkan antrean payout dengan status, umur antrean, dan alasan kegagalan (jika ada). 

2. Untuk payout GAGAL: Admin melihat riwayat retry; dapat memicu eksekusi ulang manual setelah masalah diperbaiki (mis. data rekening dikoreksi rental). 

3. Untuk BUTUH_TINDAK_MANUAL: Admin menugaskan tindak lanjut (hubungi rental via CS, koreksi data, eksekusi manual tercatat). 

4. Setiap tindakan manual dicatat (siapa, kapan, apa, alasan). 

- **Alternative Flow:** A1 — Eksekusi manual di luar PG (kasus luar biasa): hanya dengan persetujuan dan pencatatan ganda (makerchecker = Business Decision Required); bukti transfer diunggah. 
- **Exception:** E1 — Dana tidak dapat disalurkan sama sekali: tetap tercatat sebagai kewajiban; tidak dihapus; dilaporkan berkala hingga selesai. 
- **Postcondition:** Setiap rupiah payout memiliki status dan pemilik tindak lanjut yang jelas. 
- **Business Rules:** BR-008; BR-010; BR-031. 
- **Dependencies:** FR-PAYOUT-002/004, FR-AUDIT-001. 
- **Validation Status:** Defined. 

## 4.18 AUDIT — Jejak Audit
### FR-AUDIT-001 — Pencatatan Audit Event

- **Actor:** Sistem 

- **Priority:** Critical 

- **Description:** Setiap event penting — terutama seluruh event keuangan, perubahan state, akses data sensitif, dan keputusan manusia (verifikasi, mediasi, admin) — dicatat ke audit log yang append-only (hanya tambah, tidak dapat diubah/dihapus oleh siapa pun termasuk Admin). 
- **Precondition:** Event penting terjadi di sistem. 
- **Trigger:** Otomatis pada setiap event dalam daftar event yang diaudit. 

- **Main Flow:** 

1. Sistem menyusun record audit dengan data minimum: timestamp (dengan zona waktu), event name, actor (siapa/sistem), booking/entity reference, state sebelum → sesudah, nominal (jika finansial), nomor referensi eksternal (jika ada), dan alasan/keterangan. 

2. Record ditulis ke audit log append-only. 

3. Untuk akses data sensitif (KTP/SIM, rekening): dicatat siapa mengakses, kapan, dan untuk keperluan apa (BR-039). 

4. Untuk persetujuan perjanjian elektronik: dicatat siapa, kapan, versi dokumen (BR-017). 
- **Alternative Flow:** Tidak ada — pencatatan bersifat wajib dan tidak dapat dinonaktifkan. 

- **Exception:** E1 — Kegagalan tulis audit: operasi bisnis yang memicunya harus GAGAL juga (fail-closed untuk event kritis finansial) atau diantrekan dengan peringatan keras — kebijakan = [TECHNICAL DECISION REQUIRED]; tidak boleh ada transaksi finansial tanpa jejak audit. 
- **Postcondition:** Seluruh aktivitas kritis dapat direkonstruksi; memenuhi kebutuhan bukti sengketa/hukum dan audit internal.
- **Business Rules:** BR-017 (audit trail perjanjian); BR-031 (immutable); BR-039 (pencatatan akses sensitif). 
- **Dependencies:** Semua FR (sebagai produsen event); modul 5.32. 
- **Validation Status:** Defined. 

### FR-AUDIT-002 — Query Audit Log

- **Actor:** Admin, Tim Mediasi (terbatas pada kasusnya) 
- **Priority:** High 

- **Description:** Pihak berwenang dapat mencari dan membaca audit log dengan filter (rentang waktu, event, booking, actor) untuk investigasi sengketa, fraud, atau audit internal — tanpa kemampuan mengubah/menghapus. 

- **Precondition:** Pelaku memiliki peran yang berwenang; untuk Tim Mediasi, akses dibatasi pada booking/sengketa yang ditanganinya. 
- **Trigger:** Pengguna berwenang membuka query audit log. 

- **Main Flow:** 

1. Pengguna memasukkan filter: rentang waktu, nama event, referensi booking, actor. 

2. Sistem menampilkan hasil kronologis read-only dengan seluruh field audit. 

3. Hasil dapat diekspor untuk kebutuhan pembuktian (format ekspor = [TECHNICAL DECISION REQUIRED]); ekspor dicatat (siapa, kapan, filter apa). 

- **Alternative Flow:** A1 — Mediasi butuh paket bukti: query yang sama menjadi dasar penyusunan paket dokumentasi (FR-DISPUTE005). 

- **Exception:** E1 — Akses di luar kewenangan (mis. mediasi membuka log booking lain): ditolak dan dicatat sebagai upaya akses tidak sah. 
- **Postcondition:** Investigasi didukung data lengkap tanpa mengorbankan integritas log. 
- **Business Rules:** BR-039. 
- **Dependencies:** FR-AUDIT-001, FR-AUDIT-003. 
- **Validation Status:** Defined. 

### FR-AUDIT-003 — Kontrol Akses Audit Log

- **Actor:** Sistem (penegak) / Admin (auditee) 
- **Priority:** Critical 
- **Description:** Akses ke audit log dikontrol ketat: hanya peran tertentu yang dapat membaca; tidak ada peran — termasuk Admin tertinggi — yang dapat mengubah atau menghapus; setiap akses baca ke log pun dicatat (meta-audit). 
- **Precondition:** Ada upaya akses (baca/tulis) ke audit log. 
- **Trigger:** Setiap operasi terhadap audit log. 

- **Main Flow:** 

1. Sistem memeriksa peran pelaku: tulis hanya oleh subsistem audit internal; baca hanya oleh peran berwenang (Admin, Tim Mediasi terbatas, auditor). 

2. Setiap upaya tulis dari luar subsistem audit → ditolak keras. 

3. Setiap akses baca dicatat ke meta-audit (siapa, kapan, filter yang digunakan). 

4. Upaya akses yang ditolak dicatat sebagai temuan keamanan. 
- **Alternative Flow:** Tidak ada. 
- **Exception:** E1 — Indikasi manipulasi (upaya hapus/ubah): peringatan keamanan prioritas tertinggi ke Admin; investigasi insiden. 
- **Postcondition:** Audit log dapat dipercaya sebagai alat bukti karena integritasnya terjaga secara sistemik. 

- **Business Rules:** BR-031; BR-039. 
- **Dependencies:** FR-AUDIT-001/002, modul 5.1 (RBAC). 

- **Validation Status:** Defined. 

_Akhir Bagian 4 (Bagian B). Total FR bagian ini: 9 (PAYMENT) + 7 (VERIFICATION) + 4 (HANDOVER) + 4 (RETURN) + 6 (DEPOSIT) + 5 (PAYOUT) + 4 (REVIEW) + 6 (DISPUTE) + 4 (NOTIFICATION) + 6 (ADMIN) + 3 (AUDIT) = 58 requirement._ 

# 5. Detail Modul
Setiap modul: tujuan, FR yang dicakup (ID saja; definisi penuh di Bagian 4), aturan kunci (BR-xxx), dan catatan validasi. FR di luar Bagian 4A (mis. FR-PAYMENT-xxx, FR-VERIFICATION-xxx) dirujuk hanya sebagai dependensi — definisinya ditulis tim Bagian 4B. 

## 5.1 Authentication & Authorization
**Tujuan modul:** Menjadi gerbang identitas dan otorisasi seluruh sistem: memastikan hanya pengguna terverifikasi yang masuk, setiap akun terikat tepat satu peran primer, dan setiap aksi melewati pemeriksaan peran di sisi server. 

**FR yang dicakup:** FR-AUTH-001 (Registrasi Penyewa), FR-AUTH-002 (Login), FR-AUTH-003 (Logout & Refresh Token), FR-AUTH-004 (Reset Password), FR-AUTH-005 (Penetapan Peran). 

#### Aturan kunci:
Registrasi memisahkan jalur penyewa vs calon rental sejak awal; peran rental aktif hanya setelah verifikasi mitra (BR-036) — FRRENTAL-001/002. 

Consent eksplisit (BR-040) wajib sebelum pengumpulan data pribadi pada registrasi. 

Otorisasi berbasis peran (RBAC) ditegakkan di sisi server untuk semua endpoint; matriks kanonis di Bagian 12. 

Perubahan peran internal hanya oleh Admin dan teraudit. 

#### Catatan validasi:
Mekanisme token (JWT vs session), masa berlaku token/access/refresh, durasi OTP, ambang lockout, dan kebijakan kekuatan sandi = [TECHNICAL DECISION REQUIRED]. 

Dukungan login pihak ketiga (mis. Google) = Business Decision Required; bila tidak ada di MVP, hanya form login. 

Teks consent final dan skema pemroses data (DriveO vs vendor e-KYC) = Legal Validation Required (lihat FR-USER-003). 

## 5.2 User Profile
**Tujuan modul:** Mengelola data profil penyewa dan hak atas data pribadinya (lihat, ubah, consent, hapus) sesuai UU PDP 27/2022, sebagai fondasi kepercayaan sebelum transaksi. 

**FR yang dicakup:** FR-USER-001 (Lihat Profil), FR-USER-002 (Ubah Profil), FR-USER-003 (Kelola Consent Data), FR-USER-004 (Pengajuan Hapus Data), FR-USER-005 (Riwayat Transaksi Penyewa). 

#### Aturan kunci:
BR-040: consent eksplisit terpisah saat upload dokumen identitas; penarikan consent tercatat dengan konsekuensinya. 

- BR-039: akses data sensitif berbasis peran + pencatatan akses — citra KTP/SIM tidak ditampilkan di halaman profil reguler. BR-038: retensi data menunggu validasi legal; penghapusan ditunda bila ada kewajiban (booking aktif/sengketa). 

- BR-031: riwayat transaksi menampilkan setiap event keuangan dengan timestamp + nomor referensi (immutable). 

#### Catatan validasi:
Masa retensi data identitas (hipotesis 90 hari, BR-016) = Validation Required; retensi umum (BR-038) = Legal Validation Required. Format unduhan ringkasan transaksi = [TECHNICAL DECISION REQUIRED]. 

Peran vendor e-KYC sebagai pemroses data (meminimalkan penyimpanan citra oleh DriveO) = Legal Validation Required. 

## 5.3 Rental / Merchant Management
**Tujuan modul:** Mengelola siklus hidup mitra rental: pendaftaran, verifikasi dokumen usaha, profil publik, staf multi-user, perjanjian merchant, rekening payout, hingga penonaktifan — sehingga hanya rental terverifikasi yang tampil di marketplace. 

**FR yang dicakup:** FR-RENTAL-001 (Registrasi Rental), FR-RENTAL-002 (Verifikasi Dokumen Mitra), FR-RENTAL-003 (Kelola Profil Rental), FRRENTAL-004 (Kelola Staf Rental), FR-RENTAL-005 (Persetujuan Perjanjian Merchant), FR-RENTAL-006 (Pengaturan Rekening Payout), FRRENTAL-007 (Nonaktifkan Rental). 

#### Aturan kunci:
BR-036: verifikasi identitas PJ + NIB/izin usaha (via OSS) + dokumen kendaraan sebelum AKTIF. 

- BR-033: dokumen palsu → tolak/blokir. 

- BR-017: perjanjian merchant disetujui SEBELUM akun aktif (click-to-accept + audit trail); teks final Legal Validation Required. 

- Peran platform: perantara + penyedia sistem, bukan pemilik kendaraan/pihak perjanjian — Legal Validation Required. 

- Rekening payout terverifikasi (kepemilikan + uji transfer mikro) sebelum payout pertama; perubahan rekening butuh verifikasi ulang (anti-fraud). 

Dashboard mencakup booking non-platform (BR-029) sebagai insentif pencatatan; data non-platform tidak masuk escrow. 

#### Catatan validasi:
Daftar dokumen mitra final, kriteria kelayakan usaha, dan perlakuan dokumen kedaluwarsa = Legal Validation Required. 

- SLA review verifikasi mitra, ambang uji transfer mikro, dan aturan penonaktifan = Business Decision Required / [TECHNICAL DECISION REQUIRED]. 

Cakupan fitur staf multi-user per tier membership (Basic/Pro/Max) = Business Decision Required; harga tier = Pricing Validation Required (TBD). 

## 5.4 Vehicle Management
**Tujuan modul:** Mengelola katalog armada rental (data, foto, dokumen, status aktif) sebagai sumber kebenaran unit yang menjadi dasar listing, ketersediaan, dan bukti kondisi pada sengketa. 

**FR yang dicakup:** FR-VEHICLE-001 (Tambah Kendaraan), FR-VEHICLE-002 (Ubah Data Kendaraan), FR-VEHICLE-003 (Upload Foto Kendaraan), FR-VEHICLE-004 (Kelola Dokumen Kendaraan), FR-VEHICLE-005 (Nonaktifkan Kendaraan). 

#### Aturan kunci:
- BR-036: unit tanpa dokumen kendaraan valid tidak boleh tampil di marketplace; dokumen kedaluwarsa → listing otomatis unpublish sementara. 

BR-033: dokumen kendaraan palsu → tolak/blokir. 

BR-039: dokumen sensitif terenkripsi, akses RBAC + pencatatan akses. 

Perubahan atribut yang tampil di listing aktif memperbarui penanda kebaruan (BR-025). 

- Nonaktif unit diblokir bila ada booking aktif/future yang memakainya; riwayat tidak pernah dihapus (non-destruktif). 

#### Catatan validasi:
Daftar dokumen kendaraan final (STNK + dokumen lain) = Legal Validation Required. 

- Jumlah foto minimum per listing, batas ukuran/tipe file = [TECHNICAL DECISION REQUIRED] / Business Decision Required. Ambang peringatan kedaluwarsa dokumen = [TECHNICAL DECISION REQUIRED]. 

## 5.5 Vehicle Availability
**Tujuan modul:** Mengelola kalender ketersediaan per unit — sumber tunggal status TERSEDIA/TIDAK untuk pencarian — yang dibentuk oleh tiga sumber: penguncian slot otomatis oleh booking (BR-028), penanda non-platform yang dicatat rental (BR-029), dan blokir manual rental. 

**FR yang dicakup:** Tidak ada FR bernomor tersendiri di Bagian 4A; modul ini diwujudkan melalui FR-BOOKING-001 (penguncian slot), FRSEARCH-004 (tampilan ketersediaan), dan FR di bawah ini yang dicatat sebagai kebutuhan eksplisit modul: 

- Kalender ketersediaan per unit (lihat/buka-tutup tanggal oleh rental; tercatat siapa/kapan). 

- Penanda order non-platform per tanggal (BR-029): rental mencatat booking WA/off-platform agar tanggal terkunci di pencarian; penanda ini TIDAK masuk escrow dan TIDAK mendapat proteksi (BR-037). 

- Aturan bentrok: satu unit, satu tanggal, satu pemegang — ditegakkan atomik saat booking dibuat (race condition ditangani, FRBOOKING-001 Exception). 

#### Aturan kunci:
BR-028: booking mengunci slot otomatis dan atomik. 

BR-029: dashboard/insentif mencatat order non-platform; BATAS JUJUR — mengurangi, bukan menghilangkan, double booking selama order WA paralel ada (fakta proposal, wajib dicantumkan di dokumentasi pengguna, bukan disembunyikan). 

BR-025/BR-027: pembaruan kalender memperbarui penanda kebaruan listing; kalender basi menurunkan peringkat. 

#### Catatan validasi:
Perilaku tanggal cocok sebagian pada pencarian = [TECHNICAL DECISION REQUIRED]. 

- Bentuk insentif pencatatan non-platform = Business Decision Required. 

- Sinkronisasi kalender dua arah dengan sistem eksternal rental = Future (bukan MVP). 

## 5.6 Rental Listing
**Tujuan modul:** Mengelola representasi publik unit di marketplace (buat, harga, publish/unpublish, freshness, arsip) dengan prinsip kejujuran informasi: harga all-in dan penanda kebaruan data. 

**FR yang dicakup:** FR-LISTING-001 (Buat Listing dari Kendaraan), FR-LISTING-002 (Atur Harga), FR-LISTING-003 (Publish/Unpublish), FRLISTING-004 (Freshness Listing), FR-LISTING-005 (Arsip Listing). 

#### Aturan kunci:
BR-026: harga all-in (tarif + deposit + antar-jemput) wajib tampil; perbandingan adil (P1). 

- BR-025: penanda "diperbarui X lalu" di hasil pencarian. 

- BR-027: listing basi otomatis turun peringkat + berlabel; rental diperingatkan sebelum dilabeli. BR-036: prasyarat publish = foto minimum + dokumen kendaraan valid + harga lengkap. 

Harga booking bersifat immutable: perubahan harga listing hanya berlaku untuk booking baru. 

Relasi MVP: satu kendaraan → satu listing aktif (keputusan desain; multi-listing per unit = Future bila diputuskan). 

#### Catatan validasi:
Ambang usia "listing basi" = Validation Required (TBD). 

- Besaran deposit, satuan periode harga, harga musiman/promo = Business Decision Required / Validation Required (TBD). Persentase DP untuk simulasi harga (BR-001) = Validation Required — simulasi tidak boleh mengarang angka. 

- Paid listing = Future Development, bukan MVP (lihat scope). 

## 5.7 Search & Filter
**Tujuan modul:** Memberikan discovery yang jujur dan adil: pencarian berbasis lokasi + tanggal + jenis, filter, sorting, dan tampilan ketersediaan + kebaruan data — menjawab problem P1 (sulit membandingkan) dan P2 (ketersediaan tidak akurat). 

**FR yang dicakup:** FR-SEARCH-001 (Pencarian), FR-SEARCH-002 (Filter), FR-SEARCH-003 (Sorting), FR-SEARCH-004 (Tampilan Ketersediaan & Penanda Kebaruan). 

#### Aturan kunci:
BR-025/BR-027: setiap hasil membawa penanda kebaruan; listing basi turun peringkat + berlabel. 

- BR-026: filter/sorting harga memakai harga all-in, bukan tarif dasar. 

- BR-028: slot yang dikunci booking tidak tampil sebagai tersedia. 

- Pencarian tanpa tanggal diberi label jujur ("ketersediaan tanggal belum dicek"); kegagalan load ketersediaan tidak boleh menampilkan "tersedia" palsu. 

- Daftar filter MVP = yang didukung proposal (jenis, rentang harga all-in, status verifikasi rental, rating minimum, transmisi/fitur dasar). 

#### Catatan validasi:
Aturan sorting default dan daftar opsi sorting final = Business Decision Required. 

- Filter tambahan di luar daftar proposal (terutama berbasis ML/personalisasi) = Future — JANGAN masuk MVP. 

Ambang "basi" (dari FR-LISTING-004) memengaruhi peringkat pencarian = Validation Required. 

## 5.8 Rental Comparison
**Tujuan modul:** Memungkinkan penyewa membandingkan rental/unit secara side-by-side berdasarkan atribut yang didukung proposal (P1): harga all-in, status verifikasi, rating & booking terselesaikan, syarat sewa, dan kebaruan data — tanpa skor komposit karangan. 

**FR yang dicakup:** Tidak ada FR bernomor tersendiri di Bagian 4A; kebutuhan modul ini diwujudkan melalui: 

- Halaman detail listing/unit: foto, spesifikasi, syarat sewa, harga all-in (BR-026), profil rental (status verifikasi BR-036, rating & jumlah booking terselesaikan, penalti reputasi BR-012 bila diputuskan tampil). 

- Tampilan perbandingan: penyewa memilih 2–3 listing untuk dibandingkan berdampingan per atribut (jumlah pembanding = [TECHNICAL DECISION REQUIRED]/Business Decision Required). 

- Penanda kebaruan (BR-025) dan label basi (BR-027) tetap tampil di mode perbandingan. 

#### Aturan kunci:
- BR-026: semua harga dalam perbandingan adalah harga all-in. 

- BR-013: rating hanya dari transaksi terselesaikan (anti fake review) — angka rating yang tampil harus dapat dipertanggungjawabkan sumbernya. 

- BR-015: hasil verifikasi identitas penyewa adalah bahan konfirmasi rental — arah sebaliknya, profil rental yang terverifikasi adalah bahan kepercayaan penyewa; keduanya dua arah. 

- DILARANG: skor gabungan/"rekomendasi terbaik versi algoritma" yang mengarang bobot — tidak didukung proposal dan masuk kategori ML/fitur future bila diputuskan. 

#### Catatan validasi:
Atribut pembanding final dan apakah penalti reputasi rental ditampilkan publik = Business Decision Required. Perbandingan berbasis personalisasi/ML = Future, bukan MVP. 

## 5.9 Booking
**Tujuan modul:** Mengelola pembuatan booking sebagai transaksi yang mengikat: pilihan tanggal → ringkasan all-in → persetujuan perjanjian elektronik → penguncian slot → penerbitan link DP, termasuk pembatalan, penolakan, dan perpanjangan. 

**FR yang dicakup:** FR-BOOKING-001 (Buat Booking & Kunci Slot), FR-BOOKING-002 (Penerbitan Link Pembayaran DP), FR-BOOKING-003 (Kedaluwarsa Otomatis Booking), FR-BOOKING-004 (Pembatalan oleh Penyewa), FR-BOOKING-005 (Pembatalan oleh Rental), FRBOOKING-006 (Penolakan oleh Rental), FR-BOOKING-007 (Perpanjangan Masa Sewa). 

#### Aturan kunci:
- BR-017: persetujuan perjanjian elektronik (click-to-accept + audit trail) WAJIB sebelum pembayaran; teks final Legal Validation Required. 

- BR-028: slot dikunci atomik saat booking dibuat; race condition menghasilkan penolakan bersih, bukan double booking. 

- BR-001: DP on-platform, besaran TBD — sistem tidak mengarang angka; BR-003: opsi bayar penuh di awal = opt-in + prioritas konfirmasi. 

- BR-005: link DP kedaluwarsa X menit (TBD) → batal otomatis (dieksekusi scheduler sebagai aktor Sistem). 

- BR-011: refund bertingkat pembatalan penyewa (TBD); BR-012: pembatalan rental → refund penuh + penalti reputasi + realokasi; BR010: refund hanya dari dana ditahan. 

- BR-034: perpanjangan via platform; BR-037: tanpa proteksi bila off-platform. 

- Perbedaan tegas: penolakan pra-konfirmasi (FR-BOOKING-006, DP kembali penuh, tanpa penalti reputasi otomatis) vs pembatalan sepihak rental (FR-BOOKING-005, penalti reputasi). 

#### Catatan validasi:
X menit kedaluwarsa (BR-005), besaran DP (BR-001), tabel refund bertingkat (BR-011), mekanisme penalti reputasi & realokasi (BR012), batas akhir pembatalan penyewa = Validation/Business Decision/Legal Validation Required — semua TBD, tidak boleh dikarang di implementasi. 

Batas waktu respons rental atas pengajuan perpanjangan = [TECHNICAL DECISION REQUIRED]/Business Decision Required. 

## 5.10 Booking State Management
**Tujuan modul:** Menegakkan siklus hidup booking sebagai DUA mesin ortogonal yang terpisah namun terpetakan — BookingState (operasional) dan EscrowState (keuangan) — sesuai desain kanonis D1–D4 source pack, sehingga tidak ada status ambigu seperti rantai campuran di proposal. 

**FR yang dicakup:** Dieksekusi melalui FR-BOOKING-001 s/d 007 (transisi operasional) dan FR-PAYMENT-xxx / FR-REFUND / FR-PAYOUT (transisi keuangan, definisi di Bagian 4B); modul ini menetapkan aturan penegakannya: 

- Setiap perubahan state booking memvalidasi: (a) state asal yang diizinkan, (b) aktor yang berhak, (c) prasyarat state keuangan pasangannya (mis. handover tidak bisa SELESAI bila EscrowState belum LUNAS — BR-007). 

- Transisi terlarang ditolak di sisi server dan dicatat sebagai anomali bila merupakan upaya manipulasi. 

Pemetaan istilah proposal ke mesin kanonis (D3): "DP_DITERIMA" = event dp_paid (bukan state); 

- "LUNAS"/"DITAHAN_ESCROW"/"DITERUSKAN" = EscrowState; "MENUNGGU_PELUNASAN" = BookingState. 

#### Aturan kunci:
BR-007: checklist handover TERKUNCI sampai EscrowState=LUNAS — penegakan oleh mesin state, bukan sekadar validasi UI. BR-004: dana tidak pernah mengendap di operasional — EscrowState hanya berubah berdasar event PG terverifikasi (webhook idempotent). 

BR-010: refund hanya dari dana ditahan — transisi ke DIREFUND_* mensyaratkan EscrowState ∈ {DITAHAN_ESCROW, LUNAS, DIBEKUKAN_KLAIM sesuai hasil mediasi}. 

Semua transisi state tercatat di audit trail dengan aktor, timestamp, dan pemicu (FR-AUDIT-001). 

#### Catatan validasi:
Detail state machine per mesin (tabel State | Trigger | Transition | Actor | Allowed | Forbidden | Side effect) ditulis di Bagian 7 oleh tim state machine, mengacu pada D1–D10 source pack. 

Kebijakan anti-fraud pada anomali transisi (mis. frekuensi upaya terlarang) = [TECHNICAL DECISION REQUIRED]. 

Setiap modul: Tujuan, FR yang dicakup, Aturan kunci (dengan rujukan BR), Catatan validasi. Baseline: responsive web app (MVP). Tanpa ML/AI, native app, telematika di MVP. 

## 5.11 DP Payment
**Tujuan:** Menangani pembayaran uang muka saat booking dibuat: pembuatan payment record bertipe `DP` yang terpisah dari record pelunasan/full, penerbitan instruksi bayar via PG, dan pencatatan hasil ke escrow. 

**FR yang dicakup:** FR-PAYMENT-001 (bayar DP), FR-PAYMENT-002 (opt-in bayar penuh), FR-PAYMENT-005 (kedaluwarsa), FR-PAYMENT006 (gagal). 

#### Aturan kunci:
BR-001 — DP dibayar on-platform; besaran persentase = TBD (Validation Required), jangan hardcode angka final. 

BR-003 — Opsi "Bayar Penuh di Awal" bersifat opt-in dengan perk prioritas konfirmasi; tipe payment record = `FULL` . 

- BR-005 — Link pembayaran DP kedaluwarsa dalam X menit (TBD) → booking batal otomatis (BookingState KEDALUWARSA), slot dibuka kembali. 

BR-017 — Perjanjian sewa elektronik wajib disetujui SEBELUM pembayaran DP dapat dilakukan. 

BR-037 — Proteksi platform hanya berlaku untuk pembayaran on-platform. 

**Catatan validasi:** Besaran DP % (hipotesis 20–30%), durasi kedaluwarsa link, dan manfaat prioritas konfirmasi → Validation Required / Business Decision Required. 

## 5.12 Final Payment
**Tujuan:** Menangani pelunasan sisa nilai sewa saat serah terima via link/QRIS yang diterbitkan otomatis, dengan gate keras: checklist handover terkunci sampai EscrowState = LUNAS. 

- **FR yang dicakup:** FR-PAYMENT-003 (pelunasan saat serah terima), FR-HANDOVER-001 (penguncian), FR-HANDOVER-002 (pembukaan kunci). 

#### Aturan kunci:
BR-002 — Pelunasan dilakukan on-platform saat serah terima (bukan tunai langsung). 

- BR-007 — Checklist TERKUNCI sampai LUNAS; sistem MENCEGAH (bukan sekadar mengecek) pengisian checklist sebelum pelunasan. 

Payment record `PELUNASAN` terpisah dari record `DP` ; nominal = total − DP terbayar. 

Booking bertipe `FULL` melewati modul ini (langsung terbuka). 

**Catatan validasi:** Tidak ada angka yang perlu divalidasi di modul ini; mekanisme penerbitan ulang link pelunasan → Defined. 

## 5.13 Payment Gateway Integration
**Tujuan:** Integrasi dengan payment gateway berizin yang memiliki fitur escrow: pembuatan transaksi, penerimaan webhook hasil pembayaran, dan eksekusi refund/payout. PG adalah pemegang dana escrow — dana tidak pernah mengendap di rekening operasional DriveO. 

**FR yang dicakup:** FR-PAYMENT-004 (webhook & idempotency), FR-PAYMENT-007 (eksekusi refund), FR-PAYOUT-002 (eksekusi payout), FR-DEPOSIT-006 (pengembalian deposit). 

#### Aturan kunci:
BR-004 — Escrow via PG berizin; rekening terpisah dari operasional; kebijakan hold & refund tertulis. 

Webhook wajib: verifikasi signature + idempotency per payment reference (tepat satu transisi state). 

- Setiap kegagalan eksekusi (refund/payout) → status GAGAL + retry terjadwal; dana tetap tercatat sebagai kewajiban hingga berhasil. 

Struktur escrow final → Legal Validation Required. 

- **Catatan validasi:** Pemilihan provider PG → Business Decision Required (PROVIDER TBD). Kebijakan retry (jumlah & interval) → [TECHNICAL DECISION REQUIRED]. Struktur rekening escrow → Legal Validation Required. 

## 5.14 Escrow / Payment State
**Tujuan:** Menjadi sumber kebenaran tunggal status dana per booking, TERPISAH dari BookingState operasional. Modul ini menegakkan aturan keras: refund/payout hanya dari dana yang ditahan; platform tidak pernah menalangi. 

**FR yang dicakup:** FR-PAYMENT-001/002/003/007 (transisi escrow), FR-PAYMENT-009 (cash tercatat — di luar escrow), FR-PAYOUT001/002 (DITERUSKAN), FR-DEPOSIT-002/004/005/006 (cabang deposit). 

#### Aturan kunci (state kanonis Bagian D):
EscrowState: MENUNGGU_DANA → DITAHAN_ESCROW → LUNAS → DITERUSKAN; cabang DIREFUND_SEBAGIAN, DIREFUND_PENUH, DIBEKUKAN_KLAIM. 

Payment record (per pembayaran): CREATED → MENUNGGU → BERHASIL | GAGAL | KEDALUWARSA; tipe: DP / PELUNASAN / FULL / CASH (cash: `is_escrow = false` ). 

- Pemetaan istilah proposal: "DP_DITERIMA" = event `dp_paid` (bukan state); "LUNAS" = EscrowState (total 100%); "DITERUSKAN" = payout selesai. 

- BR-010 — Aturan keras: refund hanya dari dana ditahan; sistem menolak refund > dana tertahan (tidak dapat di-override). 

BR-035 / BR-037 — Cash tercatat masuk GMV dan ledger (berlabel jelas), tetapi TIDAK masuk escrow dan TIDAK mendapat proteksi escrow; komisi ditagih via saldo. 

**Catatan validasi:** Tidak ada angka; yang perlu dipastikan adalah setiap transisi escrow selalu dipicu oleh event terverifikasi (webhook/keputusan), bukan asumsi. 

## 5.15 Identity Verification / e-KYC
**Tujuan:** Verifikasi identitas penyewa (KTP + SIM wajib untuk lepas kunci) via OCR + validitas format oleh vendor e-KYC, dengan review manual untuk kasus meragukan; data dienkripsi, akses RBAC, retensi terbatas, dan hak hapus pengguna. 

**FR yang dicakup:** FR-VERIFICATION-001 s.d. 006. 

- **Aturan kunci (state D5):** DRAFT → DISUBMIT → DIPROSES_OTOMATIS → BUTUH_REVIEW_MANUAL → DISETUJUI | DITOLAK (dapat resubmit). 

BR-014 — KTP + SIM wajib; OCR + review manual kasus meragukan. 

BR-015 — Hasil verifikasi diteruskan ke rental sebagai bahan konfirmasi (ringkasan, bukan citra dokumen). 

BR-016 — Data terenkripsi, akses berbasis peran, retensi 90 hari (TBD). 

BR-033 — Dokumen palsu → tolak/blokir. 

BR-039 / BR-040 — Akses sensitif tercatat; consent eksplisit terpisah (UU PDP). 

**Catatan validasi:** Vendor e-KYC → PROVIDER TBD (Business Decision Required); pertimbangkan vendor sebagai pemroses data untuk meminimalkan penyimpanan citra oleh DriveO. Durasi retensi (usulan 90 hari) & masa berlaku verifikasi → Validation Required / Legal Validation Required. Cakupan ringkasan yang boleh dilihat rental → Legal Validation Required. 

## 5.16 Rental Verification
**Tujuan:** Verifikasi mitra rental (identitas penanggung jawab, NIB/izin usaha via OSS, dokumen kendaraan) sebagai lapis pertama trust (BR-036), dikelola Admin; rental terverifikasi mendapat badge kepercayaan. 

- **FR yang dicakup:** FR-ADMIN-002 (moderasi rental); terkait FR-VERIFICATION-005 (hasil verifikasi penyewa ke rental — sisi sebaliknya). 

#### Aturan kunci:
BR-036 — Verifikasi mitra: identitas PJ, NIB/izin usaha, dokumen kendaraan. 

Memenuhi kewajiban verifikasi mitra PP 80/2019 (PMSE). 

Dokumen usaha palsu → tolak/blokir (BR-033). 

- **Catatan validasi:** Cakupan dan prosedur verifikasi NIB via OSS → Legal Validation Required. Pada pilot, dijalankan manual oleh tim inti. 

## 5.17 Electronic Rental Agreement
**Tujuan:** Perjanjian sewa elektronik yang memuat syarat, tarif, denda, dan tanggung jawab; disetujui digital oleh penyewa SEBELUM pembayaran; setiap persetujuan tercatat (siapa, kapan, versi dokumen) sebagai audit trail. 

**FR yang dicakup:** FR-VERIFICATION-007 (persetujuan click-to-accept + audit trail). Prasyarat bagi FR-PAYMENT-001 (BR-017); menjadi sumber tarif denda bagi FR-RETURN-004; menjadi bukti primer dalam FR-DISPUTE-003/005. 

#### Aturan kunci:
BR-017 — Disetujui digital SEBELUM pembayaran; mekanisme click-to-accept + audit trail (siapa/kapan/versi). 

Isi perjanjian menjadi dasar: denda keterlambatan per jam (BR-020), aturan perpanjangan (BR-034), dan rujukan mediasi. Status hukum perjanjian & opsi TTE tersertifikasi (fase growth) → Legal Validation Required. 

Peran platform: BUKAN pihak dalam perjanjian sewa → Legal Validation Required. 

**Catatan validasi:** Seluruh aspek hukum modul ini → Legal Validation Required. Template isi perjanjian per kategori kendaraan → Business Decision Required. 

## 5.18 Handover Checklist
**Tujuan:** Checklist kondisi unit baku yang diisi kedua pihak saat serah terima, TERKUNCI secara sistem sampai EscrowState = LUNAS, dan menjadi baseline perbandingan saat pengembalian. 

- **FR yang dicakup:** FR-HANDOVER-001 (kunci), FR-HANDOVER-002 (buka kunci), FR-HANDOVER-003 (pengisian), FR-HANDOVER-004 (konfirmasi ganda). 

**Aturan kunci (state D6):** TERKUNCI → TERBUKA → CHECKLIST_DIISI → DIFOTO → DIKONFIRMASI_KEDUA_PIHAK → SELESAI. 

BR-007 — Kunci sampai LUNAS (aturan keras, tanpa bypass otomatis). 

BR-018 — Checklist + foto oleh KEDUA pihak; konfirmasi sah hanya jika keduanya konfirmasi. 

**Catatan validasi:** Daftar item checklist baku (body, odometer/BBM, kelengkapan) → Business Decision Required untuk 

standardisasi. Batas waktu konfirmasi pihak kedua → Business Decision Required. 

## 5.19 Handover Photos
**Tujuan:** Dokumentasi foto kondisi unit (sudut standar + close-up cacat pra-sewa) yang terhubung ke handover record dengan timestamp dan identitas pengunggah; menjadi bukti primer ("bukti terverifikasi sistem") untuk klaim dan mediasi. 

**FR yang dicakup:** FR-HANDOVER-003 (foto handover), FR-RETURN-002 (foto return pembanding), FR-DEPOSIT-003 (klaim berdasar foto), FR-DISPUTE-002 (bukti). 

#### Aturan kunci:
BR-018 — Foto oleh kedua pihak; wajib ada sebelum konfirmasi. 

BR-019 — Klaim kerusakan berdasar perbandingan foto serah terima vs pengembalian. 

Foto disimpan di storage terkontrol akses dengan timestamp asli yang terjaga (tidak dapat diubah). 

Cacat pra-sewa yang tercatat + foto menjadi pengecualian klaim (melindungi penyewa). 

**Catatan validasi:** Standar sudut/jumlah foto minimum → Business Decision Required. Batas ukuran/resolusi teknis → [TECHNICAL DECISION REQUIRED]. 

## 5.20 Rental Period
- **Tujuan:** Mengelola masa sewa yang sedang berjalan: waktu mulai/selesai resmi, perpanjangan via platform, dan pencatatan keterlambatan. 

- **FR yang dicakup:** FR-RETURN-001 (inisiasi & deteksi telat), FR-HANDOVER-004 (mulai masa sewa), FR-RETURN-004 (denda). **Aturan kunci:** 

   - BR-034 — Perpanjangan HANYA via platform (dibuat sebagai perpanjangan/booking baru tercatat), bukan kesepakatan lisan — mencegah kebocoran proteksi. 

Masa sewa resmi dimulai saat konfirmasi serah terima kedua pihak (bukan saat booking). 

BookingState = DALAM_SEWA selama periode ini. 

- **Catatan validasi:** Mekanisme tarif perpanjangan (proporsional harian/jam) → Business Decision Required. Tanpa telematika/GPS di MVP — status periode murni berbasis konfirmasi kedua pihak. 

## 5.21 Return Process
**Tujuan:** Pengembalian unit yang terdokumentasi: checklist + foto dengan item yang sama seperti handover, konfirmasi kedua pihak, dan trigger otomatis ke claim window deposit + penjadwalan payout H+1 + perhitungan komisi. **FR yang dicakup:** FR-RETURN-001 s.d. 004. 

- **Aturan kunci (state D7):** MENUNGGU → CHECKLIST_DIISI → DIFOTO → DIKONFIRMASI → SELESAI | TERLAMBAT. BR-018 — Checklist + foto kedua pihak (item sama dengan handover, ditampilkan berdampingan). 

   - BR-020 — Denda keterlambatan per jam sesuai perjanjian; ditagih via platform. 

   - Konfirmasi penerimaan oleh rental ≠ persetujuan kondisi sempurna — klaim tetap dapat dibuat dalam claim window. 

   - Event `return_completed` memicu tiga hal: DepositState → CLAIM_WINDOW_24JAM, payout TERJADWAL H+1, komisi terhitung. 

**Catatan validasi:** Toleransi keterlambatan, aturan pembulatan denda, mekanisme penagihan denda (potong deposit vs tagihan terpisah) → Business Decision Required. 

## 5.22 Deposit
- **Tujuan:** Mengelola dana deposit: penampilan transparan di listing, penahanan 24 jam claim window, pembekuan saat klaim, dan pelepasan otomatis. 

- **FR yang dicakup:** FR-DEPOSIT-001 (tampil di listing), FR-DEPOSIT-002 (24 jam window), FR-DEPOSIT-004 (pembekuan), FR-DEPOSIT006 (pelepasan). 

**Aturan kunci (state D8):** DITAHAN → CLAIM_WINDOW_24JAM → DILEPAS | DIBEKUKAN_KLAIM → (DIPOTONG_SEBAGIAN | DILEPAS_PENUH). 

BR-009 — Deposit ditahan 24 jam claim window; ada klaim → dibekukan sampai mediasi selesai. 

BR-026 — Besaran deposit tampil sebagai bagian harga all-in di listing (tanpa biaya kejutan). 

Pelepasan otomatis oleh scheduler; kegagalan scheduler tidak boleh merugikan penyewa. 

**Catatan validasi:** Durasi 24 jam adalah ketetapan proposal (perubahan = Business Decision Required). Besaran deposit = kebijakan masing-masing rental (bukan ditetapkan platform). 

## 5.23 Claim
**Tujuan:** Penanganan klaim kerusakan oleh rental dalam claim window: pengajuan berbasis bukti foto, pembekuan deposit otomatis, dan eksekusi pemotongan berdasar keputusan final. 

**FR yang dicakup:** FR-DEPOSIT-003 (pembuatan klaim), FR-DEPOSIT-005 (pemotongan). 

#### Aturan kunci:
BR-019 — Klaim berdasar foto (perbandingan handover vs return); deposit menutup LEBIH DULU. 

Nominal klaim maksimum = nilai deposit yang ditahan; kelebihan menjadi sengketa terpisah. 

Klaim hanya sah dalam 24 jam window; setelahnya ditolak sistem. 

Eksekusi pemotongan hanya berdasar: persetujuan sukarela penyewa atau keputusan mediasi. 

**Catatan validasi:** Tenggat respons penyewa atas klaim → Business Decision Required. 

## 5.24 Refund
- **Tujuan:** Pengembalian dana ke penyewa untuk seluruh skenario pembatalan dan hasil sengketa — selalu dari dana yang ditahan, tidak pernah menalangi. 

**FR yang dicakup:** FR-PAYMENT-007 (pembuatan & eksekusi), FR-ADMIN-005 (persetujuan manual). 

#### Aturan kunci:
BR-010 — Aturan keras: refund hanya dari dana ditahan; validasi nominal ≤ dana tertahan tidak dapat di-override. 

BR-006 — Tanpa konfirmasi rental dalam SLA (TBD) → batal otomatis + DP kembali 100%. 

BR-011 — Refund bertingkat untuk pembatalan pengguna berdasar H-berapa → TBD (Validation Required). 

BR-012 — Pembatalan oleh rental → refund 100% + penalti reputasi + bantuan realokasi. 

- Refund manual/khusus → persetujuan Admin (FR-ADMIN-005); kegagalan eksekusi → retry, dana tetap tercatat sebagai kewajiban. 

**Catatan validasi:** Skema bertingkat BR-011 (H-berapa, persentase) → Validation Required. Ambang persetujuan berjenjang → Business Decision Required. 

## 5.25 Payout
**Tujuan:** Penyaluran dana sewa bersih (nilai sewa − komisi) ke rental H+1 setelah pengembalian terkonfirmasi, dengan pelacakan status penuh di layar "Dana Saya" dan penanganan kegagalan yang teraudit. 

**FR yang dicakup:** FR-PAYOUT-001 s.d. 005. 

**Aturan kunci (state D10):** TERJADWAL → DIPROSES → BERHASIL | GAGAL → (retry) → BERHASIL. BR-008 — Payout H+1 minus komisi (janji konservatif; same-day = over-deliver, bukan kewajiban). 

BR-030 — Komisi transparan per booking (nominal + dasar % ditampilkan). 

Payout DITUNDA/dibatalkan jika sengketa/klaim muncul; data rekening tidak valid → tidak dijadwalkan diam-diam. Setiap payout memiliki referensi bank; status BERHASIL mengubah EscrowState → DITERUSKAN. 

**Catatan validasi:** Besaran komisi % → Pricing Validation Required. Kebijakan retry → [TECHNICAL DECISION REQUIRED]. Mekanisme maker-checker untuk eksekusi manual luar biasa → Business Decision Required. 

## 5.26 Financial Ledger / Riwayat Dana
**Tujuan:** Buku besar immutable seluruh event keuangan per booking (payment, refund, deposit, klaim, komisi, payout) — masingmasing bertimestamp dan bernomor referensi; menjadi sumber kebenaran tunggal transparansi dana. 

**FR yang dicakup:** FR-PAYMENT-008 (riwayat per booking), FR-PAYOUT-003/005 (Dana Saya & rekap). 

#### Aturan kunci:
BR-031 — Ledger immutable: append-only, tidak dapat diedit/dihapus oleh siapa pun. 

Setiap event: timestamp, jenis, nominal, referensi (PG/internal), status, dan pihak terkait. Konsistensi: total ledger per booking harus dapat direkonsiliasi dengan EscrowState aktual. 

Mendukung rekap bulanan unduhan untuk pembukuan/pajak rental (komisi = objek pajak). 

**Catatan validasi:** Format file rekap → [TECHNICAL DECISION REQUIRED]. Tidak ada angka bisnis yang perlu divalidasi; fokus pada integritas dan rekonsiliasi. 

## 5.27 Notification
**Tujuan:** Komunikasi instan setiap event penting — terutama setiap event uang — via push notification dan WhatsApp (redundansi), dengan inbox in-app sebagai arsip/fallback dan preferensi yang dapat diatur pengguna. 

**FR yang dicakup:** FR-NOTIFICATION-001 s.d. 004; dipicu oleh FR-DISPUTE-006 dan seluruh event finansial. 

#### Aturan kunci:
- BR-032 — Notifikasi instan (push + WhatsApp) setiap event uang: dp_paid, pelunasan, refund, payout, deposit (beku/lepas), klaim. 

Setiap pengiriman dicatat (terkirim/gagal) pada notification log. 

Kategori wajib (transaksi uang, sengketa, keamanan) tidak dapat dinonaktifkan; penolakan di sisi server. Inbox in-app selalu menjadi fallback yang tidak dapat dimatikan. 

**Catatan validasi:** Provider push/WA → PROVIDER TBD (Business Decision Required). Daftar event "kritis" wajib WA & masa simpan inbox → Business Decision Required. 

## 5.28 Review & Rating
**Tujuan:** Reputasi dua arah (penyewa ↔ rental) yang hanya bersumber dari transaksi yang benar-benar terselesaikan — anti fake review — serta dampaknya ke skor reputasi dan penalti. 

**FR yang dicakup:** FR-REVIEW-001 s.d. 004. 

#### Aturan kunci:
BR-013 — Review hanya dari transaksi terselesaikan (BookingState = SELESAI), dua arah, satu per pihak per booking. 

BR-012 — Pembatalan oleh rental memicu penalti reputasi otomatis (terpisah dari mekanisme review). 

Tampilan jujur: rating agregat + jumlah review + jumlah booking terselesaikan; akun baru menampilkan "Belum ada ulasan" (bukan rating menyesatkan). 

Ulasan bermasalah → moderasi Admin (FR-ADMIN-003). 

- **Catatan validasi:** Skala rating, aspek penilaian, formula agregat, ambang & konsekuensi reputasi → seluruhnya Business Decision Required sebelum fitur aktif. 

## 5.29 Dispute & Mediation
**Tujuan:** Penanganan sengketa formal berdasar bukti dokumentasi: pembukaan tiket, lampiran bukti (dengan bukti terverifikasi sistem), mediasi fasilitatif oleh Tim Mediasi, aksi resolusi yang tereksekusi, dan eskalasi hukum jika buntu. **FR yang dicakup:** FR-DISPUTE-001 s.d. 006. 

- **Aturan kunci (state D9):** DIBUKA → MEDIASI → SELESAI_DISETUJUI | DIESKALASI_HUKUM | DITUTUP_TANPA_KESEPAKATAN. Kategori: unit tak sesuai (BR-021, lapor ≤ X jam TBD), kerusakan (BR-019), keterlambatan/denda (BR-020), mogok (BR-022, ganti/refund proporsional TBD), penggelapan (BR-023 → blokir + data untuk hukum), dokumen palsu (BR-033), buntu → hukum (BR-024). 

Dana terkait dibekukan/ditahan selama sengketa; resolusi dieksekusi hanya dari dana ditahan (BR-010). 

   - Batas peran platform: perantara + penyedia sistem, BUKAN pihak perjanjian, TIDAK menanggung kerugian → Legal Validation Required. 

- **Catatan validasi:** Kewenangan mediasi & keabsahan putusan, prosedur penyerahan data ke penegak hukum, batas waktu lapor & tenggat respons → Legal Validation Required / Business Decision Required. Pada pilot dijalankan manual oleh tim inti. 

## 5.30 Customer Support
**Tujuan:** Kanal keluhan dan bantuan pengguna/rental (kewajiban PP 80/2019): menerima keluhan, membantu kendala operasional (pembayaran, verifikasi, handover), dan meneruskan sengketa ke Tim Mediasi. 

**FR yang dicakup:** Beririsan dengan FR-ADMIN-004 (monitoring sebagai sumber temuan), FR-DISPUTE-001 (eskalasi sengketa), FRNOTIFICATION-003 (inbox sebagai arsip komunikasi). 

#### Aturan kunci:
Kanal keluhan wajib tersedia dan mudah ditemukan (PP 80/2019). 

CS tidak mengeksekusi pergerakan dana; eskalasi finansial ke Admin (FR-ADMIN-005/006) dan sengketa ke Tim Mediasi. 

Setiap tiket CS tercatat: pelapor, kategori, kronologi, tindak lanjut, status, dan waktu penyelesaian. 

- Pada pilot: dijalankan manual oleh tim inti (concierge — 20 booking pertama dilayani manual sebagai fase, bukan requirement permanen). 

**Catatan validasi:** SLA respons/penyelesaian CS → Business Decision Required. Target operasional (sengketa <5% — asumsi proposal) bukan requirement sistem. 

## 5.31 Admin & Moderation
**Tujuan:** Fungsi moderasi dan pengawasan platform: kelola pengguna, verifikasi mitra rental, moderasi listing & ulasan, monitoring transaksi, persetujuan refund manual, dan oversight payout. 

**FR yang dicakup:** FR-ADMIN-001 s.d. 006. 

#### Aturan kunci:
BR-023 / BR-033 — Pemblokiran untuk penggelapan & dokumen palsu; dana pada akun yang diblokir TIDAK disita (mengikuti escrow). 

BR-025 / BR-026 / BR-027 — Penanda kebaruan, harga all-in, listing basi turun peringkat + berlabel. 

BR-039 — Akses admin ke data sensitif berbasis peran dan tercatat. 

BR-010 — Admin tidak dapat menyetujui refund melebihi dana tertahan (validasi keras). 

Kewajiban PMSE: identitas platform jelas, kanal keluhan, moderasi listing; badan usaha sebelum pilot komersial. 

- **Catatan validasi:** Kriteria & durasi penangguhan, ambang persetujuan berjenjang, definisi anomali monitoring → Business Decision Required. Aspek badan usaha & NIB → Legal Validation Required. 

## 5.32 Audit Trail
**Tujuan:** Pencatatan append-only seluruh event penting (keuangan, perubahan state, akses sensitif, keputusan manusia) dengan kontrol akses ketat; menjadi fondasi pembuktian sengketa/hukum dan audit internal. 

**FR yang dicakup:** FR-AUDIT-001 s.d. 003. 

#### Aturan kunci:
Event wajib: booking_created, dp_paid, verification_submitted/approved/rejected, booking_confirmed, final_payment_received, handover_completed/unlocked, return_completed, claim_created, deposit_frozen/released, refund_created/completed, payout_scheduled/completed, review_submitted, dispute_opened/resolved/escalated. 

Data minimum per event: timestamp, event name, actor, entity reference, state sebelum → sesudah, nominal (jika finansial), referensi eksternal, alasan. 

BR-031 — Append-only; tidak ada peran (termasuk Admin) yang dapat mengubah/menghapus. 

BR-039 — Akses baca ke log pun dicatat (meta-audit); akses di luar kewenangan ditolak + dicatat. 

   - Kegagalan tulis audit pada event finansial kritis → operasi bisnis gagal (fail-closed) atau antrean dengan peringatan keras → [TECHNICAL DECISION REQUIRED]. 

- **Catatan validasi:** Kebijakan fail-closed vs antrean → [TECHNICAL DECISION REQUIRED]. Masa retensi audit log → mengikuti BR-038 (TBD legal). 

_Akhir Bagian 5 (Bagian B: modul 5.11–5.32)._ 

# 6. Business Rules
Semua aturan diekstrak dari Proposal DriveO v3. Status mengikuti nilai yang diizinkan: Defined | Assumption | Validation Required | Legal Validation Required | Business Decision Required | TBD. 

## BR-001 — Pembayaran DP On-Platform saat Booking
- **Deskripsi:** DP wajib dibayarkan melalui platform pada saat booking dibuat. Tidak ada opsi pembayaran DP di luar platform untuk booking yang dibuat melalui DriveO. Besaran DP = TBD (hipotesis proposal 20–30% merupakan asumsi, bukan angka final). Booking tidak masuk antrean konfirmasi rental sebelum event DP dibayar tercatat. 

- **Pengecualian:** Booking non-platform yang dicatat manual di dashboard tidak wajib mengikuti aturan ini (BR-029, BR-035); transaksi tersebut hanya dicatat sebagai data operasional tanpa proteksi platform (BR-037). 

- **Sumber Proposal:** Bab III.4, model pembayaran (skema DP + pelunasan on-platform). 
- **Status:** Defined untuk prinsip on-platform; Validation Required untuk besaran DP % (TBD). 

## BR-002 — Pelunasan On-Platform saat Serah Terima
- **Deskripsi:** Pelunasan (sisa pembayaran) dilakukan melalui platform pada saat serah terima. Sistem otomatis membuat link/QRIS pelunasan saat proses handover dimulai. Status EscrowState harus mencapai LUNAS (total 100%) sebelum checklist serah terima dapat dibuka (lihat BR-007). 

- **Pengecualian:** Jika penyewa memilih opsi bayar penuh di awal (BR-003), maka tidak ada tahap pelunasan; EscrowState langsung LUNAS setelah event pembayaran penuh. 

- **Sumber Proposal:** Bab III.4, alur pembayaran DP + pelunasan on-platform. 
- **Status:** Defined. 

## BR-003 — Opsi Bayar Penuh di Awal (Opt-In)
- **Deskripsi:** Penyewa boleh memilih membayar 100% di awal (opt-in, bukan wajib). Imbalan (perk): booking dengan pembayaran penuh mendapat prioritas konfirmasi dari rental. Sekaligus menjadi data willingness-to-pay untuk evaluasi model pembayaran. 

- **Pengecualian:** Tidak berlaku untuk booking non-platform yang dicatat manual. 
- **Sumber Proposal:** Bab III.4, model pembayaran (opsi full upfront dengan perk prioritas konfirmasi).
- **Status:** Defined. 

## BR-004 — Escrow via Payment Gateway Berizin; Dana Bukan Milik Operasional
- **Deskripsi:** Semua dana transaksi ditampung (escrow) oleh payment gateway berizin. Dana tidak boleh mengendap di rekening operasional DriveO dan tidak boleh diperlakukan sebagai saldo bebas milik operasional. Struktur hold & refund tertulis dalam kebijakan; struktur final memerlukan validasi hukum. 
- **Pengecualian:** Tidak ada — seluruh aliran dana wajib melalui mekanisme ini. 

- **Sumber Proposal:** Bab III.4 (escrow via PG berizin; dana tidak mengendap di rekening operasional); Lampiran B (peta regulasi escrow). 
- **Status:** Defined untuk prinsip; Legal Validation Required untuk struktur escrow final. 

## BR-005 — Link Pembayaran DP Kedaluwarsa → Batal Otomatis
- **Deskripsi:** Link pembayaran DP kedaluwarsa dalam X menit (nilai X = TBD, Validation Required). Jika kedaluwarsa tanpa pembayaran: booking bertransisi ke KEDALUWARSA secara otomatis, slot kendaraan terbuka kembali untuk pemesanan lain. 

- **Pengecualian:** Tidak berlaku jika pembayaran sudah masuk sebelum kedaluwarsa (event webhook dp_paid mendahului scheduler).
- **Sumber Proposal:** Bab III.4 (link DP kedaluwarsa → batal otomatis, slot terbuka). 
- **Status:** Defined untuk logika; Validation Required untuk nilai X menit (TBD). 

## BR-006 — SLA Konfirmasi Rental → Batal Otomatis + DP Kembali Penuh
- **Deskripsi:** Rental wajib mengonfirmasi booking dalam SLA konfirmasi (usulan 2 jam = asumsi, Validation Required → TBD). Jika rental tidak mengonfirmasi dalam SLA: booking batal otomatis, DP dikembalikan penuh (100%) ke penyewa. 

- **Pengecualian:** Tidak berlaku jika rental menolak (DITOLAK_RENTAL) atau penyewa membatalkan lebih dulu — masing-masing mengikuti aturan pembatalannya sendiri. 
- **Sumber Proposal:** Bab III.4 (SLA konfirmasi; tanpa konfirmasi → batal otomatis + DP kembali penuh). 
- **Status:** Defined untuk logika; Validation Required untuk nilai SLA (TBD). 

## BR-007 — Checklist Handover Terkunci sampai LUNAS
- **Deskripsi:** Checklist serah terima TERKUNCI dan tidak dapat diisi sampai EscrowState = LUNAS. Sistem MENCEGAH (bukan sekadar menampilkan peringatan) pengisian checklist sebelum pelunasan terkonfirmasi. HandoverState TERKUNCI → TERBUKA hanya dipicu oleh event final_payment_received. 

- **Pengecualian:** Tidak ada pengecualian fungsional; pemaksaan manual hanya boleh dilakukan Admin dengan audit trail (kasus insidental, bukan alur normal). 
- **Sumber Proposal:** Bab III.4 (checklist serah terima terkunci sampai LUNAS; sistem mencegah, bukan sekadar mengecek).
- **Status:** Defined. 

## BR-008 — Payout H+1 Pasca-Pengembalian Terkonfirmasi, Minus Komisi
- **Deskripsi:** Dana sewa (dikurangi komisi) diteruskan ke rental pada H+1 setelah pengembalian terkonfirmasi. Ini janji konservatif; pengiriman same-day diusahakan di awal sebagai under-promise, over-deliver. Trigger payout = event return_confirmed tanpa sengketa aktif. Komisi dipotong saat payout (lihat BR-030). 

- **Pengecualian:** Jika ada klaim aktif (deposit dibekukan) atau sengketa terbuka, payout ditunda sampai mediasi selesai (BR-009, BR024). 

- **Sumber Proposal:** Bab III.4 (settlement H+1; under-promise over-deliver; trigger komisi = pengembalian terkonfirmasi tanpa sengketa). 
- **Status:** Defined. 

## BR-009 — Deposit Ditahan 24 Jam Claim Window; Klaim → Bekukan
- **Deskripsi:** Deposit ditahan selama 24 jam setelah pengembalian (claim window) untuk menampung klaim kerusakan yang baru ditemukan. Jika klaim diajukan dalam window: deposit dibekukan (DIBEKUKAN_KLAIM) sampai mediasi/sengketa selesai. Jika tidak ada klaim: deposit dilepas otomatis setelah 24 jam. 

- **Pengecualian:** Klaim diajukan di luar window → tidak dapat memotong deposit otomatis; diselesaikan sebagai sengketa biasa atau di luar platform. 

- **Sumber Proposal:** Bab III.4 (deposit 24 jam claim window; klaim → bekukan sampai mediasi selesai).
- **Status:** Defined. 

## BR-010 — Refund Hanya dari Dana yang Ditahan; Tidak Menalangi
- **Deskripsi:** Platform tidak pernah menalangi dari kantong sendiri. Setiap refund hanya dapat berasal dari dana yang sedang ditahan (escrow/deposit). Jika dana sudah diteruskan (DITERUSKAN), refund tidak dapat diproses otomatis dan dialihkan ke jalur mediasi/keputusan bisnis. 

- **Pengecualian:** Tidak ada. 
- **Sumber Proposal:** Bab III.4 (platform tidak pernah menalangi — refund selalu dari dana yang ditahan). 

- **Status:** Defined. 

## BR-011 — Refund Bertingkat Berdasarkan H-berapa
- **Deskripsi:** Pembatalan oleh penyewa mengikuti kebijakan refund bertingkat berdasarkan H-berapa pembatalan dilakukan (misalnya H-7, H-3, H-1). Tingkat persentase refund dan ambang H = TBD (kebijakan memerlukan validasi). Kebijakan harus transparan di T&C dan mematuhi UU 8/1999 (tanpa klausul baku merugikan). 

- **Pengecualian:** Pembatalan oleh rental (BR-012) dan batal otomatis tanpa konfirmasi (BR-006) tidak mengikuti skema ini.
- **Sumber Proposal:** Bab III.4 (refund bertingkat berdasar H-berapa — [KEBIJAKAN VALIDASI]); Lampiran B (UU 8/1999). 
- **Status:** Validation Required (tingkat & ambang TBD). 

## BR-012 — Pembatalan oleh Rental → Refund Penuh + Penalti Reputasi + Realokasi
- **Deskripsi:** Jika rental membatalkan booking yang sudah dikonfirmasi: (1) penyewa menerima refund penuh (100%) dari dana yang ditahan; (2) rental dikenakan penalti reputasi (dampak pada rating/profil, mekanisme detail TBD); (3) platform membantu realokasi ke rental/unit alternatif yang tersedia. 

- **Pengecualian:** Pembatalan paksa karena force majeure — ditangani via mediasi, bukan aturan otomatis ini. 

- **Sumber Proposal:** Bab III.4 (cancellation: rental → refund penuh + penalti reputasi + bantuan realokasi). 
- **Status:** Defined untuk prinsip; Validation Required untuk mekanisme penalti reputasi (TBD). 

## BR-013 — Review Dua Arah Hanya dari Transaksi Terselesaikan
- **Deskripsi:** Rating/review dua arah (penyewa ↔ rental) hanya dapat diberikan untuk transaksi yang berstatus SELESAI. Tujuannya anti fake review. Setiap pihak hanya dapat memberi satu review per booking. 

- **Pengecualian:** Booking yang dibatalkan, kedaluwarsa, atau ditolak tidak memenuhi syarat review. 

- **Sumber Proposal:** Bab III.4 (review dua arah hanya dari transaksi terselesaikan; anti fake review). 

- **Status:** Defined. 

## BR-014 — KTP + SIM Wajib untuk Lepas Kunci; OCR Otomatis + Review Manual
- **Deskripsi:** Verifikasi identitas wajib untuk sewa lepas kunci: penyewa mengunggah KTP + SIM. Sistem melakukan OCR + pemeriksaan validitas format secara otomatis. Kasus meragukan (skor rendah, dokumen tidak jelas, ketidakcocokan data) diteruskan ke review manual oleh Tim Verifikasi. 

- **Pengecualian:** Layanan dengan sopir dan sewa korporat berada di luar scope pilot sehingga tidak tercakup aturan ini. 

- **Sumber Proposal:** Bab III.4 (e-KYC: KTP+SIM wajib lepas kunci; OCR + validitas format otomatis + review manual kasus meragukan).
- **Status:** Defined. 

## BR-015 — Hasil Verifikasi Diteruskan ke Rental sebagai Bahan Konfirmasi
- **Deskripsi:** Hasil verifikasi identitas penyewa (status disetujui/ditolak, ringkasan risiko — BUKAN dokumen mentah kecuali diperlukan dan berizin peran) diteruskan ke rental sebagai bahan pengambilan keputusan konfirmasi booking. Rental berhak menolak booking berdasar hasil verifikasi. 

- **Pengecualian:** Akses dokumen mentah KTP/SIM hanya untuk peran berwenang dengan pencatatan akses (BR-039).
- **Sumber Proposal:** Bab III.4 (hasil verifikasi diteruskan ke rental sebagai bahan konfirmasi). 
- **Status:** Defined. 

## BR-016 — Proteksi Data Verifikasi: Enkripsi, RBAC, Retensi 90 Hari (TBD), Hak Hapus
- **Deskripsi:** Data verifikasi (KTP/SIM) disimpan terenkripsi, akses berbasis peran (RBAC) dengan pencatatan akses. Retensi 90 hari = TBD (Validation Required). Pengguna berhak meminta penghapusan data (UU PDP 27/2022). Vendor e-KYC dipertimbangkan sebagai pemroses data untuk meminimalkan penyimpanan citra oleh DriveO. 

- **Pengecualian:** Retensi dapat diperpanjang jika ada sengketa/proses hukum aktif yang memerlukan bukti (dengan dasar hukum yang jelas). 

- **Sumber Proposal:** Bab III.4 (data dienkripsi; akses berbasis peran; retensi 90 hari [VALIDASI]; hapus atas permintaan); Lampiran B (UU PDP 27/2022). 

- **Status:** Defined untuk prinsip proteksi; Validation Required untuk retensi 90 hari (TBD); Legal Validation Required untuk skema pemroses data. 

## BR-017 — Perjanjian Elektronik Disetujui Digital SEBELUM Pembayaran
- **Deskripsi:** Perjanjian sewa elektronik (syarat, tarif, denda, tanggung jawab) harus disetujui secara digital oleh penyewa SEBELUM pembayaran dilakukan. Mekanisme: click-to-accept + audit trail (siapa menyetujui, kapan, versi perjanjian). Keabsahan hukum mekanisme ini memerlukan validasi hukum. 

- **Pengecualian:** Tidak ada — pembayaran tidak dapat diproses tanpa persetujuan perjanjian tercatat. 

- **Sumber Proposal:** Bab III.4 (perjanjian elektronik disetujui digital SEBELUM pembayaran; click-to-accept + audit trail); Lampiran B (UU ITE). 
- **Status:** Defined untuk urutan proses; Legal Validation Required untuk keabsahan click-to-accept. 

## BR-018 — Checklist + Foto Kondisi oleh Kedua Pihak
- **Deskripsi:** Dokumentasi serah terima wajib mencakup checklist + foto kondisi (body, odometer/BBM, kelengkapan) yang diisi/diambil oleh KEDUA pihak (penyewa dan rental). Kedua set bukti menjadi dasar klaim kerusakan (BR-019) dan mediasi. 

- **Pengecualian:** Jika salah satu pihak tidak melengkapi dokumentasi, pihak tersebut kehilangan dasar bukti untuk klaim sepihak pada poin yang tidak terdokumentasi. 
- **Sumber Proposal:** Bab III.4 (checklist + foto kondisi oleh kedua pihak: body, odometer/BBM, kelengkapan). 
- **Status:** Defined. 

## BR-019 — Klaim Kerusakan Berdasar Foto Serah Terima; Deposit Menutup Lebih Dulu
- **Deskripsi:** Klaim kerusakan hanya dapat didasarkan pada perbandingan foto serah terima (sebelum vs sesudah). Urutan penutupan kerugian: deposit menutup lebih dulu; jika tidak cukup, selisih diselesaikan via mediasi/sengketa (platform tidak menalangi — BR010). 
- **Pengecualian:** Kerusakan yang tidak tercakup foto serah terima memerlukan bukti tambahan dan diputuskan via mediasi.
- **Sumber Proposal:** Bab III.4 (klaim berdasar foto serah terima; deposit menutup lebih dulu). 
- **Status:** Defined. 

## BR-020 — Denda Keterlambatan Per Jam Sesuai Perjanjian
- **Deskripsi:** Keterlambatan pengembalian dikenakan denda per jam sesuai yang tercantum dalam perjanjian sewa elektronik yang disetujui penyewa. Besaran tarif denda per jam ditentukan oleh rental dalam template perjanjiannya (bukan angka platform).
- **Pengecualian:** Keterlambatan karena force majeure ditangani via mediasi. 

- **Sumber Proposal:** Bab III.4 (denda keterlambatan per jam sesuai perjanjian).
- **Status:** Defined. 

## BR-021 — Unit Tidak Sesuai: Lapor ≤ X Jam (TBD); Ganti Unit/Refund
- **Deskripsi:** Jika unit yang diterima tidak sesuai dengan yang dipesan, penyewa wajib melapor dalam ≤ X jam (nilai X = TBD, Validation Required). Jika laporan valid: rental wajib mengganti unit atau memberikan refund. Jika laporan lewat dari X jam, penanganan beralih ke mediasi. 
- **Pengecualian:** Ketidaksesuaian yang terbukti dari awal (misalnya foto handover berbeda) dapat diklaim walau mendekati batas waktu, diputuskan mediasi. 
- **Sumber Proposal:** Bab III.4 (unit tak sesuai: lapor ≤ X jam [TBD]; ganti unit/refund). 
- **Status:** Defined untuk logika; Validation Required untuk nilai X jam (TBD). 

## BR-022 — Mogok: Wajib Ganti Unit / Refund Proporsional (TBD)
- **Deskripsi:** Jika kendaraan mogok selama masa sewa, rental wajib mengganti unit atau memberikan refund proporsional. Rumus proporsionalitas = TBD (Validation Required). Penyewa wajib melapor segera agar rental dapat merespons. 

- **Pengecualian:** Mogok akibat kelalaian/penyalahgunaan oleh penyewa (terbukti) mengikuti ketentuan tanggung jawab dalam perjanjian, bukan refund otomatis. 
- **Sumber Proposal:** Bab III.4 (mogok: wajib ganti unit/refund proporsional [VALIDASI]). 
- **Status:** Defined untuk kewajiban; Validation Required untuk rumus proporsional (TBD). 

## BR-023 — Dugaan Penggelapan: Data + Perjanjian untuk Proses Hukum; Akun Diblokir
- **Deskripsi:** Pada dugaan penggelapan unit, data verifikasi dan perjanjian sewa elektronik dapat diserahkan untuk proses hukum. Akun penyewa yang diduga diblokir selama proses berlangsung. Penyerahan data mengikuti ketentuan hukum yang berlaku.
- **Pengecualian:** Pemblokiran bersifat sementara sampai ada keputusan; banding ditangani Admin. 
- **Sumber Proposal:** Bab III.4 (dugaan penggelapan: data + perjanjian untuk proses hukum; akun diblokir).
- **Status:** Defined untuk prinsip; Legal Validation Required untuk prosedur penyerahan data. 

## BR-024 — Sengketa Buntu → Mekanisme Hukum; Platform Sediakan Dokumentasi
- **Deskripsi:** Jika mediasi platform tidak mencapai kesepakatan (sengketa buntu), penyelesaian dilanjutkan ke mekanisme hukum. Platform menyediakan dokumentasi lengkap (perjanjian, foto handover/return, riwayat pembayaran, komunikasi tercatat) sebagai paket bukti. Peran platform adalah perantara + penyedia sistem, BUKAN pihak perjanjian sewa, dan TIDAK menanggung kerugian kerusakan/kehilangan — status peran ini memerlukan validasi hukum. 

- **Pengecualian:** Tidak ada. 

- **Sumber Proposal:** Bab III.4 (sengketa buntu → mekanisme hukum; platform sediakan dokumentasi); Batasan Proposal (peran platform — [LEGAL VALIDATION REQUIRED]). 
- **Status:** Defined untuk penyediaan dokumentasi; Legal Validation Required untuk batas peran & tanggung jawab platform. 

## BR-025 — Penanda Kebaruan Data di Hasil Pencarian
- **Deskripsi:** Setiap hasil pencarian/listing menampilkan penanda "diperbarui X menit/jam lalu" sebagai bentuk kejujuran kebaruan data ketersediaan. Penanda dihitung dari timestamp update terakhir kalender/ketersediaan unit oleh rental. 

- **Pengecualian:** Listing yang datanya belum pernah diperbarui sejak dibuat menampilkan penanda sejak pembuatan.
- **Sumber Proposal:** Bab III.4 (penanda "diperbarui X menit/jam lalu" di hasil pencarian). 
- **Status:** Defined. 

## BR-026 — Harga All-In di Listing
- **Deskripsi:** Harga yang ditampilkan di listing dan perbandingan adalah harga all-in: tarif sewa + deposit + biaya antar-jemput (bila ada). Tidak boleh ada komponen biaya wajib yang disembunyikan dari harga tampil. 

- **Pengecualian:** Biaya opsional (misalnya asuransi tambahan di fase growth) boleh ditampilkan terpisah dengan label jelas — bukan bagian harga all-in wajib. 
- **Sumber Proposal:** Bab III.4 (harga all-in: tarif + deposit + antar-jemput bila ada). 
- **Status:** Defined. 

## BR-027 — Listing Basi: Turun Peringkat + Berlabel
- **Deskripsi:** Listing yang datanya basi (tidak diperbarui melewati ambang yang ditentukan — ambang TBD/Validation Required) otomatis turun peringkat di hasil pencarian dan diberi label penanda kebasuan. Tujuannya menekan listing tidak akurat.
- **Pengecualian:** Listing baru (belum melewati ambang) tidak dikenai penalti ini. 
- **Sumber Proposal:** Bab III.4 (listing basi otomatis turun peringkat + berlabel). 
- **Status:** Defined untuk mekanisme; Validation Required untuk ambang kebasuan (TBD). 

## BR-028 — Booking Mengunci Slot Otomatis
- **Deskripsi:** Saat booking dibuat (dengan DP atau link pembayaran aktif), slot ketersediaan kendaraan untuk rentang tanggal tersebut terkunci otomatis sehingga tidak dapat dipesan pihak lain. Slot terbuka kembali jika booking batal/kedaluwarsa/ditolak. BATAS JUJUR: mengurangi, bukan menghilangkan, risiko double booking selama order paralel via WA masih ada. 

- **Pengecualian:** Booking non-platform yang dicatat manual tetap dicatat di kalender (BR-029) untuk meminimalkan bentrok, tetapi penguncian otomatis hanya berlaku untuk booking platform. 
- **Sumber Proposal:** Bab III.4 (booking mengunci slot otomatis; batas jujur double booking). 
- **Status:** Defined. 

## BR-029 — Dashboard Mencakup Booking Non-Platform (Catat Manual)
- **Deskripsi:** Dashboard operasional rental wajib dapat mencatat booking non-platform (misalnya order via WA) secara manual. Imbalannya: riwayat pelanggan terpusat. Data non-platform masuk kalender ketersediaan untuk mengurangi bentrok.
- **Pengecualian:** Booking non-platform tidak mendapat proteksi platform (BR-037) dan tidak masuk GMV komisi kecuali dicatat sebagai cash (BR-035). 
- **Sumber Proposal:** Bab III.4 (dashboard mencakup booking non-platform; catat manual; riwayat pelanggan terpusat).
- **Status:** Defined. 

## BR-030 — Komisi Dipotong saat Payout; Besaran TBD; Transparan per Booking
- **Deskripsi:** Komisi platform dihitung sebagai % dari nilai sewa penuh, dipotong pada saat payout (bukan di muka). Besaran % = TBD (Pricing Validation Required). Setiap payout menampilkan rincian transparan ke rental dengan format: "Anda terima RpX dari RpY — komisi Z%" (angka di proposal hanya contoh ilustratif, bukan tarif final). Trigger komisi = pengembalian terkonfirmasi tanpa sengketa. 
- **Pengecualian:** Booking non-platform yang tidak dicatat sebagai cash tidak dikenai komisi. 

- **Sumber Proposal:** Bab III.4 (komisi dipotong saat payout; besaran [PRICING VALIDATION REQUIRED]; transparansi format contoh; trigger = pengembalian terkonfirmasi tanpa sengketa). 
- **Status:** Defined untuk mekanisme & trigger; Business Decision Required untuk besaran % (TBD). 

## BR-031 — Riwayat Dana Immutable: Timestamp + Nomor Referensi
- **Deskripsi:** Tab "Riwayat Dana" per booking mencatat setiap event keuangan dengan timestamp dan nomor referensi. Catatan bersifat immutable — tidak dapat diedit atau dihapus oleh pihak mana pun termasuk Admin. Koreksi hanya boleh dilakukan melalui event koreksi baru yang merujuk event asal (append-only). 
- **Pengecualian:** Tidak ada. 
- **Sumber Proposal:** Bab III.4 (Riwayat Dana per booking: setiap event bertimestamp + nomor referensi, immutable/tidak bisa diedit).
- **Status:** Defined. 

## BR-032 — Notifikasi Instan Setiap Event Uang
- **Deskripsi:** Setiap event yang melibatkan uang (DP diterima, pelunasan, payout terjadwal/berhasil/gagal, refund, deposit ditahan/dilepas/dipotong, klaim) memicu notifikasi instan via push + WhatsApp kepada pihak terkait. Email bersifat pelengkap bila dibutuhkan. 

- **Pengecualian:** Jika provider notifikasi gagal, event tetap tercatat di ledger dan notifikasi di-retry sesuai strategi retry (lihat Bagian 10). 
- **Sumber Proposal:** Bab III.4 (notifikasi instan push + WhatsApp setiap event uang). 
- **Status:** Defined. 

## BR-033 — Dokumen Palsu → Tolak/Blokir
- **Deskripsi:** Jika dokumen verifikasi (identitas penyewa atau dokumen mitra) terbukti palsu: pengajuan ditolak; akun dapat diblokir. Kasus berulang atau terindikasi penipuan diteruskan sesuai prosedur hukum yang berlaku. 

- **Pengecualian:** Ketidakjelasan dokumen karena kualitas foto (bukan indikasi palsu) diarahkan ke resubmit, bukan penolakan langsung. 
- **Sumber Proposal:** Bab III.4 (dokumen palsu → tolak/blokir). 
- **Status:** Defined; Legal Validation Required untuk prosedur pelaporan penipuan. 

## BR-034 — Perpanjangan Sewa via Platform
- **Deskripsi:** Perpanjangan masa sewa wajib dilakukan melalui platform (booking extension), sehingga ketersediaan, pembayaran tambahan, dan perjanjian tetap tercatat. Perpanjangan mengubah tanggal selesai booking dan memicu penyesuaian pembayaran.
- **Pengecualian:** Tidak ada — perpanjangan off-platform tidak tercatat dan tidak mendapat proteksi (BR-037).
- **Sumber Proposal:** Bab III.4 (perpanjangan sewa via platform). 
- **Status:** Defined. 

## BR-035 — Cash yang Dicatat Tetap Masuk GMV; Komisi Ditagih via Saldo
- **Deskripsi:** Fallback anti-disintermediasi: jika transaksi tunai (cash) dicatat di dashboard, nilainya tetap masuk perhitungan GMV. Komisi atas transaksi cash ditagih ke rental melalui mekanisme saldo/tagihan (bukan potong payout, karena tidak ada aliran dana 

via platform). 
- **Pengecualian:** Booking non-platform yang tidak dicatat sama sekali berada di luar sistem dan tidak dihitung. 
- **Sumber Proposal:** Bab III.4 (fallback anti-disintermediasi: cash tercatat masuk GMV, komisi ditagih via saldo).
- **Status:** Defined untuk mekanisme; Business Decision Required untuk detail skema penagihan saldo (TBD). 

## BR-036 — Verifikasi Mitra: Identitas PJ, NIB/Izin Usaha, Dokumen Kendaraan
- **Deskripsi:** Rental mitra wajib lolos verifikasi: (1) identitas penanggung jawab (PJ); (2) NIB/izin usaha (verifikasi via OSS sesuai PP 80/2019); (3) dokumen kendaraan (STNK/BPKB atau bukti kepemilikan/penguasaan yang sah). Rental belum terverifikasi tidak dapat mempublikasikan listing. 
- **Pengecualian:** Tidak ada untuk fase pilot; seluruh mitra pilot wajib terverifikasi. 
- **Sumber Proposal:** Bab III.4 (verifikasi mitra: identitas PJ, NIB/izin usaha, dokumen kendaraan); Lampiran B (PP 80/2019). 
- **Status:** Defined; Legal Validation Required untuk standar bukti kepemilikan kendaraan yang sah. 

## BR-037 — Proteksi Platform Hanya untuk Transaksi On-Platform
- **Deskripsi:** Proteksi platform (refund otomatis, mediasi sengketa, jaminan dokumentasi) hanya berlaku untuk transaksi yang sepenuhnya dilakukan on-platform (DP + pelunasan via DriveO). Transaksi non-platform yang dicatat manual tidak mendapat proteksi. 
- **Pengecualian:** Tidak ada. 
- **Sumber Proposal:** Bab III.4 (proteksi — refund, mediasi — hanya untuk transaksi on-platform). 
- **Status:** Defined. 

## BR-038 — Retensi Data Transaksi & Dokumen (TBD, Legal)
- **Deskripsi:** Data transaksi dan dokumen terkait (perjanjian, bukti pembayaran, foto handover/return) wajib disimpan selama periode retensi yang ditentukan. Periode retensi = TBD dan memerlukan validasi hukum (kewajiban perpajakan, pembuktian sengketa). Lihat juga BR-016 untuk retensi khusus data verifikasi identitas. 

- **Pengecualian:** Data yang menjadi bukti sengketa/proses hukum aktif dipertahankan melewati periode retensi standar sampai proses selesai. 
- **Sumber Proposal:** Bab III.4 (retensi data transaksi & dokumen — [TBD, legal]); Lampiran B. 
- **Status:** Legal Validation Required (periode TBD). 

## BR-039 — Akses Data Sensitif Berbasis Peran + Pencatatan Akses
- **Deskripsi:** Akses ke data sensitif (KTP/SIM, dokumen mitra, data keuangan detail) dibatasi berbasis peran (RBAC). Setiap akses ke data sensitif dicatat (siapa, kapan, data apa, tujuan). Akses di luar peran → ditolak sistem. 

- **Pengecualian:** Akses darurat oleh Admin untuk penanganan insiden keamanan — tetap tercatat dan wajib direview.
- **Sumber Proposal:** Bab III.4 (akses data sensitif berbasis peran + pencatatan akses); Lampiran B (UU PDP 27/2022).
- **Status:** Defined. 

## BR-040 — Consent Eksplisit Terpisah saat Upload Dokumen
- **Deskripsi:** Saat mengunggah dokumen identitas, pengguna memberikan consent eksplisit yang terpisah (tidak digabung dengan persetujuan T&C umum). Consent mencakup: tujuan terbatas (verifikasi & penanganan sengketa), hak menarik consent, dan hak hapus data (UU PDP 27/2022). 
- **Pengecualian:** Tidak ada — upload tanpa consent tercatat tidak boleh diproses. 
- **Sumber Proposal:** Lampiran B (UU PDP 27/2022: consent eksplisit terpisah saat upload; tujuan terbatas; hak hapus & tarik consent). 
- **Status:** Defined untuk kewajiban consent; Legal Validation Required untuk redaksional consent. 

## BR-041 — Kanal Keluhan Wajib (PP 80/2019)
- **Deskripsi:** Platform wajib menyediakan kanal keluhan yang mudah diakses pengguna dan rental, sesuai kewajiban PMSE (PP 80/2019). Setiap keluhan tercatat, memiliki nomor tiket, dan memiliki SLA respons (nilai SLA = TBD, Validation Required).
- **Pengecualian:** Tidak ada. 
- **Sumber Proposal:** Lampiran B (PP 80/2019: kanal keluhan); Bab III.4 (Customer Support menerima keluhan). 
- **Status:** Defined untuk kewajiban kanal; Validation Required untuk SLA respons (TBD). 

## BR-042 — Identitas Platform Jelas & Moderasi Listing (PP 80/2019)
- **Deskripsi:** Platform menampilkan identitas penyelenggara secara jelas (nama badan usaha, kontak) dan melakukan moderasi listing (konten dilarang, informasi menyesatkan). Badan usaha wajib berdiri sebelum pilot komersial. 

- **Pengecualian:** Fase concierge/pra-komersial mengikuti jadwal pendirian badan usaha yang ditetapkan tim. 

- **Sumber Proposal:** Lampiran B (PP 80/2019: identitas platform jelas; moderasi listing; badan usaha sebelum pilot komersial).
- **Status:** Defined; Legal Validation Required untuk bentuk badan usaha & waktu pendirian. 

## BR-043 — Peran Platform Bukan Pihak Perjanjian; Tidak Menanggung Kerugian
- **Deskripsi:** Peran platform dibatasi sebagai perantara + penyedia sistem. Platform BUKAN pemilik kendaraan, BUKAN pihak dalam perjanjian sewa, dan TIDAK menanggung kerugian atas kerusakan/kehilangan unit. Batasan ini harus tercermin dalam perjanjian elektronik dan T&C. 

- **Pengecualian:** Tidak ada. 

- **Sumber Proposal:** Batasan Proposal (peran platform — [LEGAL VALIDATION REQUIRED]). 
- **Status:** Legal Validation Required. 

## BR-044 — Komisi sebagai Objek Pajak; Transparansi Potongan
- **Deskripsi:** Komisi platform diperlakukan sebagai objek pajak sesuai ketentuan perpajakan. Setiap potongan komisi ditampilkan transparan di layar "Dana Saya" rental (BR-030). Detail perlakuan pajak difinalisasi dengan konsultan pajak pre-launch.
- **Pengecualian:** Tidak ada. 

- **Sumber Proposal:** Lampiran B (pajak: komisi sebagai objek pajak; transparansi potongan; konsultan pajak pre-launch). 

- **Status:** Defined untuk prinsip transparansi; Legal Validation Required untuk perlakuan pajak final. 

# 7. State Machine

## 7.0 Pemisahan Kanonis: BookingState vs EscrowState

Proposal mencampur status operasional dan status keuangan dalam satu rantai: `MENUNGGU_DP` → `DP_DITERIMA` → `MENUNGGU_PELUNASAN` → `LUNAS` → `DITAHAN_ESCROW` → `DITERUSKAN`. Desain kanonis SRS memisahkan keduanya menjadi dua mesin ortogonal yang berjalan paralel per booking:

- **BookingState** = siklus operasional (apakah sewa berjalan, batal, selesai).
- **EscrowState** = posisi dana (apakah dana ditahan, lunas, diteruskan, direfund).

Keduanya dikorelasikan lewat event yang sama (misalnya event `dp_paid` memajukan kedua mesin sekaligus), tetapi tidak boleh ada satu state gabungan. Aturan keras: **refund/payout hanya boleh dieksekusi dari dana yang sedang ditahan** (`EscrowState` ∈ {`DITAHAN_ESCROW`, `LUNAS`, `DIBEKUKAN_KLAIM`} sesuai konteks).

### Tabel Pemetaan Istilah Proposal → Desain Kanonis

| Istilah Proposal | Desain Kanonis | Keterangan |
|---|---|---|
| MENUNGGU_DP | BookingState.MENUNGGU_DP | Menunggu pembayaran DP |
| DP_DITERIMA | BUKAN state — melainkan EVENT `dp_paid` | Memicu BookingState MENUNGGU_DP → MENUNGGU_KONFIRMASI_RENTAL DAN EscrowState MENUNGGU_DANA → DITAHAN_ESCROW |
| MENUNGGU_PELUNASAN | BookingState.MENUNGGU_PELUNASAN | Menunggu pelunasan saat handover |
| LUNAS | EscrowState.LUNAS | Total dana 100% diterima & ditahan |
| DITAHAN_ESCROW | EscrowState.DITAHAN_ESCROW | DP (atau dana lain) sedang ditahan PG |
| DITERUSKAN | EscrowState.DITERUSKAN | Payout ke rental selesai |

## 7.1 Booking State Machine

| State | Trigger | Transition (dari → ke) | Actor | Allowed | Forbidden |
|---|---|---|---|---|---|
| MENUNGGU_DP | booking_created | (awal) → MENUNGGU_DP | Penyewa | Ya | — |
| MENUNGGU_DP | dp_paid | MENUNGGU_DP → MENUNGGU_KONFIRMASI_RENTAL | Sistem (webhook PG) | Ya | — |
| MENUNGGU_DP | dp_link_expired | MENUNGGU_DP → KEDALUWARSA | Sistem (scheduler) | Ya | — |
| MENUNGGU_DP | cancelled_by_renter | MENUNGGU_DP → DIBATALKAN | Penyewa | Ya | — |
| MENUNGGU_KONFIRMASI_RENTAL | confirmed_by_rental | MENUNGGU_KONFIRMASI_RENTAL → TERKONFIRMASI | Rental | Ya | — |
| MENUNGGU_KONFIRMASI_RENTAL | rejected_by_rental | MENUNGGU_KONFIRMASI_RENTAL → DITOLAK_RENTAL | Rental | Ya | — |
| MENUNGGU_KONFIRMASI_RENTAL | sla_expired | MENUNGGU_KONFIRMASI_RENTAL → DIBATALKAN | Sistem (scheduler) | Ya | — |
| MENUNGGU_KONFIRMASI_RENTAL | cancelled_by_renter | MENUNGGU_KONFIRMASI_RENTAL → DIBATALKAN | Penyewa | Ya | — |
| TERKONFIRMASI | handover_started | TERKONFIRMASI → MENUNGGU_PELUNASAN | Rental / Sistem | Ya | — |
| TERKONFIRMASI | cancelled_by_renter | TERKONFIRMASI → DIBATALKAN | Penyewa | Ya | — |
| TERKONFIRMASI | cancelled_by_rental | TERKONFIRMASI → DIBATALKAN | Rental | Ya | — |
| MENUNGGU_PELUNASAN | final_payment_received | MENUNGGU_PELUNASAN → DALAM_SEWA | Sistem (webhook PG) | Ya | — |
| MENUNGGU_PELUNASAN | cancelled_by_renter | MENUNGGU_PELUNASAN → DIBATALKAN | Penyewa | Ya | — |
| MENUNGGU_PELUNASAN | cancelled_by_rental | MENUNGGU_PELUNASAN → DIBATALKAN | Rental | Ya | — |
| DALAM_SEWA | extended | DALAM_SEWA → DALAM_SEWA | Penyewa + Rental (setuju) | Ya | — |
| DALAM_SEWA | return_confirmed | DALAM_SEWA → SELESAI | Rental (+ Penyewa konfirmasi) | Ya | — |
| DALAM_SEWA | dispute_opened | DALAM_SEWA → (tetap) DALAM_SEWA, flag sengketa aktif | Penyewa / Rental | Ya | — |
| KEDALUWARSA | — | terminal | — | — | Semua transisi keluar dilarang |
| DIBATALKAN | — | terminal | — | — | Semua transisi keluar dilarang |
| DITOLAK_RENTAL | — | terminal | — | — | Semua transisi keluar dilarang |
| SELESAI | review_submitted | SELESAI → SELESAI (flag reviewed) | Penyewa / Rental | Ya | Transisi ke state lain dilarang |

> **Catatan anti-buntu:** setiap state non-terminal memiliki minimal satu trigger keluar (event pengguna, rental, atau scheduler). Tidak ada state yang menunggu selamanya tanpa timer.

## 7.2 Payment / Escrow State Machine

Mesin ini menggambarkan posisi DANA per booking (`EscrowState`). Terpisah dari Payment record individual.

| State | Trigger | Transition (dari → ke) | Actor | Allowed | Forbidden | Side effect |
|---|---|---|---|---|---|---|
| MENUNGGU_DANA | booking_created | (awal) → MENUNGGU_DANA | Sistem | Ya | — | Belum ada dana ditahan |
| MENUNGGU_DANA | dp_paid | MENUNGGU_DANA → DITAHAN_ESCROW | Sistem (webhook PG) | Ya | — | DP tertahan di escrow; ledger mencatat event dp_paid; notifikasi instan (BR-031, BR-032) |
| DITAHAN_ESCROW | final_payment_received | DITAHAN_ESCROW → LUNAS | Sistem (webhook PG) | Ya | — | Total sewa 100% diterima; Handover checklist terbuka (BR-007) |
| DITAHAN_ESCROW | full_paid_upfront | DITAHAN_ESCROW → LUNAS | Sistem (webhook PG) | Ya | — | Kasus opt-in bayar penuh di awal (BR-003) |
| DITAHAN_ESCROW | refund_full | DITAHAN_ESCROW → DIREFUND_PENUH | Sistem / Admin | Ya | Dilarang jika dana sudah DITERUSKAN | Refund penuh ke penyewa dari dana ditahan (BR-010) |
| DITAHAN_ESCROW | refund_partial | DITAHAN_ESCROW → DIREFUND_SEBAGIAN | Sistem / Admin | Ya | Dilarang jika dana sudah DITERUSKAN | Refund bertingkat (BR-011) |
| DITAHAN_ESCROW | claim_opened | DITAHAN_ESCROW → DIBEKUKAN_KLAIM | Rental / Sistem | Ya (dalam claim window) | Dilarang di luar window otomatis | Dana deposit dibekukan; rental dinotifikasi alasan & durasi (BR-009) |
| LUNAS | payout_executed | LUNAS → DITERUSKAN | Sistem (scheduler) | Ya, hanya H+1 pasca return terkonfirmasi & tanpa sengketa | Dilarang jika sengketa/klaim aktif; dilarang payout ganda | Komisi dipotong (BR-030); transfer ke rekening rental; notifikasi instan (BR-008, BR-032) |
| LUNAS | refund_full | LUNAS → DIREFUND_PENUH | Sistem / Admin / Tim Mediasi | Ya | Dilarang jika sudah DITERUSKAN | Misal pembatalan rental / putusan mediasi (BR-012) |
| LUNAS | refund_partial | LUNAS → DIREFUND_SEBAGIAN | Sistem / Tim Mediasi | Ya | Dilarang jika sudah DITERUSKAN | Misal hasil mediasi (BR-010) |
| LUNAS | claim_opened | LUNAS → DIBEKUKAN_KLAIM | Rental / Sistem | Ya (dalam claim window) | — | Sama dengan DITAHAN_ESCROW claim_opened |
| DIBEKUKAN_KLAIM | mediation_resolved_release | DIBEKUKAN_KLAIM → DITERUSKAN | Tim Mediasi / Sistem | Ya, sesuai putusan | Dilarang tanpa putusan mediasi | Dana sewa/deposit diteruskan ke rental sesuai hasil mediasi (penalti kerusakan atau klaim diterima) |
| DIBEKUKAN_KLAIM | mediation_resolved_refund | DIBEKUKAN_KLAIM → DIREFUND_SEBAGIAN / DIREFUND_PENUH | Tim Mediasi / Sistem | Ya, sesuai putusan | — | Refund ke penyewa sesuai putusan mediasi |
| DIREFUND_SEBAGIAN | payout_executed | DIREFUND_SEBAGIAN → DITERUSKAN | Sistem | Ya (sisa dana ke rental) | Dilarang refund ulang atas porsi yang sama | Sisa dana sewa diteruskan ke rental setelah dikurangi komisi (BR-008, BR-030) |
| DIREFUND_PENUH | — | terminal | — | — | Semua transisi keluar dilarang | Tidak ada dana tersisa |
| DITERUSKAN | — | terminal | — | — | Semua transisi keluar dilarang; refund/payout ulang dilarang | Tidak ada dana tersisa |

### Payment Record (per pembayaran DP / pelunasan / full)

| State | Trigger | Transition | Actor | Allowed | Forbidden | Side effect |
|---|---|---|---|---|---|---|
| CREATED | payment_link_created | (awal) → CREATED | Sistem | Ya | — | Link/QRIS dibuat via PG |
| CREATED | user_pays | CREATED → MENUNGGU | Penyewa | Ya | — | Menunggu konfirmasi PG |
| MENUNGGU | webhook_success | MENUNGGU → BERHASIL | Payment Gateway (webhook) | Ya | — | Event dp_paid / final_payment_received; webhook idempotent (duplikat diabaikan) |
| MENUNGGU | webhook_failed | MENUNGGU → GAGAL | Payment Gateway (webhook) | Ya | — | Penyewa dapat mencoba lagi selama booking belum kedaluwarsa |
| MENUNGGU | link_expired | MENUNGGU → KEDALUWARSA | Sistem (scheduler) | Ya | — | Memicu dp_link_expired di BookingState |
| BERHASIL / GAGAL / KEDALUWARSA | — | terminal | — | — | Transisi keluar dilarang | — |

## 7.3 Verification State Machine (e-KYC Penyewa)

| State | Trigger | Transition (dari → ke) | Actor | Allowed | Forbidden | Side effect |
|---|---|---|---|---|---|---|
| DRAFT | upload_started | (awal) → DRAFT | Penyewa | Ya | — | Consent eksplisit tercatat (BR-040) |
| DRAFT | submitted | DRAFT → DISUBMIT | Penyewa | Ya, hanya jika KTP + SIM terunggah | Submit tanpa dokumen lengkap dilarang | — |
| DISUBMIT | auto_check_started | DISUBMIT → DIPROSES_OTOMATIS | Sistem / Vendor e-KYC | Ya | — | OCR + validitas format (BR-014) |
| DIPROSES_OTOMATIS | auto_passed | DIPROSES_OTOMATIS → DISETUJUI | Sistem | Ya | — | Hasil diteruskan ke rental (BR-015) |
| DIPROSES_OTOMATIS | auto_doubtful | DIPROSES_OTOMATIS → BUTUH_REVIEW_MANUAL | Sistem | Ya | — | Antrean Tim Verifikasi |
| BUTUH_REVIEW_MANUAL | manual_approved | BUTUH_REVIEW_MANUAL → DISETUJUI | Tim Verifikasi | Ya | — | Hasil diteruskan ke rental (BR-015) |
| BUTUH_REVIEW_MANUAL | manual_rejected | BUTUH_REVIEW_MANUAL → DITOLAK | Tim Verifikasi | Ya | — | Alasan penolakan tercatat; notifikasi ke penyewa |
| DITOLAK | resubmitted | DITOLAK → DISUBMIT | Penyewa | Ya | — | Dokumen baru; riwayat penolakan tersimpan |
| DISETUJUI | fraud_detected | DISETUJUI → DITOLAK | Admin / Sistem | Ya (kasus dokumen palsu) | — | Akun dapat diblokir (BR-033) |
| DISETUJUI / DITOLAK | — | terminal (kecuali resubmit & fraud) | — | — | — | — |

## 7.4 Handover State Machine

| State | Trigger | Transition (dari → ke) | Actor | Allowed | Forbidden | Side effect |
|---|---|---|---|---|---|---|
| TERKUNCI | handover_started | (awal) → TERKUNCI | Rental / Sistem | Ya | Pengisian checklist dilarang keras | — |
| TERKUNCI | final_payment_received | TERKUNCI → TERBUKA | Sistem (EscrowState = LUNAS) | Ya, HANYA via event ini | Pembukaan manual dilarang (kecuali Admin insidental beraudit) | — |
| TERBUKA | checklist_filled | TERBUKA → CHECKLIST_DIISI | Rental + Penyewa | Ya | — | — |
| CHECKLIST_DIISI | photos_uploaded | CHECKLIST_DIISI → DIFOTO | Rental + Penyewa | Ya | — | — |
| DIFOTO | both_confirmed | DIFOTO → DIKONFIRMASI_KEDUA_PIHAK | Rental + Penyewa | Ya, hanya jika kedua pihak konfirmasi | Konfirmasi sepihak tidak cukup | — |
| DIKONFIRMASI_KEDUA_PIHAK | finalized | DIKONFIRMASI_KEDUA_PIHAK → SELESAI | Sistem | Ya | — | — |
| SELESAI | — | terminal | — | — | Perubahan checklist/foto dilarang (immutable sebagai bukti) | — |

## 7.5 Return State Machine

| State | Trigger | Transition (dari → ke) | Actor | Allowed | Forbidden | Side effect |
|---|---|---|---|---|---|---|
| MENUNGGU | return_started | (awal) → MENUNGGU | Rental / Penyewa | Ya | — | — |
| MENUNGGU | checklist_filled | MENUNGGU → CHECKLIST_DIISI | Rental + Penyewa | Ya | — | Checklist pengembalian per pihak |
| CHECKLIST_DIISI | photos_uploaded | CHECKLIST_DIISI → DIFOTO | Rental + Penyewa | Ya | — | Foto kondisi akhir (pembanding BR-019) |
| DIFOTO | both_confirmed | DIFOTO → DIKONFIRMASI | Rental + Penyewa | Ya | — | Jika terlambat → flag TERLAMBAT + denda per jam (BR-020) |
| DIKONFIRMASI | finalized | DIKONFIRMASI → SELESAI | Sistem | Ya | — | BookingState → SELESAI; payout terjadwal H+1 (BR-008); deposit masuk claim window 24 jam (BR-009) |
| TERLAMBAT | both_confirmed | (cabang dari DIKONFIRMASI bila melewati jadwal) → TERLAMBAT → SELESAI | Sistem | Ya | — | Denda per jam sesuai perjanjian (BR-020); denda ditagih via platform |
| SELESAI | — | terminal | — | — | Perubahan data return dilarang | Review menjadi eligible (BR-013) |

## 7.6 Deposit State Machine

| State | Trigger | Transition (dari → ke) | Actor | Allowed | Forbidden | Side effect |
|---|---|---|---|---|---|---|
| DITAHAN | return_completed | (awal) → DITAHAN | Sistem | Ya | — | Deposit ditahan |
| DITAHAN | window_started | DITAHAN → CLAIM_WINDOW_24JAM | Sistem | Ya | — | Timer 24 jam dimulai |
| CLAIM_WINDOW_24JAM | no_claim | CLAIM_WINDOW_24JAM → DILEPAS | Sistem (scheduler) | Ya, hanya jika timer habis & tanpa klaim | Pelepasan manual sebelum waktunya dilarang | Deposit kembali penuh ke penyewa |
| CLAIM_WINDOW_24JAM | claim_filed | CLAIM_WINDOW_24JAM → DIBEKUKAN_KLAIM | Rental | Ya, hanya dalam window & berdasar bukti foto | Klaim tanpa bukti dilarang | EscrowState DIBEKUKAN_KLAIM; payout ditunda |
| DIBEKUKAN_KLAIM | mediation_deposit_to_rental | DIBEKUKAN_KLAIM → DIPOTONG_SEBAGIAN | Tim Mediasi | Ya, sesuai putusan | — | Sebagian memotong deposit untuk ganti rugi (BR-019); sisa deposit dilepas ke penyewa |
| DIBEKUKAN_KLAIM | mediation_deposit_released | DIBEKUKAN_KLAIM → DILEPAS_PENUH | Tim Mediasi | Ya, sesuai putusan | — | Deposit kembali penuh ke penyewa |
| DILEPAS / DIPOTONG_SEBAGIAN / DILEPAS_PENUH | — | terminal | — | — | Transisi keluar dilarang | — |

## 7.7 Dispute State Machine

| State | Trigger | Transition (dari → ke) | Actor | Allowed | Forbidden |
|---|---|---|---|---|---|
| DIBUKA | dispute_filed | (awal) → DIBUKA | Penyewa / Rental / CS | Ya | — |
| DIBUKA | mediation_started | DIBUKA → MEDIASI | Tim Mediasi | Ya | — |
| MEDIASI | agreement_reached | MEDIASI → SELESAI_DISETUJUI | Tim Mediasi (+ persetujuan pihak) | Ya | — |
| MEDIASI | deadlock | MEDIASI → DIESKALASI_HUKUM | Tim Mediasi | Ya | — |
| MEDIASI | withdrawn_or_rejected | MEDIASI → DITUTUP_TANPA_KESEPAKATAN | Tim Mediasi | Ya | — |
| SELESAI_DISETUJUI / DIESKALASI_HUKUM / DITUTUP_TANPA_KESEPAKATAN | — | terminal | — | — | Pembukaan ulang sengketa sama dilarang; sengketa baru butuh dasar baru |

> Skenario yang dipetakan ke mesin ini: unit tak sesuai (BR-021), kerusakan (BR-019), keterlambatan (BR-020), mogok (BR-022), dugaan penggelapan (BR-023 → akun diblokir + eskalasi), dokumen palsu (BR-033).

## 7.8 Payout State Machine

| State | Trigger | Transition (dari → ke) | Actor | Allowed | Forbidden | Side effect |
|---|---|---|---|---|---|---|
| TERJADWAL | payout_scheduled | (awal) → TERJADWAL | Sistem | Ya, H+1 pasca return terkonfirmasi, tanpa sengketa | Penjadwalan saat sengketa/klaim aktif dilarang | Komisi dihitung; rincian transparan disiapkan (BR-030) |
| TERJADWAL | payout_initiated | TERJADWAL → DIPROSES | Sistem | Ya | — | Instruksi payout ke PG |
| DIPROSES | payout_success | DIPROSES → BERHASIL | Payment Gateway | Ya | — | EscrowState → DITERUSKAN; ledger + notifikasi (BR-031, BR-032); layar "Dana Saya" diperbarui |
| DIPROSES | payout_failed | DIPROSES → GAGAL | Payment Gateway / Sistem | Ya | — | Notifikasi gagal ke rental + Admin; tiket insiden |
| GAGAL | retried | GAGAL → DIPROSES | Sistem (retry terjadwal) / Admin | Ya | Retry tanpa batas dilarang — jumlah retry maksimum = TBD [TECHNICAL DECISION REQUIRED] | Backoff antar percobaan |
| BERHASIL | — | terminal | — | — | Payout ulang untuk booking yang sama dilarang keras (idempotency key per booking) | — |
| GAGAL | max_retry_reached | GAGAL → (tetap GAGAL, eskalasi manual) | Sistem | Ya | — | Eskalasi ke Admin; penyelesaian manual beraudit |

# 8. Non-Functional Requirements
Prinsip: setiap NFR konkret dan testable tanpa mengarang angka. Jika suatu NFR membutuhkan angka/threshold, tulis `[TECHNICAL DECISION REQUIRED]` . 

## 8.1 Security
- **NFR-SEC-001:** Seluruh komunikasi client–server dan server–server menggunakan TLS versi yang didukung saat ini; koneksi non-TLS ditolak kecuali endpoint health-check internal yang terisolasi jaringan. 

- **NFR-SEC-002:** Kredensial, token, dan secret tidak pernah ditulis ke log, URL, atau respons API; secret dikelola via secret manager / environment yang aksesnya dibatasi peran. 

- **NFR-SEC-003:** Input dari pengguna divalidasi di sisi server untuk setiap endpoint (tipe, panjang, format, rentang); validasi client-side hanya pelengkap UX, bukan kontrol keamanan. 

- **NFR-SEC-004:** Sistem lolos pemindaian kerentanan dependensi pada setiap rilis; dependensi dengan kerentanan kritis yang tereksploitasi tidak boleh masuk produksi tanpa mitigasi tercatat. 

**NFR-SEC-005:** Mekanisme pencegahan fraud dasar tersedia: deteksi booking ganda abnormal dari akun/IP yang sama, penandaan pola refund berulang, dan pemblokiran akun terduga penipuan dengan audit trail (mendukung BR-023, BR-033). 

## 8.2 Authentication
**NFR-AUTHN-001:** Password disimpan sebagai hash dengan algoritma adaptif (mis. bcrypt/argon2) + salt unik per pengguna; password plaintext tidak pernah disimpan atau dilog. 

**NFR-AUTHN-002:** Kebijakan password minimum ditegakkan di server (panjang minimum dan penolakan password yang bocor umum) — nilai ambang `[TECHNICAL DECISION REQUIRED]` . 

- **NFR-AUTHN-003:** Sesi/token memiliki masa kedaluwarsa; refresh token dapat dicabut (revocation) saat logout, pergantian password, atau pemblokiran akun. 

- **NFR-AUTHN-004:** Upaya login gagal berulang dari satu akun/IP dibatasi lajunya (rate limit) dan memicu jeda progresif — ambang `[TECHNICAL DECISION REQUIRED]` ; upaya gagal dicatat di audit log tanpa menyimpan password yang dicoba. 

## 8.3 Authorization
**NFR-AUTHZ-001:** Seluruh endpoint menerapkan RBAC sesuai Authorization Matrix (Bagian 12 SRS); tidak ada endpoint tanpa pemeriksaan peran. 

**NFR-AUTHZ-002:** Otorisasi diperiksa di sisi server per-request; peran tidak pernah dipercaya dari klaim client-side saja. 

**NFR-AUTHZ-003:** Akses antar-tenant dilarang: rental hanya dapat melihat/mengelola data rental-nya sendiri; penyewa hanya data booking-nya sendiri; pelanggaran menghasilkan 403 dan tercatat di audit log. 

**NFR-AUTHZ-004:** Akses ke data sensitif (KTP/SIM, dokumen mitra) memerlukan peran eksplisit + pencatatan setiap akses (BR-039). 

## 8.4 Data Encryption
- **NFR-ENC-001:** Data sensitif saat disimpan (at rest) — KTP/SIM, dokumen mitra, data pembayaran — terenkripsi dengan kunci yang dikelola terpisah dari data (key management). 

- **NFR-ENC-002:** Data sensitif saat transit (in transit) — termasuk upload dokumen dan webhook PG — hanya melalui TLS. 

- **NFR-ENC-003:** Citra dokumen identitas diminimalkan penyimpanannya: pertimbangkan vendor e-KYC sebagai pemroses data sehingga DriveO tidak menyimpan citra mentah lebih lama dari yang diperlukan (BR-016). 

- **NFR-ENC-004:** Kunci enkripsi dirotasi sesuai kebijakan; rotasi tidak menyebabkan kehilangan akses ke data yang sudah terenkripsi — prosedur rotasi `[TECHNICAL DECISION REQUIRED]` . 

## 8.5 Personal Data Protection (UU PDP 27/2022)
- **NFR-PDP-001:** Consent eksplisit dan terpisah dicatat sebelum pemrosesan dokumen identitas (BR-040); tanpa catatan consent, upload tidak diproses. 

- **NFR-PDP-002:** Tujuan pemrosesan data pribadi dibatasi pada: verifikasi identitas, operasional booking, dan penanganan sengketa; penggunaan di luar tujuan tersebut dilarang tanpa consent baru. 

- **NFR-PDP-003:** Hak hapus data: pengguna dapat meminta penghapusan data verifikasi identitasnya; sistem mengeksekusi penghapusan dalam batas waktu yang ditentukan regulasi, kecuali data yang wajib dipertahankan karena sengketa/proses hukum aktif (BR-016, BR-038). 

- **NFR-PDP-004:** Hak tarik consent: penarikan consent menghentikan pemrosesan lebih lanjut dan memicu alur penghapusan sesuai BR-016, dengan pengecualian kewajiban hukum yang tetap berlaku. 

- **NFR-PDP-005:** Retensi data pribadi mengikuti BR-016 (90 hari — TBD/Validation Required) dan BR-038 (TBD/Legal Validation Required); penghapusan otomatis terjadwal setelah masa retensi berakhir. 

- **NFR-PDP-006:** Setiap akses dan pemrosesan data pribadi sensitif tercatat (siapa, kapan, tujuan) untuk akuntabilitas (BR-039). 

## 8.6 Audit Logging
**NFR-AUD-001:** Seluruh event penting (daftar Bagian 15 SRS: booking_created, dp_paid, verification , booking_confirmed, final_payment_received, handover_completed, return_completed, claim_created, refund_created, payout__ , review_submitted, dsb.) tercatat dengan: timestamp, aktor, ID booking/pembayaran terkait, state sebelum → sesudah, dan nomor referensi. 

- **NFR-AUD-002:** Audit log bersifat append-only; tidak dapat diubah atau dihapus oleh peran mana pun termasuk Admin (konsisten dengan BR-031). 

- **NFR-AUD-003:** Audit log untuk event keuangan disimpan mengikuti masa retensi BR-038 dan dapat diekspor untuk keperluan mediasi/hukum (BR-024). 

**NFR-AUD-004:** Akses ke audit log sendiri dibatasi peran (Admin/Auditor) dan setiap pembacaan audit log sensitif tercatat. 

## 8.7 Availability
- **NFR-AVL-001:** Layanan inti booking & pembayaran dirancang tanpa single point of failure pada komponen kritis (database, payment webhook receiver). 

- **NFR-AVL-002:** Scheduler pemicu transisi waktu (kedaluwarsa link DP, SLA konfirmasi, claim window, payout H+1) berjalan redundan sehingga satu kegagalan node tidak menghentikan eksekusi terjadwal; eksekusi bersifat idempotent agar eksekusi ganda tidak menimbulkan efek ganda. 

- **NFR-AVL-003:** Target availability numerik (mis. 99,x%) = `[TECHNICAL DECISION REQUIRED]` — tidak ditetapkan di SRS ini karena proposal tidak menyediakannya. 

**NFR-AVL-004:** Mode degradasi terdokumentasi: jika PG / e-KYC / notifikasi tidak tersedia, sistem menolak transaksi baru yang bergantung padanya secara eksplisit (pesan jelas ke pengguna) alih-alih gagal diam-diam. 

## 8.8 Reliability
- **NFR-REL-001:** Seluruh transisi state finansial (EscrowState, Payment record, PayoutState, DepositState) bersifat idempotent: pemrosesan event yang sama dua kali menghasilkan satu efek. 

- **NFR-REL-002:** Webhook dari payment gateway diverifikasi keasliannya (signature) dan diproses idempotent; webhook duplikat diabaikan dengan aman (BR-004, Bagian 7.2). 

- **NFR-REL-003:** Tidak ada dana yang "hilang" atau "ganda": setiap perubahan posisi dana memiliki ledger entry berpasangan (debit/kredit konseptual) dengan nomor referensi (BR-031). 

- **NFR-REL-004:** Transisi booking/pembayaran yang gagal di tengah jalan meninggalkan sistem dalam state yang konsisten (tidak setengah jalan): gunakan transaksi database untuk perubahan multi-tabel. 

## 8.9 Performance
- **NFR-PERF-001:** Pencarian & filter listing mengembalikan hasil dalam waktu yang dapat diterima pengguna web — ambang milidetik `[TECHNICAL DECISION REQUIRED]` ; yang wajib: query pencarian menggunakan indeks yang tepat dan tidak melakukan full scan pada 

- tabel listing/availability. 

- **NFR-PERF-002:** Webhook pembayaran diproses dan direspons dalam batas waktu yang dituntut PG — nilai `[TECHNICAL DECISION REQUIRED]` ; pemrosesan berat dilakukan asinkron setelah respons 200 OK. 

- **NFR-PERF-003:** Endpoint finansial (payment, refund, payout) idempotent dan aman terhadap retry; retry client tidak menimbulkan pembayaran ganda. 

- **NFR-PERF-004:** Target throughput/concurrency (pengguna bersamaan, booking per menit) = `[TECHNICAL DECISION REQUIRED]` ; arsitektur tidak boleh memiliki bottleneck yang mencegah penskalaan horizontal pada lapisan aplikasi. 

## 8.10 Scalability
- **NFR-SCA-001:** Lapisan aplikasi stateless sehingga dapat direplikasi horizontal; state sesi tidak disimpan di memori lokal node. 

- **NFR-SCA-002:** Data ketersediaan/listing dirancang agar penambahan rental & unit (fase ekspansi kota — future) tidak memerlukan perubahan skema breaking. 

- **NFR-SCA-003:** Beban puncak musiman (mis. libur panjang) ditangani dengan penskalaan yang direncanakan — kapasitas target `[TECHNICAL DECISION REQUIRED]` . 

## 8.11 Maintainability
- **NFR-MNT-001:** Kode mengikuti prinsip SIMPLE → CORRECT → MAINTAINABLE → SCALABLE (preferensi pengguna): tidak ada overengineering pada MVP. 

- **NFR-MNT-002:** Business rule terpusat (tidak tersebar di banyak tempat): perubahan besaran TBD (DP %, SLA, komisi) cukup via konfigurasi, bukan perubahan kode — mendukung transisi status TBD → Defined pasca-validasi. 

- **NFR-MNT-003:** Setiap state machine (Bagian 7) diimplementasikan sebagai modul transisi eksplisit dengan daftar transisi yang diizinkan; transisi ilegal ditolak dengan error yang jelas dan tercatat. 

- **NFR-MNT-004:** Cakupan dokumentasi: setiap endpoint API, setiap event webhook, dan setiap job scheduler memiliki dokumentasi (tujuan, input/output, efek samping). 

## 8.12 Observability
- **NFR-OBS-001:** Metrik kunci terpantau: booking dibuat/gagal, pembayaran berhasil/gagal, webhook diterima/duplikat, payout berhasil/gagal, klaim dibuka, sengketa dibuka, error rate per endpoint. 

- **NFR-OBS-002:** Alert otomatis untuk: payout gagal, webhook PG gagal berulang, scheduler tidak berjalan, lonjakan dispute/klaim — kanal alert `[TECHNICAL DECISION REQUIRED]` . 

- **NFR-OBS-003:** Setiap request yang menyentuh dana membawa correlation ID dari API hingga webhook hingga ledger, sehingga alur uang dapat ditelusuri end-to-end. 

- **NFR-OBS-004:** Dashboard operasional menampilkan kesehatan pipeline pembayaran (DITAHAN_ESCROW → LUNAS → DITERUSKAN) secara real-time untuk tim inti. 

## 8.13 Backup & Recovery
**NFR-BKP-001:** Backup database terjadwal otomatis; backup terenkripsi dan diuji restore secara berkala — frekuensi & retensi backup `[TECHNICAL DECISION REQUIRED]` . 

- **NFR-BKP-002:** RPO/RTO untuk data finansial = `[TECHNICAL DECISION REQUIRED]` ; yang wajib: tidak ada event keuangan (ledger) yang hilang akibat kegagalan infrastruktur tunggal. 

- **NFR-BKP-003:** File bukti (foto handover/return, dokumen) direplikasi/dibackup bersama databasenya; kehilangan file bukti membuat sengketa tidak dapat diputus — sehingga durability file disamakan dengan data finansial. 

- **NFR-BKP-004:** Prosedur disaster recovery terdokumentasi dan pernah diuji sebelum pilot komersial. 

## 8.14 API Security
- **NFR-API-001:** Autentikasi API via token (JWT sesi pendek / API key untuk server-to-server); token kedaluwarsa dan dapat dicabut. 

- **NFR-API-002:** Rate limiting pada semua endpoint publik, lebih ketat pada endpoint autentikasi dan pembayaran — ambang `[TECHNICAL DECISION REQUIRED]` . 

- **NFR-API-003:** Endpoint finansial dan webhook bersifat idempotent via idempotency key; respons menyertakan hasil operasi asal bila key sudah pernah diproses. 

- **NFR-API-004:** Webhook masuk (PG, e-KYC) wajib verifikasi signature; webhook tanpa signature valid ditolak dengan 401/403 dan dicatat. 

**NFR-API-005:** Respons error tidak membocorkan detail internal (stack trace, query SQL); kode error konsisten dan terdokumentasi. 

## 8.15 File Storage Security
- **NFR-FIL-001:** Upload file (KTP/SIM, foto handover/return, dokumen mitra) divalidasi: tipe MIME, ekstensi, ukuran maksimum, dan pemindaian konten berbahaya — batas ukuran `[TECHNICAL DECISION REQUIRED]` . 

- **NFR-FIL-002:** File sensitif (dokumen identitas) disimpan terenkripsi di object storage dengan akses privat; tidak ada URL publik langsung — akses via URL bertanda tangan (signed URL) berumur pendek dan berbasis peran (BR-039). 

- **NFR-FIL-003:** Foto bukti handover/return bersifat immutable setelah kedua pihak konfirmasi (mendukung BR-018, BR-019); penghapusan/penggantian setelah konfirmasi dilarang di level storage policy. 

- **NFR-FIL-004:** Metadata file (uploader, timestamp, hash integritas) tercatat; hash digunakan untuk verifikasi keaslian bukti saat mediasi. 

# 9. Data Requirements
Level: konseptual/logis. BUKAN schema SQL final. Untuk setiap entity: Purpose, Important fields, Relationships, Owner (peran yang mengelola), Sensitive data, Retention, Audit requirement. 

## 9.1 User
- **Purpose:** Identitas individu yang memakai platform (penyewa; juga akun personal di balik rental). 

- **Important fields:** ID pengguna, nama, email, nomor WhatsApp, password hash, status akun (aktif/diblokir), peran (relasi ke Role), consent record (timestamp + versi), timestamp dibuat/diperbarui. 

- **Relationships:** memiliki banyak Booking (sebagai penyewa); memiliki banyak Verification; memiliki banyak Review; terhubung ke Rental (sebagai pemilik/staf). 

- **Owner:** Pengguna (data miliknya); Admin (moderasi/pemblokiran). 

- **Sensitive data:** Ya — email, nomor HP, password hash. 

- **Retention:** Selama akun aktif + mengikuti BR-038; hapus/anonymisasi atas permintaan sesuai UU PDP kecuali kewajiban hukum (NFR-PDP-003). 
- **Audit requirement:** Pembuatan akun, perubahan peran, pemblokiran/pembukaan blokir tercatat. 

## 9.2 Role
- **Purpose:** Definisi peran untuk RBAC (Penyewa, Rental, Admin, Tim Verifikasi, Customer Support, Tim Mediasi).
- **Important fields:** ID peran, nama peran, daftar permission. 

- **Relationships:** dipakai oleh User; dirujuk Authorization Matrix (Bagian 12). 

- **Owner:** Admin (pengelola platform). 

- **Sensitive data:** Tidak. 
- **Retention:** Selama sistem berjalan (data konfigurasi). 

- **Audit requirement:** Perubahan permission tercatat. 

## 9.3 Rental
- **Purpose:** Profil usaha rental mitra: identitas usaha, kontak, status verifikasi, reputasi. 

- **Important fields:** ID rental, nama usaha, identitas PJ, NIB/izin usaha, alamat, kontak, status verifikasi mitra (BR-036), rating agregat, jumlah booking terselesaikan, info rekening payout, timestamp. 

- **Relationships:** memiliki banyak Vehicle; memiliki banyak Listing (via vehicle); memiliki banyak Booking; memiliki satu Rental Verification; menerima banyak Payout; memiliki banyak Review. 
- **Owner:** Rental (mengelola profilnya); Tim Verifikasi/Admin (status verifikasi). 
- **Sensitive data:** Ya — identitas PJ, NIB, info rekening payout. 
- **Retention:** Selama kemitraan + BR-038; data bukti verifikasi mengikuti retensi dokumen. 
- **Audit requirement:** Perubahan status verifikasi, perubahan info rekening payout tercatat (anti-fraud). 

## 9.4 Rental Verification
- **Purpose:** Hasil verifikasi mitra: identitas PJ, NIB/izin usaha, dokumen kendaraan (BR-036). 

- **Important fields:** ID verifikasi, rental terkait, jenis dokumen, hasil per dokumen (lolos/ditolak), reviewer, timestamp, alasan penolakan. 
- **Relationships:** milik satu Rental; merujuk dokumen di Vehicle Document / arsip dokumen mitra. 
- **Owner:** Tim Verifikasi; Admin. 
- **Sensitive data:** Ya — dokumen identitas PJ dan dokumen usaha. 
- **Retention:** Selama kemitraan + BR-038 (Legal Validation Required). 
- **Audit requirement:** Setiap keputusan verifikasi (siapa, kapan, hasil) tercatat. 

## 9.5 Vehicle
- **Purpose:** Unit kendaraan milik rental: identitas unit, spesifikasi, syarat sewa. 
- **Important fields:** ID kendaraan, rental pemilik, jenis (motor/mobil), merek/tipe/tahun, plat nomor, spesifikasi, syarat sewa, tarif dasar, status (aktif/nonaktif), timestamp. 

- **Relationships:** milik satu Rental; memiliki banyak Vehicle Document; memiliki banyak Vehicle Availability; tampil di banyak Listing; dipesan via banyak Booking Item. 
- **Owner:** Rental. 
- **Sensitive data:** Sebagian — plat nomor (data yang dapat mengidentifikasi). 
- **Retention:** Selama unit aktif + riwayat pasca-nonaktif mengikuti BR-038. 
- **Audit requirement:** Perubahan tarif/syarat/status tercatat (berdampak pada booking). 

## 9.6 Vehicle Document
- **Purpose:** Dokumen kendaraan (STNK/BPKB/bukti kepemilikan) untuk verifikasi mitra (BR-036). 

- **Important fields:** ID dokumen, kendaraan terkait, jenis dokumen, referensi file terenkripsi, status verifikasi, timestamp.
- **Relationships:** milik satu Vehicle; dirujuk Rental Verification. 
- **Owner:** Rental (upload); Tim Verifikasi (review). 

- **Sensitive data:** Ya — dokumen kepemilikan kendaraan. 

- **Retention:** Selama kemitraan + BR-038. 
- **Audit requirement:** Upload, review, dan setiap akses tercatat (BR-039). 

## 9.7 Vehicle Availability
- **Purpose:** Kalender ketersediaan per unit per tanggal: dasar penanda kebaruan (BR-025), penguncian slot (BR-028), dan deteksi listing basi (BR-027). 

- **Important fields:** ID, kendaraan, tanggal, status (tersedia/dipesan/diblokir manual), sumber (platform/manual), timestamp pembaruan terakhir. 

- **Relationships:** milik satu Vehicle; dirujuk Booking Item (penguncian). 
- **Owner:** Rental (memperbarui); Sistem (penguncian otomatis). 

- **Sensitive data:** Tidak. 
- **Retention:** Riwayat ketersediaan mengikuti BR-038 (relevan untuk audit sengketa double booking). 
- **Audit requirement:** Perubahan status slot tercatat (siapa/sistem, kapan). 

## 9.8 Listing
- **Purpose:** Tampilan publik unit yang dapat dicari/dibandingkan/dipesan: harga all-in (BR-026), foto, syarat, penanda kebaruan (BR025), label basi (BR-027). 

- **Important fields:** ID listing, kendaraan, judul, deskripsi, foto, harga all-in + rincian komponen, status publikasi, timestamp pembaruan terakhir, skor kebasuan. 

- **Relationships:** merujuk satu Vehicle; muncul di hasil Search; dibandingkan di Comparison; dipesan via Booking.
- **Owner:** Rental (konten); Admin (moderasi — BR-042). 

- **Sensitive data:** Tidak (data publik). 
- **Retention:** Selama dipublikasikan + arsip pasca-takedown mengikuti BR-038. 
- **Audit requirement:** Publikasi, takedown/moderasi, perubahan harga tercatat. 

## 9.9 Booking
- **Purpose:** Inti transaksi: mengikat penyewa–rental–unit–periode, membawa BookingState (Bagian 7.1) dan merujuk EscrowState.
- **Important fields:** ID booking (nomor referensi), penyewa, rental, periode sewa (mulai–selesai), booking state, escrow state (atau referensi), total nilai, DP, sisa, status verifikasi, perjanjian versi yang disetujui, timestamp setiap transisi. 

- **Relationships:** milik satu User (penyewa) & satu Rental; memiliki banyak Booking Item; memiliki banyak Payment; memiliki satu Deposit; memiliki Handover/Return Checklist; memiliki banyak Review/Dispute terkait. 

- **Owner:** Sistem (state); Penyewa & Rental (aksi sesuai peran). 

- **Sensitive data:** Sebagian — nilai transaksi, data pihak. 
- **Retention:** BR-038 (transaksi) — TBD/Legal Validation Required. 

- **Audit requirement:** Setiap transisi state tercatat dengan aktor & timestamp (NFR-AUD-001). 

## 9.10 Booking Item
- **Purpose:** Rincian unit × periode dalam satu booking (mendukung multi-unit di masa depan; MVP umumnya satu item).
- **Important fields:** ID item, booking, kendaraan, tanggal mulai–selesai, tarif per periode, subtotal.
- **Relationships:** milik satu Booking; merujuk satu Vehicle; mengunci Vehicle Availability. 
- **Owner:** Sistem. 

- **Sensitive data:** Tidak. 
- **Retention:** Mengikuti Booking. 
- **Audit requirement:** Tercatat sebagai bagian event booking_created. 

## 9.11 Payment
- **Purpose:** Satu pembayaran individual (DP / pelunasan / full upfront / tambahan perpanjangan): membawa Payment record state (Bagian 7.2 D4). 

- **Important fields:** ID pembayaran, booking, jenis (DP/pelunasan/full/tambahan), nominal, metode, payment state (CREATED → MENUNGGU → BERHASIL/GAGAL/KEDALUWARSA), idempotency key, referensi PG, timestamp. 

- **Relationships:** milik satu Booking; menghasilkan banyak Payment Event; tercatat di Ledger. 
- **Owner:** Sistem + Payment Gateway. 
- **Sensitive data:** Ya — data pembayaran (token/metode; BUKAN nomor kartu penuh — ditangani PG). 
- **Retention:** BR-038 (bukti keuangan). 
- **Audit requirement:** Setiap perubahan state + webhook tercatat; duplikat webhook tercatat sebagai diabaikan. 

## 9.12 Payment Event
- **Purpose:** Event granular dari PG (created, paid, failed, expired, refunded): sumber kebenaran webhook, diproses idempotent.
- **Important fields:** ID event, payment terkait, tipe event, payload ringkas, signature verification result, status proses (diproses/diabaikan-duplikat), timestamp. 
- **Relationships:** milik satu Payment. 

- **Owner:** Sistem. 
- **Sensitive data:** Sebagian — payload PG (disimpan minimal). 

- **Retention:** BR-038. 
- **Audit requirement:** Append-only; setiap webhook masuk tercatat termasuk yang ditolak (signature invalid). 

## 9.13 Ledger
- **Purpose:** Riwayat Dana per booking: catatan keuangan immutable, bertimestamp + nomor referensi (BR-031). Sumber rekonsiliasi.
- **Important fields:** ID entry, booking, tipe entry (DP masuk, pelunasan masuk, refund keluar, komisi, payout keluar, deposit tahan/lepas/potong), nominal, arah (masuk/keluar), saldo berjalan konseptual, nomor referensi, timestamp, aktor pemicu.
- **Relationships:** milik satu Booking; merujuk Payment/Refund/Payout/Deposit terkait. 
- **Owner:** Sistem (tidak ada peran yang boleh mengedit — append-only). 

- **Sensitive data:** Ya — data keuangan. 
- **Retention:** BR-038; tidak boleh dihapus sebelum masa retensi (bukti sengketa/pajak). 
- **Audit requirement:** Entity ini ADALAH audit keuangan; entry koreksi hanya via entry baru yang merujuk entry asal. 

## 9.14 Deposit
- **Purpose:** Dana jaminan: membawa DepositState (DITAHAN → CLAIM_WINDOW_24JAM → DILEPAS/DIBEKUKAN_KLAIM → ...) sesuai BR-009. 

- **Important fields:** ID deposit, booking, nominal, deposit state, timestamp mulai claim window, klaim terkait (jika ada), timestamp.
- **Relationships:** milik satu Booking; dirujuk Claim; tercatat di Ledger. 
- **Owner:** Sistem + Payment Gateway (penampungan). 

- **Sensitive data:** Ya — dana pihak. 
- **Retention:** BR-038. 
- **Audit requirement:** Setiap transisi state + trigger (scheduler/klaim/mediasi) tercatat. 

## 9.15 Verification
- **Purpose:** Hasil e-KYC penyewa: KTP + SIM, OCR otomatis + review manual (BR-014), membawa VerificationState (Bagian 7.3).
- **Important fields:** ID verifikasi, pengguna, verification state, hasil OCR per dokumen, skor/flag meragukan, reviewer manual, keputusan + alasan, timestamp. 

- **Relationships:** milik satu User; dirujuk Booking (syarat konfirmasi); hasil diteruskan ke Rental (BR-015). 

- **Important fields (dokumen):** referensi file terenkripsi KTP/SIM — akses ketat (BR-039). 
- **Owner:** Penyewa (data miliknya); Tim Verifikasi (review). 

- **Sensitive data:** YA — KTP/SIM adalah data paling sensitif di sistem. 

- **Retention:** 90 hari — TBD/Validation Required (BR-016); hapus atas permintaan (NFR-PDP-003); pertimbangkan tidak menyimpan citra mentah (vendor sebagai pemroses). 
- **Audit requirement:** Submit, hasil otomatis, review manual, setiap akses dokumen, penghapusan — semuanya tercatat. 

## 9.16 Rental Agreement
- **Purpose:** Perjanjian sewa elektronik per booking: syarat, tarif, denda, tanggung jawab; disetujui digital SEBELUM pembayaran (BR017). 

- **Important fields:** ID perjanjian, booking, versi template, isi (snapshot saat disetujui — tidak boleh berubah retroaktif), persetujuan penyewa (timestamp + metode click-to-accept), persetujuan rental, hash integritas. 

- **Relationships:** milik satu Booking; dirujuk Dispute (paket bukti). 
- **Owner:** Sistem (template dikelola Admin); disetujui Penyewa & Rental. 

- **Sensitive data:** Sebagian — identitas pihak dalam perjanjian. 
- **Retention:** BR-038 — TBD/Legal Validation Required (bukti hukum; lihat BR-024). 
- **Audit requirement:** Siapa/kapan/versi persetujuan tercatat (BR-017); perubahan template berversi, tidak menimpa snapshot lama. 

## 9.17 Handover Checklist
- **Purpose:** Checklist serah terima per pihak: terkunci sampai LUNAS (BR-007), membawa HandoverState (Bagian 7.4). 

- **Important fields:** ID checklist, booking, pihak pengisi (rental/penyewa), item checklist (kondisi body, odometer/BBM, kelengkapan), nilai per item, handover state, timestamp pengisian & konfirmasi. 

- **Relationships:** milik satu Booking; dilengkapi Handover Photo. 
- **Owner:** Rental & Penyewa (masing-masing mengisi bagiannya). 

- **Sensitive data:** Tidak. 
- **Retention:** BR-038 (bukti sengketa — BR-019). 
- **Audit requirement:** Pengisian & konfirmasi per pihak tercatat; immutable setelah SELESAI. 

## 9.18 Handover Photo
- **Purpose:** Foto bukti kondisi (body, odometer/BBM, kelengkapan) oleh kedua pihak (BR-018); dasar klaim (BR-019).
- **Important fields:** ID foto, checklist terkait, kategori (body/odometer/BBM/kelengkapan), referensi file, hash integritas, pengunggah, timestamp. 

- **Relationships:** milik satu Handover Checklist (dan Return Checklist memakai struktur yang sama/koleksi paralel). 

- **Owner:** Pengunggah (rental/penyewa); Sistem (penyimpanan). 

- **Sensitive data:** Sebagian — dapat memuat plat nomor/lokasi. 

- **Retention:** BR-038 (bukti sengketa). 

- **Audit requirement:** Upload tercatat; immutable setelah konfirmasi kedua pihak (NFR-FIL-003); hash untuk verifikasi keaslian saat mediasi. 

## 9.19 Return Checklist
- **Purpose:** Checklist pengembalian per pihak: pembanding handover, membawa ReturnState incl. TERLAMBAT (Bagian 7.5).
- **Important fields:** ID, booking, pihak pengisi, item kondisi akhir, flag terlambat + durasi, denda terhitung (BR-020), timestamp.
- **Relationships:** milik satu Booking; dibandingkan dengan Handover Checklist; memicu payout & deposit window. 
- **Owner:** Rental & Penyewa. 

- **Sensitive data:** Tidak. 
- **Retention:** BR-038. 
- **Audit requirement:** Sama dengan Handover Checklist; perhitungan denda tercatat transparan. 

## 9.20 Claim
- **Purpose:** Klaim kerusakan dalam claim window: membekukan deposit (BR-009, BR-019). 

- **Important fields:** ID klaim, booking/deposit, pengaju (rental), deskripsi kerusakan, estimasi nilai, bukti (rujukan foto handover vs return), status (diajukan/diproses/diputus), putusan mediasi, timestamp. 

- **Relationships:** milik satu Booking; membekukan satu Deposit; dapat menjadi satu Dispute. 
- **Owner:** Rental (mengajukan); Tim Mediasi (memutus). 
- **Sensitive data:** Sebagian — nilai klaim. 
- **Retention:** BR-038. 
- **Audit requirement:** Pengajuan, bukti, putusan, eksekusi potongan/pelepasan tercatat. 

## 9.21 Refund
- **Purpose:** Pengembalian dana ke penyewa: hanya dari dana ditahan (BR-010); membawa tipe (penuh/sebagian) & alasan (batal otomatis, batal rental, refund bertingkat, putusan mediasi). 

- **Important fields:** ID refund, booking, nominal, tipe (penuh/sebagian), alasan, sumber dana (escrow/deposit), status (diajukan/diproses/berhasil/gagal), referensi PG, timestamp. 

- **Relationships:** milik satu Booking; merujuk Payment asal; tercatat di Ledger. 
- **Owner:** Sistem (otomatis) / Admin / Tim Mediasi (manual beraudit). 

- **Sensitive data:** Ya — data keuangan & rekening tujuan (via PG). 

- **Retention:** BR-038. 
- **Audit requirement:** Setiap refund: pemicu, persetujuan (jika manual), eksekusi, hasil — tercatat. 

## 9.22 Payout
- **Purpose:** Penerusan dana sewa minus komisi ke rental H+1 (BR-008, BR-030): membawa PayoutState (Bagian 7.8).
- **Important fields:** ID payout, booking, rental, nominal bruto, komisi (nominal + %), nominal neto, payout state, info rekening tujuan (tokenized), referensi bank/PG, jumlah retry, timestamp. 
- **Relationships:** milik satu Booking & satu Rental; tercatat di Ledger; memajukan EscrowState → DITERUSKAN. 
- **Owner:** Sistem (terjadwal); Admin (retry/eskalasi manual). 

- **Sensitive data:** Ya — rekening payout rental. 
- **Retention:** BR-038 (bukti pajak — BR-044). 
- **Audit requirement:** Penjadwalan, eksekusi, kegagalan, retry, keberhasilan — tercatat; rincian komisi transparan (BR-030). 

## 9.23 Review
- **Purpose:** Rating dua arah pasca-transaksi terselesaikan (BR-013): anti fake review. 

- **Important fields:** ID review, booking, pemberi (penyewa/rental), penerima, rating, komentar, timestamp.
- **Relationships:** milik satu Booking; pemberi satu User/Rental; memengaruhi agregat reputasi Rental & profil Penyewa. 
- **Owner:** Pemberi review. 
- **Sensitive data:** Tidak (konten publik sesuai kebijakan moderasi). 
- **Retention:** Selama akun/penerima aktif; mengikuti BR-038 untuk arsip. 
- **Audit requirement:** Satu review per pihak per booking ditegakkan; moderasi/penghapusan oleh Admin tercatat dengan alasan (BR042). 

## 9.24 Notification
- **Purpose:** Catatan notifikasi instan (push + WhatsApp) setiap event uang & event penting (BR-032): keterkiriman dapat diaudit. 
- **Important fields:** ID notifikasi, penerima, kanal (push/WhatsApp/email), tipe event, isi (template + parameter), status kirim (terkirim/gagal/retry), timestamp. 

- **Relationships:** merujuk Booking/event pemicu. 
- **Owner:** Sistem. 
- **Sensitive data:** Sebagian — isi dapat memuat nominal (tanpa data sensitif identitas). 

- **Retention:** Operasional — `[TECHNICAL DECISION REQUIRED]` ; minimal cukup untuk investigasi keluhan notifikasi. 

- **Audit requirement:** Kegagalan kirim & retry tercatat; menjadi bukti "rental tahu alasan/durasi/cara merespons" saat dana dibekukan. 

## 9.25 Dispute
- **Purpose:** Sengketa: membawa DisputeState (Bagian 7.7); wadah bukti & putusan mediasi.
- **Important fields:** ID sengketa (nomor tiket), booking, pelapor, kategori (unit tak 

- sesuai/kerusakan/keterlambatan/mogok/penggelapan/dokumen palsu/lainnya), deskripsi, bukti (rujukan foto/dokumen/perjanjian), dispute state, mediator, putusan + dasar, timestamp. 

- **Relationships:** milik satu Booking; dapat merujuk Claim; putusan mengeksekusi Refund/Payout/Deposit. 

- **Owner:** Pelapor (membuka); Tim Mediasi (menangani); CS (tiket awal — BR-041). 

- **Sensitive data:** Ya — dapat memuat data identitas & bukti sensitif. 

- **Retention:** BR-038 — TBD/Legal Validation Required (relevan untuk eskalasi hukum — BR-024). 

- **Audit requirement:** Pembukaan, setiap pergantian state, bukti masuk, putusan — tercatat; paket bukti dapat diekspor untuk proses hukum (BR-024). 

## 9.26 Audit Log
- **Purpose:** Jejak audit lintas sistem: siapa melakukan apa, kapan, pada data apa (NFR-AUD-001 s.d. 004; BR-031, BR-039).
- **Important fields:** ID log, timestamp, aktor (+ peran), aksi, entity & ID terdampak, state sebelum → sesudah, nomor referensi/korelasi, alamat IP/perangkat (bila relevan), hasil (sukses/ditolak). 

- **Relationships:** Merujuk entity apa pun (polimorfik via entity type + ID). 

- **Owner:** Sistem (append-only; tidak ada peran boleh mengubah — NFR-AUD-002). 

- **Sensitive data:** Tidak menyimpan isi data sensitif — hanya metadata aksesnya. 

- **Retention:** Mengikuti BR-038; akses baca dibatasi peran dan tercatat (NFR-AUD-004). 

- **Audit requirement:** Entity ini adalah infrastruktur audit; integritasnya dilindungi (hash berantai opsional — `[TECHNICAL DECISION REQUIRED]` ). 

**Sumber kebenaran tunggal:** Proposal DriveO v3 (4 Okt 2026), diringkas dalam `/tmp/driveo_srs_parts/00_source_pack.md` . **Konvensi penanda:** `Defined` = ditetapkan proposal · `TBD / Validation Required` = belum final, dilarang dijadikan angka final · `Legal Validation Required` = butuh validasi hukum · `Business Decision Required` = butuh keputusan bisnis. **Baseline platform:** responsive web application (bukan native app). ML/AI, telematika, dan fitur future development TIDAK termasuk dalam bagian ini. **Fase concierge:** 20 booking pertama dilayani manual oleh tim inti (fase pilot, bukan requirement fungsional permanen). Selama fase ini, aksi manual tim tercatat di audit log dengan aktor pelaksana. 

# 10. External System Integration

## 10.1 Payment Gateway (PG)

**Provider:** PROVIDER TBD — wajib payment gateway berizin dengan fitur escrow.

| Aspek | Isi |
|---|---|
| **Purpose** | (a) Memproses pembayaran DP dan pelunasan dari penyewa secara on-platform; (b) menampung dana per booking dalam mekanisme escrow (rekening terpisah dari operasional DriveO); (c) memproses refund ke penyewa; (d) mengeksekusi payout (disbursement) dana sewa ke rekening rental. DriveO TIDAK PERNAH memegang dana di rekening operasionalnya — seluruh penampungan terjadi di sisi PG. |
| **Data sent** | 1. Payment order: `booking_ref`, `payment_type` (DP / PELUNASAN / FULL), rincian nominal (nominal sewa, DP, pelunasan, deposit), `expired_at` (durasi TBD / Validation Required), `callback_url`.<br>2. Refund instruction: `original_payment_ref`, nominal refund, alasan (`booking_expired`, `rental_no_confirm`, `user_cancel`, `rental_cancel`, `dispute_resolution`, `claim_adjustment`), `idempotency_key`.<br>3. Payout instruction: `booking_ref`, `rental_account_ref` (token/akun tujuan milik rental yang terdaftar di PG), nominal bersih (sewa − komisi TBD), rincian potongan untuk transparansi, `idempotency_key`.<br>4. Data rental: identitas rekening tujuan payout (didaftarkan sekali saat onboarding rental, bukan per transaksi). |
| **Data received** | 1. Status pembayaran: `BERHASIL` / `GAGAL` / `KEDALUWARSA` / `MENUNGGU` + `payment_ref` + timestamp.<br>2. Konfirmasi refund: `refund_ref`, status, timestamp.<br>3. Konfirmasi payout: `payout_ref`, status, timestamp, referensi bank (untuk layar "Dana Saya").<br>4. (Opsional, tergantung kapabilitas PG) saldo/posisi dana escrow per booking. |
| **Authentication** | API key + API secret milik DriveO (disimpan di secret vault, bukan di kode); seluruh panggilan via TLS. |
| **Webhook requirement** | WAJIB. Event: `payment.success`, `payment.failed`, `payment.expired`, `refund.success`, `refund.failed`, `payout.success`, `payout.failed`. Setiap webhook: (a) diverifikasi signature HMAC dengan secret khusus webhook; (b) diproses idempotent — `event_id` unik dari PG disimpan; event duplikat dikembalikan 200 dengan status `already_processed` tanpa mengubah state; (c) diproses asinkron via antrean agar timeout PG tidak menggagalkan penerimaan. Lihat endpoint POST `/webhooks/payment-gateway` (Bagian 11.20). |
| **Failure scenario** | (a) Timeout saat membuat payment order; (b) pembayaran GAGAL (dana tidak cukup, metode ditolak); (c) pembayaran KEDALUWARSA (melewati durasi TBD); (d) webhook terlambat/duplikat/hilang; (e) refund GAGAL (mis. rekening tujuan tidak valid); (f) payout GAGAL; (g) PG down total (semua API tidak merespons). |
| **Retry strategy** | Pembuatan payment order: retry otomatis dengan exponential backoff, maks. percobaan = TBD (Business Decision Required); setelah itu booking tetap `MENUNGGU_DP` dan penyewa diminta mencoba lagi (tidak ada auto-charge ulang tanpa aksi penyewa). Webhook gagal diproses internal: retry antrean internal dengan backoff. Refund/payout GAGAL: retry terjadwal oleh Sistem (Background Scheduler) maks. TBD kali, lalu diekalasikan ke Admin dengan status `GAGAL`. Tidak ada retry yang boleh menyebabkan double-charge atau double-payout — seluruh retry memakai idempotency key yang sama. |
| **Security consideration** | (a) DriveO tidak menyentuh data kartu — pembayaran lewat halaman/komponen hosted PG; (b) secret hanya di vault dengan rotasi berkala; (c) verifikasi signature webhook wajib, tolak tanpa signature valid; (d) IP allowlist PG bila didukung; (e) seluruh nominal dihitung ulang di backend DriveO dan dicocokkan dengan nominal dari PG sebelum state berubah (tolak mismatch); (f) audit log untuk setiap instruksi ke PG. |

> **Mode degradasi (PG down):** booking baru tidak dapat membuat link pembayaran (respons 503 dengan pesan jelas, bukan error generik); booking yang sudah `MENUNGGU_DP` menunggu hingga PG pulih atau hingga kedaluwarsa per aturan; payout tertunda dijadwalkan ulang otomatis; dashboard rental menampilkan status "menunggu payment gateway" agar transparan. Tidak ada dana yang dicatat sebagai diterima tanpa konfirmasi PG.

## 10.2 e-KYC Provider (Vendor Verifikasi Identitas)

**Provider:** PROVIDER TBD.

| Aspek | Isi |
|---|---|
| **Purpose** | OCR + pemeriksaan validitas format dokumen identitas penyewa (KTP + SIM, wajib untuk sewa lepas kunci). Hasil menjadi bahan konfirmasi rental. Kasus meragukan diteruskan ke Tim Verifikasi untuk review manual. |
| **Data sent** | Citra dokumen (KTP, SIM) — diutamakan diunggah langsung dari browser ke vendor (presigned upload) agar DriveO meminimalkan penyimpanan citra; bila harus via backend, teruskan tanpa menyimpan permanen. Metadata: `verification_request_id`, tipe dokumen. |
| **Data received** | Field hasil ekstraksi (nama, NIK — lihat catatan keamanan, tanggal lahir, nomor SIM), skor confidence, verdict: `VALID` / `SUSPICIOUS` / `INVALID`, alasan (mis. blur, format tidak dikenali). |
| **Authentication** | API key vendor + token per-request; TLS. |
| **Webhook requirement** | WAJIB bila vendor memproses asinkron: event `verification.completed` berisi `verification_request_id` + verdict. Penanganan idempotent seperti webhook PG (duplikat → `already_processed`). Bila vendor sinkron, DriveO melakukan polling status dengan batas waktu TBD. |
| **Failure scenario** | (a) Citra tidak terbaca (blur/gelap) → verdict SUSPICIOUS; (b) dokumen INVALID (format tidak valid); (c) vendor timeout/down; (d) hasil tidak kembali dalam batas waktu (TBD). |
| **Retry strategy** | Submit ulang oleh penyewa hanya untuk kasus INVALID/SUSPICIOUS yang dapat diperbaiki (foto ulang). Tidak ada auto-resubmit buta oleh sistem. Untuk vendor timeout: status request = `DIPROSES_OTOMATIS` tertunda, retry status maks. TBD kali lalu dialihkan ke `BUTUH_REVIEW_MANUAL`. |
| **Security consideration** | (a) Vendor diposisikan sebagai pemroses data (data processor) — DriveO menyimpan verdict + field minimal yang diperlukan, BUKAN arsip citra permanen (Legal Validation Required, UU PDP 27/2022); (b) consent eksplisit terpisah wajib dicatat sebelum upload (`consent_id` + timestamp + versi teks); (c) akses citra (bila ada yang tersimpan sementara) hanya via signed URL berumur pendek, berbasis peran (Tim Verifikasi, Tim Mediasi bila sengketa); (d) retensi data verifikasi = TBD (usulan proposal 90 hari → Validation Required); hapus/anonimkan atas permintaan pengguna (hak hapus UU PDP); (e) NIK tidak ditampilkan penuh di UI mana pun — tampilkan tersamar. |

## 10.3 Notification Provider

**Provider:** PROVIDER TBD (satu provider atau gabungan, mencakup push notification, WhatsApp, dan email).

| Aspek | Isi |
|---|---|
| **Purpose** | Pengiriman notifikasi berbasis event ke penyewa dan rental. Setiap event uang wajib memicu notifikasi instan (push + WhatsApp) ke rental: `dp_paid`, `final_payment_received`, `payout_scheduled`, `payout_completed`, `refund_issued`, `deposit_frozen`, `claim_opened`. Event non-uang (konfirmasi, pengingat handover, review) via push/email. |
| **Data sent** | `recipient_ref` (device token / nomor WA / email), `template_id`, variabel template (nama, nominal, nomor referensi booking — tanpa data sensitif), `idempotency_key` per event notifikasi, prioritas. |
| **Data received** | Delivery receipt: `DELIVERED` / `READ` / `FAILED` + timestamp + alasan gagal. |
| **Authentication** | API key provider; TLS. |
| **Webhook requirement** | Dianjurkan (bukan wajib): delivery receipt callback untuk memantau kegagalan kanal. Bila tidak didukung, DriveO menganggap terkirim setelah respons 2xx dari API provider. |
| **Failure scenario** | (a) Provider down; (b) nomor WA tidak valid / device token kedaluwarsa; (c) template ditolak (mis. kebijakan WhatsApp); (d) rate limit provider. |
| **Retry strategy** | Retry per kanal dengan backoff, maks. TBD kali. Fallback berlapis (degraded mode): WhatsApp gagal → kirim push + email; push gagal → email; semua kanal gagal → simpan di inbox notifikasi in-app (diambil via GET `/notifications`) dan tandai pending. Setiap event notifikasi punya idempotency key — retry tidak boleh mengirim duplikat. |
| **Security consideration** | (a) Template tidak memuat dokumen identitas, NIK, atau foto; (b) nomor telepon hanya dipakai untuk notifikasi transaksional yang disetujui pengguna (consent saat registrasi/onboarding rental); (c) tidak ada pesan marketing tanpa opt-in terpisah (di luar MVP bila ada → Future Scope). |

## 10.4 WhatsApp (Kanal Notifikasi Event Uang ke Rental)

WhatsApp dikirim melalui Notification Provider (10.3) — bagian ini menegaskan kontrak kanalnya karena bertemu kebiasaan operasional rental lokal.

| Aspek | Isi |
|---|---|
| **Purpose** | Kanal utama notifikasi event uang ke rental (PIC rental): DP diterima, pelunasan diterima, payout dijadwalkan/selesai/gagal, refund diterbitkan, deposit dibekukan/dilepas karena klaim. Tujuan: rental selalu tahu posisi dananya tanpa harus membuka dashboard. |
| **Data sent** | Nomor WA PIC rental (terverifikasi saat onboarding rental), template pesan transaksional + variabel (nominal, nomor referensi booking, status). |
| **Data received** | Status pengiriman (via provider 10.3). |
| **Authentication** | Melalui kredensial provider 10.3 (API key). |
| **Webhook requirement** | Mengikuti 10.3 (delivery receipt bila didukung). |
| **Failure scenario** | Nomor tidak terdaftar di WhatsApp; template belum disetujui; provider WA down. |
| **Retry strategy** | Mengikuti fallback berlapis 10.3: gagal di WA → push + email + inbox in-app. Perubahan nomor WA oleh rental wajib verifikasi ulang (OTP/kode verifikasi) sebelum aktif. |
| **Security consideration** | Pesan bersifat satu arah transaksional (bukan kanal sengketa atau pengiriman dokumen); tautan di pesan hanya ke domain resmi DriveO; tidak meminta kredensial atau data sensitif via chat. |

## 10.5 Object/File Storage

**Provider:** PROVIDER TBD (object storage apa pun yang mendukung enkripsi at-rest dan signed URL).

| Aspek | Isi |
|---|---|
| **Purpose** | Menyimpan: (a) foto kendaraan listing; (b) foto checklist handover & return (bukti kondisi body, odometer/BBM, kelengkapan); (c) dokumen kendaraan (STNK/BPKB — diunggah rental); (d) dokumen verifikasi rental (NIB/izin usaha, identitas PJ). Citra KTP/SIM penyewa sedapat mungkin TIDAK disimpan di sini (lihat 10.2). |
| **Data sent** | File biner + metadata: `owner_ref`, `booking_ref` (bila terkait), `doc_type`, `uploaded_by`, timestamp. Unggahan via presigned URL berumur pendek yang diterbitkan backend (browser mengunggah langsung ke storage). |
| **Data received** | `object_key`, konfirmasi unggahan, (opsional) checksum. |
| **Authentication** | Service account/IAM milik DriveO; presigned URL untuk klien; bucket private (tidak ada akses publik langsung). |
| **Webhook requirement** | Tidak wajib; backend memverifikasi penyelesaian unggahan via konfirmasi klien + pemeriksaan eksistensi objek. |
| **Failure scenario** | (a) Unggahan gagal di tengah jalan; (b) storage down — handover/return tidak dapat diselesaikan tanpa bukti foto (sistem menolak complete, bukan meloloskan tanpa bukti); (c) file korup/tipe tidak valid. |
| **Retry strategy** | Retry unggahan di sisi klien (resume bila didukung). Backend: pemeriksaan berkala objek yatim (teregistrasi tapi tidak terunggah) untuk dibersihkan. |
| **Security consideration** | (a) Enkripsi at-rest wajib; enkripsi in-transit (TLS); (b) akses baca hanya via signed URL berumur pendek (durasi TBD) dan dicek otorisasi (hanya pihak booking + peran internal berwenang); (c) validasi tipe file dan ukuran maks (batas TBD / Technical Decision Required) di backend sebelum presigned URL diterbitkan; pemindaian malware = [TECHNICAL DECISION REQUIRED]; (d) retensi mengikuti kebijakan data (foto bukti sengketa dipertahankan selama dispute + masa retensi TBD). |

## 10.6 Email

**Provider:** PROVIDER TBD (dapat menjadi bagian dari Notification Provider 10.3).

| Aspek | Isi |
|---|---|
| **Purpose** | Kanal pendukung bila dibutuhkan: (a) verifikasi email saat registrasi / reset password; (b) ringkasan transaksi (tanda terima DP/pelunasan); (c) rekap bulanan "Dana Saya" untuk rental (unduhan + pengiriman); (d) fallback bila push dan WhatsApp gagal. |
| **Data sent** | Alamat email, template + variabel (tanpa dokumen sensitif). |
| **Data received** | Status pengiriman/bounce (bila provider mendukung). |
| **Authentication** | API key provider; SPF/DKIM/DMARC pada domain pengirim DriveO. |
| **Webhook requirement** | Opsional: bounce/complaint callback untuk menandai alamat tidak valid. |
| **Failure scenario** | Bounce, masuk spam, provider down → fallback ke inbox in-app. |
| **Retry strategy** | Retry terbatas (maks. TBD); email verifikasi/reset dapat diminta ulang oleh pengguna dengan rate limit. |
| **Security consideration** | Tautan reset password bertoken sekali pakai dan kedaluwarsa (durasi TBD); tidak mengirim kata sandi atau OTP via email bersamaan dengan tautan login. |

## 10.7 Pola Lintas Integrasi (berlaku untuk semua di atas)

1. **Idempotency adalah kewajiban, bukan optimasi:** setiap instruksi berakibat uang (`payment order`, `refund`, `payout`) membawa `idempotency_key`; setiap webhook membawa `event_id` unik yang dicatat sebelum diproses.
2. **Timeout:** setiap panggilan eksternal memakai timeout eksplisit (nilai TBD / Technical Decision Required) + circuit breaker; kegagalan provider tidak boleh menggantung state uang — state tetap pada nilai terakhir yang terkonfirmasi dan setiap transisi dicatat di ledger/audit.
3. **Mode degradasi berlapis:** (a) PG down → pembayaran/payout ditunda, bukan dibatalkan sepihak; (b) e-KYC down → antrean review manual; (c) notifikasi down → inbox in-app; (d) storage down → proses bukti ditunda dengan pesan jelas. Setiap mode degradasi wajib terlihat di UI (bukan silent failure).
4. **Observabilitas:** setiap request/response integrasi penting (tanpa payload sensitif) dicatat ke audit log dengan `correlation_id` yang sama dengan booking/payment terkait.
5. **Rahasia:** seluruh API key/secret/webhook secret di secret vault; tidak ada di kode, log, atau artefak build.

# 11. API Requirements
#### Konvensi umum (berlaku untuk semua endpoint):
Prefix: `/api/v1` (konvensi teknis; dapat disesuaikan). 

- Autentikasi: header `Authorization: Bearer <JWT>` kecuali dinyatakan publik. Peran diambil dari klaim token (RBAC — lihat Bagian 12). 

- Format: JSON. Error generik: `401` (tidak terautentikasi), `403` (tidak berwenang), `404` (tidak ditemukan), `409` (konflik state/slot), `422` (validasi gagal), `429` (rate limit), `502/503/504` (provider eksternal bermasalah). 

- `Idempotency-Key` didukung pada seluruh POST yang berakibat uang atau pembuatan booking/pembayaran. 

- Paginasi daftar: query `page` , `limit` (default/batas TBD). 

- **Fase concierge:** selama 20 booking pertama, Admin/CS dapat melakukan aksi tertentu atas nama pengguna; seluruhnya tercatat di audit log dengan `acted_by` + `on_behalf_of` . 

## 11.1 /auth
#### POST /auth/register
- Actor: Publik (calon Penyewa). Purpose: mendaftarkan akun penyewa. Request: `nama, email, phone, password, consent_ts` (persetujuan syarat & kebijakan privasi). Response: `201 { user_id, email_verification: "pending" }` . Validation: email unik & format valid; phone format Indonesia; password memenuhi kebijakan (lihat Bagian 14); consent wajib true. Authorization: publik (rate limited). Error: `422` email sudah terdaftar; `422` consent tidak dicentang. Side effects: membuat User (status `UNVERIFIED_EMAIL` ); mengirim email verifikasi (10.6); audit `user_registered` . 

#### POST /auth/login
- Actor: Penyewa, Rental (owner/staf), staf internal. Purpose: masuk dan memperoleh token. Request: `email/phone, password` . Response: `200 { access_token (JWT, TTL TBD), refresh_token, role, rental_id? }` . Validation: kredensial cocok; akun tidak diblokir. Authorization: publik (rate limited, lockout setelah gagal beruntun — ambang TBD). Error: `401` kredensial salah; `403` akun diblokir/dinonaktifkan. Side effects: audit `user_login` (termasuk upaya gagal). 

#### POST /auth/logout
- Actor: terautentikasi. Purpose: mencabut refresh token sesi ini. Request: —. Response: `200 { revoked: true }` . Authorization: JWT. Error: `401` . Side effects: refresh token masuk daftar cabut; audit. 

#### POST /auth/refresh
- Actor: terautentikasi. Purpose: memperbarui access token. Request: `refresh_token` . Response: `200 { access_token }` . Validation: refresh token valid & belum dicabut. Authorization: refresh token. Error: `401` token tidak valid/dicabut. Side effects: rotasi refresh token (token lama dicabut). 

#### POST /auth/password/reset-request
- Actor: publik. Purpose: meminta tautan reset password. Request: `email` . Response: `200 { sent: true }` (selalu 200 agar tidak membocorkan keberadaan email). Authorization: publik (rate limited ketat). Error: `429` . Side effects: mengirim email berisi token sekali pakai kedaluwarsa (durasi TBD). 

#### POST /auth/password/reset-confirm
- Actor: publik. Purpose: menetapkan password baru. Request: `token, new_password` . Response: `200 { changed: true }` . Validation: token valid & belum kedaluwarsa; password memenuhi kebijakan. Authorization: token reset. Error: `422` token kedaluwarsa/tidak valid. Side effects: mencabut semua sesi aktif pengguna; audit. 

## 11.2 /users
#### GET /users/me
- Actor: Penyewa/Rental/staf. Purpose: mengambil profil diri. Response: `200 { user_id, nama, email, phone, role, verification_status, created_at }` (tanpa data sensitif penuh). Authorization: JWT (diri sendiri). Error: `401` . 

#### PATCH /users/me
- Actor: Penyewa/Rental/staf. Purpose: memperbarui profil (nama, phone, preferensi notifikasi). Request: field yang diubah. Response: `200` profil terbaru. Validation: phone format valid & unik; email tidak dapat diubah di sini (perlu verifikasi ulang — TBD). Authorization: JWT (diri sendiri). Error: `422` . Side effects: audit `profile_updated` . 

#### DELETE /users/me
- Actor: Penyewa. Purpose: penghapusan akun + data (hak hapus UU PDP). Request: `confirmation, password` . Response: `202 { deletion_scheduled: true }` . Validation: tidak ada booking aktif / dana tertahan (jika ada → 409 dengan daftar penghalang). Authorization: JWT. Error: `409` masih ada kewajiban aktif. Side effects: penjadwalan anonimisasi/penghapusan per kebijakan retensi (TBD / Legal Validation Required); audit. 

## 11.3 /rentals
#### POST /rentals
- Actor: Penyewa terautentikasi (calon pemilik rental). Purpose: mendaftarkan profil rental (mengajukan menjadi merchant). Request: `nama_rental, alamat, kota (DIY — scope pilot), phone_pic, deskripsi` . Response: `201 { rental_id, verification_status: "DRAFT" }` . Validation: satu user = satu rental aktif (aturan TBD / Business Decision Required); kota dalam cakupan pilot. Authorization: JWT role Penyewa (atau role baru setelah disetujui — TBD). Error: `409` sudah memiliki rental. Side effects: membuat entitas Rental; memicu alur verifikasi rental (11.9); audit. 

#### GET /rentals/{id}
- Actor: publik. Purpose: profil publik rental (untuk comparison). Response: `200 { nama, kota, verification_status, rating, total_booking_selesai, daftar listing ringkas }` (tanpa kontak internal/finansial). Authorization: publik. Error: `404` . 

#### PATCH /rentals/{id}
- Actor: Rental (owner). Purpose: memperbarui profil rental. Request: field profil. Response: `200` . Validation: perubahan data identitas penting (nama/alamat) dapat memicu verifikasi ulang (aturan TBD). Authorization: JWT + pemilik rental. Error: `403` . 

#### GET /rentals/{id}/dashboard
- Actor: Rental (owner/staf). Purpose: Dashboard Operasional — ringkasan booking (termasuk offline), kalender, pendapatan tertahan, tugas (konfirmasi tertunda, klaim). Response: `200 { summary, pending_confirmations, upcoming_handovers, funds_held, alerts }` . Authorization: JWT + pemilik/staf rental. Error: `403` . 

#### GET /rentals/{id}/ledger
- Actor: Rental (owner). Purpose: tab "Riwayat Dana" per booking — seluruh event keuangan bertimestamp + nomor referensi, immutable. Request: query `booking_id?` . Response: `200 { events: [{ ts, type, amount, ref, actor }] }` . Authorization: JWT + pemilik rental (atau staf dengan izin keuangan — TBD). Error: `403` . Side effects: tidak ada (read-only; ledger tidak dapat diubah via API apa pun). 

#### GET /rentals/{id}/funds
- Actor: Rental (owner). Purpose: layar "Dana Saya" — dana ditahan → dalam perjalanan → ditransfer + referensi bank. Response: `200 { held, in_transit, transferred: [...], commission_breakdown }` . Authorization: JWT + pemilik rental. Error: `403` . 

#### GET /rentals/{id}/recap
- Actor: Rental (owner). Purpose: rekap bulanan untuk diunduh. Request: query `month=YYYY-MM` . Response: `200` file/URL unduhan. Authorization: JWT + pemilik rental. Error: `403` , `404` periode kosong. Side effects: audit `recap_exported` . 

#### POST /rentals/{rentalId}/offline-orders
- Actor: Rental. Purpose: mencatat order non-platform (mis. via WA) agar kalender terkunci dan riwayat pelanggan terpusat — insentif anti double booking (batas jujur: mengurangi, bukan menghilangkan). Request: `vehicle_id, start, end, customer_name, notes` . Response: `201 { offline_order_id, slot_locked: true }` . Validation: slot tidak bertabrakan dengan booking platform/slot terkunci lain. Authorization: JWT + pemilik/staf rental. Error: `409` slot bertabrakan. Side effects: mengunci slot di Vehicle Availability; audit. (Tanpa aliran uang — dana tidak masuk escrow.) 

## 11.4 /vehicles
#### POST /rentals/{rentalId}/vehicles
- Actor: Rental. Purpose: menambah unit kendaraan ke katalog. Request: `jenis (motor/mobil — scope MVP), merek, model, tahun, plat_nomor, warna, kapasitas, transmisi, foto[]` . Response: `201 { vehicle_id, status: "DRAFT" }` . Validation: plat unik per rental; foto wajib minimal 1 (jumlah TBD). Authorization: JWT + pemilik/staf rental. Error: `422` , `403` . Side effects: audit. 

#### GET /rentals/{rentalId}/vehicles
- Actor: Rental. Purpose: daftar armada milik rental. Response: `200 { vehicles: [...] }` + status ketersediaan. Authorization: JWT + pemilik/staf rental. 

#### GET /vehicles/{id}
- Actor: Rental pemilik / staf internal. Purpose: detail unit (termasuk dokumen internal). Response: `200` detail penuh. Authorization: JWT + pemilik/staf rental atau Admin/Support/Mediasi (untuk kasus). Error: `403` . 

#### PATCH /vehicles/{id}
- Actor: Rental. Purpose: memperbarui data unit. Request: field yang diubah. Response: `200` . Validation: unit dengan booking aktif tidak dapat dinonaktifkan ( → 409). Authorization: JWT + pemilik/staf rental. Error: `409` ada booking aktif. 

#### DELETE /vehicles/{id}
- Actor: Rental (owner). Purpose: menonaktifkan unit (soft delete; riwayat dipertahankan). Response: `200 { status: "INACTIVE" }` . Validation: tidak ada booking aktif/mendatang. Authorization: JWT + pemilik rental. Error: `409` . Side effects: listing terkait ikut nonaktif; audit. 

#### POST /vehicles/{id}/documents
- Actor: Rental. Purpose: mengunggah dokumen kendaraan (STNK/BPKB) untuk verifikasi mitra. Request: multipart/file via presigned URL; `doc_type` . Response: `201 { document_id, status: "SUBMITTED" }` . Validation: tipe & ukuran file. Authorization: JWT + pemilik/staf rental. Error: `422` . Side effects: masuk antrean verifikasi rental; file ke storage terenkripsi (10.5). 

#### GET /vehicles/{id}/availability
- Actor: publik (ringkas) / Rental (penuh). Purpose: melihat kalender ketersediaan per unit. Request: query `from, to` . Response: `200 { slots: [{ date, status: AVAILABLE/BOOKED/BLOCKED/OFFLINE_ORDER }] }` . Authorization: publik untuk status ringkas; detail alasan block hanya untuk pemilik. Error: `404` . 

#### PUT /vehicles/{id}/availability
- Actor: Rental. Purpose: mengatur blokir kalender manual (mis. servis). Request: `[{ from, to, reason }]` . Response: `200` . Validation: tidak menimpa booking platform yang sudah TERKONFIRMASI ( → 409). Authorization: JWT + pemilik/staf rental. Error: `409` . Side effects: slot terkunci; audit. 

## 11.5 /listings
#### POST /listings
- Actor: Rental. Purpose: menerbitkan listing dari unit terverifikasi. Request: `vehicle_id, tarif_harian, deposit_nominal, biaya_antar_jemput?, syarat_sewa, deskripsi` . Response: `201 { listing_id, status: "ACTIVE", all_in_price }` . Validation: kendaraan milik rental & dokumen terverifikasi; tarif & deposit > 0; harga all-in dihitung sistem (tarif + deposit + antarjemput). Authorization: JWT + pemilik/staf rental. Error: `422` kendaraan belum terverifikasi. Side effects: audit. 

#### GET /listings/{id}
- Actor: publik. Purpose: detail listing untuk comparison (foto, spesifikasi, syarat, harga all-in, profil rental, penanda "diperbarui X lalu"). Response: `200` detail + `data_freshness` . Authorization: publik. Error: `404` (termasuk yang di-takedown). 

#### PATCH /listings/{id}
- Actor: Rental. Purpose: memperbarui tarif/deskripsi/syarat. Request: field yang diubah. Response: `200` + `updated_at` baru (penanda kebaruan ikut berubah). Validation: perubahan tarif tidak berlaku surut untuk booking berjalan. Authorization: JWT + pemilik/staf rental. Error: `403` . 

#### POST /listings/{id}/unpublish
- Actor: Rental. Purpose: menurunkan listing (sementara/permanen). Response: `200 { status: "INACTIVE" }` . Validation: booking aktif pada listing tetap berjalan hingga selesai. Authorization: JWT + pemilik/staf rental. Side effects: tidak muncul di search; audit. 

## 11.6 /search
#### GET /search
- Actor: publik. Purpose: discovery — cari listing tersedia. Request: query `lokasi, start_date, end_date, jenis, harga_min, harga_max, sort, page, limit` . Response: `200 { results: [{ listing ringkas, all_in_price, rental_verification_status, rating, data_freshness }], total }` . Validation: tanggal valid & start < end; rentang wajar (batas TBD). Authorization: publik (rate limited). Error: `422` tanggal tidak valid. Side effects: tidak ada (read-only). Catatan: listing basi otomatis turun peringkat + berlabel (aturan TBD / Business Decision Required). 

## 11.7 /bookings
#### POST /bookings
- Actor: Penyewa. Purpose: membuat booking + mengunci slot. Request: `listing_id, start_datetime, end_datetime, pickup_location?, catatan?` . Response: `201 { booking_id, booking_state: "MENUNGGU_DP", escrow_state: "MENUNGGU_DANA", dp_amount, payment_expires_at (durasi TBD), agreement_version }` . Validation: slot tersedia (jika tidak → 409, termasuk tabrakan dengan offline-order); penyewa bukan pemilik rental; verifikasi identitas belum wajib di tahap ini (wajib sebelum pembayaran — lihat 11.8). Authorization: JWT role Penyewa. Error: `409` slot terkunci/double booking; `422` . Side effects: slot dikunci; scheduler menjadwalkan auto-cancel saat `payment_expires_at` ; notifikasi ke rental (booking baru menunggu DP); audit `booking_created` . 

#### GET /bookings
- Actor: Penyewa / Rental. Purpose: daftar booking miliknya (dengan filter status). Response: `200 { bookings: [{ ringkas + booking_state + escrow_state }] }` . Authorization: JWT (hanya miliknya). 

#### GET /bookings/{id}
- Actor: Penyewa (pemilik) / Rental (pemilik listing) / staf internal. Purpose: detail booking + kedua state machine + riwayat event. Response: `200` detail penuh. Authorization: JWT + kepemilikan/peran. Error: `403` . 

#### GET /bookings/{id}/agreement
- Actor: Penyewa. Purpose: mengambil teks perjanjian sewa elektronik versi berlaku. Response: `200 { version, content, key_terms }` . Authorization: JWT + pemilik booking. Catatan: struktur final perjanjian = Legal Validation Required. 

#### POST /bookings/{id}/agreement/accept
- Actor: Penyewa. Purpose: persetujuan digital perjanjian (click-to-accept) — WAJIB sebelum pembayaran apa pun. Request: `version, accepted: true` . Response: `200 { accepted_at }` . Validation: versi = versi berlaku; belum pernah accept untuk booking ini. Authorization: JWT + pemilik booking. Error: `409` sudah disetujui. Side effects: audit `agreement_accepted` (siapa/kapan/versi). 

#### POST /bookings/{id}/confirm
- Actor: Rental. Purpose: rental menyetujui booking (dalam SLA TBD). Request: `—` (atau `notes?` ). Response: `200 { booking_state: "TERKONFIRMASI" }` . Precondition: booking_state = MENUNGGU_KONFIRMASI_RENTAL (DP sudah diterima). Validation: melewati SLA → 409 (sudah auto-batal oleh Sistem). Authorization: JWT + pemilik listing. Error: `409` state tidak valid. Side effects: notifikasi ke penyewa; audit `booking_confirmed` . 

#### POST /bookings/{id}/reject
- Actor: Rental. Purpose: rental menolak booking. Request: `reason` . Response: `200 { booking_state: "DITOLAK_RENTAL" }` . Precondition: MENUNGGU_KONFIRMASI_RENTAL. Authorization: JWT + pemilik listing. Side effects: **refund DP penuh otomatis** dari dana ditahan (via PG); penalti reputasi rental dicatat (aturan TBD); notifikasi + bantuan realokasi ke penyewa; audit. 

#### POST /bookings/{id}/cancel
- Actor: Penyewa / Rental. Purpose: pembatalan oleh pengguna. Request: `reason, cancelled_by` . Response: `200 { booking_state: "DIBATALKAN", refund: {...} }` . Validation: hanya dari state yang diizinkan (MENUNGGU_DP, MENUNGGU_KONFIRMASI_RENTAL, TERKONFIRMASI — aturan per state TBD); skema refund bertingkat berdasar H-berapa = TBD / Validation Required. Authorization: JWT + pihak booking. Error: `409` state tidak dapat dibatalkan (mis. DALAM_SEWA → via dispute). Side effects: slot dibuka; refund dihitung & dieksekusi dari dana ditahan; pembatalan oleh rental → refund penuh + penalti reputasi; notifikasi kedua pihak; audit. 

#### POST /bookings/{id}/extend
- Actor: Penyewa. Purpose: perpanjangan masa sewa via platform. Request: `new_end_datetime` . Response: `200 { extended, additional_amount, payment_required }` . Validation: slot tersedia; perpanjangan memerlukan pembayaran tambahan on-platform (mekanisme TBD / Validation Required). Authorization: JWT + pemilik booking. Error: `409` slot bertabrakan. Side effects: membuat kewajiban pembayaran tambahan; audit. 

## 11.8 /payments
#### POST /bookings/{id}/payments/dp
- Actor: Penyewa. Purpose: membuat pembayaran DP (payment order ke PG). Request: `payment_method? (sesuai kapabilitas PG), Idempotency-Key` . Response: `201 { payment_id, payment_state: "MENUNGGU", payment_url/qris_data, expires_at }` . Precondition: booking_state = MENUNGGU_DP; agreement sudah di-accept; belum ada payment DP yang MENUNGGU/BERHASIL. Validation: nominal DP dihitung sistem (persentase TBD — tidak diambil dari input klien). Authorization: JWT + pemilik booking. Error: `422` perjanjian belum disetujui; `409` DP sudah dibayar/dalam proses; `503` PG tidak tersedia. Side effects: payment order ke PG (10.1); audit `dp_payment_created` . 

#### POST /bookings/{id}/payments/final
- Actor: Penyewa. Purpose: membuat pelunasan saat serah terima (link/QRIS otomatis). Request: `Idempotency-Key` . Response: `201 { payment_id, payment_state: "MENUNGGU", qris_data/payment_url, expires_at }` . Precondition: booking_state = MENUNGGU_PELUNASAN (rental terkonfirmasi & handover dimulai). Validation: nominal = total − DP (dihitung sistem). Authorization: JWT + pemilik booking. Error: `409` state tidak valid. Side effects: setelah webhook BERHASIL → escrow_state = LUNAS → handover checklist TERBUKA; audit. 

#### GET /bookings/{id}/payments
- Actor: Penyewa (pemilik) / Rental (pemilik listing) / staf. Purpose: daftar pembayaran per booking. Response: `200 { payments: [{ id, type, amount, state, ref, ts }] }` . Authorization: JWT + kepemilikan/peran. 

#### GET /payments/{id}
- Actor: pihak booking / staf. Purpose: detail satu pembayaran. Response: `200` detail + riwayat event. Authorization: JWT + kepemilikan/peran. 

## 11.9 /verifications
#### POST /verifications/identity
- Actor: Penyewa. Purpose: mengajukan verifikasi identitas (upload KTP + SIM). Request: `consent_id` (consent eksplisit terpisah — wajib), referensi unggahan dokumen (via vendor/presigned). Response: `201 { verification_id, state: "DISUBMIT" }` . Validation: consent tercatat; dokumen lengkap (KTP + SIM untuk lepas kunci). Authorization: JWT role Penyewa. Error: `422` consent/dokumen tidak lengkap. Side effects: diteruskan ke vendor e-KYC (10.2); audit `verification_submitted` . 

#### GET /verifications/identity/me
- Actor: Penyewa. Purpose: status verifikasi diri. Response: `200 { state, verdict?, submitted_at, decided_at? }` (tanpa citra mentah). Authorization: JWT (diri sendiri). 

#### POST /verifications/rental
- Actor: Rental. Purpose: mengajukan verifikasi mitra (identitas PJ, NIB/izin usaha, dokumen kendaraan). Request: `pic_identity_ref, nib, business_docs_ref, vehicle_docs_ref` . Response: `201 { verification_id, state: "DISUBMIT" }` . Validation: NIB format valid (verifikasi via OSS — TBD / Legal Validation Required). Authorization: JWT + pemilik rental. Error: `422` . Side effects: antrean Tim Verifikasi; audit. 

#### GET /admin/verifications
- Actor: Tim Verifikasi, Admin. Purpose: antrean review (kasus SUSPICIOUS/INVALID + verifikasi rental). Request: query `type, state, page` . Response: `200 { queue: [...] }` . Authorization: JWT + peran Verifikasi/Admin. Catatan: akses citra via signed URL berumur pendek, tercatat di audit. 

#### POST /verifications/{id}/approve
- Actor: Tim Verifikasi. Purpose: menyetujui verifikasi. Request: `notes?` . Response: `200 { state: "DISETUJUI" }` . Precondition: state = BUTUH_REVIEW_MANUAL. Authorization: JWT + peran Verifikasi. Error: `409` . Side effects: penyewa/rental dapat lanjut ke tahap berikut; hasil diteruskan ke rental sebagai bahan konfirmasi (untuk identitas penyewa); notifikasi; audit `verification_approved` . 

#### POST /verifications/{id}/reject
- Actor: Tim Verifikasi. Purpose: menolak verifikasi (dokumen palsu → tolak/blokir). Request: `reason_code, notes` . Response: `200 { state: "DITOLAK", resubmit_allowed }` . Precondition: BUTUH_REVIEW_MANUAL. Authorization: JWT + peran Verifikasi. Error: `409` . Side effects: notifikasi + alasan (tanpa detail forensik); indikasi dokumen palsu → eskalasi blokir akun (aturan TBD); audit `verification_rejected` . 

## 11.10 /handover
#### GET /bookings/{id}/handover
- Actor: pihak booking. Purpose: status handover (TERKUNCI/TERBUKA, checklist, foto). Response: `200 { handover_state, locked_reason?, checklist, photos }` . Authorization: JWT + pihak booking. Catatan: state TERKUNCI selama escrow_state ≠ LUNAS — sistem mencegah, bukan sekadar mengecek. 

#### POST /bookings/{id}/handover/checklist
- Actor: Rental / Penyewa. Purpose: mengisi checklist kondisi (body, odometer/BBM, kelengkapan) oleh masing-masing pihak. Request: `items: [{ key, condition, notes }]` . Response: `200 { handover_state: "CHECKLIST_DIISI" }` . Precondition: handover TERBUKA (LUNAS). Validation: item wajib lengkap (daftar TBD). Authorization: JWT + pihak booking. Error: `403` masih TERKUNCI (belum LUNAS). Side effects: audit per pengisi. 

#### POST /bookings/{id}/handover/photos
- Actor: Rental / Penyewa. Purpose: mengunggah foto bukti kondisi. Request: referensi unggahan (presigned) + `photo_type` . Response: `201` . Validation: tipe/ukuran file. Authorization: JWT + pihak booking. Error: `403` TERKUNCI. Side effects: objek ke storage terenkripsi (10.5). 

#### POST /bookings/{id}/handover/confirm
- Actor: Rental / Penyewa (masing-masing). Purpose: konfirmasi serah terima oleh kedua pihak. Response: `200 { confirmations: { rental, renter }, handover_state }` . Precondition: checklist + foto lengkap dari kedua pihak. Authorization: JWT + pihak booking. Error: `422` bukti belum lengkap. Side effects: bila kedua pihak konfirmasi → handover_state = SELESAI, booking_state = DALAM_SEWA; notifikasi; audit `handover_completed` . 

## 11.11 /returns
#### POST /bookings/{id}/return/checklist
- Actor: Rental / Penyewa. Purpose: checklist pengembalian (item sama dengan handover). Request: `items` . Response: `200 { return_state: "CHECKLIST_DIISI" }` . Precondition: booking_state = DALAM_SEWA. Authorization: JWT + pihak booking. Side effects: audit. 

#### POST /bookings/{id}/return/photos
- Actor: Rental / Penyewa. Purpose: foto bukti kondisi saat kembali. Request: referensi unggahan + `photo_type` . Response: `201` . Authorization: JWT + pihak booking. Side effects: storage terenkripsi. 

#### POST /bookings/{id}/return/confirm
- Actor: Rental (dan Penyewa — konfirmasi kedua pihak). Purpose: konfirmasi pengembalian. Request: `late_minutes?` (sistem menghitung dari jadwal; denda per jam sesuai perjanjian — besaran TBD). Response: `200 { return_state: "SELESAI", booking_state: "SELESAI" }` . Precondition: checklist + foto lengkap. Authorization: JWT + pihak booking. Error: `422` bukti belum lengkap. Side effects: **memicu** : (a) mulai claim window 24 jam untuk deposit; (b) penjadwalan payout H+1 (dikonfirmasi tanpa sengketa); (c) komisi tercatat (besaran TBD); (d) review dibuka untuk kedua pihak; notifikasi; audit `return_completed` . 

## 11.12 /deposits
#### GET /bookings/{id}/deposit
- Actor: pihak booking / staf. Purpose: status deposit (DITAHAN / CLAIM_WINDOW_24JAM / DILEPAS / DIBEKUKAN_KLAIM / DIPOTONG_SEBAGIAN). Response: `200 { deposit_state, amount, window_ends_at?, claim_ref? }` . Authorization: JWT + pihak booking/peran. Catatan: mekanisme penghimpunan deposit via PG = TBD (tergantung kapabilitas PG). 

#### POST /bookings/{id}/deposit/release
- Actor: Sistem (scheduler) / Admin (manual). Purpose: melepas deposit setelah claim window 24 jam tanpa klaim. Response: `200 { deposit_state: "DILEPAS" }` . Precondition: CLAIM_WINDOW_24JAM kedaluwarsa & tidak ada klaim. Authorization: sistem internal / Admin. Error: `409` ada klaim aktif. Side effects: instruksi ke PG untuk melepas; ledger event; notifikasi; audit. 

#### POST /bookings/{id}/deposit/freeze
- Actor: Sistem (saat klaim dibuat) / Admin. Purpose: membekukan deposit karena klaim. Request: `claim_id` . Response: `200 { deposit_state: "DIBEKUKAN_KLAIM" }` . Authorization: sistem/Admin. Side effects: rental diberi tahu alasan, durasi, cara merespons; audit. 

## 11.13 /claims
#### POST /bookings/{id}/claims
- Actor: Rental. Purpose: mengajukan klaim kerusakan dalam claim window 24 jam. Request: `description, claimed_amount, evidence_refs[]` (merujuk foto return + tambahan). Response: `201 { claim_id, status: "OPEN" }` . Precondition: return SELESAI & dalam 24 jam; deposit_state → DIBEKUKAN_KLAIM. Validation: claimed_amount ≤ deposit (aturan TBD). Authorization: JWT + pemilik listing. Error: `409` di luar claim window. Side effects: deposit dibekukan; notifikasi ke penyewa (hak merespons); audit `claim_created` . 

#### GET /claims/{id}
- Actor: pihak booking / Tim Mediasi / Admin. Purpose: detail klaim + bukti. Response: `200` detail. Authorization: JWT + kepemilikan/peran. 

#### POST /claims/{id}/resolve
- Actor: Tim Mediasi. Purpose: keputusan klaim (potong sebagian / lepas penuh). Request: `decision (DEDUCT_PARTIAL / RELEASE_FULL), amount?, rationale` . Response: `200 { claim_status: "RESOLVED", deposit_state }` . Authorization: JWT + peran Mediasi. Error: `409` klaim sudah resolved. Side effects: eksekusi finansial via PG dari dana ditahan; ledger event; notifikasi kedua pihak; audit. 

## 11.14 /refunds
#### POST /bookings/{id}/refunds
- Actor: Admin. Purpose: menerbitkan refund manual (kasus khusus di luar auto-refund). Request: `amount, reason_code, notes` . Response: `201 { refund_id, status: "PROCESSING" }` . Validation: amount ≤ dana ditahan untuk booking (prinsip: **refund hanya dari dana yang ditahan** — platform tidak menalangi). Authorization: JWT + peran Admin. Error: `422` melebihi dana ditahan. Side effects: instruksi refund ke PG (idempotent); ledger event; notifikasi; audit `refund_created` . Catatan: refund otomatis (expired, no-confirm, reject) dieksekusi Sistem tanpa endpoint ini. 

#### GET /bookings/{id}/refunds
- Actor: pihak booking / staf. Purpose: daftar refund per booking. Response: `200 { refunds: [...] }` . Authorization: JWT + kepemilikan/peran. 

#### GET /refunds/{id}
- Actor: pihak booking / staf. Purpose: detail + status PG. Response: `200` . Authorization: JWT + kepemilikan/peran. 

## 11.15 /payouts
#### GET /rentals/{rentalId}/payouts
- Actor: Rental. Purpose: daftar payout (terjadwal/diproses/berhasil/gagal). Response: `200 { payouts: [{ booking_ref, amount_net, commission, state, bank_ref, ts }] }` . Authorization: JWT + pemilik rental. 

#### POST /admin/payouts/{id}/retry
- Actor: Admin. Purpose: retry payout yang GAGAL. Response: `200 { state: "DIPROSES" }` . Precondition: payout_state = GAGAL. Validation: batas retry TBD. Authorization: JWT + peran Admin. Error: `409` bukan GAGAL. Side effects: instruksi ulang ke PG dengan idempotency key yang sama; audit. 

#### POST /admin/payouts/run
- Actor: Sistem (scheduler) / Admin. Purpose: mengeksekusi payout terjadwal (H+1 setelah return terkonfirmasi, tanpa sengketa). Request: `batch_date?` . Response: `200 { processed, failed }` . Authorization: sistem internal / Admin. Side effects: instruksi payout ke PG per booking; escrow_state → DITERUSKAN saat PG konfirmasi BERHASIL; ledger event; notifikasi WA+push ke rental; audit `payout_completed` . 

## 11.16 /reviews
#### POST /bookings/{id}/reviews
- Actor: Penyewa / Rental. Purpose: memberi rating dua arah. Request: `rating, comment?, target (RENTAL/RENTER)` . Response: `201 { review_id }` . Precondition: booking_state = SELESAI (anti fake review — hanya transaksi terselesaikan); satu review per pihak per booking. Validation: rating dalam skala TBD. Authorization: JWT + pihak booking. Error: `409` sudah memberi review / booking belum selesai. Side effects: agregat rating diperbarui; notifikasi; audit `review_submitted` . 

#### GET /rentals/{id}/reviews
- Actor: publik. Purpose: ulasan untuk profil rental (comparison). Response: `200 { reviews, aggregate }` . Authorization: publik. 

#### GET /users/me/reviews
- Actor: Penyewa/Rental. Purpose: ulasan yang diterima/diberikan. Response: `200` . Authorization: JWT (diri sendiri). 

## 11.17 /disputes
#### POST /bookings/{id}/disputes
- Actor: Penyewa / Rental. Purpose: membuka sengketa. Request: `category (UNIT_TAK_SESUAI / KERUSAKAN / KETERLAMBATAN / MOGOK / DUGAAN_PENGGELAPAN / DOKUMEN_PALSU / LAINNYA), description, evidence_refs[]` . Response: `201 { dispute_id, state: "DIBUKA" }` . Validation: booking dalam state yang memungkinkan sengketa (aturan TBD). Authorization: JWT + pihak booking. Error: `409` dispute sudah terbuka. Side effects: dana terkait dibekukan (escrow_state cabang DIBEKUKAN_KLAIM bila relevan); payout ditunda; notifikasi ke Tim Mediasi; audit `dispute_opened` . 

#### GET /disputes/{id}
- Actor: pihak booking / Tim Mediasi / Admin / Support. Purpose: detail sengketa + bukti + riwayat mediasi. Response: `200` . Authorization: JWT + kepemilikan/peran. 

#### POST /disputes/{id}/mediate
- Actor: Tim Mediasi. Purpose: mencatat keputusan mediasi. Request: `decision, financial_action? (refund/claim_deduction/payout_release), rationale` . Response: `200 { state: "SELESAI_DISETUJUI" | "DITUTUP_TANPA_KESEPAKATAN" | "DIESKALASI_HUKUM" }` . Authorization: JWT + peran Mediasi. Error: `409` state tidak valid. Side effects: aksi finansial dieksekusi dari dana ditahan; paket bukti disiapkan bila eskalasi hukum (akun terduga diblokir — aturan TBD); notifikasi; audit. 

#### POST /disputes/{id}/evidence
- Actor: pihak booking. Purpose: menambah bukti selama mediasi. Request: `evidence_refs[], notes` . Response: `201` . Authorization: JWT + pihak booking. Side effects: audit. 

## 11.18 /notifications
#### GET /notifications
- Actor: terautentikasi. Purpose: inbox notifikasi in-app (fallback bila kanal eksternal gagal). Request: query `unread_only?, page` . Response: `200 { notifications: [{ id, type, title, body, booking_ref?, ts, read }] }` . Authorization: JWT (diri sendiri). 

#### POST /notifications/{id}/read
- Actor: terautentikasi. Purpose: menandai dibaca. Response: `200` . Authorization: JWT (milik sendiri). 

#### GET /notifications/preferences
- Actor: terautentikasi. Purpose: preferensi kanal (push/WA/email) — notifikasi event uang ke rental tetap wajib (tidak dapat dimatikan). Response: `200` . Authorization: JWT. 

#### PATCH /notifications/preferences
- Actor: terautentikasi. Purpose: mengubah preferensi. Request: `channels: { push, whatsapp, email }` . Validation: kanal wajib (event uang untuk rental) tidak dapat dinonaktifkan. Authorization: JWT. Error: `422` . 

## 11.19 /admin
#### GET /admin/dashboard
- Actor: Admin. Purpose: ringkasan operasional platform (booking, dana tertahan, antrean verifikasi, dispute terbuka, payout gagal). Response: `200` . Authorization: JWT + peran Admin. 

#### GET /admin/audit-logs
- Actor: Admin. Purpose: melihat audit trail. Request: query `actor, entity, from, to, page` . Response: `200 { logs: [...] }` . Authorization: JWT + peran Admin. Catatan: read-only; tidak ada endpoint tulis/hapus audit log. 

#### POST /admin/users/{id}/block
- Actor: Admin. Purpose: memblokir akun (mis. dokumen palsu, dugaan penggelapan). Request: `reason_code, notes` . Response: `200 { status: "BLOCKED" }` . Authorization: JWT + peran Admin. Error: `409` sudah diblokir. Side effects: sesi dicabut; booking aktif ditangani per aturan (TBD); notifikasi; audit. 

#### POST /admin/users/{id}/unblock
- Actor: Admin. Purpose: membuka blokir. Response: `200` . Authorization: JWT + peran Admin. Side effects: audit. 

#### POST /admin/rentals/{id}/suspend
- Actor: Admin. Purpose: menangguhkan rental. Request: `reason_code` . Response: `200` . Authorization: JWT + peran Admin. Side effects: listing nonaktif sementara; booking berjalan tetap diselesaikan; audit. 

#### POST /admin/listings/{id}/takedown
- Actor: Admin. Purpose: menurunkan listing bermasalah. Request: `reason_code` . Response: `200` . Authorization: JWT + peran Admin. Side effects: tidak muncul di search; audit. 

#### GET /admin/funds/overview
- Actor: Admin. Purpose: pantau dana tertahan agregat (rekonsiliasi vs laporan PG). Response: `200 { held_total, in_transit, discrepancies[] }` . Authorization: JWT + peran Admin. Catatan: angka agregat untuk rekonsiliasi; bukan kepemilikan dana. 

## 11.20 /webhooks (inbound dari provider eksternal)
#### POST /webhooks/payment-gateway
- Actor: Payment Gateway (sistem-ke-sistem). Purpose: menerima event status pembayaran/refund/payout. Request: header `X-PG-Signature` , `X-Event-Id` ; body `{ event_type, payment_ref/booking_ref, status, amount, ts }` . Response: `200 { received: true, processing: "accepted" | "already_processed" }` — selalu 200 untuk event valid agar PG tidak retry buta; 401 untuk signature tidak valid. Validation: (1) verifikasi HMAC signature — GAGAL → 401, tidak diproses; (2) cocokkan `amount` dengan catatan internal — mismatch → tandai untuk investigasi, state TIDAK berubah; (3) idempotency: `event_id` sudah ada → `already_processed` . Authorization: signature PG (bukan JWT). Error: `401` signature invalid; `400` payload tidak dikenal. Side effects: transisi Payment/Booking/Escrow state sesuai event (dp_paid → MENUNGGU_KONFIRMASI_RENTAL + DITAHAN_ESCROW; final paid → LUNAS + buka handover; dsb.); ledger event; notifikasi (push + WA untuk event uang); audit. Seluruh pemrosesan via antrean (async). 

#### POST /webhooks/ekyc
- Actor: Vendor e-KYC. Purpose: menerima hasil verifikasi asinkron. Request: header signature vendor; body `{ verification_request_id, verdict, fields?, reason? }` . Response: `200` . Validation: signature; idempotency per request id. Authorization: signature vendor. Error: `401` . Side effects: VerificationState → DISETUJUI / BUTUH_REVIEW_MANUAL / DITOLAK; notifikasi; audit. 

#### POST /webhooks/notification
- Actor: Notification Provider. Purpose: delivery receipt (bila didukung). Request: `{ notification_id, status, ts }` . Response: `200` . Authorization: signature/API key provider. Side effects: update status pengiriman; memicu fallback kanal bila FAILED. 

# 12. Authorization Matrix

Legenda sel: `CRUD` = buat-baca-ubah-hapus · `Approve` = menyetujui · `Reject` = menolak · `View` = baca saja · `No Access` = tidak ada akses. 
Catatan cakupan: kecuali dinyatakan lain, aksi berlaku hanya pada data milik sendiri (booking/listing/kendaraan/dana milik pihak tersebut). `*` = selama fase concierge (20 booking pertama), tim inti dapat bertindak atas nama pengguna; tercatat di audit log.

| Kapabilitas | Penyewa | Rental | Admin | Verification (Tim Verifikasi) | Support (CS) | Mediation (Tim Mediasi) |
|---|---|---|---|---|---|---|
| View Listing | View | View | View | View | View | View |
| Create Booking | CRUD (milik sendiri) | No Access | CRUD* | No Access | No Access | No Access |
| Manage Vehicle | No Access | CRUD | View | View | View | View |
| Manage Listing | No Access | CRUD | CRUD (moderasi) | View | View | View |
| Confirm Booking | No Access | Approve / Reject (booking miliknya) | No Access | No Access | No Access | No Access |
| View Payment (own) | View (milik sendiri) | View (milik sendiri) | View | No Access | View (kasus ditangani) | View (sengketa ditangani) |
| View Riwayat Dana | View (milik sendiri) | View (milik sendiri) | View | No Access | View (kasus ditangani) | View (sengketa ditangani) |
| Upload Verification | CRUD (identitas diri) | CRUD (dokumen mitra) | No Access | No Access | No Access | No Access |
| Review Verification | No Access | No Access | View | Approve / Reject | View | No Access |
| Manage Agreement | Approve (click-to-accept) | Approve (ketentuan rental) | CRUD (template) | View | View | View |
| Manage Handover | CRUD (pihak booking) | CRUD (pihak booking) | View | No Access | View | View |
| Manage Dispute | CRUD (buka miliknya) | CRUD (buka miliknya) | View | No Access | View | Approve / Reject (putusan mediasi) |
| Manage Refund | No Access | No Access | CRUD (eksekusi) | No Access | View | Approve (rekomendasi hasil mediasi) |
| Manage Payout | No Access | View (status miliknya) | CRUD (jadwal/eksekusi/retry) | No Access | View | View (bila dibekukan) |
| Manage Claim | No Access | CRUD (ajukan miliknya) | View | No Access | View | Approve / Reject (putusan) |
| View Audit Log | No Access | No Access | View | No Access | View | View |
| Moderate User | No Access | No Access | CRUD (blokir/buka) | No Access | View | No Access |
| Moderate Rental | No Access | No Access | CRUD (tangguhkan) | Approve / Reject (verifikasi mitra) | View | No Access |
| Send Notification | No Access | No Access | CRUD | No Access | CRUD (ke pengguna terkait) | CRUD (ke pihak sengketa) |
| Manage Pricing | No Access | CRUD (tarif listing miliknya) | View | No Access | No Access | No Access |
| View Own Ledger | View | View | View | No Access | View (kasus ditangani) | View (sengketa ditangani) |
| Export Recap | No Access | View (unduh miliknya) | View | No Access | View | No Access |

### Catatan konsistensi peran:
1. Pada pilot, peran Admin/Verification/Support/Mediation dirangkap tim inti — matrix di atas mendefinisikan peran logis; satu orang dapat memegang beberapa peran, dan setiap aksi tercatat di audit log beserta peran yang dipakai.
2. Manage Refund: refund otomatis (booking kedaluwarsa, rental tidak konfirmasi, rental menolak) dieksekusi oleh Sistem (Background Scheduler) tanpa peran manusia; Admin menangani refund manual/kasus khusus.
3. Manage Payout: eksekusi rutin oleh Sistem (jadwal H+1); Admin menangani retry dan kasus gagal.
4. Rental tidak dapat melihat data pembayaran booking milik rental lain; Penyewa tidak dapat melihat ledger rental. Data finansial selalu dibatasi kepemilikan.
5. Tim Verifikasi hanya mengakses dokumen yang masuk antrean review-nya, via signed URL berumur pendek yang tercatat di audit.

# 13. Error & Exception Handling
#### Prinsip yang tidak boleh dilanggar:
1. **Refund hanya dari dana yang ditahan** — platform tidak pernah menalangi dari kantong sendiri. 

2. **Tidak ada state uang yang menggantung tanpa event ledger** — setiap perubahan posisi dana (diterima, ditahan, dibekukan, direfund, diteruskan) wajib tercatat sebagai event ledger yang immutable, bertimestamp, dan bernomor referensi. 

3. Kegagalan provider eksternal tidak boleh mengubah state uang secara sepihak — state bertahan pada nilai terakhir yang terkonfirmasi. 

## 13.1 Payment Failed (pembayaran DP/pelunasan GAGAL di PG)
- **Penyebab:** dana tidak cukup, metode pembayaran ditolak PG, atau kesalahan otorisasi. 
- **Deteksi:** webhook `payment.failed` dari PG, atau respons sinkron gagal saat membuat payment order. 

- **Respons sistem:** Payment state → GAGAL; booking_state tetap (MENUNGGU_DP / MENUNGGU_PELUNASAN); slot tetap terkunci hingga kedaluwarsa; penyewa dapat membuat payment order baru (idempotency key baru). 

- **Dampak ke state:** tidak ada perubahan EscrowState (tetap MENUNGGU_DANA / DITAHAN_ESCROW untuk DP yang sudah ada); **tidak ada ledger event dana** (tidak ada uang bergerak). 

- **Notifikasi:** push ke penyewa ("pembayaran gagal, silakan coba lagi"); rental tidak perlu dinotifikasi untuk kegagalan DP penyewa.
- **Pemulihan:** penyewa mengulang pembayaran sebelum `expires_at` ; bila melewati batas → skenario 13.2. 

## 13.2 Payment Expired (link pembayaran DP kedaluwarsa)
- **Penyebab:** penyewa tidak menyelesaikan pembayaran dalam durasi TBD (Validation Required). 
- **Deteksi:** Sistem (Background Scheduler) memeriksa `payment_expires_at` ; atau webhook `payment.expired` dari PG.
- **Respons sistem:** Payment state → KEDALUWARSA; booking_state → KEDALUWARSA; slot dibuka kembali. 

- **Dampak ke state:** EscrowState tetap MENUNGGU_DANA (tidak ada dana masuk); ledger mencatat event `booking_expired` (nondana). 
- **Notifikasi:** push + email ke penyewa ("booking kedaluwarsa"); notifikasi ke rental (slot kembali tersedia). 
- **Pemulihan:** penyewa membuat booking baru; tidak ada refund karena tidak ada dana yang ditahan. 

## 13.3 Duplicate Payment Webhook
- **Penyebab:** PG mengirim ulang event yang sama (retry PG, gangguan jaringan). 
- **Deteksi:** `event_id` sudah tercatat di tabel webhook events. 
- **Respons sistem:** kembalikan `200 { processing: "already_processed" }` ; **tidak ada transisi state, tidak ada ledger event baru, tidak ada notifikasi ulang.** 
- **Dampak ke state:** nihil (idempotent). 
- **Notifikasi:** tidak ada. 
- **Pemulihan:** tidak diperlukan. Seluruh handler webhook wajib idempotent sejak desain (lihat 10.1, 11.20). 

## 13.4 Booking Expired (tanpa DP)
- **Penyebab:** sama dengan 13.2 — dipandang dari sisi booking. 

**Deteksi / Respons / Dampak / Notifikasi / Pemulihan:** identik dengan 13.2. Slot yang dikunci dilepas agar dapat dibooking pihak lain; riwayat booking kedaluwarsa tetap tersimpan untuk analitik (tanpa data sensitif berlebih). 

## 13.5 Rental Tidak Confirm (melewati SLA konfirmasi)
- **Penyebab:** rental tidak menekan konfirmasi dalam SLA TBD (usulan 2 jam → Validation Required) setelah DP diterima. 
- **Deteksi:** Sistem (Background Scheduler) memeriksa `confirmation_deadline` . 

- **Respons sistem:** booking_state → DIBATALKAN (alasan: `rental_no_confirm` ); slot dibuka; **refund DP penuh otomatis** dari dana ditahan via PG. 

- **Dampak ke state:** EscrowState: DITAHAN_ESCROW → DIREFUND_PENUH; ledger mencatat `refund_issued` (penuh) + `booking_cancelled` . 

- **Notifikasi:** push + WA ke rental (peringatan sebelum deadline + pemberitahuan pembatalan); push + email ke penyewa (DP kembali penuh + bantuan realokasi/alternatif). 
- **Pemulihan:** penalti reputasi rental dicatat (aturan TBD); penyewa membuat booking baru. 

## 13.6 Verification Failed (e-KYC gagal / ditolak)
- **Penyebab:** verdict vendor INVALID/SUSPICIOUS yang dikonfirmasi Tim Verifikasi; atau dokumen tidak memenuhi syarat.
- **Deteksi:** webhook/keputusan verifikasi → VerificationState = DITOLAK. 

- **Respons sistem:** penyewa tidak dapat melanjutkan ke pembayaran (endpoint DP mengembalikan 422); dapat resubmit bila diizinkan. 

- **Dampak ke state:** booking tetap MENUNGGU_DP hingga kedaluwarsa; tidak ada dana bergerak. 

- **Notifikasi:** push + email ke penyewa (alasan umum + cara memperbaiki); indikasi dokumen palsu → eskalasi ke Admin (potensi blokir, aturan TBD). 
- **Pemulihan:** foto ulang dokumen / ajukan banding via Support (alur TBD). 

## 13.7 Invalid Document (dokumen kendaraan/mitra tidak valid)
- **Penyebab:** STNK/BPKB/NIB tidak terbaca atau tidak valid saat verifikasi rental. 
- **Deteksi:** review Tim Verifikasi. 

- **Respons sistem:** listing terkait tidak dapat diterbitkan (atau diturunkan bila sudah aktif); rental diberi daftar perbaikan. 

- **Dampak ke state:** kendaraan/listing tetap DRAFT/INACTIVE; booking yang sudah berjalan pada listing tersebut tetap diselesaikan (tidak dibatalkan sepihak). 

- **Notifikasi:** push + email ke rental. 
- **Pemulihan:** unggah ulang dokumen yang benar; verifikasi ulang. 

## 13.8 Vehicle Unavailable / Double Booking (termasuk order WA paralel)
- **Penyebab:** slot sudah terkunci oleh booking lain, offline-order, atau blokir kalender; **batas jujur proposal:** selama order WA paralel ada di luar sistem, double booking hanya dapat dikurangi, bukan dihilangkan. 

- **Deteksi:** (a) saat booking: pemeriksaan slot atomik → 409 bila bertabrakan; (b) pasca-booking: rental melaporkan konflik via cancel/reject dengan alasan `unit_unavailable` . 

- **Respons sistem:** (a) tolak pembuatan booking (409 + alternatif slot/unit); (b) bila konflik ditemukan setelah DP: rental wajib reject/cancel → **refund penuh otomatis** dari dana ditahan (diperlakukan seperti 13.5 dari sisi dana). 

- **Dampak ke state:** tidak ada booking ganda pada slot yang sama di dalam sistem; EscrowState booking yang dibatalkan → DIREFUND_PENUH dengan ledger event. 

- **Notifikasi:** penyewa (penolakan + refund + alternatif); rental diingatkan mencatat order non-platform via `POST /rentals/{rentalId}/offline-orders` sebagai mitigasi. 
- **Pemulihan:** realokasi ke unit/slot lain; insentif pencatatan offline-order (riwayat pelanggan terpusat) sebagai mitigasi struktural. 

## 13.9 Cancellation (pembatalan oleh pengguna/rental)
- **Penyebab:** penyewa berubah pikiran; rental tidak dapat menyediakan unit. 
- **Deteksi:** `POST /bookings/{id}/cancel` . 

- **Respons sistem:** state → DIBATALKAN; slot dibuka; refund dihitung per skema bertingkat (H-berapa = TBD / Validation Required).
- **Dampak ke state:** EscrowState → DIREFUND_PENUH / DIREFUND_SEBAGIAN sesuai skema; setiap potongan tercatat di ledger dengan alasan. Pembatalan oleh rental → refund penuh + penalti reputasi (aturan TBD). 

- **Notifikasi:** kedua pihak (push; WA untuk rental bila ada event uang). 
- **Pemulihan:** dana kembali ke penyewa via PG; penyewa dapat rebooking. 

## 13.10 Refund Failure (refund GAGAL di PG)
- **Penyebab:** rekening tujuan tidak valid, PG menolak, atau gangguan PG. 
- **Deteksi:** webhook `refund.failed` . 

- **Respons sistem:** refund state → GAGAL; dana **tetap tercatat ditahan** di ledger (tidak hilang, tidak dianggap selesai); kasus masuk antrean Admin. 

- **Dampak ke state:** EscrowState TIDAK berubah menjadi DIREFUND_* — tetap pada state sebelum refund (DITAHAN_ESCROW/LUNAS) hingga PG konfirmasi berhasil. **Tidak ada state "refund selesai" tanpa konfirmasi PG.** 

- **Notifikasi:** Admin (prioritas tinggi); penyewa (refund tertunda + estimasi tindak lanjut, tanpa janji waktu yang tidak pasti). 

- **Pemulihan:** retry terjadwal oleh Sistem (batas TBD) dengan idempotency key yang sama; bila tetap gagal → Admin intervensi manual (verifikasi rekening, koordinasi dengan PG). 

## 13.11 Payout Failure (payout ke rental GAGAL)
- **Penyebab:** rekening rental tidak valid, bank tujuan gangguan, PG menolak. 
- **Deteksi:** webhook `payout.failed` . 

- **Respons sistem:** payout state → GAGAL; dana tetap tercatat (DITAHAN_ESCROW/LUNAS) — **tidak ada dana yang dianggap "diteruskan" tanpa konfirmasi PG** ; kasus masuk antrean Admin; `POST /admin/payouts/{id}/retry` tersedia. 

- **Dampak ke state:** EscrowState tidak berubah hingga BERHASIL; ledger mencatat `payout_failed` (non-dana, informatif).
- **Notifikasi:** WA + push ke rental (payout tertunda + alasan + langkah: perbarui data rekening); Admin. 
- **Pemulihan:** rental memperbarui data rekening → Admin retry; retry otomatis terjadwal (batas TBD) sebelum eskalasi manual. 

## 13.12 Claim (klaim kerusakan dalam claim window)
- **Penyebab:** rental menemukan kerusakan pasca-pengembalian dalam 24 jam. 
- **Deteksi:** `POST /bookings/{id}/claims` dalam claim window. 

- **Respons sistem:** deposit_state → DIBEKUKAN_KLAIM; payout ditunda; klaim masuk antrean Tim Mediasi. 

- **Dampak ke state:** dana deposit tidak bergerak hingga putusan mediasi; ledger mencatat `deposit_frozen` + `claim_created` .
- **Notifikasi:** WA + push ke rental (konfirmasi penerimaan klaim); push + email ke penyewa (hak merespons + batas waktu TBD). 
- **Pemulihan:** mediasi → DIPOTONG_SEBAGIAN (dari deposit) atau DILEPAS_PENUH; putusan + bukti tercatat; audit. 

## 13.13 Dispute (sengketa)
- **Penyebab:** kategori: unit tak sesuai, kerusakan, keterlambatan, mogok, dugaan penggelapan, dokumen palsu, sengketa buntu.
- **Deteksi:** `POST /bookings/{id}/disputes` . 

- **Respons sistem:** dispute_state = DIBUKA → MEDIASI; dana terkait dibekukan; payout ditunda; paket bukti (foto handover/return, perjanjian, verifikasi) dikumpulkan otomatis untuk mediator. 

- **Dampak ke state:** EscrowState cabang DIBEKUKAN_KLAIM; tidak ada pergerakan dana hingga putusan. Dugaan 

- penggelapan/dokumen palsu → akun terduga diblokir (aturan TBD) dan data disiapkan untuk proses hukum (Legal Validation Required). 

- **Notifikasi:** kedua pihak + Tim Mediasi; setiap perkembangan mediasi dinotifikasikan. 

- **Pemulihan:** putusan mediasi (SELESAI_DISETUJUI / DIESKALASI_HUKUM / DITUTUP_TANPA_KESEPAKATAN) → aksi finansial dari dana ditahan + ledger event + notifikasi. 

## 13.14 Notification Failure (notifikasi gagal terkirim)
- **Penyebab:** provider down, nomor/token tidak valid, template ditolak, rate limit. 
- **Deteksi:** respons API gagal atau delivery receipt FAILED (11.20). 

- **Respons sistem:** fallback berlapis otomatis: WA → push + email → inbox in-app; status pengiriman tercatat per event. 
- **Dampak ke state:** tidak memengaruhi state bisnis/uang — notifikasi bersifat informatif; namun **event uang tanpa notifikasi terkirim** ditandai untuk perhatian (rental wajib tahu posisi dananya). 

- **Notifikasi:** (meta) — kegagalan kanal dilaporkan ke dashboard Admin/observabilitas. 
- **Pemulihan:** retry dengan backoff (batas TBD); pengguna dapat menarik ulang dari `GET /notifications` ; rental memperbarui nomor WA yang bermasalah. 

## 13.15 External Provider Failure (kegagalan umum provider)
- **Penyebab:** PG / e-KYC / notification / storage tidak merespons atau mengembalikan 5xx berkepanjangan. 

- **Deteksi:** timeout + circuit breaker; health check berkala. 

- **Respons sistem (mode degradasi):** (a) PG down → pembuatan payment order/payout/refund ditunda (503 yang jelas), state uang bertahan; (b) e-KYC down → antrean dialihkan ke review manual; (c) notifikasi down → inbox in-app; (d) storage down → penyelesaian handover/return yang butuh bukti ditunda dengan pesan jelas (sistem menolak complete tanpa bukti). 

- **Dampak ke state:** state bertahan pada nilai terakhir yang terkonfirmasi; tidak ada transisi spekulatif; setiap penundaan tercatat di audit. 

- **Notifikasi:** banner status di UI + notifikasi ke Admin; pengguna yang terdampak diberi tahu (tanpa detail teknis internal). 

- **Pemulihan:** pulih otomatis saat provider kembali (circuit breaker half-open → retry antrean tertunda); insiden dicatat untuk postmortem. 

**Invarian penutup Bagian 13:** setiap skenario di atas menjaga dua prinsip — (1) tidak ada refund/payout dari kantong platform, dan (2) setiap pergerakan atau penahanan dana selalu memiliki pasangan event ledger yang immutable. Jika suatu skenario baru ditemukan dan belum tercakup, ia wajib dipetakan ke kedua prinsip ini sebelum diimplementasikan. 

Sumber kebenaran tunggal: Proposal DriveO v3 (4 Okt 2026). Semua TBD ditandai, tidak ada angka/fitur yang dikarang. Baseline: responsive web application. ML/AI, native app, dan telematika hanya boleh muncul di Future Scope. 

# 14. Security Requirements
Requirement bernomor SEC-001 dst. Kaitkan ke regulasi: UU PDP 27/2022, UU ITE 11/2008 (perubahan 19/2016), PP 80/2019. 

## 14.1 RBAC (Role-Based Access Control)
### SEC-001 — Model RBAC baku
- **Actor:** Penyewa, Rental/Merchant, Admin, Tim Verifikasi, Customer Support, Tim Mediasi, Sistem. Description: Setiap pengguna sistem memiliki tepat satu role primer per sesi, dengan izin diturunkan dari role tersebut. Akses ke endpoint dan data dibatasi oleh Authorization Matrix (Bagian 12). Precondition: Pengguna sudah terautentikasi; role tercatat di tabel `User.role` . Trigger: Setiap request ke API. Main Flow: 

1. Request diterima dengan token otentikasi. 

2. Sistem memetakan token → pengguna → role aktif. 

3. Sistem memeriksa Authorization Matrix untuk kombinasi (role, resource, aksi). 

4. Jika izin ada → request diteruskan. Jika tidak → ditolak dengan 403 + event audit `unauthorized_access_attempt` . Alternative Flow: Multi-user dalam satu akun rental (fitur membership Pro, pricing TBD) — role rental tetap satu per pengguna individual, diikat ke akun rental induk. Exception: Token tidak valid/kedaluwarsa → 401, request tidak pernah mencapai pemeriksaan role. Postcondition: Tidak ada aksi yang dieksekusi tanpa izin role yang valid. Business Rules: BR (role access) — rujuk Authorization Matrix; pengecualian hanya via Admin dengan alasan tercatat di audit. Validation Status: `Defined` . 

### SEC-002 — Segregasi peran finansial vs operasional
- **Actor:** Admin, Tim Verifikasi, Customer Support, Tim Mediasi. Description: Role yang melakukan verifikasi pengguna/rental tidak boleh menyetujui payout; role yang mengelola refund tidak boleh mengubah komisi/potongan. Prinsip least privilege + separation of duties untuk semua operasi yang memindahkan atau mengembalikan dana. Precondition: Pengguna memiliki role internal. Trigger: Aksi finansial (refund, payout, potongan klaim). Main Flow: 

1. Pengguna mengajukan aksi finansial. 

2. Sistem memeriksa apakah role pengaju diizinkan untuk aksi tersebut dan bukan penyetuju yang sama dengan pembuat klaim yang mendasarinya (apabila klaim dibuat oleh internal). 

3. Aksi yang memerlukan dua tahap (misal refund besar di atas ambang TBD) wajib disetujui role berbeda. Exception: Pada fase concierge (20 booking pertama), peran internal dirangkap tim inti — setiap aksi tetap dicatat dengan identitas individu pelaku di audit log (SEC-010). Postcondition: Tidak ada dana berpindah tanpa otorisasi role yang tepat. Business Rules: Ambang nilai yang memicu approval dua tahap = TBD / Business Decision Required. Validation Status: `Defined` (mekanisme), `TBD` (ambang nilai). 

## 14.2 JWT / Session
### SEC-003 — Sesi dan token aman
- **Actor:** Sistem (issuer), semua pengguna terautentikasi. Description: Autentikasi memakai token JWT berumur pendek untuk API dan session cookie httpOnly+Secure+SameSite untuk web. Refresh token disimpan server-side (dapat dicabut). Precondition: Pengguna berhasil login. Trigger: Login berhasil; request API berikutnya. Main Flow: 

1. Server menerbitkan access token (umur pendek, mis. 15 menit — nilai implementasi teknis, bukan komitmen bisnis) dan refresh token server-side. 

2. Setiap request memvalidasi signature, issuer, expiry, dan daftar pencabutan. 

3. Refresh token hanya dapat dipakai sekali (rotasi); pemakaian ulang memicu pencabutan seluruh sesi pengguna (indikasi pencurian token). Exception: Token kedaluwarsa → 401 + instruksi refresh; refresh gagal → pengguna harus login ulang. Postcondition: Sesi yang dicurigai dapat dimatikan paksa dari sisi server kapan pun. Business Rules: Semua waktu kedaluwarsa token = [TECHNICAL DECISION REQUIRED]; kegagalan refresh mencurigakan memicu event audit `suspicious_token_reuse` . Validation Status: `Defined` . 

### SEC-004 — Pencabutan sesi dan paksa logout
- **Actor:** Admin, pengguna itu sendiri. Description: Sistem dapat mencabut sesi pengguna tertentu (misal setelah blokir akun karena dokumen palsu/dugaan penggelapan, atau permintaan pengguna). Sesi yang dicabut tidak lagi diterima walau token belum kedaluwarsa. Precondition: Pengguna memiliki sesi aktif. Trigger: Akun diblokir (FR-ADMIN), pengguna memilih "keluar dari semua perangkat", atau deteksi anomali. Main Flow: Admin/pengguna memicu pencabutan → server menandai seluruh sesi pengguna sebagai revoked → request berikutnya dengan token lama ditolak (401). Postcondition: Pengguna yang diblokir tidak dapat lagi mengakses sistem sampai status akun dipulihkan. Validation Status: `Defined` . 

## 14.3 Password Security
### SEC-005 — Penyimpanan dan kebijakan kredensial
- **Actor:** Penyewa, Rental/Merchant, pengguna internal. Description: Password tidak pernah disimpan plaintext. Disimpan sebagai hash dengan algoritma adaptif (mis. bcrypt/argon2id — pilihan [TECHNICAL DECISION REQUIRED]) dengan salt unik per pengguna. Precondition: Pengguna membuat/mengubah password. Trigger: Registrasi, ganti password, reset password. Main Flow: 

1. Password divalidasi terhadap kebijakan minimum (panjang minimum — nilai teknis [TECHNICAL DECISION REQUIRED]; ditolak jika termasuk daftar password umum/bocor). 

2. Password di-hash dengan salt unik dan disimpan. 

3. Login membandingkan hash, bukan plaintext; tidak ada perbedaan waktu respons yang membocorkan keberadaan akun (mitigasi user enumeration: pesan error generik). Exception: Reset password hanya via link sekali pakai bertanda waktu yang dikirim ke email/WhatsApp terdaftar; link kedaluwarsa setelah dipakai atau melewati batas waktu ([TECHNICAL DECISION REQUIRED]). Postcondition: Tidak ada komponen sistem (log, error, backup) yang memuat password plaintext. Business Rules: Rujuk UU PDP — perlindungan data kredensial sebagai bagian keamanan data pribadi. Validation Status: `Defined` . 

## 14.4 Sensitive Document Access (KTP/SIM)
### SEC-006 — Akses dokumen identitas berbasis peran dan keperluan
- **Actor:** Tim Verifikasi, Tim Mediasi, Sistem; Penyewa (pemilik data). Description: Citra KTP/SIM hanya dapat diakses oleh role yang membutuhkan untuk verifikasi atau mediasi, dengan setiap akses tercatat. Prinsip UU PDP: tujuan terbatas (verifikasi & sengketa), minimisasi data. Precondition: Dokumen identitas telah diunggah dan dienkripsi (SEC-007). Trigger: Review verifikasi, pembukaan sengketa/dugaan penggelapan. Main Flow: 

1. Tim Verifikasi membuka antrean review → sistem menampilkan dokumen hanya untuk kasus yang ditugaskan kepadanya. 

2. Setiap pembukaan dokumen mencatat event audit `sensitive_doc_accessed` (siapa, kapan, kasus apa). 

3. Tim Mediasi hanya mendapat akses bila ada dispute/claim aktif yang melibatkan penyewa tersebut. 

4. Penyewa dapat melihat dokumen miliknya sendiri; Rental/Merchant TIDAK melihat citra KTP/SIM mentah — hanya menerima hasil verifikasi (status + ringkasan) sebagai bahan konfirmasi. Alternative Flow: Untuk dugaan penggelapan, paket bukti (termasuk dokumen) diserahkan untuk proses hukum — memerlukan persetujuan Admin + pencatatan audit, dasar hukum [LEGAL VALIDATION REQUIRED]. Exception: Akses di luar tugas → ditolak (403) + audit. Postcondition: Tidak ada akses dokumen identitas tanpa jejak audit. Business Rules: Pertimbangkan vendor e-KYC sebagai pemroses data untuk meminimalkan penyimpanan citra oleh DriveO (proposal); retensi 90 hari = TBD / Validation Required; hapus atas permintaan sesuai UU PDP (SEC-013). Validation Status: `Defined` (mekanisme), `Legal Validation Required` (penyerahan paket bukti ke penegak hukum). 

## 14.5 Encrypted Storage & 14.6 Encryption in Transit
### SEC-007 — Enkripsi data at-rest
- **Actor:** Sistem. Description: Data sensitif (citra KTP/SIM, data identitas hasil OCR, nomor rekening payout rental, token PG) dienkripsi saat disimpan (AES-256 atau setara — [TECHNICAL DECISION REQUIRED]) dengan manajemen kunci terpisah dari data (KMS/HSM atau layanan setara — [TECHNICAL DECISION REQUIRED]). Precondition: Data sensitif diterima sistem. Trigger: Penyimpanan dokumen identitas, penyimpanan data payout, pencatatan token. Main Flow: Data sensitif → enkripsi sebelum tulis ke storage/database → kunci dikelola terpisah → dekripsi hanya di memori aplikasi saat dibutuhkan oleh proses berizin. Exception: 

Kegagalan dekripsi → proses gagal aman (fail closed), error dicatat tanpa memuat data plaintext. Postcondition: Kebocoran media penyimpanan tidak mengekspos data sensitif dalam bentuk terbaca. Validation Status: `Defined` . 

### SEC-008 — Enkripsi in-transit
- **Actor:** Semua pengguna, sistem ↔ layanan eksternal. Description: Seluruh komunikasi menggunakan TLS 1.2+ (HTTPS/WSS). Komunikasi ke Payment Gateway, vendor e-KYC, dan Notification Provider hanya melalui endpoint TLS dengan verifikasi sertifikat. Precondition: Request masuk atau keluar sistem. Trigger: Setiap koneksi jaringan. Main Flow: Redirect HTTP → HTTPS; HSTS diaktifkan; sertifikat TLS valid dan diperbarui otomatis. Exception: Koneksi tanpa TLS ditolak; sertifikat tidak valid → integrasi eksternal gagal aman, bukan fallback ke plaintext. Postcondition: Tidak ada data (termasuk dokumen dan token) melintasi jaringan dalam bentuk plaintext. Validation Status: `Defined` . 

## 14.7 Audit Log (ringkasan; detail di Bagian 15)
### SEC-009 — Audit log immutable untuk aksi sensitif
- **Actor:** Sistem (pencatat); semua aktor sebagai subjek. Description: Setiap aksi sensitif (autentikasi, perubahan role, akses dokumen, semua event keuangan, perubahan state booking/escrow, approve/reject verifikasi, keputusan mediasi) dicatat ke audit log yang append-only (tidak dapat diubah/dihapus oleh siapa pun, termasuk Admin). Precondition: Aksi sensitif terjadi. Trigger: Event yang terdaftar di Bagian 15. Main Flow: Aksi → tulis entri audit (timestamp, actor, aksi, entitas, sebelum → sesudah, referensi, IP/perangkat bila relevan) → entri tidak dapat dimutasi. Exception: Kegagalan tulis audit untuk aksi finansial → aksi finansial dibatalkan (fail closed). Postcondition: Jejak lengkap tersedia untuk investigasi sengketa, fraud, dan kepatuhan. Validation Status: `Defined` . 

### SEC-010 — Audit untuk peran yang dirangkap (fase concierge)
- **Actor:** Tim inti (merangkap Admin/Verifikasi/CS/Mediasi). Description: Selama fase concierge (20 booking pertama), setiap aksi internal mencatat identitas individu pelaku (bukan sekadar role) agar akuntabilitas tetap terjaga meski peran dirangkap. Postcondition: Setiap keputusan manual dapat ditelusur ke individu. Validation Status: `Defined` . 

## 14.8 Webhook Verification
### SEC-011 — Verifikasi signature webhook Payment Gateway
- **Actor:** Payment Gateway (pengirim), Sistem (penerima). Description: Setiap webhook dari PG WAJIB diverifikasi signature-nya (HMAC dengan secret yang dibagikan) sebelum diproses. Webhook tanpa signature valid ditolak (4xx) dan tidak mengubah state apa pun. Precondition: Secret webhook dikonfigurasi aman (bukan di kode/repo). Trigger: Webhook event diterima (payment success/failed/expired, payout status, refund status). Main Flow: 

1. Terima webhook → hitung HMAC payload dengan secret → bandingkan dengan signature header (perbandingan constant-time). 

2. Valid → lanjut ke penanganan idempoten (SEC-012). Tidak valid → tolak + catat `webhook_signature_invalid` . Exception: Secret bocor/terkompromi → rotasi secret; webhook selama masa transisi ditangani sesuai prosedur rotasi [TECHNICAL DECISION REQUIRED]. Postcondition: Tidak ada perubahan state keuangan yang dipicu oleh webhook palsu. Business Rules: Replay attack dimitigasi dengan pemeriksaan timestamp/nonce bila disediakan PG; event duplikat ditangani oleh SEC-012. Validation Status: `Defined` . 

## 14.9 Idempotency (Payment & Webhook)
### SEC-012 — Idempotency pembayaran dan webhook
- **Actor:** Penyewa (pembayar), Payment Gateway, Sistem. Description: Setiap percobaan pembayaran memiliki idempotency key unik (per booking + jenis pembayaran: DP/pelunasan/full). Webhook yang sama yang diterima berulang (retry PG, duplikat jaringan) tidak boleh memproses dana dua kali atau mengubah state secara ganda. Precondition: Payment record dibuat dengan status CREATED/MENUNGGU. Trigger: Inisiasi pembayaran; penerimaan webhook. Main Flow: 

1. Inisiasi: sistem membuat/menggunakan payment record dengan idempotency key; request ganda dengan key sama mengembalikan payment yang sudah ada, bukan membuat tagihan baru (mencegah double charge). 

2. Webhook: sistem memeriksa event ID PG; jika sudah diproses → balas 200 OK tanpa efek samping (acknowledge saja). 

3. Transisi state payment/escrow bersifat atomik: hanya satu transisi BERHASIL yang sah dari MENUNGGU. Exception: Webhook BERHASIL tiba setelah payment KEDALUWARSA → dicatat sebagai anomali `late_webhook_after_expiry` ; dana (jika ternyata tertagih) ditangani sebagai refund otomatis, bukan dianggap DP sah. Aturan detail = TBD / Business Decision Required. Postcondition: Satu pembayaran sah = tepat satu efek pada ledger dan state escrow. Business Rules: "Platform tidak pernah menalangi dari kantong sendiri — refund selalu dari dana yang ditahan." Validation Status: `Defined` (mekanisme), `TBD` (penanganan webhook terlambat). 

## 14.10 Rate Limiting
### SEC-013 — Rate limiting dan perlindungan abuse
- **Actor:** Semua klien API. Description: Rate limit diterapkan per endpoint sensitif: login/OTP, inisiasi pembayaran, upload dokumen, submit review, dan endpoint publik search. Pelanggaran berulang memicu blokir sementara IP/akun. Precondition: Request masuk. Trigger: Melewati ambang request per jendela waktu. Main Flow: Hitung request per kunci (IP + user + endpoint) → jika melebihi ambang → 429 + Retry-After → pelanggaran berulang → blokir sementara + event audit. Exception: Endpoint webhook PG dikecualikan dari limit agresif (PG melakukan retry sah) tetapi tetap diverifikasi signature (SEC-011). Postcondition: Serangan brute force, scraping listing massal, dan spam review terhambat. Business Rules: Nilai ambang = [TECHNICAL DECISION REQUIRED]. Validation Status: `Defined` . 

## 14.11 Fraud Prevention
### SEC-014 — Pencegahan dokumen palsu
- **Actor:** Sistem, Vendor e-KYC, Tim Verifikasi. Description: Upload KTP/SIM melewati pemeriksaan otomatis (validitas format, OCR, deteksi anomali dasar dari vendor e-KYC — PROVIDER TBD); kasus meragukan masuk antrean review manual (VerificationState BUTUH_REVIEW_MANUAL). Dokumen terbukti palsu → verifikasi DITOLAK, akun dapat diblokir, event audit dicatat. Precondition: Dokumen diunggah. Trigger: Hasil e-KYC otomatis atau review manual. Main Flow: Pemeriksaan otomatis → lolos → DISETUJUI; meragukan → review manual → putusan; palsu → DITOLAK + blokir + audit `fake_document_detected` . Postcondition: Pengguna dengan dokumen palsu tidak dapat mencapai status terverifikasi yang menjadi syarat konfirmasi booking. Validation Status: `Defined` (alur), `TBD` (ambang dan kriteria detail vendor — PROVIDER TBD). 

### SEC-015 — Anti fake review
- **Actor:** Sistem. Description: Review hanya dapat disubmit untuk booking dengan BookingState SELESAI, tepat satu review per arah (penyewa → rental, rental → penyewa) per booking. Upaya submit di luar kondisi ini ditolak. Precondition: Booking SELESAI. Trigger: Submit review. Main Flow: Validasi eligibilitas (booking selesai + belum pernah review arah tersebut) → terima; jika tidak → tolak + audit. Exception: Booking yang berakhir via sengketa — eligibilitas review = TBD / Business Decision Required. Postcondition: Tidak ada review tanpa transaksi terselesaikan. Validation Status: `Defined` (aturan dasar), `TBD` (kasus sengketa). 

### SEC-016 — Pencegahan double booking
- **Actor:** Sistem. Description: Slot unit dikunci atomik saat booking dibuat; dua booking tidak dapat mengunci rentang tanggal yang tumpang tindih pada unit yang sama. BATAS JUJUR (dari proposal): mekanisme ini mengurangi, bukan menghilangkan, double booking selama rental masih menerima order paralel via WhatsApp di luar platform — insentif pencatatan order non-platform di dashboard adalah mitigasi, bukan jaminan. Precondition: Booking dibuat untuk unit + rentang tanggal. Trigger: Pembuatan booking. Main Flow: Transaksi database mengunci baris ketersediaan → cek tumpang tindih → jika bentrok → tolak dengan pesan slot tidak tersedia. Postcondition: Tidak ada dua booking platform yang tumpang tindih pada unit yang sama. Validation Status: `Defined` (dengan batas yang dinyatakan jujur sesuai proposal). 

### SEC-017 — Deteksi anomali transaksi
- **Actor:** Sistem, Admin. Description: Sistem menandai pola mencurigakan untuk review: pembayaran gagal berulang dari akun yang sama, booking-batal berulang, perubahan rekening payout yang sering, dan klaim deposit berulang dari rental yang sama. Penandaan bersifat flag untuk review manusia, BUKAN penilaian otomatis bersanksi (tidak ada ML/AI scoring di MVP). Precondition: Event transaksi/audit tercatat. Trigger: Pola melewati ambang sederhana berbasis aturan. Main Flow: Aturan → flag → masuk antrean review Admin/CS → keputusan manusia. Postcondition: Anomali terdokumentasi sebelum menjadi kerugian. Business Rules: Ambang aturan = TBD / Business Decision Required; tidak ada automated punishment tanpa review manusia. Validation Status: `Defined` (mekanisme flag), `TBD` (ambang). 

## 14.12 File Validation
### SEC-018 — Validasi file foto dan dokumen
- **Actor:** Penyewa, Rental/Merchant (pengunggah); Sistem. Description: Setiap upload (foto KTP/SIM, foto handover/return, foto unit listing) divalidasi: tipe MIME yang diizinkan, ukuran maksimum, pemindaian konten berbahaya, dan strip metadata EXIF yang tidak diperlukan (kecuali yang dibutuhkan untuk bukti — kebijakan [TECHNICAL DECISION REQUIRED]). Precondition: File diunggah. Trigger: Upload dokumen/foto. Main Flow: Validasi tipe + ukuran → scan → simpan ke object storage terenkripsi (SEC-007) dengan nama file acak (bukan nama asli) → URL akses bertanda waktu & bertanda tangan (signed URL), bukan URL publik permanen. Exception: File tidak valid → tolak dengan pesan jelas, tanpa menyimpan. Postcondition: Tidak ada file berbahaya tersimpan; tidak ada akses publik langsung ke dokumen sensitif. Business Rules: Batas ukuran dan daftar tipe = [TECHNICAL DECISION REQUIRED]. Validation Status: `Defined` . 

## 14.13 Access Control (data-level)
### SEC-019 — Isolasi data antar tenant (rental) dan pengguna
- **Actor:** Rental/Merchant, Penyewa. Description: Rental hanya dapat melihat data miliknya (kendaraan, booking, riwayat dana, customer history miliknya). Penyewa hanya melihat booking dan datanya sendiri. Tidak ada akses lintas rental walau keduanya login. Precondition: Pengguna terautentikasi dengan role Rental atau Penyewa. Trigger: Setiap query data. Main Flow: Setiap query difilter otomatis berdasarkan kepemilikan (rental_id / user_id dari sesi) di lapisan aplikasi — bukan mengandalkan parameter dari klien. Exception: Upaya mengakses ID milik pihak lain (IDOR) → 403/404 + audit `unauthorized_access_attempt` . Postcondition: Kebocoran data lintas tenant tidak terjadi. Validation Status: `Defined` . 

## 14.14 Data Deletion & Consent (UU PDP 27/2022)
### SEC-020 — Consent eksplisit dan terpisah
- **Actor:** Penyewa (subjek data), Sistem. Description: Upload KTP/SIM meminta persetujuan (consent) eksplisit yang TERPISAH dari T&C umum: menyatakan tujuan terbatas (verifikasi identitas & penanganan sengketa), masa retensi, dan hak untuk menarik persetujuan. Consent tercatat (siapa, kapan, versi teks). Precondition: Pengguna akan mengunggah dokumen identitas. Trigger: Alur upload e-KYC. Main Flow: Tampilkan teks consent → pengguna menyetujui eksplisit (bukan pre-checked) → consent dicatat → upload dilanjutkan. Penarikan consent mengikuti SEC-021. Postcondition: Ada bukti consent yang dapat diaudit sesuai UU PDP. Business Rules: Teks consent final = [LEGAL VALIDATION REQUIRED]. Validation Status: `Defined` (mekanisme), `Legal Validation Required` (teks). 

### SEC-021 — Hak hapus dan tarik consent (UU PDP)
- **Actor:** Penyewa, Admin. Description: Pengguna dapat meminta penghapusan data pribadinya (termasuk citra dokumen identitas). Sistem menghapus data yang tidak wajib disimpan oleh hukum/kepentingan sengketa 

berjalan; data yang wajib dipertahankan (misal untuk sengketa aktif atau kewajiban hukum) diinformasikan alasannya dan dihapus setelah kewajiban berakhir. Precondition: Permintaan penghapusan dari pemilik data terverifikasi. Trigger: Permintaan hapus data / tarik consent. Main Flow: 

1. Verifikasi identitas pemohon. 

2. Cek halangan: sengketa/claim aktif, kewajiban retensi hukum → jika ada, tolak sebagian dengan alasan tertulis + jadwal hapus setelah halangan berakhir. 

3. Jika tidak ada halangan → hapus data pribadi + citra dokumen dari database dan storage → catat audit `data_deletion_executed` . Exception: Data agregat/anonymized untuk laporan boleh dipertahankan bila tidak lagi mengidentifikasi individu. Postcondition: Permintaan dipenuhi dalam batas waktu sesuai UU PDP (detail = [LEGAL VALIDATION REQUIRED]). Business Rules: Retensi 90 hari untuk data verifikasi = TBD / Validation Required (proposal). Validation Status: `Defined` (mekanisme), `Legal Validation Required` (batas waktu & pengecualian hukum). 

### SEC-022 — Kebijakan retensi dan penghapusan terjadwal
- **Actor:** Sistem (Background Scheduler). Description: Data dengan masa retensi yang telah ditetapkan (misal data verifikasi) dihapus otomatis oleh scheduler setelah masa retensi berakhir dan tidak ada sengketa/kewajiban hukum aktif. Setiap penghapusan dicatat di audit. Precondition: Masa retensi ditetapkan (nilainya TBD). Trigger: Scheduler harian. Main Flow: Pindai data melewati retensi → cek halangan → hapus + audit. Postcondition: Tidak ada data pribadi yang disimpan melebihi kebutuhan. Business Rules: Nilai retensi = TBD / Validation Required (usulan proposal 90 hari, belum final). Validation Status: `Validation Required` . 

## 14.15 Ringkasan kaitan regulasi
|**Regulasi**|**Requirement terkait**|
|---|---|
|UU PDP 27/2022|SEC-006, SEC-007, SEC-008, SEC-019, SEC-020, SEC-021, SEC-022|
|UU ITE (click-to-accept & audit trail perjanjian)|SEC-009 (audit trail persetujuan perjanjian), FR-VERIFICATION (perjanjian elektronik)|
|PP 80/2019 (PMSE)|SEC-001/SEC-019 (akuntabilitas), kanal keluhan (FR-DISPUTE/CS), verifikasi NIB mitra|



Catatan: pemetaan di atas adalah kebutuhan kepatuhan tingkat requirement; validasi hukum final atas T&C, Kebijakan Privasi, dan Perjanjian Merchant = [LEGAL VALIDATION REQUIRED] (OQ backlog Bagian 19). 

# 15. Audit & Observability

## 15.1 Event audit yang WAJIB dicatat

Setiap event di bawah ditulis ke audit log append-only (SEC-009). Data minimum per event: **siapa** (actor + user_id/role), **kapan** (timestamp presisi detik + zona waktu), **apa** (event name + entitas + ID), **sebelum → sesudah** (state lama → state baru), **referensi** (booking_id, payment_id, nomor referensi PG/bank bila ada), dan **konteks** (IP/perangkat/kanal untuk aksi manusia; webhook event ID untuk event PG).

| # | Event | Data audit minimum |
|---|---|---|
| 1 | `booking_created` | actor=penyewa (user_id), booking_id, rental_id, vehicle_id, rentang tanggal, nilai sewa, DP yang diminta, BookingState: — → MENUNGGU_DP |
| 2 | `dp_paid` | booking_id, payment_id, PG event ID, nominal DP, EscrowState: MENUNGGU_DANA → DITAHAN_ESCROW, BookingState: MENUNGGU_DP → MENUNGGU_KONFIRMASI_RENTAL, timestamp bayar, idempotency key |
| 3 | `verification_submitted` | actor=penyewa, verification_id, jenis dokumen, VerificationState: DRAFT → DISUBMIT, versi teks consent yang disetujui |
| 4 | `verification_approved` | actor=tim verifikasi (user_id individu), verification_id, VerificationState: … → DISETUJUI, catatan (bila ada) |
| 5 | `verification_rejected` | actor=tim verifikasi, verification_id, alasan penolakan, DISETUJUI/DITOLAK, flag dokumen palsu bila ada |
| 6 | `booking_confirmed` | actor=rental (user_id), booking_id, MENUNGGU_KONFIRMASI_RENTAL → TERKONFIRMASI, timestamp (untuk evaluasi SLA) |
| 7 | `booking_auto_cancelled` | actor=sistem (scheduler), booking_id, state lama → KEDALUWARSA/DIBATALKAN, alasan (link bayar kedaluwarsa / tanpa konfirmasi rental), refund yang dipicu (payment_id refund) |
| 8 | `final_payment_received` | booking_id, payment_id, nominal pelunasan, EscrowState → LUNAS (total 100%), HandoverState: TERKUNCI → TERBUKA |
| 9 | `handover_completed` | actor=rental + penyewa (konfirmasi kedua pihak), booking_id, HandoverState → SELESAI, checklist_id + jumlah foto |
| 10 | `return_completed` | actor=rental + penyewa, booking_id, ReturnState → SELESAI, keterlambatan (ya/tidak + durasi bila ya) |
| 11 | `deposit_released` | actor=sistem, booking_id, deposit_id, DepositState: CLAIM_WINDOW_24JAM → DILEPAS, nominal, referensi pengembalian |
| 12 | `claim_created` | actor=rental, claim_id, booking_id, deposit_id, DepositState → DIBEKUKAN_KLAIM, nominal klaim, bukti (foto) |
| 13 | `claim_resolved` | actor=tim mediasi, claim_id, hasil (DIPOTONG_SEBAGIAN/DILEPAS_PENUH), nominal akhir tiap pihak |
| 14 | `refund_created` | actor (pengguna/sistem/rental/CS), refund_id, booking_id, payment_id asal, nominal, alasan (batal pengguna / batal rental / auto-cancel), EscrowState → DIREFUND_SEBAGIAN/DIREFUND_PENUH. Prinsip: refund hanya dari dana yang ditahan |
| 15 | `payout_created` | actor=sistem (terjadwal), payout_id, booking_id, rental_id, nominal kotor, komisi, nominal bersih, rekening tujuan (tersamarkan), PayoutState: TERJADWAL → DIPROSES |
| 16 | `payout_completed` | payout_id, referensi bank PG, PayoutState → BERHASIL, EscrowState → DITERUSKAN, timestamp |
| 17 | `payout_failed` | payout_id, kode alasan PG, PayoutState → GAGAL, rencana retry berikutnya |
| 18 | `review_submitted` | actor=penulis, booking_id, arah (penyewa→rental / rental→penyewa), rating, eligibility check lolos |
| 19 | `dispute_opened` | actor=pembuka, dispute_id, booking_id, kategori (unit tak sesuai/kerusakan/keterlambatan/mogok/dugaan penggelapan), DisputeState: — → DIBUKA |
| 20 | `dispute_resolved` | actor=tim mediasi, dispute_id, hasil (SELESAI_DISETUJUI / DIESKALASI_HUKUM / DITUTUP_TANPA_KESEPAKATAN), ringkasan putusan |
| 21 | `unauthorized_access_attempt` | actor (user_id/IP), resource + aksi yang ditolak, role aktif |
| 22 | `sensitive_doc_accessed` | actor internal (user_id individu), dokumen milik siapa, kasus (verification_id/dispute_id) |
| 23 | `webhook_received` | PG event ID, tipe event, hasil verifikasi signature (valid/invalid), hasil idempotency (processed/duplicate) |
| 24 | `data_deletion_executed` | actor pemohon + pelaksana, kategori data yang dihapus, dasar (permintaan UU PDP / retensi berakhir) |

> **Catatan:** event 7, 11, 15 adalah event tambahan yang diperlukan agar alur uang dapat diaudit penuh; event 21–24 adalah kebutuhan keamanan dari Bagian 14.

## 15.2 Observabilitas operasional
**Log terstruktur.** Semua log aplikasi memakai format terstruktur (JSON) dengan field baku: `timestamp` , `level` , `service` , `trace_id` / `request_id` , `actor` , `booking_id` / `payment_id` (bila relevan), `event` , `message` . Log tidak boleh memuat data sensitif (password, citra dokumen, nomor rekening penuh, token) — mengacu SEC-005/SEC-007. 

**Metrik kunci (tanpa target angka bisnis — target = TBD / Business Decision Required).** Metrik yang WAJIB tersedia di dashboard operasional: 

1. **Keuangan:** jumlah & nilai payout per status (TERJADWAL/DIPROSES/BERHASIL/GAGAL); umur payout tertunda (waktu sejak TERJADWAL); jumlah & nilai refund per alasan; jumlah & nilai dana DITAHAN_ESCROW saat ini (posisi escrow agregat); jumlah & nilai deposit dalam CLAIM_WINDOW_24JAM vs DIBEKUKAN_KLAIM. 

2. **Sengketa & kepercayaan:** jumlah dispute per kategori dan status; waktu resolusi dispute (dibuka → selesai); jumlah klaim deposit; jumlah verifikasi DITOLAK (termasuk flag dokumen palsu). 

3. **Keandalan integrasi:** tingkat kegagalan webhook (signature invalid, late/duplicate), tingkat kegagalan pembayaran (GAGAL/KEDALUWARSA), retry payout yang gagal. 

4. **Operasional booking:** booking per BookingState; booking batal otomatis (per alasan); keterlambatan konfirmasi rental (distribusi waktu konfirmasi vs SLA TBD). 

**Alerting.** Peringatan (kepada tim operasional, kanal [TECHNICAL DECISION REQUIRED]) dipicu oleh kondisi seperti: payout GAGAL, webhook signature invalid berulang, lonjakan booking_auto_cancelled, antrean verifikasi BUTUH_REVIEW_MANUAL menumpuk. Ambang alert = [TECHNICAL DECISION REQUIRED]. 

**Tracing.** Setiap request yang menyentuh alur uang (booking → payment → payout) membawa `trace_id` yang sama dari ujung ke ujung agar satu transaksi dapat ditelusur melintasi log, audit, dan webhook PG. 

**Kesehatan data.** Monitor inkonsistensi: BookingState vs EscrowState yang tidak selaras (misal booking SELESAI tetapi escrow masih DITAHAN_ESCROW di luar jadwal payout), payment BERHASIL tanpa event ledger, dan payout tanpa referensi bank. 

# 16. Testing Requirements

Format: Requirement → Test Scenario → Expected Result. Setiap skenario menelusur ke ID FR/BR (penamaan konsisten brief: FR-BOOKING-001 dst., BR-001 dst.).

## 16.1 Unit Test

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| FR-PAYMENT-001 / BR (DP) | Hitung nominal DP dari persentase konfigurasi terhadap total sewa | Nominal = total × persen; pembulatan ke rupiah penuh; persen di luar rentang konfigurasi ditolak |
| FR-PAYMENT-001 / BR (refund bertingkat) | Hitung refund pembatalan pengguna untuk tiap tier H- (tier = TBD, diuji dengan matriks parameter) | Refund sesuai tier; tier TBD diuji sebagai parameter, bukan nilai hardcoded |
| FR-BOOKING-001 | Deteksi tumpang tindih rentang tanggal pada unit yang sama | Tumpang tindih satu hari pun → slot dinyatakan bentrok |
| FR-DEPOSIT-001 | Hitung batas akhir claim window 24 jam dari `return_completed` | Batas = return_completed + 24 jam tepat; klaim setelah batas ditolak |
| FR-PAYOUT-001 | Hitung nominal bersih payout = nilai sewa − komisi | Nominal bersih = kotor − komisi; contoh format transparansi "Rp270.000 dari Rp300.000" hanya ilustrasi, bukan tarif |
| FR-REVIEW-001 | Validasi eligibilitas review (satu per arah per booking selesai) | Submit kedua untuk arah yang sama ditolak |
| SEC-012 | Idempotency key: dua request pembayaran dengan key sama | Hanya satu payment record; request kedua mengembalikan record yang ada |
| SEC-011 | Verifikasi HMAC webhook dengan secret benar vs salah | Signature benar → lolos; salah → ditolak |

## 16.2 Integration Test

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| FR-PAYMENT-001 + PG | Inisiasi DP → callback sukses PG (sandbox) → state payment & escrow | Payment BERHASIL; EscrowState MENUNGGU_DANA → DITAHAN_ESCROW; ledger tercatat |
| FR-PAYMENT-001 + PG | Callback gagal/kedaluwarsa dari PG | Payment GAGAL/KEDALUWARSA; booking → KEDALUWARSA bila DP; slot terbuka kembali |
| FR-VERIFICATION-001 + e-KYC | Upload KTP valid → hasil OCR otomatis | VerificationState DISUBMIT → DIPROSES_OTOMATIS → DISETUJUI; data terenkripsi |
| FR-VERIFICATION-001 + e-KYC | Dokumen meragukan dari vendor | → BUTUH_REVIEW_MANUAL; masuk antrean tim verifikasi |
| FR-PAYOUT-001 + PG | Payout TERJADWAL → DIPROSES → BERHASIL | EscrowState → DITERUSKAN; referensi bank tercatat; notifikasi ke rental |
| FR-PAYOUT-001 + PG | Payout GAGAL (rekening salah) | PayoutState GAGAL; retry terjadwal; rental menerima notifikasi alasan |
| FR-NOTIFICATION-001 | Setiap event uang memicu notifikasi | Push + WhatsApp terkirim (atau tercatat gagal dengan retry) untuk `dp_paid`, `final_payment_received`, `payout_completed`, `refund_created` |
| FR-ADMIN-001 | Scheduler auto-cancel booking tanpa konfirmasi rental melewati SLA TBD | Booking → DIBATALKAN; DP → refund penuh otomatis dari dana ditahan |

## 16.3 API Test

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| FR-BOOKING-001 | POST `/bookings` dengan payload valid (unit + tanggal + persetujuan perjanjian) | 201; BookingState MENUNGGU_DP; slot terkunci; link bayar DP diterbitkan |
| FR-BOOKING-001 | POST `/bookings` tanpa persetujuan perjanjian elektronik | 422; booking tidak dibuat (perjanjian wajib disetujui SEBELUM pembayaran) |
| FR-BOOKING-001 | POST `/bookings` untuk slot yang sudah terkunci | 409; pesan slot tidak tersedia |
| FR-LISTING-001 | GET `/listings` tanpa autentikasi | 200; data publik (harga all-in + penanda kebaruan data tampil) |
| FR-PAYMENT-001 | POST `/payments/{id}/initiate` ganda (idempotent) | Satu payment record; tidak ada tagihan ganda |
| FR-HANDOVER-001 | POST `/handover/checklist` sebelum pelunasan LUNAS | 423/403 terkunci; checklist tidak dapat diisi (sistem mencegah, bukan sekadar mengecek) |
| FR-DISPUTE-001 | POST `/disputes` tanpa `booking_id` valid | 422; dispute tidak dibuat |
| FR-ADMIN-001 | GET `/admin/*` oleh role Penyewa | 403 + audit `unauthorized_access_attempt` |

## 16.4 Authorization Test

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| SEC-001 / Matrix | Penyewa mengakses `/rentals/{id}/payouts` milik rental lain | 403/404; tidak ada kebocoran data |
| SEC-001 / Matrix | Rental mengakses citra KTP mentah penyewa | 403; rental hanya menerima ringkasan hasil verifikasi |
| SEC-001 / Matrix | Customer Support mencoba approve payout | 403; segregasi peran finansial ditegakkan |
| SEC-001 / Matrix | Tim Verifikasi mencoba memutus sengketa | 403; hanya Tim Mediasi yang berwenang |
| SEC-002 | Refund di atas ambang TBD diajukan dan disetujui orang yang sama | Ditolak; wajib approver berbeda |
| SEC-019 | IDOR: ubah `booking_id` di URL ke milik pengguna lain | 403/404 + audit |

## 16.5 Payment Test (fokus finansial)

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| FR-PAYMENT-001 / BR (DP) | Bayar DP tepat waktu via PG sandbox | `dp_paid`; escrow DITAHAN_ESCROW; booking → MENUNGGU_KONFIRMASI_RENTAL |
| FR-PAYMENT-001 / BR (link kedaluwarsa) | Link DP tidak dibayar hingga X menit (TBD, diuji parameter) | Payment KEDALUWARSA; booking KEDALUWARSA otomatis; slot terbuka |
| FR-PAYMENT-002 / BR (pelunasan) | Bayar pelunasan saat handover | EscrowState → LUNAS (100%); HandoverState TERKUNCI → TERBUKA |
| FR-PAYMENT-002 | Pelunasan kurang dari sisa tagihan | 422; tidak dicatat sebagai LUNAS; checklist tetap terkunci |
| FR-PAYMENT-001 / BR (opt-in full) | Pengguna memilih "Bayar Penuh di Awal" | Satu payment 100% saat booking; flag prioritas konfirmasi tercatat |
| FR-PAYOUT-001 / BR (H+1) | Return terkonfirmasi tanpa sengketa → payout terjadwal | Payout TERJADWAL untuk H+1; nominal = sewa − komisi |
| FR-PAYOUT-001 | Payout dieksekusi H+1 | BERHASIL; escrow DITERUSKAN; "Riwayat Dana" & "Dana Saya" ter-update |
| FR-PAYMENT-003 / BR (refund) | Batal oleh rental setelah DP | Refund penuh otomatis dari dana ditahan; penalti reputasi tercatat |
| FR-PAYMENT-003 / BR (refund) | Batal oleh pengguna (tier H- TBD) | Refund sesuai tier; TIDAK pernah dari kantong operasional |
| FR-DEPOSIT-001 / FR-PAYMENT-003 | Klaim deposit disetujui mediasi (potong sebagian) | Deposit DIPOTONG_SEBAGIAN; sisa dilepas ke penyewa; ledger seimbang |
| FR-DEPOSIT-001 | Tidak ada klaim dalam 24 jam | Deposit DILEPAS otomatis penuh ke penyewa |
| SEC-012 | Webhook sukses diterima 3x (retry PG) | Tepat satu transisi BERHASIL; dua lainnya diakui tanpa efek (duplicate) |
| SEC-011 | Webhook dengan signature salah | Ditolak; tidak ada perubahan state/ledger |

## 16.6 Webhook Test

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| SEC-011 | Webhook tanpa header signature | 4xx; event webhook_received tercatat sebagai invalid |
| SEC-011 | Webhook dengan replay (event ID lama dikirim ulang) | 200 OK; tidak ada efek ganda (idempoten) |
| SEC-012 | Webhook BERHASIL tiba setelah payment KEDALUWARSA | Anomali `late_webhook_after_expiry` tercatat; dana ditangani sebagai refund (aturan detail TBD) |
| FR-PAYOUT-001 | Webhook status payout BERHASIL dari PG | PayoutState → BERHASIL; escrow → DITERUSKAN |
| FR-PAYOUT-001 | Webhook status payout GAGAL dari PG | PayoutState → GAGAL; retry terjadwal; notifikasi ke rental |
| — | Webhook tiba saat sistem maintenance/degraded | PG retry; tidak ada event yang hilang setelah pulih (tidak ada state setengah) |

## 16.7 State Transition Test (fokus state machine)

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| FR-BOOKING-001 | Booking: MENUNGGU_DP → bayar → konfirmasi → handover → sewa → selesai | Rantai MENUNGGU_DP → MENUNGGU_KONFIRMASI_RENTAL → TERKONFIRMASI → MENUNGGU_PELUNASAN → DALAM_SEWA → SELESAI valid |
| FR-BOOKING-001 | Transisi terlarang: MENUNGGU_DP → DALAM_SEWA (lompat) | Ditolak; hanya transisi Allowed yang dieksekusi |
| FR-PAYMENT-001 | Escrow: MENUNGGU_DANA → DITAHAN_ESCROW → LUNAS → DITERUSKAN | Setiap transisi dipicu event yang benar (`dp_paid`, `final_payment_received`, `payout_completed`) |
| FR-PAYMENT-001 | Escrow: upaya DITERUSKAN sebelum LUNAS | Ditolak (forbidden transition) |
| FR-BOOKING-001 | Booking SELESAI tetapi escrow masih DITAHAN_ESCROW melewati jadwal payout | Monitor inkonsistensi (15.2) menandai; tidak dibiarkan diam |
| FR-VERIFICATION-001 | Verifikasi: DITOLAK → resubmit | Diizinkan kembali ke DISUBMIT; riwayat penolakan tersimpan |
| FR-HANDOVER-001 | Handover: upaya DIFOTO sebelum CHECKLIST_DIISI | Ditolak; urutan TERKUNCI → TERBUKA → CHECKLIST_DIISI → DIFOTO → DIKONFIRMASI_KEDUA_PIHAK → SELESAI |
| FR-DISPUTE-001 | Dispute: DIBUKA → MEDIASI → SELESAI_DISETUJUI | Hasil mediasi mengeksekusi efek keuangan yang sesuai (potong/lepas deposit, refund) |
| FR-DEPOSIT-001 | Deposit: DIBEKUKAN_KLAIM → mediasi selesai | Hanya → DIPOTONG_SEBAGIAN atau DILEPAS_PENUH; tidak bisa kembali ke CLAIM_WINDOW_24JAM |

## 16.8 Security Test

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| SEC-005 | Login dengan password salah berulang (brute force) | Rate limit + blokir sementara; pesan error generik (tanpa user enumeration) |
| SEC-003 | Akses API dengan token kedaluwarsa / hasil curian setelah pencabutan | 401; sesi revoked tidak diterima |
| SEC-007 | Baca langsung database/storage tanpa kunci enkripsi | Data sensitif tidak terbaca (ciphertext) |
| SEC-008 | Request HTTP (non-TLS) ke endpoint sensitif | Redirect/ditolak; tidak ada plaintext |
| SEC-018 | Upload file .php/.exe menyamar sebagai gambar; file melebihi batas | Ditolak; tidak tersimpan |
| SEC-018 | Akses URL file dokumen tanpa signed URL | Ditolak; tidak ada URL publik permanen |
| SEC-013 | Banjir request ke `/auth/login` dan `/payments/initiate` | 429 + Retry-After; layanan tetap responsif |
| SEC-014 | Upload KTP hasil edit/palsu | Terdeteksi vendor atau BUTUH_REVIEW_MANUAL; tidak mencapai DISETUJUI |
| SEC-009 | Upaya mengubah/menghapus entri audit oleh Admin | Ditolak; audit log append-only |
| SEC-021 | Permintaan hapus data dengan sengketa aktif | Dihapus sebagian; data terkait sengketa dipertahankan dengan alasan tertulis |

## 16.9 End-to-End Test (skenario bisnis penuh)

| Requirement | Test Scenario | Expected Result |
|---|---|---|
| FR-BOOKING → FR-REVIEW (alur bahagia) | Discovery → booking → DP → verifikasi → konfirmasi rental → handover (pelunasan → checklist → foto) → sewa → return → payout H+1 → review dua arah | Semua state tercapai berurutan; ledger seimbang (DP+pelunasan = payout+komisi+deposit dilepas); review tercatat |
| FR-BOOKING-001 / BR (batal) | Booking tanpa konfirmasi rental melewati SLA TBD | Batal otomatis; DP refund penuh; slot terbuka; notifikasi ke penyewa |
| FR-DISPUTE-001 | Unit tak sesuai → lapor ≤ X jam (TBD) → ganti unit/refund | Dispute DIBUKA → MEDIASI → SELESAI_DISETUJUI; refund/ganti unit tereksekusi |
| FR-DISPUTE-001 | Kerusakan ditemukan saat return → klaim deposit → mediasi | Deposit DIBEKUKAN_KLAIM → DIPOTONG_SEBAGIAN; bukti foto handover vs return menjadi dasar |
| FR-DISPUTE-001 | Dugaan penggelapan | Akun diblokir; paket bukti tersedia untuk proses hukum; sesi dicabut |
| FR-BOOKING-001 / BR (perpanjangan) | Perpanjangan sewa via platform saat DALAM_SEWA | Booking diperbarui; pembayaran tambahan via platform; tidak ada transaksi off-platform |
| FR-RENTAL-001 / BR (non-platform) | Rental mencatat order non-platform (cash) di dashboard | Masuk GMV; komisi ditagih via saldo; riwayat pelanggan terpusat |
| FR-BOOKING-001 / BR (fallback cash tercatat) | Pelunasan cash tercatat di sistem (fallback anti-disintermediasi) | Tercatat di ledger sebagai cash tercatat; bukan dana escrow; komisi tetap terhitung |

> **Prinsip pengujian finansial:** Setiap skenario uang WAJIB menegaskan: (1) tidak ada dana mengendap di operasional DriveO; (2) refund/payout hanya dari dana yang ditahan; (3) ledger selalu seimbang (debit = kredit per booking); (4) tidak ada double charge/double payout dalam kondisi retry/duplikat.

# 17. MVP vs Future Development
## 17.1 MVP (wajib ada di rilis awal)
Berdasar scope proposal Bab G dan alur transaksi kanonis. Platform: **responsive web application** . 

1. **Marketplace:** discovery, search, filter (lokasi, tanggal, jenis, harga), comparison (profil rental + detail unit + harga all-in + penanda "diperbarui X lalu"). 

2. **Booking penuh:** pilih unit + tanggal → kunci slot → booking + DP via platform (escrow PG berizin). 

3. **Skema bayar:** DP saat booking + pelunasan on-platform saat serah terima; opsi opt-in "Bayar Penuh di Awal" (dengan perk prioritas konfirmasi); fallback cash yang TERCATAT (masuk GMV, komisi via saldo). 

4. **Verifikasi identitas (e-KYC):** upload KTP + SIM, OCR + validitas format otomatis, review manual kasus meragukan, hasil diteruskan ke rental sebagai bahan konfirmasi. 

5. **Verifikasi rental/mitra:** identitas PJ, NIB/izin usaha (via OSS), dokumen kendaraan. 

6. **Perjanjian sewa elektronik:** disetujui digital (click-to-accept) SEBELUM pembayaran + audit trail siapa/kapan/versi. [LEGAL VALIDATION REQUIRED untuk kekuatan hukum final.] 

7. **Konfirmasi rental:** dalam SLA TBD; tanpa konfirmasi → batal otomatis + DP kembali penuh. 

8. **Handover:** link/QRIS pelunasan otomatis; checklist TERKUNCI sampai LUNAS (sistem mencegah); checklist + foto kondisi oleh kedua pihak. 

9. **Return:** checklist + foto yang sama; konfirmasi pengembalian; denda keterlambatan per jam sesuai perjanjian. 

10. **Deposit:** ditahan dengan claim window 24 jam; klaim → bekukan sampai mediasi selesai; lepas otomatis bila tanpa klaim. 

11. **Settlement/payout:** H+1 setelah pengembalian terkonfirmasi; dana sewa minus komisi; transparansi penuh ("Riwayat Dana" immutable per booking, "Dana Saya", notifikasi push + WhatsApp tiap event uang). 

12. **Review dua arah:** hanya dari transaksi terselesaikan (anti fake review). 

13. **Cancellation:** tiga jalur — pengguna (refund bertingkat, tier TBD), rental (refund penuh + penalti reputasi + bantuan realokasi), otomatis (kedaluwarsa/tanpa konfirmasi). 

14. **Dispute & mediasi:** kategori unit tak sesuai, kerusakan, keterlambatan, mogok, dugaan penggelapan, dokumen palsu; mediasi berdasar dokumentasi; eskalasi hukum bila buntu. [LEGAL VALIDATION REQUIRED untuk mekanisme final.] 

15. **Dashboard Operasional rental:** katalog kendaraan, kalender/ketersediaan, booking management (termasuk pencatatan order nonplatform), customer history, riwayat dana, laporan/rekap. 

16.
- **Notifikasi:** push + WhatsApp (+ email bila dibutuhkan) untuk setiap event penting, terutama event uang. 

17. **Perpanjangan sewa** via platform. 

18. **Fase concierge:** 20 booking pertama dilayani manual sebelum otomasi penuh (fase operasional, bukan requirement permanen). 

Wilayah & layanan MVP: **sewa lepas kunci motor & mobil, DIY saja.** 

## 17.2 Future Development (TIDAK di MVP; hanya sebagai arah)
1. Paid listing (listing berbayar untuk rental). 

2. Layanan sewa dengan sopir. 

3. Sewa korporat. 

4. Kemitraan asuransi (asuransi sebagai produk — di pilot bukan produk). 

5. Ekspansi kota di luar DIY. 

6. Tanda Tangan Elektronik (TTE) tersertifikasi (fase growth; MVP cukup click-to-accept + audit trail). 

7. Fitur membership bertier lanjutan bila divalidasi (Basic/Pro/Max — harga TBD). 

## 17.3 Out of Scope (tidak dibangun)
1. **Native mobile app** (Android/iOS) — baseline tetap responsive web app. 

2. **ML/AI** — termasuk scoring fraud otomatis, rekomendasi berbasis ML, chatbot AI. MVP hanya memakai aturan berbasis rule sederhana (flag untuk review manusia, SEC-017). 

3. **Telematika kendaraan** — GPS tracker, OBD, immobilizer, dan sejenisnya. 

4. **Hal yang dikecualikan di fase pilot** (bagian 17.1 butir wilayah): layanan dengan sopir, sewa korporat, kota di luar DIY, asuransi sebagai produk, paid listing — ini "keluar" di pilot dan "future" setelahnya; tidak ada di MVP. 

**Aturan anti-penyusupan:** tidak satu pun item 17.2/17.3 boleh muncul sebagai requirement fungsional MVP di Bagian 4/5. Jika sebuah FR tampak membutuhkan salah satunya, FR tersebut salah tempat dan harus dipindah ke Future. 

# 18. Requirement Traceability Matrix

Kolom: Proposal Section → Business Problem → Feature → Functional Requirement → Business Rule → API/Module → Test Case.

ID FR memakai penamaan Bagian 4 (FR-BOOKING-001 dst.). ID BR memakai penomoran kanonis Bagian 6 (BR-001 s.d. BR-044).

| # | Proposal Section | Business Problem | Feature | Functional Requirement | Business Rule | API/Module | Test Case |
|---|---|---|---|---|---|---|---|
| 1 | Bab III.4 P1 | Sulit membandingkan rental | Discovery + filter + penanda kebaruan data | FR-SEARCH-001 | BR-025 (penanda "diperbarui X lalu" wajib tampil) | GET /listings, GET /search | 16.3: GET publik tampilkan harga all-in + penanda kebaruan data |
| 2 | Bab III.4 P1 | Harga tidak transparan | Harga all-in (tarif + deposit + antar-jemput) | FR-LISTING-002 | BR-026 (harga all-in wajib ditampilkan) | GET /listings/{id} | 16.3: Detail listing memuat harga all-in |
| 3 | Bab III.4 P1 | Profil rental tak jelas | Comparison: status verifikasi, rating, booking selesai | FR-SEARCH-001, FR-SEARCH-004; Modul 5.8 | BR-036 (hanya data terverifikasi yg tampil sbg badge) | GET /rentals/{id}/profile | 16.1: Badge untuk rental terverifikasi |
| 4 | Bab III.4 P2 | Ketersediaan tidak akurat | Kalender per unit + kunci slot atomik | FR-VEHICLE-001, FR-BOOKING-001 | BR-028 (satu slot = satu booking aktif) | POST /bookings | 16.3: Slot terkunci 409; 16.7: Deteksi double booking |
| 5 | Bab III.4 P2 | Listing basi | Listing basi turun peringkat + berlabel | FR-LISTING-004 | BR-027 (definisi & ambang "basi" TBD) | Modul Listing / scheduler | 16.2: Listing basi berlabel + turun peringkat melewati ambang TBD |
| 6 | Bab III.4 P2 | Order WA paralel | Pencatatan order non-platform di dashboard | Modul 5.3 (pencatatan order non-platform) | BR-035 (order non-platform masuk GMV; komisi via saldo) | POST /rentals/{id}/offline-orders | 16.9: Order non-platform masuk GMV; komisi ditagih via saldo |
| 7 | Bab III.4 P3 | Operasional manual | Dashboard Operasional + rekap harian | Modul 5.3 (Dashboard Operasional) | BR-029 (rekap harian mencakup semua kanal) | GET /rentals/{id}/dashboard | 16.9: Rekap order platform + non-platform tercatat di dashboard |
| 8 | Bab III.4 P4 (1) | Risiko orang asing | e-KYC: KTP+SIM, OCR, review manual | FR-VERIFICATION-001 | BR-014 (lepas kunci wajib KTP+SIM terverifikasi); BR-016 (retensi 90 hari TBD) | POST /verifications, /verifications/{id}/review | 16.2: OCR lolos/meragukan; 16.8: Dokumen palsu ditolak |
| 9 | Bab III.4 P4 (1) | Risiko mitra abal-abal | Verifikasi rental: PJ, NIB via OSS, dokumen kendaraan | FR-RENTAL-002 | BR-036 (rental tampil publik hanya jika terverifikasi) | POST /rentals/verification | 16.2: Rental terverifikasi dapat publish listing |
| 10 | Bab III.4 P4 (2) | Perjanjian tak jelas | Perjanjian sewa elektronik, click-to-accept sebelum bayar | FR-VERIFICATION-007; Modul 5.17 | BR-017 (tanpa persetujuan perjanjian → booking tidak dibuat); [LEGAL VALIDATION REQUIRED] | POST /bookings (wajib agreement_consent) | 16.3: Tanpa persetujuan perjanjian → 422 |
| 11 | Bab III.4 P4 (3) | Sengketa kondisi unit | Dokumentasi handover: checklist + foto kedua pihak | FR-HANDOVER-001 | BR-007 (checklist terkunci sampai LUNAS — sistem mencegah) | POST /handover/checklist, /handover/photos | 16.3: Checklist sebelum pelunasan terkunci (423/403); urutan state |
| 12 | Alur inti | Pembayaran tidak aman | DP via platform + escrow PG berizin | FR-PAYMENT-001 | BR-001 (besaran DP % TBD); BR-005 (link kedaluwarsa X menit TBD); BR-004 (dana tidak mengendap di operasional) | POST /payments, webhook /webhooks/pg | 16.5: DP sukses/kedaluwarsa; 16.6: Webhook idempotent |
| 13 | Alur inti | Rental tidak merespons | Konfirmasi rental + auto-cancel | FR-BOOKING-008; Modul 5.10 | BR-006 (SLA konfirmasi 2 jam TBD; tanpa konfirmasi → batal + DP kembali penuh) | POST /bookings/{id}/confirm; scheduler | 16.2: Auto-cancel SLA; refund penuh otomatis dari dana ditahan |
| 14 | Alur inti | Pelunasan off-platform | Pelunasan on-platform saat handover (link/QRIS otomatis) | FR-PAYMENT-003 | BR-002 (pelunasan via platform; checklist terkunci sampai LUNAS) | POST /payments (final), GET /handover/paylink | 16.5: Kurang bayar → tidak LUNAS; 16.7: Handover terkunci sampai LUNAS |
| 15 | Alur inti | Perpanjangan tak tercatat | Perpanjangan via platform | FR-BOOKING-007 | BR-034 (perpanjangan hanya via platform, tercatat di ledger) | POST /bookings/{id}/extend | 16.9: Extend sewa + bayar via platform; slot terkunci |
| 16 | Alur inti | Kerusakan pasca-return | Deposit + claim window 24 jam | FR-DEPOSIT-002, FR-DEPOSIT-003 | BR-009 (claim window 24 jam; klaim → bekukan sampai mediasi selesai) | POST /deposits/{id}/claims | 16.5: Lepas deposit 24 jam tanpa klaim |
| 17 | Bab C (settlement) | Dana tidak transparan | Payout H+1 + "Riwayat Dana" + "Dana Saya" | FR-PAYOUT-001 | BR-008 (payout H+1 pasca-return terkonfirmasi); BR-030 (komisi % TBD; trigger = return terkonfirmasi tanpa sengketa; tanpa potongan misterius) | POST /payouts (scheduler), GET /rentals/{id}/funds | 16.5: Payout H+1; 16.2: Payout gagal → retry |
| 18 | Bab III.4 P4 (4) | Kepercayaan dua arah | Review dua arah anti fake | FR-REVIEW-001 | BR-013 (hanya dari transaksi terselesaikan; satu per arah) | POST /bookings/{id}/reviews | 16.1: Duplikat review ditolak; 16.3: Review dibuka hanya transaksi selesai |
| 19 | Bab E.15a | Pengguna batal | Cancellation pengguna + refund bertingkat | FR-BOOKING-004 | BR-011 (tier refund H-berapa TBD) | POST /bookings/{id}/cancel | 16.5: Refund pembatalan pengguna sesuai tier H- (parameter) |
| 20 | Bab E.15b | Rental batal | Cancellation rental + refund penuh + penalti reputasi | FR-BOOKING-005 | BR-012 (batal rental → refund penuh + penalti reputasi + bantuan realokasi) | POST /bookings/{id}/cancel (oleh rental) | 16.5: Refund penuh otomatis + penalti reputasi pembatalan rental |
| 21 | Bab E.16 | Sengketa operasional | Dispute & mediasi per kategori | FR-DISPUTE-001 | BR-021 (lapor unit tak sesuai ≤ X jam TBD); BR-022 (mogok → ganti/refund proporsional TBD); BR-023 (dugaan penggelapan → blokir + paket bukti; [LEGAL VALIDATION REQUIRED]) | POST /disputes, /disputes/{id}/mediate | 16.9: Tiap skenario e2e; 16.7: DisputeState DIBUKA → MEDIASI → SELESAI |
| 22 | Bab C (opt-in) | Fleksibilitas bayar | Opsi "Bayar Penuh di Awal" (opt-in) | FR-PAYMENT-002 | BR-003 (opt-in; perk prioritas konfirmasi; data willingness) | POST /payments (full) | 16.5: Full payment 100% saat booking + flag prioritas konfirmasi |
| 23 | Bab C (fallback) | Disintermediasi | Fallback cash TERCATAT | FR-PAYMENT-009; Modul 5.14 | BR-035 (cash tercatat masuk GMV; komisi via saldo; bukan dana escrow) | POST /payments/cash-record | 16.9: Cash masuk ledger, komisi terhitung via saldo tagihan |
| 24 | Bab C (transparansi) | Potongan misterius | Notifikasi instan tiap event uang | FR-NOTIFICATION-001 | BR-032 (push + WhatsApp untuk setiap event uang) | Modul Notification; webhook internal | 16.2: Notifikasi tiap event uang (push + WhatsApp) |
| 25 | Lampiran B | Kepatuhan PDP | Consent terpisah + hak hapus + enkripsi | FR-USER-003, FR-USER-004; SEC-020/021/007 | BR-040 (consent eksplisit terpisah); BR-016 (retensi TBD); [LEGAL VALIDATION REQUIRED] | /users/consents, /users/data-deletion | 16.8: Hapus data / tarik consent dengan sengketa aktif ditolak |
| 26 | Lampiran B | Kepatuhan PMSE | Kanal keluhan + moderasi listing + identitas platform | FR-ADMIN-001; Modul 5.30 (Customer Support) | BR-041 (kanal keluhan wajib tersedia) | /support/tickets, /admin/moderation | 16.4: CS tidak bisa approve payout / eksekusi aksi finansial |

> **Catatan:** baris 12–17 memakai pemisahan `BookingState` vs `EscrowState` (Bagian 7 / Source Pack D); istilah proposal "DP_DITERIMA" dipetakan sebagai event `dp_paid`, bukan state.

# 19. Open Questions & Validation Backlog

Kolom: `ID` | `Question` | `Affected Module` | `Current Assumption` | `Decision Needed` | `Owner` | `Priority` | `Status`.

Status yang dipakai: `Open` | `In Validation` | `Decided`. Prioritas: `Critical` (menghambat MVP/finalisasi SRS) | `High` | `Medium` | `Low`.

| ID | Question | Affected Module | Current Assumption | Decision Needed | Owner | Priority | Status |
|---|---|---|---|---|---|---|---|
| OQ-001 | Berapa persen DP dari total sewa? | Payment (FR-PAYMENT-001) | Hipotesis 20–30% | Tetapkan angka final berbasis riset WTP | Product | Critical | Open |
| OQ-002 | Berapa menit link pembayaran DP kedaluwarsa (X)? | Payment, Booking | Belum ada angka | Tetapkan X menit + alasan operasional | Product | Critical | Open |
| OQ-003 | Berapa SLA konfirmasi rental (usulan 2 jam)? | Booking (FR-BOOKING-002) | Usulan 2 jam | Validasi ke rental: 2 jam realistis? Tetapkan final | Ops | Critical | Open |
| OQ-004 | Berapa masa retensi data verifikasi (usulan 90 hari)? | Verification, Security (SEC-022) | Usulan 90 hari | Validasi kebutuhan hukum vs privasi; tetapkan final | Legal | High | Open |
| OQ-005 | Bagaimana tier refund pembatalan pengguna (H-berapa → %)? | Payment/Refund (FR-PAYMENT-003) | Belum ada tier | Tetapkan matriks H-berapa vs % refund; cek UU 8/1999 | Product + Legal | Critical | Open |
| OQ-006 | Berapa jam batas lapor unit tak sesuai (X jam)? | Dispute (FR-DISPUTE-001) | Belum ada angka | Tetapkan X jam yang adil bagi kedua pihak | Product | High | Open |
| OQ-007 | Bagaimana formula refund proporsional untuk kasus mogok? | Dispute, Payment | "Refund proporsional" tanpa formula | Tetapkan formula (mis. pro-rata hari tersisa) | Product | High | Open |
| OQ-008 | Berapa persen komisi platform dari nilai sewa? | Payout (FR-PAYOUT-001), Finance | Belum ada angka | Pricing validation; tetapkan % final | Finance | Critical | Open |
| OQ-009 | Berapa harga membership per tier (Basic/Pro/Max)? | Rental/Merchant | Tier didefinisikan, harga belum | Pricing validation per tier | Finance | High | Open |
| OQ-010 | Berapa lama periode gratis langganan? | Rental/Merchant | Belum ada angka | Tetapkan durasi + syarat | Product | Medium | Open |
| OQ-011 | Bagaimana skema referral (insentif & syarat)? | Growth/Rental | Belum dirancang | Rancang skema anti-gaming | Product | Medium | Open |
| OQ-012 | Berapa rentang ukuran rental pilot (usulan 5–30 unit)? | Ops/Pilot | Usulan 5–30 unit | Validasi: batas bawah/atas final | Ops | Medium | Open |
| OQ-013 | Berapa ambang likuiditas mikro per klaster (usulan 10 unit/5 rental)? | Ops/Pilot | Asumsi 10 unit dari ≥5 rental | Uji asumsi di lapangan | Ops | Medium | Open |
| OQ-014 | Apakah target 500 booking/12 bulan realistis? | Pilot/KPI | Asumsi proposal | Validasi via wawancara + data demand | Product | Medium | Open |
| OQ-015 | Bagaimana struktur escrow final yang sah secara hukum? | Payment, Legal | Escrow via PG berizin; rekening terpisah | Legal validation: struktur, kebijakan hold & refund tertulis | Legal | Critical | Open |
| OQ-016 | Finalisasi T&C, Kebijakan Privasi, Perjanjian Merchant — apakah klausulnya sah? | Legal/Platform | Draft mengikuti proposal | Legal validation penuh; pastikan tanpa klausul baku merugikan (UU 8/1999) | Legal | Critical | Open |
| OQ-017 | Apakah perjanjian sewa elektronik (click-to-accept) cukup kuat sebagai bukti? | Verification (FR-VERIFICATION-003) | Click-to-accept + audit trail | Legal validation UU ITE; putuskan perlu/tidaknya TTE tersertifikasi di growth | Legal | High | Open |
| OQ-018 | Detail kepatuhan UU PDP: apa yang wajib ada sebelum launch? | Security, Legal | Peta Lampiran B | Legal validation: DPIA, penunjukan DPO bila wajib, perjanjian pemrosesan dengan vendor e-KYC | Legal | Critical | Open |
| OQ-019 | Bagaimana perlakuan pajak atas komisi (objek pajak, pemotongan, pelaporan)? | Finance | Komisi = objek pajak (asumsi) | Konsultan pajak pre-launch: skema + dokumen | Finance | High | Open |
| OQ-020 | Berapa angka pasar sewa kendaraan DIY yang valid (ukuran & pertumbuhan)? | Riset/Data | Angka proposal belum tervalidasi | Data primer/sekunder terverifikasi | Product | High | Open |
| OQ-021 | Siapa kompetitor langsung & apa celah yang belum dilayani? | Riset/Data | Belum ada riset kompetitor | Riset kompetitor terdokumentasi | Product | Medium | Open |
| OQ-022 | Berapa willingness-to-pay rental untuk komisi & membership? | Pricing | Belum diukur | Survei/wawancara WTP ke rental | Product | High | Open |
| OQ-023 | Seberapa besar kesediaan rental pindah dari WhatsApp ke dashboard? | Adopsi/Ops | Asumsi: insentif riwayat terpusat cukup | Uji via 15 wawancara + 30 survei (target proposal) | Ops | High | Open |
| OQ-024 | Siapa payment gateway berizin dengan fitur escrow yang dipakai? | Integration (PG) | PROVIDER TBD | Seleksi vendor: lisensi, fitur escrow, biaya, webhook, SLA | Tech + Finance | Critical | Open |
| OQ-025 | Siapa vendor e-KYC (OCR + validitas format)? | Integration (e-KYC) | PROVIDER TBD | Seleksi vendor + perjanjian pemrosesan data (UU PDP) | Tech + Legal | Critical | Open |
| OQ-026 | Siapa notification provider (push + WhatsApp + email)? | Integration (Notifikasi) | PROVIDER TBD | Seleksi vendor | Tech | High | Open |
| OQ-027 | Bagaimana penanganan webhook BERHASIL yang tiba setelah payment KEDALUWARSA? | Payment (SEC-012) | Ditangani sebagai refund; detail TBD | Business decision: alur & SLA penanganan | Product + Tech | High | Open |
| OQ-028 | Apakah booking yang berakhir via sengketa boleh di-review? | Review (FR-REVIEW-001) | Aturan dasar: hanya transaksi terselesaikan | Business decision: eligibilitas review pasca-sengketa | Product | Medium | Open |
| OQ-029 | Berapa ambang nilai yang memicu approval dua tahap untuk aksi finansial internal? | Security (SEC-002) | Belum ada angka | Business decision | Finance | Medium | Open |
| OQ-030 | Ambang aturan deteksi anomali (flag fraud) yang tepat? | Security (SEC-017) | Aturan sederhana, ambang belum ada | Business decision berbasis data pilot | Product + Ops | Low | Open |

> **Aturan main backlog:** tidak satu pun OQ di atas boleh diubah menjadi angka final di requirement tanpa keputusan pemilik yang tercatat. Selama berstatus `Open`, requirement terkait memakai status `TBD` / `Validation Required` / `Legal Validation Required` / `Business Decision Required` sesuai kategorinya.

# 20. SRS Quality Review

Self-review dilakukan setelah seluruh bagian selesai, mengacu pada daftar periksa yang diminta. Issue yang ditemukan selama review DIPERBAIKI langsung bila memungkinkan; yang tersisa dicatat di bawah sebagai temuan terbuka.

## 20.1 Checklist Verifikasi

| # | Pertanyaan | Hasil |
|---|---|---|
| 1 | Apakah ada requirement yang tidak punya sumber? | Lolos. Seluruh 97 FR + 44 BR + 22 SEC dapat dilacak ke proposal via Bagian 18. Dua FR yang awalnya tidak ada (cash tercatat, persetujuan perjanjian) ditambahkan karena keduanya berakar di proposal (Bab V.5 dan Bab VII.1) — bukan karangan. |
| 2 | Apakah ada requirement yang bertentangan dengan proposal? | Lolos. Tidak ditemukan kontradiksi. Keputusan desain kunci (full payment on-platform, handover terkunci, escrow, H+1) dipertahankan di semua bagian. |
| 3 | Apakah ada business rule yang hilang? | Lolos setelah perbaikan. 44 BR mencakup seluruh aturan proposal; 4 aturan tambahan (BR-041–044) diekstrak dari Lampiran B. |
| 4 | Apakah ada state transition yang ambigu? | Lolos. 8 state machine + sub-mesin payment; setiap state non-terminal memiliki jalan keluar; transisi terlarang didefinisikan eksplisit (mis. DITERUSKAN sebelum LUNAS dilarang). |
| 5 | Apakah payment flow aman secara logic? | Lolos. Invarian ditegakkan di 3 tempat independen (FR, state machine, error handling): refund/payout hanya dari dana ditahan; tidak ada state uang menggantung tanpa event ledger; webhook idempotent. |
| 6 | Apakah DP dan pelunasan sudah dipisahkan? | Lolos. Payment record terpisah per jenis (DP / PELUNASAN / FULL / CASH) dengan relasi 1:N ke booking; FR-PAYMENT-001 vs 003. |
| 7 | Apakah escrow/payment event sudah jelas? | Lolos. EscrowState dipisahkan dari BookingState; tabel pemetaan istilah proposal → desain kanonis ada di Bagian 7. |
| 8 | Apakah payout sudah jelas? | Lolos. H+1, minus komisi, status terlacak (Dana Saya), retry saat gagal, referensi bank. |
| 9 | Apakah deposit dan claim sudah jelas? | Lolos. Claim window 24 jam, pembekuan saat klaim, mediasi, potong/lepas. |
| 10 | Apakah dispute flow sudah jelas? | Lolos. 6 kategori proposal terpetakan; mediasi berdasar bukti foto; eskalasi hukum bila buntu. |
| 11 | Apakah e-KYC dan data sensitif sudah dilindungi? | Lolos. SEC-006/007/020/021/022; rental tidak melihat citra KTP mentah; retensi & hapus sesuai UU PDP. |
| 12 | Apakah role permission sudah jelas? | Lolos. Authorization matrix 22 kapabilitas × 6 peran + segregasi tugas finansial (SEC-002). |
| 13 | Apakah webhook idempotency dibahas? | Lolos. SEC-011/012; diuji di 16.5/16.6 termasuk kasus webhook-terlambat-setelah-kedaluwarsa. |
| 14 | Apakah audit trail dibahas? | Lolos. 24 event wajib + format data minimum + observabilitas (Bagian 15). |
| 15 | Apakah fitur Future Development tidak tercampur dengan MVP? | Lolos. Verifikasi teks: tidak ada ML/AI, native app, atau telematika di Bagian 4/5/11; ketiganya hanya muncul di Bagian 17 sebagai Future/Out of Scope. |

> **Statistik dokumen:** 97 Functional Requirements, 44 Business Rules, 22 Security Requirements, 8 state machine, 27 data entity, ±85 API endpoint, 30 open questions.

## 20.2 SRS Issues Found

| Issue | Severity | Affected Requirement | Why It Matters | Recommended Resolution | Status |
|---|---|---|---|---|---|
| ISSUE-001: Bagian 18 (traceability) memakai penomoran BR sendiri (BR-001–035) yang bertabrakan dengan BR kanonis Bagian 6 | High | Bagian 18 (26 baris) | Rujukan BR yang salah membuat developer mengimplementasikan aturan yang keliru | Dipetakan ulang ke BR-001–044 kanonis Bagian 6 (terverifikasi via script) | Fixed |
| ISSUE-002: Bagian 18 merujuk ID FR yang salah untuk 9 baris (mis. FR-VERIFICATION-002 untuk verifikasi rental, FR-BOOKING-002 untuk konfirmasi) | High | Bagian 18 | Traceability rusak: pembaca tidak menemukan FR yang dimaksud | Diperbaiki ke ID aktual (FR-RENTAL-002, FR-BOOKING-008, FR-PAYMENT-003, dst.) | Fixed |
| ISSUE-003: Tidak ada FR untuk fallback "cash tercatat" (BR-035, Bab V.5 proposal) — hanya disebut di modul & API | Medium | BR-035 | Tanpa FR, developer tidak punya kontrak perilaku untuk pencatatan cash & penagihan komisi via saldo | Ditambahkan FR-PAYMENT-009; modul 5.14 diperbarui | Fixed |
| ISSUE-004: Tidak ada FR khusus untuk persetujuan perjanjian sewa elektronik (BR-017) — hanya sebagai precondition | Medium | BR-017, Modul 5.17 | Click-to-accept + audit trail adalah syarat kritis sebelum pembayaran; layak punya kontrak sendiri | Ditambahkan FR-VERIFICATION-007 | Fixed |
| ISSUE-005: Alur konfirmasi rental + auto-cancel SLA (BR-006) tidak punya ID FR sendiri | Medium | BR-006, Modul 5.10 | Aturan kritis (batal otomatis + refund penuh) tersebar di flow FR-BOOKING-001 | Ditambahkan FR-BOOKING-008 | Fixed |
| ISSUE-006: FR-BOOKING-002 (penerbitan link DP) tumpang tindih sebagian dengan FR-PAYMENT-001 | Low | FR-BOOKING-002, FR-PAYMENT-001 | Risiko implementasi ganda untuk penerbitan link | Diputuskan: FR-BOOKING-002 memiliki siklus link (terbit/kedaluwarsa); FR-PAYMENT-001 memiliki pergerakan dana. Didokumentasikan di sini sebagai batas tanggung jawab | Accepted |
| ISSUE-007: Peran backoffice (Admin/Verifikasi/CS/Mediasi) dirangkap tim inti pada pilot — matrix tetap memakai 6 peran logis | Low | Bagian 12, SEC-010 | Risiko implementasi menyatukan peran secara permanen | Dipertahankan 6 peran logis (RBAC); perangkapan hanya konfigurasi user→role di fase pilot, dengan audit identitas individu (SEC-010) | Accepted |
| ISSUE-008: 30 open questions (OQ-001–030) berarti banyak requirement berstatus TBD — dokumen belum bisa jadi blueprint final | Info | Bagian 19 | Bukan cacat dokumen, melainkan cerminan jujur status proposal | Setiap OQ punya owner & prioritas; requirement terkait tidak boleh di-final-kan sebelum OQ diputuskan | Tracked |

## 20.3 Pernyataan Kualitas

Dokumen ini memenuhi seluruh aturan utama yang ditetapkan: tidak ada fitur/angka yang dikarang, tidak ada business logic proposal yang diubah, semua yang belum final ditandai TBD dengan status yang tepat, ML/AI/native app/telematika tidak menyusup ke MVP, baseline responsive web app dipertahankan, dan setiap requirement menjelaskan siapa–apa–kondisi–proses–hasil–aturan–kegagalan.
Pemisahan BookingState vs EscrowState didokumentasikan dengan tabel pemetaan eksplisit sehingga istilah proposal ("DP_DITERIMA" sebagai event, bukan state) tidak menimbulkan ambiguitas implementasi.

