"use client";

import { useSyncExternalStore } from "react";
import { MitraProfile, BusinessEntityType, MitraVerificationStatus } from "@/types/domain";

const STORAGE_KEY = "driveo_mitra_profile_v1";

export const SAMPLE_MITRA_PROFILE: MitraProfile = {
  id: "mitra-tugu-01",
  businessName: "Tugu Rent Jogja",
  legalEntityName: "CV Tugu Transportasi Nusantara",
  entityType: "CV",
  establishedYear: 2018,
  slogan: "Sewa Mobil Terpercaya di Jantung Kota Yogyakarta",
  district: "Jetis",
  city: "Kota Yogyakarta",
  address: "Jl. Margo Utomo (Eks Jl. Pangeran Mangkubumi) No. 42, Gowongan, Jetis, Kota Yogyakarta, DIY 55232",
  garageCoordinates: "-7.7829, 110.3671",
  operatingHours: "06:00 - 23:00 WIB (24 Jam Emergency)",
  emergencyPhone24h: "081223344550",
  whatsappCommercial: "081234567890",
  picName: "Agus Pramono",
  picPhone: "081223344550",
  picNik: "3471012804820003",
  nibNumber: "1234567890123",
  kbliCode: "77100 - Aktivitas Angkutan Sewa Mobil Tanpa Pengemudi",
  nibFileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
  ktpPicFileUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  garagePhotoUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
  npwpNumber: "81.234.567.8-541.000",
  npwpFileUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
  verificationStatus: "TERVERIFIKASI",
  submittedAt: "2026-01-10T10:00:00Z",
  verifiedAt: "2026-01-11T09:00:00Z",
  contractSignedAt: "2026-01-11T10:30:00Z",
  contractAuditHash: "e7b0a8c2910d54f6789123456789abcdef0123456789abcdef0123456789abcd",
};

function getInitialMitraProfile(): MitraProfile {
  if (typeof window === "undefined") return SAMPLE_MITRA_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SAMPLE_MITRA_PROFILE;
  } catch {
    return SAMPLE_MITRA_PROFILE;
  }
}

let mitraState: MitraProfile = getInitialMitraProfile();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mitraState));
    } catch {}
  }
  listeners.forEach((l) => l());
}

export const mitraStore = {
  getSnapshot(): MitraProfile {
    return mitraState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  updateProfile(patch: Partial<MitraProfile>): void {
    mitraState = { ...mitraState, ...patch };
    notify();
  },

  submitVerification(docs: {
    nibNumber: string;
    nibFileUrl: string;
    ktpPicFileUrl: string;
    garagePhotoUrl: string;
    npwpNumber?: string;
  }): void {
    mitraState = {
      ...mitraState,
      ...docs,
      verificationStatus: "MENUNGGU_VERIFIKASI",
      submittedAt: new Date().toISOString(),
    };
    notify();
  },

  simulateApproveVerification(): void {
    mitraState = {
      ...mitraState,
      verificationStatus: "TERVERIFIKASI",
      verifiedAt: new Date().toISOString(),
    };
    notify();
  },

  signContract(hash: string): void {
    mitraState = {
      ...mitraState,
      contractSignedAt: new Date().toISOString(),
      contractAuditHash: hash,
    };
    notify();
  },
};

export function useMitra() {
  const profile = useSyncExternalStore(
    mitraStore.subscribe,
    mitraStore.getSnapshot,
    () => SAMPLE_MITRA_PROFILE
  );

  return {
    profile,
    updateProfile: (patch: Partial<MitraProfile>) => mitraStore.updateProfile(patch),
    submitVerification: (docs: Parameters<typeof mitraStore.submitVerification>[0]) =>
      mitraStore.submitVerification(docs),
    simulateApproveVerification: () => mitraStore.simulateApproveVerification(),
    signContract: (hash: string) => mitraStore.signContract(hash),
  };
}
