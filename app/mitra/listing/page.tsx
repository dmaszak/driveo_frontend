"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MitraNav } from "@/components/mitra/mitra-nav";
import {
  useMitraListings,
  getFreshnessInfo,
} from "@/lib/store/vehicle-store";
import {
  Tag,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Power,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Coins,
} from "lucide-react";

export default function MitraListingPage() {
  const {
    listings,
    toggleListingStatus,
    confirmFreshness,
    confirmAllFreshness,
  } = useMitraListings();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute Freshness & Counts
  const stats = useMemo(() => {
    let active = 0;
    let stale = 0;
    let inactive = 0;

    listings.forEach((l) => {
      const freshness = getFreshnessInfo(l.lastFreshnessConfirmedAt);
      if (l.status === "KADALUWARSA_FRESHNESS" || freshness.isStale) {
        stale++;
      } else if (l.status === "AKTIF") {
        active++;
      } else {
        inactive++;
      }
    });

    return {
      total: listings.length,
      active,
      stale,
      inactive,
    };
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchSearch =
        l.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase());

      const freshness = getFreshnessInfo(l.lastFreshnessConfirmedAt);
      let matchStatus = true;

      if (selectedFilter === "AKTIF") {
        matchStatus = l.status === "AKTIF" && !freshness.isStale;
      } else if (selectedFilter === "STALE") {
        matchStatus = l.status === "KADALUWARSA_FRESHNESS" || freshness.isStale;
      } else if (selectedFilter === "NONAKTIF") {
        matchStatus = l.status === "NONAKTIF_SEMENTARA";
      }

      return matchSearch && matchStatus;
    });
  }, [listings, searchQuery, selectedFilter]);

  const handleConfirmSingle = (id: string, name: string) => {
    confirmFreshness(id);
    setToastMessage(`Listing "${name}" berhasil dikonfirmasi kebaruannya. Timer 7 hari diperbarui.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmAll = () => {
    confirmAllFreshness();
    setToastMessage("Seluruh listing berhasil diperbarui kebaruannya (BR-027). Semua unit aktif kembali di marketplace!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav
        currentTab="listing"
        actionButton={
          <Link
            href="/mitra/listing/baru"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors min-h-[38px]"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Listing Baru</span>
          </Link>
        }
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>Portal Mitra</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 font-semibold">Listing Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Listing Marketplace
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola visibilitas penawaran rental, tarif sewa harian, deposit jaminan, dan konfirmasi Freshness Telemetry 7 hari (BR-027).
            </p>
          </div>

          <Link
            href="/mitra/listing/baru"
            className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Listing Baru</span>
          </Link>
        </div>

        {/* BR-027 FRESHNESS ALERT BANNER (If any listing is stale) */}
        {stats.stale > 0 && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-amber-950">
                    {stats.stale} Listing Memerlukan Konfirmasi Kebaruan (BR-027)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 font-mono">
                    Freshness Telemetry
                  </span>
                </div>
                <p className="text-xs text-amber-900/80 mt-1 max-w-2xl leading-relaxed">
                  Sesuai aturan ekosistem DriveO, listing yang tidak dikonfirmasi dalam 7 hari otomatis disembunyikan dari hasil pencarian publik agar ketersediaan mobil selalu akurat bagi wisatawan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmAll}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all shrink-0 flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Konfirmasi Semua Data Masih Akurat (1-Klik)</span>
            </button>
          </div>
        )}

        {/* Toast alert */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Total Listing Dibuat</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{stats.total}</span>
              <span className="text-xs text-slate-500">Penawaran</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">Terikat ke armada Plat AB</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700 block">Aktif di Publik</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600 font-mono tabular-nums">{stats.active}</span>
              <span className="text-xs text-slate-500">Tampil</span>
            </div>
            <span className="text-[11px] text-emerald-600 mt-2 block font-medium">Bisa dipesan calon penyewa</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
            <span className="text-xs font-semibold text-amber-800 block">Butuh Konfirmasi (Stale)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-700 font-mono tabular-nums">{stats.stale}</span>
              <span className="text-xs text-amber-600">&gt; 7 Hari</span>
            </div>
            <span className="text-[11px] text-amber-700 mt-2 block font-medium">Otomatis disembunyikan</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Nonaktif Sementara</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-700 font-mono tabular-nums">{stats.inactive}</span>
              <span className="text-xs text-slate-500">Draf / Off</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">Dapat diaktifkan sewaktu-waktu</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari listing mobil atau plat nomor..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: "ALL", label: "Semua Listing" },
                { id: "AKTIF", label: "Aktif di Publik" },
                { id: "STALE", label: "Perlu Konfirmasi" },
                { id: "NONAKTIF", label: "Nonaktif" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
                    selectedFilter === filter.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Cards View */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
              <Tag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tidak ada listing marketplace yang cocok</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Coba sesuaikan filter status atau buat penawaran listing baru untuk armada Plat AB Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing) => {
              const freshness = getFreshnessInfo(listing.lastFreshnessConfirmedAt);
              const isStale = listing.status === "KADALUWARSA_FRESHNESS" || freshness.isStale;

              return (
                <div
                  key={listing.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isStale ? "border-amber-300 bg-amber-50/15" : "border-slate-200/80"
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                    <div className="relative w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={listing.thumbnailUrl}
                        alt={listing.vehicleName}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                      <div className="absolute bottom-1 left-1 bg-slate-950/90 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded border border-white/20">
                        {listing.vehiclePlate}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {listing.serviceType.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {listing.vehicleTransmission} • {listing.vehicleCategory}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-slate-900 line-clamp-1">
                        {listing.vehicleName}
                      </h2>

                      {/* Pricing Info */}
                      <div className="flex items-center gap-3 text-xs pt-0.5">
                        <span className="text-slate-600">
                          Tarif: <strong className="font-mono text-slate-900 text-sm">Rp {listing.baseDailyRate.toLocaleString("id-ID")}</strong> / hari
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">
                          Deposit: <strong className="font-mono text-slate-700">Rp {listing.securityDeposit.toLocaleString("id-ID")}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Freshness Status & Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {/* Freshness Badge */}
                    <div className="flex flex-col text-left sm:text-right">
                      {isStale ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Kadaluwarsa Freshness (&gt;7 Hari)</span>
                        </div>
                      ) : freshness.isWarning ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Tersisa {freshness.remainingDays} hari konfirmasi</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Data Segar ({freshness.diffDays} hari lalu)</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400 mt-1">
                        Terakhir konfirmasi: {new Date(listing.lastFreshnessConfirmedAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isStale && (
                        <button
                          type="button"
                          onClick={() => handleConfirmSingle(listing.id, listing.vehicleName)}
                          className="px-3 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Konfirmasi</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleListingStatus(listing.id)}
                        title={listing.status === "AKTIF" ? "Nonaktifkan sementara" : "Publikasikan ke marketplace"}
                        className={`p-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                          listing.status === "AKTIF"
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        <span className="hidden sm:inline">{listing.status === "AKTIF" ? "Nonaktifkan" : "Aktifkan"}</span>
                      </button>

                      <Link
                        href={`/mitra/listing/${listing.id}`}
                        className="px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors min-h-[38px] flex items-center gap-1"
                      >
                        <span>Edit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
