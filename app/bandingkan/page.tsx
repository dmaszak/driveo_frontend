"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { GuestAuthModal } from "@/components/auth/guest-auth-modal";
import { useAuth } from "@/lib/store/auth-store";
import { useCompare } from "@/lib/store/compare-store";
import { FEATURED_YOGYAKARTA_VEHICLES } from "@/lib/mock-data/yogyakarta";
import { formatRupiah, formatRelativeTime } from "@/lib/utils";
import { Vehicle } from "@/types/domain";
import {
  Scale,
  Plus,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export default function ComparePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { compareIds, remove, clear, add } = useCompare();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedVehicleForAuth, setSelectedVehicleForAuth] = useState<Vehicle | null>(null);

  // Selected vehicles from store
  const comparedVehicles = useMemo(() => {
    return FEATURED_YOGYAKARTA_VEHICLES.filter((v) => compareIds.includes(v.id));
  }, [compareIds]);

  // Available vehicles that can be added
  const availableToAdd = useMemo(() => {
    return FEATURED_YOGYAKARTA_VEHICLES.filter((v) => !compareIds.includes(v.id));
  }, [compareIds]);

  const handleBooking = (veh: Vehicle) => {
    if (!user) {
      setSelectedVehicleForAuth(veh);
      setIsAuthModalOpen(true);
    } else {
      router.push(`/pesan/${veh.id}`);
    }
  };

  const handleComparePopularThree = () => {
    clear();
    add("veh-zenix-01");
    add("veh-xforce-01");
    add("veh-ioniq-01");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cari" className="hover:text-blue-600 transition-colors">
            Katalog Armada
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Komparasi Head-to-Head</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 flex items-center gap-3">
              <Scale className="w-8 h-8 text-blue-600" />
              <span>Komparasi Armada Head-to-Head</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {comparedVehicles.length}/3 Mobil
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Bandingkan transparansi tarif all-in, besaran deposit, efisiensi bahan bakar, dan fitur keselamatan sebelum memesan.
            </p>
          </div>

          {comparedVehicles.length > 0 && (
            <button
              onClick={() => clear()}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {comparedVehicles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center shadow-sm max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Belum Ada Mobil yang Dipilih
            </h2>
            <p className="text-sm text-slate-500 mb-6 max-w-lg mx-auto">
              Pilih hingga 3 mobil dari halaman katalog untuk membandingkan tarif harian, deposit, dan spesifikasi teknis berdampingan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleComparePopularThree}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bandingkan 3 Mobil Populer (Zenix, Xforce, Ioniq 5)</span>
              </button>

              <Link
                href="/cari"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>Buka Katalog Armada</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* COMPARISON MATRIX TABLE */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                {/* TABLE HEADER (VEHICLE CARDS) */}
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-5 w-48 text-xs font-bold uppercase text-slate-400 align-top">
                      Parameter Komparasi
                    </th>

                    {comparedVehicles.map((veh) => (
                      <th key={veh.id} className="p-5 w-72 align-top">
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3 bg-slate-100">
                          <Image
                            src={veh.thumbnailUrl}
                            alt={veh.name}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => remove(veh.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer"
                            title="Hapus dari komparasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                          {veh.brand} • {veh.year}
                        </div>
                        <Link
                          href={`/listing/${veh.id}`}
                          className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors block line-clamp-1"
                        >
                          {veh.name}
                        </Link>
                        <div className="text-xs text-slate-500 font-normal mt-0.5">
                          Plat {veh.licensePlate} ({veh.city})
                        </div>

                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => handleBooking(veh)}
                            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                          >
                            Pesan Unit Ini
                          </button>
                        </div>
                      </th>
                    ))}

                    {/* Placeholder Slot to Add Next Vehicle */}
                    {comparedVehicles.length < 3 && (
                      <th className="p-5 w-72 align-top">
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl aspect-[16/10] flex flex-col items-center justify-center p-4 text-center bg-slate-50/50">
                          <Plus className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-xs font-bold text-slate-700">
                            Tambah Unit Komparasi
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Maks. 3 mobil sekaligus
                          </span>
                        </div>

                        {availableToAdd.length > 0 && (
                          <div className="mt-3">
                            <select
                              onChange={(e) => {
                                if (e.target.value) add(e.target.value);
                              }}
                              defaultValue=""
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <option value="" disabled>
                                + Pilih dari katalog...
                              </option>
                              {availableToAdd.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.name} ({formatRupiah(opt.baseDailyRate)})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </th>
                    )}
                  </tr>
                </thead>

                {/* TABLE BODY (MATRIX SPECIFICATIONS) */}
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Row 1: Tarif Harian All-In (BR-026) */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">
                      Tarif Sewa Harian
                    </td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4">
                        <div className="text-base font-black text-slate-900 tabular-nums">
                          {formatRupiah(veh.baseDailyRate)}
                        </div>
                        <span className="text-[11px] text-slate-400">/24 Jam</span>
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 2: Security Deposit Escrow */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">
                      Deposit Jaminan Kerusakan
                    </td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4">
                        <div className="font-extrabold text-emerald-700 tabular-nums">
                          {formatRupiah(veh.securityDeposit)}
                        </div>
                        <span className="text-[10px] text-emerald-600 block">
                          100% Refundable via Escrow
                        </span>
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 3: Transmisi */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Transmisi</td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4 font-semibold text-slate-800">
                        {veh.transmission}
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 4: Bahan Bakar */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Bahan Bakar</td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4 font-semibold text-slate-800">
                        {veh.fuelType}
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 5: Kapasitas Kursi */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Kapasitas Kursi</td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4 font-semibold text-slate-800">
                        {veh.seatingCapacity} Penumpang
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 6: Kapasitas Bagasi */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Kapasitas Bagasi</td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4 font-semibold text-slate-800">
                        {veh.luggageCapacity} Koper Besar
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 7: Kapasitas Mesin (CC) */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Kapasitas Mesin</td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4 font-semibold text-slate-800 tabular-nums">
                        {veh.engineCapacityCc > 0
                          ? `${veh.engineCapacityCc} cc`
                          : "Motor Listrik (EV)"}
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 8: Mitra Rental & Legalitas NIB */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">
                      Mitra Rental & Legalitas
                    </td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4">
                        <Link
                          href={`/rental/${veh.rentalId}`}
                          className="font-bold text-slate-900 hover:text-blue-600 block transition-colors"
                        >
                          {veh.rentalName}
                        </Link>
                        <div className="flex items-center gap-1 text-slate-700 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold tabular-nums">{veh.rentalRating}</span>
                          <span className="text-[11px] text-slate-400">
                            ({veh.rentalCompletedBookings} sewa)
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          NIB OSS-RBA Terverifikasi
                        </span>
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 9: Freshness Telemetry (BR-027) */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">
                      Telemetri Freshness (BR-027)
                    </td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{formatRelativeTime(veh.lastUpdatedAt).label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Status: Aktif & Terpantau
                        </span>
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>

                  {/* Row 10: Fitur Unggulan */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40 align-top">
                      Fitur & Keselamatan
                    </td>
                    {comparedVehicles.map((veh) => (
                      <td key={veh.id} className="p-4 align-top">
                        <ul className="space-y-1.5">
                          {veh.features.map((f, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-1.5 text-[11px] text-slate-700"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                    {comparedVehicles.length < 3 && <td className="p-4" />}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Guest Auth Modal */}
      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        intendedVehicleName={selectedVehicleForAuth?.name}
      />

      <Footer />
    </div>
  );
}
