"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { MitraNav } from "@/components/mitra/mitra-nav";
import { useMitra } from "@/lib/store/mitra-store";
import { useMitraVehicles, useMitraListings, getStnkTaxStatus, getFreshnessInfo } from "@/lib/store/vehicle-store";
import { useBookingStore } from "@/lib/store/booking-store";
import { getSlaTimerInfo } from "@/lib/store/operational-store";
import {
  LayoutDashboard,
  Clock,
  Car,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Plus,
  Tag,
  Users,
  ExternalLink,
} from "lucide-react";

export default function MitraDashboardPage() {
  const { profile } = useMitra();
  const { vehicles } = useMitraVehicles();
  const { listings } = useMitraListings();
  const { bookings } = useBookingStore();

  // Filter bookings for this merchant
  const merchantBookings = useMemo(() => {
    return bookings.filter((b) => b.rentalId === profile.id || b.rentalId === "rental-tugu");
  }, [bookings, profile.id]);

  // Compute operational metrics
  const metrics = useMemo(() => {
    const pendingConfirmation = merchantBookings.filter(
      (b) => b.status === "DIBAYAR_ESCROW"
    );
    const activeRentals = merchantBookings.filter(
      (b) => b.status === "DALAM_SEWA" || b.status === "SIAP_SERAH_TERIMA"
    );
    const completedRentals = merchantBookings.filter(
      (b) => b.status === "SELESAI"
    );

    // Escrow balance: sum of paid amounts in active / pending bookings
    const escrowBalance = merchantBookings
      .filter((b) => ["DIBAYAR_ESCROW", "SIAP_SERAH_TERIMA", "DALAM_SEWA"].includes(b.status))
      .reduce((acc, curr) => acc + curr.paidAmount, 0);

    // STNK warnings
    const stnkWarningCount = vehicles.filter((v) => {
      const s = getStnkTaxStatus(v.stnkTaxExpiryDate);
      return s.status === "SEGERA_HABIS" || s.status === "KADALUWARSA";
    }).length;

    // Stale listings
    const staleListingCount = listings.filter((l) => {
      return getFreshnessInfo(l.lastFreshnessConfirmedAt).isStale;
    }).length;

    return {
      pendingConfirmation,
      activeRentals,
      completedRentals,
      escrowBalance,
      stnkWarningCount,
      staleListingCount,
    };
  }, [merchantBookings, vehicles, listings]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav currentTab="dashboard" />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Merchant Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-400 font-mono tracking-wider uppercase">
                PORTAL MERCHANT DRIVEO DIY
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-slate-300">Senin, 5 Oktober 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sugeng Rawuh, {profile.businessName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Pusat komando operasional rental mobil wilayah Yogyakarta. Pantau booking escrow, serah terima unit, dan utilisasi armada Plat AB secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/mitra/kalender"
              className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Kalender Jadwal</span>
            </Link>
            <Link
              href="/mitra/kendaraan/baru"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Armada</span>
            </Link>
          </div>
        </div>

        {/* PRIORITY ACTION REQUIRED BANNERS */}
        {(metrics.pendingConfirmation.length > 0 || metrics.staleListingCount > 0 || metrics.stnkWarningCount > 0) && (
          <div className="space-y-3">
            {metrics.pendingConfirmation.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-amber-950">
                      Ada {metrics.pendingConfirmation.length} Pesanan Baru Menunggu Konfirmasi (FR-BOOKING-008)
                    </h2>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Segera setujui sebelum batas waktu SLA 2 jam berakhir dan pesanan dibatalkan otomatis oleh sistem.
                    </p>
                  </div>
                </div>
                <Link
                  href="/mitra/booking"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 self-end sm:self-auto cursor-pointer min-h-[38px]"
                >
                  <span>Konfirmasi Sekarang</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {metrics.staleListingCount > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-blue-950">
                      {metrics.staleListingCount} Listing Memerlukan Reset Kebaruan Data (BR-027)
                    </h2>
                    <p className="text-xs text-blue-800 mt-0.5">
                      Listing berusia &gt; 7 hari otomatis disembunyikan dari hasil pencarian publik wisatawan.
                    </p>
                  </div>
                </div>
                <Link
                  href="/mitra/listing"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 self-end sm:self-auto cursor-pointer min-h-[38px]"
                >
                  <span>Buka Halaman Listing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 4 CORE KPI METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Booking Butuh Konfirmasi
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-600 font-mono tabular-nums">
                {metrics.pendingConfirmation.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">Order Baru</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                SLA Maks. 2 Jam
              </span>
              <Link href="/mitra/booking" className="text-blue-600 font-bold hover:underline">
                Lihat &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Unit Dalam Sewa Aktif
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-blue-600 font-mono tabular-nums">
                {metrics.activeRentals.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">Mobil di Jalan</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Total Armada: {vehicles.length} Unit</span>
              <Link href="/mitra/kendaraan" className="text-blue-600 font-bold hover:underline">
                Armada &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Saldo Berjalan di Escrow
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono tabular-nums">
                Rp {metrics.escrowBalance.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Aman di Escrow
              </span>
              <span className="text-slate-400 font-mono">H+1 Paska Sewa</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Sewa Sukses Selesai
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                {metrics.completedRentals.length + 640}
              </span>
              <span className="text-xs text-slate-500 font-medium">Transaksi</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-medium">Rating: 4.97 ★★★★★</span>
              <span className="text-emerald-600 font-bold">100% Puas</span>
            </div>
          </div>
        </div>

        {/* SECTION: PESANAN MASUK TERKINI & JADWAL HARI INI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Pesanan Menunggu Konfirmasi (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900">
                  Antrean Pesanan Masuk (Countdown SLA)
                </h2>
              </div>
              <Link
                href="/mitra/booking"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Kelola Semua Pesanan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {merchantBookings.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">Belum ada pesanan aktif saat ini.</p>
            ) : (
              <div className="space-y-3">
                {merchantBookings.slice(0, 3).map((bk) => {
                  const sla = getSlaTimerInfo(bk.createdAt);

                  return (
                    <div
                      key={bk.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                            {bk.bookingCode}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{bk.vehicleName}</span>
                          <span className="text-[11px] font-mono text-slate-500">({bk.licensePlate})</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Penyewa: <strong>{bk.userName}</strong> • {bk.totalDays} Hari • Titik Jemput: <strong>{bk.pickupSpotName}</strong>
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>Grand Total: <strong className="font-mono text-slate-900">Rp {bk.grandTotal.toLocaleString("id-ID")}</strong></span>
                          <span>•</span>
                          <span>Skema: <strong>{bk.paymentScheme}</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                        {bk.status === "DIBAYAR_ESCROW" && (
                          <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold font-mono ${sla.badgeColor}`}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {sla.label}
                          </div>
                        )}
                        <Link
                          href={`/mitra/booking/${bk.id}`}
                          className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
                        >
                          Tinjau Detail
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kolom Kanan: Jadwal Serah Terima & Shortcut Operasional (1 Col) */}
          <div className="space-y-4">
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Aksi Cepat Tim Rental
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/mitra/kalender"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-colors flex flex-col justify-between min-h-[70px]"
                >
                  <Calendar className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Kalender Matrix</span>
                </Link>
                <Link
                  href="/mitra/kendaraan/baru"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-colors flex flex-col justify-between min-h-[70px]"
                >
                  <Car className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Tambah Unit</span>
                </Link>
                <Link
                  href="/mitra/listing/baru"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-colors flex flex-col justify-between min-h-[70px]"
                >
                  <Tag className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Buat Listing</span>
                </Link>
                <Link
                  href="/mitra/staf"
                  className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-colors flex flex-col justify-between min-h-[70px]"
                >
                  <Users className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">Kelola Staf</span>
                </Link>
              </div>
            </div>

            {/* Hubungi Tim Mediasi & CS DriveO */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                BANTUAN OPERASIONAL 24 JAM
              </span>
              <h2 className="text-sm font-bold text-white">Butuh Dukungan Darurat?</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kendala mekanis armada di jalan atau mediasi perselisihan penyewa ditangani langsung oleh Tim DriveO Jogja.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp CS Mitra</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
