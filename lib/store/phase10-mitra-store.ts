"use client";

import { useSyncExternalStore } from "react";

export type ClaimStatus = "DRAF" | "MENUNGGU_MEDIASI" | "DISETUJUI_SEBAGIAN" | "DITOLAK" | "SELESAI";
export type PayoutStatus = "DITAHAN_ESCROW" | "DIJADWALKAN_H_PLUS_1" | "BERHASIL_DITRANSFER" | "TERTUNDA_REVIEW";

export interface DamageClaim { id: string; claimCode: string; bookingId: string; bookingCode: string; renterName: string; vehicleName: string; licensePlate: string; category: "BARET_BODI" | "INTERIOR_KOTOR" | "BBM_KURANG" | "DENDA_TERLAMBAT" | "AKSESORI_HILANG"; claimedAmount: number; workshopEstimate: string; description: string; evidenceUrls: string[]; status: ClaimStatus; submittedAt: string; mediatorNote?: string; }
export interface PayoutLedgerItem { id: string; bookingCode: string; renterName: string; vehicleName: string; grossAmount: number; platformFee: number; netPayout: number; escrowReleaseAt: string; bankAccount: string; status: PayoutStatus; transferRef?: string; }
export interface BankAccountProfile { bankName: string; accountNumber: string; accountHolder: string; verificationStatus: "TERVERIFIKASI" | "MENUNGGU_UJI_TRANSFER" | "BUTUH_PERBAIKAN"; microDepositAmount: number; updatedAt: string; }
export interface RentalCustomer { id: string; name: string; phone: string; city: string; completedBookings: number; totalSpend: number; lastBookingAt: string; riskLabel: "LOYAL" | "BARU" | "PERLU_MONITORING"; notes: string; }
export interface MerchantReview { id: string; bookingCode: string; vehicleName: string; renterName: string; rating: number; comment: string; createdAt: string; reply?: string; }

const CLAIMS_KEY = "driveo_phase10_claims_v1";
const PAYOUTS_KEY = "driveo_phase10_payouts_v1";
const BANK_KEY = "driveo_phase10_bank_v1";
const CUSTOMERS_KEY = "driveo_phase10_customers_v1";
const REVIEWS_KEY = "driveo_phase10_reviews_v1";

export const SAMPLE_DAMAGE_CLAIMS: DamageClaim[] = [
  { id: "clm-001", claimCode: "KLM-202610-0188", bookingId: "bk-active-demo-03", bookingCode: "DVO-202610-7731", renterName: "Budi Santoso", vehicleName: "Honda Brio RS CVT Facelift 2024", licensePlate: "AB 1892 CZ", category: "BARET_BODI", claimedAmount: 150000, workshopEstimate: "Salon mobil Tugu Detailing — poles panel kanan depan", description: "Baret halus baru terdeteksi pada bumper kanan depan setelah unit kembali. Foto komparasi dan estimasi bengkel sudah dilampirkan.", evidenceUrls: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"], status: "MENUNGGU_MEDIASI", submittedAt: "2026-10-05T10:10:00Z" },
  { id: "clm-002", claimCode: "KLM-202610-0142", bookingId: "bk-avanza-demo-02", bookingCode: "DVO-202610-4412", renterName: "Hendra Kusuma", vehicleName: "Toyota All New Avanza 1.5 G CVT TSS 2023", licensePlate: "AB 1234 XY", category: "BBM_KURANG", claimedAmount: 75000, workshopEstimate: "Selisih BBM dari full ke 3/4 sesuai SOP pengembalian", description: "Unit kembali dengan indikator BBM 3/4 dari posisi serah terima full.", evidenceUrls: [], status: "SELESAI", submittedAt: "2026-10-02T13:30:00Z", mediatorNote: "Disetujui otomatis karena bukti indikator dan checklist kedua pihak konsisten." },
];

export const SAMPLE_PAYOUTS: PayoutLedgerItem[] = [
  { id: "pay-001", bookingCode: "DVO-202610-8912", renterName: "Budi Santoso", vehicleName: "Toyota Innova Zenix Hybrid", grossAmount: 1300000, platformFee: 130000, netPayout: 1170000, escrowReleaseAt: "2026-10-09T09:00:00Z", bankAccount: "BCA •••• 7788", status: "DIJADWALKAN_H_PLUS_1" },
  { id: "pay-002", bookingCode: "DVO-202610-7731", renterName: "Budi Santoso", vehicleName: "Honda Brio RS CVT", grossAmount: 640000, platformFee: 64000, netPayout: 576000, escrowReleaseAt: "2026-10-07T08:00:00Z", bankAccount: "BCA •••• 7788", status: "DITAHAN_ESCROW" },
  { id: "pay-003", bookingCode: "DVO-202609-5520", renterName: "Ratna Sari", vehicleName: "Mitsubishi Xpander Ultimate", grossAmount: 900000, platformFee: 90000, netPayout: 810000, escrowReleaseAt: "2026-09-29T10:00:00Z", bankAccount: "BCA •••• 7788", status: "BERHASIL_DITRANSFER", transferRef: "TRF-BCA-20260929-88910" },
];
export const SAMPLE_BANK: BankAccountProfile = { bankName: "BCA", accountNumber: "7788123490", accountHolder: "PT Tugu Rent Jogja Sejahtera", verificationStatus: "TERVERIFIKASI", microDepositAmount: 137, updatedAt: "2026-10-01T09:00:00Z" };
export const SAMPLE_CUSTOMERS: RentalCustomer[] = [
  { id: "cus-001", name: "Budi Santoso", phone: "081234567890", city: "Jakarta Selatan", completedBookings: 4, totalSpend: 4950000, lastBookingAt: "2026-10-05T08:05:00Z", riskLabel: "LOYAL", notes: "Sering ambil unit di Stasiun Tugu, selalu tepat waktu." },
  { id: "cus-002", name: "Ratna Sari", phone: "081328901234", city: "Sleman", completedBookings: 2, totalSpend: 1780000, lastBookingAt: "2026-09-28T10:00:00Z", riskLabel: "LOYAL", notes: "Pelanggan hotel korporat, prefer MPV matic." },
  { id: "cus-003", name: "Hendra Kusuma", phone: "081987654321", city: "Bandung", completedBookings: 1, totalSpend: 1200000, lastBookingAt: "2026-10-04T07:00:00Z", riskLabel: "BARU", notes: "Perlu edukasi detail soal pengembalian BBM." },
];
export const SAMPLE_REVIEWS: MerchantReview[] = [
  { id: "rvw-001", bookingCode: "DVO-202610-8912", vehicleName: "Toyota Innova Zenix Hybrid", renterName: "Budi Santoso", rating: 5, comment: "Mobil bersih, proses di Stasiun Tugu cepat, deposit transparan.", createdAt: "2026-10-05T11:00:00Z" },
  { id: "rvw-002", bookingCode: "DVO-202609-5520", vehicleName: "Mitsubishi Xpander Ultimate", renterName: "Ratna Sari", rating: 4, comment: "Unit nyaman untuk keluarga. Admin responsif, hanya titik jemput agak mundur 10 menit.", createdAt: "2026-09-29T15:00:00Z", reply: "Terima kasih Bu Ratna. Kami sudah perbaiki SOP dispatch agar estimasi jemput lebih presisi." },
];
function readStorage<T>(key: string, fallback: T): T { if (typeof window === "undefined") return fallback; try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
let state = { claims: readStorage(CLAIMS_KEY, SAMPLE_DAMAGE_CLAIMS), payouts: readStorage(PAYOUTS_KEY, SAMPLE_PAYOUTS), bank: readStorage(BANK_KEY, SAMPLE_BANK), customers: readStorage(CUSTOMERS_KEY, SAMPLE_CUSTOMERS), reviews: readStorage(REVIEWS_KEY, SAMPLE_REVIEWS) };
const listeners = new Set<() => void>();
function persist() { if (typeof window !== "undefined") { localStorage.setItem(CLAIMS_KEY, JSON.stringify(state.claims)); localStorage.setItem(PAYOUTS_KEY, JSON.stringify(state.payouts)); localStorage.setItem(BANK_KEY, JSON.stringify(state.bank)); localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(state.customers)); localStorage.setItem(REVIEWS_KEY, JSON.stringify(state.reviews)); } listeners.forEach((listener) => listener()); }
export const phase10MitraStore = {
  getSnapshot: () => state,
  subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); },
  createClaim(data: Omit<DamageClaim, "id" | "claimCode" | "status" | "submittedAt">) { const suffix = Math.floor(1000 + Math.random() * 9000); const claim: DamageClaim = { ...data, id: `clm-${Date.now()}`, claimCode: `KLM-202610-${suffix}`, status: "MENUNGGU_MEDIASI", submittedAt: new Date().toISOString() }; state = { ...state, claims: [claim, ...state.claims] }; persist(); return claim; },
  updateBank(bank: BankAccountProfile) { state = { ...state, bank }; persist(); },
  replyReview(id: string, reply: string) { state = { ...state, reviews: state.reviews.map((review) => (review.id === id ? { ...review, reply } : review)) }; persist(); },
};
export function usePhase10Mitra() { const snapshot = useSyncExternalStore(phase10MitraStore.subscribe, phase10MitraStore.getSnapshot, () => ({ claims: SAMPLE_DAMAGE_CLAIMS, payouts: SAMPLE_PAYOUTS, bank: SAMPLE_BANK, customers: SAMPLE_CUSTOMERS, reviews: SAMPLE_REVIEWS })); return { ...snapshot, createClaim: phase10MitraStore.createClaim, updateBank: phase10MitraStore.updateBank, replyReview: phase10MitraStore.replyReview }; }
