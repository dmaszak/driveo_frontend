"use client";

import { AdminNav } from "@/components/admin/admin-nav";
import { MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminSupportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminNav currentTab="support" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-3">
            FASE 12 • Halaman #76 & #77
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Helpdesk Layanan Pengaduan Konsumen (PP 80/2019)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kanal resmi penanganan komplain gagal bayar, unit mogok darurat di jalan, dan tiket bantuan pelanggan.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="font-extrabold text-white text-base">Tiket Pengaduan Terbuka</h2>
          <div className="space-y-3">
            {[
              { code: "CS-202610-091", user: "Hendra Kusuma", issue: "QRIS pembayaran sempat timeout namun saldo terpotong", status: "DIPROSES" },
              { code: "CS-202610-088", user: "Budi Santoso", issue: "Permintaan faktur sewa untuk keperluan kantor", status: "SELESAI" },
            ].map((t, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-400">{t.code}</span>
                    <span className="font-bold text-white">{t.user}</span>
                  </div>
                  <p className="text-slate-400 mt-1">{t.issue}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold font-mono text-[10px] ${t.status === "DIPROSES" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
