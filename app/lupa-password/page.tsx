"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Car,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setCooldown(60);

      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 400);
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
          <span>Kembali ke Halaman Masuk</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md mx-auto px-4 py-8 w-full flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Brand Emblem */}
          <div className="flex items-center gap-2.5 pb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25">
              <Car className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-slate-900">
                Drive<span className="text-blue-600">O</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                Pemulihan Akses Akun
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Lupa Kata Sandi?
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Masukkan alamat email atau nomor WhatsApp yang terdaftar. Kami akan
              mengirimkan tautan reset kata sandi yang berlaku selama 15 menit.
            </p>
          </div>

          {isSubmitted ? (
            /* Neutral response success message (SEC-001) */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Permintaan Reset Diterima</span>
                </div>
                <p className="leading-relaxed">
                  Jika akun dengan email/WhatsApp <strong>{identifier}</strong>{" "}
                  terdaftar di sistem DriveO, instruksi pemulihan telah kami
                  kirimkan.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1.5">
                <span className="font-semibold text-slate-800 block">
                  Belum menerima pesan?
                </span>
                <p className="text-[11px] text-slate-500">
                  Periksa folder spam email atau pastikan nomor WhatsApp Anda aktif.
                </p>
                {cooldown > 0 ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kirim ulang tersedia dalam {cooldown} detik</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer pt-1"
                  >
                    Kirim Ulang Tautan Reset
                  </button>
                )}
              </div>

              {/* Demo shortcut to reset page */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-[11px] text-blue-800 flex items-center justify-between">
                <span>Khusus simulasi dev: Buka langsung form reset</span>
                <Link
                  href="/reset-password?token=demo-token-12345"
                  className="font-bold underline text-blue-700 hover:text-blue-900"
                >
                  Buka &rarr;
                </Link>
              </div>

              <Link
                href="/masuk"
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs text-center flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Email atau Nomor WhatsApp Terdaftar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: budi@gmail.com / 0812xxxx"
                    required
                    className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                {isLoading ? (
                  <span>Mengirimkan Tautan...</span>
                ) : (
                  <>
                    <span>Kirim Tautan Reset Sandi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/masuk"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Ingat kata sandi? Masuk di sini
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 text-center text-xs text-slate-400">
        &copy; 2026 DriveO Yogyakarta • Sistem Keamanan Terenkripsi
      </footer>
    </div>
  );
}
