"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { GuestAuthModal } from "@/components/auth/guest-auth-modal";
import { CompareFloatingBar } from "@/components/marketplace/compare-floating-bar";
import { useAuth } from "@/lib/store/auth-store";
import { useCompare } from "@/lib/store/compare-store";
import {
  FEATURED_YOGYAKARTA_VEHICLES,
  YOGYAKARTA_PICKUP_SPOTS,
} from "@/lib/mock-data/yogyakarta";
import { formatRupiah, formatRelativeTime } from "@/lib/utils";
import { Vehicle, VehicleCategory, VehicleTransmission, VehicleFuelType } from "@/types/domain";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Users,
  Fuel,
  Gauge,
  Star,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Check,
  Scale,
  Car,
  ChevronRight,
  Info,
  Clock,
  X,
} from "lucide-react";

type SortOption = "smart" | "price_asc" | "freshness" | "rating_desc";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { isInCompare, toggle: toggleCompare } = useCompare();

  // URL Query defaults
  const initialSpot = searchParams.get("spot") || "spot-tugu";
  const initialCategory = searchParams.get("kategori") || "SEMUA";
  const initialService = searchParams.get("layanan") || "lepas-kunci";

  // Filter states
  const [selectedSpotId, setSelectedSpotId] = useState<string>(initialSpot);
  const [serviceType, setServiceType] = useState<string>(initialService);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(1200000);
  const [selectedTransmissions, setSelectedTransmissions] = useState<VehicleTransmission[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<VehicleFuelType[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [onlyVerifiedNib, setOnlyVerifiedNib] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("smart");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Guest Auth Intercept Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCarForAuth, setSelectedCarForAuth] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Active Spot detail
  const currentSpot = useMemo(
    () => YOGYAKARTA_PICKUP_SPOTS.find((s) => s.id === selectedSpotId) || YOGYAKARTA_PICKUP_SPOTS[1],
    [selectedSpotId]
  );

  // Filter Logic
  const filteredVehicles = useMemo(() => {
    return FEATURED_YOGYAKARTA_VEHICLES.filter((v) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchBrand = v.brand.toLowerCase().includes(q);
        const matchRental = v.rentalName.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchRental) return false;
      }

      // Category
      if (selectedCategory !== "SEMUA" && v.category !== selectedCategory) {
        return false;
      }

      // Max price
      if (v.baseDailyRate > maxPrice) {
        return false;
      }

      // Transmissions
      if (selectedTransmissions.length > 0 && !selectedTransmissions.includes(v.transmission)) {
        return false;
      }

      // Fuel
      if (selectedFuels.length > 0 && !selectedFuels.includes(v.fuelType)) {
        return false;
      }

      // Capacity
      if (selectedCapacities.length > 0) {
        const matchesCap = selectedCapacities.some((cap) => {
          if (cap === "4-5") return v.seatingCapacity <= 5;
          if (cap === "6-7") return v.seatingCapacity >= 6 && v.seatingCapacity <= 7;
          if (cap === ">7") return v.seatingCapacity > 7;
          return true;
        });
        if (!matchesCap) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") {
        return a.baseDailyRate - b.baseDailyRate;
      }
      if (sortBy === "rating_desc") {
        return b.rentalRating - a.rentalRating;
      }
      if (sortBy === "freshness") {
        return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
      }
      // Smart match (default): Popular first, then recent update
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
    });
  }, [
    searchQuery,
    selectedCategory,
    maxPrice,
    selectedTransmissions,
    selectedFuels,
    selectedCapacities,
    sortBy,
  ]);

  const handleBookingClick = (vehicle: Vehicle) => {
    if (!user) {
      setSelectedCarForAuth({ id: vehicle.id, name: vehicle.name });
      setIsAuthModalOpen(true);
    } else {
      router.push(`/pesan/${vehicle.id}`);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("SEMUA");
    setMaxPrice(1200000);
    setSelectedTransmissions([]);
    setSelectedFuels([]);
    setSelectedCapacities([]);
    setOnlyVerifiedNib(false);
    setSearchQuery("");
    setSortBy("smart");
  };

  const hasActiveFilters =
    selectedCategory !== "SEMUA" ||
    maxPrice < 1200000 ||
    selectedTransmissions.length > 0 ||
    selectedFuels.length > 0 ||
    selectedCapacities.length > 0 ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Header Search Ribbon */}
      <section className="bg-slate-900 text-white pt-28 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Katalog Rental Mobil DIY</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Pencarian Armada Yogyakarta</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/30">
                  Plat AB Garansi Resmi
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Transparansi tarif harian, deposit escrow terlindungi, dan serah terima digital di seluruh wilayah DIY.
              </p>
            </div>

            {/* Service switcher (Lepas Kunci vs Dengan Supir) */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setServiceType("lepas-kunci")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  serviceType === "lepas-kunci"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Lepas Kunci
              </button>
              <button
                type="button"
                onClick={() => setServiceType("dengan-supir")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  serviceType === "dengan-supir"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Dengan Supir
              </button>
            </div>
          </div>

          {/* Quick Filter Strip Bar */}
          <div className="mt-6 bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 border border-slate-700/70 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {/* Spot Selector */}
            <div className="relative">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-1 block">
                Lokasi Jemput DIY
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-700 text-sm">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <select
                  value={selectedSpotId}
                  onChange={(e) => setSelectedSpotId(e.target.value)}
                  className="bg-transparent text-white text-xs w-full focus:outline-none cursor-pointer"
                >
                  {YOGYAKARTA_PICKUP_SPOTS.map((spot) => (
                    <option key={spot.id} value={spot.id} className="bg-slate-900 text-white">
                      {spot.name} {spot.extraFee > 0 ? `(+${formatRupiah(spot.extraFee)})` : "(Gratis)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Start */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-1 block">
                Mulai Sewa
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-700 text-xs text-white">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Hari Ini, 09:00 WIB</span>
              </div>
            </div>

            {/* Date End */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-1 block">
                Selesai Sewa
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-700 text-xs text-white">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Besok, 09:00 WIB (24 Jam)</span>
              </div>
            </div>

            {/* Search Input */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-1 block">
                Cari Model / Mitra
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-700 text-xs text-white">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Innova, Brio, Tugu Rent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white placeholder-slate-500 w-full focus:outline-none text-xs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Micro-liquidity Notice Banner (BR-024) */}
        {filteredVehicles.length <= 2 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">Ketersediaan Unit Terbatas: </span>
              Hanya {filteredVehicles.length} armada tersedia untuk filter saat ini. Mitra rental kami juga memiliki unit alternatif siap antar ke{" "}
              <span className="font-semibold text-amber-950 underline decoration-amber-400">
                Stasiun Tugu (15 mnt)
              </span>{" "}
              atau garasi terdekat di Sleman & Kota Jogja.
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTER */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Filter Armada</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-6 pt-4">
              {/* Category Pills */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2.5">
                  Kategori Kendaraan
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "SEMUA", label: "Semua" },
                    { id: "MPV", label: "MPV Keluarga" },
                    { id: "SUV", label: "SUV Tangguh" },
                    { id: "CITY_CAR", label: "City Car" },
                    { id: "EV", label: "Mobil Listrik (EV)" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700">Maks. Tarif Harian</label>
                  <span className="text-xs font-extrabold text-blue-600 tabular-nums">
                    {formatRupiah(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={350000}
                  max={1500000}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 tabular-nums">
                  <span>Rp 350 rb</span>
                  <span>Rp 1.5 jt</span>
                </div>
              </div>

              {/* Transmission Checkboxes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Transmisi</label>
                <div className="space-y-2">
                  {[
                    { id: "AUTOMATIC", label: "Automatic (AT)" },
                    { id: "CVT", label: "CVT Halus" },
                    { id: "MANUAL", label: "Manual (MT)" },
                  ].map((t) => {
                    const isChecked = selectedTransmissions.includes(t.id as VehicleTransmission);
                    return (
                      <label
                        key={t.id}
                        className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedTransmissions(
                                selectedTransmissions.filter((item) => item !== t.id)
                              );
                            } else {
                              setSelectedTransmissions([
                                ...selectedTransmissions,
                                t.id as VehicleTransmission,
                              ]);
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{t.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Capacity Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Kapasitas Kursi
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "4-5", label: "4-5 Seat" },
                    { id: "6-7", label: "6-7 Seat" },
                    { id: ">7", label: "> 7 Seat" },
                  ].map((cap) => {
                    const isChecked = selectedCapacities.includes(cap.id);
                    return (
                      <button
                        key={cap.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedCapacities(
                              selectedCapacities.filter((item) => item !== cap.id)
                            );
                          } else {
                            setSelectedCapacities([...selectedCapacities, cap.id]);
                          }
                        }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {cap.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Bahan Bakar</label>
                <div className="space-y-2">
                  {[
                    { id: "BENSIN", label: "Bensin (Gasoline)" },
                    { id: "DIESEL", label: "Diesel Modern" },
                    { id: "HYBRID", label: "Hybrid Ramah Lingkungan" },
                    { id: "LISTRIK", label: "Listrik Murni (EV)" },
                  ].map((fuel) => {
                    const isChecked = selectedFuels.includes(fuel.id as VehicleFuelType);
                    return (
                      <label
                        key={fuel.id}
                        className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedFuels(selectedFuels.filter((item) => item !== fuel.id));
                            } else {
                              setSelectedFuels([...selectedFuels, fuel.id as VehicleFuelType]);
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{fuel.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Verified Trust Badge Filter */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyVerifiedNib}
                    onChange={(e) => setOnlyVerifiedNib(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Mitra NIB Terverifikasi
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Hanya tampilkan rental legal berbadan usaha OSS-RBA.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </aside>

          {/* VEHICLE CATALOG AREA */}
          <section className="flex-1 w-full">
            {/* Top Bar: Results Count & Sort Dropdown */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filter {hasActiveFilters ? "(Aktif)" : ""}</span>
                </button>
                <div className="text-sm text-slate-600">
                  Menampilkan{" "}
                  <span className="font-extrabold text-slate-900 tabular-nums">
                    {filteredVehicles.length} armada
                  </span>{" "}
                  di area DIY
                </div>
              </div>

              {/* Sorting Bar (BR-027 compliant) */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Urutkan:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-100 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="smart">Rekomendasi Terbaik</option>
                  <option value="price_asc">Tarif Termurah</option>
                  <option value="freshness">Listing Terupdate (BR-027)</option>
                  <option value="rating_desc">Rating Mitra Tertinggi</option>
                </select>
              </div>
            </div>

            {/* EMPTY STATE */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Tidak Ada Mobil yang Sesuai Filter
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Coba perluas rentang harga atau reset filter transmisi dan kapasitas kursi untuk melihat pilihan armada lainnya di Yogyakarta.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Semua Filter</span>
                </button>
              </div>
            ) : (
              /* VEHICLE GRID */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVehicles.map((vehicle) => {
                  const inCompare = isInCompare(vehicle.id);
                  const isPopularBadge = vehicle.isPopular;

                  return (
                    <div
                      key={vehicle.id}
                      className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col"
                    >
                      {/* Image Thumbnail Container */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={vehicle.thumbnailUrl}
                          alt={vehicle.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                            {vehicle.category}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-slate-950 shadow-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                            {vehicle.licensePlate}
                          </span>
                        </div>

                        {/* Freshness Telemetry Tag (BR-027) */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{formatRelativeTime(vehicle.lastUpdatedAt).label}</span>
                        </div>

                        {/* Compare Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleCompare(vehicle.id)}
                          className={`absolute bottom-3 right-3 p-2 rounded-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            inCompare
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                              : "bg-white/80 hover:bg-white text-slate-800"
                          }`}
                          title="Bandingkan mobil ini"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span className="text-[11px]">
                            {inCompare ? "Dipilih" : "Bandingkan"}
                          </span>
                        </button>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Title & Brand */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                                {vehicle.brand} • {vehicle.year}
                              </span>
                              <Link
                                href={`/listing/${vehicle.id}`}
                                className="block font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1"
                              >
                                {vehicle.name}
                              </Link>
                            </div>
                          </div>

                          {/* Technical Highlights */}
                          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 my-3 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="truncate">{vehicle.transmission}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>{vehicle.seatingCapacity} Kursi</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Fuel className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="truncate">{vehicle.fuelType}</span>
                            </div>
                          </div>

                          {/* Rental Partner Badge */}
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                            <Link
                              href={`/rental/${vehicle.rentalId}`}
                              className="font-medium text-slate-700 hover:text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <span>{vehicle.rentalName}</span>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </Link>
                            <div className="flex items-center gap-1 text-slate-700 font-bold">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="tabular-nums">{vehicle.rentalRating}</span>
                              <span className="text-slate-400 font-normal">
                                ({vehicle.rentalCompletedBookings})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Booking Action (BR-026 All-In Transparent) */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-medium">
                              Tarif Sewa All-In
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-slate-900 tabular-nums">
                                {formatRupiah(vehicle.baseDailyRate)}
                              </span>
                              <span className="text-xs text-slate-500 font-normal">/hari</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-medium block">
                              + Deposit {formatRupiah(vehicle.securityDeposit)} (Escrow)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/listing/${vehicle.id}`}
                              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Detail
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleBookingClick(vehicle)}
                              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                            >
                              Pesan
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Filter Armada</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 py-6 flex-1">
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Kategori</label>
                <div className="flex flex-wrap gap-1.5">
                  {["SEMUA", "MPV", "SUV", "CITY_CAR", "EV"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Maks Tarif: {formatRupiah(maxPrice)}
                </label>
                <input
                  type="range"
                  min={350000}
                  max={1500000}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Transmisi */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Transmisi</label>
                <div className="space-y-2">
                  {["AUTOMATIC", "CVT", "MANUAL"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedTransmissions.includes(t as VehicleTransmission)}
                        onChange={() => {
                          if (selectedTransmissions.includes(t as VehicleTransmission)) {
                            setSelectedTransmissions(
                              selectedTransmissions.filter((item) => item !== t)
                            );
                          } else {
                            setSelectedTransmissions([
                              ...selectedTransmissions,
                              t as VehicleTransmission,
                            ]);
                          }
                        }}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Compare Bar */}
      <CompareFloatingBar />

      {/* Guest Auth Modal */}
      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        intendedVehicleName={selectedCarForAuth?.name}
      />

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm">
          Memuat pencarian armada Yogyakarta...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
