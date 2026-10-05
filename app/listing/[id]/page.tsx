"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { GuestAuthModal } from "@/components/auth/guest-auth-modal";
import { CompareFloatingBar } from "@/components/marketplace/compare-floating-bar";
import { useAuth } from "@/lib/store/auth-store";
import { useCompare } from "@/lib/store/compare-store";
import {
  FEATURED_YOGYAKARTA_VEHICLES,
  YOGYAKARTA_PICKUP_SPOTS,
  YOGYAKARTA_RENTAL_PARTNERS,
  getVehicleById,
  getRentalById,
} from "@/lib/mock-data/yogyakarta";
import { formatRupiah, formatRelativeTime } from "@/lib/utils";
import {
  ChevronRight,
  ShieldCheck,
  Star,
  Users,
  Fuel,
  Gauge,
  Luggage,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Scale,
  Car,
  Lock,
  Sparkles,
  Phone,
  MessageCircle,
  HelpCircle,
  X,
  Maximize2,
} from "lucide-react";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { isInCompare, toggle: toggleCompare } = useCompare();

  // Find vehicle
  const vehicle = useMemo(
    () => getVehicleById(resolvedParams.id) || FEATURED_YOGYAKARTA_VEHICLES[0],
    [resolvedParams.id]
  );

  // Find partner
  const rental = useMemo(
    () => getRentalById(vehicle.rentalId) || YOGYAKARTA_RENTAL_PARTNERS[0],
    [vehicle.rentalId]
  );

  // Booking Calculator State (BR-026 All-In Price)
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [selectedSpotId, setSelectedSpotId] = useState<string>("spot-tugu");
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Pickup spot calculations
  const selectedSpot = useMemo(
    () => YOGYAKARTA_PICKUP_SPOTS.find((s) => s.id === selectedSpotId) || YOGYAKARTA_PICKUP_SPOTS[1],
    [selectedSpotId]
  );

  const deliveryFee = selectedSpot.extraFee;
  const rentalSubtotal = vehicle.baseDailyRate * rentalDays;
  const securityDeposit = vehicle.securityDeposit;
  const grandTotal = rentalSubtotal + deliveryFee + securityDeposit;

  const inCompare = isInCompare(vehicle.id);

  const handleBooking = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      router.push(`/pesan/${vehicle.id}?hari=${rentalDays}&spot=${selectedSpotId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cari" className="hover:text-blue-600 transition-colors">
            Katalog Armada
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">{vehicle.name}</span>
        </div>

        {/* TOP TITLE & VERIFICATION BADGES */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {vehicle.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                {vehicle.licensePlate} (Yogyakarta)
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formatRelativeTime(vehicle.lastUpdatedAt).label}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              {vehicle.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-600 flex-wrap">
              <Link
                href={`/rental/${rental.id}`}
                className="font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5"
              >
                <span>{rental.name}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </Link>
              <span>•</span>
              <div className="flex items-center gap-1 text-slate-900 font-bold">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="tabular-nums">{rental.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({rental.totalReviews} ulasan penyewa)
                </span>
              </div>
              <span>•</span>
              <span className="text-slate-500 text-xs">
                {rental.district}, {rental.city}
              </span>
            </div>
          </div>

          {/* Action buttons (Compare toggle) */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => toggleCompare(vehicle.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                inCompare
                  ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Scale className="w-4 h-4 text-blue-600" />
              <span>{inCompare ? "Tersimpan di Komparasi" : "Bandingkan Mobil"}</span>
            </button>
          </div>
        </div>

        {/* PHOTO GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          <div className="lg:col-span-2 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-md group">
            <Image
              src={vehicle.galleryImages[activePhotoIdx] || vehicle.thumbnailUrl}
              alt={vehicle.name}
              fill
              priority
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Lihat Foto Fullscreen</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {vehicle.galleryImages.slice(0, 2).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activePhotoIdx === idx
                    ? "border-blue-600 shadow-md ring-2 ring-blue-500/20"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${vehicle.name} angle ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* TWO COLUMN DETAIL + STICKY PRICE CALCULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7-COL: SPECS, FEATURES, POLICIES & RENTAL PROFILE */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Specs Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-600" />
                <span>Spesifikasi Utama Unit</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium block">Transmisi</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {vehicle.transmission}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium block">Kapasitas</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {vehicle.seatingCapacity} Penumpang
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium block">Bahan Bakar</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {vehicle.fuelType}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium block">Kapasitas Bagasi</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {vehicle.luggageCapacity} Koper Besar
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Features List */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Kelengkapan & Fitur Keselamatan</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.features.map((feat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Requirements & Policy Accordion */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span>Ketentuan Sewa Lepas Kunci di Yogyakarta</span>
              </h2>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div className="font-bold text-blue-900 mb-1">Syarat e-KYC (Verifikasi Identitas)</div>
                  <p className="text-blue-800 leading-relaxed">
                    Penyewa wajib memiliki e-KTP dan SIM A aktif. Dokumen diunggah secara digital melalui enkripsi UU PDP No. 27/2022 tanpa perlu meninggalkan KTP fisik asli sebagai jaminan.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Area Jelajah Operasional</div>
                  <p className="text-slate-600 leading-relaxed">
                    Armada bebas digunakan di seluruh Provinsi D.I. Yogyakarta (Kota, Sleman, Bantul, Kulon Progo, Gunungkidul) hingga Jawa Tengah (Solo, Semarang, Magelang, Borobudur).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Kebijakan Bahan Bakar & Serah Terima</div>
                  <p className="text-slate-600 leading-relaxed">
                    Sistem <em>Same-to-Same</em>: mobil diserahkan dengan posisi indikator BBM tertentu dan wajib dikembalikan pada posisi yang sama. Kondisi bodi dicatat bersama via Checklist Digital 8-Titik (BR-015).
                  </p>
                </div>
              </div>
            </div>

            {/* Rental Partner Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Disediakan Oleh Mitra Resmi
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NIB OSS-RBA: {rental.nib}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                  <Image src={rental.avatarUrl} alt={rental.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Link href={`/rental/${rental.id}`} className="hover:text-blue-600 transition-colors">
                      {rental.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rental.description}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-900">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {rental.rating} ({rental.totalReviews} ulasan)
                    </span>
                    <span>•</span>
                    <span>{rental.completedBookings} Transaksi Selesai</span>
                    <span>•</span>
                    <span className="text-slate-500">{rental.operatingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/rental/${rental.id}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Lihat Profil & Armada Lainnya →
                </Link>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Garasi: {rental.district}, Jogja</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5-COL: STICKY PRICE ALL-IN CALCULATOR (BR-026) */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl border-2 border-slate-900/10 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                Garansi Transparan All-In
              </div>

              <div className="mb-6">
                <span className="text-xs text-slate-500 font-medium block">Tarif Sewa Harian</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-slate-950 tabular-nums">
                    {formatRupiah(vehicle.baseDailyRate)}
                  </span>
                  <span className="text-sm text-slate-500 font-semibold">/hari</span>
                </div>
              </div>

              {/* Calculator Form */}
              <div className="space-y-4 mb-6">
                {/* Duration Day Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                    <span>Durasi Sewa:</span>
                    <span className="text-blue-600 font-extrabold">{rentalDays} Hari (24 Jam × {rentalDays})</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 5, 7].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setRentalDays(days)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          rentalDays === days
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {days} Hari
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pickup Spot Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Lokasi Antar-Jemput di DIY:
                  </label>
                  <select
                    value={selectedSpotId}
                    onChange={(e) => setSelectedSpotId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    {YOGYAKARTA_PICKUP_SPOTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.extraFee > 0 ? `(+${formatRupiah(s.extraFee)})` : "(Gratis)"}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Estimasi tiba di lokasi: ~{selectedSpot.estimatedDeliveryMin} menit
                  </span>
                </div>
              </div>

              {/* Breakdown Table (BR-026 & BR-007 Escrow) */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    Sewa Kendaraan ({rentalDays} hari × {formatRupiah(vehicle.baseDailyRate)})
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatRupiah(rentalSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Biaya Antar ke {selectedSpot.name}</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {deliveryFee === 0 ? "Gratis" : formatRupiah(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Deposit Jaminan Kerusakan</span>
                    <span className="text-[10px] text-emerald-600 font-bold">(100% Refundable)</span>
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatRupiah(securityDeposit)}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Total Pembayaran</span>
                    <span className="text-[10px] text-slate-400">Termasuk Deposit & PPN</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600 tabular-nums">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Escrow Guarantee Notice */}
              <div className="mt-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Proteksi Rekening Escrow DriveO</span>
                  <p className="text-[11px] text-emerald-800 leading-tight mt-0.5">
                    Uang Anda aman. Dana baru diteruskan ke rental setelah Anda menerima kunci dan menyetujui checklist serah terima. Deposit dikembalikan penuh otomatis setelah sewa selesai tanpa klaim kerusakan.
                  </p>
                </div>
              </div>

              {/* Booking CTA Button */}
              <button
                type="button"
                onClick={handleBooking}
                className="w-full mt-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pesan Unit Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="mt-3 text-center">
                <span className="text-[11px] text-slate-400">
                  Bebas pembatalan hingga 24 jam sebelum waktu sewa dimulai.
                </span>
              </div>
            </div>

            {/* Quick Contact & Assistance */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Punya pertanyaan khusus seputar armada?</span>
              </div>
              <a
                href={`https://wa.me/${rental.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative w-full max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={vehicle.galleryImages[activePhotoIdx] || vehicle.thumbnailUrl}
              alt={vehicle.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Floating Compare Bar */}
      <CompareFloatingBar />

      {/* Guest Auth Modal */}
      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        intendedVehicleName={vehicle.name}
      />

      <Footer />
    </div>
  );
}
