"use client";

import Link from "next/link";
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  LogIn,
  Home,
  HelpCircle,
  UserCheck,
  Building2,
  Shield,
} from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Security Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Keamanan Sistem • Akses Terbatas (HTTP 403)</span>
        </div>

        {/* Visual Icon Container */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-50/80 flex items-center justify-center text-rose-600">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600" />
          </div>
          <span className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[11px] font-bold shadow-xs">
            TERKUNCI
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Akses Ditolak
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Anda tidak memiliki izin otorisasi (RBAC) untuk membuka halaman atau data ini. Akses dibatasi ketat sesuai peran akun aktif Anda.
          </p>
        </div>

        {/* Role Explanation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Akun Penyewa</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Hanya memiliki hak akses pada transaksi sewa aktif, riwayat booking, dan data pribadi miliknya sendiri.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Mitra Rental & Backoffice</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Memerlukan verifikasi legalitas mitra usaha terdaftar atau otorisasi tim internal DriveO.
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/masuk"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors min-h-[44px]"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk dengan Akun Berwenang</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Customer Support Notice */}
        <div className="pt-6 border-t border-slate-200/60 flex items-center justify-center gap-2 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>
            Merasa ini sebuah kekeliruan?{" "}
            <Link href="/bantuan" className="text-blue-600 font-semibold hover:underline">
              Hubungi Layanan Pengguna 24/7
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
