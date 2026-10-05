"use client";

import { useSyncExternalStore } from "react";
import { User, UserRole } from "@/types/domain";

export const SAMPLE_USERS: User[] = [
  {
    id: "usr-penyewa-01",
    name: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    phone: "081234567890",
    role: "PENYEWA",
    isActive: true,
    verificationStatus: "VERIFIED",
    rating: 4.95,
    totalRentals: 6,
    consentAccepted: true,
    consentTimestamp: "2026-01-10T10:00:00Z",
    createdAt: "2026-01-10T09:30:00Z",
  },
  {
    id: "usr-rental-tugu-01",
    name: "Agus Pramono",
    email: "owner@tugurentjogja.com",
    phone: "081223344550",
    role: "RENTAL",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    isActive: true,
    verificationStatus: "VERIFIED",
    rating: 4.97,
    consentAccepted: true,
    consentTimestamp: "2025-11-01T08:00:00Z",
    createdAt: "2025-11-01T08:00:00Z",
  },
  {
    id: "usr-staff-ops-01",
    name: "Rizky Ramadhan",
    email: "ops@tugurentjogja.com",
    phone: "081298765432",
    role: "STAFF_OPERASIONAL",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    secondaryRentalIds: ["rental-sleman"],
    isActive: true,
    verificationStatus: "VERIFIED",
    consentAccepted: true,
    consentTimestamp: "2026-01-15T08:00:00Z",
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: "usr-staff-finance-01",
    name: "Ratna Sari",
    email: "finance@tugurentjogja.com",
    phone: "081377889900",
    role: "STAFF_KEUANGAN",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    isActive: true,
    verificationStatus: "VERIFIED",
    consentAccepted: true,
    consentTimestamp: "2026-02-01T08:00:00Z",
    createdAt: "2026-02-01T08:00:00Z",
  },
  {
    id: "usr-admin-01",
    name: "Super Admin DriveO",
    email: "admin@driveo.id",
    phone: "081100001111",
    role: "ADMIN",
    isActive: true,
    verificationStatus: "VERIFIED",
    consentAccepted: true,
    consentTimestamp: "2025-10-01T00:00:00Z",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "usr-verif-01",
    name: "Dewi Lestari",
    email: "verifikasi@driveo.id",
    phone: "081122223333",
    role: "TIM_VERIFIKASI",
    isActive: true,
    verificationStatus: "VERIFIED",
    consentAccepted: true,
    consentTimestamp: "2025-10-05T00:00:00Z",
    createdAt: "2025-10-05T00:00:00Z",
  },
  {
    id: "usr-cs-01",
    name: "Bayu Prasetyo",
    email: "cs@driveo.id",
    phone: "081144445555",
    role: "CUSTOMER_SUPPORT",
    isActive: true,
    verificationStatus: "VERIFIED",
    consentAccepted: true,
    consentTimestamp: "2025-10-05T00:00:00Z",
    createdAt: "2025-10-05T00:00:00Z",
  },
  {
    id: "usr-mediasi-01",
    name: "Haryo Yudistira",
    email: "mediasi@driveo.id",
    phone: "081166667777",
    role: "TIM_MEDIASI",
    isActive: true,
    verificationStatus: "VERIFIED",
    consentAccepted: true,
    consentTimestamp: "2025-10-05T00:00:00Z",
    createdAt: "2025-10-05T00:00:00Z",
  },
];

export interface AuthState {
  currentUser: User | null; // null = Guest
  allUsers: User[];
  activeRentalContext: {
    rentalId: string;
    rentalName: string;
  } | null;
}

const STORAGE_KEY = "driveo_auth_state_v1";

function getInitialState(): AuthState {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          currentUser: parsed.currentUser || null,
          allUsers: parsed.allUsers || SAMPLE_USERS,
          activeRentalContext: parsed.activeRentalContext || null,
        };
      }
    } catch {
      // Fallback
    }
  }
  return {
    currentUser: null, // Default Guest
    allUsers: SAMPLE_USERS,
    activeRentalContext: null,
  };
}

let currentState: AuthState = getInitialState();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  }
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getSnapshot(): AuthState {
    return currentState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  login(user: User): void {
    currentState = {
      ...currentState,
      currentUser: user,
      activeRentalContext: user.rentalId
        ? {
            rentalId: user.rentalId,
            rentalName: user.rentalName || "Rental Terpilih",
          }
        : null,
    };
    notify();
  },

  register(newUser: User): void {
    currentState = {
      ...currentState,
      allUsers: [newUser, ...currentState.allUsers],
      currentUser: newUser,
      activeRentalContext: newUser.rentalId
        ? {
            rentalId: newUser.rentalId,
            rentalName: newUser.rentalName || "Rental Baru",
          }
        : null,
    };
    notify();
  },

  logout(): void {
    currentState = {
      ...currentState,
      currentUser: null,
      activeRentalContext: null,
    };
    notify();
  },

  switchRentalContext(rentalId: string, rentalName: string): void {
    currentState = {
      ...currentState,
      activeRentalContext: {
        rentalId,
        rentalName,
      },
    };
    notify();
  },

  updateProfile(updates: Partial<User>): void {
    if (!currentState.currentUser) return;
    const updatedUser = { ...currentState.currentUser, ...updates };
    currentState = {
      ...currentState,
      currentUser: updatedUser,
      allUsers: currentState.allUsers.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      ),
    };
    notify();
  },

  submitKyc(data: {
    nik: string;
    simNumber: string;
    simExpiry: string;
    ktpUrl?: string;
    simUrl?: string;
    selfieUrl?: string;
  }): void {
    if (!currentState.currentUser) return;
    const updatedUser: User = {
      ...currentState.currentUser,
      ...data,
      verificationStatus: "MENUNGGU",
      kycNotes: "Dokumen sedang ditinjau oleh Tim Verifikasi DriveO (SLA ≤ 30 menit).",
    };
    currentState = {
      ...currentState,
      currentUser: updatedUser,
      allUsers: currentState.allUsers.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      ),
    };
    notify();
  },

  simulateApproveKyc(): void {
    if (!currentState.currentUser) return;
    const updatedUser: User = {
      ...currentState.currentUser,
      verificationStatus: "VERIFIED",
      kycNotes: "Dokumen e-KYC (KTP & SIM A) sah dan terverifikasi penuh.",
    };
    currentState = {
      ...currentState,
      currentUser: updatedUser,
      allUsers: currentState.allUsers.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      ),
    };
    notify();
  },

  requestDeletion(): void {
    if (!currentState.currentUser) return;
    const updatedUser: User = {
      ...currentState.currentUser,
      deletionRequestedAt: new Date().toISOString(),
    };
    currentState = {
      ...currentState,
      currentUser: updatedUser,
      allUsers: currentState.allUsers.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      ),
    };
    notify();
  },

  cancelDeletion(): void {
    if (!currentState.currentUser) return;
    const updatedUser: User = {
      ...currentState.currentUser,
      deletionRequestedAt: null,
    };
    currentState = {
      ...currentState,
      currentUser: updatedUser,
      allUsers: currentState.allUsers.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      ),
    };
    notify();
  },
};

export function useAuthStore() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    () => ({
      currentUser: null,
      allUsers: SAMPLE_USERS,
      activeRentalContext: null,
    })
  );

  return [state, authStore] as const;
}

export function useAuth() {
  const [state, actions] = useAuthStore();
  return {
    user: state.currentUser,
    currentUser: state.currentUser,
    allUsers: state.allUsers,
    activeRentalContext: state.activeRentalContext,
    login: actions.login,
    register: actions.register,
    logout: actions.logout,
    switchRentalContext: actions.switchRentalContext,
    updateProfile: actions.updateProfile,
    submitKyc: actions.submitKyc,
    simulateApproveKyc: actions.simulateApproveKyc,
    requestDeletion: actions.requestDeletion,
    cancelDeletion: actions.cancelDeletion,
  };
}


