"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatIndonesianDate } from "@/lib/utils";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
  Car,
  Building2,
  Lock,
} from "lucide-react";

export default function BookingReviewFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getBookingById } = useBookings();

  const booking = useMemo(() => {
    return (
      getBookingById(resolvedParams.id) ||
      SAMPLE_BOOKINGS.find((b) => b.id === "bk-active-demo-03") ||
      SAMPLE_BOOKINGS[0]
    );
  }, [resolvedParams.id, getBookingById]);

  // Eligibility check: only completed bookings can review
  const isEligible = booking.status === "SELESAI";

  const [ratings, setRatings] = useState({
    cleanliness: 5,
    punctuality: 5,
    service: 5,
    vehiclePerformance: 5,
  });

  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const averageRating = useMemo(() => {
    const sum =
      ratings.cleanliness +
      ratings.punctuality +
      ratings.service +
      ratings.vehiclePerformance;
    return (sum / 4).toFixed(1);
  }, [ratings]);

  const handleRatingChange = (key: keyof typeof ratings, score: number) => {
    setRatings((prev) => ({ ...prev, [key]: score }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        router.push("/akun/ulasan");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
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
          <Link href={`/booking/${booking.id}`} className="hover:text-blue-600 transition-colors">
            {booking.bookingCode}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Tulis Ulasan Sewa</span>
        </div>

        {/* Eligibility Check Gate */}
        {!isEligible ? (
          <div className="bg-amber-50 border border-amber-300 rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-amber-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
              Eligibility Gate (FR-REVIEW-002)
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-3">
              Ulasan Hanya Dapat Diberikan Setelah Sewa Selesai
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
              Status transaksi Anda saat ini adalah{" "}
              <span className="font-bold text-slate-900 uppercase tracking-wide">
                {booking.status}
              </span>
              . Formulir ulasan reputasi hanya dapat diisi setelah proses pengembalian unit dan serah terima kunci dikonfirmasi secara tuntas oleh mitra rental.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/booking/${booking.id}/pengembalian`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer text-sm"
              >
                <span>Buka Formulir Pengembalian Unit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/booking/${booking.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all cursor-pointer text-sm"
              >
                Kembali ke Detail Pesanan
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Top Unit Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={booking.vehicleThumbnail}
                      alt={booking.vehicleName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {booking.licensePlate}
                    </span>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 line-clamp-1">
                      {booking.vehicleName}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mitra: <span className="font-semibold text-slate-700">{booking.rentalName}</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                  <span className="text-xs text-slate-500 block">Transaksi Selesai</span>
                  <span className="text-xs font-semibold text-slate-900 block font-mono">
                    {formatIndonesianDate(booking.endDate)}
                  </span>
                  <span className="text-xs text-emerald-600 font-medium block mt-1 flex sm:justify-end items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Ulasan Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-8">
              {/* Bagian 1: Multi-Dimension Rating */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      1. Penilaian Bintang Multi-Dimensi (1–5)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Berikan penilaian transparan untuk membantu calon penyewa lainnya di Yogyakarta
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200 self-start sm:self-auto">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    <div>
                      <span className="text-xs text-amber-900 font-bold block">Rating Agregat</span>
                      <span className="text-xl font-black text-slate-900 font-mono tabular-nums leading-none">
                        {averageRating} / 5.0
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { key: "cleanliness" as const, label: "Kebersihan & Kerapian Armada Mobil", sub: "Kondisi interior, wangi kabin, dan jok kursi" },
                    { key: "punctuality" as const, label: "Ketepatan Waktu Serah Terima", sub: "Kehadiran staf di titik jemput (stasiun/bandara)" },
                    { key: "service" as const, label: "Keramahan Pelayanan Staf Rental", sub: "Respons komunikasi dan kejelasan penjelasan SOP" },
                    { key: "vehiclePerformance" as const, label: "Performa Mesin & Efisiensi Bahan Bakar", sub: "Tarikan mesin, AC dingin, dan rem berfungsi prima" },
                  ].map((dim) => (
                    <div
                      key={dim.key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-100"
                    >
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                          {dim.label}
                        </span>
                        <span className="text-[11px] text-slate-500">{dim.sub}</span>
                      </div>

                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(dim.key, star)}
                            className="p-1.5 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= ratings[dim.key]
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-mono font-bold text-slate-700 ml-2 w-4 text-center">
                          {ratings[dim.key]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian 2: Testimoni Pengalaman Sewa */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  2. Ceritakan Pengalaman Berkendara Anda
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Bagikan cerita perjalanan Anda di Jogja, rute destinasi yang dikunjungi, atau rekomendasi unit
                </p>

                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Contoh: Sangat puas menyewa mobil ini untuk keliling pantai di Gunungkidul dan jalan-jalan santai di Malioboro. Mobil bersih, tarikan enteng, dan bensin irit. Staf Tugu Rent sangat ramah tepat waktu di stasiun!"
                  className="w-full text-xs sm:text-sm p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none transition-all leading-relaxed"
                />

                {/* Upload Foto Pengalaman */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Foto Pengalaman di Destinasi Jogja (Opsional):
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                      <Image
                        src={photos[0]}
                        alt="Photo Experience"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 block">1 Foto Terlampir</span>
                      <span>Foto mobil saat berada di Yogyakarta</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <Link
                  href={`/booking/${booking.id}`}
                  className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all text-center cursor-pointer text-sm"
                >
                  Batal
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || successAnimation || !comment.trim()}
                  className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Menyimpan Ulasan...</span>
                  ) : successAnimation ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>Ulasan Berhasil Dipublikasikan!</span>
                    </>
                  ) : (
                    <>
                      <span>Publikasikan Ulasan & Reputasi</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
