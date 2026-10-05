"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck2,
  Users,
  Building2,
  Scale,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  LogOut,
  Car,
  Wallet,
  MessageSquare,
  History,
  Settings,
  ShieldAlert,
  CreditCard
} from "lucide-react";

export function AdminNav({ currentTab }: { currentTab?: string }) {
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { id: "verif-penyewa", label: "e-KYC", href: "/admin/verifikasi/penyewa", icon: FileCheck2 },
    { id: "verif-mitra", label: "Legalitas", href: "/admin/verifikasi/mitra", icon: Building2 },
    { id: "sengketa", label: "Sengketa", href: "/admin/sengketa", icon: ShieldAlert },
    { id: "keuangan", label: "Keuangan", href: "/admin/keuangan", icon: Wallet },
    { id: "support", label: "Helpdesk", href: "/admin/support", icon: MessageSquare },
    { id: "pengguna", label: "Pengguna", href: "/admin/pengguna", icon: Users },
    { id: "mitra", label: "Mitra", href: "/admin/mitra", icon: Building2 },
    { id: "audit", label: "Audit Log", href: "/admin/audit", icon: History },
    { id: "pengaturan", label: "Sistem", href: "/admin/pengaturan", icon: Settings },
  ];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
            DO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight">DriveO Pusat Komando</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                Backoffice
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Monitoring & Mediasi Terpusat Yogyakarta</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <span>Portal Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 py-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id || pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap min-h-[38px] transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
