"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  User, 
  Building2, 
  ShieldCheck, 
  PlayCircle, 
  ArrowRight, 
  Smartphone, 
  Search,
  Key,
  CreditCard,
  Camera,
  Scale,
  RefreshCw
} from "lucide-react";

const STAGES = [
  { id: 1, actor: "Penyewa", title: "Pencarian & Booking", desc: "Cari mobil di YIA, kunci slot, tanda tangan kontrak digital, & bayar DP." },
  { id: 2, actor: "Mitra", title: "Persetujuan SLA", desc: "Review e-KYC penyewa & setujui booking dalam 2 jam." },
  { id: 3, actor: "Check-in", title: "Serah Terima Unit", desc: "Ketemu di lokasi, lunas via QRIS, checklist bodi, & foto 4 sisi." },
  { id: 4, actor: "Check-out", title: "Pengembalian Unit", desc: "Mitra cek fisik, claim window deposit 24 jam aktif." },
  { id: 5, actor: "Sistem", title: "Cair Dana & Deposit", desc: "H+1 pencairan ke mitra, deposit balik ke penyewa." },
  { id: 6, actor: "Review", title: "Ulasan Reputasi", desc: "Saling memberi rating 1-5 bintang." }
];

export default function Fase13SimulasiPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [logs, setLogs] = useState(["[SYSTEM] Menyiapkan lingkungan simulasi E2E..."]);

  const runNextStep = () => {
    if (activeStep < 6) {
      const next = activeStep + 1;
      setActiveStep(next);
      setLogs(prev => [`[${STAGES[next-1].actor.toUpperCase()}] ${STAGES[next-1].title} berhasil disimulasikan.`, ...prev]);
    }
  };

  const resetSim = () => {
    setActiveStep(1);
    setLogs(["[SYSTEM] Simulasi diulang dari awal."]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
              D13
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 tracking-tight">Fase 13: E2E Simulator</h1>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Concierge MVP & Full Journey Validation</p>
            </div>
          </div>
          <button 
            onClick={resetSim}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Intro */}
        <div className="text-center space-y-2">
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200">
            Final Stage Build
          </span>
          <h2 className="text-3xl font-black text-slate-900">Validasi Siklus Transaksi DriveO</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Simulasikan alur end-to-end dari pencarian oleh penyewa hingga pencairan dana ke mitra untuk memastikan seluruh integrasi sistem berjalan mulus.
          </p>
        </div>

        {/* Visual Stepper */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
            {STAGES.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 relative overflow-hidden transition-all">
                {activeStep >= s.id && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${activeStep >= s.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                  {activeStep > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{s.actor}</p>
                  <p className="text-xs font-bold text-slate-900 leading-tight">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Card */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Active Detail */}
          <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">
                    Step {activeStep}: {STAGES[activeStep-1].title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {STAGES[activeStep-1].desc}
                  </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${activeStep === 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {activeStep === 6 ? 'Simulasi Selesai' : 'Aktif'}
                </div>
              </div>

              {/* Action Preview */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 min-h-[200px] flex flex-col items-center justify-center text-center space-y-4">
                {activeStep === 1 && <Search className="w-12 h-12 text-blue-600 opacity-20" />}
                {activeStep === 2 && <ShieldCheck className="w-12 h-12 text-blue-600 opacity-20" />}
                {activeStep === 3 && <Key className="w-12 h-12 text-blue-600 opacity-20" />}
                {activeStep === 4 && <Smartphone className="w-12 h-12 text-blue-600 opacity-20" />}
                {activeStep === 5 && <CreditCard className="w-12 h-12 text-blue-600 opacity-20" />}
                {activeStep === 6 && <CheckCircle2 className="w-12 h-12 text-emerald-600 opacity-20" />}
                
                <p className="text-sm font-medium text-slate-400 italic">
                  Preview antarmuka {STAGES[activeStep-1].actor} sedang dimuat dalam memori simulasi...
                </p>
              </div>

              {activeStep < 6 && (
                <button 
                  onClick={runNextStep}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
                >
                  <span>Simulasikan {STAGES[activeStep].title}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="lg:col-span-2 bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-slate-800 flex flex-col h-[500px]">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">E2E Activity Terminal</h3>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {logs.map((log, i) => (
                <div key={i} className={`${log.includes('[SYSTEM]') ? 'text-slate-500' : 'text-blue-300'}`}>
                   <span className="opacity-40 mr-2">{'>'}</span>
                   {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Disclaimer */}
        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900">Audit & Compliance Note</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Seluruh aktivitas dalam simulasi ini tetap dicatatkan ke dalam <strong>Audit Log (Halaman #78)</strong> dengan tag khusus <code className="bg-amber-100 px-1 rounded font-bold">SIMULATION_MODE</code> untuk keperluan kepatuhan operasional sebelum Go-Live.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
