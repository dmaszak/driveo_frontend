"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MitraNav } from "@/components/mitra/mitra-nav";
import { useBookingStore } from "@/lib/store/booking-store";
import { useOperationalCalendar, getSlaTimerInfo } from "@/lib/store/operational-store";
import {
  ClipboardList,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  MessageSquare,
  Car,
  XCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function DetailBookingMitraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { bookings, updateBookingStatus } = useBookingStore();
  const { addCalendarBlock } = useOperationalCalendar();

  const booking = bookings.find((b) => b.id === resolvedParams.id);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("Kendala teknis mekanikal mendadak pada armada");
  const [rejectNotes, setRejectNotes] = useState("");
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <MitraNav currentTab="booking" />
        <main className="max-w-4xl mx-auto w-full px-4 py-16 text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Pesanan Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Pesanan dengan kode ini tidak terdaftar di sistem.
          </p>
          <Link
            href="/mitra/booking"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pesanan Masuk</span>
          </Link>
        </main>
      </div>
    );
  }

  const sla = getSlaTimerInfo(booking.createdAt);
  const isPending = booking.status === "DIBAYAR_ESCROW";

  const handleApprove = () => {
    updateBookingStatus(booking.id, "SIAP_SERAH_TERIMA");

    // Automatically sync lock in operational calendar
    addCalendarBlock({
      vehicleId: booking.vehicleId,
      vehiclePlate: booking.licensePlate,
      vehicleName: booking.vehicleName,
      rentalId: booking.rentalId,
      startDate: booking.startDate.split("T")[0],
      endDate: booking.endDate.split("T")[0],
      source: "DRIVEO_BOOKING",
      title: `Sewa Online: ${booking.userName}`,
      customerName: booking.userName,
      customerPhone: booking.userPhone,
      bookingId: booking.id,
      notes: `Titik jemput: ${booking.pickupSpotName}`,
    });

    setActionFeedback({
      type: "success",
      text: "Pesanan berhasil disetujui! Status diperbarui ke SIAP SERAH TERIMA dan jadwal otomatis terkunci di kalender.",
    });
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingStatus(booking.id, "DIBATALKAN");
    setShowRejectModal(false);
    setActionFeedback({
      type: "error",
      text: `Pesanan dibatalkan dengan alasan: "${rejectReason}". Dana escrow akan dikembalikan otomatis ke rekening penyewa.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav currentTab="booking" />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/mitra/booking" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Daftar Pesanan</span>
            </Link>
            <span>/</span>
            <span className="font-mono font-bold text-slate-800">{booking.bookingCode}</span>
          </div>

          <a
            href={`https://wa.me/62${booking.userPhone.replace(/^0/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat WhatsApp Penyewa</span>
          </a>
        </div>

        {/* Feedback Alert */}
        {actionFeedback && (
          <div
            className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              actionFeedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            {actionFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionFeedback.text}</span>
          </div>
        )}

        {/* SLA ALERT BANNER (If pending confirmation) */}
        {isPending && (
          <div className="p-4 sm:p-5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-amber-950">
                    Menunggu Konfirmasi Persetujuan Anda (SLA 2 Jam)
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                    FR-BOOKING-008
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5">
                  Dana telah aman disetor penyewa ke rekening Escrow DriveO. Segera setujui atau tolak pesanan ini.
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold font-mono bg-white text-amber-900 border border-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sisa Waktu Respons: {sla.label}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer min-h-[44px]"
              >
                Tolak Pesanan
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Setujui Pesanan</span>
              </button>
            </div>
          </div>
        )}

        {/* ORDER OVERVIEW CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: Profil Penyewa & Status e-KYC (FR-VERIFICATION-005) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Profil & e-KYC Penyewa</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
                {booking.userName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{booking.userName}</h3>
                <p className="text-xs text-slate-500 font-mono">{booking.userPhone}</p>
                <span className="text-[11px] text-slate-400 block truncate">{booking.userEmail}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  KTP Asli Terverifikasi
                </span>
                <span className="font-mono text-emerald-700 text-[11px]">347101******</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  SIM A Aktif
                </span>
                <span className="font-mono text-emerald-700 text-[11px]">Berlaku s.d. 2028</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border text-slate-600 text-[11px] space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Reputasi Penyewa:</span>
                  <span className="text-amber-600 font-mono">5.0 ★★★★★</span>
                </div>
                <p className="text-slate-500">Penyewa terpercaya dengan 4x transaksi selesai tanpa insiden di Jogja.</p>
              </div>
            </div>
          </div>

          {/* CARD 2: Armada & Titik Antar-Jemput */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Armada Mobil & Titik Temu</h2>
              </div>
              <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded">
                {booking.licensePlate}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative w-28 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <Image
                  src={booking.vehicleThumbnail}
                  alt={booking.vehicleName}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{booking.vehicleName}</h3>
                <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded inline-block">
                  Paket: {booking.serviceType.replace("_", " ")}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Durasi Sewa: <strong className="text-slate-800">{booking.totalDays} Hari</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  Mulai Sewa (Handover):
                </span>
                <span className="font-mono font-bold text-slate-900 block text-xs">
                  {new Date(booking.startDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })} WIB
                </span>
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {booking.pickupSpotName}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  Selesai Sewa (Pengembalian):
                </span>
                <span className="font-mono font-bold text-slate-900 block text-xs">
                  {new Date(booking.endDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })} WIB
                </span>
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {booking.pickupSpotName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIAL & ESCROW POSITION (BR-031) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Rincian Finansial & Garansi Escrow</h2>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              STATUS PEMBAYARAN: {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Tarif Sewa ({booking.totalDays} hari x Rp {booking.baseDailyRate.toLocaleString("id-ID")}):</span>
                <span className="font-mono text-slate-900 font-semibold">Rp {booking.rentalTotal.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Ongkos Antar Jemput:</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {booking.deliveryFee === 0 ? "Gratis (Rp 0)" : `Rp ${booking.deliveryFee.toLocaleString("id-ID")}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Deposit Jaminan (Refundable):</span>
                <span className="font-mono text-slate-900 font-semibold">Rp {booking.securityDeposit.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Grand Total Pesanan:</span>
                <span className="font-mono text-blue-600 text-base">Rp {booking.grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 block">Jaminan Escrow DriveO:</span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Penyewa telah menyetorkan sejumlah <strong>Rp {booking.paidAmount.toLocaleString("id-ID")}</strong> ({booking.paymentScheme === "FULL" ? "Pelunasan Penuh" : "Uang Muka 30%"}) via {booking.paymentMethod}. Dana ini ditahan aman di escrow platform dan otomatis dijadwalkan cair ke rekening merchant H+1 paska sewa selesai.
              </p>
              {booking.remainingAmount > 0 && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 font-semibold">
                  Sisa tagihan Rp {booking.remainingAmount.toLocaleString("id-ID")} wajib dilunasi penyewa on-platform saat serah terima hari H sebelum kunci diserahkan.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MODAL: Tolak Pesanan */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Penolakan Pesanan</h3>
              </div>

              <p className="text-xs text-slate-600">
                Menolak pesanan akan membatalkan pemesanan dan mengembalikan dana escrow ke penyewa. Pilih alasan baku:
              </p>

              <form onSubmit={handleReject} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Penolakan *</label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Kendala teknis mekanikal mendadak pada armada">Kendala teknis mekanikal mendadak pada armada</option>
                    <option value="Rute tujuan di luar batas jangkauan DIY">Rute tujuan di luar batas jangkauan DIY</option>
                    <option value="Jadwal bentrok dengan sewa offline WhatsApp">Jadwal bentrok dengan sewa offline WhatsApp</option>
                    <option value="Kriteria identitas penyewa tidak memenuhi syarat">Kriteria identitas penyewa tidak memenuhi syarat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan untuk Penyewa</label>
                  <textarea
                    rows={2}
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    placeholder="Mohon maaf atas ketidaknyamanannya..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                  >
                    Konfirmasi Tolak & Refund
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
