"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  HelpCircle,
  ShieldCheck,
  FileQuestion,
  Copy,
  Check,
} from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copiedId, setCopiedId] = useState(false);
  const incidentId = error.digest || `ERR-${Date.now().toString(36).toUpperCase()}`;

  useEffect(() => {
    // Log error to monitoring infrastructure (SRS NFR-OBS-001)
    console.error("[DriveO Error Boundary]:", error);
  }, [error]);

  const handleCopyId = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(incidentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Top Warning Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Gangguan Sementara • Penanganan Error Sistem</span>
        </div>

        {/* Visual Icon Container */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50/80 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
          </div>
          <span className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold shadow-xs">
            GAGAL
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Terjadi Kendala Teknis
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Sistem mendeteksi galat sementara saat memuat data ini. Seluruh saldo dana dan riwayat transaksi Anda tetap tersimpan aman di sistem Escrow.
          </p>
        </div>

        {/* Incident Correlation ID Card (SRS PP 80/2019 & Bab 13/15) */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs max-w-md mx-auto flex items-center justify-between gap-3 text-left">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ID Insiden / Laporan:
            </span>
            <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
              {incidentId}
            </span>
          </div>

          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer min-h-[36px]"
            title="Salin ID Laporan"
          >
            {copiedId ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        {/* Recovery Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Muat Ulang</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Customer Support Notice */}
        <div className="pt-6 border-t border-slate-200/60 flex items-center justify-center gap-2 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>
            Kendala terus berlanjut? Sertakan ID insiden di atas ke{" "}
            <Link href="/bantuan" className="text-blue-600 font-semibold hover:underline">
              Pusat Bantuan CS DriveO
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
