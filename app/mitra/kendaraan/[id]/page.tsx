"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MitraNav } from "@/components/mitra/mitra-nav";
import {
  useMitraVehicles,
  useMitraListings,
  getStnkTaxStatus,
} from "@/lib/store/vehicle-store";
import {
  Car,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Gauge,
  Calendar,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Tag,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function DetailKendaraanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { vehicles, updateVehicle, deleteVehicle, addServiceRecord } = useMitraVehicles();
  const { listings } = useMitraListings();

  const vehicle = vehicles.find((v) => v.id === resolvedParams.id);

  // Edit status modal / state
  const [selectedStatus, setSelectedStatus] = useState<string>(vehicle?.status || "TERSEDIA");
  const [statusFeedback, setStatusFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // New Service Record State
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [workshopName, setWorkshopName] = useState("Nasmoco Janti Toyota Yogyakarta");
  const [newOdometer, setNewOdometer] = useState<number>(vehicle ? (vehicle.odometerKm || 0) + 5000 : 20000);
  const [serviceDescription, setServiceDescription] = useState("Ganti oli mesin 0W-20 TMO, filter oli, balancing & spooring roda");
  const [serviceCost, setServiceCost] = useState<number>(1250000);

  // STNK Tax Date update state
  const [isEditingStnk, setIsEditingStnk] = useState(false);
  const [updatedStnkDate, setUpdatedStnkDate] = useState(vehicle?.stnkTaxExpiryDate || "2027-04-18");

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <MitraNav currentTab="kendaraan" />
        <main className="max-w-4xl mx-auto w-full px-4 py-16 text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Unit Kendaraan Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Armada dengan ID tersebut tidak terdaftar di akun mitra rental Anda.
          </p>
          <Link
            href="/mitra/kendaraan"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Armada</span>
          </Link>
        </main>
      </div>
    );
  }

  const stnkStatus = getStnkTaxStatus(vehicle.stnkTaxExpiryDate);
  const connectedListings = listings.filter((l) => l.vehicleId === vehicle.id);

  const handleStatusChange = (newStatus: "TERSEDIA" | "DALAM_SEWA" | "SERVIS_RUTIN" | "NONAKTIF") => {
    setStatusFeedback(null);
    const res = updateVehicle(vehicle.id, { status: newStatus });
    if (!res.success) {
      setStatusFeedback({ type: "error", message: res.error || "Gagal mengubah status unit." });
    } else {
      setSelectedStatus(newStatus);
      setStatusFeedback({ type: "success", message: `Status unit berhasil diperbarui menjadi ${newStatus}.` });
    }
  };

  const handleSaveStnkRenewal = () => {
    updateVehicle(vehicle.id, { stnkTaxExpiryDate: updatedStnkDate });
    setIsEditingStnk(false);
    setStatusFeedback({ type: "success", message: "Tanggal jatuh tempo pajak tahunan STNK berhasil diperbarui." });
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceRecord(vehicle.id, {
      workshopName,
      odometerKm: Number(newOdometer),
      description: serviceDescription,
      cost: Number(serviceCost),
      date: new Date().toISOString().split("T")[0],
    });
    setShowServiceForm(false);
    setStatusFeedback({ type: "success", message: "Histori servis rutin & pembaharuan odometer berhasil disimpan." });
  };

  const handleDeleteUnit = () => {
    if (confirm(`Yakin ingin menghapus unit ${vehicle.licensePlate} (${vehicle.name}) dari inventaris?`)) {
      const res = deleteVehicle(vehicle.id);
      if (!res.success) {
        alert(res.error);
      } else {
        router.push("/mitra/kendaraan");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav currentTab="kendaraan" />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/mitra/kendaraan" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Katalog Armada</span>
            </Link>
            <span>/</span>
            <span className="font-mono text-slate-800 font-bold">{vehicle.licensePlate}</span>
          </div>

          <Link
            href={`/mitra/listing/baru?vehicleId=${vehicle.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Buat Listing Baru</span>
          </Link>
        </div>

        {/* Feedback Alert */}
        {statusFeedback && (
          <div
            className={`p-4 rounded-xl border text-sm flex items-start gap-2.5 ${
              statusFeedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            {statusFeedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-xs">{statusFeedback.message}</p>
            </div>
          </div>
        )}

        {/* Top Vehicle Hero Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Vehicle Image Banner */}
            <div className="relative h-64 md:h-full bg-slate-100 min-h-[220px]">
              <Image
                src={vehicle.thumbnailUrl}
                alt={vehicle.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-slate-950/90 text-white font-mono font-black text-sm px-3 py-1 rounded-md border border-white/20 shadow-md">
                  {vehicle.licensePlate}
                </span>
              </div>
            </div>

            {/* Main Info */}
            <div className="p-6 md:col-span-2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {vehicle.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    Tahun {vehicle.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 font-mono">
                    {vehicle.transmission}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {vehicle.fuelType}
                  </span>
                </div>

                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {vehicle.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>Lokasi Garasi: <strong>{vehicle.garageAddress}</strong></span>
                  <span>•</span>
                  <span>Wilayah: <strong>{vehicle.city} ({vehicle.district})</strong></span>
                </p>
              </div>

              {/* Status Selector with 409 Guard */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status Operasional Armada Saat Ini:
                  </span>
                  {vehicle.status === "DALAM_SEWA" && (
                    <span className="text-[11px] font-semibold text-blue-700 flex items-center gap-1 bg-blue-100/70 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      Sedang Aktif Disewa Pelanggan
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "TERSEDIA", label: "Tersedia", icon: CheckCircle2, color: "hover:bg-emerald-50 text-emerald-700" },
                    { id: "DALAM_SEWA", label: "Dalam Sewa", icon: Clock, color: "hover:bg-blue-50 text-blue-700", disabled: true },
                    { id: "SERVIS_RUTIN", label: "Servis Rutin", icon: Wrench, color: "hover:bg-amber-50 text-amber-700" },
                    { id: "NONAKTIF", label: "Nonaktifkan", icon: AlertTriangle, color: "hover:bg-slate-100 text-slate-700" },
                  ].map((s) => {
                    const isSelected = vehicle.status === s.id;
                    const isDisabled = vehicle.status === "DALAM_SEWA" && s.id !== "DALAM_SEWA";
                    const Icon = s.icon;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        disabled={isDisabled || s.disabled}
                        onClick={() => handleStatusChange(s.id as any)}
                        className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[40px] ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                            : `${s.color} bg-white border-slate-200`
                        } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>

                {vehicle.status === "DALAM_SEWA" && (
                  <p className="text-[11px] text-blue-800 bg-blue-50/80 p-2 rounded-lg border border-blue-200 mt-2">
                    Proteksi Status (Error 409): Kendaraan sedang dalam durasi sewa aktif pelanggan. Status unit dikunci hingga penyewa mengembalikan armada dan berita acara serah terima pengembalian divalidasi.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid: STNK & Odometer / Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: STNK & Legalitas DIY (BR-023) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Legalitas & Pajak STNK DIY</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingStnk(!isEditingStnk)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingStnk ? "Batal" : "Perbarui Pajak"}</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Nomor Seri STNK:</span>
                <span className="font-mono font-bold text-slate-800">{vehicle.stnkNumber || "STNK-DIY-2024-88491"}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Jatuh Tempo Pajak Tahunan:</span>
                <span className="font-mono font-bold text-slate-800">{vehicle.stnkTaxExpiryDate || "2027-04-18"}</span>
              </div>

              {/* Status Alert Badge */}
              <div className="pt-1">
                {stnkStatus.status === "BERLAKU" && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pajak STNK aktif dan memenuhi syarat sewa legal wilayah DIY.</span>
                  </div>
                )}
                {stnkStatus.status === "SEGERA_HABIS" && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Pajak STNK jatuh tempo dalam <strong>{stnkStatus.daysRemaining} hari</strong>. Segera perpanjang di Samsat DIY.</span>
                  </div>
                )}
                {stnkStatus.status === "KADALUWARSA" && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Pajak STNK telah kadaluwarsa! Sesuai BR-023, unit tidak dapat dipublikasikan di marketplace.</span>
                  </div>
                )}
              </div>

              {/* Inline Edit STNK Date */}
              {isEditingStnk && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">Tanggal Pajak Baru Paska Perpanjangan:</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={updatedStnkDate}
                      onChange={(e) => setUpdatedStnkDate(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleSaveStnkRenewal}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Checklist Kelengkapan Unit */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-2">Checklist Kelengkapan Darurat:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Ban Cadangan (Serep)", ok: vehicle.equipmentChecklist?.hasSpareTire ?? true },
                  { label: "Dongkrak Mobil", ok: vehicle.equipmentChecklist?.hasJack ?? true },
                  { label: "Segitiga Pengaman", ok: vehicle.equipmentChecklist?.hasWarningTriangle ?? true },
                  { label: "Kotak P3K Darurat", ok: vehicle.equipmentChecklist?.hasFirstAidKit ?? true },
                  { label: "Kunci Roda & Tool kit", ok: vehicle.equipmentChecklist?.hasToolKit ?? true },
                  { label: "APAR Mini 1 Kg", ok: vehicle.equipmentChecklist?.hasFireExtinguisher ?? true },
                ].map((eq, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-700">
                    {eq.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{eq.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 2: Odometer & Histori Servis Berkala */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Histori Servis & Odometer</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowServiceForm(!showServiceForm)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Servis</span>
              </button>
            </div>

            {/* Odometer Gauges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Odometer Terkini</span>
                <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                  {vehicle.odometerKm?.toLocaleString("id-ID") || 0} KM
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Target Servis Berikut</span>
                <span className="text-lg font-black text-blue-600 font-mono tabular-nums">
                  {vehicle.nextServiceKm?.toLocaleString("id-ID") || "20.000"} KM
                </span>
              </div>
            </div>

            {/* Inline Service Logging Form */}
            {showServiceForm && (
              <form onSubmit={handleAddService} className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                <h3 className="text-xs font-bold text-blue-900">Catat Servis Rutin Baru</h3>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">Nama Bengkel Resmi:</label>
                  <input
                    type="text"
                    value={workshopName}
                    onChange={(e) => setWorkshopName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">Odometer Saat Ini (KM):</label>
                    <input
                      type="number"
                      value={newOdometer}
                      onChange={(e) => setNewOdometer(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700">Biaya Servis (Rp):</label>
                    <input
                      type="number"
                      value={serviceCost}
                      onChange={(e) => setServiceCost(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">Uraian Pekerjaan Servis:</label>
                  <input
                    type="text"
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowServiceForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 bg-white border rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Simpan Catatan Servis
                  </button>
                </div>
              </form>
            )}

            {/* Service Logs List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Riwayat Pemeliharaan:</span>
              {vehicle.serviceHistory && vehicle.serviceHistory.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {vehicle.serviceHistory.map((s) => (
                    <div key={s.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{s.workshopName}</span>
                        <span className="font-mono text-slate-600">Rp {s.cost.toLocaleString("id-ID")}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{s.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>{s.date}</span>
                        <span>{s.odometerKm.toLocaleString("id-ID")} KM</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Belum ada catatan servis tercatat.</p>
              )}
            </div>
          </div>
        </div>

        {/* Connected Marketplace Listings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Listing Marketplace Terhubung</h2>
            </div>
            <Link
              href={`/mitra/listing/baru?vehicleId=${vehicle.id}`}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Listing Tambahan</span>
            </Link>
          </div>

          {connectedListings.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">Unit armada ini belum dipublikasikan ke marketplace DriveO.</p>
              <Link
                href={`/mitra/listing/baru?vehicleId=${vehicle.id}`}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Buat Listing Sekarang</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connectedListings.map((listing) => (
                <div key={listing.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{listing.vehicleName}</span>
                    <span className="text-[11px] text-slate-500">
                      Tarif: <strong className="font-mono text-slate-800">Rp {listing.baseDailyRate.toLocaleString("id-ID")}</strong> / hari
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      listing.status === "AKTIF" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {listing.status}
                    </span>
                    <Link
                      href={`/mitra/listing/${listing.id}`}
                      className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                    >
                      Kelola
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Danger Zone: Hapus Armada */}
        <div className="bg-rose-50/40 rounded-2xl p-6 border border-rose-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-rose-900">Hapus Unit Armada</h2>
            <p className="text-xs text-rose-700 mt-0.5">
              Menghapus unit akan melepaskan armada dari katalog inventaris Anda. Mobil yang sedang disewa tidak dapat dihapus.
            </p>
          </div>
          <button
            type="button"
            disabled={vehicle.status === "DALAM_SEWA"}
            onClick={handleDeleteUnit}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              vehicle.status === "DALAM_SEWA"
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Armada</span>
          </button>
        </div>
      </main>
    </div>
  );
}
