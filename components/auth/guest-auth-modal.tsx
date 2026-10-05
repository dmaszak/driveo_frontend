"use client";

import React from "react";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowRight, UserPlus, LogIn, X, Sparkles } from "lucide-react";

interface GuestAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  intendedVehicleName?: string;
  redirectUrl?: string;
}

export function GuestAuthModal({
  isOpen,
  onClose,
  intendedVehicleName,
  redirectUrl,
}: GuestAuthModalProps) {
  if (!isOpen) return null;

  const loginUrl = redirectUrl
    ? `/masuk?redirect=${encodeURIComponent(redirectUrl)}`
    : "/masuk";
  const registerUrl = redirectUrl
    ? `/daftar?redirect=${encodeURIComponent(redirectUrl)}`
    : "/daftar";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        {/* Modal Titles */}
        <h3 className="text-xl font-black text-slate-950">
          Masuk untuk Melanjutkan Pemesanan
        </h3>

        {intendedVehicleName && (
          <div className="mt-2.5 py-1.5 px-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold inline-block border border-blue-200">
            {intendedVehicleName}
          </div>
        )}

        <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed">
          Sesuai SOP keamanan dan kepatuhan e-KYC D.I. Yogyakarta, pemesanan kendaraan lepas kunci membutuhkan akun penyewa terverifikasi.
        </p>

        {/* Benefit Points */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rekening Escrow Garansi Uang Kembali 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Digital Handover 8-Titik Bebas Ribet</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <Link
            href={loginUrl}
            className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Akun Anda</span>
          </Link>

          <Link
            href={registerUrl}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Akun Penyewa Baru</span>
          </Link>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          Nanti Saja, Lanjut Jelajah Armada
        </button>
      </div>
    </div>
  );
}
