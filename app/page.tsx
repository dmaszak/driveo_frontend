"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/navigation";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import {
  FEATURED_YOGYAKARTA_VEHICLES,
  YOGYAKARTA_PICKUP_SPOTS,
} from "@/lib/mock-data/yogyakarta";
import { formatRupiah, formatRelativeTime } from "@/lib/utils";
import { Vehicle, VehicleCategory } from "@/types/domain";
import {
  Car,
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  Fuel,
  Gauge,
  Star,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Search,
  Check,
  Plus,
  X,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";

export default function GuestHomePage() {
  const router = useRouter();

  // Search Widget States
  const [selectedPickup, setSelectedPickup] = useState("spot-tugu");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Filter Category for Vehicle Grid
  const [activeTabCategory, setActiveTabCategory] = useState<string>("ALL");

  // Comparison State
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Guest Intercept Modal State
  const [interceptModalVehicle, setInterceptModalVehicle] =
    useState<Vehicle | null>(null);

  const toggleComparison = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length >= 3) {
        alert("Maksimal 3 kendaraan yang dapat dibandingkan sekaligus.");
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      lokasi: selectedPickup,
      mulai: startDate,
      selesai: endDate,
      ...(selectedCategory !== "ALL" ? { kategori: selectedCategory } : {}),
    });
    router.push(`/cari?${queryParams.toString()}`);
  };

  const filteredVehicles =
    activeTabCategory === "SEMUA_KENDARAAN"
      ? FEATURED_YOGYAKARTA_VEHICLES
      : FEATURED_YOGYAKARTA_VEHICLES.filter(
          (v) => v.category === activeTabCategory
        );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Transparent Glass Rounded Navbar */}
      <Navbar />

      {/* 2. Hero Section with User's Yogyakarta Family Trip Background */}
      <section className="relative -mt-16 sm:-mt-20 pt-24 sm:pt-28 pb-16 lg:pb-24 overflow-hidden">
        {/* Background Image Container with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-jogja-family.jpg"
            alt="Liburan Keluarga Rental Mobil Jogja Berlatar Tugu dan Gunung Merapi - DriveO"
            className="w-full h-full object-cover object-center lg:object-[center_35%]"
          />
          {/* Deep Cinematic Contrast Gradients for AAA Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
          <div className="max-w-3xl space-y-5 sm:space-y-6">
            {/* Trust Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 backdrop-blur-md border border-blue-400/40 text-blue-200 text-xs font-semibold shadow-lg shadow-black/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Rental Mobil Lepas Kunci Yogyakarta • Garansi Escrow 100%</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
              Jelajahi Jogja dengan Nyaman & Aman,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-sky-200">
                Bebas Khawatir.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
              Sewa mobil lepas kunci berplat AB dari puluhan mitra rental lokal
              terverifikasi di Daerah Istimewa Yogyakarta. Dilindungi rekening
              penampung aman (*escrow*), transparansi tarif tanpa biaya siluman,
              dan serah terima berbukti digital.
            </p>

            {/* Trust Bullet Highlights */}
            <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Garansi Rekening Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Deposit Kembali 100% (24 Jam)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/40">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>Ambil di YIA & Stasiun Tugu</span>
              </div>
            </div>
          </div>

          {/* 3. The Core Hero Search Engine Widget (FR-SEARCH-001/002) */}
          
        </div>
      </section>

      {/* 4. Tiga Lapis Nilai DriveO (SRS Bab 2.3) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
              Infrastruktur Tiga Lapis (SRS Bab 2.3)
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
              Kenapa Menyewa Mobil di DriveO Berbeda?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kami memadukan marketplace terbuka, sistem kalender operasional
              rental digital, dan lapisan kepercayaan bergaransi escrow agar
              transaksi Anda di Yogyakarta 100% aman dan transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Lapis 1: Marketplace Agregat */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25">
                <Search className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-blue-600 font-mono uppercase">
                  Lapis 1 • Marketplace Agregat
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Bandingkan Puluhan Rental Jogja
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tidak perlu lagi menghubungi puluhan rental via WhatsApp satu per
                  satu. Temukan puluhan pilihan mobil Plat AB dengan informasi
                  ketersediaan dan harga all-in jujur di satu layar.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Fitur komparasi spesifikasi hingga 3 mobil</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Telemetri kebaruan status ketersediaan</span>
                </li>
              </ul>
            </div>

            {/* Lapis 2: Sistem Operasional Digital */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-amber-300 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Calendar className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-amber-700 font-mono uppercase">
                  Lapis 2 • Operasional Digital
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Kalender Sinkron Bebas Double Booking
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mitra rental mengelola jadwal secara tersentralisasi. Slot mobil
                  yang Anda pesan langsung terkunci di sistem sehingga tidak akan
                  diberikan ke penyewa lain di saat bersamaan.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>SLA konfirmasi rental terpantau maksimal 2 jam</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Kondisi mobil terawat & ber-STNK asli DIY</span>
                </li>
              </ul>
            </div>

            {/* Lapis 3: Trust Layer & Escrow */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-700 font-mono uppercase">
                  Lapis 3 • Rekening Escrow
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Uang & Deposit Anda 100% Terlindungi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dana sewa tidak langsung ditransfer ke pihak rental, melainkan
                  ditahan di rekening penampung resmi. Deposit dicairkan kembali
                  100% dalam tempo 24 jam setelah pengembalian unit selesai.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-emerald-200/60">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Checklist inspeksi digital serah terima & foto 4 sisi</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mediasi resmi jika terjadi sengketa klaim sepihak</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Fleet Showcase (Katalog Mobil Unggulan Plat AB) */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {/* Section Header with Category Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 font-mono uppercase tracking-wider">
                <Car className="w-4 h-4" />
                <span>Pilihan Armada Unggulan (Plat AB Yogyakarta)</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Temukan Mobil Sesuai Rencana Wisata Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Seluruh kendaraan berplat AB asli Daerah Istimewa Yogyakarta dengan
                transparansi tarif harian dan deposit jaminan.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                { id: "ALL", label: "Semua Kendaraan" },
                { id: "MPV", label: "MPV Keluarga" },
                { id: "SUV", label: "SUV Tangguh" },
                { id: "CITY_CAR", label: "City Car" },
                { id: "EV", label: "Mobil Listrik" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabCategory(tab.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[38px] ${
                    activeTabCategory === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => {
              const freshness = formatRelativeTime(vehicle.lastUpdatedAt);
              const isCompared = comparedIds.includes(vehicle.id);

              return (
                <article
                  key={vehicle.id}
                  className="group bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Vehicle Media Image */}
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                    <img
                      src={vehicle.thumbnailUrl}
                      alt={vehicle.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                      <span className="font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-amber-300 border border-slate-700 shadow-sm">
                        {vehicle.licensePlate}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
                        {vehicle.category}
                      </span>
                    </div>

                    {/* Compare Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleComparison(vehicle.id)}
                      title={
                        isCompared
                          ? "Hapus dari komparasi"
                          : "Bandingkan mobil ini"
                      }
                      className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                        isCompared
                          ? "bg-blue-600 text-white shadow-md ring-2 ring-white"
                          : "bg-white/80 hover:bg-white text-slate-700 hover:text-blue-600 shadow-sm"
                      }`}
                    >
                      {isCompared ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>

                    {/* Freshness Telemetry Tag */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Tersedia • {freshness.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Partner Info Line */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 gap-2">
                        <span className="font-medium text-slate-700 flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{vehicle.rentalName}</span>
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 font-bold shrink-0 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{vehicle.rentalRating}</span>
                        </span>
                      </div>

                      {/* Vehicle Name */}
                      <h3 className="font-heading font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                        {vehicle.name}
                      </h3>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg truncate">
                          <Gauge className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg truncate">
                          <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{vehicle.seatingCapacity} Kursi</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg truncate">
                          <Fuel className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="capitalize truncate">
                            {vehicle.fuelType.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA Line */}
                    <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">
                          Tarif Harian (All-In)
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading font-extrabold text-xl text-slate-900 tabular-nums">
                            {formatRupiah(vehicle.baseDailyRate)}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">/hari</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Deposit {formatRupiah(vehicle.securityDeposit)} (Kembali 100%)</span>
                        </div>
                      </div>

                      {/* Guest CTA Action */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setInterceptModalVehicle(vehicle)}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[44px]"
                        >
                          <span>Pesan</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Catalog Action */}
          <div className="text-center pt-4">
            <NextLink
              href="/cari"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[44px]"
            >
              <span>Lihat Seluruh Armada Tersedia di Jogja</span>
              <ChevronRight className="w-4 h-4" />
            </NextLink>
          </div>
        </div>
      </section>

      {/* 6. Titik Penjemputan Populer DIY Section */}
      <section id="titik-jemput" className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
              Lokasi Strategis DIY
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Antar-Jemput di Titik Kedatangan Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Mitra rental DriveO siap mengantarkan armada ke stasiun, bandara,
              atau hotel tempat Anda menginap di Yogyakarta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {YOGYAKARTA_PICKUP_SPOTS.map((spot) => (
              <div
                key={spot.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-sm text-slate-900">
                      {spot.name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {spot.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    {spot.description}
                  </p>
                  <div className="pt-1.5 flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-slate-600">Wilayah: {spot.area}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {spot.extraFee === 0 ? "Gratis Pengantaran" : `Biaya +${formatRupiah(spot.extraFee)}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Cara Kerja Alur Sewa 4 Langkah (How it Works) */}
      <section id="cara-kerja" className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
              Alur Transparan
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              4 Langkah Mudah Sewa Mobil Bergaransi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Tanpa prosedur berbelit-belit. Seluruh proses sewa terdokumentasi
              lengkap secara digital dari awal hingga selesai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-heading font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/20">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Pilih & Kunci Mobil
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih mobil impian Anda, tentukan titik jemput di Jogja, dan kunci
                slot pesanan agar tidak diambil penyewa lain.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-heading font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/20">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Bayar DP ke Escrow
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bayar uang muka (DP) melalui QRIS atau Virtual Account resmi. Dana
                ditahan aman di rekening penampung pihak ketiga berizin.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-heading font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/20">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Inspeksi Digital di Lokasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saat serah terima unit di stasiun/bandara, lakukan pelunasan dan isi
                checklist digital + foto 4 sisi sebelum kunci diterima.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-heading font-bold flex items-center justify-center text-sm shadow-md shadow-emerald-600/20">
                4
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Wisata & Deposit Kembali
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nikmati liburan keliling Yogyakarta. Kembalikan unit dan uang
                deposit jaminan dicairkan kembali 100% dalam waktu 24 jam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Host Callout Banner (Daftar Jadi Mitra Rental) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-12 text-white overflow-hidden shadow-2xl">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-bold text-amber-400 font-mono tracking-wider uppercase">
                Peluang Kemitraan Rental Lokal DIY
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                Punya Usaha Rental di Jogja? Bergabunglah dengan DriveO.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Digitalisasi operasional rental Anda dengan kalender terpadu, jaminan
                penyewa terverifikasi e-KYC anti-penggelapan, perlindungan sengketa,
                dan jangkauan ribuan wisatawan setiap bulannya.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <NextLink
                  href="/jadi-mitra"
                  className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-heading font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer min-h-[44px] flex items-center gap-2"
                >
                  <span>Daftar Menjadi Mitra Rental</span>
                  <ArrowRight className="w-4 h-4" />
                </NextLink>
                <NextLink
                  href="/bantuan"
                  className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer min-h-[44px] flex items-center"
                >
                  Pelajari Skema Kemitraan
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Floating Comparison Drawer (If any cars are selected) */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl bg-slate-900/95 backdrop-blur-xl text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
              {comparedIds.length}
            </span>
            <div className="text-xs">
              <span className="font-bold block">
                {comparedIds.length} Mobil Dipilih untuk Komparasi
              </span>
              <span className="text-[10px] text-slate-400">
                Bandingkan tarif, transmisi, & kapasitas berdampingan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setComparedIds([])}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
            <NextLink
              href={`/bandingkan?ids=${comparedIds.join(",")}`}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer min-h-[38px]"
            >
              <span>Bandingkan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>
        </div>
      )}

      {/* 10. Guest Authentication Intercept Modal */}
      {interceptModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 space-y-6 animate-in zoom-in-95 duration-200 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInterceptModalVehicle(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with car photo snippet */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
              <img
                src={interceptModalVehicle.thumbnailUrl}
                alt={interceptModalVehicle.name}
                className="w-16 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-blue-600 font-mono uppercase tracking-wider block">
                  Langkah Terakhir Pemesanan
                </span>
                <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 truncate">
                  {interceptModalVehicle.name}
                </h4>
                <span className="text-xs font-extrabold text-slate-700 tabular-nums">
                  {formatRupiah(interceptModalVehicle.baseDailyRate)}/hari
                </span>
              </div>
            </div>

            {/* Explanation why Login is Required */}
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-800">
                Untuk menjamin keamanan sewa lepas kunci dan garansi rekening
                escrow, Anda perlu masuk ke akun terlebih dahulu.
              </p>
              <ul className="space-y-1.5 text-slate-500 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kunci slot mobil langsung dari mitra terverifikasi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Uang muka dan deposit terlindungi garansi escrow</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <NextLink
                href={`/masuk?redirect=/pesan/${interceptModalVehicle.id}`}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all text-center flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
              >
                <span>Masuk ke Akun Terdaftar</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>

              <NextLink
                href={`/daftar?redirect=/pesan/${interceptModalVehicle.id}`}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs sm:text-sm transition-colors text-center flex items-center justify-center min-h-[44px] cursor-pointer"
              >
                <span>Daftar Akun Baru (1 Menit)</span>
              </NextLink>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              Data identitas Anda dilindungi sesuai standar UU Perlindungan Data
              Pribadi (UU PDP No. 27 Tahun 2022).
            </p>
          </div>
        </div>
      )}

      {/* 11. Comprehensive Compliant Footer */}
      <Footer />
    </div>
  );
}
