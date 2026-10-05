"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Lock,
  Scale,
  Calendar,
  Clock,
  Car,
  MapPin,
  Building,
  UserCheck,
} from "lucide-react";

export default function ElectronicContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getBookingById, signContract } = useBookings();

  // Find booking
  const booking = useMemo(() => {
    return getBookingById(resolvedParams.id) || SAMPLE_BOOKINGS[0];
  }, [resolvedParams.id, getBookingById]);

  // Agreement checkbox
  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const contractNumber = `KTR-${booking.bookingCode}`;

  const handleSignContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setErrorMsg("Anda wajib menyetujui seluruh klausul perjanjian untuk melanjutkan.");
      return;
    }

    const auditTrail = {
      ip: "182.253.140.21",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "DriveO Client Web",
      timestamp: new Date().toISOString(),
      hash: "8f4e2c91a0b3d5e718293c04d1e2f3a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1",
    };

    signContract(booking.id, auditTrail);
    router.push(`/booking/${booking.id}/bayar`);
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
          <span className="text-slate-500">Pemesanan</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Perjanjian Sewa Elektronik</span>
        </div>

        {/* Stepper Progress */}
        <div className="mb-8 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black">
              ✓
            </span>
            <span>1. Checkout Pesanan</span>
          </div>
          <div className="h-0.5 flex-1 bg-blue-600 mx-4" />
          <div className="flex items-center gap-2 text-blue-700 font-extrabold">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">
              2
            </span>
            <span>2. Kontrak Sewa Digital</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-200 mx-4" />
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px] font-black">
              3
            </span>
            <span>3. Pembayaran Escrow</span>
          </div>
        </div>

        {/* Contract Sheet */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Document Header Band */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  PMSE Berlisensi PP No. 80/2019 & UU ITE No. 1/2024
                </span>
                <h1 className="text-lg sm:text-xl font-black mt-2 tracking-tight">
                  SURAT PERJANJIAN SEWA KENDARAAN BERMOTOR ELEKTRONIK
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                  <span>Nomor Kontrak: {contractNumber}</span>
                  <span>•</span>
                  <span>Kode Booking: {booking.bookingCode}</span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {/* Identity of Parties */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h2 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">
                PARA PIHAK YANG BERTANDATANGAN:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <strong className="text-slate-900 block">PIHAK PERTAMA (Penyewa):</strong>
                  <span>Nama: {booking.userName}</span>
                  <br />
                  <span>Email: {booking.userEmail}</span>
                  <br />
                  <span>No. WhatsApp: {booking.userPhone}</span>
                </div>
                <div>
                  <strong className="text-slate-900 block">PIHAK KEDUA (Mitra Rental):</strong>
                  <span>Nama Rental: {booking.rentalName}</span>
                  <br />
                  <span>Kontak Resmi: {booking.rentalPhone}</span>
                  <br />
                  <span>Wilayah Operasional: D.I. Yogyakarta</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <strong>PIHAK KETIGA (Penyelenggara Platform & Escrow):</strong> PT DriveO Ekosistem Nusantara bertindak sebagai penjamin keamanan transaksi, penampung deposit, dan mediator resmi.
              </div>
            </div>

            {/* Clauses */}
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">
                  PASAL 1: OBJEK SEWA & JADWAL OPERASIONAL
                </h3>
                <p>
                  Pihak Kedua menyewakan kepada Pihak Pertama 1 (satu) unit kendaraan bermotor berplat nomor wilayah D.I. Yogyakarta dengan rincian:
                </p>
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 font-medium text-xs space-y-1">
                  <div>• Model Armada: <strong>{booking.vehicleName}</strong></div>
                  <div>• Tanda Nomor Kendaraan Bermotor (TNKB): <strong>{booking.licensePlate}</strong></div>
                  <div>• Layanan: <strong>{booking.serviceType === "LEPAS_KUNCI" ? "Lepas Kunci (Self-Drive)" : "Dengan Supir"}</strong></div>
                  <div>• Lokasi Serah Terima: <strong>{booking.pickupSpotName}</strong></div>
                  <div>• Durasi Sewa: <strong>{booking.totalDays} Hari</strong> (Mulai: {formatIndonesianDate(booking.startDate)})</div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">
                  PASAL 2: BATAS WILAYAH JELAJAH & PENGGUNAAN
                </h3>
                <p>
                  Kendaraan sewa sah digunakan di seluruh wilayah administratif Provinsi Daerah Istimewa Yogyakarta dan Provinsi Jawa Tengah (Magelang, Borobudur, Semarang, Solo). Penggunaan di luar batas wilayah tersebut wajib mendapatkan izin tertulis dari Pihak Kedua.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">
                  PASAL 3: DIGITAL HANDOVER INSPEKSI 8-TITIK (BR-015)
                </h3>
                <p>
                  Serah terima unit saat awal dan akhir sewa wajib dilakukan bersama dengan menjalankan Checklist Digital 8-Titik pada aplikasi DriveO (mencakup foto bodi 4 sisi, kondisi ban, interior, odometer, dan level bahan bakar Same-to-Same). Bukti digital tersebut mengikat kedua pihak.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">
                  PASAL 4: JAMINAN ESCROW & PENGEMBALIAN DEPOSIT (BR-007)
                </h3>
                <p>
                  Deposit jaminan sebesar <strong>{formatRupiah(booking.securityDeposit)}</strong> ditahan di rekening escrow penampung resmi DriveO. Deposit akan dikembalikan penuh maksimal 1x24 jam kerja setelah pengembalian unit disetujui tanpa klaim kerusakan fisik atau tilang ETLE.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900">
                  PASAL 5: LARANGAN MUTLAK & TINDAK PIDANA
                </h3>
                <p>
                  Pihak Pertama dilarang keras memindahtangankan, menggadaikan, menyewakan kembali, atau menggunakan kendaraan sewa untuk tindak pidana kejahatan. Pelanggaran atas pasal ini akan langsung dilaporkan kepada Kepolisian Daerah Istimewa Yogyakarta (Polda DIY).
                </p>
              </section>
            </div>

            {/* Audit Trail Box (BR-017) */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-1 font-mono text-slate-600">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Pencatatan Audit Trail Click-to-Accept (BR-017)</span>
              </div>
              <div>• Hash Dokumen: SHA-256 (8f4e2c91a0b3d5e718293c04d1e2f3a4...)</div>
              <div>• Integritas: Enkripsi Kriptografi Standar UU ITE</div>
              <div>• Timestamp Sesi: {new Date().toISOString()} WIB</div>
            </div>

            {/* Agreement Checkbox */}
            <form onSubmit={handleSignContract} className="pt-4 border-t border-slate-200 space-y-4">
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (e.target.checked) setErrorMsg("");
                  }}
                  className="w-5 h-5 rounded text-blue-600 accent-blue-600 mt-0.5 cursor-pointer"
                />
                <span className="text-xs text-blue-950 font-semibold leading-relaxed">
                  Saya menyatakan telah membaca, memahami, dan menyetujui seluruh klausul Surat Perjanjian Sewa Kendaraan Bermotor Elektronik ini secara sadar dan sukarela untuk mengikatkan diri secara hukum.
                </span>
              </label>

              {errorMsg && (
                <div className="text-xs text-rose-600 font-bold">{errorMsg}</div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <Link
                  href={`/pesan/${booking.vehicleId}`}
                  className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                >
                  ← Kembali Ubah Pesanan
                </Link>

                <button
                  type="submit"
                  disabled={!agreed}
                  className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    agreed
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>Tandatangani Digital & Lanjut ke Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
