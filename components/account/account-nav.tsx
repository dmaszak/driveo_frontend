"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/auth-store";
import {
  User as UserIcon,
  ShieldCheck,
  Lock,
  LogOut,
  Car,
  ChevronRight,
  Clock,
  AlertCircle,
  FileCheck2,
  Star,
  Bell,
} from "lucide-react";

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    {
      href: "/akun",
      label: "Profil & Informasi Akun",
      icon: UserIcon,
      exact: true,
    },
    {
      href: "/akun/verifikasi",
      label: "Verifikasi Identitas (e-KYC)",
      icon: FileCheck2,
      badge:
        user?.verificationStatus === "VERIFIED"
          ? "Aktif"
          : user?.verificationStatus === "MENUNGGU"
          ? "Diproses"
          : "Wajib",
      badgeColor:
        user?.verificationStatus === "VERIFIED"
          ? "bg-emerald-100 text-emerald-800"
          : user?.verificationStatus === "MENUNGGU"
          ? "bg-amber-100 text-amber-800"
          : "bg-red-100 text-red-800",
    },
    {
      href: "/akun/privasi",
      label: "Privasi & Perlindungan Data",
      icon: Lock,
    },
    {
      href: "/akun/ulasan",
      label: "Riwayat Ulasan & Reputasi",
      icon: Star,
    },
    {
      href: "/akun/notifikasi",
      label: "Preferensi Notifikasi",
      icon: Bell,
    },
  ];

  return (
    <div className="w-full lg:w-72 shrink-0 space-y-4">
      {/* User Mini Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border-2 border-white ring-2 ring-blue-500/20">
          {user ? user.name.charAt(0).toUpperCase() : "G"}
        </div>
        <h2 className="font-extrabold text-slate-950 text-base">
          {user ? user.name : "Tamu (Belum Masuk)"}
        </h2>
        <span className="text-xs text-slate-400 block mt-0.5 truncate">
          {user ? user.email : "Mode Pratinjau"}
        </span>

        {/* Verification Status Pill */}
        <div className="mt-3 flex justify-center">
          {user?.verificationStatus === "VERIFIED" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>e-KYC Terverifikasi</span>
            </span>
          ) : user?.verificationStatus === "MENUNGGU" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>e-KYC Sedang Ditinjau</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Belum Verifikasi e-KYC</span>
            </span>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="bg-white rounded-3xl border border-slate-200/90 p-3 shadow-sm space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-2 my-1 border-t border-slate-100">
          <Link
            href="/cari"
            className="flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Car className="w-4 h-4 text-slate-400" />
            <span>Katalog Armada Yogyakarta</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
