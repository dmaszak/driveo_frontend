"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MitraNav } from "@/components/mitra/mitra-nav";
import { useMitraVehicles, useMitraListings } from "@/lib/store/vehicle-store";
import { useMitra } from "@/lib/store/mitra-store";
import { YOGYAKARTA_PICKUP_SPOTS } from "@/lib/mock-data/yogyakarta";
import { SpotDeliveryRate } from "@/types/domain";
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
  Sparkles,
  Calculator,
  UserCheck,
} from "lucide-react";

function TambahListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedVehicleId = searchParams.get("vehicleId");

  const { vehicles } = useMitraVehicles();
  const { addListing } = useMitraListings();
  const { profile } = useMitra();

  // Selected Vehicle
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    preselectedVehicleId || vehicles[0]?.id || ""
  );

  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  }, [vehicles, selectedVehicleId]);

  // Service Type
  const [serviceType, setServiceType] = useState<"LEPAS_KUNCI" | "DENGAN_SUPIR" | "KEDUANYA">("KEDUANYA");

  // Rates
  const [baseDailyRate, setBaseDailyRate] = useState<number>(
    selectedVehicle?.baseDailyRate || 500000
  );
  const [driverDailyRate, setDriverDailyRate] = useState<number>(200000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(
    selectedVehicle?.securityDeposit || 200000
  );
  const [weekendSurcharge, setWeekendSurcharge] = useState<number>(50000);
  const [minimumRentalDays, setMinimumRentalDays] = useState<number>(1);

  // Spot Delivery Rates
  const [spotRates, setSpotRates] = useState<SpotDeliveryRate[]>(
    YOGYAKARTA_PICKUP_SPOTS.map((s) => ({
      spotId: s.id,
      spotName: s.name,
      area: s.area,
      fee: s.extraFee,
      enabled: true,
    }))
  );

  // Live Calculator Demo State
  const [calcSelectedSpotId, setCalcSelectedSpotId] = useState<string>("spot-tugu");
  const [calcIncludeDriver, setCalcIncludeDriver] = useState<boolean>(false);
  const [calcDays, setCalcDays] = useState<number>(2);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Calculate live preview totals (BR-026 Price All-In)
  const previewCalculation = useMemo(() => {
    const selectedSpot = spotRates.find((s) => s.spotId === calcSelectedSpotId);
    const deliveryFee = selectedSpot?.enabled ? selectedSpot.fee : 0;
    const rentalBaseTotal = baseDailyRate * calcDays;
    const driverTotal = (calcIncludeDriver || serviceType === "DENGAN_SUPIR") ? driverDailyRate * calcDays : 0;
    const grandTotal = rentalBaseTotal + driverTotal + deliveryFee + securityDeposit;

    return {
      rentalBaseTotal,
      driverTotal,
      deliveryFee,
      securityDeposit,
      grandTotal,
      spotName: selectedSpot?.spotName || "Stasiun Tugu",
    };
  }, [baseDailyRate, driverDailyRate, securityDeposit, spotRates, calcSelectedSpotId, calcIncludeDriver, calcDays, serviceType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedVehicle) {
      setErrorMessage("Pilih unit kendaraan Plat AB terlebih dahulu.");
      return;
    }

    if (baseDailyRate <= 0) {
      setErrorMessage("Tarif sewa harian wajib lebih dari Rp 0.");
      return;
    }

    setIsSubmitting(true);

    addListing({
      rentalId: profile.id,
      rentalName: profile.businessName,
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      vehiclePlate: selectedVehicle.licensePlate,
      vehicleCategory: selectedVehicle.category,
      vehicleTransmission: selectedVehicle.transmission,
      thumbnailUrl: selectedVehicle.thumbnailUrl,
      serviceType,
      baseDailyRate: Number(baseDailyRate),
      driverDailyRate: serviceType !== "LEPAS_KUNCI" ? Number(driverDailyRate) : undefined,
      securityDeposit: Number(securityDeposit),
      weekendSurcharge: Number(weekendSurcharge),
      spotDeliveryRates: spotRates,
      minimumRentalDays: Number(minimumRentalDays),
      includedFacilities: [
        "Jaminan Unit Bersih & Steril",
        "Dukungan Roadside Assistance 24 Jam di Wilayah DIY",
        "E-toll Card Tersedia di Kendaraan",
      ],
      rentalTerms: [
        "Wajib KTP Asli + SIM A aktif",
        "Deposit jaminan dikembalikan penuh maksimal 1x24 jam paska sewa",
        "Area jangkauan: Seluruh Daerah Istimewa Yogyakarta",
      ],
      status: "AKTIF",
      lastFreshnessConfirmedAt: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/mitra/listing");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav currentTab="listing" />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/mitra/listing" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Listing Marketplace</span>
          </Link>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Buat Listing Baru</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                FR-LISTING-001 • BR-026 Transparansi All-In
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Publikasikan Penawaran Sewa Mobil
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Tentukan paket sewa, tarif harian transparan, ongkos antar per titik jemput DIY, dan deposit jaminan sesuai standar ekosistem DriveO.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-rose-900">Periksa Formulir Anda</h2>
              <p className="text-rose-700 text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Pilih Armada Plat AB */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Car className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">1. Hubungkan ke Unit Armada Terdaftar</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pilih Unit Armada Plat AB:
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value);
                  const found = vehicles.find((v) => v.id === e.target.value);
                  if (found) {
                    setBaseDailyRate(found.baseDailyRate);
                    setSecurityDeposit(found.securityDeposit);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.licensePlate} — {v.name} ({v.year}, {v.transmission}, {v.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Vehicle Preview Banner */}
            {selectedVehicle && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center gap-4">
                <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={selectedVehicle.thumbnailUrl}
                    alt={selectedVehicle.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                      {selectedVehicle.licensePlate}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{selectedVehicle.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Garasi: {selectedVehicle.garageAddress} • Kapasitas: {selectedVehicle.seatingCapacity} Kursi
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Skema Sewa & Penetapan Tarif */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">2. Skema Layanan & Tarif Harian (Price All-In)</h2>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Skema Sewa yang Ditawarkan:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "LEPAS_KUNCI", label: "Lepas Kunci Saja", desc: "Penyewa mengemudi mandiri" },
                  { id: "DENGAN_SUPIR", label: "Dengan Supir Saja", desc: "Termasuk driver profesional" },
                  { id: "KEDUANYA", label: "Lepas Kunci & Supir", desc: "Penyewa bebas memilih opsi" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                      serviceType === s.id
                        ? "bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block text-xs font-bold">{s.label}</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Rates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tarif Sewa Harian (Lepas Kunci) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min={100000}
                    step={25000}
                    value={baseDailyRate}
                    onChange={(e) => setBaseDailyRate(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {serviceType !== "LEPAS_KUNCI" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tambahan Jasa Supir / Hari
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      min={100000}
                      step={25000}
                      value={driverDailyRate}
                      onChange={(e) => setDriverDailyRate(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deposit Jaminan (Refundable) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min={50000}
                    step={50000}
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Dikembalikan utuh jika tidak ada insiden</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Weekend Surcharge (Sabtu & Minggu / Hari)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min={0}
                    step={25000}
                    value={weekendSurcharge}
                    onChange={(e) => setWeekendSurcharge(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Minimal Hari Sewa (Durasi)
                </label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={minimumRentalDays}
                  onChange={(e) => setMinimumRentalDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Tarif Antar-Jemput per Spot DIY */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">3. Titik Antar-Jemput Wilayah Yogyakarta</h2>
            </div>
            <p className="text-xs text-slate-500">
              Atur biaya antar-jemput ke lokasi transportasi vital wisatawan di Yogyakarta:
            </p>

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

          {/* SECTION 4: Live Price All-In Preview Calculator (BR-026) */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">4. Live Preview Tampilan Harga Calon Penyewa (BR-026)</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono">
                Price All-In
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Simulasi rincian yang akan dilihat penyewa saat checkout. Tidak ada biaya tersembunyi demi menjaga reputasi merchant:
            </p>

            {/* Mini Simulator Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Pilihan Durasi Sewa:</label>
                <select
                  value={calcDays}
                  onChange={(e) => setCalcDays(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white text-slate-900 rounded-lg font-bold text-xs"
                >
                  <option value={1}>1 Hari (24 Jam)</option>
                  <option value={2}>2 Hari (48 Jam)</option>
                  <option value={3}>3 Hari (72 Jam)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Lokasi Titik Jemput:</label>
                <select
                  value={calcSelectedSpotId}
                  onChange={(e) => setCalcSelectedSpotId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white text-slate-900 rounded-lg font-bold text-xs"
                >
                  {spotRates.filter((s) => s.enabled).map((s) => (
                    <option key={s.spotId} value={s.spotId}>
                      {s.spotName}
                    </option>
                  ))}
                </select>
              </div>

              {serviceType === "KEDUANYA" && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Opsi Supir:</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={calcIncludeDriver}
                      onChange={(e) => setCalcIncludeDriver(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-xs font-semibold">Termasuk Jasa Supir</span>
                  </label>
                </div>
              )}
            </div>

            {/* Bill Breakdown Display */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Sewa Mobil ({calcDays} hari x Rp {baseDailyRate.toLocaleString("id-ID")}):</span>
                <span className="font-mono text-white font-semibold">Rp {previewCalculation.rentalBaseTotal.toLocaleString("id-ID")}</span>
              </div>

              {(calcIncludeDriver || serviceType === "DENGAN_SUPIR") && (
                <div className="flex justify-between text-slate-300">
                  <span>Jasa Supir ({calcDays} hari x Rp {driverDailyRate.toLocaleString("id-ID")}):</span>
                  <span className="font-mono text-white font-semibold">Rp {previewCalculation.driverTotal.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span>Ongkos Antar ({previewCalculation.spotName}):</span>
                <span className="font-mono text-white font-semibold">
                  {previewCalculation.deliveryFee === 0 ? "Gratis (Rp 0)" : `Rp ${previewCalculation.deliveryFee.toLocaleString("id-ID")}`}
                </span>
              </div>

              <div className="flex justify-between text-amber-300 pt-1 border-t border-white/10">
                <span>Deposit Jaminan (Dikembalikan paska sewa):</span>
                <span className="font-mono font-bold">Rp {previewCalculation.securityDeposit.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-white/20">
                <span className="text-white">Estimasi Grand Total Penyewa:</span>
                <span className="text-base text-amber-400 font-mono font-black">
                  Rp {previewCalculation.grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/mitra/listing"
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors min-h-[44px] flex items-center"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 min-h-[44px] flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menerbitkan Listing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publikasikan ke Marketplace</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function TambahListingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat formulir listing...</div>}>
      <TambahListingContent />
    </Suspense>
  );
}
