"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import {
  HelpCircle,
  Search,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Send,
  CheckCircle2,
  FileQuestion,
  FileWarning,
  Building,
  Clock,
  Car,
  CreditCard,
  UserCheck,
  LifeBuoy,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "booking" | "payment" | "kyc" | "emergency";
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "booking",
    question: "Bagaimana cara menyewa mobil lepas kunci di DriveO?",
    answer:
      "Cukup pilih mobil berpelat AB yang Anda inginkan di halaman katalog, tentukan durasi sewa dan titik jemput di DIY (misal: Stasiun Tugu atau Bandara YIA), lalu klik 'Pesan Sekarang'. Jika Anda belum memiliki akun, lengkapi verifikasi e-KYC (KTP & SIM A) secara instan. Setelah pembayaran sewa dan deposit diverifikasi di rekening escrow, unit siap diantar ke lokasi Anda.",
  },
  {
    id: "faq-2",
    category: "booking",
    question: "Apakah mobil sewa bisa dibawa keluar wilayah D.I. Yogyakarta?",
    answer:
      "Ya, seluruh armada mitra resmi DriveO diizinkan untuk digunakan di seluruh wilayah D.I. Yogyakarta dan provinsi Jawa Tengah (Semarang, Solo, Magelang, Borobudur) tanpa biaya tambahan wilayah.",
  },
  {
    id: "faq-3",
    category: "payment",
    question: "Kapan deposit jaminan kerusakan akan dikembalikan ke saya?",
    answer:
      "Deposit jaminan ditahan secara aman di rekening escrow DriveO dan dikembalikan 100% penuh otomatis ke rekening/e-wallet Anda maksimal dalam 1x24 jam kerja setelah masa sewa selesai dan serah terima pengembalian (Digital Handover 8-Titik) disetujui bersama tanpa ada klaim kerusakan.",
  },
  {
    id: "faq-4",
    category: "payment",
    question: "Metode pembayaran apa saja yang didukung?",
    answer:
      "Kami menerima pembayaran otomatis via QRIS (semua e-wallet dan m-banking), Virtual Account (BCA, Mandiri, BNI, BRI, Permata), dan Kartu Kredit/Debit berlogo Visa dan Mastercard.",
  },
  {
    id: "faq-5",
    category: "kyc",
    question: "Apakah saya harus meninggalkan KTP fisik asli sebagai jaminan sewa?",
    answer:
      "Tidak! DriveO menggunakan sistem verifikasi identitas digital (e-KYC) terenkripsi sesuai UU PDP No. 27/2022. Anda tidak perlu meninggalkan fisik KTP asli Anda pada mitra rental, sehingga dokumen penting Anda tetap aman bersama Anda.",
  },
  {
    id: "faq-6",
    category: "kyc",
    question: "Berapa lama proses verifikasi akun dan e-KYC?",
    answer:
      "Tim Verifikasi DriveO memvalidasi dokumen secara otomatis dan manual dengan SLA rata-rata 10 hingga 30 menit pada jam operasional (06:00 - 23:00 WIB).",
  },
  {
    id: "faq-7",
    category: "emergency",
    question: "Apa yang harus saya lakukan jika mobil mogok atau mengalami kendala di jalan?",
    answer:
      "Tetap tenang dan amankan kendaraan ke bahu jalan. Segera buka halaman bantuan ini dan hubungi Layanan Darurat 24 Jam DriveO melalui tombol WhatsApp Darurat atau Hotline Telepon. Tim Bantuan Lapangan dan Layanan Derek Darurat DIY kami akan segera dikirimkan ke lokasi Anda.",
  },
];

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(["faq-1"]);

  // Complaint Form State (PP 80/2019)
  const [complaintName, setComplaintName] = useState("");
  const [complaintEmail, setComplaintEmail] = useState("");
  const [complaintBookingId, setComplaintBookingId] = useState("");
  const [complaintCategory, setComplaintCategory] = useState("Kondisi Kendaraan");
  const [complaintMessage, setComplaintMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    if (openFaqIds.includes(id)) {
      setOpenFaqIds(openFaqIds.filter((item) => item !== id));
    } else {
      setOpenFaqIds([...openFaqIds, id]);
    }
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintName || !complaintEmail || !complaintMessage) return;

    // Generate mock ticket ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `ADUAN-202610-${randomNum}`;
    setTicketSubmitted(ticketId);
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
          <span className="text-slate-900 font-semibold">Pusat Bantuan & Layanan Konsumen</span>
        </div>

        {/* HERO SEARCH BANNER */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl border border-slate-800 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 inline-flex items-center gap-1.5 mb-4">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Dukungan Pelanggan & Aduan Resmi PP 80/2019</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Ada yang Bisa Kami Bantu Hari Ini?
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-xl mx-auto">
              Cari jawaban cepat seputar pemesanan armada, sistem deposit rekening escrow, verifikasi identitas, atau hubungi bantuan darurat di Jogja.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik pertanyaan Anda (misal: deposit, e-KYC, lepas kunci, rute luar kota)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 24/7 EMERGENCY ASSISTANCE STRIP (JOGJA LOCAL) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-3xl p-6 text-white shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-200 block">
                Hotline Bantuan Darurat 24 Jam
              </span>
              <div className="text-lg font-black mt-1">0800-1-DRIVEO (374836)</div>
              <p className="text-xs text-red-100 mt-1 leading-snug">
                Bebas pulsa untuk insiden mogok, kendala mesin, atau kecelakaan di seluruh DIY.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200 block">
                WhatsApp Customer Care
              </span>
              <div className="text-lg font-black mt-1">+62 812-3456-7890</div>
              <p className="text-xs text-emerald-100 mt-1 leading-snug">
                Respons cepat CS DriveO untuk pertanyaan pesanan, jadwal sewa, dan konfirmasi.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200 block">
                Layanan Derek & Towing DIY
              </span>
              <div className="text-lg font-black mt-1">Siaga Wilayah D.I. Yogyakarta</div>
              <p className="text-xs text-blue-100 mt-1 leading-snug">
                Melayani area Gunungkidul, Kaliurang, Kulon Progo (YIA), Sleman, dan Kota Jogja.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                <FileQuestion className="w-6 h-6 text-blue-600" />
                <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Panduan praktis dan jawaban resmi seputar aturan sewa di platform DriveO.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: "all", label: "Semua" },
                { id: "booking", label: "Pemesanan & Sewa" },
                { id: "payment", label: "Pembayaran & Escrow" },
                { id: "kyc", label: "e-KYC & Dokumen" },
                { id: "emergency", label: "Bantuan di Jalan" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === c.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqIds.includes(faq.id);

              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* OFFICIAL CONSUMER COMPLAINT FORM (PP NO. 80/2019 COMPLIANT) */}
        <section id="pengaduan-resmi" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-3">
                <FileWarning className="w-3.5 h-3.5 text-amber-700" />
                <span>Saluran Resmi Pengaduan Konsumen (PP No. 80/2019)</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                Formulir Pengaduan Layanan Konsumen
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
                Mengalami kendala armada, perselisihan deposit, atau pelayanan mitra? Sampaikan aduan resmi Anda. Tim Mediasi DriveO menjamin SLA respons dalam waktu ≤ 1×24 jam.
              </p>
            </div>

            {ticketSubmitted ? (
              <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">
                  Pengaduan Anda Berhasil Diterbitkan!
                </h3>
                <div className="inline-block bg-white px-4 py-2 rounded-xl border border-emerald-300 font-mono font-bold text-sm text-emerald-900">
                  Nomor Tiket: {ticketSubmitted}
                </div>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Konfirmasi pengaduan telah dikirimkan ke alamat email <strong>{complaintEmail}</strong>. Tim Mediasi & Layanan Konsumen DriveO akan menindaklanjuti dan menghubungi Anda maksimal dalam waktu 1x24 jam kerja.
                </p>
                <button
                  type="button"
                  onClick={() => setTicketSubmitted(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Kirim Pengaduan Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nama Lengkap Pelapor *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sesuai KTP"
                      value={complaintName}
                      onChange={(e) => setComplaintName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Aktif *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={complaintEmail}
                      onChange={(e) => setComplaintEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Nomor Booking / Kode Sewa (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: DVO-2026-891"
                      value={complaintBookingId}
                      onChange={(e) => setComplaintBookingId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Kategori Pengaduan *
                    </label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Kondisi Kendaraan">Kondisi Fisik / Kebersihan Kendaraan</option>
                      <option value="Pengembalian Deposit">Kendala Pengembalian Deposit Escrow</option>
                      <option value="Pelayanan Mitra">Perilaku / Pelayanan Mitra Rental</option>
                      <option value="Kendala Teknis">Kendala Teknis Sistem Aplikasi</option>
                      <option value="Lainnya">Lain-lain</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kronologi & Uraian Masalah *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Jelaskan secara rinci kronologi kejadian, waktu kejadian, dan armada yang terlibat..."
                    value={complaintMessage}
                    onChange={(e) => setComplaintMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Pengaduan Anda dilindungi oleh kerahasiaan data UU PDP No. 27/2022 dan ditangani langsung oleh Tim Mediasi DriveO.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pengaduan Resmi (SLA ≤ 24 Jam)</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
