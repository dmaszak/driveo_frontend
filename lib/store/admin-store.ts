"use client";

import { useSyncExternalStore } from "react";
import { User, MitraProfile } from "@/types/domain";

export interface AdminStats {
  totalEscrowBalance: number;
  activeTransactions: number;
  disputeRate: number;
  activeFleetRatio: number;
  pendingKycCount: number;
  pendingMitraCount: number;
}

const STATS_KEY = "driveo_admin_stats_v1";

export const SAMPLE_ADMIN_STATS: AdminStats = {
  totalEscrowBalance: 245000000,
  activeTransactions: 42,
  disputeRate: 2.4,
  activeFleetRatio: 88,
  pendingKycCount: 12,
  pendingMitraCount: 3,
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

let state = {
  stats: readStorage(STATS_KEY, SAMPLE_ADMIN_STATS),
};

const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STATS_KEY, JSON.stringify(state.stats));
  }
  listeners.forEach(l => l());
}

export const adminStore = {
  getSnapshot: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  updateStats: (updates: Partial<AdminStats>) => {
    state = { ...state, stats: { ...state.stats, ...updates } };
    persist();
  }
};

export function useAdminStore() {
  const snapshot = useSyncExternalStore(
    adminStore.subscribe,
    adminStore.getSnapshot,
    () => ({ stats: SAMPLE_ADMIN_STATS })
  );
  return {
    ...snapshot,
    updateStats: adminStore.updateStats,
  };
}
