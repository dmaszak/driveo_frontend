"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useMitra } from "@/lib/store/mitra-store";
import { formatIndonesianDate } from "@/lib/utils";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowRight,
  Scale,
  Building2,
  Sparkles,
  Info,
  Car,
} from "lucide-react";

export default function MerchantAgreementPage() {
  const router = useRouter();
  const { profile, signContract } = useMitra();

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedEscrow, setAgreedEscrow] = useState(false);
  const [agreedOfflineBan, setAgreedOfflineBan] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const isAllAgreed = agreedTerms && agreedEscrow && agreedOfflineBan;

  const handleSignAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllAgreed) return;

    setIsSigning(true);
    setTimeout(() => {
      const hash = `dvo-merchant-${Date.now()}-sha256-verified-signature`;
      signContract(hash);
      setIsSigning(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        router.push("/mitra/kendaraan");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/mitra/verifikasi" className="hover:text-blue-600 transition-colors">
            Verifikasi NIB
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Perjanjian Kemitraan Merchant</span>
        </div>

        {/* Stepper Wizard Onboarding */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Tahapan Onboarding Mitra Rental (FR-RENTAL-001..005)
          </span>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <Link
              href="/mitra/daftar"
              className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="truncate">1. Profil Usaha</span>
            </Link>
            <Link
              href="/mitra/verifikasi"
              className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="truncate">2. Legalitas NIB</span>
            </Link>
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-300 text-blue-900 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                3
              </span>
              <span className="truncate">3. Perjanjian</span>
            </div>
          </div>
        </div>

        {/* Header Title Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full">
                Langkah Terakhir: Akta Kemitraan Digital (FR-RENTAL-005)
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Perjanjian Kemitraan Penyelenggara Sistem Elektronik
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Antara <strong>PT DriveO Nusantara Berdaya</strong> dan{" "}
                <strong className="text-slate-900">{profile.legalEntityName}</strong> ({profile.businessName}), NIB:{" "}
                <span className="font-mono">{profile.nibNumber}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Agreement Document Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
          <div className="bg-slate-900 p-6 sm:p-7 text-white flex items-center justify-between">
            <div>
              <span className="text-xs font-mono tracking-wider text-slate-400 uppercase block">
                Naskah Standar Kemitraan Merchant DriveO v1.0
              </span>
              <h2 className="text-base sm:text-lg font-bold mt-1">
                Ketentuan Hak, Kewajiban & Skema Finansial Escrow
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>UU ITE & PP No. 80/2019</span>
            </div>
          </div>

          {/* Scrollable Clauses Box */}
          <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[460px] overflow-y-auto border-b border-slate-100 bg-slate-50/50">
            {/* Pasal 1 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Pasal 1: Ruang Lingkup Layanan & Pemasaran Armada Plat AB
              </h3>
              <p>
                Platform DriveO bertindak sebagai infrastruktur digital perdagangan melalui sistem elektronik (PMSE) yang menghubungkan armada terdaftar milik Mitra Rental dengan calon penyewa terverifikasi (e-KYC) di seluruh Daerah Istimewa Yogyakarta. Seluruh armada wajib berplat AB resmi dan memiliki dokumen STNK aktif.
              </p>
            </div>

            {/* Pasal 2 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Pasal 2: Skema Bagi Hasil Komisi & Pencairan Dana (Payout H+1)
              </h3>
              <p>
                Platform membebankan komisi transparan sebesar 10% dari tarif sewa harian kotor. Dana sewa penyewa aman ditahan di rekening penampung resmi (Escrow) selama masa sewa berjalan, dan <strong>otomatis dicairkan 100% ke rekening bank resmi Mitra pada H+1</strong> setelah unit kendaraan berhasil dikembalikan dan disetujui.
              </p>
            </div>

            {/* Pasal 3 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Pasal 3: Deposit Jaminan & Batas Waktu Pengajuan Klaim Kerusakan (Claim Window)
              </h3>
              <p>
                Deposit jaminan penyewa sepenuhnya diamankan di Escrow. Jika unit mengalami baret atau penyok baru saat pengembalian, Mitra memiliki hak mengajukan klaim ganti rugi dalam batas waktu <strong>Claim Window 24 Jam</strong> disertai foto perbandingan digital serah terima. Tim Mediasi Independen DriveO akan memproses klaim secara objektif.
              </p>
            </div>

            {/* Pasal 4 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Pasal 4: Batas Waktu Respons Konfirmasi Booking Masuk (SLA 2 Jam)
              </h3>
              <p>
                Mitra berkewajiban merespons persetujuan atau penolakan pesanan sewa yang masuk maksimal dalam waktu <strong>2 (dua) jam</strong>. Jika batas waktu SLA terlewati, sistem berhak membatalkan pesanan secara otomatis demi kepastian perjalanan penyewa.
              </p>
            </div>

            {/* Pasal 5 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Pasal 5: Larangan Keras Transaksi Liar di Luar Platform (Bypass)
              </h3>
              <p>
                Mitra dilarang keras membujuk atau mengarahkan penyewa yang datang melalui DriveO untuk melakukan transaksi pembayaran tunai atau transfer langsung di luar rekening escrow platform. Pelanggaran ketentuan ini mengakibatkan sanksi pencabutan kemitraan dan pembekuan akun secara permanen.
              </p>
            </div>

            {/* Pasal 6 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Pasal 6: Hukum yang Berlaku & Yurisdiksi Penyelesaian Sengketa
              </h3>
              <p>
                Perjanjian ini tunduk pada hukum Negara Kesatuan Republik Indonesia. Segala perselisihan yang timbul akan diselesaikan terlebih dahulu melalui mekanisme musyawarah mediasi independen platform DriveO di Yogyakarta.
              </p>
            </div>
          </div>

          {/* Interactive Checkbox Agreement */}
          <div className="p-6 sm:p-8 space-y-4 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Pernyataan Persetujuan Click-to-Accept:
            </h3>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                Saya telah membaca, memahami, dan menyetujui seluruh klausul Perjanjian Kemitraan Merchant DriveO di atas atas nama badan usaha <strong>{profile.legalEntityName}</strong>.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedEscrow}
                onChange={(e) => setAgreedEscrow(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                Saya menyetujui skema penampungan dana sewa di rekening Escrow terpisah dan mekanisme pencairan H+1 setelah pengembalian unit tuntas.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedOfflineBan}
                onChange={(e) => setAgreedOfflineBan(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                Saya berkomitmen untuk tidak mengalihkan transaksi ke jalur tunai di luar platform dan mematuhi batas waktu SLA konfirmasi pesanan 2 jam.
              </span>
            </label>
          </div>

          {/* Audit Trail Box */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] font-mono space-y-1">
              <span className="font-bold text-slate-700 block">Digital Signature Audit Trail (BR-017):</span>
              <p>Penanggung Jawab: {profile.picName} (NIK: {profile.picNik})</p>
              <p>Waktu Tanda Tangan: {new Date().toLocaleDateString("id-ID")} WIB</p>
              <p className="truncate">Hash Sertifikat: SHA256-DVO-MERCHANT-LEGAL-VERIFIED-PASS</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/mitra/verifikasi"
            className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all text-center cursor-pointer text-sm"
          >
            Kembali
          </Link>

          <button
            type="button"
            disabled={!isAllAgreed || isSigning || successAnimation}
            onClick={handleSignAgreement}
            className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigning ? (
              <span>Menerbitkan Tanda Tangan Digital...</span>
            ) : successAnimation ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Kemitraan Sah! Masuk Dashboard...</span>
              </>
            ) : (
              <>
                <span>Tandatangani Kontrak & Masuk Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
