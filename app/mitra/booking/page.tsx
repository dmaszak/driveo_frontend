"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MitraNav } from "@/components/mitra/mitra-nav";
import { useMitra } from "@/lib/store/mitra-store";
import { useBookingStore } from "@/lib/store/booking-store";
import { getSlaTimerInfo } from "@/lib/store/operational-store";
import { BookingStatus } from "@/types/domain";
import {
  ClipboardList,
  Clock,
  Car,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Calendar,
  MapPin,
  XCircle,
  Eye,
} from "lucide-react";

export default function MitraBookingPage() {
  const { profile } = useMitra();
  const { bookings, updateBookingStatus } = useBookingStore();

  const [activeTab, setActiveTab] = useState<string>("MENUNGGU_KONFIRMASI");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter bookings for this merchant
  const merchantBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.rentalId === profile.id || b.rentalId === "rental-tugu"
    );
  }, [bookings, profile.id]);

  // Tab counts
  const counts = useMemo(() => {
    let pending = 0;
    let ready = 0;
    let ongoing = 0;
    let completed = 0;
    let cancelled = 0;

    merchantBookings.forEach((b) => {
      if (b.status === "DIBAYAR_ESCROW") pending++;
      else if (b.status === "SIAP_SERAH_TERIMA") ready++;
      else if (b.status === "DALAM_SEWA") ongoing++;
      else if (b.status === "SELESAI") completed++;
      else if (b.status === "DIBATALKAN") cancelled++;
    });

    return {
      all: merchantBookings.length,
      pending,
      ready,
      ongoing,
      completed,
      cancelled,
    };
  }, [merchantBookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return merchantBookings.filter((b) => {
      const matchSearch =
        b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());

      let matchTab = true;
      if (activeTab === "MENUNGGU_KONFIRMASI") matchTab = b.status === "DIBAYAR_ESCROW";
      else if (activeTab === "SIAP_SERAH_TERIMA") matchTab = b.status === "SIAP_SERAH_TERIMA";
      else if (activeTab === "DALAM_SEWA") matchTab = b.status === "DALAM_SEWA";
      else if (activeTab === "SELESAI") matchTab = b.status === "SELESAI";
      else if (activeTab === "DIBATALKAN") matchTab = b.status === "DIBATALKAN";

      return matchSearch && matchTab;
    });
  }, [merchantBookings, searchQuery, activeTab]);

  const handleQuickApprove = (id: string, code: string) => {
    updateBookingStatus(id, "SIAP_SERAH_TERIMA");
    setToastMessage(`Pesanan ${code} berhasil disetujui! Unit dikunci untuk jadwal serah terima.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav currentTab="booking" />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>Portal Mitra</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 font-semibold">Manajemen Pesanan Masuk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pesanan Masuk & SLA Konfirmasi
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Pantau seluruh pesanan penyewa dari marketplace DriveO. Harap konfirmasi dalam batas waktu SLA 2 jam (FR-BOOKING-008).
            </p>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tabs & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode booking (mis. DVO-...), nama penyewa, plat nomor..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
              />
            </div>
          </div>

          {/* Filter Tabs Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 pt-3">
            {[
              { id: "MENUNGGU_KONFIRMASI", label: "Menunggu Konfirmasi", count: counts.pending, urgent: counts.pending > 0 },
              { id: "SIAP_SERAH_TERIMA", label: "Siap Serah Terima", count: counts.ready },
              { id: "DALAM_SEWA", label: "Sedang Dalam Sewa", count: counts.ongoing },
              { id: "SELESAI", label: "Selesai", count: counts.completed },
              { id: "DIBATALKAN", label: "Dibatalkan", count: counts.cancelled },
              { id: "ALL", label: "Semua Pesanan", count: counts.all },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer min-h-[40px] ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : tab.urgent
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Booking Cards List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tidak ada pesanan di kategori ini</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Semua pesanan masuk akan muncul di sini secara real-time dengan penghitung mundur SLA konfirmasi.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((bk) => {
              const sla = getSlaTimerInfo(bk.createdAt);
              const isPending = bk.status === "DIBAYAR_ESCROW";

              return (
                <div
                  key={bk.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 ${
                    isPending ? "border-amber-300 bg-amber-50/15" : "border-slate-200/80"
                  }`}
                >
                  {/* Left Column: Fleet & Order Basic */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={bk.vehicleThumbnail}
                        alt={bk.vehicleName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                      <div className="absolute bottom-1 left-1 bg-slate-950/90 text-white font-mono font-bold text-[9px] px-1 py-0.5 rounded">
                        {bk.licensePlate}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {bk.bookingCode}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {bk.serviceType.replace("_", " ")}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-slate-900">{bk.vehicleName}</h2>

                      <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                        <span>Penyewa: <strong className="text-slate-900">{bk.userName}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{bk.pickupSpotName}</span>
                        </span>
                        <span>•</span>
                        <span>Durasi: <strong>{bk.totalDays} Hari</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Escrow & Financial Info */}
                  <div className="flex flex-col text-left lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 w-full lg:w-auto">
                    <div className="flex items-center lg:justify-end gap-1.5 text-xs text-emerald-700 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Dana Ditahan Escrow: Rp {bk.paidAmount.toLocaleString("id-ID")}</span>
                    </div>

                    <span className="text-xs text-slate-500 mt-0.5">
                      Grand Total: <strong className="font-mono text-slate-900 text-sm">Rp {bk.grandTotal.toLocaleString("id-ID")}</strong>
                      {bk.remainingAmount > 0 && ` (Sisa Rp ${bk.remainingAmount.toLocaleString("id-ID")} di hari H)`}
                    </span>

                    {/* SLA Timer Badge */}
                    {isPending && (
                      <div className="mt-2 flex items-center lg:justify-end">
                        <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold font-mono inline-flex items-center gap-1 ${sla.badgeColor}`}>
                          <Clock className="w-3 h-3" />
                          <span>SLA Konfirmasi: {sla.label}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <a
                      href={`https://wa.me/62${bk.userPhone.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer min-h-[42px] flex items-center gap-1.5 text-xs font-semibold"
                      title="Hubungi penyewa via WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleQuickApprove(bk.id, bk.bookingCode)}
                        className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer min-h-[42px]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Setujui</span>
                      </button>
                    )}

                    <Link
                      href={`/mitra/booking/${bk.id}`}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 min-h-[42px]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Rincian</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
