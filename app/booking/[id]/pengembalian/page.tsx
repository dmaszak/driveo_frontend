"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatIndonesianDate, formatRupiah } from "@/lib/utils";
import { ReturnData, HandoverInspectionPoint } from "@/types/domain";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Fuel,
  Gauge,
  ChevronRight,
  ArrowRight,
  Split,
  FileCheck2,
  Sparkles,
  Info,
  Scale,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function BookingReturnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getBookingById, saveReturn } = useBookings();

  const booking = useMemo(() => {
    return (
      getBookingById(resolvedParams.id) ||
      SAMPLE_BOOKINGS.find((b) => b.id === "bk-active-demo-03") ||
      SAMPLE_BOOKINGS[0]
    );
  }, [resolvedParams.id, getBookingById]);

  const isAlreadyReturned = booking.status === "SELESAI";

  // Initial values from Handover
  const initialFuel = booking.handoverData?.fuelLevel || "FULL";
  const initialOdo = booking.handoverData?.odometerKm || 24580;

  // Form states
  const [returnFuelLevel, setReturnFuelLevel] = useState<"FULL" | "3/4" | "1/2" | "1/4">("FULL");
  const [returnOdometerKm, setReturnOdometerKm] = useState<number>(initialOdo + 240);
  const [selectedPhotoTab, setSelectedPhotoTab] = useState<"front" | "back" | "right" | "left">("front");
  const [hasNewDamage, setHasNewDamage] = useState(false);
  const [damageNotes, setDamageNotes] = useState("");
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [agreedReturn, setAgreedReturn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  // Penalty calculations
  const OVERTIME_HOURLY_RATE = 50000;
  const FUEL_QUARTER_RATE = 75000;

  const overtimeFee = overtimeHours > 0 ? overtimeHours * OVERTIME_HOURLY_RATE : 0;

  const fuelPenaltyFee = useMemo(() => {
    const fuelRanks = { "1/4": 1, "1/2": 2, "3/4": 3, FULL: 4 };
    const initialRank = fuelRanks[initialFuel] || 4;
    const returnRank = fuelRanks[returnFuelLevel] || 4;
    const diff = initialRank - returnRank;
    return diff > 0 ? diff * FUEL_QUARTER_RATE : 0;
  }, [initialFuel, returnFuelLevel]);

  const totalDeductions = overtimeFee + fuelPenaltyFee;
  const depositRefundEstimate = Math.max(0, booking.securityDeposit - totalDeductions);

  const handoverPhotos = booking.handoverData?.photos || {
    front: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    back: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    right: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    left: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
  };

  const returnPhotos = {
    front: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    back: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    right: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    left: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedReturn) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const returnData: ReturnData = {
        returnedAt: new Date().toISOString(),
        fuelLevelReturn: returnFuelLevel,
        odometerKmReturn: returnOdometerKm,
        photosReturn: returnPhotos,
        inspectionPointsReturn: booking.handoverData?.inspectionPoints || [],
        isOvertime: overtimeHours > 0,
        overtimeHours,
        overtimeFee,
        fuelPenaltyFee,
        renterReturnSignature: booking.userName,
        partnerStaffReturnName: booking.handoverData?.partnerStaffName || "Agus Pratama",
        partnerReturnSignature: `${booking.handoverData?.partnerStaffName || "Agus Pratama"} (${booking.rentalName})`,
        hasDisputeClaim: hasNewDamage,
        depositReleaseDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      saveReturn(booking.id, returnData);
      setIsSubmitting(false);
      setSuccessSubmitted(true);
      setTimeout(() => {
        router.push(`/booking/${booking.id}`);
      }, 1500);
    }, 1000);
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
          <Link href="/booking" className="hover:text-blue-600 transition-colors">
            Riwayat Sewa
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/booking/${booking.id}`} className="hover:text-blue-600 transition-colors">
            {booking.bookingCode}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Inspeksi Pengembalian Unit</span>
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
              <span className="text-xs text-slate-500 block">Jadwal Selesai Perjanjian</span>
              <span className="text-xs font-semibold text-slate-900 block font-mono">
                {formatIndonesianDate(booking.endDate)}
              </span>
              <span className="text-xs text-emerald-600 font-medium block mt-1 flex sm:justify-end items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Deposit Jaminan: {formatRupiah(booking.securityDeposit)}
              </span>
            </div>
          </div>

          <div className="pt-6 flex items-start gap-3 text-xs text-slate-600 bg-blue-50/60 p-4 rounded-2xl border border-blue-100/80">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>SOP Pengembalian Unit (FR-RETURN-001..004):</strong> Cek kondisi bodi kendaraan berdampingan dengan foto saat serah terima. Jika tidak ada baret baru dan bahan bakar kembali sama, jaminan deposit akan otomatis dilepas penuh setelah jendela klaim 24 jam berakhir.
            </p>
          </div>
        </div>

        {isAlreadyReturned && booking.returnData ? (
          /* Read-only jika sudah dikembalikan */
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Pengembalian Unit Telah Selesai
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
              Unit telah diterima oleh staf mitra rental pada {formatIndonesianDate(booking.returnData.returnedAt)}. Jendela waktu klaim deposit 24 jam sedang berjalan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/booking/${booking.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-md transition-all cursor-pointer text-sm"
              >
                Kembali ke Detail Booking
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitReturn} className="space-y-8">
            {/* Bagian 1: Deteksi Keterlambatan / Overtime */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>1. Ketepatan Waktu Pengembalian (FR-RETURN-004)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Toleransi keterlambatan (Grace Period): 60 Menit gratis tanpa denda
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { hours: 0, label: "Tepat Waktu / Lebih Awal", sub: "Bebas Denda (0 Jam)" },
                  { hours: 1, label: "Terlambat 1 Jam", sub: "Masuk Toleransi Grace Period" },
                  { hours: 3, label: "Terlambat 3 Jam", sub: "Denda Rp 50.000 / Jam" },
                ].map((item) => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => setOvertimeHours(item.hours)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      overtimeHours === item.hours
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-slate-500 block mt-1">{item.sub}</span>
                    {item.hours > 1 && (
                      <span className="text-xs font-bold text-red-600 font-mono mt-2 block tabular-nums">
                        + {formatRupiah((item.hours - 1) * OVERTIME_HOURLY_RATE)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bagian 2: Fitur Side-by-Side Photo Comparison */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Split className="w-5 h-5 text-blue-600" />
                    <span>2. Komparasi Visual Side-by-Side (FR-RETURN-002)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bandingkan foto saat Serah Terima vs foto Pengembalian secara objektif
                  </p>
                </div>

                {/* Tab Pemilih Sudut Foto */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                  {(["front", "back", "right", "left"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSelectedPhotoTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        selectedPhotoTab === tab
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab === "front"
                        ? "Depan"
                        : tab === "back"
                        ? "Belakang"
                        : tab === "right"
                        ? "Kanan"
                        : "Kiri"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Foto Awal (Handover) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Foto Saat Serah Terima (Awal)</span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      TERVERIFIKASI
                    </span>
                  </div>
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                    <Image
                      src={handoverPhotos[selectedPhotoTab]}
                      alt="Handover View"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-2 text-white text-[10px] font-mono flex justify-between">
                      <span>BEFORE: HANDOVER</span>
                      <span>ORIGINAL</span>
                    </div>
                  </div>
                </div>

                {/* Foto Akhir (Return) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Foto Saat Pengembalian (Akhir)</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      LIVE CHECK
                    </span>
                  </div>
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                    <Image
                      src={returnPhotos[selectedPhotoTab]}
                      alt="Return View"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-2 text-white text-[10px] font-mono flex justify-between">
                      <span>AFTER: RETURN</span>
                      <span>FINAL CONDITION</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Kondisi Bodi Baru */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block mb-3">
                  Hasil Evaluasi Kondisi Fisik Bodi:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasNewDamage(false)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      !hasNewDamage
                        ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-5 h-5 ${!hasNewDamage ? "text-emerald-600" : "text-slate-400"}`}
                      />
                      <span className="text-xs font-bold text-slate-900">
                        Bodi Mulus & Bersih (Tanpa Baret Baru)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-7">
                      Deposit jaminan akan dilepas utuh 100% setelah claim window 24 jam.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasNewDamage(true)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      hasNewDamage
                        ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`w-5 h-5 ${hasNewDamage ? "text-amber-600" : "text-slate-400"}`}
                      />
                      <span className="text-xs font-bold text-slate-900">
                        Ditemukan Baret / Kerusakan Baru
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-7">
                      Deposit akan ditahan untuk mediasi verifikasi biaya perbaikan bengkel.
                    </p>
                  </button>
                </div>

                {hasNewDamage && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <label className="text-xs font-bold text-amber-900 block mb-1">
                      Catatan Rincian Kerusakan Baru:
                    </label>
                    <textarea
                      rows={2}
                      value={damageNotes}
                      onChange={(e) => setDamageNotes(e.target.value)}
                      placeholder="Jelaskan titik kerusakan, contoh: Lecet tergores pada pintu kanan bawah saat parkir."
                      className="w-full text-xs p-3 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bagian 3: Telemetri Bahan Bakar & Odometer Akhir */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-6">
                3. Bahan Bakar & Odometer Pengembalian
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Level Bensin */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-slate-900">
                        Indikator Bar Bensin Saat Kembali
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">Awal: {initialFuel}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {(["1/4", "1/2", "3/4", "FULL"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setReturnFuelLevel(lvl)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          returnFuelLevel === lvl
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  {fuelPenaltyFee > 0 && (
                    <div className="mt-3 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                      <span>Kekurangan Bahan Bakar:</span>
                      <span className="font-mono font-bold tabular-nums">
                        + {formatRupiah(fuelPenaltyFee)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Odometer Akhir */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-slate-900">Odometer Akhir (KM)</span>
                    </div>
                    <span className="text-xs text-slate-500">Awal: {initialOdo} KM</span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={returnOdometerKm}
                      onChange={(e) => setReturnOdometerKm(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:outline-none tabular-nums"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      KM
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    Jarak tempuh selama di Jogja:{" "}
                    <span className="font-bold text-slate-900 font-mono">
                      {Math.max(0, returnOdometerKm - initialOdo)} KM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian 4: Ringkasan Klaim Deposit & Rekap Pengembalian */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
                4. Rekapitulasi Jaminan Deposit (FR-DEPOSIT-002)
              </h2>

              <div className="space-y-3 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Jaminan Deposit Awal di Escrow</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatRupiah(booking.securityDeposit)}
                  </span>
                </div>

                {overtimeFee > 0 && (
                  <div className="flex justify-between items-center text-red-600">
                    <span>Denda Keterlambatan ({overtimeHours} Jam)</span>
                    <span className="font-mono font-semibold tabular-nums">
                      - {formatRupiah(overtimeFee)}
                    </span>
                  </div>
                )}

                {fuelPenaltyFee > 0 && (
                  <div className="flex justify-between items-center text-red-600">
                    <span>Biaya Pengisian Bahan Bakar</span>
                    <span className="font-mono font-semibold tabular-nums">
                      - {formatRupiah(fuelPenaltyFee)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-bold text-slate-900">
                  <span>Estimasi Deposit Dikembalikan ke Penyewa</span>
                  <span className="font-mono text-xl text-emerald-600 tabular-nums">
                    {formatRupiah(depositRefundEstimate)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedReturn}
                    onChange={(e) => setAgreedReturn(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Saya menyetujui hasil inspeksi pengembalian unit ini dan telah menyerahkan kembali kunci kendaraan kepada staf mitra rental. Saya memahami bahwa deposit jaminan akan diproses sesuai ketentuan sistem proteksi escrow DriveO.
                  </span>
                </label>
              </div>
            </div>

            {/* Tombol Submit Pengembalian */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link
                href={`/booking/${booking.id}`}
                className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all text-center cursor-pointer text-sm"
              >
                Batal & Kembali
              </Link>

              <button
                type="submit"
                disabled={!agreedReturn || isSubmitting || successSubmitted}
                className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Memproses Pengembalian Unit...</span>
                ) : successSubmitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Pengembalian Berhasil Diselesaikan!</span>
                  </>
                ) : (
                  <>
                    <span>Selesaikan Pengembalian & Rilis Deposit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
