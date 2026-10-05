"use client";

import Link from "next/link";
import { MitraNav } from "@/components/mitra/mitra-nav";
import { useBookings } from "@/lib/store/booking-store";
import { usePhase10Mitra } from "@/lib/store/phase10-mitra-store";
import { formatIndonesianDate, formatRupiah } from "@/lib/utils";
import { Banknote, BadgeCheck, Car, CheckCircle2, Clock, Download, FileText, MessageSquare, ShieldCheck, Star, Upload, UserCheck, Wallet } from "lucide-react";

function Shell({ tab="keuangan", title, subtitle, children }: { tab?: any; title: string; subtitle: string; children: React.ReactNode }) { return <div className="min-h-screen bg-slate-50 text-slate-800"><MitraNav currentTab={tab}/><main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6"><div><span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-3">Fase 10 Mitra</span><h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">{title}</h1><p className="text-sm text-slate-500 mt-1 max-w-3xl">{subtitle}</p></div>{children}</main></div> }
function Card({children}: {children: React.ReactNode}) { return <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">{children}</section> }
function Money({ value }: { value: number }) { return <span className="font-mono font-extrabold tabular-nums">{formatRupiah(value)}</span> }

export default function ClaimListPage(){ const { claims } = usePhase10Mitra(); return <Shell tab="booking" title="Daftar Status Klaim Kerusakan" subtitle="Pantau seluruh klaim deposit dalam claim window 24 jam, dari bukti awal sampai putusan mediasi DriveO."><div className="grid gap-4">{claims.map((c)=><Card key={c.id}><div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><div className="flex items-center gap-2"><span className="font-mono text-xs font-black text-blue-700">{c.claimCode}</span><span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">{c.status.replaceAll("_"," ")}</span></div><h2 className="font-extrabold text-slate-950 mt-2">{c.vehicleName}</h2><p className="text-sm text-slate-500">{c.bookingCode} • {c.renterName} • {c.licensePlate}</p><p className="text-sm text-slate-600 mt-3 max-w-3xl">{c.description}</p></div><div className="text-right"><p className="text-xs text-slate-500 font-semibold">Nominal klaim</p><p className="text-xl text-slate-950"><Money value={c.claimedAmount}/></p><Link href={`/mitra/klaim/${c.id}`} className="mt-3 inline-flex min-h-[44px] items-center px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-extrabold">Lihat Detail</Link></div></div></Card>)}</div></Shell> }
