"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  Car,
  ShieldCheck,
  Menu,
  X,
  Compass,
  KeyRound,
  HelpCircle,
  Briefcase,
  ChevronRight,
  Sparkles,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
} from "lucide-react";

export function Navbar() {
  const [authState, store] = useAuthStore();
  const { currentUser } = authState;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!currentUser) return "/";
    if (["RENTAL", "STAFF_OPERASIONAL", "STAFF_KEUANGAN"].includes(currentUser.role)) {
      return "/mitra/dashboard";
    }
    if (["ADMIN", "TIM_VERIFIKASI", "CUSTOMER_SUPPORT", "TIM_MEDIASI"].includes(currentUser.role)) {
      return "/admin/dashboard";
    }
    return "/akun";
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all duration-300">
      <nav
        aria-label="Navigasi Utama DriveO"
        className={`w-full rounded-full transition-all duration-300 border ${
          isScrolled
            ? "bg-white/85 backdrop-blur-2xl border-white/60 shadow-xl shadow-slate-900/5 py-2 sm:py-2.5 px-4 sm:px-6"
            : "bg-white/70 backdrop-blur-xl border-white/40 shadow-lg shadow-slate-900/5 py-2.5 sm:py-3 px-4 sm:px-6"
        } flex items-center justify-between gap-4`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            <Car className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                Drive<span className="text-blue-600">O</span>
              </span>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 border border-amber-200/80 leading-none">
                JOGJA
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-500 leading-none mt-0.5 hidden sm:inline">
              Rental Bergaransi Escrow
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/cari"
            className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100/70 transition-colors flex items-center gap-1.5 min-h-[40px] cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Cari Armada</span>
          </Link>
          <a
            href="/#cara-kerja"
            className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100/70 transition-colors flex items-center gap-1.5 min-h-[40px] cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Garansi Escrow</span>
          </a>
          <a
            href="/#titik-jemput"
            className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100/70 transition-colors flex items-center gap-1.5 min-h-[40px] cursor-pointer"
          >
            <span>Titik Jemput DIY</span>
          </a>
          <Link
            href="/bantuan"
            className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100/70 transition-colors flex items-center gap-1.5 min-h-[40px] cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Bantuan</span>
          </Link>
        </div>

        {/* Right Action Cluster: Conditional Guest vs Logged In */}
        <div className="hidden sm:flex items-center gap-2 xl:gap-3 shrink-0">
          {currentUser ? (
            /* Logged In User State */
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardLink()}
                className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 min-h-[42px] border border-slate-200/80 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="leading-tight truncate max-w-[120px]">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] text-blue-600 font-mono leading-none">
                    [{currentUser.role}]
                  </span>
                </div>
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                type="button"
                onClick={() => store.logout()}
                title="Keluar dari akun"
                className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Guest State */
            <>
              <Link
                href="/mitra/daftar"
                className="px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100/80 transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>Daftar Jadi Mitra</span>
              </Link>

              <div className="h-5 w-px bg-slate-300/80 my-auto" aria-hidden="true" />

              <Link
                href="/masuk"
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-800 hover:text-blue-600 hover:bg-slate-100/60 transition-colors cursor-pointer min-h-[44px] flex items-center"
              >
                Masuk
              </Link>

              <Link
                href="/daftar"
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold font-heading shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition-all duration-200 cursor-pointer min-h-[44px] flex items-center gap-1.5"
              >
                <span>Daftar Sekarang</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="lg:hidden p-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer (Glass Rounded) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/60 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col space-y-1 pb-3 border-b border-slate-200">
            <Link
              href="/cari"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Cari Mobil (Semua Armada Plat AB)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cara Kerja & Garansi Escrow</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            <a
              href="#titik-jemput"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Titik Penjemputan di Yogyakarta</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            <Link
              href="/mitra/daftar"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-xs font-bold text-amber-900 bg-amber-50/70 hover:bg-amber-100/80 flex items-center justify-between transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>Daftar Jadi Mitra Rental Jogja</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/masuk"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 rounded-2xl text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors min-h-[44px] flex items-center justify-center"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 rounded-2xl text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30 transition-colors min-h-[44px] flex items-center justify-center"
            >
              Daftar Akun
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
