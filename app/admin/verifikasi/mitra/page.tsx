"use client";

import React, { useState } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Building2, ShieldCheck, CheckCircle2, FileText } from "lucide-react";

export default function AdminVerifMitraPage() {
  const [mitra, setMitra] = useState({
    name: "Merapi Rent Car Sleman",
    nib: "9120001829381",
    owner: "Agus Pramono",
    status: "MENUNGGU_VERIFIKASI",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="verif-mitra" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 11 • Halaman #63
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Verifikasi Legalitas NIB & Garasi Mitra Rental
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Peninjauan berkas Nomor Induk Berusaha (NIB) via OSS dan keabsahan garasi fisik di wilayah DIY.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-extrabold text-white text-lg">{mitra.name}</h2>
              <p className="text-xs text-slate-400 font-mono">NIB OSS: {mitra.nib} • Penanggung Jawab: {mitra.owner}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-500/20 text-amber-300">
              {mitra.status}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" /> Dokumen NIB OSS Terlampir
              </span>
              <p className="text-slate-400">KBLI 77110 (Aktivitas Penyewaan Mobil Tanpa Pengemudi)</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" /> Foto Garasi Fisik DIY
              </span>
              <p className="text-slate-400">Jl. Magelang Km 7.5, Mlati, Sleman, Yogyakarta</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setMitra(prev => ({ ...prev, status: "TERVERIFIKASI" }))}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Setujui Legalitas NIB & Terbitkan Badge</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
