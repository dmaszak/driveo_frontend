"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { useDisputes } from "@/lib/store/dispute-store";
import { formatRupiah } from "@/lib/utils";
import { ShieldAlert, Scale, CheckCircle2, AlertTriangle, Eye, ArrowRight } from "lucide-react";

export default function AdminSengketaPage() {
  const { disputes } = useDisputes();
  const [selectedDispute, setSelectedDispute] = useState(disputes[0]);
  const [verdictFeedback, setVerdictFeedback] = useState("");

  const handleResolveSplit = () => {
    setVerdictFeedback("Putusan Mediasi mengikat: Deposit dibagi split (Rp 125.000 ke penyewa, Rp 25.000 ke mitra). Dana otomatis dilepas oleh escrow.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="sengketa" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
            FASE 12 • Halaman #71 & #72
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Pusat Mediasi Sengketa & Investigasi Deposit
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Evaluasi bukti perbandingan foto inspeksi, log BBM/odometer, dan eksekusi putusan mediasi mengikat.
          </p>
        </div>

        {verdictFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{verdictFeedback}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Dispute List Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h2 className="font-extrabold text-white text-sm">Kasus Sengketa Aktif ({disputes.length})</h2>
            <div className="space-y-2">
              {disputes.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDispute(d)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedDispute.id === d.id
                      ? "bg-amber-500/10 border-amber-500/40 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{d.ticketCode}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white mt-1">{d.vehicleName}</p>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">Klaim: {formatRupiah(d.claimedAmount)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute Workspace Detail */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{selectedDispute.ticketCode}</span>
                <h2 className="font-extrabold text-white text-lg mt-0.5">{selectedDispute.vehicleName}</h2>
                <p className="text-xs text-slate-400">Rental: {selectedDispute.rentalName} • Booking: {selectedDispute.bookingCode}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Nominal Deposit Diklaim</span>
                <span className="text-xl font-mono font-bold text-amber-400">{formatRupiah(selectedDispute.claimedAmount)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Keterangan Pengaduan</h3>
              <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                {selectedDispute.description}
              </p>
            </div>

            {/* Photo Comparison Side-by-Side */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Investigasi Citra Side-by-Side</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-[11px] font-bold text-blue-400 block">Foto Saat Serah Terima (Awal)</span>
                  <div className="h-36 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-500 font-mono">
                    Foto Bumper Kanan (Baret Ringan 70%)
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 block">Foto Saat Pengembalian (Akhir)</span>
                  <div className="h-36 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-500 font-mono">
                    Foto Bumper Kanan (Goresan Sama)
                  </div>
                </div>
              </div>
            </div>

            {/* Mediator Verdict Controls */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white">Eksekusi Putusan Mediasi Independen DriveO</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Putusan bersifat final dan mengikat. Escrow akan otomatis mencairkan dana deposit sesuai alokasi putusan.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleResolveSplit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer"
                >
                  Split Biaya Poles (Rp 25rb Mitra / Rp 125rb Renter)
                </button>
                <button
                  type="button"
                  onClick={() => setVerdictFeedback("Deposit dicairkan 100% penuh kembali ke rekening penyewa.")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer"
                >
                  Cairkan 100% ke Penyewa
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
