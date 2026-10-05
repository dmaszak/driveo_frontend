"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useDisputes, SAMPLE_DISPUTES } from "@/lib/store/dispute-store";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import { DisputeTimelineEvent } from "@/types/domain";
import {
  Scale,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  FileText,
  User,
  Building2,
  DollarSign,
  Send,
  Sparkles,
  Info,
  Car,
} from "lucide-react";

export default function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getDisputeById, addTimelineEvent } = useDisputes();

  const dispute = useMemo(() => {
    return (
      getDisputeById(resolvedParams.id) ||
      SAMPLE_DISPUTES[0]
    );
  }, [resolvedParams.id, getDisputeById]);

  const [statementText, setStatementText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddStatement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statementText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addTimelineEvent(dispute.id, {
        actor: "PENYEWA",
        title: "Tanggapan Tambahan dari Penyewa",
        description: statementText,
      });
      setStatementText("");
      setIsSubmitting(false);
    }, 800);
  };

  const statusLabel = {
    MENUNGGU_VERIFIKASI_MEDIASI: "Menunggu Verifikasi",
    INVESTIGASI_BUKTI: "Investigasi Bukti Digital",
    PUTUSAN_MEDIASI: "Putusan Mediasi Diterbitkan",
    DANA_DICAIRKAN: "Sengketa Selesai & Dana Cair",
  }[dispute.status];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/booking" className="hover:text-blue-600 transition-colors">
            Riwayat Sewa
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/booking/${dispute.bookingId}`} className="hover:text-blue-600 transition-colors">
            {dispute.bookingCode}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">{dispute.ticketCode}</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {dispute.ticketCode}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {statusLabel}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Mediasi Sengketa Deposit Jaminan
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Ref Booking: <span className="font-semibold text-slate-700">{dispute.bookingCode}</span> • Armada:{" "}
                <span className="font-semibold text-slate-700">{dispute.vehicleName}</span>
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
              <span className="text-xs text-slate-500 block">Dana Deposit Dibekukan</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-red-600 block tabular-nums">
                {formatRupiah(dispute.claimedAmount)}
              </span>
              <span className="text-[11px] text-amber-700 font-medium block mt-0.5 flex sm:justify-end items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Ditahan di Escrow
              </span>
            </div>
          </div>

          {/* Dispute Stepper */}
          <div className="pt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
              Tahapan Penanganan Kasus Mediasi:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { step: 1, title: "Diajukan", active: true },
                { step: 2, title: "Investigasi Bukti", active: true },
                { step: 3, title: "Putusan Mediasi", active: !!dispute.mediatorVerdict },
                { step: 4, title: "Dana Dicairkan", active: dispute.status === "DANA_DICAIRKAN" },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    s.active
                      ? "border-blue-500 bg-blue-50 text-blue-900 font-bold"
                      : "border-slate-200 bg-slate-50/50 text-slate-400"
                  }`}
                >
                  <span className="block text-[10px] uppercase">Langkah {s.step}</span>
                  <span className="mt-0.5 block">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Putusan Mediator (Jika Sudah Ada) */}
        {dispute.mediatorVerdict && (
          <div className="bg-emerald-50/90 border border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 text-emerald-950">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Scale className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  Putusan Final Mediasi DriveO (FR-DISPUTE-004)
                </span>
                <h2 className="text-xl font-bold mt-2">
                  Keputusan Mediasi Independen Telah Diterbitkan
                </h2>
                <p className="text-xs text-emerald-800 mt-1">
                  Ditetapkan pada {formatIndonesianDate(dispute.mediatorVerdict.decidedAt)} oleh Mediator Resmi:{" "}
                  <strong>{dispute.mediatorVerdict.mediatorName}</strong>
                </p>

                <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-emerald-200/90 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  <strong>Dasar Pertimbangan Hukum & Bukti:</strong>
                  <p className="mt-1">{dispute.mediatorVerdict.reasoning}</p>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs">
                    <span className="text-slate-500 block">Dana Dikembalikan ke Penyewa:</span>
                    <span className="text-lg font-mono font-bold text-emerald-600 block mt-1 tabular-nums">
                      {formatRupiah(dispute.mediatorVerdict.renterRefundAmount)}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Transfer otomatis ke rekening bank penyewa
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs">
                    <span className="text-slate-500 block">Kompensasi ke Mitra Rental:</span>
                    <span className="text-lg font-mono font-bold text-slate-800 block mt-1 tabular-nums">
                      {formatRupiah(dispute.mediatorVerdict.rentalPayoutAmount)}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Biaya perbaikan poles salon bodi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Kronologi & Bukti */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline Peristiwa */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Timeline Mediasi & Pembuktian</span>
              </h2>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {dispute.timeline.map((event) => (
                  <div key={event.id} className="relative flex items-start gap-4">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                        event.actor === "MEDIATOR_DRIVEO"
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                          : event.actor === "MITRA"
                          ? "bg-amber-500 text-white ring-4 ring-amber-100"
                          : "bg-blue-600 text-white ring-4 ring-blue-100"
                      }`}
                    >
                      {event.actor === "MEDIATOR_DRIVEO" ? "M" : event.actor === "MITRA" ? "R" : "P"}
                    </div>

                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{event.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatIndonesianDate(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Tambah Keterangan / Tanggapan */}
              <form onSubmit={handleAddStatement} className="mt-8 pt-6 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Kirim Keterangan / Bukti Tambahan ke Tim Mediasi:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={statementText}
                    onChange={(e) => setStatementText(e.target.value)}
                    placeholder="Tulis sanggahan atau penjelasan tambahan..."
                    className="flex-1 text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !statementText.trim()}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Kolom Kanan: Rangkuman Kasus & Kontak */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Uraian Komplain Awal</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {dispute.description}
              </p>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Tuntutan Penyelesaian:
                </span>
                <span className="text-xs text-slate-600 block">{dispute.demands}</span>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Bukti Citra yang Dilampirkan:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {dispute.renterEvidenceUrls.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200"
                    >
                      <Image src={url} alt={`Bukti ${i}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bantuan CS */}
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-xs text-blue-950 space-y-2">
              <span className="font-bold block">Butuh Kontak Langsung dengan Mediator?</span>
              <p className="text-slate-600 leading-relaxed">
                Tim Mediasi beroperasi Senin – Minggu pukul 08:00 – 21:00 WIB untuk wilayah Daerah Istimewa Yogyakarta.
              </p>
              <Link
                href="/bantuan"
                className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 mt-2 block"
              >
                <span>Hubungi Layanan Pengaduan CS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
