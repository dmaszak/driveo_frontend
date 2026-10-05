"use client";

import { AdminNav } from "@/components/admin/admin-nav";
import { Users, ShieldCheck, Ban } from "lucide-react";

export default function AdminPenggunaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="pengguna" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 11 • Halaman #65
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Master Data & Manajemen Pengguna (Penyewa)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pencarian seluruh akun penyewa terdaftar beserta kontrol keamanan (suspend / blokir darurat).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-white text-base">Daftar Akun Penyewa</h2>
            <span className="text-xs font-mono text-slate-400">Total: 1,482 Pengguna</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3">Nama</th>
                  <th>Kontak</th>
                  <th>e-KYC Status</th>
                  <th>Total Sewa</th>
                  <th className="text-right">Aksi Keamanan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800/60">
                  <td className="py-3 font-bold text-white">Budi Santoso</td>
                  <td>081234567890</td>
                  <td><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">VERIFIED</span></td>
                  <td>4x Selesai</td>
                  <td className="text-right">
                    <button className="px-3 py-1 rounded bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30">Suspend</button>
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
