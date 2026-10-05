"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MitraNav } from "@/components/mitra/mitra-nav";
import {
  useMitraVehicles,
  validatePlatAB,
} from "@/lib/store/vehicle-store";
import { useMitra } from "@/lib/store/mitra-store";
import {
  VehicleCategory,
  VehicleTransmission,
  VehicleFuelType,
} from "@/types/domain";
import {
  Car,
  ChevronRight,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Gauge,
  Camera,
  Layers,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function TambahKendaraanPage() {
  const router = useRouter();
  const { addVehicle } = useMitraVehicles();
  const { profile } = useMitra();

  // Form State
  const [brand, setBrand] = useState("Toyota");
  const [model, setModel] = useState("All New Yaris Cross 1.5 S HV");
  const [year, setYear] = useState(2024);
  const [category, setCategory] = useState<VehicleCategory>("SUV");
  const [transmission, setTransmission] = useState<VehicleTransmission>("CVT");
  const [fuelType, setFuelType] = useState<VehicleFuelType>("HYBRID");
  const [seatingCapacity, setSeatingCapacity] = useState(5);
  const [luggageCapacity, setLuggageCapacity] = useState(3);
  const [engineCapacityCc, setEngineCapacityCc] = useState(1496);
  const [odometerKm, setOdometerKm] = useState(12500);

  // License Plate (Plat AB DIY)
  const [licensePlate, setLicensePlate] = useState("AB 1450 YZ");
  const plateValidation = validatePlatAB(licensePlate);

  // STNK
  const [stnkNumber, setStnkNumber] = useState("STNK-DIY-2024-99812");
  const [stnkTaxExpiryDate, setStnkTaxExpiryDate] = useState("2027-06-30");
  const [stnkPhotoUploaded, setStnkPhotoUploaded] = useState(true);

  // Equipment Checklist
  const [hasSpareTire, setHasSpareTire] = useState(true);
  const [hasJack, setHasJack] = useState(true);
  const [hasWarningTriangle, setHasWarningTriangle] = useState(true);
  const [hasFirstAidKit, setHasFirstAidKit] = useState(true);
  const [hasToolKit, setHasToolKit] = useState(true);
  const [hasFireExtinguisher, setHasFireExtinguisher] = useState(true);

  // Selected Features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Toyota Safety Sense (TSS)",
    "Panoramic Glass Roof",
    "Wireless Apple CarPlay & Android Auto",
    "Kamera 360 Panoramic View",
    "Electric Power Tailgate with Kick Sensor",
  ]);

  // Gallery Photos
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!plateValidation.isValid) {
      setErrorMessage("Nomor plat harus sesuai standar Plat AB DIY (contoh: AB 1234 XY).");
      return;
    }

    if (!stnkNumber.trim() || !stnkTaxExpiryDate) {
      setErrorMessage("Data nomor seri STNK dan tanggal jatuh tempo pajak wajib diisi.");
      return;
    }

    const expiryTime = new Date(stnkTaxExpiryDate).getTime();
    if (isNaN(expiryTime) || expiryTime < Date.now()) {
      setErrorMessage("Masa berlaku pajak STNK tidak boleh sudah kadaluwarsa (BR-023).");
      return;
    }

    setIsSubmitting(true);

    const vehicleName = `${brand} ${model} ${year}`;
    const newUnit = addVehicle({
      rentalId: profile.id,
      rentalName: profile.businessName,
      rentalRating: 4.95,
      rentalCompletedBookings: 0,
      name: vehicleName,
      brand,
      model,
      year: Number(year),
      licensePlate: licensePlate.toUpperCase().trim(),
      category,
      transmission,
      fuelType,
      seatingCapacity: Number(seatingCapacity),
      luggageCapacity: Number(luggageCapacity),
      engineCapacityCc: Number(engineCapacityCc),
      features: selectedFeatures,
      thumbnailUrl,
      galleryImages,
      status: "TERSEDIA",
      baseDailyRate: 500000,
      securityDeposit: 200000,
      deliveryFee: 0,
      city: profile.city || "Kota Yogyakarta",
      district: profile.district || "Gedongtengen",
      garageAddress: profile.address || "Jl. Malioboro No. 42",
      lastUpdatedAt: new Date().toISOString(),
      stnkNumber,
      stnkTaxExpiryDate,
      stnkPhotoUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      odometerKm: Number(odometerKm),
      nextServiceKm: Number(odometerKm) + 5000,
      nextServiceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      equipmentChecklist: {
        hasSpareTire,
        hasJack,
        hasWarningTriangle,
        hasFirstAidKit,
        hasToolKit,
        hasFireExtinguisher,
      },
      serviceHistory: [
        {
          id: `srv-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          workshopName: "Inspeksi Pendaftaran Mitra DriveO Jogja",
          odometerKm: Number(odometerKm),
          description: "Inspeksi kelayakan armada 21 titik uji laik jalan & kelengkapan darurat",
          cost: 0,
        },
      ],
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/mitra/kendaraan/${newUnit.id}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav currentTab="kendaraan" />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/mitra/kendaraan" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog Armada</span>
          </Link>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Tambah Unit Mobil Baru</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                FR-KENDARAAN-001 • BR-021 (Plat AB)
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Registrasi Armada Mobil Baru
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Daftarkan mobil operasional rental Anda. Pastikan unit memiliki plat nomor Daerah Istimewa Yogyakarta (Plat AB) dan pajak tahunan STNK aktif.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
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
          {/* SECTION 1: Identifikasi Plat Nomor AB (BR-021) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">1. Identitas Kendaraan & Plat Nomor AB</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor Polisi (Plat AB Yogyakarta) *
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="AB 1234 XY"
                    className="w-full uppercase font-mono font-bold tracking-wider px-4 py-2.5 bg-slate-900 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    required
                  />
                </div>
                <div className="text-xs">
                  {plateValidation.isValid ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Terverifikasi Wilayah: {plateValidation.areaDescription}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      {plateValidation.error}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Sesuai aturan BR-021, seluruh armada yang terdaftar di DriveO wajib menggunakan kode Plat AB Daerah Istimewa Yogyakarta.
              </p>
            </div>

            {/* Merk & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Merk Mobil *</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                >
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Daihatsu">Daihatsu</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Wuling">Wuling</option>
                  <option value="Kia">Kia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Model & Varian *</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Contoh: All New Avanza 1.5 G TSS"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Perakitan *</label>
                <input
                  type="number"
                  min={2018}
                  max={2026}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                  required
                />
              </div>
            </div>

            {/* Kategori, Transmisi, Bahan Bakar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Mobil *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                >
                  <option value="MPV">MPV (Mobil Keluarga)</option>
                  <option value="SUV">SUV (Ground Clearance Tinggi)</option>
                  <option value="CITY_CAR">City Car (Ringkas & Lincah)</option>
                  <option value="EV">EV (Kendaraan Listrik)</option>
                  <option value="COMMERCIAL">Komersial / Van</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transmisi *</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as VehicleTransmission)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                >
                  <option value="CVT">CVT (Continuous Variable)</option>
                  <option value="AUTOMATIC">Otomatis (AT Konvensional)</option>
                  <option value="MANUAL">Manual (MT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Bahan Bakar *</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as VehicleFuelType)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                >
                  <option value="BENSIN">Bensin (Pertalite / Pertamax)</option>
                  <option value="HYBRID">Hybrid (Bensin + Motor Listrik)</option>
                  <option value="DIESEL">Diesel (Dexlite / Pertamina Dex)</option>
                  <option value="LISTRIK">Listrik Murni (EV)</option>
                </select>
              </div>
            </div>

            {/* Kapasitas Penumpang, Bagasi & Odometer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kapasitas Kursi</label>
                <input
                  type="number"
                  min={2}
                  max={15}
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kapasitas Koper Bagasi</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={luggageCapacity}
                  onChange={(e) => setLuggageCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Odometer Terkini (KM)</label>
                <input
                  type="number"
                  min={0}
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Validasi Pajak STNK & Samsat DIY (BR-023) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">2. Validasi Legalitas STNK & Pajak Tahunan (BR-023)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Registrasi / Seri STNK *</label>
                <input
                  type="text"
                  value={stnkNumber}
                  onChange={(e) => setStnkNumber(e.target.value)}
                  placeholder="Contoh: STNK-DIY-2024-xxxx"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jatuh Tempo Pajak Tahunan STNK *
                </label>
                <input
                  type="date"
                  value={stnkTaxExpiryDate}
                  onChange={(e) => setStnkTaxExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
                  required
                />
              </div>
            </div>

            {/* STNK Photo Upload Simulator */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Foto Lembar Pajak STNK Asli Terbaca Jelas *
              </label>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {stnkPhotoUploaded ? "stnk-kendaraan-ab-asli.jpg (Terlampir)" : "Unggah foto fisik STNK"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Format JPG/PNG/PDF, maksimum 5MB. Pastikan nomor rangka & masa berlaku pajak terbaca.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStnkPhotoUploaded(true)}
                  className="px-3.5 py-2 text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer min-h-[38px]"
                >
                  {stnkPhotoUploaded ? "Ganti Foto" : "Pilih Dokumen"}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: Checklist Kelengkapan Standar Keselamatan DIY */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">3. Checklist Kelengkapan & Keselamatan Operasional</h2>
            </div>
            <p className="text-xs text-slate-500">
              Standar serah terima DriveO mewajibkan seluruh alat bantu darurat dalam kondisi siap pakai:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Ban Cadangan (Serep)", checked: hasSpareTire, toggle: () => setHasSpareTire(!hasSpareTire) },
                { label: "Dongkrak Mobil", checked: hasJack, toggle: () => setHasJack(!hasJack) },
                { label: "Segitiga Pengaman", checked: hasWarningTriangle, toggle: () => setHasWarningTriangle(!hasWarningTriangle) },
                { label: "Kotak P3K Standar", checked: hasFirstAidKit, toggle: () => setHasFirstAidKit(!hasFirstAidKit) },
                { label: "Kunci Roda & Tool kit", checked: hasToolKit, toggle: () => setHasToolKit(!hasToolKit) },
                { label: "APAR Mini 1 Kg", checked: hasFireExtinguisher, toggle: () => setHasFireExtinguisher(!hasFireExtinguisher) },
              ].map((item, idx) => (
                <label
                  key={idx}
                  onClick={item.toggle}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors select-none ${
                    item.checked
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-900 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SECTION 4: Fitur & Fasilitas Unggulan */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">4. Fitur & Daya Tarik Kendaraan</h2>
            </div>
            <p className="text-xs text-slate-500">
              Pilih fitur yang tersedia pada unit ini agar tampil memikat di katalog penyewa:
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Toyota Safety Sense (TSS)",
                "Honda Sensing ADAS",
                "Panoramic Glass Roof",
                "Captain Seat Ottoman",
                "Wireless Apple CarPlay & Android Auto",
                "Kamera 360 Panoramic View",
                "Electric Power Tailgate with Kick Sensor",
                "Drive Mode (Wet/Gravel/Eco/Sport)",
                "ISOFIX Child Seat Support",
                "V2L Power 220V Outlets",
                "Dual Zone AC with Nanoe-X",
                "Cruise Control & Lane Keep Assist",
              ].map((feature) => {
                const isSelected = selectedFeatures.includes(feature);
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[38px] ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                    }`}
                  >
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/mitra/kendaraan"
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
                  <span>Menyimpan Armada...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan & Daftarkan Unit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
