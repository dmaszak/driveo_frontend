"use client";

import Link from "next/link";
import { MitraNav } from "@/components/mitra/mitra-nav";
import { useBookings } from "@/lib/store/booking-store";
import { usePhase10Mitra } from "@/lib/store/phase10-mitra-store";
import { formatIndonesianDate, formatRupiah } from "@/lib/utils";
import { ArrowLeft, BadgeCheck, Banknote, Camera, Car, CheckCircle2, Clock, Download, FileText, Fuel, Gauge, MessageSquare, ShieldCheck, Star, Upload, UserCheck, Wallet } from "lucide-react";

const inspectionPoints = ["Bumper depan", "Bumper belakang", "Sisi kanan", "Sisi kiri", "Interior & jok", "Ban & velg", "Dokumen STNK", "Toolkit darurat"];

function PageShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-800"><MitraNav currentTab="booking" /><main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6"><div className="flex items-center justify-between gap-4"><div><Link href="/mitra/booking" className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 mb-3"><ArrowLeft className="w-3.5 h-3.5" />Kembali ke Pesanan</Link><h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">{title}</h1><p className="text-sm text-slate-500 mt-1 max-w-2xl">{subtitle}</p></div><span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">Fase 10 Mitra</span></div>{children}</main></div>
}

function StatusCard({ icon: Icon, label, value, tone = "blue" }: { icon: any; label: string; value: string; tone?: "blue"|"emerald"|"amber"|"rose" }) {
  const colors = { blue: "bg-blue-50 text-blue-700 border-blue-200", emerald: "bg-emerald-50 text-emerald-700 border-emerald-200", amber: "bg-amber-50 text-amber-700 border-amber-200", rose: "bg-rose-50 text-rose-700 border-rose-200" };
  return <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs"><div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[tone]}`}><Icon className="w-5 h-5" /></div><p className="text-xs text-slate-500 font-semibold mt-4">{label}</p><p className="text-lg font-extrabold text-slate-950 mt-1">{value}</p></div>
}

export default function MitraHandoverPage({ params }: { params: Promise<{ id: string }> }) {
  const { bookings, saveHandover } = useBookings();
  const booking = bookings[0];
  const submit = () => saveHandover(booking.id, { inspectedAt: new Date().toISOString(), fuelLevel: "FULL", odometerKm: 24620, photos: { front: booking.vehicleThumbnail, back: booking.vehicleThumbnail, right: booking.vehicleThumbnail, left: booking.vehicleThumbnail }, inspectionPoints: inspectionPoints.map((label, i) => ({ key: `p-${i}`, label, status: "GOOD" as const })), renterSignature: booking.userName, partnerStaffName: "Danang Prasetyo", partnerSignature: "Danang Prasetyo" });
  return <PageShell title="Form Inspeksi Serah Terima Sisi Rental" subtitle="Validasi pelunasan, QR handover, kondisi unit, foto 4 sisi, dan tanda tangan digital bersama penyewa."><div className="grid md:grid-cols-4 gap-4"><StatusCard icon={ShieldCheck} label="Status pembayaran" value={booking.remainingAmount === 0 ? "Lunas" : "Perlu pelunasan"} tone="emerald"/><StatusCard icon={Car} label="Armada" value={booking.licensePlate}/><StatusCard icon={Gauge} label="Odometer awal" value="24.620 KM"/><StatusCard icon={Fuel} label="BBM awal" value="Full" tone="amber"/></div><div className="grid lg:grid-cols-3 gap-6"><section className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs"><h2 className="font-extrabold text-slate-950 mb-4">Checklist kondisi unit</h2><div className="grid sm:grid-cols-2 gap-3">{inspectionPoints.map((item) => <label key={item} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold"><input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />{item}</label>)}</div><div className="grid sm:grid-cols-4 gap-3 mt-5">{["Depan", "Belakang", "Kanan", "Kiri"].map((side) => <div key={side} className="rounded-2xl border border-dashed border-slate-300 p-4 text-center bg-slate-50"><Camera className="w-5 h-5 mx-auto text-blue-600"/><p className="text-xs font-bold mt-2">Foto {side}</p></div>)}</div></section><aside className="bg-slate-950 text-white rounded-3xl p-6 shadow-xs space-y-4"><h2 className="font-extrabold">QR & Persetujuan</h2><div className="bg-white text-slate-950 rounded-2xl p-4 text-center font-mono font-black">{booking.qrHandoverCode}</div><p className="text-xs text-slate-300">Pastikan nama penyewa, plat nomor, odometer, dan BBM sama sebelum kunci diserahkan.</p><button onClick={submit} className="w-full min-h-[44px] rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-extrabold">Simpan Serah Terima</button></aside></div></PageShell>
}
