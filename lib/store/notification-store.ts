"use client";

import { useSyncExternalStore } from "react";
import { InAppNotification, NotificationPreference } from "@/types/domain";

const STORAGE_KEY = "driveo_notifications_store_v1";
const PREF_KEY = "driveo_notif_pref_v1";

export const SAMPLE_NOTIFICATIONS: InAppNotification[] = [
  {
    id: "notif-1",
    title: "Dana DP Berhasil Masuk ke Rekening Penampung (Escrow)",
    message: "Pembayaran DP sebesar Rp 465.000 untuk Toyota Innova Zenix telah aman ditampung di escrow PT DriveO Nusantara.",
    category: "TRANSAKSI",
    timestamp: "2026-10-05T08:15:00Z",
    isRead: false,
    linkUrl: "/booking/bk-zenix-demo-01",
  },
  {
    id: "notif-2",
    title: "Pengingat Jadwal Serah Terima Kendaraan H-1",
    message: "Armada Honda Brio RS Anda dijadwalkan siap diserahterimakan besok pukul 08:00 WIB di Pintu Selatan Stasiun Tugu.",
    category: "OPERASIONAL",
    timestamp: "2026-10-04T12:00:00Z",
    isRead: false,
    linkUrl: "/booking/bk-active-demo-03",
  },
  {
    id: "notif-3",
    title: "Verifikasi e-KYC KTP & SIM A Berhasil Disetujui",
    message: "Profil Anda telah berstatus Terverifikasi Penuh. Anda sekarang memenuhi syarat untuk menyewa mobil lepas kunci di seluruh mitra Yogyakarta.",
    category: "KEAMANAN",
    timestamp: "2026-10-03T10:30:00Z",
    isRead: true,
    linkUrl: "/akun/verifikasi",
  },
  {
    id: "notif-4",
    title: "Pembaruan Kasus Sengketa #DSP-202610-0089",
    message: "Tim Mediasi DriveO telah mengeluarkan putusan mediasi independen terkait klaim deposit jaminan Anda.",
    category: "SENGKETA",
    timestamp: "2026-10-05T09:05:00Z",
    isRead: false,
    linkUrl: "/sengketa/dsp-demo-01",
  },
];

export const DEFAULT_PREFERENCES: NotificationPreference = {
  whatsappTransaction: true,
  whatsappReminder: true,
  whatsappPromo: false,
  emailReceipt: true,
  emailContract: true,
  emailNewsletter: false,
  pushWebOrder: true,
  pushWebSecurity: true,
};

function getInitialNotifications(): InAppNotification[] {
  if (typeof window === "undefined") return SAMPLE_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SAMPLE_NOTIFICATIONS;
  } catch {
    return SAMPLE_NOTIFICATIONS;
  }
}

function getInitialPreferences(): NotificationPreference {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREF_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

let notifsState: InAppNotification[] = getInitialNotifications();
let prefState: NotificationPreference = getInitialPreferences();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifsState));
      localStorage.setItem(PREF_KEY, JSON.stringify(prefState));
    } catch {}
  }
  listeners.forEach((l) => l());
}

export const notificationStore = {
  getNotifications(): InAppNotification[] {
    return notifsState;
  },
  getPreferences(): NotificationPreference {
    return prefState;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  markAsRead(id: string): void {
    notifsState = notifsState.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    notify();
  },
  markAllAsRead(): void {
    notifsState = notifsState.map((n) => ({ ...n, isRead: true }));
    notify();
  },
  updatePreferences(patch: Partial<NotificationPreference>): void {
    prefState = { ...prefState, ...patch };
    notify();
  },
};

export function useNotifications() {
  const notifications = useSyncExternalStore(
    notificationStore.subscribe,
    notificationStore.getNotifications,
    () => SAMPLE_NOTIFICATIONS
  );

  const preferences = useSyncExternalStore(
    notificationStore.subscribe,
    notificationStore.getPreferences,
    () => DEFAULT_PREFERENCES
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    preferences,
    unreadCount,
    markAsRead: (id: string) => notificationStore.markAsRead(id),
    markAllAsRead: () => notificationStore.markAllAsRead(),
    updatePreferences: (patch: Partial<NotificationPreference>) =>
      notificationStore.updatePreferences(patch),
  };
}
