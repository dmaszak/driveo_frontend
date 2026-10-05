"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatIndonesianDate, formatRupiah } from "@/lib/utils";
import { PaymentMethod } from "@/types/domain";
import {
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  QrCode,
  Building2,
  Sparkles,
  Info,
} from "lucide-react";

export default function BookingExtensionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getBookingById, extendBooking } = useBookings();

  const booking = useMemo(() => {
    return (
      getBookingById(resolvedParams.id) ||
      SAMPLE_BOOKINGS.find((b) => b.id === "bk-active-demo-03") ||
      SAMPLE_BOOKINGS[0]
    );
  }, [resolvedParams.id, getBookingById]);

  // Extension options (+1, +2, +3 days)
  const [extraDays, setExtraDays] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Calculate new end date
  const currentEnd = new Date(booking.endDate);
  const newEndDate = useMemo(() => {
    const next = new Date(currentEnd);
    next.setDate(next.getDate() + extraDays);
    return next.toISOString();
  }, [currentEnd, extraDays]);

  const additionalCost = extraDays * booking.baseDailyRate;

  const handleConfirmExtension = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      extendBooking(booking.id, newEndDate, extraDays, additionalCost);
      setIsProcessing(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        router.push(`/booking/${booking.id}`);
      }, 1500);
    }, 1200);
  };

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
          <Link href="/booking" className="hover:text-blue-600 transition-colors">
            Riwayat Sewa
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/booking/${booking.id}`} className="hover:text-blue-600 transition-colors">
            {booking.bookingCode}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Perpanjangan Sewa</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <Image
                  src={booking.vehicleThumbnail}
                  alt={booking.vehicleName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {booking.licensePlate}
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 line-clamp-1">
                  {booking.vehicleName}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mitra: <span className="font-semibold text-slate-700">{booking.rentalName}</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
              <span className="text-xs text-slate-500 block">Jadwal Selesai Saat Ini</span>
              <span className="text-xs font-semibold text-slate-900 block font-mono">
                {formatIndonesianDate(booking.endDate)}
              </span>
              <span className="text-xs text-emerald-600 font-medium block mt-1 flex sm:justify-end items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Unit Tersedia Diperpanjang
              </span>
            </div>
          </div>

          <div className="pt-6 flex items-start gap-3 text-xs text-slate-600 bg-blue-50/60 p-4 rounded-2xl border border-blue-100/80">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Ketentuan Perpanjangan Sewa (BR-034):</strong> Permohonan perpanjangan on-platform dapat diajukan selama unit belum dipesan oleh penyewa lain pada kalender ketersediaan mitra rental. Tarif dihitung harian proporsional tanpa denda penalti.
            </p>
          </div>
        </div>

        {/* Form Perpanjangan */}
        <form onSubmit={handleConfirmExtension} className="space-y-8">
          {/* Pilih Durasi Tambahan */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              1. Pilih Durasi Tambahan Sewa
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Pilih jumlah hari tambahan yang Anda butuhkan untuk menjelajahi Yogyakarta
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { days: 1, label: "+1 Hari Tambahan", desc: "Perpanjang hingga 24 jam ke depan" },
                { days: 2, label: "+2 Hari Tambahan", desc: "Paling hemat untuk trip akhir pekan" },
                { days: 3, label: "+3 Hari Tambahan", desc: "Eksplorasi Gunungkidul & Kulon Progo" },
              ].map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setExtraDays(opt.days)}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    extraDays === opt.days
                      ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <span className="text-sm font-bold text-slate-900 block">{opt.label}</span>
                  <span className="text-xs text-slate-500 block mt-1">{opt.desc}</span>
                  <span className="text-sm font-bold text-blue-600 font-mono mt-3 block tabular-nums">
                    + {formatRupiah(opt.days * booking.baseDailyRate)}
                  </span>
                  {extraDays === opt.days && (
                    <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Perbandingan Jadwal Lama vs Baru */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Jadwal Selesai Awal:</span>
                <span className="text-sm font-bold text-slate-700 block mt-1">
                  {formatIndonesianDate(booking.endDate)}
                </span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-xs text-emerald-800 font-semibold block">
                  Jadwal Selesai Baru Setelah Perpanjangan:
                </span>
                <span className="text-sm font-bold text-emerald-950 block mt-1">
                  {formatIndonesianDate(newEndDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Rincian Tagihan Tambahan */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              2. Rincian Tagihan Biaya Tambahan
            </h2>

            <div className="space-y-3 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-slate-600">
                <span>
                  Tarif Sewa Harian ({extraDays} Hari x {formatRupiah(booking.baseDailyRate)})
                </span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {formatRupiah(additionalCost)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Deposit Jaminan Tambahan</span>
                <span className="font-mono font-medium text-emerald-600">
                  Rp 0 (Menggunakan deposit awal)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Biaya Layanan Platform Escrow</span>
                <span className="font-mono font-medium text-emerald-600">Rp 0 (Gratis)</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-bold text-slate-900">
                <span>Total Tagihan Perpanjangan</span>
                <span className="font-mono text-xl text-blue-600 tabular-nums">
                  {formatRupiah(additionalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Metode Bayar Tambahan */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              3. Kanal Pembayaran Tagihan Tambahan
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Dana akan langsung diteruskan ke rekening penampung escrow
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("QRIS")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === "QRIS"
                    ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">QRIS Dinamis</span>
                    <span className="text-xs text-slate-500">Scan instan</span>
                  </div>
                </div>
                {paymentMethod === "QRIS" && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("VA_BCA")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === "VA_BCA"
                    ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    BCA
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">BCA Virtual Account</span>
                    <span className="text-xs text-slate-500">Transfer otomatis</span>
                  </div>
                </div>
                {paymentMethod === "VA_BCA" && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Link
              href={`/booking/${booking.id}`}
              className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all text-center cursor-pointer text-sm"
            >
              Batal & Kembali
            </Link>

            <button
              type="submit"
              disabled={isProcessing || successAnimation}
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Memproses Perpanjangan...</span>
              ) : successAnimation ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Perpanjangan Sukses Dikonfirmasi!</span>
                </>
              ) : (
                <>
                  <span>Bayar {formatRupiah(additionalCost)} & Konfirmasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
