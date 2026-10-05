"use client";

import { AdminNav } from "@/components/admin/admin-nav";
import { History, ShieldCheck } from "lucide-react";

export default function AdminAuditPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="audit" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 12 • Halaman #78
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Penelusuran Log Audit Sistem (Immutable Audit Trail)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pencatatan seluruh transaksi uang, perubahan status booking, dan aktivitas verifikasi berstempel waktu WIB.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3">Waktu (WIB)</th>
                  <th>Aktor</th>
                  <th>Tindakan / Event</th>
                  <th>Entitas Terkait</th>
                  <th className="text-right">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: "05 Okt 2026, 11:20", actor: "SUPER_ADMIN", event: "Setujui e-KYC KTP & SIM A", entity: "usr-penyewa-01", ip: "182.253.140.21" },
                  { time: "05 Okt 2026, 10:15", actor: "SYSTEM_ESCROW", event: "Penerimaan DP Sewa Rp 1.550.000", entity: "DVO-202610-8912", ip: "Gateway IP" },
                ].map((log, idx) => (
                  <tr key={idx} className="border-b border-slate-800/60">
                    <td className="py-3 text-slate-400 font-mono">{log.time}</td>
                    <td><span className="font-bold text-blue-400 font-mono">{log.actor}</span></td>
                    <td className="font-medium text-white">{log.event}</td>
                    <td className="font-mono text-slate-400">{log.entity}</td>
                    <td className="text-right font-mono text-slate-500">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
