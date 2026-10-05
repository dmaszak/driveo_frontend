"use client";

import { useSyncExternalStore } from "react";
import { DisputeTicket, DisputeCategory, DisputeStatus } from "@/types/domain";

const STORAGE_KEY = "driveo_disputes_store_v1";

export const SAMPLE_DISPUTES: DisputeTicket[] = [
  {
    id: "dsp-demo-01",
    ticketCode: "DSP-202610-0089",
    bookingId: "bk-active-demo-03",
    bookingCode: "DVO-202610-7731",
    vehicleName: "Honda Brio RS CVT Facelift 2024",
    vehicleThumbnail:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    rentalName: "Tugu Rent Jogja",
    category: "KLAIM_DEPOSIT_SEPIHAK",
    description:
      "Pihak mitra rental mengklaim potongan deposit sebesar Rp 150.000 atas baret halus di bemper kanan depan. Namun pada foto checklist serah terima awal, baret halus tersebut sudah ada sebelum serah terima kunci dilakukan.",
    claimedAmount: 150000,
    demands: "Pencairan deposit jaminan 100% penuh kembali ke rekening penyewa tanpa potongan sepihak.",
    renterEvidenceUrls: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    ],
    partnerEvidenceUrls: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    ],
    status: "INVESTIGASI_BUKTI",
    createdAt: "2026-10-04T14:30:00Z",
    timeline: [
      {
        id: "evt-1",
        timestamp: "2026-10-04T14:30:00Z",
        actor: "PENYEWA",
        title: "Tiket Sengketa Resmi Dibuka",
        description:
          "Penyewa mengajukan keberatan resmi atas klaim pemotongan deposit sepihak oleh Tugu Rent Jogja.",
      },
      {
        id: "evt-2",
        timestamp: "2026-10-04T15:10:00Z",
        actor: "MEDIATOR_DRIVEO",
        title: "Kasus Diterima Tim Mediasi Independen",
        description:
          "Tim Mediasi DriveO membekukan pelepasan dana deposit di rekening penampung escrow dan meminta data digital inspeksi serah terima.",
      },
      {
        id: "evt-3",
        timestamp: "2026-10-04T17:00:00Z",
        actor: "MITRA",
        title: "Mitra Menyerahkan Foto Pembanding",
        description:
          "Mitra Tugu Rent mengunggah foto jarak dekat baret pada bemper dan estimasi biaya kompon poles salon mobil sebesar Rp 75.000.",
      },
    ],
    mediatorVerdict: {
      decidedAt: "2026-10-05T09:00:00Z",
      mediatorName: "Rian Hendrawan, S.H. (Tim Mediasi DriveO DIY)",
      renterRefundAmount: 125000,
      rentalPayoutAmount: 25000,
      reasoning:
        "Berdasarkan perbandingan citra resolusi tinggi saat serah terima vs pengembalian, goresan minor sudah ada 70% di awal. Kompromi adil: Biaya poles ringan Rp 25.000 dialokasikan ke mitra, sisa deposit Rp 125.000 langsung dicairkan ke rekening penyewa.",
    },
  },
];

function getInitialDisputes(): DisputeTicket[] {
  if (typeof window === "undefined") return SAMPLE_DISPUTES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SAMPLE_DISPUTES;
  } catch {
    return SAMPLE_DISPUTES;
  }
}

let disputesState: DisputeTicket[] = getInitialDisputes();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(disputesState));
    } catch {}
  }
  listeners.forEach((l) => l());
}

export const disputeStore = {
  getSnapshot(): DisputeTicket[] {
    return disputesState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getDisputeById(id: string): DisputeTicket | undefined {
    return disputesState.find((d) => d.id === id || d.ticketCode === id || d.bookingId === id);
  },

  createDispute(
    data: Omit<DisputeTicket, "id" | "ticketCode" | "status" | "createdAt" | "timeline">
  ): DisputeTicket {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const id = `dsp-${Date.now()}`;
    const ticketCode = `DSP-202610-${randomCode}`;

    const newTicket: DisputeTicket = {
      ...data,
      id,
      ticketCode,
      status: "MENUNGGU_VERIFIKASI_MEDIASI",
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "PENYEWA",
          title: "Tiket Sengketa Resmi Dibuka",
          description: `Penyewa membuka sengketa kategori ${data.category}. Dana deposit resmi dibekukan di Escrow.`,
        },
      ],
    };

    disputesState = [newTicket, ...disputesState];
    notify();
    return newTicket;
  },

  addTimelineEvent(
    disputeId: string,
    event: Omit<import("@/types/domain").DisputeTimelineEvent, "id" | "timestamp">
  ): void {
    disputesState = disputesState.map((d) => {
      if (d.id === disputeId || d.ticketCode === disputeId) {
        return {
          ...d,
          timeline: [
            ...d.timeline,
            {
              ...event,
              id: `evt-${Date.now()}`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return d;
    });
    notify();
  },
};

export function useDisputes() {
  const disputes = useSyncExternalStore(
    disputeStore.subscribe,
    disputeStore.getSnapshot,
    () => SAMPLE_DISPUTES
  );

  return {
    disputes,
    getDisputeById: (id: string) => disputeStore.getDisputeById(id),
    createDispute: (data: Parameters<typeof disputeStore.createDispute>[0]) =>
      disputeStore.createDispute(data),
    addTimelineEvent: (disputeId: string, event: Parameters<typeof disputeStore.addTimelineEvent>[1]) =>
      disputeStore.addTimelineEvent(disputeId, event),
  };
}
