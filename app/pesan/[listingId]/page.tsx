"use client";

import { useState, useMemo, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useAuth } from "@/lib/store/auth-store";
import { useBookings } from "@/lib/store/booking-store";
import {
  FEATURED_YOGYAKARTA_VEHICLES,
  YOGYAKARTA_PICKUP_SPOTS,
  getVehicleById,
  getRentalById,
} from "@/lib/mock-data/yogyakarta";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import { PaymentScheme, ServiceType } from "@/types/domain";
import {
  Car,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  Fuel,
  Gauge,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  UserCheck,
  CreditCard,
  Sparkles,
  Info,
} from "lucide-react";

export default function BookingCheckoutPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { createBooking } = useBookings();

  // Find vehicle
  const vehicle = useMemo(
    () => getVehicleById(resolvedParams.listingId) || FEATURED_YOGYAKARTA_VEHICLES[0],
    [resolvedParams.listingId]
  );

  // Find rental partner
  const rental = useMemo(
    () => getRentalById(vehicle.rentalId) || {
      name: vehicle.rentalName,
      whatsapp: "+62 812 3456 7890",
      phone: "+62 274 589 123",
    },
    [vehicle.rentalId, vehicle.rentalName]
  );

  // URL query pre-fills
  const initialDays = Number(searchParams.get("hari")) || 2;
  const initialSpotId = searchParams.get("spot") || "spot-tugu";

  // Form states
  const [totalDays, setTotalDays] = useState<number>(initialDays);
  const [selectedSpotId, setSelectedSpotId] = useState<string>(initialSpotId);
  const [serviceType, setServiceType] = useState<ServiceType>("LEPAS_KUNCI");
  const [paymentScheme, setPaymentScheme] = useState<PaymentScheme>("FULL");
  const [startDateStr, setStartDateStr] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState<string>("09:00");
  const [specialNotes, setSpecialNotes] = useState<string>("");

  // Countdown holding timer state (FR-BOOKING-001)
  const [timeLeft, setTimeLeft] = useState<number>(899); // 14 mins 59 secs

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Spot calculations
  const selectedSpot = useMemo(
    () => YOGYAKARTA_PICKUP_SPOTS.find((s) => s.id === selectedSpotId) || YOGYAKARTA_PICKUP_SPOTS[1],
    [selectedSpotId]
  );

  // Financial calculations (BR-026)
  const driverFeePerDay = serviceType === "DENGAN_SUPIR" ? 200000 : 0;
  const dailyRateTotal = vehicle.baseDailyRate + driverFeePerDay;
  const rentalTotal = dailyRateTotal * totalDays;
  const deliveryFee = selectedSpot.extraFee;
  const securityDeposit = serviceType === "LEPAS_KUNCI" ? vehicle.securityDeposit : 0;
  const grandTotal = rentalTotal + deliveryFee + securityDeposit;

  const paidAmount = paymentScheme === "FULL" ? grandTotal : Math.round(grandTotal * 0.3);
  const remainingAmount = grandTotal - paidAmount;

  // Handle Form Submission -> creates booking -> redirects to #19 Perjanjian
  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${startDateStr}T${startTime}:00Z`).toISOString();
    const endDateTime = new Date(
      new Date(startDateTime).getTime() + totalDays * 86400000
    ).toISOString();

    const newBooking = createBooking({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleThumbnail: vehicle.thumbnailUrl,
      licensePlate: vehicle.licensePlate,
      rentalId: vehicle.rentalId,
      rentalName: vehicle.rentalName,
      rentalPhone: rental.whatsapp || "+62 812 3456 7890",
      userId: user?.id || "usr-penyewa-01",
      userName: user?.name || "Budi Santoso",
      userEmail: user?.email || "budi.santoso@gmail.com",
      userPhone: user?.phone || "081234567890",
      startDate: startDateTime,
      endDate: endDateTime,
      totalDays,
      pickupSpotId: selectedSpot.id,
      pickupSpotName: selectedSpot.name,
      serviceType,
      paymentScheme,
      baseDailyRate: vehicle.baseDailyRate,
      rentalTotal,
      deliveryFee,
      securityDeposit,
      grandTotal,
    });

    router.push(`/booking/${newBooking.id}/perjanjian`);
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
          <Link href={`/listing/${vehicle.id}`} className="hover:text-blue-600 transition-colors">
            {vehicle.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Formulir Pemesanan</span>
        </div>

        {/* Temporary Unit Holding Timer Ribbon (FR-BOOKING-001) */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-amber-950 font-bold">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Unit Dikunci Sementara: Selesaikan pemesanan sebelum batas waktu habis</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-amber-600 text-white font-mono font-black text-xs tracking-wider">
            {formatTimer(timeLeft)}
          </div>
        </div>

        <form onSubmit={handleProceed}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT 7-COL: BOOKING CONFIGURATION */}
            <div className="lg:col-span-7 space-y-6">
              {/* Vehicle Selected Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative aspect-[16/10] w-full sm:w-44 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                  <Image src={vehicle.thumbnailUrl} alt={vehicle.name} fill className="object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white">
                    {vehicle.category}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {vehicle.brand} • {vehicle.year}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                      Plat {vehicle.licensePlate}
                    </span>
                  </div>
                  <h1 className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                    {vehicle.name}
                  </h1>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Mitra: <strong>{vehicle.rentalName}</strong> (Garasi Kota Jogja)
                  </span>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      {vehicle.transmission}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {vehicle.seatingCapacity} Kursi
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      {vehicle.fuelType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Type Switcher (Lepas Kunci vs Dengan Supir) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Pilihan Layanan Sewa</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setServiceType("LEPAS_KUNCI")}
                    className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                      serviceType === "LEPAS_KUNCI"
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-slate-950 block">
                        Lepas Kunci (Self-Drive)
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Bebas jelajah DIY & Jateng dengan menyetir sendiri. Wajib SIM A aktif.
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="serviceType"
                      checked={serviceType === "LEPAS_KUNCI"}
                      onChange={() => setServiceType("LEPAS_KUNCI")}
                      className="accent-blue-600 mt-1"
                    />
                  </label>

                  <label
                    onClick={() => setServiceType("DENGAN_SUPIR")}
                    className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                      serviceType === "DENGAN_SUPIR"
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-950 block">
                          Dengan Supir (+Rp 200 rb/hari)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Termasuk driver lokal ramah yang paham rute wisata Jogja. Tanpa deposit garansi.
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="serviceType"
                      checked={serviceType === "DENGAN_SUPIR"}
                      onChange={() => setServiceType("DENGAN_SUPIR")}
                      className="accent-blue-600 mt-1"
                    />
                  </label>
                </div>

                {/* e-KYC Verification Status Hint */}
                {serviceType === "LEPAS_KUNCI" && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>
                        Status e-KYC Akun:{" "}
                        <strong className="text-slate-900">
                          {user?.verificationStatus === "VERIFIED"
                            ? "Terverifikasi (Siap Lepas Kunci)"
                            : "Menunggu / Belum Lengkap"}
                        </strong>
                      </span>
                    </div>
                    {user?.verificationStatus !== "VERIFIED" && (
                      <Link
                        href="/akun/verifikasi"
                        target="_blank"
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Lengkapi e-KYC →
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Schedule and Duration Picker */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Jadwal & Durasi Sewa</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Tanggal Mulai Sewa
                    </label>
                    <input
                      type="date"
                      required
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Jam Serah Terima
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="07:00">07:00 WIB (Pagi)</option>
                      <option value="09:00">09:00 WIB (Pagi)</option>
                      <option value="12:00">12:00 WIB (Siang)</option>
                      <option value="15:00">15:00 WIB (Sore)</option>
                      <option value="19:00">19:00 WIB (Malam)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Durasi Sewa (Hari)
                    </label>
                    <select
                      value={totalDays}
                      onChange={(e) => setTotalDays(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => (
                        <option key={d} value={d}>
                          {d} Hari ({d * 24} Jam)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pickup Spot Selector */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Titik Penjemputan di Yogyakarta</span>
                </h2>

                <div className="space-y-2">
                  {YOGYAKARTA_PICKUP_SPOTS.map((spot) => (
                    <label
                      key={spot.id}
                      onClick={() => setSelectedSpotId(spot.id)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        selectedSpotId === spot.id
                          ? "border-blue-600 bg-blue-50/40 shadow-sm"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pickupSpot"
                          checked={selectedSpotId === spot.id}
                          onChange={() => setSelectedSpotId(spot.id)}
                          className="accent-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {spot.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {spot.description} (Estimasi antar: ~{spot.estimatedDeliveryMin} menit)
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-blue-700 whitespace-nowrap">
                        {spot.extraFee === 0 ? "Gratis Antar" : `+${formatRupiah(spot.extraFee)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Scheme Selection (FR-PAYMENT-002) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Skema Pembayaran Transaksi</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentScheme("FULL")}
                    className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                      paymentScheme === "FULL"
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-950">
                          Bayar Penuh 100% (Rekomendasi)
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-600 text-white">
                          PRIORITAS
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">
                        Langsung lunas di awal. Serah terima mobil instan di lokasi tanpa transaksi pembayaran tambahan.
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentScheme"
                      checked={paymentScheme === "FULL"}
                      onChange={() => setPaymentScheme("FULL")}
                      className="accent-blue-600 mt-1"
                    />
                  </label>

                  <label
                    onClick={() => setPaymentScheme("DP_30")}
                    className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                      paymentScheme === "DP_30"
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-slate-950 block">
                        Uang Muka (DP 30%)
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">
                        Bayar 30% untuk mengunci jadwal armada. Pelunasan 70% dibayarkan sebelum serah terima kunci.
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentScheme"
                      checked={paymentScheme === "DP_30"}
                      onChange={() => setPaymentScheme("DP_30")}
                      className="accent-blue-600 mt-1"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT 5-COL: STICKY BILLING BREAKDOWN (BR-026) */}
            <div className="lg:col-span-5 sticky top-28 space-y-4">
              <div className="bg-white rounded-3xl border-2 border-slate-900/10 p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h3 className="font-extrabold text-slate-950 text-sm">
                    Rincian Biaya All-In Transparan
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    BR-026 COMPLIANT
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Sewa {vehicle.name} ({totalDays} hari × {formatRupiah(vehicle.baseDailyRate)})
                    </span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {formatRupiah(vehicle.baseDailyRate * totalDays)}
                    </span>
                  </div>

                  {serviceType === "DENGAN_SUPIR" && (
                    <div className="flex justify-between text-slate-600">
                      <span>Jasa Driver Profesional ({totalDays} hari × Rp 200 rb)</span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {formatRupiah(200000 * totalDays)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Antar ke {selectedSpot.name}</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {deliveryFee === 0 ? "Gratis" : formatRupiah(deliveryFee)}
                    </span>
                  </div>

                  {serviceType === "LEPAS_KUNCI" && (
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <span>Deposit Garansi Kerusakan</span>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          (100% Refundable)
                        </span>
                      </span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {formatRupiah(securityDeposit)}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-extrabold text-slate-900 text-sm">Grand Total</span>
                    <span className="text-xl font-black text-slate-950 tabular-nums">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>

                  {/* Payment scheme breakdown */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-1.5 mt-2">
                    <div className="flex justify-between font-bold text-xs text-blue-950">
                      <span>
                        Dibayar Sekarang ({paymentScheme === "FULL" ? "100% Lunas" : "DP 30%"}):
                      </span>
                      <span className="text-blue-700 text-sm font-black tabular-nums">
                        {formatRupiah(paidAmount)}
                      </span>
                    </div>

                    {paymentScheme === "DP_30" && (
                      <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-blue-200/50">
                        <span>Sisa Pelunasan (70%):</span>
                        <span className="font-bold tabular-nums">
                          {formatRupiah(remainingAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Escrow Guarantee Box */}
                <div className="mt-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Proteksi Rekening Escrow DriveO</span>
                    <p className="text-[11px] text-emerald-800 leading-tight mt-0.5">
                      Uang Anda aman. Dana sewa hanya dicairkan ke rental setelah serah terima unit disetujui. Deposit jaminan kembali 100% setelah sewa selesai.
                    </p>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full mt-5 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lanjut ke Perjanjian Sewa Elektronik</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-3 text-center">
                  <span className="text-[11px] text-slate-400">
                    Langkah 1 dari 4: Checkout $\rightarrow$ Kontrak Digital $\rightarrow$ Bayar $\rightarrow$ Voucher
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
