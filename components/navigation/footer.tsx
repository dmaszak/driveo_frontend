import React from "react";
import Link from "next/link";
import {
  Car,
  ShieldCheck,
  Lock,
  MapPin,
  Mail,
  Phone,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
                <Car className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl text-white tracking-tight block">
                  Drive<span className="text-blue-500">O</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 font-mono tracking-wider uppercase block">
                  Yogyakarta Mobility Ecosystem
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Infrastruktur digital persewaan mobil lepas kunci di Daerah
              Istimewa Yogyakarta bergaransi rekening penampung aman (*escrow*),
              transparansi tarif tanpa biaya siluman, dan standar inspeksi digital.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Garansi Rekening Escrow Terproteksi</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Uang sewa dan deposit ditahan aman hingga serah terima sah. Bebas
                risiko penipuan transfer langsung ke rekening perseorangan.
              </p>
            </div>
          </div>

          {/* Quick Links: Armada & Titik Temu */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Titik Jemput DIY
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/cari?lokasi=spot-yia"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Bandara YIA Kulon Progo</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cari?lokasi=spot-tugu"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Stasiun Tugu Yogyakarta</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cari?lokasi=spot-lempuyangan"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Stasiun Lempuyangan</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cari?lokasi=spot-malioboro"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Area Wisata Malioboro</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cari?lokasi=spot-sleman"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Garasi Sleman (Jl. Magelang)</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Kemitraan & Legalitas */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Mitra & Bantuan
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/mitra/daftar"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Daftar Jadi Mitra Rental</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="hover:text-white transition-colors"
                >
                  Syarat & Ketentuan Sewa
                </Link>
              </li>
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="hover:text-white transition-colors"
                >
                  Kebijakan Privasi (UU PDP)
                </Link>
              </li>
              <li>
                <Link
                  href="/bantuan"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Pusat Bantuan & Pengaduan (CS)</span>
                </Link>
              </li>
            </ul>
          </div>

          

        </div>

        {/* Bottom Bar: Copyright & Consumer Protection */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span>&copy; 2026 DriveO Indonesia. Seluruh hak cipta dilindungi.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>SSL 256-bit Encrypted</span>
            </span>
            <span>•</span>
            <span>Kepatuhan PP No. 80 Tahun 2019 (PMSE)</span>
            <span>•</span>
            <span>UU PDP No. 27 Tahun 2022</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
