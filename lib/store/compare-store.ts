"use client";

import { useSyncExternalStore } from "react";

const COMPARE_STORAGE_KEY = "driveo_compare_ids_v1";

let compareIds: string[] = [];
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function loadInitialCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

if (typeof window !== "undefined") {
  compareIds = loadInitialCompareIds();
}

export const compareStore = {
  getIds(): string[] {
    return compareIds;
  },

  add(id: string): { success: boolean; message?: string } {
    if (compareIds.includes(id)) {
      return { success: false, message: "Mobil sudah ada di komparasi" };
    }
    if (compareIds.length >= 3) {
      return { success: false, message: "Maksimal 3 unit mobil untuk komparasi head-to-head" };
    }
    compareIds = [...compareIds, id];
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds));
    } catch {}
    emitChange();
    return { success: true };
  },

  remove(id: string) {
    compareIds = compareIds.filter((item) => item !== id);
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds));
    } catch {}
    emitChange();
  },

  toggle(id: string): { active: boolean; message?: string } {
    if (compareIds.includes(id)) {
      this.remove(id);
      return { active: false };
    } else {
      const res = this.add(id);
      return { active: res.success, message: res.message };
    }
  },

  clear() {
    compareIds = [];
    try {
      localStorage.removeItem(COMPARE_STORAGE_KEY);
    } catch {}
    emitChange();
  },

  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

export function useCompare() {
  const ids = useSyncExternalStore(
    compareStore.subscribe,
    () => compareStore.getIds(),
    () => []
  );

  return {
    compareIds: ids,
    count: ids.length,
    isInCompare: (id: string) => ids.includes(id),
    add: (id: string) => compareStore.add(id),
    remove: (id: string) => compareStore.remove(id),
    toggle: (id: string) => compareStore.toggle(id),
    clear: () => compareStore.clear(),
  };
}
