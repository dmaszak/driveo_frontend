"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMitra } from "@/lib/store/mitra-store";
import {
  Car,
  Tag,
  Calendar,
  ClipboardList,
  Wallet,
  Settings,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Plus,
  LayoutDashboard,
  Users,
} from "lucide-react";

interface MitraNavProps {
  currentTab?: "dashboard" | "kendaraan" | "listing" | "kalender" | "booking" | "pesanan" | "staf" | "keuangan" | "pengaturan";
  actionButton?: React.ReactNode;
}

export function MitraNav({ currentTab, actionButton }: MitraNavProps) {
  const pathname = usePathname();
  const { profile } = useMitra();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/mitra/dashboard",
      icon: LayoutDashboard,
      activePattern: /^\/mitra\/dashboard/,
    },
    {
      id: "kendaraan",
      label: "Armada Plat AB",
      href: "/mitra/kendaraan",
      icon: Car,
      activePattern: /^\/mitra\/kendaraan/,
    },
    {
      id: "listing",
      label: "Listing Marketplace",
      href: "/mitra/listing",
      icon: Tag,
      activePattern: /^\/mitra\/listing/,
    },
    {
      id: "kalender",
      label: "Kalender Matrix",
      href: "/mitra/kalender",
      icon: Calendar,
      activePattern: /^\/mitra\/kalender/,
    },
    {
      id: "booking",
      label: "Pesanan Masuk",
      href: "/mitra/booking",
      icon: ClipboardList,
      activePattern: /^\/mitra\/(booking|pesanan)/,
    },
    {
      id: "staf",
      label: "Manajemen Staf",
      href: "/mitra/staf",
      icon: Users,
      activePattern: /^\/mitra\/staf/,
    },
    {
      id: "pengaturan",
      label: "Profil & Garasi",
      href: "/mitra/verifikasi",
      icon: Settings,
      activePattern: /^\/mitra\/verifikasi/,
    },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      {/* Top Bar: Merchant Identity & Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            {profile.businessName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {profile.businessName}
              </h1>
              {profile.verificationStatus === "TERVERIFIKASI" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  NIB OSS Terverifikasi
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span>{profile.city} ({profile.district})</span>
              <span>•</span>
              <span className="font-mono text-slate-600">NIB {profile.nibNumber}</span>
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {actionButton}
          <Link
            href="/cari"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors min-h-[38px]"
          >
            <span>Lihat Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 py-1.5">
          {navItems.map((item) => {
            const isActive = currentTab
              ? currentTab === item.id
              : item.activePattern.test(pathname);
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all min-h-[44px] ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
