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
  YOGYAKARTA_RENTAL_PARTNERS,
  getRentalById,
  getVehiclesByRentalId,
  YOGYAKARTA_PICKUP_SPOTS,
} from "@/lib/mock-data/yogyakarta";
import { formatRupiah, formatRelativeTime } from "@/lib/utils";
import { Vehicle } from "@/types/domain";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Car,
  MessageSquare,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Scale,
  Gauge,
  Users,
  Fuel,
  Building2,
  BadgeCheck,
} from "lucide-react";

export default function RentalPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { isInCompare, toggle: toggleCompare } = useCompare();

  // Find rental
  const rental = useMemo(
    () => getRentalById(resolvedParams.id) || YOGYAKARTA_RENTAL_PARTNERS[0],
    [resolvedParams.id]
  );

  // Fleet managed by this rental
  const fleet = useMemo(
    () => getVehiclesByRentalId(rental.id),
    [rental.id]
  );

  // Active Tab: 'fleet' | 'reviews' | 'coverage'
  const [activeTab, setActiveTab] = useState<"fleet" | "reviews" | "coverage">("fleet");
  const [selectedCategory, setSelectedCategory] = useState<string>("SEMUA");

  // Guest auth intercept
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedVehicleForAuth, setSelectedVehicleForAuth] = useState<Vehicle | null>(null);

  const filteredFleet = useMemo(() => {
    if (selectedCategory === "SEMUA") return fleet;
    return fleet.filter((v) => v.category === selectedCategory);
  }, [fleet, selectedCategory]);

  const handleBooking = (v: Vehicle) => {
    if (!user) {
      setSelectedVehicleForAuth(v);
      setIsAuthModalOpen(true);
    } else {
      router.push(`/pesan/${v.id}`);
    }
  };

  // Pickup spots covered
  const coveredSpots = useMemo(() => {
    return YOGYAKARTA_PICKUP_SPOTS.filter((s) => rental.coverageSpotIds.includes(s.id));
  }, [rental.coverageSpotIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* HERO BANNER SECTION */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <Image
            src={rental.bannerUrl}
            alt={rental.name}
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Breadcrumb over banner */}
          <div className="absolute top-28 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/cari" className="hover:text-blue-400 transition-colors">
                Mitra Rental
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-semibold">{rental.name}</span>
            </div>
          </div>
        </div>

        {/* PROFILE HEADER OVERLAY CARD */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Avatar + Main Identity */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0 bg-slate-100">
                  <Image src={rental.avatarUrl} alt={rental.name} fill className="object-cover" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950">
                      {rental.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      NIB Terverifikasi: {rental.nib}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    {rental.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      {rental.rating} ({rental.totalReviews} ulasan)
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800">
                      {rental.completedBookings} Sewa Selesai
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {rental.operatingHours}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {rental.district}, {rental.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Direct WhatsApp & Tel) */}
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                <a
                  href={`https://wa.me/${rental.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Features Pill Strip */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3 overflow-x-auto pb-1">
              {rental.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TABS CONTROLLER */}
          <div className="flex items-center gap-2 mt-8 border-b border-slate-200 pb-px">
            <button
              onClick={() => setActiveTab("fleet")}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "fleet"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Armada Tersedia ({fleet.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "reviews"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ulasan Penyewa ({rental.reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("coverage")}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "coverage"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Area Antar-Jemput ({coveredSpots.length})</span>
            </button>
          </div>

          {/* TAB 1: FLEET CATALOG */}
          {activeTab === "fleet" && (
            <div className="pt-6">
              {/* Category Pills Filter */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                {["SEMUA", "MPV", "SUV", "CITY_CAR", "EV"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat === "SEMUA" ? "Semua Kategori" : cat}
                  </button>
                ))}
              </div>

              {filteredFleet.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                  <p className="text-sm text-slate-500">
                    Tidak ada unit untuk kategori terpilih pada mitra ini.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFleet.map((vehicle) => {
                    const inCompare = isInCompare(vehicle.id);

                    return (
                      <div
                        key={vehicle.id}
                        className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                            <Image
                              src={vehicle.thumbnailUrl}
                              alt={vehicle.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white">
                              {vehicle.category}
                            </div>
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950">
                              {vehicle.licensePlate}
                            </div>
                          </div>

                          <div className="p-5">
                            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
                              {vehicle.brand} • {vehicle.year}
                            </span>
                            <Link
                              href={`/listing/${vehicle.id}`}
                              className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1 mt-0.5"
                            >
                              {vehicle.name}
                            </Link>

                            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 my-3 text-xs text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                                <span>{vehicle.transmission}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <span>{vehicle.seatingCapacity} Seat</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Fuel className="w-3.5 h-3.5 text-slate-400" />
                                <span>{vehicle.fuelType}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price & Booking Footer */}
                        <div className="p-5 pt-0">
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div>
                              <div className="text-base font-black text-slate-900 tabular-nums">
                                {formatRupiah(vehicle.baseDailyRate)}
                              </div>
                              <span className="text-[10px] text-slate-400">/24 Jam All-In</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => toggleCompare(vehicle.id)}
                                className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                  inCompare
                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                                title="Bandingkan mobil ini"
                              >
                                <Scale className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBooking(vehicle)}
                                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                              >
                                Pesan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REVIEWS & MERCHANT REPLIES (FR-REVIEW-001, FR-REVIEW-003) */}
          {activeTab === "reviews" && (
            <div className="pt-6 space-y-4 max-w-4xl">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-center gap-2.5">
                <BadgeCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  <strong>Ulasan Terverifikasi:</strong> Semua ulasan berasal dari penyewa sah yang telah menyelesaikan masa sewa armada mitra ini via platform resmi DriveO.
                </span>
              </div>

              {rental.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {rev.authorName}
                        </span>
                        <span className="text-xs text-slate-400">dari {rev.authorCity}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">• {rev.date}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Sewa: {rev.vehicleName}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {/* MERCHANT REPLY (FR-REVIEW-003) */}
                  {rev.merchantReply && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-50 border-l-4 border-blue-600 text-xs text-slate-700 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-900 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" />
                          Tanggapan Resmi: {rev.merchantReply.author}
                        </span>
                        <span className="text-slate-400">{rev.merchantReply.date}</span>
                      </div>
                      <p className="text-slate-600 italic leading-relaxed">
                        &ldquo;{rev.merchantReply.comment}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: COVERAGE AREAS */}
          {activeTab === "coverage" && (
            <div className="pt-6 max-w-4xl">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Titik Antar-Jemput Disediakan Mitra
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mitra siap mengantar dan mengambil unit armada di lokasi-lokasi strategis Yogyakarta berikut:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coveredSpots.map((spot) => (
                    <div
                      key={spot.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                    >
                      <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">
                          {spot.name}
                        </span>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {spot.description}
                        </span>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="text-blue-700 font-bold">
                            {spot.extraFee === 0 ? "Gratis Antar" : `Biaya Antar: +${formatRupiah(spot.extraFee)}`}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">
                            Estimasi: ~{spot.estimatedDeliveryMin} menit
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Compare Bar */}
      <CompareFloatingBar />

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
