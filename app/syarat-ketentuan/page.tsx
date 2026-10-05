"use client";

import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import {
  FileText,
  ShieldCheck,
  ChevronRight,
  Scale,
  Car,
  AlertCircle,
  Clock,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Syarat & Ketentuan Layanan</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 mb-8 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Kepatuhan PP No. 80/2019 & KUHPerdata</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
            Syarat dan Ketentuan Layanan DriveO
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Terakhir diperbarui: 1 Oktober 2026. Ketentuan ini mengikat seluruh pengguna (Penyewa, Mitra Rental Kendaraan, dan Pengunjung) dalam ekosistem platform digital sewa kendaraan di Daerah Istimewa Yogyakarta.
          </p>
        </div>

        {/* Layout: Sticky TOC + Clauses Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Daftar Isi Ketentuan</span>
            </h3>
            <nav className="space-y-1 text-xs">
              {[
                { id: "definisi", title: "1. Definisi & Kedudukan Hukum" },
                { id: "verifikasi", title: "2. Verifikasi e-KYC & Kelayakan" },
                { id: "transparansi", title: "3. Transparansi Tarif & Deposit (BR-026)" },
                { id: "inspeksi", title: "4. Serah Terima & Inspeksi 8-Titik (BR-015)" },
                { id: "pembatalan", title: "5. Pembatalan & Keterlambatan (Overtime)" },
                { id: "tanggung-jawab", title: "6. Pembatasan Tanggung Jawab & Asuransi" },
                { id: "sengketa", title: "7. Penyelesaian Sengketa & Yurisdiksi" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 font-medium transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Clauses Content */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {/* Section 1 */}
            <section id="definisi" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <span>Definisi & Kedudukan Hukum Platform PMSE</span>
              </h2>
              <p>
                <strong>DriveO</strong> bertindak sebagai Penyelenggara Perdagangan Melalui Sistem Elektronik (PMSE) berdasarkan Peraturan Pemerintah No. 80 Tahun 2019 yang menyediakan infrastruktur digital, sistem verifikasi identitas, dan rekening penampung (escrow) perantara antara Mitra Rental Resmi dan Penyewa.
              </p>
              <p>
                <strong>Mitra Rental</strong> adalah badan usaha berizin sah (NIB OSS-RBA) yang menyediakan armada kendaraan bermotor berpelat nomor wilayah D.I. Yogyakarta (Plat AB) yang telah lolos kurasi kelayakan teknis.
              </p>
            </section>

            {/* Section 2 */}
            <section id="verifikasi" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                  2
                </span>
                <span>Ketentuan Verifikasi Identitas (e-KYC)</span>
              </h2>
              <p>
                Penyewa layanan lepas kunci wajib berusia minimal 18 tahun dan telah menyelesaikan proses verifikasi identitas digital (e-KYC) berupa:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>e-KTP Asli Warga Negara Indonesia atau Paspor aktif bagi Warga Negara Asing.</li>
                <li>Surat Izin Mengemudi (SIM A) yang masih berlaku sah secara hukum.</li>
                <li>Verifikasi swafoto biometrik (liveness check) untuk mencocokkan wajah pemegang dokumen.</li>
              </ul>
              <p>
                DriveO dan Mitra berhak menolak atau membatalkan pesanan sewa secara sepihak jika ditemukan indikasi pemalsuan dokumen atau identitas fiktif.
              </p>
            </section>

            {/* Section 3 */}
            <section id="transparansi" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                  3
                </span>
                <span>Transparansi Tarif All-In & Jaminan Escrow (BR-026, BR-007)</span>
              </h2>
              <p>
                Semua tarif harian yang tercantum di katalog DriveO merupakan tarif transparan (All-In). Tidak ada pungutan tersembunyi di luar biaya antar-jemput ke lokasi khusus dan deposit jaminan kerusakan yang telah dikonfirmasi sebelumnya.
              </p>
              <p>
                Deposit jaminan kerusakan ditampung secara aman pada rekening escrow resmi DriveO. Deposit akan dikembalikan 100% penuh kepada penyewa maksimal dalam waktu 1x24 jam kerja setelah kendaraan diserahkan kembali tanpa adanya klaim kerusakan fisik atau denda tilang elektronik (ETLE).
              </p>
            </section>

            {/* Section 4 */}
            <section id="inspeksi" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                  4
                </span>
                <span>Inspeksi Digital 8-Titik & Serah Terima Unit (BR-015)</span>
              </h2>
              <p>
                Pada saat serah terima kendaraan, Staf Operasional Mitra dan Penyewa wajib melakukan inspeksi fisik bersama menggunakan fitur Checklist Digital 8-Titik pada aplikasi DriveO, mencakup:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 font-medium text-xs">
                <div>• Bodi Depan & Bumper</div>
                <div>• Bodi Samping Kanan & Pintu</div>
                <div>• Bodi Belakang & Bagasi</div>
                <div>• Bodi Samping Kiri & Pintu</div>
                <div>• Kondisi 4 Roda & Ban Serep</div>
                <div>• Interior, AC & Kebersihan Jok</div>
                <div>• Odometer & Posisi Indikator BBM</div>
                <div>• Kelengkapan Surat STNK Asli & Dongkrak</div>
              </div>
              <p>
                Penyewa dan Mitra wajib menandatangani digital handover report. Laporan ini menjadi bukti otentik apabila terdapat perselisihan saat pengembalian unit.
              </p>
            </section>

            {/* Section 5 */}
            <section id="pembatalan" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                  5
                </span>
                <span>Kebijakan Pembatalan & Keterlambatan Pengembalian (Overtime)</span>
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong>Pembatalan ≥ 24 jam</strong> sebelum jadwal mulai sewa: dana sewa dan deposit dikembalikan 100% ke penyewa.
                </li>
                <li>
                  <strong>Pembatalan &lt; 24 jam</strong>: dikenakan biaya pembatalan sebesar 50% dari tarif hari pertama sebagai kompensasi unit yang telah ditahan oleh mitra.
                </li>
                <li>
                  <strong>Keterlambatan (Overtime)</strong>: Toleransi maksimal 60 menit dengan pemberitahuan awal. Keterlambatan lebih dari 60 menit dikenakan tarif overtime 10% per jam dari tarif harian unit, hingga maksimal 5 jam di mana akan dihitung sebagai sewa 1 hari penuh.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="tanggung-jawab" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                  6
                </span>
                <span>Pembatasan Tanggung Jawab & Asuransi Kendaraan</span>
              </h2>
              <p>
                Seluruh kendaraan yang disewakan melalui mitra resmi DriveO dilindungi oleh polis asuransi komersial. Dalam hal terjadi kecelakaan yang bukan disebabkan oleh kelalaian berat (seperti mengemudi di bawah pengaruh alkohol/narkoba atau balap liar), penyewa hanya bertanggung jawab atas klaim biaya risiko sendiri (Own Risk / Deductible) sesuai ketentuan polis asuransi.
              </p>
            </section>

            {/* Section 7 */}
            <section id="sengketa" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                  7
                </span>
                <span>Penyelesaian Sengketa, Mediasi & Yurisdiksi Hukum</span>
              </h2>
              <p>
                Apabila timbul perselisihan antara Penyewa dan Mitra Rental, para pihak sepakat untuk terlebih dahulu menempuh musyawarah mufakat melalui Tim Mediasi DriveO (<code>TIM_MEDIASI</code>) dengan masa mediasi maksimal 7 (tujuh) hari kerja.
              </p>
              <p>
                Jika kesepakatan tidak tercapai, para pihak sepakat untuk menyelesaikan sengketa melalui yurisdiksi Pengadilan Negeri Kota Yogyakarta.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
