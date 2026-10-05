"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings } from "@/lib/store/booking-store";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import { BookingStatus } from "@/types/domain";
import {
  Car,
  Ticket,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  QrCode,
} from "lucide-react";

export default function MyBookingsPage() {
  const { bookings } = useBookings();
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === "ACTIVE") {
        if (b.status === "SELESAI" || b.status === "DIBATALKAN") return false;
      }
      if (activeTab === "COMPLETED" && b.status !== "SELESAI") return false;
      if (activeTab === "CANCELLED" && b.status !== "DIBATALKAN") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = b.bookingCode.toLowerCase().includes(q);
        const matchCar = b.vehicleName.toLowerCase().includes(q);
        const matchRental = b.rentalName.toLowerCase().includes(q);
        return matchCode || matchCar || matchRental;
      }

      return true;
    });
  }, [bookings, activeTab, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/akun" className="hover:text-blue-600 transition-colors">
            Akun Saya
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Riwayat Transaksi Sewa</span>
        </div>

        {/* Page Title & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-3">
              <Ticket className="w-8 h-8 text-blue-600" />
              <span>Transaksi & Riwayat Sewa Saya</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau status penahanan dana di escrow, tiket serah terima, dan detail kontrak armada Anda di Yogyakarta.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode booking / mobil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabs Filter */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px mb-6 overflow-x-auto">
          {[
            { id: "ALL", label: `Semua Transaksi (${bookings.length})` },
            {
              id: "ACTIVE",
              label: `Sewa Aktif / Berjalan (${
                bookings.filter((b) => b.status !== "SELESAI" && b.status !== "DIBATALKAN").length
              })`,
            },
            {
              id: "COMPLETED",
              label: `Selesai (${bookings.filter((b) => b.status === "SELESAI").length})`,
            },
            {
              id: "CANCELLED",
              label: `Dibatalkan (${bookings.filter((b) => b.status === "DIBATALKAN").length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BOOKINGS LIST */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tidak Ada Transaksi Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Anda belum memiliki pesanan pada kategori ini. Jelajahi armada Plat AB di Yogyakarta dan nikmati sewa lepas kunci bergaransi escrow.
            </p>
            <Link
              href="/cari"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30"
            >
              <Car className="w-4 h-4" />
              <span>Cari Armada Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isPaid = b.status === "DIBAYAR_ESCROW" || b.status === "SIAP_SERAH_TERIMA";

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Left: Thumbnail & Main Info */}
                  <div className="flex items-start gap-4 w-full md:w-auto">
                    <div className="relative aspect-[16/10] w-28 sm:w-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      <Image
                        src={b.vehicleThumbnail}
                        alt={b.vehicleName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {b.bookingCode}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">
                          Mitra: {b.rentalName}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-950 text-base leading-snug">
                        {b.vehicleName}
                      </h3>
                      <span className="text-xs text-slate-500 block">
                        Plat {b.licensePlate} • Titik Jemput: <strong>{b.pickupSpotName}</strong>
                      </span>

                      <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {formatIndonesianDate(b.startDate)} ({b.totalDays} Hari)
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-900">
                          {b.serviceType === "LEPAS_KUNCI" ? "Lepas Kunci" : "Dengan Supir"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Financials & Action Buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between w-full md:w-auto gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Total Tagihan All-In
                      </span>
                      <div className="text-lg font-black text-slate-950 tabular-nums">
                        {formatRupiah(b.grandTotal)}
                      </div>

                      {/* Status Badges */}
                      <div className="mt-1 flex items-center md:justify-end gap-1.5">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Dana Ditahan Escrow</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Menunggu Pembayaran</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <Link
                        href={`/booking/${b.id}`}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
                      >
                        Detail
                      </Link>

                      {isPaid ? (
                        <Link
                          href={`/booking/${b.id}/voucher`}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Voucher QR</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/booking/${b.id}/bayar`}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                        >
                          Bayar Sekarang
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
