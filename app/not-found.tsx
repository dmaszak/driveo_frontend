"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  MapPin,
  Search,
  ArrowLeft,
  Home,
  ShieldCheck,
  Car,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/cari");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Brand Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
          <Car className="w-3.5 h-3.5" />
          <span>DriveO Yogyakarta • Kesalahan 404</span>
        </div>

        {/* Visual Badge */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin-slow" />
          </div>
          <span className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold shadow-xs">
            404
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Rute Tidak Ditemukan
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan, dinonaktifkan, atau alamat URL salah ketik. Mari kembali ke jalur perjalanan yang benar.
          </p>
        </div>

        {/* Search Bar Shortcut */}
        <form
          onSubmit={handleSearch}
          className="relative max-w-md mx-auto flex items-center shadow-xs rounded-2xl bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari armada (Innova, Brio, Avanza, YIA...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-28 py-3.5 text-xs sm:text-sm rounded-2xl bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer min-h-[36px]"
          >
            Cari Mobil
          </button>
        </form>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/cari"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors min-h-[44px]"
          >
            <Car className="w-4 h-4 text-slate-500" />
            <span>Jelajahi Katalog Sewa</span>
          </Link>
        </div>

        {/* Popular Destination Pills */}
        <div className="pt-6 border-t border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
            Destinasi Titik Jemput Populer di Jogja:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "Bandara Internasional YIA",
              "Stasiun Tugu Jogja",
              "Stasiun Lempuyangan",
              "Kawasan Malioboro",
              "Garasi Sleman",
            ].map((spot, idx) => (
              <Link
                key={idx}
                href={`/cari?lokasi=${encodeURIComponent(spot)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs font-medium text-slate-600 hover:text-blue-700 transition-colors shadow-2xs"
              >
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{spot}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Escrow Trust Micro-Badge */}
        <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transaksi Terlindungi Rekening Escrow DriveO • D.I. Yogyakarta</span>
        </div>
      </div>
    </div>
  );
}
