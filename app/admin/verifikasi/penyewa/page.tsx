"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { ShieldCheck, XCircle, FileCheck2, User, Eye, CheckCircle2 } from "lucide-react";

export default function AdminVerifPenyewaPage() {
  const [selectedUser, setSelectedUser] = useState({
    name: "Budi Santoso",
    phone: "081234567890",
    email: "budi.santoso@gmail.com",
    nik: "3471012903940001",
    simNumber: "9403-1992-00012",
    simExpiry: "2028-11-20",
    status: "MENUNGGU",
  });

  const [feedback, setFeedback] = useState("");

  const handleApprove = () => {
    setSelectedUser((prev) => ({ ...prev, status: "VERIFIED" }));
    setFeedback("e-KYC (KTP & SIM A) berhasil disetujui penuh. Akun penyewa kini aktif.");
  };

  const handleReject = () => {
    setSelectedUser((prev) => ({ ...prev, status: "REJECTED" }));
    setFeedback("e-KYC ditolak dengan alasan foto KTP blur / tidak sesuai.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="verif-penyewa" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 11 • Halaman #62 & #64
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Meja Kerja Verifikasi e-KYC Penyewa
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Validasi keaslian dokumen KTP dan SIM A/C penyewa sesuai standar UU PDP & anti-penggelapan unit.
          </p>
        </div>

        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Queue List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h2 className="font-extrabold text-white text-sm">Antrean Masuk ({selectedUser.status === "MENUNGGU" ? 1 : 0})</h2>
            <div className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${selectedUser.status === "MENUNGGU" ? "bg-blue-600/10 border-blue-500/40 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{selectedUser.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                  {selectedUser.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">NIK: {selectedUser.nik}</p>
            </div>
          </div>

          {/* Document Workspace */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="font-extrabold text-white text-lg">{selectedUser.name}</h2>
                <p className="text-xs text-slate-400">{selectedUser.email} • {selectedUser.phone}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-500/20 text-blue-300">
                Status: {selectedUser.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400">Scan KTP Asli (Encrypted URL)</p>
                <div className="h-44 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center">
                  <FileCheck2 className="w-8 h-8 text-blue-400 mb-2" />
                  <span className="text-xs font-bold text-slate-200">KTP_Budi_Santoso_2026.jpg</span>
                  <span className="text-[10px] text-slate-500 mt-1">Signed URL Active (SEC-004)</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400">Scan SIM A Aktif</p>
                <div className="h-44 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center">
                  <User className="w-8 h-8 text-emerald-400 mb-2" />
                  <span className="text-xs font-bold text-slate-200">SIM_A_Budi_Santoso.jpg</span>
                  <span className="text-[10px] text-slate-500 mt-1">Berlaku s.d. {selectedUser.simExpiry}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold border border-rose-500/30 transition-colors cursor-pointer min-h-[44px]"
              >
                Tolak e-KYC
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Setujui e-KYC Penuh</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
