"use client";

import { useSyncExternalStore } from "react";
import { Booking, BookingStatus, PaymentMethod, PaymentScheme, ServiceType } from "@/types/domain";

const STORAGE_KEY = "driveo_bookings_store_v1";

export const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "bk-zenix-demo-01",
    bookingCode: "DVO-202610-8912",
    vehicleId: "veh-zenix-01",
    vehicleName: "Toyota Innova Zenix 2.0 Q Hybrid TSS 2024",
    vehicleThumbnail:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    licensePlate: "AB 1001 QZ",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    rentalPhone: "+62 812 3456 7890",
    userId: "usr-penyewa-01",
    userName: "Budi Santoso",
    userEmail: "budi.santoso@gmail.com",
    userPhone: "081234567890",
    startDate: "2026-10-06T09:00:00Z",
    endDate: "2026-10-08T09:00:00Z",
    totalDays: 2,
    pickupSpotId: "spot-tugu",
    pickupSpotName: "Stasiun Tugu Yogyakarta (Pintu Selatan)",
    serviceType: "LEPAS_KUNCI",
    paymentScheme: "FULL",
    baseDailyRate: 650000,
    rentalTotal: 1300000,
    deliveryFee: 0,
    securityDeposit: 250000,
    grandTotal: 1550000,
    paidAmount: 1550000,
    remainingAmount: 0,
    status: "DIBAYAR_ESCROW",
    paymentMethod: "QRIS",
    paymentRef: "QRIS-DVO-202610-00129",
    paidAt: "2026-10-05T08:15:00Z",
    contractSignedAt: "2026-10-05T08:10:00Z",
    contractAuditTrail: {
      ip: "182.253.140.21",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DriveO/1.0",
      timestamp: "2026-10-05T08:10:00Z",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    qrHandoverCode: "DVO-HO-ZENIX-8912",
    createdAt: "2026-10-05T08:05:00Z",
  },
  {
    id: "bk-dp-demo-02",
    bookingCode: "DVO-202610-4418",
    vehicleId: "veh-raize-01",
    vehicleName: "Toyota Raize 1.0 Turbo GR Sport 2024",
    vehicleThumbnail:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    licensePlate: "AB 2490 RZ",
    rentalId: "rental-malioboro",
    rentalName: "Malioboro Trans & Tour",
    rentalPhone: "+62 813 9876 5432",
    userId: "usr-penyewa-01",
    userName: "Budi Santoso",
    userEmail: "budi.santoso@gmail.com",
    userPhone: "081234567890",
    startDate: "2026-10-06T10:00:00Z",
    endDate: "2026-10-08T10:00:00Z",
    totalDays: 2,
    pickupSpotId: "spot-yia",
    pickupSpotName: "Bandara Internasional Yogyakarta (YIA) - Drop Off Gate B",
    serviceType: "LEPAS_KUNCI",
    paymentScheme: "DP_30",
    baseDailyRate: 425000,
    rentalTotal: 850000,
    deliveryFee: 150000,
    securityDeposit: 200000,
    grandTotal: 1200000,
    paidAmount: 360000,
    remainingAmount: 840000,
    status: "DIBAYAR_ESCROW",
    paymentMethod: "VA_BCA",
    paymentRef: "VA-BCA-202610-99881",
    paidAt: "2026-10-05T09:00:00Z",
    contractSignedAt: "2026-10-05T08:55:00Z",
    contractAuditTrail: {
      ip: "182.253.140.21",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DriveO/1.0",
      timestamp: "2026-10-05T08:55:00Z",
      hash: "7d8a9f23e654bce872a9dfbc21894a7e6b010c2937e289bf4492daff3e0b8e91",
    },
    qrHandoverCode: "DVO-HO-RAIZE-4418",
    createdAt: "2026-10-05T08:50:00Z",
  },
  {
    id: "bk-active-demo-03",
    bookingCode: "DVO-202610-7731",
    vehicleId: "veh-brio-01",
    vehicleName: "Honda Brio RS CVT Facelift 2024",
    vehicleThumbnail:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    licensePlate: "AB 1892 CZ",
    rentalId: "rental-tugu",
    rentalName: "Tugu Rent Jogja",
    rentalPhone: "+62 812 3456 7890",
    userId: "usr-penyewa-01",
    userName: "Budi Santoso",
    userEmail: "budi.santoso@gmail.com",
    userPhone: "081234567890",
    startDate: "2026-10-04T08:00:00Z",
    endDate: "2026-10-06T08:00:00Z",
    totalDays: 2,
    pickupSpotId: "spot-tugu",
    pickupSpotName: "Stasiun Tugu Yogyakarta (Pintu Selatan)",
    serviceType: "LEPAS_KUNCI",
    paymentScheme: "FULL",
    baseDailyRate: 320000,
    rentalTotal: 640000,
    deliveryFee: 0,
    securityDeposit: 150000,
    grandTotal: 790000,
    paidAmount: 790000,
    remainingAmount: 0,
    status: "DALAM_SEWA",
    paymentMethod: "QRIS",
    paymentRef: "QRIS-DVO-202610-55120",
    paidAt: "2026-10-04T07:30:00Z",
    contractSignedAt: "2026-10-04T07:25:00Z",
    qrHandoverCode: "DVO-HO-BRIO-7731",
    handoverData: {
      inspectedAt: "2026-10-04T08:15:00Z",
      fuelLevel: "FULL",
      odometerKm: 24580,
      photos: {
        front: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80",
        back: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
        right: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
        left: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80",
      },
      inspectionPoints: [
        { key: "front_bumper", label: "Bumper & Kap Depan", status: "GOOD" },
        { key: "right_side", label: "Pintu & Spion Kanan", status: "GOOD" },
        { key: "left_side", label: "Pintu & Spion Kiri", status: "GOOD" },
        { key: "back_bumper", label: "Bumper & Bagasi Belakang", status: "GOOD" },
        { key: "roof", label: "Atap Kendaraan", status: "GOOD" },
        { key: "tires", label: "Kondisi Ban & Velg", status: "GOOD" },
        { key: "interior", label: "Kebersihan Interior & Jok", status: "GOOD" },
        { key: "emergency_kit", label: "Ban Serep & Kotak P3K", status: "GOOD" },
      ],
      renterSignature: "Budi Santoso",
      partnerStaffName: "Agus Pratama",
      partnerSignature: "Agus Pratama (Tugu Rent)",
    },
    createdAt: "2026-10-04T07:20:00Z",
  },
];

function getInitialBookings(): Booking[] {
  if (typeof window === "undefined") return SAMPLE_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SAMPLE_BOOKINGS;
  } catch {
    return SAMPLE_BOOKINGS;
  }
}

let bookingsState: Booking[] = getInitialBookings();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingsState));
    } catch {}
  }
  listeners.forEach((l) => l());
}

export const bookingStore = {
  getSnapshot(): Booking[] {
    return bookingsState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getBookingById(id: string): Booking | undefined {
    return bookingsState.find((b) => b.id === id || b.bookingCode === id);
  },

  createBooking(
    data: Omit<
      Booking,
      | "id"
      | "bookingCode"
      | "status"
      | "qrHandoverCode"
      | "createdAt"
      | "paidAmount"
      | "remainingAmount"
    >
  ): Booking {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `bk-${Date.now()}`;
    const bookingCode = `DVO-202610-${randomSuffix}`;
    const qrHandoverCode = `DVO-HO-${randomSuffix}`;

    const paidAmount = data.paymentScheme === "FULL" ? data.grandTotal : Math.round(data.grandTotal * 0.3);
    const remainingAmount = data.grandTotal - paidAmount;

    const newBooking: Booking = {
      ...data,
      id,
      bookingCode,
      paidAmount,
      remainingAmount,
      status: "MENUNGGU_PEMBAYARAN",
      qrHandoverCode,
      createdAt: new Date().toISOString(),
    };

    bookingsState = [newBooking, ...bookingsState];
    notify();
    return newBooking;
  },

  signContract(
    id: string,
    auditTrail: { ip: string; userAgent: string; timestamp: string; hash: string }
  ): void {
    bookingsState = bookingsState.map((b) =>
      b.id === id || b.bookingCode === id
        ? {
            ...b,
            contractSignedAt: new Date().toISOString(),
            contractAuditTrail: auditTrail,
          }
        : b
    );
    notify();
  },

  payBooking(id: string, method: PaymentMethod): void {
    const paymentRef = `${method}-DVO-${Math.floor(100000 + Math.random() * 900000)}`;
    bookingsState = bookingsState.map((b) =>
      b.id === id || b.bookingCode === id
        ? {
            ...b,
            status: "DIBAYAR_ESCROW",
            paymentMethod: method,
            paymentRef,
            paidAt: new Date().toISOString(),
          }
        : b
    );
    notify();
  },

  updateStatus(id: string, status: BookingStatus): void {
    bookingsState = bookingsState.map((b) =>
      b.id === id || b.bookingCode === id ? { ...b, status } : b
    );
    notify();
  },

  settleRemainingPayment(id: string, method: PaymentMethod): void {
    bookingsState = bookingsState.map((b) => {
      if (b.id === id || b.bookingCode === id) {
        return {
          ...b,
          paidAmount: b.grandTotal,
          remainingAmount: 0,
          status: "SIAP_SERAH_TERIMA",
          paymentMethod: method,
          paymentRef: `${method}-SETTLE-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      }
      return b;
    });
    notify();
  },

  saveHandover(id: string, handoverData: import("@/types/domain").HandoverData): void {
    bookingsState = bookingsState.map((b) => {
      if (b.id === id || b.bookingCode === id) {
        return {
          ...b,
          status: "DALAM_SEWA",
          handoverData,
        };
      }
      return b;
    });
    notify();
  },

  saveReturn(id: string, returnData: import("@/types/domain").ReturnData): void {
    bookingsState = bookingsState.map((b) => {
      if (b.id === id || b.bookingCode === id) {
        return {
          ...b,
          status: "SELESAI",
          returnData,
        };
      }
      return b;
    });
    notify();
  },

  extendBooking(
    id: string,
    newEndDate: string,
    extraDays: number,
    additionalAmount: number
  ): void {
    bookingsState = bookingsState.map((b) => {
      if (b.id === id || b.bookingCode === id) {
        return {
          ...b,
          endDate: newEndDate,
          totalDays: b.totalDays + extraDays,
          grandTotal: b.grandTotal + additionalAmount,
          paidAmount: b.paidAmount + additionalAmount,
        };
      }
      return b;
    });
    notify();
  },
};

export function useBookings() {
  const bookings = useSyncExternalStore(
    bookingStore.subscribe,
    bookingStore.getSnapshot,
    () => SAMPLE_BOOKINGS
  );

  return {
    bookings,
    getBookingById: (id: string) => bookingStore.getBookingById(id),
    createBooking: (data: Parameters<typeof bookingStore.createBooking>[0]) =>
      bookingStore.createBooking(data),
    signContract: (id: string, audit: Parameters<typeof bookingStore.signContract>[1]) =>
      bookingStore.signContract(id, audit),
    payBooking: (id: string, method: PaymentMethod) =>
      bookingStore.payBooking(id, method),
    settleRemainingPayment: (id: string, method: PaymentMethod) =>
      bookingStore.settleRemainingPayment(id, method),
    saveHandover: (id: string, data: import("@/types/domain").HandoverData) =>
      bookingStore.saveHandover(id, data),
    saveReturn: (id: string, data: import("@/types/domain").ReturnData) =>
      bookingStore.saveReturn(id, data),
    extendBooking: (
      id: string,
      newEndDate: string,
      extraDays: number,
      additionalAmount: number
    ) => bookingStore.extendBooking(id, newEndDate, extraDays, additionalAmount),
    updateStatus: (id: string, status: BookingStatus) =>
      bookingStore.updateStatus(id, status),
    updateBookingStatus: (id: string, status: BookingStatus) =>
      bookingStore.updateStatus(id, status),
  };
}

export const useBookingStore = useBookings;
