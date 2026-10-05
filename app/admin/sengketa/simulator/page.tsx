"use client";

import React, { useState } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Scale, ShieldAlert, CheckCircle2, ChevronRight, Camera, FileText } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function DisputeSimulatorPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="sengketa" />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest mb-3">
            Fase 13 • Dispute Simulator
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Simulator Sengketa Mediasi</h1>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
            Menguji alur resolusi konflik: mulai dari pengajuan klaim oleh mitra, sanggahan penyewa, hingga investigasi moderator DriveO.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stepper Vertical */}
          <div className="space-y-3">
            {[
              { id: 1, title: "Mitra Ajukan Klaim", desc: "Input baret & bukti foto" },
              { id: 2, title: "Penyewa Sanggah", desc: "Pembelaan & foto serah terima" },
              { id: 3, title: "Investigasi Moderator", desc: "Perbandingan citra digital" },
              { id: 4, title: "Putusan Final", desc: "Eksekusi pelepasan dana" }
            ].map((s) => (
              <div 
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${step === s.id ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'}`}
              >
                <p className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-amber-400' : 'text-slate-500'}`}>Step 0{s.id}</p>
                <p className="text-xs font-bold text-white mt-1">{s.title}</p>
              </div>
            ))}
          </div>

          {/* Stage Detail Workspace */}
          <div className="lg:col-span-3 bg-slate-900 rounded-[32px] border border-slate-800 p-8 shadow-2xl">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3">
                  <Camera className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-black">Input Klaim Mitra Rental</h3>
                </div>
                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jenis Kerusakan</label>
                    <p className="text-sm font-bold text-white">Goresan Dalam Bumper Depan Kanan</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimasi Perbaikan</label>
                    <p className="text-sm font-bold text-amber-400">{formatRupiah(350000)}</p>
                  </div>
                  <div className="h-40 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-xs text-slate-600 font-mono italic">
                    [Preview Foto Kerusakan Diunggah Mitra]
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  Lanjut ke Sanggahan Penyewa <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 text-center py-10">
                <ShieldAlert className="w-16 h-16 text-blue-500 mx-auto opacity-20" />
                <h3 className="text-xl font-black">Penyewa Membantah Klaim</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto italic">
                  "Saya memiliki bukti foto saat serah terima bahwa goresan tersebut sudah ada sebelumnya. Saya menolak pemotongan deposit."
                </p>
                <button onClick={() => setStep(3)} className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mx-auto flex items-center gap-2">
                  Masuk ke Meja Investigasi <Scale className="w-4 h-4" />
                </button>
              </div>
            )}

            {step >= 3 && (
              <div className="text-center py-20">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-black">Workspace Simulasi Aktif</h3>
                <p className="text-sm text-slate-400">Simulator ini divalidasi dan terhubung ke Audit Log pusat.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
