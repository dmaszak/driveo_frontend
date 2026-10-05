"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import { PaymentMethod } from "@/types/domain";
import {
  ShieldCheck,
  Lock,
  Unlock,
  ChevronRight,
  ArrowRight,
  QrCode,
  Building2,
  Copy,
  CheckCircle2,
  Clock,
  Car,
  AlertCircle,
  FileCheck2,
  Sparkles,
} from "lucide-react";

export default function BookingSettlementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getBookingById, settleRemainingPayment } = useBookings();

  const booking = useMemo(() => {
    return (
      getBookingById(resolvedParams.id) ||
      SAMPLE_BOOKINGS.find((b) => b.id === "bk-dp-demo-02") ||
      SAMPLE_BOOKINGS[0]
    );
  }, [resolvedParams.id, getBookingById]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [copiedVa, setCopiedVa] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const remainingToPay = booking.remainingAmount > 0 ? booking.remainingAmount : 0;
  const isAlreadySettled = booking.remainingAmount === 0;

  const vaNumber = useMemo(() => {
    if (paymentMethod === "VA_BCA") return "8277 0812 3456 7890";
    if (paymentMethod === "VA_MANDIRI") return "8962 0812 3456 7890";
    if (paymentMethod === "VA_BRI") return "1029 0812 3456 7890";
    return "8277 0812 3456 7890";
  }, [paymentMethod]);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      settleRemainingPayment(booking.id, paymentMethod);
      setIsProcessing(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        router.push(`/booking/${booking.id}/serah-terima`);
      }, 1500);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
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
          <span className="text-slate-900 font-semibold">Pelunasan On-Platform</span>
        </div>

        {/* Hard Gate Banner */}
        <div
          className={`rounded-3xl p-6 sm:p-7 border mb-8 transition-all ${
            isAlreadySettled
              ? "bg-emerald-50 border-emerald-200 text-emerald-950"
              : "bg-amber-50/80 border-amber-200/90 text-amber-950"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                isAlreadySettled ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
              }`}
            >
              {isAlreadySettled ? (
                <Unlock className="w-6 h-6" />
              ) : (
                <Lock className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isAlreadySettled
                      ? "bg-emerald-200/80 text-emerald-900"
                      : "bg-amber-200/80 text-amber-900"
                  }`}
                >
                  {isAlreadySettled ? "Gembok Terbuka (Unlocked)" : "Aturan Hard-Gate FR-HANDOVER-001"}
                </span>
                <span className="text-xs text-slate-500 font-medium">SOP Serah Terima DIY</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-2">
                {isAlreadySettled
                  ? "Tagihan Telah Lunas — Gembok Serah Terima Terbuka"
                  : "Pelunasan Sisa Biaya Sewa On-Platform"}
              </h1>
              <p className="text-sm mt-1 text-slate-600 leading-relaxed">
                {isAlreadySettled
                  ? "Seluruh kewajiban pembayaran telah masuk ke rekening penampung (Escrow). Anda dapat langsung membuka formulir digital inspeksi serah terima bersama staf rental."
                  : "Sesuai regulasi keamanan platform DriveO, kunci armada & form digital serah terima hanya dapat dibuka setelah pelunasan sisa sewa diselesaikan secara on-platform. Tidak diperbolehkan transaksi tunai liar di lokasi."}
              </p>
            </div>
          </div>
        </div>

        {/* Booking & Vehicle Summary */}
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
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 line-clamp-1">
                  {booking.vehicleName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mitra Pengelola: <span className="font-semibold text-slate-700">{booking.rentalName}</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
              <span className="text-xs text-slate-500 block">Kode Booking Transaksi</span>
              <span className="text-sm font-mono font-bold text-slate-900 tracking-wider">
                {booking.bookingCode}
              </span>
              <span className="text-xs text-emerald-600 font-medium block mt-0.5 flex sm:justify-end items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Escrow Proteksi
              </span>
            </div>
          </div>

          {/* Breakdown Perhitungan Pelunasan */}
          <div className="pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Rincian Perhitungan Pembayaran (Tabular)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Nilai Transaksi All-In</span>
                <span className="font-mono font-medium tabular-nums text-slate-900">
                  {formatRupiah(booking.grandTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-700 bg-emerald-50/60 px-3 py-2 rounded-xl">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  DP Telah Dibayar di Awal (Ditahan Escrow)
                </span>
                <span className="font-mono font-semibold tabular-nums">
                  - {formatRupiah(booking.paidAmount)}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base sm:text-lg font-bold text-slate-900">
                <span className="flex items-center gap-2">
                  <span>Sisa Wajib Pelunasan</span>
                  {!isAlreadySettled && (
                    <span className="text-xs font-normal text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Hari-H Serah Terima
                    </span>
                  )}
                </span>
                <span className="font-mono text-xl sm:text-2xl text-blue-600 tabular-nums">
                  {formatRupiah(remainingToPay)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isAlreadySettled ? (
          /* State jika sudah lunas */
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Pelunasan Berhasil Dikonfirmasi!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
              Dana sewa aman di rekening penampung. Formulir inspeksi fisik dan upload foto serah terima unit kini telah siap digunakan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/booking/${booking.id}/serah-terima`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>Buka Checklist Serah Terima Unit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/booking/${booking.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all cursor-pointer"
              >
                Kembali ke Detail Pesanan
              </Link>
            </div>
          </div>
        ) : (
          /* Form Pembayaran Pelunasan */
          <div className="space-y-8">
            {/* Pilihan Metode Bayar Hari-H */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Pilih Metode Pelunasan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Proses instan langsung terverifikasi oleh gateway perbankan
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA Verifikasi &lt; 30 Detik</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Opsi QRIS */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("QRIS")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    paymentMethod === "QRIS"
                      ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">QRIS Dinamis</span>
                        <span className="text-xs text-slate-500">BCA, Mandiri, GoPay, OVO, Dana</span>
                      </div>
                    </div>
                    {paymentMethod === "QRIS" && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Paling direkomendasikan untuk pelunasan di lokasi</span>
                  </div>
                </button>

                {/* Opsi Virtual Account BCA */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("VA_BCA")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    paymentMethod === "VA_BCA"
                      ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                        BCA
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">BCA Virtual Account</span>
                        <span className="text-xs text-slate-500">Transfer m-BCA / ATM</span>
                      </div>
                    </div>
                    {paymentMethod === "VA_BCA" && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Verifikasi otomatis dalam hitungan detik
                  </div>
                </button>

                {/* Opsi Virtual Account Mandiri */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("VA_MANDIRI")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    paymentMethod === "VA_MANDIRI"
                      ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                        MDR
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">Mandiri VA</span>
                        <span className="text-xs text-slate-500">Livin by Mandiri</span>
                      </div>
                    </div>
                    {paymentMethod === "VA_MANDIRI" && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Verifikasi otomatis dalam hitungan detik
                  </div>
                </button>

                {/* Opsi Virtual Account BRI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("VA_BRI")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    paymentMethod === "VA_BRI"
                      ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        BRI
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">BRIVA</span>
                        <span className="text-xs text-slate-500">BRImo / ATM BRI</span>
                      </div>
                    </div>
                    {paymentMethod === "VA_BRI" && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Verifikasi otomatis dalam hitungan detik
                  </div>
                </button>
              </div>

              {/* Tampilan Detail Instruksi Pembayaran */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                {paymentMethod === "QRIS" ? (
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shrink-0 text-center">
                      <div className="w-40 h-40 bg-slate-900 rounded-xl flex items-center justify-center text-white mx-auto relative overflow-hidden">
                        <QrCode className="w-32 h-32" />
                        <div className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-[9px] font-bold py-0.5 tracking-wider">
                          QRIS STANDAR BI
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                        REF: DVO-QR-{booking.bookingCode.slice(-4)}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 text-center sm:text-left">
                      <h4 className="text-base font-bold text-slate-900">
                        Scan QRIS untuk Pelunasan Langsung
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Buka aplikasi BCA Mobile, Livin, GoPay, OVO, atau ShopeePay Anda. Arahkan kamera ke QR di samping untuk melunasi{" "}
                        <span className="font-bold text-slate-900 font-mono tabular-nums">
                          {formatRupiah(remainingToPay)}
                        </span>
                        .
                      </p>
                      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-lg w-fit">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Rekening Penampung Resmi Escrow PT DriveO Nusantara</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
                    <span className="text-xs text-slate-500 block">Nomor Virtual Account Pelunasan</span>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xl sm:text-2xl font-mono font-bold text-slate-900 tracking-wider">
                        {vaNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(vaNumber.replace(/\s+/g, ""))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        {copiedVa ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin No. VA</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Total transfer tepat:{" "}
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {formatRupiah(remainingToPay)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sandbox Simulation Trigger */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                    <span>Mode Pengujian Interaktif (Demo Sandbox)</span>
                  </div>
                  <h4 className="text-lg font-bold">Simulasikan Konfirmasi Pelunasan</h4>
                  <p className="text-xs text-blue-200 mt-1 max-w-lg leading-relaxed">
                    Klik tombol di samping untuk mensimulasikan notifikasi webhook pelunasan berhasil dari payment gateway, membuka gembok serah terima, dan mengupdate status booking.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isProcessing || successAnimation}
                  onClick={handleSimulatePayment}
                  className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl shadow-lg transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Memproses Verifikasi...</span>
                  ) : successAnimation ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-slate-950" />
                      <span>Pelunasan Sukses! Mengalihkan...</span>
                    </>
                  ) : (
                    <>
                      <span>⚡ Simulasikan Pelunasan Sukses</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
