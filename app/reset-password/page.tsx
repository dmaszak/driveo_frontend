"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Car,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "demo-token";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: "Belum diisi", color: "bg-slate-200" };
    if (password.length < 6)
      return { level: 1, text: "Sangat Lemah", color: "bg-rose-500" };
    if (password.length < 8)
      return { level: 2, text: "Sedang", color: "bg-amber-500" };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password))
      return { level: 3, text: "Kuat", color: "bg-emerald-500" };
    return { level: 2, text: "Cukup", color: "bg-blue-500" };
  };

  const strength = getPasswordStrength();

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/masuk"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Batal & Kembali</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md mx-auto px-4 py-8 w-full flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25">
              <KeyRound className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-slate-900">
                Drive<span className="text-blue-600">O</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                Setel Sandi Baru
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Buat Kata Sandi Baru
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Silakan masukkan kata sandi baru yang kuat untuk mengamankan akun
              Anda.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            /* Success State */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kata Sandi Berhasil Diperbarui</span>
                </div>
                <p className="leading-relaxed">
                  Kata sandi baru Anda telah aktif. Anda sekarang dapat masuk ke
                  akun DriveO dengan kredensial baru.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/masuk")}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    className="w-full text-xs sm:text-sm p-3.5 pl-10 pr-9 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Konfirmasi Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    required
                    className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Strength Meter */}
              {password && (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Kekuatan Sandi:</span>
                    <span className="font-bold">{strength.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.level / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                {isLoading ? (
                  <span>Menyimpan Sandi Baru...</span>
                ) : (
                  <>
                    <span>Simpan Kata Sandi Baru</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 text-center text-xs text-slate-400">
        &copy; 2026 DriveO Yogyakarta
      </footer>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs">
          Memuat Form Reset Sandi...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
