"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MitraNav } from "@/components/mitra/mitra-nav";
import {
  useMitraVehicles,
  getStnkTaxStatus,
} from "@/lib/store/vehicle-store";
import {
  Car,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Gauge,
  ChevronRight,
  ShieldCheck,
  Tag,
  SlidersHorizontal,
  FileText,
  Calendar,
} from "lucide-react";

export default function MitraKendaraanPage() {
  const { vehicles } = useMitraVehicles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Summary counts
  const stats = useMemo(() => {
    let available = 0;
    let rented = 0;
    let maintenance = 0;
    let inactive = 0;
    let stnkExpiringSoon = 0;

    vehicles.forEach((v) => {
      if (v.status === "TERSEDIA") available++;
      else if (v.status === "DALAM_SEWA") rented++;
      else if (v.status === "SERVIS_RUTIN") maintenance++;
      else if (v.status === "NONAKTIF") inactive++;

      const stnk = getStnkTaxStatus(v.stnkTaxExpiryDate);
      if (stnk.status === "SEGERA_HABIS" || stnk.status === "KADALUWARSA") {
        stnkExpiringSoon++;
      }
    });

    return {
      total: vehicles.length,
      available,
      rented,
      maintenance,
      inactive,
      stnkExpiringSoon,
    };
  }, [vehicles]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === "ALL" ? true : v.status === selectedStatus;

      const matchCategory =
        selectedCategory === "ALL" ? true : v.category === selectedCategory;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [vehicles, searchQuery, selectedStatus, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      {/* Navigation */}
      <MitraNav
        currentTab="kendaraan"
        actionButton={
          <Link
            href="/mitra/kendaraan/baru"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors min-h-[38px]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Armada Baru</span>
          </Link>
        }
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>Portal Mitra</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 font-semibold">Manajemen Armada Plat AB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Inventaris Armada Plat AB
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola unit kendaraan berizin wilayah DI Yogyakarta, masa aktif pajak STNK, status operasional, dan histori servis berkala.
            </p>
          </div>

          <Link
            href="/mitra/kendaraan/baru"
            className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mobil Baru</span>
          </Link>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Total Armada Terdaftar</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{stats.total}</span>
              <span className="text-xs text-slate-500">Unit</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <Car className="w-3 h-3 text-slate-400" />
              <span>Plat AB Yogyakarta</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700 block">Unit Tersedia</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600 font-mono tabular-nums">{stats.available}</span>
              <span className="text-xs text-slate-500">Siap Sewa</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Siap menerima booking</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-blue-700 block">Dalam Sewa</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-blue-600 font-mono tabular-nums">{stats.rented}</span>
              <span className="text-xs text-slate-500">Di Jalan</span>
            </div>
            <div className="mt-2 text-[11px] text-blue-600 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>Proteksi 409 status aktif</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-amber-700 block">Servis / Perbaikan</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-600 font-mono tabular-nums">{stats.maintenance}</span>
              <span className="text-xs text-slate-500">Bengkel</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-600 flex items-center gap-1 font-medium">
              <Wrench className="w-3 h-3 text-amber-500" />
              <span>Maintenance rutin</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200/90 bg-amber-50/30 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-xs font-semibold text-amber-800 block">Pajak STNK &lt; 30 Hari</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-700 font-mono tabular-nums">{stats.stnkExpiringSoon}</span>
              <span className="text-xs text-amber-600">Unit</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-700 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Perlu perpanjangan Samsat</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari plat nomor (mis. AB 1001), nama mobil, atau tipe..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[44px]"
              />
            </div>

            {/* Status Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: "ALL", label: "Semua Status" },
                { id: "TERSEDIA", label: "Tersedia" },
                { id: "DALAM_SEWA", label: "Dalam Sewa" },
                { id: "SERVIS_RUTIN", label: "Servis" },
                { id: "NONAKTIF", label: "Nonaktif" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStatus(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] cursor-pointer ${
                    selectedStatus === filter.id
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

        {/* Vehicles Grid / Table View */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
              <Car className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tidak ada armada yang sesuai</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter status armada Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("ALL");
                setSelectedCategory("ALL");
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVehicles.map((vehicle) => {
              const stnkStatus = getStnkTaxStatus(vehicle.stnkTaxExpiryDate);

              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Card Image & Overlay Badges */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={vehicle.thumbnailUrl}
                      alt={vehicle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/20" />

                    {/* Top Plate AB Badge (Indonesian License Plate style) */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-slate-950/90 backdrop-blur-md text-white font-mono font-black text-xs tracking-wider px-3 py-1 rounded-md border border-white/20 shadow-md">
                        {vehicle.licensePlate}
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3">
                      {vehicle.status === "TERSEDIA" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          Tersedia
                        </span>
                      )}
                      {vehicle.status === "DALAM_SEWA" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-xs">
                          <Clock className="w-3 h-3" />
                          Dalam Sewa
                        </span>
                      )}
                      {vehicle.status === "SERVIS_RUTIN" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                          <Wrench className="w-3 h-3" />
                          Servis Rutin
                        </span>
                      )}
                      {vehicle.status === "NONAKTIF" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-600 text-white shadow-xs">
                          Nonaktif
                        </span>
                      )}
                    </div>

                    {/* Bottom Specs Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-semibold">{vehicle.year} • {vehicle.category}</span>
                      <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-md font-mono text-[11px]">
                        {vehicle.transmission}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {vehicle.name}
                      </h2>

                      {/* Technical Specs Indicators */}
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Gauge className="w-3.5 h-3.5 text-blue-600" />
                          <span>Odo: <strong className="font-mono text-slate-800">{vehicle.odometerKm?.toLocaleString("id-ID") || 0} KM</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Car className="w-3.5 h-3.5 text-blue-600" />
                          <span>Kapasitas: <strong className="text-slate-800">{vehicle.seatingCapacity} Kursi</strong></span>
                        </div>
                      </div>

                      {/* STNK Tax Status Badge (BR-023) */}
                      <div className="mt-3">
                        {stnkStatus.status === "BERLAKU" && (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">Pajak STNK aktif s.d. <strong>{vehicle.stnkTaxExpiryDate}</strong></span>
                          </div>
                        )}
                        {stnkStatus.status === "SEGERA_HABIS" && (
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Pajak STNK jatuh tempo <strong>dlm {stnkStatus.daysRemaining} hari</strong></span>
                          </div>
                        )}
                        {stnkStatus.status === "KADALUWARSA" && (
                          <div className="flex items-center gap-1.5 text-[11px] text-rose-800 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Pajak STNK mati! Unit tidak boleh disewakan</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/mitra/kendaraan/${vehicle.id}`}
                        className="flex-1 text-center py-2 px-3 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 hover:border-blue-200 rounded-lg border border-transparent transition-all min-h-[38px] flex items-center justify-center gap-1"
                      >
                        <span>Kelola Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/mitra/listing/baru?vehicleId=${vehicle.id}`}
                        title="Buat listing sewa baru di marketplace dengan mobil ini"
                        className="px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors min-h-[38px] flex items-center gap-1"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Listing</span>
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
