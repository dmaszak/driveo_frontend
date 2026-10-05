"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { formatRupiah } from "@/lib/utils";
import {
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Lock,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Building2,
  Users,
  Car,
  Star,
  Sparkles,
  HelpCircle,
  Clock,
} from "lucide-react";

export default function JadiMitraPage() {
  // Calculator state
  const [fleetSize, setFleetSize] = useState<number>(3);
  const [daysRentedPerMonth, setDaysRentedPerMonth] = useState<number>(18);
  const averageDailyRate = 500000; // Average rate in Jogja (e.g. Avanza/Xforce/Zenix mix)

  const monthlyGrossRevenue = fleetSize * daysRentedPerMonth * averageDailyRate;
  const platformFeePercentage = 0.08; // 8% fee
  const estimatedNetRevenue = monthlyGrossRevenue * (1 - platformFeePercentage);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16">
        {/* HERO SECTION */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Kemitraan Resmi Ekosistem Rental Yogyakarta</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Tingkatkan Utilisasi & Keamanan Armada Rental Anda di Yogyakarta
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Satu-satunya platform di D.I. Yogyakarta dengan verifikasi e-KYC berlapis (e-KTP & SIM A), rekening escrow terpercaya, dan checklist inspeksi digital 8-titik yang melindungi aset mobil Anda.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/daftar?tab=mitra"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-xl shadow-blue-600/30 cursor-pointer"
            >
              <span>Daftar Sebagai Mitra Rental</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#kalkulator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-sm transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Hitung Estimasi Pendapatan</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-slate-950 block tabular-nums">
                100%
              </span>
              <span className="text-xs text-slate-500 font-medium mt-1 block">
                Penyewa Terverifikasi e-KYC
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-blue-600 block tabular-nums">
                ≤ 1×24 Jam
              </span>
              <span className="text-xs text-slate-500 font-medium mt-1 block">
                Verifikasi NIB Kilat
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block tabular-nums">
                0 Kasus
              </span>
              <span className="text-xs text-slate-500 font-medium mt-1 block">
                Unit Dibawa Kabur
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 block tabular-nums">
                +45%
              </span>
              <span className="text-xs text-slate-500 font-medium mt-1 block">
                Rata-rata Kenaikan Okupansi
              </span>
            </div>
          </div>
        </section>

        {/* 4 PILLARS OF SECURITY & VALUE */}
        <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-2">
                Keamanan & Proteksi Hukum Terdepan
              </h2>
              <p className="text-2xl sm:text-3xl font-black text-slate-950">
                Mengapa Pemilik Rental di Yogyakarta Memilih DriveO?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  e-KYC Identitas Berlapis
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Penyewa diwajibkan validasi e-KTP dan SIM A asli dengan teknologi liveness check. Mencegah peminjaman fiktif dan risiko penggelapan unit.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Deposit Jaminan di Rekening Escrow
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Penyewa wajib menaruh deposit garansi sebelum kunci diserahkan. Jika terjadi lecet atau pelanggaran, dana kompensasi dijamin cair melalui mekanisme resmi.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Inspeksi Digital 8-Titik (BR-015)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Foto dan catatan bodi kendaraan saat serah terima tersimpan permanen di cloud dengan tanda tangan digital kedua pihak, berkekuatan hukum penuh.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Multi-Staff Backoffice Fleet
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Delegasikan tugas kepada Staf Operasional (serah terima unit) dan Staf Keuangan (rekap kas) tanpa memberikan akses password rahasia owner.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALCULATOR SECTION */}
        <section id="kalkulator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Simulasi Potensi Omset
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Kalkulator Pendapatan Mitra Rental DriveO
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Geser slider untuk menyesuaikan jumlah armada dan rata-rata hari tersewa Anda per bulan di area Yogyakarta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-slate-300">Jumlah Mobil yang Didaftarkan</span>
                    <span className="text-blue-400 text-sm tabular-nums">{fleetSize} Unit Mobil</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={fleetSize}
                    onChange={(e) => setFleetSize(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>1 Unit</span>
                    <span>20 Unit</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-slate-300">Estimasi Hari Tersewa per Bulan</span>
                    <span className="text-blue-400 text-sm tabular-nums">
                      {daysRentedPerMonth} Hari / Unit
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={28}
                    value={daysRentedPerMonth}
                    onChange={(e) => setDaysRentedPerMonth(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>5 Hari (Weekend saja)</span>
                    <span>28 Hari (Tinggi/Peak)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                  <div className="font-bold text-white mb-1">Catatan Asumsi Perhitungan:</div>
                  <p className="text-[11px] text-slate-400">
                    Berdasarkan rata-rata tarif harian armada populer di Yogyakarta (Rp 500.000/hari) dikurangi biaya platform 8% untuk perlindungan escrow & promosi wisatawan.
                  </p>
                </div>
              </div>

              {/* Result Display Box */}
              <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 text-center flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                    Estimasi Pendapatan Bersih Mitra
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2 tabular-nums">
                    {formatRupiah(estimatedNetRevenue)}
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">per bulan (Estimasi)</span>

                  <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400 flex justify-between">
                    <span>Omset Kotor:</span>
                    <span className="font-bold text-white tabular-nums">
                      {formatRupiah(monthlyGrossRevenue)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex justify-between mt-1">
                    <span>Biaya Platform (8%):</span>
                    <span className="font-semibold text-slate-300 tabular-nums">
                      - {formatRupiah(monthlyGrossRevenue * platformFeePercentage)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/daftar?tab=mitra"
                  className="mt-6 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-blue-600/30 cursor-pointer block"
                >
                  Mulai Daftarkan {fleetSize} Unit Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4-STEP ONBOARDING WORKFLOW */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-2">
              Alur Pendaftaran Mudah
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-950">
              4 Langkah Mudah Mulai Menerima Booking
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Buat Akun Mitra</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Daftar via formulir registrasi mitra dengan alamat email dan nomor WhatsApp bisnis aktif.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Unggah NIB & Legalitas</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lampirkan Nomor Induk Berusaha (NIB OSS-RBA) dan alamat garasi operasional di wilayah DIY.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Verifikasi Admin Kilat</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tim Verifikasi DriveO memvalidasi dokumen legalitas Anda maksimal dalam 1x24 jam kerja.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Tayangkan Armada</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unggah foto mobil Plat AB Anda, atur tarif all-in, dan terima booking wisatawan langsung!
              </p>
            </div>
          </div>
        </section>

        {/* PARTNER TESTIMONIALS */}
        <section className="py-16 bg-slate-100/70 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-slate-950">
                Dipercaya Puluhan Mitra Rental di Yogyakarta
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;Dulu paling was-was kalau ada yang sewa lepas kunci dari luar kota. Semenjak pakai DriveO, semua penyewa wajib lolos e-KYC KTP dan SIM A. Pembayaran sewa langsung cair tanpa ribet nagih-nagih.&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-bold text-slate-900 text-xs">Bambang Sudibyo</div>
                  <div className="text-[11px] text-slate-500">Owner Tugu Rent Jogja (642 Booking Selesai)</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;Fitur checklist digital 8-titik sangat membantu tim lapangan kami. Begitu mobil serah terima, foto bodi dan kondisi bensin langsung tercatat. Tidak ada lagi drama debat baret halus pas mobil kembali.&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="font-bold text-slate-900 text-xs">Agus Pratama</div>
                  <div className="text-[11px] text-slate-500">Operasional Sleman Auto Perkasa (388 Booking Selesai)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="mt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Siap Mengembangkan Bisnis Rental Anda Bersama DriveO?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto mb-6">
              Bergabunglah hari ini. Dapatkan verifikasi prioritas dan akses langsung ke ribuan wisatawan yang mencari mobil sewa di Yogyakarta setiap bulannya.
            </p>
            <Link
              href="/daftar?tab=mitra"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-blue-800 font-extrabold text-xs hover:bg-blue-50 transition-colors shadow-lg cursor-pointer"
            >
              <span>Daftar Jadi Mitra Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
