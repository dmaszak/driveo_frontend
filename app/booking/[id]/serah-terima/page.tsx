"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatIndonesianDate, formatRupiah } from "@/lib/utils";
import { HandoverData, HandoverInspectionPoint } from "@/types/domain";
import {
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Upload,
  Fuel,
  Gauge,
  FileCheck2,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";

const DEFAULT_INSPECTION_POINTS = [
  { key: "front_bumper", label: "Bumper & Kap Mesin Depan", status: "GOOD" as const, notes: "" },
  { key: "right_side", label: "Pintu & Spion Sisi Kanan", status: "GOOD" as const, notes: "" },
  { key: "left_side", label: "Pintu & Spion Sisi Kiri", status: "GOOD" as const, notes: "" },
  { key: "back_bumper", label: "Bumper & Bagasi Belakang", status: "GOOD" as const, notes: "" },
  { key: "roof", label: "Atap & Kaca Depan/Belakang", status: "GOOD" as const, notes: "" },
  { key: "tires", label: "Kondisi 4 Ban & Velg Roda", status: "GOOD" as const, notes: "" },
  { key: "interior", label: "Kebersihan Interior & Jok", status: "GOOD" as const, notes: "" },
  { key: "emergency_kit", label: "Ban Serep, Dongkrak & Kotak P3K", status: "GOOD" as const, notes: "" },
];

export default function BookingHandoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getBookingById, saveHandover } = useBookings();

  const booking = useMemo(() => {
    return (
      getBookingById(resolvedParams.id) ||
      SAMPLE_BOOKINGS.find((b) => b.id === "bk-zenix-demo-01") ||
      SAMPLE_BOOKINGS[0]
    );
  }, [resolvedParams.id, getBookingById]);

  const isLockedDueToUnpaid = booking.remainingAmount > 0;
  const isAlreadyHandedOver = booking.status === "DALAM_SEWA" || booking.status === "SELESAI";

  // Form states
  const [inspectionPoints, setInspectionPoints] = useState(
    booking.handoverData?.inspectionPoints || DEFAULT_INSPECTION_POINTS
  );
  const [fuelLevel, setFuelLevel] = useState<"FULL" | "3/4" | "1/2" | "1/4">(
    booking.handoverData?.fuelLevel || "FULL"
  );
  const [odometerKm, setOdometerKm] = useState<number>(
    booking.handoverData?.odometerKm || 28450
  );
  const [photos, setPhotos] = useState(
    booking.handoverData?.photos || {
      front: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      back: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
      right: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      left: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    }
  );
  const [renterSignature, setRenterSignature] = useState(
    booking.handoverData?.renterSignature || booking.userName
  );
  const [partnerStaffName, setPartnerStaffName] = useState(
    booking.handoverData?.partnerStaffName || "Agus Wicaksono"
  );
  const [agreedChecklist, setAgreedChecklist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  const handlePointStatusChange = (index: number, status: "GOOD" | "ISSUE") => {
    setInspectionPoints((prev) =>
      prev.map((pt, i) => (i === index ? { ...pt, status } : pt))
    );
  };

  const handlePointNotesChange = (index: number, notes: string) => {
    setInspectionPoints((prev) =>
      prev.map((pt, i) => (i === index ? { ...pt, notes } : pt))
    );
  };

  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedChecklist) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const data: HandoverData = {
        inspectedAt: new Date().toISOString(),
        fuelLevel,
        odometerKm,
        photos,
        inspectionPoints,
        renterSignature,
        partnerStaffName,
        partnerSignature: `${partnerStaffName} (${booking.rentalName})`,
      };

      saveHandover(booking.id, data);
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
          <span className="text-slate-900 font-semibold">Digital Checklist Serah Terima</span>
        </div>

        {/* Lock Gate Warning if Unpaid */}
        {isLockedDueToUnpaid ? (
          <div className="bg-amber-50 border border-amber-300 rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-amber-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
              Gembok Handover Terkunci (FR-HANDOVER-001)
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-3">
              Pelunasan Sisa Sewa Wajib Dilakukan Terlebih Dahulu
            </h1>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
              Anda memilih skema DP 30% pada pemesanan ini. Sesuai Prosedur Standar Operasional (SOP) serah terima kendaraan di DIY, formulir inspeksi fisik dan kunci kendaraan hanya dapat dibuka setelah sisa tagihan sebesar{" "}
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {formatRupiah(booking.remainingAmount)}
              </span>{" "}
              dilunasi secara on-platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/booking/${booking.id}/pelunasan`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>Buka Pembayaran Pelunasan On-Platform</span>
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
          <div>
            {/* Header Status Card */}
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {booking.licensePlate}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Gembok Terbuka (Lunas)
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 line-clamp-1">
                      {booking.vehicleName}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mitra: <span className="font-semibold text-slate-700">{booking.rentalName}</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                  <span className="text-xs text-slate-500 block">Titik Serah Terima DIY</span>
                  <span className="text-xs font-semibold text-slate-900 block max-w-xs sm:ml-auto">
                    {booking.pickupSpotName}
                  </span>
                  <span className="text-[11px] text-blue-600 font-mono mt-1 block">
                    Kode Tiket: {booking.bookingCode}
                  </span>
                </div>
              </div>

              {/* Banner Panduan SOP Serah Terima */}
              <div className="pt-6 flex items-start gap-3 text-xs text-slate-600 bg-blue-50/60 p-4 rounded-2xl border border-blue-100/80">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>SOP Serah Terima Resmi DriveO (BR-015):</strong> Lakukan inspeksi fisik mobil bersama staf rental di lokasi penjemputan. Pastikan catatan lecet/baret difoto dan didokumentasikan sebelum menandatangani digital. Posisi bensin dan kilometer awal akan menjadi acuan saat unit dikembalikan.
                </p>
              </div>
            </div>

            {/* Read-Only State jika sudah pernah diserahterimakan */}
            {isAlreadyHandedOver && booking.handoverData && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-sm mb-8 text-emerald-950">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">
                      Kendaraan Telah Berhasil Diserahterimakan
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Inspeksi selesai pada {formatIndonesianDate(booking.handoverData.inspectedAt)}. Status saat ini:{" "}
                      <span className="font-bold uppercase tracking-wider">{booking.status}</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FORM INSPEKSI 8 TITIK */}
            <form onSubmit={handleSubmitHandover} className="space-y-8">
              {/* Bagian 1: 8 Titik Kondisi Bodi */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      1. Checklist Kondisi Fisik & Interior (8 Titik Wajib)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih status kondisi bersama staf rental di lokasi
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {inspectionPoints.filter((p) => p.status === "GOOD").length}/8 Titik Mulus
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inspectionPoints.map((point, index) => (
                    <div
                      key={point.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        point.status === "GOOD"
                          ? "border-slate-200 bg-white"
                          : "border-amber-300 bg-amber-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-900">
                          {index + 1}. {point.label}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={isAlreadyHandedOver}
                            onClick={() => handlePointStatusChange(index, "GOOD")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              point.status === "GOOD"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Mulus
                          </button>
                          <button
                            type="button"
                            disabled={isAlreadyHandedOver}
                            onClick={() => handlePointStatusChange(index, "ISSUE")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              point.status === "ISSUE"
                                ? "bg-amber-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Ada Catatan
                          </button>
                        </div>
                      </div>

                      {point.status === "ISSUE" && (
                        <div className="mt-3 pt-3 border-t border-amber-200/80">
                          <label className="text-[11px] font-medium text-amber-900 block mb-1">
                            Keterangan Baret/Lecet Awal:
                          </label>
                          <input
                            type="text"
                            disabled={isAlreadyHandedOver}
                            value={point.notes}
                            onChange={(e) => handlePointNotesChange(index, e.target.value)}
                            placeholder="Contoh: Baret halus 3cm di bawah spion"
                            className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian 2: Upload Foto Wajib 4 Sisi */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    2. Dokumentasi Foto Wajib 4 Sisi Kendaraan
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Foto asli kendaraan yang diambil di lokasi serah terima (bercap watermark digital DriveO)
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Tampak Depan", key: "front" as const, url: photos.front },
                    { label: "Tampak Belakang", key: "back" as const, url: photos.back },
                    { label: "Sisi Kanan", key: "right" as const, url: photos.right },
                    { label: "Sisi Kiri", key: "left" as const, url: photos.left },
                  ].map((side) => (
                    <div key={side.key} className="space-y-2">
                      <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
                        <Image
                          src={side.url}
                          alt={side.label}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-2 text-white">
                          <span className="text-[10px] font-mono tracking-tight block">
                            {side.label}
                          </span>
                          <span className="text-[8px] text-emerald-400 font-mono">
                            DRIVEO-VERIFIED
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 block text-center">
                        {side.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian 3: Telemetri BBM & Odometer */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    3. Telemetri Bahan Bakar & Odometer Awal
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kebijakan Same-to-Same (BR-015): Kembalikan bensin sesuai level saat serah terima
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Indikator Bahan Bakar */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-2 mb-3">
                      <Fuel className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-slate-900">
                        Indikator Bar Bensin Saat Serah Terima
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(["1/4", "1/2", "3/4", "FULL"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          disabled={isAlreadyHandedOver}
                          onClick={() => setFuelLevel(lvl)}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            fuelLevel === lvl
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-3 block">
                      Tingkat bahan bakar terpilih:{" "}
                      <span className="font-bold text-slate-900">{fuelLevel}</span>
                    </span>
                  </div>

                  {/* Input Odometer */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-2 mb-3">
                      <Gauge className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-slate-900">
                        Angka Odometer Speedometer (KM)
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        disabled={isAlreadyHandedOver}
                        value={odometerKm}
                        onChange={(e) => setOdometerKm(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:outline-none tabular-nums"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        KM
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-2 block">
                      Pastikan angka sesuai dengan odometer fisik di dashboard mobil
                    </span>
                  </div>
                </div>
              </div>

              {/* Bagian 4: Tanda Tangan Digital Dua Pihak */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    4. Konfirmasi & Tanda Tangan Digital Dua Pihak (FR-HANDOVER-004)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Persetujuan bersama antara Penyewa dan Staf Lapangan Mitra Rental
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Pihak Penyewa */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Pihak I — Penyewa
                    </span>
                    <span className="text-sm font-bold text-slate-900 block">
                      {booking.userName}
                    </span>
                    <div className="mt-4 p-4 bg-white border border-dashed border-slate-300 rounded-xl text-center">
                      <span className="text-xs font-mono font-semibold text-blue-600">
                        [DIGITAL SIGNATURE HASH]
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">
                        Disetujui oleh {renterSignature}
                      </p>
                    </div>
                  </div>

                  {/* Pihak Mitra Rental */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Pihak II — Staf Lapangan Mitra
                    </span>
                    <span className="text-sm font-bold text-slate-900 block">
                      {partnerStaffName} ({booking.rentalName})
                    </span>
                    <div className="mt-4 p-4 bg-white border border-dashed border-slate-300 rounded-xl text-center">
                      <span className="text-xs font-mono font-semibold text-emerald-600">
                        [VERIFIED STAFF CREDENTIAL]
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">
                        Disetujui oleh {partnerStaffName}
                      </p>
                    </div>
                  </div>
                </div>

                {!isAlreadyHandedOver && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedChecklist}
                        onChange={(e) => setAgreedChecklist(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        Saya mengonfirmasi bahwa seluruh 8 titik kondisi fisik, dokumentasi foto, dan level bahan bakar telah diperiksa bersama secara transparan. Saya menerima kunci mobil dan memulai masa sewa resmi di Yogyakarta.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Action Submit Button */}
              {!isAlreadyHandedOver && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <Link
                    href={`/booking/${booking.id}`}
                    className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all text-center cursor-pointer text-sm"
                  >
                    Batal & Kembali
                  </Link>

                  <button
                    type="submit"
                    disabled={!agreedChecklist || isSubmitting || successSubmitted}
                    className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Menyimpan Serah Terima...</span>
                    ) : successSubmitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span>Serah Terima Sukses! Memulai Sewa...</span>
                      </>
                    ) : (
                      <>
                        <span>Konfirmasi Serah Terima & Bawa Mobil</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Tombol pintas jika sudah dalam sewa */}
              {isAlreadyHandedOver && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link
                    href={`/booking/${booking.id}`}
                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-md transition-all text-center cursor-pointer text-sm"
                  >
                    Kembali ke Detail Pesanan
                  </Link>
                  <Link
                    href={`/booking/${booking.id}/pengembalian`}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md transition-all text-center cursor-pointer text-sm flex items-center justify-center gap-2"
                  >
                    <span>Lanjut ke Formulir Pengembalian Unit</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
