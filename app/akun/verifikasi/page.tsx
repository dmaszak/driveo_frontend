"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { AccountNav } from "@/components/account/account-nav";
import { useAuth } from "@/lib/store/auth-store";
import {
  FileCheck2,
  ShieldCheck,
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  Info,
  Car,
  RotateCcw,
} from "lucide-react";

export default function VerificationKYCPage() {
  const { user, submitKyc, simulateApproveKyc } = useAuth();

  // Wizard Step: 1 = KTP, 2 = SIM A, 3 = Selfie Liveness
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [nik, setNik] = useState(user?.nik || "3471012308950002");
  const [ktpName, setKtpName] = useState(user?.name || "Budi Santoso");
  const [ktpPreview, setKtpPreview] = useState<string | null>(
    user?.ktpUrl ||
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
  );

  const [simNumber, setSimNumber] = useState(user?.simNumber || "950812345678");
  const [simExpiry, setSimExpiry] = useState(user?.simExpiry || "2029-08-23");
  const [simPreview, setSimPreview] = useState<string | null>(
    user?.simUrl ||
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
  );

  const [selfiePreview, setSelfiePreview] = useState<string | null>(
    user?.selfieUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  );

  const isVerified = user?.verificationStatus === "VERIFIED";
  const isPending = user?.verificationStatus === "MENUNGGU";

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      submitKyc({
        nik,
        simNumber,
        simExpiry,
        ktpUrl: ktpPreview || undefined,
        simUrl: simPreview || undefined,
        selfieUrl: selfiePreview || undefined,
      });
    }
  };

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
          <Link href="/akun" className="hover:text-blue-600 transition-colors">
            Akun Saya
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Verifikasi Identitas Digital (e-KYC)</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <AccountNav />

          {/* Main e-KYC Verification Content */}
          <div className="flex-1 w-full space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>e-KYC Enkripsi AES-256 UU PDP No. 27/2022</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950">
                    Verifikasi Identitas Pengemudi (e-KYC)
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                    Wajib bagi penyewa mobil lepas kunci di wilayah D.I. Yogyakarta. Anda tidak perlu meninggalkan KTP fisik asli sebagai jaminan.
                  </p>
                </div>

                {/* Status Badge Top */}
                <div className="self-start sm:self-auto">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Terverifikasi Penuh</span>
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 font-extrabold text-xs">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Sedang Ditinjau Tim</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-xs">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                      <span>Belum Diverifikasi</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* STATE 1: ALREADY VERIFIED (SUCCESS CARD) */}
            {isVerified && (
              <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-emerald-950">
                      Selamat, Identitas Anda Telah Terverifikasi!
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                      Dokumen e-KTP dan SIM A Anda telah divalidasi resmi oleh Tim Verifikasi DriveO. Anda dapat langsung melakukan pemesanan sewa mobil lepas kunci ke seluruh armada mitra di Yogyakarta.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">
                      Nomor Induk Kependudukan (NIK)
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 font-mono mt-1 block">
                      347101******0002
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                      ✓ Valid Dukcapil Terproteksi
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">
                      Surat Izin Mengemudi (SIM A)
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 font-mono mt-1 block">
                      9508******** (Berlaku s.d. 2029)
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                      ✓ Memenuhi Syarat Lepas Kunci
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href="/cari"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    <Car className="w-4 h-4" />
                    <span>Jelajahi Armada & Pesan Sekarang</span>
                  </Link>

                  <span className="text-xs text-slate-400">
                    Dokumen Anda tersimpan aman dan terenkripsi.
                  </span>
                </div>
              </div>
            )}

            {/* STATE 2: PENDING REVIEW WITH SIMULATOR BUTTON */}
            {isPending && !isVerified && (
              <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-amber-950">
                      Dokumen e-KYC Sedang Ditinjau Tim Verifikasi
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                      Pengajuan e-KTP dan SIM A Anda telah kami terima. Tim Verifikasi DriveO sedang memvalidasi keaslian dokumen dengan standar waktu penyelesaian ≤ 30 menit pada jam kerja.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>Apa yang terjadi selanjutnya?</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Begitu dokumen Anda disetujui, lencana terverifikasi akan aktif otomatis di akun Anda dan Anda dapat langsung checkout pesanan armada lepas kunci.
                  </p>
                </div>

                {/* SIMULASI APPROVED BUTTON (FOR PAIR-PROGRAMMING DEMO) */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-950 block">
                      Tombol Demo & Pengujian Sistem:
                    </span>
                    <span className="text-[11px] text-blue-800">
                      Klik tombol ini untuk mensimulasikan persetujuan instan dari Tim Verifikasi.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => simulateApproveKyc()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shrink-0 shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Simulasikan Disetujui (Lolos e-KYC)</span>
                  </button>
                </div>
              </div>
            )}

            {/* STATE 3: STEPPER FORM (IF NOT VERIFIED AND NOT PENDING) */}
            {!isVerified && !isPending && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-8">
                {/* Visual Step Indicator */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { num: 1, label: "1. Foto e-KTP Asli" },
                    { num: 2, label: "2. SIM A Pengemudi" },
                    { num: 3, label: "3. Swafoto Biometrik" },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        currentStep === step.num
                          ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm"
                          : currentStep > step.num
                          ? "bg-slate-50 border-slate-200 text-emerald-700 font-medium"
                          : "bg-slate-50/50 border-slate-200 text-slate-400"
                      }`}
                    >
                      <div className="text-xs font-extrabold">
                        {currentStep > step.num ? `✓ ${step.label}` : step.label}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleNextStep} className="space-y-6">
                  {/* STEP 1: E-KTP */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-base font-bold text-slate-950">
                          Langkah 1: Unggah e-KTP Asli Anda
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pastikan seluruh informasi pada e-KTP terlihat tajam tanpa pantulan cahaya flash.
                        </p>
                      </div>

                      {/* Dropzone with Watermark Overlay */}
                      <div className="relative border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors">
                        {ktpPreview ? (
                          <div className="relative aspect-[16/10] max-w-md mx-auto rounded-2xl overflow-hidden shadow-md">
                            <Image src={ktpPreview} alt="Preview KTP" fill className="object-cover" />
                            {/* Watermark overlay */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                              <span className="text-white/80 font-black text-xs sm:text-sm tracking-wider uppercase rotate-[-15deg] border-2 border-white/60 p-2 rounded-lg backdrop-blur-sm">
                                DRIVEO e-KYC VERIFICATION ONLY
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-8">
                            <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <span className="text-xs font-bold text-slate-700 block">
                              Klik atau seret foto e-KTP Anda ke sini
                            </span>
                            <span className="text-[11px] text-slate-400 mt-1 block">
                              Mendukung format JPG, PNG, atau WEBP (Maksimal 5MB)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Form Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Nomor Induk Kependudukan (16-Digit NIK) *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={16}
                            value={nik}
                            onChange={(e) => setNik(e.target.value)}
                            placeholder="Contoh: 3471012308950002"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Nama Lengkap (Sesuai KTP) *
                          </label>
                          <input
                            type="text"
                            required
                            value={ktpName}
                            onChange={(e) => setKtpName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SIM A */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-base font-bold text-slate-950">
                          Langkah 2: Unggah Surat Izin Mengemudi (SIM A)
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Wajib memiliki SIM A aktif untuk mengemudi kendaraan mobil lepas kunci di wilayah DIY.
                        </p>
                      </div>

                      {/* Dropzone with Watermark Overlay */}
                      <div className="relative border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors">
                        {simPreview ? (
                          <div className="relative aspect-[16/10] max-w-md mx-auto rounded-2xl overflow-hidden shadow-md">
                            <Image src={simPreview} alt="Preview SIM A" fill className="object-cover" />
                            {/* Watermark overlay */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                              <span className="text-white/80 font-black text-xs sm:text-sm tracking-wider uppercase rotate-[-15deg] border-2 border-white/60 p-2 rounded-lg backdrop-blur-sm">
                                DRIVEO e-KYC VERIFICATION ONLY
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-8">
                            <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <span className="text-xs font-bold text-slate-700 block">
                              Klik atau seret foto SIM A Anda ke sini
                            </span>
                            <span className="text-[11px] text-slate-400 mt-1 block">
                              Mendukung format JPG, PNG, atau WEBP (Maksimal 5MB)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Form Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Nomor SIM A *
                          </label>
                          <input
                            type="text"
                            required
                            value={simNumber}
                            onChange={(e) => setSimNumber(e.target.value)}
                            placeholder="Contoh: 950812345678"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Masa Berlaku SIM A *
                          </label>
                          <input
                            type="date"
                            required
                            value={simExpiry}
                            onChange={(e) => setSimExpiry(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: LIVENESS BIOMETRIC SELFIE */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-base font-bold text-slate-950">
                          Langkah 3: Swafoto Biometrik (Liveness Check)
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Ambil foto selfie jelas dengan pencahayaan terang untuk mencocokkan wajah dengan foto e-KTP.
                        </p>
                      </div>

                      <div className="relative border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center bg-slate-50 hover:bg-slate-100/70 transition-colors">
                        {selfiePreview ? (
                          <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white">
                            <Image src={selfiePreview} alt="Preview Selfie" fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="py-8">
                            <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <span className="text-xs font-bold text-slate-700 block">
                              Ambil Foto Selfie Sekarang
                            </span>
                            <span className="text-[11px] text-slate-400 mt-1 block">
                              Hindari kacamata hitam, masker, atau topi
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <span>Pernyataan Kebenaran Data (UU ITE & UU PDP)</span>
                        </div>
                        <p className="text-[11px] text-blue-800 leading-relaxed">
                          Dengan mengirimkan data ini, saya menyatakan bahwa dokumen e-KTP dan SIM A yang saya unggah adalah sah milik pribadi dan bersedia bertanggung jawab secara hukum atas penggunaan akun ini.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Sebelumnya</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30 cursor-pointer"
                    >
                      <span>
                        {currentStep === 3
                          ? "Kirim Pengajuan e-KYC (SLA ≤ 30 Menit)"
                          : "Lanjut Langkah Berikutnya"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
