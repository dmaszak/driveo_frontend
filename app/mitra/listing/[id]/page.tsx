"use client";

import React, { useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MitraNav } from "@/components/mitra/mitra-nav";
import {
  useMitraListings,
  getFreshnessInfo,
} from "@/lib/store/vehicle-store";
import {
  Tag,
  Car,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  MapPin,
  RefreshCw,
  Power,
  Trash2,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    listings,
    updateListing,
    toggleListingStatus,
    confirmFreshness,
    deleteListing,
  } = useMitraListings();

  const listing = listings.find((l) => l.id === resolvedParams.id);

  // Edit States initialized from listing
  const [baseDailyRate, setBaseDailyRate] = useState<number>(listing?.baseDailyRate || 500000);
  const [driverDailyRate, setDriverDailyRate] = useState<number>(listing?.driverDailyRate || 200000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(listing?.securityDeposit || 200000);
  const [weekendSurcharge, setWeekendSurcharge] = useState<number>(listing?.weekendSurcharge || 50000);
  const [serviceType, setServiceType] = useState<"LEPAS_KUNCI" | "DENGAN_SUPIR" | "KEDUANYA">(
    listing?.serviceType || "KEDUANYA"
  );
  const [spotRates, setSpotRates] = useState(listing?.spotDeliveryRates || []);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <MitraNav currentTab="listing" />
        <main className="max-w-4xl mx-auto w-full px-4 py-16 text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Listing Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Penawaran marketplace dengan ID tersebut tidak tersedia atau sudah dihapus.
          </p>
          <Link
            href="/mitra/listing"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Manajemen Listing</span>
          </Link>
        </main>
      </div>
    );
  }

  const freshness = getFreshnessInfo(listing.lastFreshnessConfirmedAt);
  const isStale = listing.status === "KADALUWARSA_FRESHNESS" || freshness.isStale;

  const handleSpotFeeChange = (spotId: string, newFee: number) => {
    setSpotRates((prev) =>
      prev.map((s) => (s.spotId === spotId ? { ...s, fee: newFee } : s))
    );
  };

  const handleSpotToggle = (spotId: string) => {
    setSpotRates((prev) =>
      prev.map((s) => (s.spotId === spotId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    updateListing(listing.id, {
      baseDailyRate: Number(baseDailyRate),
      driverDailyRate: serviceType !== "LEPAS_KUNCI" ? Number(driverDailyRate) : undefined,
      securityDeposit: Number(securityDeposit),
      weekendSurcharge: Number(weekendSurcharge),
      serviceType,
      spotDeliveryRates: spotRates,
    });
    setStatusMessage({ type: "success", text: "Perubahan tarif dan data listing berhasil disimpan." });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleConfirmFreshness = () => {
    confirmFreshness(listing.id);
    setStatusMessage({
      type: "success",
      text: "Kebaruan data berhasil dikonfirmasi (BR-027). Timer 7 hari telah di-reset dan unit tampil aktif di marketplace!",
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelete = () => {
    if (confirm(`Yakin ingin menghapus listing ${listing.vehicleName}?`)) {
      deleteListing(listing.id);
      router.push("/mitra/listing");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav currentTab="listing" />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/mitra/listing" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Listing Marketplace</span>
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-800 truncate max-w-xs">{listing.vehicleName}</span>
          </div>

          <Link
            href={`/listing/${listing.vehicleId}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 rounded-lg shadow-2xs"
          >
            <span>Lihat Tampilan Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* BR-027 FRESHNESS TELEMETRY HERO CARD */}
        <div
          className={`rounded-2xl p-6 border shadow-xs transition-all ${
            isStale
              ? "bg-amber-50/70 border-amber-300"
              : "bg-white border-slate-200/80"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isStale ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                }`}
              >
                {isStale ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900">
                    Telemetry Kebaruan Data Listing (BR-027)
                  </h1>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isStale ? "bg-amber-200 text-amber-900" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isStale ? "STATUS: KADALUWARSA (>7 HARI)" : "STATUS: DATA SEGAR"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                  {isStale
                    ? "Listing ini telah melebihi batas 7 hari tanpa konfirmasi aktif dari mitra, sehingga disembunyikan sementara dari pencarian publik. Klik tombol di samping untuk segera mengaktifkannya kembali."
                    : `Data listing terakhir dikonfirmasi ${freshness.diffDays} hari yang lalu. Tersisa ${freshness.remainingDays} hari sebelum memerlukan konfirmasi ulang.`}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Timestamp verifikasi terakhir: {new Date(listing.lastFreshnessConfirmedAt).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmFreshness}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all shrink-0 flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Konfirmasi Data Masih Akurat</span>
            </button>
          </div>
        </div>

        {/* Listing Main Info & Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <Image
                src={listing.thumbnailUrl}
                alt={listing.vehicleName}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                  {listing.vehiclePlate}
                </span>
                <h2 className="text-base font-bold text-slate-900">{listing.vehicleName}</h2>
              </div>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {listing.vehicleTransmission} • {listing.vehicleCategory}
              </span>
            </div>
          </div>

          {/* Status Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-600">Visibilitas Listing:</span>
            <button
              type="button"
              onClick={() => toggleListingStatus(listing.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
                listing.status === "AKTIF"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{listing.status === "AKTIF" ? "Aktif di Marketplace" : "Nonaktif Sementara"}</span>
            </button>
          </div>
        </div>

        {/* Form Edit Tarif & Spot */}
        <form onSubmit={handleSaveListing} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Perbarui Tarif & Skema Sewa</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Skema Sewa:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "LEPAS_KUNCI", label: "Lepas Kunci Saja" },
                  { id: "DENGAN_SUPIR", label: "Dengan Supir Saja" },
                  { id: "KEDUANYA", label: "Lepas Kunci & Supir" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                      serviceType === s.id
                        ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tarif Sewa Harian (Rp) *
                </label>
                <input
                  type="number"
                  min={100000}
                  step={25000}
                  value={baseDailyRate}
                  onChange={(e) => setBaseDailyRate(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  required
                />
              </div>

              {serviceType !== "LEPAS_KUNCI" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarif Supir / Hari (Rp)
                  </label>
                  <input
                    type="number"
                    min={100000}
                    step={25000}
                    value={driverDailyRate}
                    onChange={(e) => setDriverDailyRate(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deposit Jaminan (Rp) *
                </label>
                <input
                  type="number"
                  min={50000}
                  step={50000}
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Weekend Surcharge (Sabtu & Minggu / Hari)
              </label>
              <input
                type="number"
                min={0}
                step={25000}
                value={weekendSurcharge}
                onChange={(e) => setWeekendSurcharge(Number(e.target.value))}
                className="w-full sm:w-64 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              />
            </div>
          </div>

          {/* Spot Rates Management */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Tarif Pengantaran Spot Yogyakarta</h2>
            </div>

            <div className="space-y-3">
              {spotRates.map((spot) => (
                <div
                  key={spot.spotId}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    spot.enabled ? "bg-slate-50/70 border-slate-200" : "bg-slate-100/50 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={spot.enabled}
                      onChange={() => handleSpotToggle(spot.spotId)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{spot.spotName}</span>
                      <span className="text-[11px] text-slate-500">{spot.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs text-slate-500">Biaya Antar:</span>
                    <div className="relative w-36">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                      <input
                        type="number"
                        disabled={!spot.enabled}
                        value={spot.fee}
                        onChange={(e) => handleSpotFeeChange(spot.spotId, Number(e.target.value))}
                        step={10000}
                        min={0}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Listing</span>
            </button>

            <div className="flex items-center gap-3">
              <Link
                href="/mitra/listing"
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors min-h-[44px] flex items-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all min-h-[44px] flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
