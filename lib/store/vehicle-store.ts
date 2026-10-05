"use client";

import { useSyncExternalStore } from "react";
import { Vehicle, MarketplaceListing, SpotDeliveryRate, ListingStatus } from "@/types/domain";
import { YOGYAKARTA_PICKUP_SPOTS } from "@/lib/mock-data/yogyakarta";

const VEHICLES_STORAGE_KEY = "driveo_mitra_vehicles_v1";
const LISTINGS_STORAGE_KEY = "driveo_mitra_listings_v1";

// Default seed vehicles for Mitra Tugu Rent Jogja (Plat AB)
export const INITIAL_MITRA_VEHICLES: Vehicle[] = [
  {
    id: "veh-tugu-01",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    rentalRating: 4.97,
    rentalCompletedBookings: 642,
    name: "Toyota Innova Zenix 2.0 Q Hybrid TSS 2024",
    brand: "Toyota",
    model: "Innova Zenix Hybrid",
    year: 2024,
    licensePlate: "AB 1001 QZ", // Sleman / Kota
    category: "MPV",
    transmission: "CVT",
    fuelType: "HYBRID",
    seatingCapacity: 7,
    luggageCapacity: 4,
    engineCapacityCc: 1987,
    features: [
      "Toyota Safety Sense 3.0",
      "Panoramic Sunroof",
      "Captain Seat Ottoman Elektrik",
      "Wireless Apple CarPlay & Android Auto",
      "Kamera 360 Derajat",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    ],
    status: "TERSEDIA",
    baseDailyRate: 650000,
    securityDeposit: 250000,
    deliveryFee: 0,
    city: "Kota Yogyakarta",
    district: "Gedongtengen",
    garageAddress: "Jl. Sosrowijayan No. 42 (Dekat Stasiun Tugu)",
    lastUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isPopular: true,
    stnkNumber: "STNK-DIY-2024-88491",
    stnkTaxExpiryDate: "2027-04-18",
    stnkPhotoUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    odometerKm: 18450,
    nextServiceKm: 20000,
    nextServiceDate: "2026-11-15",
    equipmentChecklist: {
      hasSpareTire: true,
      hasJack: true,
      hasWarningTriangle: true,
      hasFirstAidKit: true,
      hasToolKit: true,
      hasFireExtinguisher: true,
    },
    serviceHistory: [
      {
        id: "srv-01",
        date: "2026-08-10",
        workshopName: "Nasmoco Toyota Janti Yogyakarta",
        odometerKm: 15120,
        description: "Servis berkala 15.000 KM, ganti oli mesin 0W-20 TMO, rotasi ban, cek sistem TSS",
        cost: 1450000,
      },
    ],
  },
  {
    id: "veh-tugu-02",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    rentalRating: 4.97,
    rentalCompletedBookings: 642,
    name: "Toyota All New Avanza 1.5 G CVT TSS 2023",
    brand: "Toyota",
    model: "All New Avanza",
    year: 2023,
    licensePlate: "AB 1234 XY",
    category: "MPV",
    transmission: "CVT",
    fuelType: "BENSIN",
    seatingCapacity: 7,
    luggageCapacity: 3,
    engineCapacityCc: 1496,
    features: [
      "Sofa Mode Interior Nyaman",
      "Toyota Safety Sense (TSS)",
      "Rear Parking Camera & Sensor",
      "Irit BBM Konsumsi 1:16 KM/L",
      "AC Double Blower Dingin Merata",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
    status: "DALAM_SEWA",
    baseDailyRate: 400000,
    securityDeposit: 150000,
    deliveryFee: 0,
    city: "Kota Yogyakarta",
    district: "Gedongtengen",
    garageAddress: "Jl. Sosrowijayan No. 42",
    lastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isPopular: true,
    stnkNumber: "STNK-DIY-2023-11029",
    stnkTaxExpiryDate: "2026-10-25", // Segera jatuh tempo (< 30 hari dari 5 Okt 2026)
    stnkPhotoUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    odometerKm: 42100,
    nextServiceKm: 45000,
    nextServiceDate: "2026-11-30",
    equipmentChecklist: {
      hasSpareTire: true,
      hasJack: true,
      hasWarningTriangle: true,
      hasFirstAidKit: true,
      hasToolKit: true,
      hasFireExtinguisher: true,
    },
    serviceHistory: [
      {
        id: "srv-02",
        date: "2026-07-02",
        workshopName: "Nasmoco Mlati Sleman",
        odometerKm: 39800,
        description: "Servis berkala 40.000 KM, tune up mesin, ganti filter AC & kampas rem depan",
        cost: 2100000,
      },
    ],
  },
  {
    id: "veh-tugu-03",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    rentalRating: 4.97,
    rentalCompletedBookings: 642,
    name: "Mitsubishi Xpander Ultimate CVT 2024",
    brand: "Mitsubishi",
    model: "Xpander Ultimate",
    year: 2024,
    licensePlate: "AB 1782 FA",
    category: "MPV",
    transmission: "CVT",
    fuelType: "BENSIN",
    seatingCapacity: 7,
    luggageCapacity: 3,
    engineCapacityCc: 1499,
    features: [
      "Ground Clearance 220mm",
      "Electric Parking Brake & Auto Hold",
      "Wireless Charger",
      "Suspensi Halus Senyaman Sedan",
      "Cruise Control",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    ],
    status: "SERVIS_RUTIN",
    baseDailyRate: 450000,
    securityDeposit: 200000,
    deliveryFee: 0,
    city: "Kota Yogyakarta",
    district: "Gedongtengen",
    garageAddress: "Jl. Sosrowijayan No. 42",
    lastUpdatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isPopular: false,
    stnkNumber: "STNK-DIY-2024-34901",
    stnkTaxExpiryDate: "2027-02-14",
    stnkPhotoUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    odometerKm: 28900,
    nextServiceKm: 30000,
    nextServiceDate: "2026-10-08",
    equipmentChecklist: {
      hasSpareTire: true,
      hasJack: true,
      hasWarningTriangle: true,
      hasFirstAidKit: true,
      hasToolKit: true,
      hasFireExtinguisher: false,
    },
    serviceHistory: [
      {
        id: "srv-03",
        date: "2026-05-18",
        workshopName: "Mitsubishi Borobudur Motors Magelang",
        odometerKm: 20100,
        description: "Penggantian kampas rem belakang dan kuras minyak rem",
        cost: 1650000,
      },
    ],
  },
  {
    id: "veh-tugu-04",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    rentalRating: 4.97,
    rentalCompletedBookings: 642,
    name: "Honda Brio RS CVT 2023",
    brand: "Honda",
    model: "Brio RS",
    year: 2023,
    licensePlate: "AB 1899 TK",
    category: "CITY_CAR",
    transmission: "CVT",
    fuelType: "BENSIN",
    seatingCapacity: 5,
    luggageCapacity: 2,
    engineCapacityCc: 1199,
    features: [
      "Irit BBM Kota Jogja",
      "Lincah Parkir di Kawasan Padat",
      "Audio Touchscreen Bluetooth",
      "Sporty Alloy Wheels",
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    ],
    status: "TERSEDIA",
    baseDailyRate: 350000,
    securityDeposit: 150000,
    deliveryFee: 0,
    city: "Kota Yogyakarta",
    district: "Gedongtengen",
    garageAddress: "Jl. Sosrowijayan No. 42",
    lastUpdatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isPopular: false,
    stnkNumber: "STNK-DIY-2023-77182",
    stnkTaxExpiryDate: "2027-08-20",
    odometerKm: 34100,
    nextServiceKm: 40000,
    nextServiceDate: "2027-01-10",
    equipmentChecklist: {
      hasSpareTire: true,
      hasJack: true,
      hasWarningTriangle: true,
      hasFirstAidKit: true,
      hasToolKit: true,
      hasFireExtinguisher: true,
    },
  },
];

// Initial Marketplace Listings (including one STALE listing > 7 days to showcase BR-027)
export const INITIAL_MITRA_LISTINGS: MarketplaceListing[] = [
  {
    id: "list-zenix-01",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    vehicleId: "veh-tugu-01",
    vehicleName: "Toyota Innova Zenix 2.0 Q Hybrid TSS 2024",
    vehiclePlate: "AB 1001 QZ",
    vehicleCategory: "MPV",
    vehicleTransmission: "CVT",
    thumbnailUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    serviceType: "KEDUANYA",
    baseDailyRate: 650000,
    driverDailyRate: 200000,
    securityDeposit: 250000,
    weekendSurcharge: 50000,
    spotDeliveryRates: [
      { spotId: "spot-tugu", spotName: "Stasiun Tugu Yogyakarta", area: "Kota Yogyakarta", fee: 0, enabled: true },
      { spotId: "spot-lempuyangan", spotName: "Stasiun Lempuyangan", area: "Danurejan", fee: 0, enabled: true },
      { spotId: "spot-malioboro", spotName: "Malioboro Hotel Area", area: "Kota Yogyakarta", fee: 0, enabled: true },
      { spotId: "spot-yia", spotName: "Bandara YIA Kulon Progo", area: "Kulon Progo", fee: 100000, enabled: true },
    ],
    minimumRentalDays: 1,
    includedFacilities: [
      "Garansi Kebersihan Interior & Wangi",
      "Kabel Charger Universal Type-C & iPhone",
      "E-toll Card (Saldo Awal Rp 50.000)",
      "Dukungan Darurat 24 Jam di Wilayah DIY",
    ],
    rentalTerms: [
      "Wajib KTP Asli + SIM A aktif",
      "Khusus penyewa luar kota: tiket transportasi kedatangan / bukti booking hotel",
      "Dilarang merokok atau membawa hewan peliharaan di dalam kabin",
      "Area operasional resmi: Seluruh Daerah Istimewa Yogyakarta & sekitarnya",
    ],
    status: "AKTIF",
    lastFreshnessConfirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 hari lalu (Segar)
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "list-avanza-01",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    vehicleId: "veh-tugu-02",
    vehicleName: "Toyota All New Avanza 1.5 G CVT TSS 2023",
    vehiclePlate: "AB 1234 XY",
    vehicleCategory: "MPV",
    vehicleTransmission: "CVT",
    thumbnailUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    serviceType: "LEPAS_KUNCI",
    baseDailyRate: 400000,
    securityDeposit: 150000,
    weekendSurcharge: 25000,
    spotDeliveryRates: [
      { spotId: "spot-tugu", spotName: "Stasiun Tugu Yogyakarta", area: "Kota Yogyakarta", fee: 0, enabled: true },
      { spotId: "spot-lempuyangan", spotName: "Stasiun Lempuyangan", area: "Danurejan", fee: 0, enabled: true },
      { spotId: "spot-yia", spotName: "Bandara YIA Kulon Progo", area: "Kulon Progo", fee: 100000, enabled: true },
    ],
    minimumRentalDays: 1,
    includedFacilities: [
      "Unit Bersih Siap Pakai",
      "Phone Holder Dashboard",
      "Emergency Roadside Assistance DIY",
    ],
    rentalTerms: [
      "Wajib KTP Asli + SIM A",
      "Deposit jaminan Rp 150.000 dikembalikan maksimal 1x24 jam paska sewa",
    ],
    status: "AKTIF",
    lastFreshnessConfirmedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "list-xpander-01",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    vehicleId: "veh-tugu-03",
    vehicleName: "Mitsubishi Xpander Ultimate CVT 2024",
    vehiclePlate: "AB 1782 FA",
    vehicleCategory: "MPV",
    vehicleTransmission: "CVT",
    thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    serviceType: "KEDUANYA",
    baseDailyRate: 450000,
    driverDailyRate: 175000,
    securityDeposit: 200000,
    weekendSurcharge: 50000,
    spotDeliveryRates: [
      { spotId: "spot-tugu", spotName: "Stasiun Tugu Yogyakarta", area: "Kota Yogyakarta", fee: 0, enabled: true },
      { spotId: "spot-yia", spotName: "Bandara YIA Kulon Progo", area: "Kulon Progo", fee: 100000, enabled: true },
    ],
    minimumRentalDays: 1,
    includedFacilities: ["AC Dingin Merata", "Wireless Charger", "Payung Lipat Mobil"],
    rentalTerms: ["KTP & SIM A Asli", "Pengembalian tepat waktu toleransi 59 menit"],
    status: "KADALUWARSA_FRESHNESS", // STALE (> 7 hari tidak dikonfirmasi sesuai BR-027)
    lastFreshnessConfirmedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 hari lalu!
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "list-brio-01",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    vehicleId: "veh-tugu-04",
    vehicleName: "Honda Brio RS CVT 2023",
    vehiclePlate: "AB 1899 TK",
    vehicleCategory: "CITY_CAR",
    vehicleTransmission: "CVT",
    thumbnailUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    serviceType: "LEPAS_KUNCI",
    baseDailyRate: 350000,
    securityDeposit: 150000,
    weekendSurcharge: 25000,
    spotDeliveryRates: [
      { spotId: "spot-tugu", spotName: "Stasiun Tugu Yogyakarta", area: "Kota Yogyakarta", fee: 0, enabled: true },
      { spotId: "spot-lempuyangan", spotName: "Stasiun Lempuyangan", area: "Danurejan", fee: 0, enabled: true },
    ],
    minimumRentalDays: 1,
    includedFacilities: ["Kabel Charger", "Pengharum Mobil Alami Kopi Jogja"],
    rentalTerms: ["KTP & SIM A", "BBM kembali ke level yang sama"],
    status: "NONAKTIF_SEMENTARA",
    lastFreshnessConfirmedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: "2026-03-01T11:00:00Z",
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper: Hitung selisih hari Freshness Telemetry BR-027
export function getFreshnessInfo(lastConfirmedIso: string) {
  const diffMs = Date.now() - new Date(lastConfirmedIso).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const remainingDays = 7 - diffDays;
  const isStale = diffDays >= 7;
  const isWarning = diffDays >= 5 && diffDays < 7;

  return {
    diffDays,
    remainingDays: Math.max(0, remainingDays),
    isStale,
    isWarning,
  };
}

// Helper: Cek status masa pajak tahunan STNK BR-023
export function getStnkTaxStatus(taxExpiryIso?: string) {
  if (!taxExpiryIso) return { status: "TIDAK_DIKETAHUI" as const, daysRemaining: 0, label: "Belum Ada Data STNK" };
  const diffMs = new Date(taxExpiryIso).getTime() - Date.now();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { status: "KADALUWARSA" as const, daysRemaining, label: `Pajak Mati (${Math.abs(daysRemaining)} hari)` };
  }
  if (daysRemaining <= 30) {
    return { status: "SEGERA_HABIS" as const, daysRemaining, label: `Jatuh tempo dlm ${daysRemaining} hari` };
  }
  return { status: "BERLAKU" as const, daysRemaining, label: `Berlaku s.d. ${taxExpiryIso}` };
}

// Helper: Validasi format Plat AB Yogyakarta (BR-021)
export function validatePlatAB(plate: string): { isValid: boolean; areaDescription?: string; error?: string } {
  const trimmed = plate.trim().toUpperCase();
  const match = trimmed.match(/^AB\s*([1-9]\d{0,3})\s*([A-Z]{1,3})$/);
  if (!match) {
    return {
      isValid: false,
      error: "Format harus Plat AB Yogyakarta (contoh: AB 1234 XY atau AB 1001 QZ)",
    };
  }
  const suffix = match[2];
  const firstLetter = suffix[0];
  let area = "Daerah Istimewa Yogyakarta";
  if (["A", "H", "F"].includes(firstLetter)) area = "Kota Yogyakarta";
  else if (["B", "E", "N", "Q", "Y"].includes(firstLetter)) area = "Kabupaten Sleman";
  else if (["J", "K", "T"].includes(firstLetter)) area = "Kabupaten Bantul";
  else if (["C", "L", "V"].includes(firstLetter)) area = "Kabupaten Kulon Progo";
  else if (["D", "M", "W"].includes(firstLetter)) area = "Kabupaten Gunungkidul";

  return {
    isValid: true,
    areaDescription: `${area} (Plat AB ${match[1]} ${suffix})`,
  };
}

// Memory & LocalStorage state management
function getInitialVehicles(): Vehicle[] {
  if (typeof window === "undefined") return INITIAL_MITRA_VEHICLES;
  try {
    const raw = localStorage.getItem(VEHICLES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_MITRA_VEHICLES;
  } catch {
    return INITIAL_MITRA_VEHICLES;
  }
}

function getInitialListings(): MarketplaceListing[] {
  if (typeof window === "undefined") return INITIAL_MITRA_LISTINGS;
  try {
    const raw = localStorage.getItem(LISTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_MITRA_LISTINGS;
  } catch {
    return INITIAL_MITRA_LISTINGS;
  }
}

let vehiclesState: Vehicle[] = getInitialVehicles();
let listingsState: MarketplaceListing[] = getInitialListings();

const vehicleListeners = new Set<() => void>();
const listingListeners = new Set<() => void>();

function notifyVehicles() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehiclesState));
    } catch {}
  }
  vehicleListeners.forEach((l) => l());
}

function notifyListings() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listingsState));
    } catch {}
  }
  listingListeners.forEach((l) => l());
}

export const vehicleStore = {
  getVehicles(): Vehicle[] {
    return vehiclesState;
  },
  getVehicleById(id: string): Vehicle | undefined {
    return vehiclesState.find((v) => v.id === id);
  },
  subscribeVehicles(listener: () => void): () => void {
    vehicleListeners.add(listener);
    return () => vehicleListeners.delete(listener);
  },
  addVehicle(newVehicle: Omit<Vehicle, "id">): Vehicle {
    const id = `veh-${Date.now()}`;
    const vehicle: Vehicle = {
      ...newVehicle,
      id,
      lastUpdatedAt: new Date().toISOString(),
    };
    vehiclesState = [vehicle, ...vehiclesState];
    notifyVehicles();
    return vehicle;
  },
  updateVehicle(id: string, patch: Partial<Vehicle>): { success: boolean; error?: string } {
    const index = vehiclesState.findIndex((v) => v.id === id);
    if (index === -1) return { success: false, error: "Unit kendaraan tidak ditemukan." };

    // Proteksi status: jika unit sedang aktif dalam sewa, tolak perubahan status menjadi nonaktif/servis
    if (vehiclesState[index].status === "DALAM_SEWA" && patch.status && patch.status !== "DALAM_SEWA") {
      return {
        success: false,
        error: "Unit sedang aktif disewa pelanggan. Status tidak dapat diubah sebelum pengembalian unit selesai.",
      };
    }

    vehiclesState = vehiclesState.map((v) =>
      v.id === id ? { ...v, ...patch, lastUpdatedAt: new Date().toISOString() } : v
    );
    notifyVehicles();
    return { success: true };
  },
  deleteVehicle(id: string): { success: boolean; error?: string } {
    const vehicle = vehiclesState.find((v) => v.id === id);
    if (!vehicle) return { success: false, error: "Unit kendaraan tidak ditemukan." };
    if (vehicle.status === "DALAM_SEWA") {
      return { success: false, error: "Tidak dapat menghapus armada yang sedang dalam status sewa aktif." };
    }
    vehiclesState = vehiclesState.filter((v) => v.id !== id);
    notifyVehicles();
    return { success: true };
  },
  addServiceRecord(
    vehicleId: string,
    record: { workshopName: string; odometerKm: number; description: string; cost: number; date: string }
  ) {
    const srvId = `srv-${Date.now()}`;
    vehiclesState = vehiclesState.map((v) => {
      if (v.id === vehicleId) {
        const history = v.serviceHistory || [];
        return {
          ...v,
          odometerKm: Math.max(v.odometerKm || 0, record.odometerKm),
          serviceHistory: [{ id: srvId, ...record }, ...history],
          lastUpdatedAt: new Date().toISOString(),
        };
      }
      return v;
    });
    notifyVehicles();
  },

  // LISTINGS API
  getListings(): MarketplaceListing[] {
    return listingsState;
  },
  getListingById(id: string): MarketplaceListing | undefined {
    return listingsState.find((l) => l.id === id);
  },
  subscribeListings(listener: () => void): () => void {
    listingListeners.add(listener);
    return () => listingListeners.delete(listener);
  },
  addListing(newListing: Omit<MarketplaceListing, "id" | "createdAt" | "updatedAt">): MarketplaceListing {
    const id = `list-${Date.now()}`;
    const now = new Date().toISOString();
    const listing: MarketplaceListing = {
      ...newListing,
      id,
      createdAt: now,
      updatedAt: now,
      lastFreshnessConfirmedAt: now,
    };
    listingsState = [listing, ...listingsState];
    notifyListings();
    return listing;
  },
  updateListing(id: string, patch: Partial<MarketplaceListing>) {
    const now = new Date().toISOString();
    listingsState = listingsState.map((l) =>
      l.id === id ? { ...l, ...patch, updatedAt: now } : l
    );
    notifyListings();
  },
  toggleListingStatus(id: string) {
    listingsState = listingsState.map((l) => {
      if (l.id === id) {
        const newStatus: ListingStatus = l.status === "AKTIF" ? "NONAKTIF_SEMENTARA" : "AKTIF";
        return { ...l, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return l;
    });
    notifyListings();
  },
  confirmFreshness(listingId: string) {
    const now = new Date().toISOString();
    listingsState = listingsState.map((l) => {
      if (l.id === listingId) {
        return {
          ...l,
          lastFreshnessConfirmedAt: now,
          status: l.status === "KADALUWARSA_FRESHNESS" ? "AKTIF" : l.status,
          updatedAt: now,
        };
      }
      return l;
    });
    notifyListings();
  },
  confirmAllFreshness() {
    const now = new Date().toISOString();
    listingsState = listingsState.map((l) => ({
      ...l,
      lastFreshnessConfirmedAt: now,
      status: l.status === "KADALUWARSA_FRESHNESS" ? "AKTIF" : l.status,
      updatedAt: now,
    }));
    notifyListings();
  },
  deleteListing(id: string) {
    listingsState = listingsState.filter((l) => l.id !== id);
    notifyListings();
  },
};

export function useMitraVehicles() {
  const vehicles = useSyncExternalStore(
    vehicleStore.subscribeVehicles,
    vehicleStore.getVehicles,
    () => INITIAL_MITRA_VEHICLES
  );

  return {
    vehicles,
    addVehicle: (v: Omit<Vehicle, "id">) => vehicleStore.addVehicle(v),
    updateVehicle: (id: string, patch: Partial<Vehicle>) => vehicleStore.updateVehicle(id, patch),
    deleteVehicle: (id: string) => vehicleStore.deleteVehicle(id),
    addServiceRecord: (vehicleId: string, record: { workshopName: string; odometerKm: number; description: string; cost: number; date: string }) =>
      vehicleStore.addServiceRecord(vehicleId, record),
  };
}

export function useMitraListings() {
  const listings = useSyncExternalStore(
    vehicleStore.subscribeListings,
    vehicleStore.getListings,
    () => INITIAL_MITRA_LISTINGS
  );

  return {
    listings,
    addListing: (l: Omit<MarketplaceListing, "id" | "createdAt" | "updatedAt">) => vehicleStore.addListing(l),
    updateListing: (id: string, patch: Partial<MarketplaceListing>) => vehicleStore.updateListing(id, patch),
    toggleListingStatus: (id: string) => vehicleStore.toggleListingStatus(id),
    confirmFreshness: (listingId: string) => vehicleStore.confirmFreshness(listingId),
    confirmAllFreshness: () => vehicleStore.confirmAllFreshness(),
    deleteListing: (id: string) => vehicleStore.deleteListing(id),
  };
}
