"use client";

import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import {
  ShieldAlert,
  Lock,
  ChevronRight,
  FileCheck,
  UserCheck,
  EyeOff,
  KeyRound,
  Mail,
  Building,
} from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <span className="text-slate-900 font-semibold">Kebijakan Perlindungan Data Pribadi</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 mb-8 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Kepatuhan Penuh Terhadap UU No. 27 Tahun 2022 (UU PDP)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
            Kebijakan Privasi & Perlindungan Data Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Terakhir diperbarui: 1 Oktober 2026. Kami berkomitmen menjaga keamanan dan kerahasiaan data pribadi, identitas e-KTP, SIM A, serta data transaksi Anda dengan standar enkripsi militer dan kepatuhan hukum Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Quick Nav */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>Daftar Perlindungan PDP</span>
            </h3>
            <nav className="space-y-1 text-xs">
              {[
                { id: "pengendali", title: "1. Pengendali Data Pribadi" },
                { id: "data-dikumpulkan", title: "2. Jenis Data yang Dikumpulkan" },
                { id: "tujuan", title: "3. Tujuan Pemrosesan & e-KYC" },
                { id: "keamanan", title: "4. Enkripsi & Retensi Dokumen" },
                { id: "hak-subjek", title: "5. Hak Anda Sebagai Subjek Data" },
                { id: "kontak-dpo", title: "6. Kontak Resmi DPO DriveO" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Policy Clauses */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {/* Section 1 */}
            <section id="pengendali" className="space-y-3 scroll-mt-28">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <span>Pengendali Data Pribadi</span>
              </h2>
              <p>
                Pengendali Data Pribadi atas seluruh informasi yang dikumpulkan melalui situs dan platform digital DriveO adalah <strong>PT DriveO Ekosistem Nusantara</strong>, beralamat operasional di Kota Yogyakarta, Daerah Istimewa Yogyakarta.
              </p>
            </section>

            {/* Section 2 */}
            <section id="data-dikumpulkan" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  2
                </span>
                <span>Jenis Data Pribadi yang Kami Kumpulkan</span>
              </h2>
              <p>
                Dalam rangka memfasilitasi transaksi sewa mobil yang aman dan legal, kami mengumpulkan kategori data berikut:
              </p>
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">A. Data Pribadi Umum:</strong>
                  <span>Nama lengkap sesuai KTP, alamat surat elektronik (email), nomor telepon/WhatsApp aktif, kota domisili.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">B. Data Pribadi Spesifik / Sensitif (e-KYC):</strong>
                  <span>Foto e-KTP, Nomor Induk Kependudukan (NIK), Foto SIM A aktif, dan foto swafoto biometrik pemegang identitas yang digunakan semata-mata untuk verifikasi kelayakan mengemudi.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block mb-1">C. Data Teknis Transaksi:</strong>
                  <span>Titik lokasi jemput di DIY (Bandara YIA, Stasiun Tugu, dll), durasi sewa, log digital handover 8-titik, dan alamat IP saat bertransaksi.</span>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="tujuan" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  3
                </span>
                <span>Tujuan Pemrosesan Data & Prinsip e-KYC</span>
              </h2>
              <p>Data pribadi Anda diproses untuk:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Melakukan verifikasi keaslian pengemudi sebelum serah terima armada (mencegah pencurian dan penggelapan unit rental).</li>
                <li>Memfasilitasi penahanan dan pengembalian deposit garansi melalui rekening penampung (escrow).</li>
                <li>Menyediakan bantuan darurat 24 jam dan koordinasi penjemputan di wilayah Yogyakarta.</li>
                <li>Kepatuhan terhadap permintaan penegakan hukum yang sah dari pihak Kepolisian Republik Indonesia (seperti verifikasi tilang elektronik ETLE).</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="keamanan" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  4
                </span>
                <span>Keamanan, Enkripsi & Retensi Data Identitas</span>
              </h2>
              <p>
                Dokumen sensitif (KTP dan SIM A) dienkripsi menggunakan standar <strong>AES-256</strong> dan ditransmisikan melalui protokol aman <strong>TLS 1.3</strong>. Foto KTP diberi watermark digital DriveO secara otomatis guna mencegah penyalahgunaan di luar sistem kami.
              </p>
              <p>
                Kami tidak pernah menjual, menyewakan, atau membagikan data identitas pribadi Anda kepada pihak ketiga untuk kepentingan pemasaran tanpa persetujuan eksplisit Anda.
              </p>
            </section>

            {/* Section 5 */}
            <section id="hak-subjek" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  5
                </span>
                <span>Hak Anda Sebagai Subjek Data Pribadi</span>
              </h2>
              <p>
                Berdasarkan UU PDP No. 27 Tahun 2022 Pasal 5 sampai dengan Pasal 13, Anda memiliki hak penuh untuk:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 font-medium">
                  ✓ Hak mengakses & memperoleh salinan data Anda
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 font-medium">
                  ✓ Hak memperbarui & memperbaiki kesalahan data
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 font-medium">
                  ✓ Hak menghapus data (Right to be Forgotten)
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 font-medium">
                  ✓ Hak menarik kembali persetujuan (Consent Withdrawal)
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="kontak-dpo" className="space-y-3 scroll-mt-28 pt-6 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  6
                </span>
                <span>Kontak Resmi Pejabat Perlindungan Data (DPO)</span>
              </h2>
              <p>
                Untuk mengajukan permohonan hak subjek data atau menyampaikan pertanyaan terkait perlindungan data pribadi, silakan hubungi Tim DPO kami:
              </p>
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Email: dpo@driveo.id / privasi@driveo.id</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>Kantor: Jl. Malioboro No. 56, Gedongtengen, Kota Yogyakarta 55271</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
