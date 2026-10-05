"use client";

import { useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useBookings, SAMPLE_BOOKINGS } from "@/lib/store/booking-store";
import { formatRupiah, formatIndonesianDate } from "@/lib/utils";
import {
  Ticket,
  QrCode,
  MapPin,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  Printer,
  Share2,
  CheckCircle2,
  ChevronRight,
  Phone,
  MessageCircle,
  FileCheck2,
  Users,
  Gauge,
  Fuel,
} from "lucide-react";

export default function DigitalVoucherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getBookingById } = useBookings();

  const booking = useMemo(() => {
    return getBookingById(resolvedParams.id) || SAMPLE_BOOKINGS[0];
  }, [resolvedParams.id, getBookingById]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo! Ini tiket sewa mobil resmi saya di DriveO:\nKode Booking: ${booking.bookingCode}\nArmada: ${booking.vehicleName} (${booking.licensePlate})\nTitik Jemput: ${booking.pickupSpotName}\nTanggal: ${formatIndonesianDate(booking.startDate)}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full print:pt-4 print:pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 print:hidden">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-500">Pemesanan</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Tiket & Voucher Digital</span>
        </div>

        {/* Action Bar (Print & Share) */}
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-blue-600" />
              <span>Voucher Digital Serah Terima Kendaraan</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tunjukkan QR Code ini kepada Staf Operasional Mitra saat pengambilan unit di lokasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Voucher</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim ke WA</span>
            </button>
          </div>
        </div>

        {/* TICKET CARD (PHYSICAL PERFORATION STYLE) */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden relative print:border print:shadow-none">
          {/* Ticket Header Ribbon */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-600 text-white">
                  DRIVEO VOUCHER RESMI
                </span>
                <span className="text-xs text-slate-400">Plat AB Yogyakarta</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {booking.vehicleName}
              </h2>
              <div className="text-xs text-slate-400 mt-1">
                Mitra Resmi: <strong className="text-white">{booking.rentalName}</strong>
              </div>
            </div>

            <div className="text-right self-start sm:self-auto bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Nomor Booking Tiket
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-amber-400">
                {booking.bookingCode}
              </span>
            </div>
          </div>

          {/* Ticket Middle Perforation Cut-outs (Left & Right Notch) */}
          <div className="relative py-2 bg-slate-100 flex items-center justify-between print:hidden">
            <div className="w-6 h-6 rounded-full bg-slate-50 -ml-3 border-r-2 border-slate-200" />
            <div className="border-b-2 border-dashed border-slate-300 w-full mx-2" />
            <div className="w-6 h-6 rounded-full bg-slate-50 -mr-3 border-l-2 border-slate-200" />
          </div>

          {/* Ticket Main Details */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left 8-Col: Details & Schedules */}
            <div className="md:col-span-8 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    Jadwal Mulai Sewa
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm block">
                    {formatIndonesianDate(booking.startDate)}
                  </span>
                  <span className="text-[11px] text-slate-500">Pukul 09:00 WIB</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    Jadwal Selesai Sewa
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm block">
                    {formatIndonesianDate(booking.endDate)}
                  </span>
                  <span className="text-[11px] text-slate-500">Durasi: {booking.totalDays} Hari</span>
                </div>
              </div>

              {/* Pickup Spot Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                <span className="text-[10px] font-bold text-blue-900 uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Titik Serah Terima Kendaraan di Yogyakarta:
                </span>
                <span className="text-sm font-extrabold text-blue-950 block">
                  {booking.pickupSpotName}
                </span>
                <span className="text-[11px] text-blue-800 block">
                  Staf mitra rental akan menunggu di zona drop-off / titik temu resmi.
                </span>
              </div>

              {/* Vehicle Specifications Strip */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-800">Plat {booking.licensePlate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>
                    {booking.serviceType === "LEPAS_KUNCI" ? "Lepas Kunci" : "Dengan Supir"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Escrow Aman</span>
                </div>
              </div>

              {/* Renter Contact & Partner Hotline */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">Nama Penyewa:</span>
                  <strong className="text-slate-900">{booking.userName}</strong> ({booking.userPhone})
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${booking.rentalPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-200"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hubungi Staf Rental</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right 4-Col: Handover QR Code */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                QR Serah Terima Unit
              </span>

              {/* Simulated QR Handover */}
              <div className="bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md inline-block mx-auto">
                <QrCode className="w-28 h-28 text-slate-950" />
              </div>

              <div className="text-[10px] font-mono font-bold text-slate-600">
                {booking.qrHandoverCode}
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                Discan oleh Staf Lapangan untuk memulai Checklist Digital 8-Titik (BR-015).
              </p>
            </div>
          </div>

          {/* Ticket Instructions Footer */}
          <div className="bg-slate-50 p-6 border-t border-slate-100 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Instruksi Saat Pengambilan Kendaraan di Lokasi:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
              <li>Tunjukkan e-KTP dan SIM A asli kepada staf untuk verifikasi fisik kilat.</li>
              <li>Periksa bodi kendaraan bersama staf melalui Checklist Digital 8-Titik pada web DriveO sebelum kunci diserahkan.</li>
              <li>Deposit jaminan kerusakan ditahan aman di Escrow dan dikembalikan otomatis saat sewa selesai.</li>
            </ul>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center print:hidden">
          <Link
            href="/"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
