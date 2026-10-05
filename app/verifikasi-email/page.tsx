"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  Car,
  MailCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function EmailVerificationPage() {
  const [authState] = useAuthStore();
  const user = authState.currentUser;
  const [cooldown, setCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState(false);

  const handleResend = () => {
    setResendStatus(true);
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
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md mx-auto px-4 py-8 w-full flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <MailCheck className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Langkah Verifikasi Akun
            </span>
            <h1 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              Periksa Kotak Masuk Email
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kami telah mengirimkan tautan aktivasi akun ke alamat email:
            </p>
            <p className="text-xs font-bold text-slate-900 font-mono bg-slate-100 p-2.5 rounded-xl border border-slate-200">
              {user?.email || "nama.anda@email.com"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left text-xs text-amber-900 space-y-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <span>Apa yang perlu dilakukan?</span>
            </span>
            <ul className="space-y-1 text-[11px] text-amber-800 list-disc list-inside">
              <li>Buka pesan dari DriveO Indonesia di email Anda.</li>
              <li>Klik tombol <strong>"Aktivasi Akun Saya"</strong>.</li>
              <li>Akun Anda langsung aktif untuk sewa mobil di Jogja.</li>
            </ul>
          </div>

          {resendStatus && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Email aktivasi baru berhasil dikirimkan!</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {cooldown > 0 ? (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
                <Clock className="w-4 h-4" />
                <span>Kirim ulang email dalam {cooldown} detik</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="w-full py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Kirim Ulang Email Aktivasi</span>
              </button>
            )}

            <Link
              href="/"
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-heading font-bold text-xs shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Lanjut Menjelajahi Armada di Beranda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 text-center text-xs text-slate-400">
        &copy; 2026 DriveO Yogyakarta • Perlindungan Akun Pengguna
      </footer>
    </div>
  );
}
