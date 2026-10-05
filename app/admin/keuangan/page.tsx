"use client";

import React, { useState } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { formatRupiah } from "@/lib/utils";
import { Wallet, ArrowDownRight, RefreshCcw, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AdminKeuanganPage() {
  const [retryFeedback, setRetryFeedback] = useState("");

  const handleRetryPayout = (ref: string) => {
    setRetryFeedback(`Proses retry transfer bank untuk ${ref} berhasil dipicu kembali via BI-FAST.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="keuangan" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 12 • Halaman #73, #74, #75
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Pusat Kontrol Escrow, Payout & Refund Manual
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitoring saldo rekening penampung escrow, jadwal pencairan H+1 mitra, dan penanganan refund gagal bayar.
          </p>
        </div>

        {retryFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{retryFeedback}</span>
          </div>
        )}

        {/* Top Escrow Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <Wallet className="w-6 h-6 text-blue-400" />
            <p className="text-xs font-bold text-slate-400 mt-3">Saldo Escrow Ditahan</p>
            <p className="text-2xl font-black text-white mt-1 font-mono">{formatRupiah(245000000)}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Rekening Penampung Virtual Terlisensi BI</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <ArrowDownRight className="w-6 h-6 text-amber-400" />
            <p className="text-xs font-bold text-slate-400 mt-3">Payout Terjadwal Besok (H+1)</p>
            <p className="text-2xl font-black text-white mt-1 font-mono">{formatRupiah(18400000)}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">14 Transaksi mitra selesai hari ini</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <p className="text-xs font-bold text-slate-400 mt-3">Tingkat Keberhasilan Payout</p>
            <p className="text-2xl font-black text-white mt-1 font-mono">99.8%</p>
            <span className="text-[11px] text-emerald-400 mt-1 block">API Perbankan Operasional Normal</span>
          </div>
        </div>

        {/* Payout Queue Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-white text-base">Antrean Payout Mitra Rental (H+1 Oversight)</h2>
            <span className="text-xs font-mono text-slate-400">Total 3 Transaksi Dalam Pantauan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3">Booking</th>
                  <th>Mitra Rental</th>
                  <th>Rekening Tujuan</th>
                  <th>Nominal Payout</th>
                  <th>Status</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800/60">
                  <td className="py-3 font-mono font-bold text-white">DVO-202610-8912</td>
                  <td>Tugu Rent Jogja</td>
                  <td>BCA •••• 7788</td>
                  <td className="font-mono font-bold text-emerald-400">{formatRupiah(1170000)}</td>
                  <td><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">TERJADWAL H+1</span></td>
                  <td className="text-right">
                    <button
                      onClick={() => handleRetryPayout("DVO-202610-8912")}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      Picu Sekarang
                    </button>
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
