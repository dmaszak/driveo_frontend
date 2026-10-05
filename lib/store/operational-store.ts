"use client";

import { useSyncExternalStore } from "react";
import { CalendarBlock, StaffMember, StaffRole, Booking } from "@/types/domain";

const CALENDAR_STORAGE_KEY = "driveo_calendar_blocks_v1";
const STAFF_STORAGE_KEY = "driveo_staff_members_v1";

// Initial seed calendar blocks for Tugu Rent Jogja (October 2026)
export const INITIAL_CALENDAR_BLOCKS: CalendarBlock[] = [
  {
    id: "blk-01",
    vehicleId: "veh-tugu-01", // Zenix
    vehiclePlate: "AB 1001 QZ",
    vehicleName: "Toyota Innova Zenix 2.0 Q Hybrid TSS 2024",
    rentalId: "rental-tugu",
    startDate: "2026-10-06",
    endDate: "2026-10-08",
    source: "DRIVEO_BOOKING",
    title: "Sewa Online: Budi Santoso (Stasiun Tugu)",
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    bookingId: "bk-zenix-demo-01",
    createdAt: "2026-10-05T08:05:00Z",
  },
  {
    id: "blk-02",
    vehicleId: "veh-tugu-02", // Avanza
    vehiclePlate: "AB 1234 XY",
    vehicleName: "Toyota All New Avanza 1.5 G CVT TSS 2023",
    rentalId: "rental-tugu",
    startDate: "2026-10-04",
    endDate: "2026-10-07",
    source: "DRIVEO_BOOKING",
    title: "Sewa Online: Hendra Kusuma (YIA)",
    customerName: "Hendra Kusuma",
    customerPhone: "081987654321",
    bookingId: "bk-avanza-demo-02",
    createdAt: "2026-10-04T07:00:00Z",
  },
  {
    id: "blk-03",
    vehicleId: "veh-tugu-03", // Xpander
    vehiclePlate: "AB 1782 FA",
    vehicleName: "Mitsubishi Xpander Ultimate CVT 2024",
    rentalId: "rental-tugu",
    startDate: "2026-10-08",
    endDate: "2026-10-09",
    source: "BENGKEL_MAINTENANCE",
    title: "Servis Berkala 30.000 KM (Mitsubishi Magelang)",
    notes: "Ganti kampas rem dan kuras oli transmisi CVT",
    createdAt: "2026-10-03T10:00:00Z",
  },
  {
    id: "blk-04",
    vehicleId: "veh-tugu-04", // Brio
    vehiclePlate: "AB 1899 TK",
    vehicleName: "Honda Brio RS CVT 2023",
    rentalId: "rental-tugu",
    startDate: "2026-10-07",
    endDate: "2026-10-08",
    source: "OFFLINE_WHATSAPP", // BR-029 Offline reservation
    title: "Sewa WhatsApp: Bu Ratna (Langganan Hotel Tentrem)",
    customerName: "Ratna Sari",
    customerPhone: "081328901234",
    notes: "Tamu hotel Tentrem, jemput lobi hotel jam 08:00 WIB",
    createdAt: "2026-10-05T09:30:00Z",
  },
];

// Initial Staff Members for Tugu Rent Jogja
export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: "stf-01",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    name: "Danang Prasetyo",
    email: "danang.ops@tugurentjogja.id",
    phone: "081229988112",
    role: "STAFF_OPERASIONAL",
    status: "AKTIF",
    invitedAt: "2026-01-15T08:00:00Z",
    joinedAt: "2026-01-15T10:30:00Z",
    lastActiveAt: "2026-10-05T11:45:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "stf-02",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    name: "Siti Rahmawati, S.Ak.",
    email: "siti.finance@tugurentjogja.id",
    phone: "081337788990",
    role: "STAFF_KEUANGAN",
    status: "AKTIF",
    invitedAt: "2026-02-01T09:00:00Z",
    joinedAt: "2026-02-01T14:15:00Z",
    lastActiveAt: "2026-10-05T10:20:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "stf-03",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    name: "Rizky Firmansyah",
    email: "rizky.fleet@tugurentjogja.id",
    phone: "081901234567",
    role: "STAFF_OPERASIONAL",
    status: "MENUNGGU_AKTIVASI",
    invitedAt: "2026-10-04T16:00:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
  },
];

// Helper: SLA 2 Hours Countdown calculation (FR-BOOKING-008)
export function getSlaTimerInfo(createdAtIso: string) {
  const createdTime = new Date(createdAtIso).getTime();
  const slaDeadline = createdTime + 2 * 60 * 60 * 1000; // 2 Jam
  const diffMs = slaDeadline - Date.now();

  if (diffMs <= 0) {
    return {
      isExpired: true,
      remainingMinutes: 0,
      remainingSeconds: 0,
      label: "Waktu Konfirmasi Habis (SLA Kedaluwarsa)",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    };
  }

  const remainingMinutes = Math.floor(diffMs / (1000 * 60));
  const remainingSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  const isUrgent = remainingMinutes < 30;

  return {
    isExpired: false,
    remainingMinutes,
    remainingSeconds,
    label: `${remainingMinutes}m ${remainingSeconds}s tersisa`,
    badgeColor: isUrgent
      ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
      : "bg-amber-50 text-amber-800 border-amber-200",
  };
}

// LocalStorage loaders
function getInitialCalendarBlocks(): CalendarBlock[] {
  if (typeof window === "undefined") return INITIAL_CALENDAR_BLOCKS;
  try {
    const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CALENDAR_BLOCKS;
  } catch {
    return INITIAL_CALENDAR_BLOCKS;
  }
}

function getInitialStaff(): StaffMember[] {
  if (typeof window === "undefined") return INITIAL_STAFF_MEMBERS;
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_STAFF_MEMBERS;
  } catch {
    return INITIAL_STAFF_MEMBERS;
  }
}

let calendarState: CalendarBlock[] = getInitialCalendarBlocks();
let staffState: StaffMember[] = getInitialStaff();

const calendarListeners = new Set<() => void>();
const staffListeners = new Set<() => void>();

function notifyCalendar() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(calendarState));
    } catch {}
  }
  calendarListeners.forEach((l) => l());
}

function notifyStaff() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffState));
    } catch {}
  }
  staffListeners.forEach((l) => l());
}

export const operationalStore = {
  // CALENDAR
  getCalendarBlocks(): CalendarBlock[] {
    return calendarState;
  },
  subscribeCalendar(listener: () => void): () => void {
    calendarListeners.add(listener);
    return () => calendarListeners.delete(listener);
  },
  addCalendarBlock(block: Omit<CalendarBlock, "id" | "createdAt">): CalendarBlock {
    const id = `blk-${Date.now()}`;
    const newBlock: CalendarBlock = {
      ...block,
      id,
      createdAt: new Date().toISOString(),
    };
    calendarState = [newBlock, ...calendarState];
    notifyCalendar();
    return newBlock;
  },
  deleteCalendarBlock(id: string) {
    calendarState = calendarState.filter((b) => b.id !== id);
    notifyCalendar();
  },

  // STAFF
  getStaff(): StaffMember[] {
    return staffState;
  },
  subscribeStaff(listener: () => void): () => void {
    staffListeners.add(listener);
    return () => staffListeners.delete(listener);
  },
  inviteStaff(member: { name: string; email: string; phone: string; role: StaffRole; rentalId: string; rentalName: string }): StaffMember {
    const id = `stf-${Date.now()}`;
    const newStaff: StaffMember = {
      ...member,
      id,
      status: "MENUNGGU_AKTIVASI",
      invitedAt: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
    };
    staffState = [newStaff, ...staffState];
    notifyStaff();
    return newStaff;
  },
  activateStaff(id: string, name: string, phone: string) {
    staffState = staffState.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          name,
          phone,
          status: "AKTIF",
          joinedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
      }
      return s;
    });
    notifyStaff();
  },
  toggleStaffStatus(id: string) {
    staffState = staffState.map((s) => {
      if (s.id === id) {
        const nextStatus = s.status === "AKTIF" ? "NONAKTIF" : "AKTIF";
        return { ...s, status: nextStatus };
      }
      return s;
    });
    notifyStaff();
  },
  deleteStaff(id: string) {
    staffState = staffState.filter((s) => s.id !== id);
    notifyStaff();
  },
};

export function useOperationalCalendar() {
  const blocks = useSyncExternalStore(
    operationalStore.subscribeCalendar,
    operationalStore.getCalendarBlocks,
    () => INITIAL_CALENDAR_BLOCKS
  );

  return {
    blocks,
    addCalendarBlock: (b: Omit<CalendarBlock, "id" | "createdAt">) => operationalStore.addCalendarBlock(b),
    deleteCalendarBlock: (id: string) => operationalStore.deleteCalendarBlock(id),
  };
}

export function useOperationalStaff() {
  const staff = useSyncExternalStore(
    operationalStore.subscribeStaff,
    operationalStore.getStaff,
    () => INITIAL_STAFF_MEMBERS
  );

  return {
    staff,
    inviteStaff: (m: Parameters<typeof operationalStore.inviteStaff>[0]) => operationalStore.inviteStaff(m),
    activateStaff: (id: string, name: string, phone: string) => operationalStore.activateStaff(id, name, phone),
    toggleStaffStatus: (id: string) => operationalStore.toggleStaffStatus(id),
    deleteStaff: (id: string) => operationalStore.deleteStaff(id),
  };
}
