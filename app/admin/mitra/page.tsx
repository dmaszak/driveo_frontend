"use client";

import { AdminNav } from "@/components/admin/admin-nav";
import { Building2, ShieldCheck } from "lucide-react";

export default function AdminMitraPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="mitra" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 11 • Halaman #66
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Master Data & Moderasi Mitra Rental DIY
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pengawasan usaha rental, skor kepatuhan armada Plat AB, dan kontrol kemitraan aktif.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-white text-base">Mitra Rental Terverifikasi DIY</h2>
            <span className="text-xs font-mono text-slate-400">Total: 24 Merchant</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3">Nama Rental</th>
                  <th>NIB OSS</th>
                  <th>Wilayah Garasi</th>
                  <th>Rating</th>
                  <th className="text-right">Status Kemitraan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800/60">
                  <td className="py-3 font-bold text-white">Tugu Rent Jogja</td>
                  <td className="font-mono">9120009981221</td>
                  <td>Kota Yogyakarta (Stasiun Tugu)</td>
                  <td className="text-amber-400">4.97 ★</td>
                  <td className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">AKTIF</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
