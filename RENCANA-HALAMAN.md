# 06 — Rencana Halaman & Pemetaan 97 FR (sumber kebenaran cakupan frontend)

Dokumen ini adalah **checklist cakupan**. Aturan: (1) setiap FR di SRS Bagian 4 harus punya tempat di UI (atau ditandai “sistem/backend, UI hanya menampilkan efeknya”); (2) tidak boleh ada halaman/fitur di luar daftar ini tanpa persetujuan; (3) halaman bertanda **(turunan)** tidak disebut eksplisit sebagai FR tetapi dibutuhkan agar FR bisa dijalankan.

## Ringkasan jumlah
| Area | Halaman |
|---|---|
| Publik (marketplace + info + legal) | 9 |
| Autentikasi | 5 |
| Penyewa & bersama (akun, booking, sengketa, notifikasi) | 18 |
| Mitra Rental (`/mitra/*` + undangan staf) | 25 |
| Halaman sistem (404, 403, error) | 3 |
| **Subtotal sisi pengguna (tanpa backoffice)** | **60** |
| Backoffice internal (`/admin/*`) | 20 |
| **TOTAL** | **80** |

> Selain halaman, ada ±25 dialog/komponen interaktif penting (daftar di Bagian 7). Total tidak termasuk variasi state (loading/kosong/error) karena itu bagian dari tiap halaman.

Konvensi route: publik di root; penyewa di `/akun`, `/booking`, `/pesan`; mitra rental di `/mitra`; backoffice di `/admin`. Tanda 🔒 = perlu login, **P**=Penyewa, **M**=Mitra Rental (owner/staf), **A**=peran internal.

---
## 1. Publik (9) — tanpa login
| # | Route | Isi & fitur | FR / BR | Fase |
|---|---|---|---|---|
| 1 | `/` | Landing + form pencarian (lokasi, tanggal, jenis), 3 lapis nilai, cara kerja, ProtectionNotice | SEARCH-001 | 3 |
| 2 | `/cari` | Hasil: filter (jenis, harga all-in, verifikasi rental, rating min., transmisi/fitur), sorting, status ketersediaan (TERSEDIA/SEBAGIAN/TIDAK_TERSEDIA/“tidak dapat memastikan”), FreshnessTag + label basi, paginasi, pesan kosong jujur + saran | SEARCH-001..004, LISTING-004, BR-025..028 | 3 |
| 3 | `/listing/[id]` | Galeri, spesifikasi, syarat sewa, PriceAllIn + rincian (tarif, **deposit**, antar-jemput), kalender ketersediaan, profil ringkas rental, tombol Pesan/Bandingkan | SEARCH-004, DEPOSIT-001, BR-026 | 3 |
| 4 | `/bandingkan` | Perbandingan 2–3 listing berdampingan (harga all-in, verifikasi, rating+booking selesai, syarat, kebaruan). Tanpa skor gabungan | SRS 5.8, BR-013/015/026 | 3 |
| 5 | `/rental/[id]` | Profil publik rental: verifikasi, rating, booking selesai, listing, ulasan | REVIEW-003, RENTAL-003 | 3 |
| 6 | `/jadi-mitra` **(turunan)** | Penjelasan jadi mitra rental + CTA daftar | RENTAL-001 | 3 |
| 7 | `/syarat-ketentuan` **(turunan)** | T&C (konten placeholder “Draft – menunggu validasi legal”) | AUTH-001, OQ-016 | 3 |
| 8 | `/kebijakan-privasi` **(turunan)** | Kebijakan privasi (placeholder legal) | USER-003, OQ-018 | 3 |
| 9 | `/bantuan` | FAQ, cara ajukan keluhan, formulir keluhan ke CS (PP 80/2019) | SRS 5.30 | 9 |

## 2. Autentikasi (5)
| # | Route | Isi & fitur | FR | Fase |
|---|---|---|---|---|
| 10 | `/daftar` | Registrasi (nama, email, phone, password, consent); pilihan jalur Penyewa / Mitra Rental | AUTH-001, AUTH-005 | 4 |
| 11 | `/masuk` | Login email/phone; lockout/429/diblokir; **pilih konteks rental** bila akun staf terikat >1 rental | AUTH-002 (+alt), RENTAL-004 | 4 |
| 12 | `/lupa-password` | Minta tautan reset (respons selalu netral) | AUTH-004 | 4 |
| 13 | `/reset-password` | Setel password baru via token | AUTH-004 | 4 |
| 14 | `/verifikasi-email` **(turunan)** | Status & kirim ulang verifikasi email | AUTH-001 | 4 |

*(Logout & refresh token — FR AUTH-003 — adalah perilaku sesi di layer auth, bukan halaman.)* Halaman terima undangan staf ada di Bagian 4 (#44).

## 3. Penyewa & bersama (18) 🔒
| # | Route | Isi & fitur | FR | Fase |
|---|---|---|---|---|
| 15 | `/akun` | Lihat/ubah profil (nama, phone; email tidak bisa diubah) | USER-001, USER-002 | 4 |
| 16 | `/akun/privasi` | **Pengaturan Privasi**: lihat/tarik consent (dengan konsekuensi), **hapus data saya** (konfirmasi, status PENDING_KEWAJIBAN, daftar penghalang 409), info retensi (tanpa angka final) | USER-003, USER-004, VERIFICATION-006 | 4 |
| 17 | `/akun/verifikasi` | e-KYC: consent terpisah → upload KTP → SIM → kirim → status (DISUBMIT…DISETUJUI/DITOLAK, kirim ulang) | VERIFICATION-001/002, BR-014/040 | 4 |
| 18 | `/pesan/[listingId]` | Pilih tanggal/jam + lokasi jemput, ringkasan all-in, pilih **DP** atau **Bayar Penuh di Awal** (opt-in) → buat booking & kunci slot (handle 409) | BOOKING-001, PAYMENT-002 | 5 |
| 19 | `/booking/[id]/perjanjian` | Baca perjanjian sewa elektronik (versi, key_terms), click-to-accept (wajib sebelum bayar) | VERIFICATION-007, BR-017 | 5 |
| 20 | `/booking/[id]/bayar` | Bayar DP/Full: QRIS/link, Countdown kedaluwarsa, polling status, gagal→coba lagi, kedaluwarsa | BOOKING-002/003, PAYMENT-001/002/005/006 | 5 |
| 21 | `/booking` | **Riwayat/Transaksi Saya**: daftar (aktif/selesai/batal) + status booking & pembayaran, filter | USER-005 | 5 |
| 22 | `/booking/[id]` | Detail: kedua state, BookingTimeline, rincian biaya (DP/pelunasan/deposit), riwayat pembayaran + referensi, refund, perjanjian (versi+waktu), dokumen serah terima/pengembalian, tab Deposit & klaim, aksi: batal, perpanjang, bayar pelunasan, sengketa, unduh ringkasan | USER-005, BOOKING-004, PAYMENT-007/008, DEPOSIT-002/004..006 | 5 |
| 23 | `/booking/[id]/pelunasan` | Bayar pelunasan (link/QRIS) → unlock handover | PAYMENT-003 | 6 |
| 24 | `/booking/[id]/serah-terima` | Gembok TERKUNCI/TERBUKA, checklist + foto, konfirmasi kedua pihak | HANDOVER-001..004 | 6 |
| 25 | `/booking/[id]/pengembalian` | Mulai pengembalian, checklist+foto, perbandingan handover vs return, konfirmasi, terlambat+denda | RETURN-001..004 | 6 |
| 26 | `/booking/[id]/perpanjang` | Pilih tanggal baru → tagihan tambahan → bayar | BOOKING-007, BR-034 | 6 |
| 27 | `/booking/[id]/ulasan` | Form rating dua arah (eligibility check) | REVIEW-001/002 | 9 |
| 28 | `/booking/[id]/sengketa/baru` | Buka sengketa: kategori, deskripsi, bukti | DISPUTE-001/002 | 9 |
| 29 | `/sengketa/[id]` | Detail sengketa (P & M): state, timeline mediasi, tambah bukti, putusan read-only, eskalasi hukum | DISPUTE-002..006 | 9 |
| 30 | `/akun/ulasan` | Ulasan diterima & diberikan (+dampak reputasi untuk rental) | REVIEW-003/004 | 9 |
| 31 | `/notifikasi` | Inbox in-app, belum dibaca, deep link | NOTIFICATION-003, BR-032 | 9 |
| 32 | `/akun/notifikasi` | Preferensi kanal push/WhatsApp/email | NOTIFICATION-001/002/004 | 9 |

## 4. Mitra Rental `/mitra/*` (25) 🔒 M
| # | Route | Isi & fitur | FR | Fase |
|---|---|---|---|---|
| 33 | `/mitra/daftar` | Registrasi profil rental (nama, alamat, kota DIY, phone PIC, deskripsi) | RENTAL-001 | 7 |
| 34 | `/mitra/verifikasi` | Verifikasi mitra: identitas PJ, NIB/izin usaha, dokumen kendaraan; progres & status | RENTAL-002, BR-036 | 7 |
| 35 | `/mitra/perjanjian` | Perjanjian merchant click-to-accept; **persetujuan ulang** saat versi baru | RENTAL-005, BR-017 | 7 |
| 36 | `/mitra/kendaraan` | Daftar armada + status | VEHICLE-001..005 | 7 |
| 37 | `/mitra/kendaraan/baru` | Tambah unit + foto (≥ min.) | VEHICLE-001, 003 | 7 |
| 38 | `/mitra/kendaraan/[id]` | Ubah data, foto, dokumen STNK/BPKB, nonaktifkan (409 bila booking aktif) | VEHICLE-002..005 | 7 |
| 39 | `/mitra/listing` | Tab Aktif / Draft / Nonaktif / **Arsip**; publish/unpublish; peringatan basi | LISTING-003/004/005 | 7 |
| 40 | `/mitra/listing/baru` | Buat listing dari unit terverifikasi; harga (tarif+deposit+antar-jemput), pratinjau all-in | LISTING-001/002 | 7 |
| 41 | `/mitra/listing/[id]` | Ubah, pratinjau, unpublish, **arsipkan/kembalikan**, tombol “data masih akurat” (konfirmasi freshness) | LISTING-002..005 | 7 |
| 42 | `/mitra/kalender` | Kalender lintas unit/per unit, blokir manual, status AVAILABLE/BOOKED/BLOCKED/OFFLINE_ORDER | SRS 5.5, BR-028/029 | 7 |
| 43 | `/mitra/order-offline` | Catat order non-platform (WA) + daftar | BR-029, SRS 11.3 | 7 |
| 44 | `/undangan-staf/[token]` **(turunan)** | Terima undangan staf | RENTAL-004 | 8 |
| 45 | `/mitra` | Dashboard: tugas (konfirmasi + Countdown SLA, handover mendatang, klaim), dana ditahan, peringatan | SRS 5.3 | 8 |
| 46 | `/mitra/booking` | Daftar booking platform & non-platform, filter state | BOOKING-008 | 8 |
| 47 | `/mitra/booking/[id]` | Detail: kedua state, data penyewa (ringkasan verifikasi), konfirmasi/tolak/batal, **catat pembayaran tunai** (dialog), perpanjangan, deposit | BOOKING-005/006/008, VERIFICATION-005, PAYMENT-008/009 | 8 |
| 48 | `/mitra/booking/[id]/serah-terima` | Checklist+foto sisi rental, konfirmasi | HANDOVER-001..004 | 6 |
| 49 | `/mitra/booking/[id]/pengembalian` | Checklist+foto sisi rental, konfirmasi, denda | RETURN-001..004 | 6 |
| 50 | `/mitra/booking/[id]/klaim` | Ajukan klaim kerusakan dalam claim window + bukti foto | DEPOSIT-003/004 | 6 |
| 51 | `/mitra/dana` | **Dana Saya**: ditahan → dalam perjalanan → ditransfer + referensi bank, komisi, payout (TERJADWAL/DIPROSES/BERHASIL/GAGAL), kondisi dibekukan | PAYOUT-001..004 | 8 |
| 52 | `/mitra/dana/riwayat` | **Riwayat Dana** (ledger read-only, filter booking; tunai tercatat berlabel “di luar escrow”) | BR-031, SRS 5.26 | 8 |
| 53 | `/mitra/rekap` | Rekap bulanan unduhan | PAYOUT-005 | 8 |
| 54 | `/mitra/pelanggan` | Riwayat pelanggan | SRS 5.3 / lingkup dashboard | 8 |
| 55 | `/mitra/pengaturan/profil` | Ubah profil rental; **zona bahaya: nonaktifkan rental** (blokir bila booking aktif, daftar penghalang) | RENTAL-003/007 | 8 |
| 56 | `/mitra/pengaturan/rekening` | **Rekening payout**: input, verifikasi kepemilikan, status, ubah = verifikasi ulang (payout ditahan) — owner saja | RENTAL-006 | 8 |
| 57 | `/mitra/pengaturan/staf` | **Kelola staf**: undang (STAFF_OPERASIONAL / STAFF_KEUANGAN), cabut akses — owner saja | RENTAL-004 | 8 |

*(Catatan fase: #48–50 dikerjakan di Fase 6 dan disambungkan ke #47 di Fase 8.)*

## 5. Halaman sistem (3)
| # | Route | Isi | Fase |
|---|---|---|---|
| 58 | `not-found` (404) | | 0 |
| 59 | `/403` | Tidak berwenang (RBAC) | 0 |
| 60 | `error` | Error umum + coba lagi | 0 |

## 6. Backoffice `/admin/*` (20) 🔒 A — Fase 10
| # | Route | Isi & fitur | FR | Peran |
|---|---|---|---|---|
| 61 | `/admin` | Dashboard operasional: booking, dana tertahan, antrean verifikasi, sengketa | ADMIN-004 | Admin |
| 62 | `/admin/pengguna` | Daftar, cari, blokir/buka | ADMIN-001 | Admin |
| 63 | `/admin/pengguna/[id]` | Detail, **penetapan peran internal** (dengan alasan), blokir/buka | ADMIN-001, AUTH-005 | Admin |
| 64 | `/admin/rental` | Daftar rental + status | ADMIN-002 | Admin |
| 65 | `/admin/rental/[id]` | Detail, tangguhkan/nonaktifkan paksa, riwayat verifikasi | ADMIN-002, RENTAL-007 | Admin |
| 66 | `/admin/listing` | Moderasi, takedown (reason_code) | ADMIN-003 | Admin |
| 67 | `/admin/verifikasi` | Antrean (identitas penyewa & mitra) | VERIFICATION-003 | Verifikasi |
| 68 | `/admin/verifikasi/[id]` | Review + citra signed URL + setujui/tolak | VERIFICATION-003/004, RENTAL-002 | Verifikasi |
| 69 | `/admin/transaksi` | Monitoring booking & pembayaran (anomali) | ADMIN-004 | Admin/Support |
| 70 | `/admin/transaksi/[id]` | Detail dua state + ledger + banner **concierge “bertindak atas nama”** | ADMIN-004, SRS 11 (concierge) | Admin |
| 71 | `/admin/refund` | Persetujuan/penerbitan refund manual (validasi ≤ dana tertahan) | ADMIN-005, PAYMENT-007 | Admin |
| 72 | `/admin/payout` | Oversight: jadwal, retry GAGAL, jalankan | ADMIN-006, PAYOUT-002/004 | Admin |
| 73 | `/admin/dana` | Overview dana tertahan agregat (rekonsiliasi vs PG) | ADMIN-004 | Admin |
| 74 | `/admin/sengketa` | Daftar sengketa & klaim | DISPUTE-003 | Mediasi/Support |
| 75 | `/admin/sengketa/[id]` | Mediasi: bukti, perbandingan foto, putusan, eskalasi hukum | DISPUTE-003..006 | Mediasi |
| 76 | `/admin/klaim/[id]` | Putusan klaim (potong sebagian / lepas penuh) | DEPOSIT-005, DISPUTE-004 | Mediasi |
| 77 | `/admin/audit` | Query audit log (actor/entity/waktu), akses terbatas | AUDIT-002/003 | Admin/Support/Mediasi |
| 78 | `/admin/perjanjian` | Kelola template perjanjian (versi) | Matriks “Manage Agreement” | Admin |
| 79 | `/admin/notifikasi` | Kirim notifikasi ke pengguna/pihak sengketa | Matriks “Send Notification”, DISPUTE-006 | Admin/Support/Mediasi |
| 80 | `/admin/bantuan` | Daftar keluhan CS | SRS 5.30 | Support |

---
## 7. Dialog & komponen interaktif penting (bukan halaman)
Pembatalan booking (penyewa/rental) · Tolak booking (alasan) · Catat pembayaran tunai · Kalender blokir manual · Undang staf · Cabut akses staf · Nonaktifkan rental/kendaraan/listing (daftar penghalang 409) · Arsip listing · Tarik consent · Hapus data · Pilih konteks rental · Pilih metode bayar · Bayar Penuh opt-in · Konfirmasi serah terima/pengembalian · Upload foto/dokumen · Unduh ringkasan transaksi / rekap · Konfirmasi aksi admin berisiko (blokir, takedown, refund, putusan) · Bar perbandingan melayang · Filter drawer mobile.

## 8. Pemetaan 97 FR → UI
Legenda: **H** = halaman/dialog (#nomor di atas) · **T** = UI hanya *menampilkan efek* (proses otomatis di backend/sistem).

**AUTH (5)** 001 H#10,14 · 002 H#11 · 003 T (sesi: refresh/logout, layer auth) · 004 H#12,13 · 005 H#10,63 + guard peran
**USER (5)** 001 H#15 · 002 H#15 · 003 H#16,17 · 004 H#16 · 005 H#21,22
**RENTAL (7)** 001 H#6,33 · 002 H#34,68 · 003 H#55 · 004 H#11,44,57 · 005 H#35 · 006 H#56 · 007 H#55,65
**VEHICLE (5)** 001 H#37 · 002 H#38 · 003 H#37,38 · 004 H#38 · 005 H#38
**LISTING (5)** 001 H#40 · 002 H#40,41 · 003 H#39,41 · 004 H#2,3,4,39,41 (+T scheduler) · 005 H#39,41
**SEARCH (4)** 001..004 H#1,2,3
**BOOKING (8)** 001 H#18 · 002 H#20 · 003 T (#20,22) · 004 H#22 dialog · 005 H#47 dialog · 006 H#47 dialog · 007 H#26 · 008 H#47,45 (+T auto-cancel SLA)
**PAYMENT (9)** 001 H#20 · 002 H#18,20 · 003 H#23 · 004 T (webhook; FE polling) · 005 T (#20) · 006 H#20 (retry) · 007 H#22,71 · 008 H#22,47 · 009 H#47 dialog
**VERIFICATION (7)** 001 H#17 · 002 T (#17) · 003 H#67 · 004 H#68 · 005 H#47 · 006 T/H (#16 info) · 007 H#19
**HANDOVER (4)** 001..004 H#24,48 (002 = T unlock otomatis)
**RETURN (4)** 001..004 H#25,49
**DEPOSIT (6)** 001 H#3,40 · 002 H#22,47 (T window) · 003 H#50 · 004 T/H (#22,47,50) · 005 H#76 · 006 T (#22)
**PAYOUT (5)** 001 T (#51) · 002 T/H (#51,72) · 003 H#51 · 004 H#51,72 · 005 H#53
**REVIEW (4)** 001 H#27 · 002 H#27 · 003 H#5,30 · 004 H#5,30,65
**DISPUTE (6)** 001 H#28 · 002 H#28,29 · 003 H#74,75 · 004 H#75,76 · 005 H#29,75 · 006 H#31,79
**NOTIFICATION (4)** 001 T/H (#32 preferensi; push dikirim backend) · 002 T/H (#32) · 003 H#31 · 004 H#32
**ADMIN (6)** 001 H#62,63 · 002 H#64,65 · 003 H#66 · 004 H#61,69,70,73 · 005 H#71 · 006 H#72
**AUDIT (3)** 001 T (backend) · 002 H#77 · 003 guard di #77

## 9. Pemetaan Halaman → Fase prompt
| Fase | Halaman (#) | Jumlah |
|---|---|---|
| 0 Setup | 58, 59, 60 | 3 |
| 1–2 Design system, tipe & mock | (tanpa halaman produk; /dev/components) | 0 |
| 3 Marketplace publik | 1, 2, 3, 4, 5, 6, 7, 8 | 8 |
| 4 Auth, profil, e-KYC | 10, 11, 12, 13, 14, 15, 16, 17 | 8 |
| 5 Booking & DP | 18, 19, 20, 21, 22 | 5 |
| 6 Handover → deposit | 23, 24, 25, 26, 48, 49, 50 | 7 |
| 7 Mitra: onboarding, armada, listing, kalender | 33–43 | 11 |
| 8 Mitra: booking, dana, pengaturan | 44, 45, 46, 47, 51, 52, 53, 54, 55, 56, 57 | 11 |
| 9 Review, sengketa, notifikasi, bantuan | 9, 27, 28, 29, 30, 31, 32 | 7 |
| 10 Backoffice | 61–80 | 20 |
| 11 Integrasi & QA | — | 0 |
| **Total** | | **80** |

## 10. Keputusan yang perlu kamu setujui sebelum membangun
1. **Backoffice (20 halaman)** ikut dibangun atau tidak. Jika tidak: 60 halaman.
2. Jalur registrasi mitra: SRS FR-AUTH-005 menyebut akun mitra dibuat saat registrasi, sedangkan API 11.3 memakai `POST /rentals` oleh penyewa yang sudah login. Rencana ini mendukung keduanya (pilihan jalur di `/daftar`, lalu `/mitra/daftar`) — konfirmasi ke tim backend.
3. Halaman **(turunan)**: `/jadi-mitra`, `/syarat-ketentuan`, `/kebijakan-privasi`, `/verifikasi-email`, `/undangan-staf/[token]`. Semuanya dibutuhkan agar FR berjalan, tetapi bukan FR eksplisit.
4. FR dengan status “Business Decision Required” (mis. multi-user hanya tier tertentu, multi-rekening, apakah pelunasan tunai membuka kunci handover) dibangun mengikuti **default aman SRS** (mis. tunai TIDAK membuka kunci handover) dan dicatat di OPEN_QUESTIONS.
5. Membership bertier **tidak** dibangun, jadi kelola staf tidak dibatasi per tier di UI.
