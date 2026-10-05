"use client";

import { useState, useMemo, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatRupiah } from "@/lib/utils";
import { PaymentMethod } from "@/types/domain";
import {
  ShieldCheck,
  Clock,
  QrCode,
  Building,
  CreditCard,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Lock,
  Info,
  Car,
} from "lucide-react";

export default function EscrowPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getBookingById, payBooking } = useBookings();

  // Find booking
  const booking = useMemo(() => {
    return getBookingById(resolvedParams.id) || SAMPLE_BOOKINGS[0];
  }, [resolvedParams.id, getBookingById]);

  // Selected Channel
  const [selectedChannel, setSelectedChannel] = useState<"QRIS" | "VA" | "CC">("QRIS");
  const [selectedVaBank, setSelectedVaBank] = useState<"BCA" | "MANDIRI" | "BNI" | "BRI">("BCA");
  const [isCopied, setIsCopied] = useState(false);

  // Timer state (15 mins countdown)
  const [timeLeft, setTimeLeft] = useState<number>(899);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getVaNumber = () => {
    switch (selectedVaBank) {
      case "BCA":
        return "88019 28374 61902";
      case "MANDIRI":
        return "89320 19283 74610";
      case "BNI":
        return "98801 82930 18273";
      case "BRI":
        return "12890 91823 48192";
    }
  };

  const handleCopyVa = () => {
    navigator.clipboard.writeText(getVaNumber().replace(/\s/g, ""));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleTriggerPaymentSuccess = (method: PaymentMethod) => {
    payBooking(booking.id, method);
    router.push(`/booking/${booking.id}/status-bayar`);
  };

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
          <span className="text-slate-500">Pemesanan</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Pembayaran Escrow DriveO</span>
        </div>

        {/* Stepper Progress */}
        <div className="mb-8 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black">
              ✓
            </span>
            <span>1. Checkout</span>
          </div>
          <div className="h-0.5 flex-1 bg-emerald-600 mx-4" />
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black">
              ✓
            </span>
            <span>2. Kontrak Sewa Digital</span>
          </div>
          <div className="h-0.5 flex-1 bg-blue-600 mx-4" />
          <div className="flex items-center gap-2 text-blue-700 font-extrabold">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">
              3
            </span>
            <span>3. Pembayaran Escrow</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7-COL: PAYMENT CHANNELS */}
          <div className="lg:col-span-7 space-y-6">
            {/* Countdown Strip */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Batas Waktu Pembayaran Tagihan:</span>
              </div>
              <div className="text-base font-mono font-black text-amber-400 tabular-nums">
                {formatTimer(timeLeft)}
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Pilih Kanal Pembayaran Resmi</span>
              </h2>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChannel("QRIS")}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedChannel === "QRIS"
                      ? "bg-blue-50 border-blue-600 text-blue-700 font-extrabold shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-slate-800" />
                  <span className="text-xs block">QRIS Instan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel("VA")}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedChannel === "VA"
                      ? "bg-blue-50 border-blue-600 text-blue-700 font-extrabold shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1 text-slate-800" />
                  <span className="text-xs block">Virtual Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel("CC")}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedChannel === "CC"
                      ? "bg-blue-50 border-blue-600 text-blue-700 font-extrabold shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-slate-800" />
                  <span className="text-xs block">Kartu Kredit/Debit</span>
                </button>
              </div>

              {/* CHANNEL 1: QRIS */}
              {selectedChannel === "QRIS" && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-rose-600 text-white">
                      QRIS NASIONAL
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Bank Indonesia / ASPI</span>
                  </div>

                  {/* QRIS Box Mockup */}
                  <div className="relative w-56 h-56 mx-auto bg-white p-4 rounded-3xl border-2 border-slate-900 shadow-md flex flex-col items-center justify-center">
                    <div className="w-full text-center pb-1 border-b border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-800 tracking-wider">
                        PT DRIVEO EKOSISTEM NUSANTARA
                      </span>
                    </div>

                    <div className="my-auto">
                      <QrCode className="w-36 h-36 text-slate-950" />
                    </div>

                    <div className="text-[9px] text-slate-400 font-mono">NMID: ID1026891238491</div>
                  </div>

                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Pindai QRIS menggunakan aplikasi m-banking (BCA, Mandiri, BRI, BNI) atau e-wallet (GoPay, OVO, Dana, ShopeePay).
                  </p>

                  <button
                    type="button"
                    onClick={() => handleTriggerPaymentSuccess("QRIS")}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>⚡ Simulasikan Pembayaran QRIS Sukses (Sandbox)</span>
                  </button>
                </div>
              )}

              {/* CHANNEL 2: VIRTUAL ACCOUNT */}
              {selectedChannel === "VA" && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {(["BCA", "MANDIRI", "BNI", "BRI"] as const).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedVaBank(b)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedVaBank === b
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        VA {b}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      Nomor Rekening Virtual Account ({selectedVaBank}):
                    </span>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg sm:text-xl font-mono font-black text-slate-950">
                        {getVaNumber()}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyVa}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Disalin!" : "Salin"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800">Petunjuk Pembayaran Transfer:</div>
                    <p className="text-[11px] text-slate-500">
                      1. Masuk ke m-banking {selectedVaBank} $\rightarrow$ Transfer $\rightarrow$ Virtual Account.
                      <br />
                      2. Masukkan nomor VA di atas. Nominal tagihan akan muncul otomatis sesuai Grand Total.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleTriggerPaymentSuccess(
                        selectedVaBank === "BCA"
                          ? "VA_BCA"
                          : selectedVaBank === "MANDIRI"
                          ? "VA_MANDIRI"
                          : "VA_BRI"
                      )
                    }
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>⚡ Simulasikan Pembayaran VA {selectedVaBank} Sukses</span>
                  </button>
                </div>
              )}

              {/* CHANNEL 3: CREDIT CARD */}
              {selectedChannel === "CC" && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nomor Kartu Kredit / Debit
                    </label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      defaultValue="4000 1234 5678 9010"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Masa Berlaku (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        defaultValue="12/28"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        defaultValue="891"
                        maxLength={3}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Dilindungi enkripsi 3D Secure dan Visa/Mastercard SecureCode.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTriggerPaymentSuccess("CREDIT_CARD")}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>⚡ Simulasikan Pembayaran Kartu Sukses</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5-COL: ORDER BREAKDOWN & ESCROW SHIELD */}
          <div className="lg:col-span-5 space-y-4 sticky top-28">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Ringkasan Tagihan Escrow
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                  {booking.bookingCode}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wider block">
                  Armada Yang Disewa
                </span>
                <h3 className="text-base font-black text-slate-950 mt-0.5">
                  {booking.vehicleName}
                </h3>
                <span className="text-xs text-slate-500">
                  Plat {booking.licensePlate} • Mitra {booking.rentalName}
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Sewa ({booking.totalDays} hari):</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatRupiah(booking.rentalTotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Biaya Antar ({booking.pickupSpotName}):</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {booking.deliveryFee === 0 ? "Gratis" : formatRupiah(booking.deliveryFee)}
                  </span>
                </div>

                {booking.securityDeposit > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>Deposit Garansi Kerusakan:</span>
                      <span className="text-[10px] text-emerald-600 font-bold">(Refundable)</span>
                    </span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {formatRupiah(booking.securityDeposit)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Total yang Dibayar Sekarang
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {booking.paymentScheme === "FULL" ? "100% Lunas" : "DP 30%"}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-blue-600 tabular-nums">
                    {formatRupiah(booking.paidAmount)}
                  </span>
                </div>
              </div>

              {/* Escrow Shield Notice */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Jaminan Rekening Penampung DriveO (BR-007)</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Uang Anda masuk ke rekening penampung resmi DriveO. Dana sewa hanya diteruskan ke mitra rental setelah kunci mobil diserahkan dan Anda menyetujui inspeksi serah terima.
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
