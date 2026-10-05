"use client";

import { useMemo, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  Clock,
  Car,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Download,
  Lock,
  Building,
  KeyRound,
} from "lucide-react";

export default function PaymentStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getBookingById } = useBookings();

  const booking = useMemo(() => {
    return getBookingById(resolvedParams.id) || SAMPLE_BOOKINGS[0];
  }, [resolvedParams.id, getBookingById]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-500">Pemesanan</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Status Pembayaran Escrow</span>
        </div>

        {/* SUCCESS ESCROW CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden mb-8">
          {/* Top Banner Green */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dana Berhasil Masuk Rekening Escrow DriveO</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Pembayaran Sewa Anda Berhasil!
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Uang Anda tersimpan aman di rekening penampung resmi. Mitra rental{" "}
                <strong>{booking.rentalName}</strong> telah menerima notifikasi dan sedang menyiapkan armada untuk serah terima di Yogyakarta.
              </p>
            </div>
          </div>

          {/* Escrow Process Visualizer (BR-007) */}
          <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
              Bagaimana Rekening Escrow Melindungi Transaksi Anda?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">
                      1
                    </span>
                    <span>Pembayaran</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Dana diterima di rekening resmi PT DriveO.
                  </p>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 mt-2 block">
                  ✓ Selesai
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    <span>Serah Terima</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Temu fisik & jalankan Checklist Digital 8-Titik.
                  </p>
                </div>
                <span className="text-[10px] font-extrabold text-blue-700 mt-2 block">
                  ● Langkah Selanjutnya
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between opacity-80">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-black">
                      3
                    </span>
                    <span>Pencairan Sewa</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Dana sewa diteruskan ke rental setelah kunci Anda terima.
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">Menunggu</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between opacity-80">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-black">
                      4
                    </span>
                    <span>Deposit Kembali</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Deposit 100% dikembalikan otomatis saat sewa selesai.
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">Menunggu</span>
              </div>
            </div>
          </div>

          {/* Transaction Receipt Details */}
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Rincian Bukti Transaksi</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kode Booking:</span>
                  <span className="font-mono font-bold text-slate-900">{booking.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Referensi:</span>
                  <span className="font-mono text-slate-700">
                    {booking.paymentRef || "QRIS-DVO-202610-8912"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Metode Pembayaran:</span>
                  <span className="font-bold text-slate-900">
                    {booking.paymentMethod || "QRIS Instan (Bank Indonesia)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Pembayaran:</span>
                  <span className="font-bold text-emerald-700">LUNAS / DANA DI ESCROW</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Armada:</span>
                  <span className="font-bold text-slate-900">{booking.vehicleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Titik Serah Terima:</span>
                  <span className="font-bold text-slate-900">{booking.pickupSpotName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Waktu Mulai:</span>
                  <span className="font-bold text-slate-900">
                    {formatIndonesianDate(booking.startDate)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-600 font-bold">Total Dibayar:</span>
                  <span className="font-black text-blue-700 text-sm tabular-nums">
                    {formatRupiah(booking.paidAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                ← Kembali ke Beranda
              </Link>

              <Link
                href={`/booking/${booking.id}/voucher`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <span>Lihat Tiket & Voucher Digital Sewa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
