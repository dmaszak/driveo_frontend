"use client";

import React, { useState } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function AdminPengaturanPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="pengaturan" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 12 • Halaman #79 & #80
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Pengaturan Parameter Sistem & Kebijakan Platform
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Konfigurasi tarif komisi escrow, SLA respons mitra rental (2 jam), dan batas waktu claim window deposit (24 jam).
          </p>
        </div>

        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="font-extrabold text-white text-base">Parameter Komisi & Transaksi</h2>
            <div className="space-y-3 text-xs">
              <label className="block text-slate-400">
                Komisi Platform (%)
                <input defaultValue="10" className="mt-1 w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              </label>
              <label className="block text-slate-400">
                Durasi Timer Pembayaran Escrow (Menit)
                <input defaultValue="15" className="mt-1 w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              </label>
              <label className="block text-slate-400">
                SLA Respons Persetujuan Mitra Rental (Jam)
                <input defaultValue="2" className="mt-1 w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              </label>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="font-extrabold text-white text-base">Kebijakan Deposit & Sengketa</h2>
            <div className="space-y-3 text-xs">
              <label className="block text-slate-400">
                Batas Waktu Klaim Kerusakan Mitra / Claim Window (Jam)
                <input defaultValue="24" className="mt-1 w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              </label>
              <label className="block text-slate-400">
                Toleransi Keterlambatan Pengembalian (Menit)
                <input defaultValue="30" className="mt-1 w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono" />
              </label>
              <button
                type="button"
                onClick={() => setFeedback("Parameter platform berhasil diperbarui dan diterapkan ke seluruh klaster sistem.")}
                className="w-full mt-4 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Parameter</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
