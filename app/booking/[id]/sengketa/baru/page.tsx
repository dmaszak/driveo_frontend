"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { useDisputes } from "@/lib/store/dispute-store";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import { DisputeCategory } from "@/types/domain";
import {
  AlertTriangle,
  Scale,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  Upload,
  Info,
  CheckCircle2,
  FileText,
  DollarSign,
  Car,
} from "lucide-react";

export default function OpenDisputePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getBookingById } = useBookings();
  const { createDispute } = useDisputes();

  const booking = useMemo(() => {
    return (
      getBookingById(resolvedParams.id) ||
      SAMPLE_BOOKINGS.find((b) => b.id === "bk-active-demo-03") ||
      SAMPLE_BOOKINGS[0]
    );
  }, [resolvedParams.id, getBookingById]);

  const [category, setCategory] = useState<DisputeCategory>("KLAIM_DEPOSIT_SEPIHAK");
  const [claimedAmount, setClaimedAmount] = useState<number>(booking.securityDeposit);
  const [description, setDescription] = useState("");
  const [demands, setDemands] = useState(
    "Pencairan deposit jaminan 100% penuh kembali ke rekening penyewa tanpa potongan sepihak."
  );
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket = createDispute({
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
        vehicleName: booking.vehicleName,
        vehicleThumbnail: booking.vehicleThumbnail,
        rentalName: booking.rentalName,
        category,
        description,
        claimedAmount,
        demands,
        renterEvidenceUrls: evidencePhotos,
      });

      setIsSubmitting(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        router.push(`/sengketa/${newTicket.id}`);
      }, 1500);
    }, 1200);
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
          <span className="text-slate-900 font-semibold">Buka Tiket Sengketa Resmi</span>
        </div>

        {/* Warning & Escrow Freeze Banner */}
        <div className="rounded-3xl p-6 sm:p-7 border border-amber-300 bg-amber-50/80 text-amber-950 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
                Mediasi Independen DriveO (FR-DISPUTE-001)
              </span>
              <h1 className="text-xl sm:text-2xl font-bold mt-2">
                Pusat Penyelesaian Sengketa Transaksi Sewa
              </h1>
              <p className="text-sm mt-1 text-slate-700 leading-relaxed">
                Saat tiket sengketa resmi dibuka, <strong>seluruh pencairan dana deposit di rekening penampung escrow otomatis DIBEKUKAN sementara</strong>. Dana tidak akan diserahkan ke pihak rental maupun penyewa sampai Tim Mediasi Independen DriveO mengeluarkan putusan final yang objektif.
              </p>
            </div>
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
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
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 line-clamp-1">
                  {booking.vehicleName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mitra: <span className="font-semibold text-slate-700">{booking.rentalName}</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
              <span className="text-xs text-slate-500 block">Nilai Jaminan Deposit</span>
              <span className="text-lg font-mono font-bold text-emerald-600 block tabular-nums">
                {formatRupiah(booking.securityDeposit)}
              </span>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                Ref: {booking.bookingCode}
              </span>
            </div>
          </div>

          <div className="pt-6 flex items-start gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Tim Mediasi DriveO akan mengevaluasi bukti citra checklist serah terima digital, riwayat chat, dan SOP kerusakan resmi (PP 80/2019). Putusan mediasi bersifat final dan mengikat kedua belah pihak.
            </p>
          </div>
        </div>

        {/* Dispute Form */}
        <form onSubmit={handleSubmitDispute} className="space-y-8">
          {/* Bagian 1: Kategori Sengketa */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              1. Pilih Kategori Permasalahan Sengketa
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Pilih klasifikasi komplain yang paling menggambarkan kendala yang Anda alami
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  code: "KLAIM_DEPOSIT_SEPIHAK" as DisputeCategory,
                  title: "Klaim Pemotongan Deposit Sepihak",
                  desc: "Mitra memotong deposit atas lecet/baret yang sudah ada sejak serah terima awal",
                },
                {
                  code: "MOBIL_MOGOK_KENDALA_MESIN" as DisputeCategory,
                  title: "Mobil Mogok / Masalah Teknis",
                  desc: "Kendaraan mengalami kerusakan mesin atau AC mati selama perjalanan di DIY",
                },
                {
                  code: "MOBIL_TIDAK_SESUAI_SPESIFIKASI" as DisputeCategory,
                  title: "Mobil Tidak Sesuai Spesifikasi",
                  desc: "Unit yang diserahkan berbeda tipe, transmisi manual bukannya matic, dsb.",
                },
                {
                  code: "BIAYA_DEREK_DAN_KOMPENSASI" as DisputeCategory,
                  title: "Ganti Rugi Biaya Derek Darurat",
                  desc: "Penyewa mengeluarkan biaya darurat derek yang semestinya ditanggung pihak rental",
                },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setCategory(item.code)}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    category === item.code
                      ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <span className="text-sm font-bold text-slate-900 block">{item.title}</span>
                  <span className="text-xs text-slate-500 block mt-1 leading-relaxed">
                    {item.desc}
                  </span>
                  {category === item.code && (
                    <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bagian 2: Kronologi & Nilai Tuntutan */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              2. Uraian Kronologi & Nilai Dana yang Dipersengketakan
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Jelaskan kronologi kejadian secara objektif dan sebutkan nominal tuntutan Anda
            </p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Nominal Dana yang Dipersengketakan (Rupiah):
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={claimedAmount}
                    onChange={(e) => setClaimedAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-base text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:bg-white focus:outline-none tabular-nums"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 block">
                  Nilai maksimal sengketa adalah besaran deposit jaminan ({formatRupiah(booking.securityDeposit)})
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Kronologi Lengkap Peristiwa:
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Saat pengembalian mobil di Stasiun Tugu pada 6 Oktober pukul 14:00, staf rental menyatakan ada goresan baru di bemper kanan depan dan ingin memotong deposit Rp 150.000. Padahal pada foto inspeksi serah terima awal, goresan tersebut sudah tertera jelas di foto checklist nomor 2..."
                  className="w-full text-xs sm:text-sm p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:bg-white focus:outline-none transition-all leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Tuntutan Penyelesaian Penyewa:
                </label>
                <input
                  type="text"
                  required
                  value={demands}
                  onChange={(e) => setDemands(e.target.value)}
                  placeholder="Contoh: Pencairan kembali 100% deposit jaminan ke rekening saya"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bagian 3: Bukti Pendukung */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              3. Unggah Berkas & Bukti Pendukung
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Foto bukti perbandingan, nota bengkel, atau tangkapan layar percakapan WhatsApp
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {evidencePhotos.map((url, i) => (
                <div key={i} className="space-y-1 text-center">
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <Image src={url} alt={`Evidence ${i + 1}`} fill className="object-cover" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">
                    Bukti Dokumen #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Link
              href={`/booking/${booking.id}`}
              className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all text-center cursor-pointer text-sm"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || successAnimation || !description.trim()}
              className="w-full sm:w-auto px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-xl shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Membuka Tiket Mediasi...</span>
              ) : successAnimation ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Sengketa Terdaftar! Mengalihkan...</span>
                </>
              ) : (
                <>
                  <span>Buka Sengketa & Bekukan Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
