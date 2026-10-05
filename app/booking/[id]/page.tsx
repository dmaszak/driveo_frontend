"use client";

import { useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import {
  FileText,
  ShieldCheck,
  Calendar,
  Clock,
  Car,
  MapPin,
  ChevronRight,
  ArrowRight,
  Ticket,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  HelpCircle,
  Lock,
} from "lucide-react";

export default function BookingDetailPage({
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

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/booking" className="hover:text-blue-600 transition-colors">
            Riwayat Sewa
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">{booking.bookingCode}</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {booking.bookingCode}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DANA AMAN DI ESCROW</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  <span>SIAP SERAH TERIMA</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                Detail Transaksi & Pelacak Alur Sewa
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Dibuat pada {formatIndonesianDate(booking.createdAt)} • Mitra Rental:{" "}
                <strong>{booking.rentalName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href={`/booking/${booking.id}/voucher`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20"
              >
                <QrCode className="w-4 h-4" />
                <span>Buka Tiket Voucher</span>
              </Link>
            </div>
          </div>
        </div>

        {/* BOOKING LIFECYCLE TRACKER (8 LIFECYCLE STAGES) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-950">
              Pelacak Status Alur Sewa (Booking Lifecycle)
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Tahap 3 dari 6 Aktif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center mx-auto">
                ✓
              </span>
              <span className="font-extrabold text-emerald-900 block">1. Dipesan</span>
              <span className="text-[10px] text-emerald-700">Slot terkunci</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center mx-auto">
                ✓
              </span>
              <span className="font-extrabold text-emerald-900 block">2. Kontrak Sah</span>
              <span className="text-[10px] text-emerald-700">Ditandatangani</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center mx-auto">
                ✓
              </span>
              <span className="font-extrabold text-emerald-900 block">3. Dana di Escrow</span>
              <span className="text-[10px] text-emerald-700">Terlindungi 100%</span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-400 text-center space-y-1 shadow-xs">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center mx-auto animate-pulse">
                4
              </span>
              <span className="font-black text-blue-950 block">4. Serah Terima</span>
              <span className="text-[10px] text-blue-700 font-bold">Checklist 8-Titik</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1 opacity-60">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-black text-[10px] flex items-center justify-center mx-auto">
                5
              </span>
              <span className="font-bold text-slate-700 block">5. Masa Sewa</span>
              <span className="text-[10px] text-slate-500">Jelajah Jogja</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1 opacity-60">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-black text-[10px] flex items-center justify-center mx-auto">
                6
              </span>
              <span className="font-bold text-slate-700 block">6. Selesai</span>
              <span className="text-[10px] text-slate-500">Deposit Kembali</span>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7-COL: VEHICLE & SCHEDULE */}
          <div className="lg:col-span-7 space-y-6">
            {/* Vehicle Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Kendaraan Sewa Terdaftar</span>
              </h2>

              <div className="flex items-start gap-4">
                <div className="relative aspect-[16/10] w-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                  <Image src={booking.vehicleThumbnail} alt={booking.vehicleName} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-slate-950 text-base">{booking.vehicleName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900">
                      Plat {booking.licensePlate}
                    </span>
                    <span className="text-xs text-slate-500">
                      {booking.serviceType === "LEPAS_KUNCI" ? "Lepas Kunci" : "Dengan Supir"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <a
                      href={`https://wa.me/${booking.rentalPhone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-200"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hubungi Rental</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Waktu Mulai Sewa
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                    {formatIndonesianDate(booking.startDate)}
                  </span>
                  <span className="text-[11px] text-slate-500">09:00 WIB</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Waktu Pengembalian
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                    {formatIndonesianDate(booking.endDate)}
                  </span>
                  <span className="text-[11px] text-slate-500">Durasi: {booking.totalDays} Hari</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
                <span className="text-[10px] text-blue-900 font-bold uppercase block">
                  Titik Penjemputan di Yogyakarta:
                </span>
                <span className="font-extrabold text-blue-950 mt-0.5 block">
                  {booking.pickupSpotName}
                </span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Dokumen & Tindakan Terkait</h2>

              {/* Status-specific primary CTA */}
              {booking.remainingAmount > 0 ? (
                <Link
                  href={`/booking/${booking.id}/pelunasan`}
                  className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-between text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Bayar Pelunasan Sisa Sewa ({formatRupiah(booking.remainingAmount)})</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : booking.status === "DIBAYAR_ESCROW" || booking.status === "SIAP_SERAH_TERIMA" ? (
                <Link
                  href={`/booking/${booking.id}/serah-terima`}
                  className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-between text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span>Buka Digital Checklist Serah Terima Unit</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : booking.status === "DALAM_SEWA" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    href={`/booking/${booking.id}/pengembalian`}
                    className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-between text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Form Pengembalian Unit</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/booking/${booking.id}/perpanjang`}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-between text-xs shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Perpanjang Masa Sewa</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <Link
                  href={`/booking/${booking.id}/perjanjian`}
                  className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Perjanjian Sewa Digital</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href={`/booking/${booking.id}/voucher`}
                  className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-600" />
                    <span>Tiket & Voucher Sewa</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT 5-COL: IMMUTABLE FINANCIAL LEDGER (BR-031) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Ledger Keuangan Transaksi (BR-031)
                </span>
                <h3 className="font-black text-slate-950 text-sm mt-0.5">
                  Rincian Pembayaran Escrow
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Sewa ({booking.totalDays} hari):</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatRupiah(booking.rentalTotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Biaya Antar Unit:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {booking.deliveryFee === 0 ? "Gratis" : formatRupiah(booking.deliveryFee)}
                  </span>
                </div>

                {booking.securityDeposit > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>Deposit Garansi:</span>
                      <span className="text-[10px] text-emerald-600 font-bold">(Refundable)</span>
                    </span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {formatRupiah(booking.securityDeposit)}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                  <span>Total Tagihan:</span>
                  <span className="tabular-nums">{formatRupiah(booking.grandTotal)}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 block">
                      Sudah Masuk Escrow
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Ref: {booking.paymentRef || "QRIS-DVO-202610"}
                    </span>
                  </div>
                  <span className="text-xl font-black text-emerald-600 tabular-nums">
                    {formatRupiah(booking.paidAmount)}
                  </span>
                </div>
              </div>

              {/* Escrow Guarantee Strip */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 leading-tight">
                  Status: <strong>DANA AMAN DITAMPUNG</strong>. Dana sewa diteruskan ke rental saat serah terima, deposit dikembalikan otomatis saat sewa selesai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
