"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { AccountNav } from "@/components/account/account-nav";
import { formatIndonesianDate } from "@/lib/utils";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Building2,
  Calendar,
  ThumbsUp,
  Sparkles,
  Award,
  ChevronRight,
  ArrowRight,
  Car,
} from "lucide-react";

export default function AccountReviewsPage() {
  const [activeTab, setActiveTab] = useState<"GIVEN" | "RECEIVED">("GIVEN");

  const givenReviews = [
    {
      id: "rev-g-1",
      bookingCode: "DVO-202610-8912",
      vehicleName: "Toyota Innova Zenix 2.0 Q Hybrid TSS 2024",
      vehicleThumbnail:
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80",
      rentalName: "Tugu Rent Jogja",
      overallRating: 5.0,
      ratings: {
        cleanliness: 5,
        punctuality: 5,
        service: 5,
        vehiclePerformance: 5,
      },
      comment:
        "Sangat puas menyewa mobil ini untuk keliling pantai di Gunungkidul dan jalan-jalan santai di Malioboro. Mobil bersih, tarikan enteng, dan bensin irit. Staf Tugu Rent sangat ramah tepat waktu di stasiun!",
      date: "2026-10-05T10:00:00Z",
      merchantReply: {
        author: "Agus Pratama (Manajer Operasional Tugu Rent)",
        comment:
          "Matur nuwun sanget Mas Budi! Senang bisa melayani perjalanan keluarga Anda di Yogyakarta. Ditunggu kedatangannya kembali di rental kami!",
        date: "2026-10-05T11:15:00Z",
      },
    },
    {
      id: "rev-g-2",
      bookingCode: "DVO-202609-1204",
      vehicleName: "Toyota All New Avanza 1.5 G CVT 2024",
      vehicleThumbnail:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
      rentalName: "Malioboro Trans & Tour",
      overallRating: 4.8,
      ratings: {
        cleanliness: 5,
        punctuality: 4,
        service: 5,
        vehiclePerformance: 5,
      },
      comment:
        "Mobil nyaman untuk keluarga 6 orang. AC dingin sampai baris ketiga. Penjemputan di Bandara YIA lancar tanpa kendala.",
      date: "2026-09-18T16:00:00Z",
    },
  ];

  const receivedReviews = [
    {
      id: "rev-r-1",
      rentalName: "Tugu Rent Jogja",
      rating: 5.0,
      badge: "Penyewa Sangat Teladan",
      comment:
        "Mas Budi adalah penyewa yang luar biasa bertanggung jawab. Unit Honda Brio dikembalikan dalam kondisi bodi sangat bersih, bensin tepat penuh (same-to-same), dan tepat waktu. Sangat direkomendasikan untuk seluruh mitra rental di DIY!",
      date: "2026-10-05T09:30:00Z",
    },
    {
      id: "rev-r-2",
      rentalName: "Malioboro Trans & Tour",
      rating: 5.0,
      badge: "Penyewa Prioritas",
      comment:
        "Komunikasi sangat lancar, patuh terhadap seluruh SOP perjanjian sewa lepas kunci. Identitas e-KYC lengkap dan terverifikasi.",
      date: "2026-09-19T10:00:00Z",
    },
  ];

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
          <Link href="/akun" className="hover:text-blue-600 transition-colors">
            Akun Saya
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Riwayat Ulasan & Reputasi</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <AccountNav />

          {/* Main Content */}
          <div className="flex-1 w-full space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Riwayat Ulasan & Reputasi Dua Arah
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Ekosistem transparansi reputasi timbal balik antara Penyewa dan Pemilik Rental di Yogyakarta (FR-REVIEW-003/004)
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-2xl border border-amber-200 shrink-0">
                  <Award className="w-8 h-8 text-amber-500" />
                  <div>
                    <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">
                      Skor Reputasi Penyewa
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-2xl font-black text-slate-900 font-mono">4.95</span>
                      <span className="text-xs text-emerald-600 font-bold">/ 5.0 (Sangat Terpercaya)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="pt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("GIVEN")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "GIVEN"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Ulasan yang Saya Berikan ({givenReviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("RECEIVED")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "RECEIVED"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Reputasi yang Saya Terima ({receivedReviews.length})
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "GIVEN" ? (
              <div className="space-y-4">
                {givenReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <Image
                            src={rev.vehicleThumbnail}
                            alt={rev.vehicleName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block line-clamp-1">
                            {rev.vehicleName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Rental: <strong className="text-slate-700">{rev.rentalName}</strong> • Ref:{" "}
                            <span className="font-mono">{rev.bookingCode}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            {rev.overallRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatIndonesianDate(rev.date)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                      &quot;{rev.comment}&quot;
                    </p>

                    {/* Merchant Official Reply */}
                    {rev.merchantReply && (
                      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 ml-4 sm:ml-6 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Tanggapan Resmi dari Pemilik Rental:</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed pt-1">
                          &quot;{rev.merchantReply.comment}&quot;
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                          {rev.merchantReply.author} • {formatIndonesianDate(rev.merchantReply.date)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {receivedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {rev.rentalName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Diverifikasi oleh Platform • {formatIndonesianDate(rev.date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-900 font-mono">5.0</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{rev.badge}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
