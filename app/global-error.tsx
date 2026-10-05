"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DriveO Global Error]:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Kesalahan Sistem Kritis
            </h1>
            <p className="text-xs text-slate-500">
              Terjadi kesalahan fatal pada modul dasar aplikasi.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      </body>
    </html>
  );
}


