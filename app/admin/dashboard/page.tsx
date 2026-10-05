"use client";

import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { useAdminStore } from "@/lib/store/admin-store";
import { formatRupiah } from "@/lib/utils";
import { LayoutDashboard, Wallet, ShieldAlert, Car, Users, Building2, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { stats } = useAdminStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="dashboard" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 11 • PUSAT KOMANDO EKSEKUTIF
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Dashboard Eksekutif & Statistik Platform
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitoring real-time volume transaksi escrow DIY, rasio sengketa, dan antrean verifikasi mendesak.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 mt-4">Total Escrow Mengendap</p>
            <p className="text-2xl font-black text-white mt-1 font-mono">{formatRupiah(stats.totalEscrowBalance)}</p>
            <span className="text-[11px] text-emerald-400 font-semibold mt-2 inline-flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% minggu ini
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 mt-4">Transaksi Sewa Aktif</p>
            <p className="text-2xl font-black text-white mt-1 font-mono">{stats.activeTransactions} Unit</p>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Stasiun Tugu (60%) • Bandara YIA (40%)
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 mt-4">Rasio Sengketa (Dispute Rate)</p>
            <p className="text-2xl font-black text-white mt-1 font-mono">{stats.disputeRate}%</p>
            <span className="text-[11px] text-emerald-400 font-semibold mt-2 block">
              Di bawah batas toleransi platform (&lt; 3.0%)
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 mt-4">Rasio Armada Aktif</p>
            <p className="text-2xl font-black text-white mt-1 font-mono">{stats.activeFleetRatio}%</p>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Dari 320 total unit Plat AB terdaftar
            </span>
          </div>
        </div>

        {/* Quick Action Queues */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-extrabold text-white text-base">Antrean Verifikasi e-KYC Penyewa</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                {stats.pendingKycCount} Pending
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Permohonan verifikasi KTP & SIM A/C baru yang membutuhkan tinjauan manual verifikator (SLA ≤ 30 menit).
            </p>
            <div className="space-y-2">
              {[
                { name: "Budi Santoso", nik: "347101******82", time: "10 menit lalu" },
                { name: "Dewi Lestari", nik: "340405******12", time: "25 menit lalu" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-slate-400 font-mono text-[11px]">NIK: {item.nik} • {item.time}</p>
                  </div>
                  <Link
                    href="/admin/verifikasi/penyewa"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Tinjau
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-extrabold text-white text-base">Antrean Legalitas Mitra Rental Baru</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                {stats.pendingMitraCount} Pending
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pengajuan kemitraan merchant rental baru dengan pengecekan NIB OSS dan foto fisik garasi di wilayah DIY.
            </p>
            <div className="space-y-2">
              {[
                { rental: "Merapi Rent Car Sleman", nib: "9120001829381", time: "1 jam lalu" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{item.rental}</p>
                    <p className="text-slate-400 font-mono text-[11px]">NIB: {item.nib} • {item.time}</p>
                  </div>
                  <Link
                    href="/admin/verifikasi/mitra"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Tinjau NIB
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
