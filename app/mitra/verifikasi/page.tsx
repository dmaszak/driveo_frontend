"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useMitra } from "@/lib/store/mitra-store";
import { formatIndonesianDate } from "@/lib/utils";
import {
  FileCheck2,
  ShieldCheck,
  Building2,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
  FileText,
  Camera,
} from "lucide-react";

export default function MitraVerificationWizardPage() {
  const router = useRouter();
  const { profile, submitVerification, simulateApproveVerification } = useMitra();

  const [nibNumber, setNibNumber] = useState(profile.nibNumber || "1234567890123");
  const [npwpNumber, setNpwpNumber] = useState(profile.npwpNumber || "81.234.567.8-541.000");
  const [nibFileUrl, setNibFileUrl] = useState(
    profile.nibFileUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
  );
  const [ktpPicFileUrl, setKtpPicFileUrl] = useState(
    profile.ktpPicFileUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
  );
  const [garagePhotoUrl, setGaragePhotoUrl] = useState(
    profile.garagePhotoUrl || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80"
  );
  const [npwpFileUrl, setNpwpFileUrl] = useState(
    profile.npwpFileUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVerified = profile.verificationStatus === "TERVERIFIKASI";
  const isPending = profile.verificationStatus === "MENUNGGU_VERIFIKASI";

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    submitVerification({
      nibNumber,
      nibFileUrl,
      ktpPicFileUrl,
      garagePhotoUrl,
      npwpNumber,
    });

    setTimeout(() => {
      setIsSubmitting(false);
    }, 800);
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
          <Link href="/mitra/daftar" className="hover:text-blue-600 transition-colors">
            Profil Mitra
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Verifikasi Legalitas NIB</span>
        </div>

        {/* Stepper Wizard Onboarding */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Tahapan Onboarding Mitra Rental (FR-RENTAL-001..005)
          </span>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <Link
              href="/mitra/daftar"
              className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2 hover:bg-emerald-100 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="truncate">1. Profil Usaha</span>
            </Link>
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-300 text-blue-900 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                2
              </span>
              <span className="truncate">2. Legalitas NIB</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs shrink-0">
                3
              </span>
              <span className="truncate">3. Perjanjian</span>
            </div>
          </div>
        </div>

        {/* Status Verification Card */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border shadow-sm mb-8 transition-all ${
            isVerified
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : isPending
              ? "bg-amber-50 border-amber-300 text-amber-950"
              : "bg-white border-slate-200/90 text-slate-900"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isVerified
                    ? "bg-emerald-600 text-white"
                    : isPending
                    ? "bg-amber-500 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {isVerified ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : isPending ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <FileCheck2 className="w-6 h-6" />
                )}
              </div>
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isVerified
                      ? "bg-emerald-200 text-emerald-900"
                      : isPending
                      ? "bg-amber-200 text-amber-900"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {isVerified
                    ? "Legalitas Terverifikasi Penuh"
                    : isPending
                    ? "Dokumen Sedang Ditinjau Verifikator"
                    : "Menunggu Unggah Berkas"}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold mt-2">
                  Verifikasi Dokumen Usaha & NIB OSS (BR-036)
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Usaha: <strong className="text-slate-900">{profile.businessName}</strong> ({profile.legalEntityName}) • Wilayah:{" "}
                  <strong>{profile.city}</strong>
                </p>
              </div>
            </div>

            {/* Sandbox Simulator Button */}
            {!isVerified && (
              <button
                type="button"
                onClick={simulateApproveVerification}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>⚡ Simulasikan Verifikasi Disetujui</span>
              </button>
            )}
          </div>
        </div>

        {isVerified ? (
          /* State jika sudah terverifikasi */
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Dokumen Legalitas NIB Anda Telah Sah & Terverifikasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Tim Verifikasi Kemitraan DriveO telah memvalidasi keaslian Nomor Induk Berusaha (NIB OSS KBLI 77100), e-KTP Penanggung Jawab, dan keberadaan garasi fisik Anda di Yogyakarta. Langkah terakhir: Tinjau dan tandatangani Perjanjian Kemitraan Merchant.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/mitra/perjanjian"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer text-sm"
              >
                <span>Lanjut ke Langkah 3: Perjanjian Kemitraan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Form Upload Berkas */
          <form onSubmit={handleSubmitVerification} className="space-y-8">
            {/* Bagian 1: NIB OSS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    1. Nomor Induk Berusaha (NIB via OSS)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Wajib memiliki KBLI 77100 (Sewa Guna Usaha Mobil Tanpa Pengemudi)
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  KBLI 77100
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  13 Digit Nomor Induk Berusaha (NIB):
                </label>
                <input
                  type="text"
                  required
                  maxLength={13}
                  value={nibNumber}
                  onChange={(e) => setNibNumber(e.target.value)}
                  placeholder="1234567890123"
                  className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Pratinjau Berkas Dokumen NIB Resmi (PDF / Gambar Asli):
                </label>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-300 shrink-0">
                    <Image src={nibFileUrl} alt="NIB Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-slate-800 block">NIB_OSS_CV_Tugu.pdf</span>
                    <span className="text-slate-400">1.4 MB • Terunggah dan terenkripsi aman</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Siap
                  </span>
                </div>
              </div>
            </div>

            {/* Bagian 2: KTP PIC & Foto Garasi */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                2. e-KTP Penanggung Jawab & Bukti Garasi DIY
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* KTP PIC */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Foto e-KTP Asli Penanggung Jawab:
                  </label>
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                    <Image src={ktpPicFileUrl} alt="KTP PIC" fill className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-2 text-white text-[10px] font-mono text-center">
                      DRIVEO VERIFIED IDENTITY
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 block text-center">
                    Nama: {profile.picName} (NIK: {profile.picNik})
                  </span>
                </div>

                {/* Garasi Fisik */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Foto Garasi Fisik & Deretan Armada Plat AB:
                  </label>
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                    <Image src={garagePhotoUrl} alt="Garasi Fisik" fill className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-2 text-white text-[10px] font-mono text-center">
                      GARASI FISIK TERVERIFIKASI DIY
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 block text-center">
                    Lokasi: {profile.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Bagian 3: NPWP Usaha */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                3. Dokumen Pajak Usaha (NPWP)
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor Pokok Wajib Pajak (NPWP Usaha):
                </label>
                <input
                  type="text"
                  required
                  value={npwpNumber}
                  onChange={(e) => setNpwpNumber(e.target.value)}
                  placeholder="81.234.567.8-541.000"
                  className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Action Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link
                href="/mitra/daftar"
                className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all text-center cursor-pointer text-sm"
              >
                Kembali ke Profil
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Mengirim Berkas...</span>
                ) : (
                  <>
                    <span>Kirim Berkas untuk Verifikasi (SLA 24 Jam)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
