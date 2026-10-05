"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useMitra } from "@/lib/store/mitra-store";
import { BusinessEntityType } from "@/types/domain";
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Info,
  Sparkles,
  FileCheck2,
} from "lucide-react";

export default function MitraRegisterProfilePage() {
  const router = useRouter();
  const { profile, updateProfile } = useMitra();

  const [entityType, setEntityType] = useState<BusinessEntityType>(profile.entityType || "CV");
  const [businessName, setBusinessName] = useState(profile.businessName || "Tugu Rent Jogja");
  const [legalEntityName, setLegalEntityName] = useState(profile.legalEntityName || "CV Tugu Transportasi Nusantara");
  const [establishedYear, setEstablishedYear] = useState(profile.establishedYear || 2018);
  const [slogan, setSlogan] = useState(profile.slogan || "Sewa Mobil Terpercaya di Jantung Kota Yogyakarta");
  const [city, setCity] = useState(profile.city || "Kota Yogyakarta");
  const [district, setDistrict] = useState(profile.district || "Jetis");
  const [address, setAddress] = useState(profile.address || "Jl. Margo Utomo No. 42, Gowongan, Jetis, Kota Yogyakarta, DIY 55232");
  const [operatingHours, setOperatingHours] = useState(profile.operatingHours || "06:00 - 23:00 WIB (24 Jam Emergency)");
  const [emergencyPhone24h, setEmergencyPhone24h] = useState(profile.emergencyPhone24h || "081223344550");
  const [whatsappCommercial, setWhatsappCommercial] = useState(profile.whatsappCommercial || "081234567890");
  const [picName, setPicName] = useState(profile.picName || "Agus Pramono");
  const [picNik, setPicNik] = useState(profile.picNik || "3471012804820003");
  const [picPhone, setPicPhone] = useState(profile.picPhone || "081223344550");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    updateProfile({
      entityType,
      businessName,
      legalEntityName,
      establishedYear,
      slogan,
      city,
      district,
      address,
      operatingHours,
      emergencyPhone24h,
      whatsappCommercial,
      picName,
      picNik,
      picPhone,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/mitra/verifikasi");
    }, 800);
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
          <Link href="/jadi-mitra" className="hover:text-blue-600 transition-colors">
            Mitra Rental
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Pendaftaran Profil Usaha</span>
        </div>

        {/* Stepper Wizard Onboarding */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Tahapan Onboarding Mitra Rental (FR-RENTAL-001..005)
          </span>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-300 text-blue-900 font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0">
                1
              </span>
              <span className="truncate">Profil Usaha</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs shrink-0">
                2
              </span>
              <span className="truncate">Legalitas NIB</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs shrink-0">
                3
              </span>
              <span className="truncate">Perjanjian</span>
            </div>
          </div>
        </div>

        {/* Header Title Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                Langkah 1 dari 3: Registrasi Profil
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Pendaftaran Profil Usaha Rental Mobil
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Lengkapi identitas bisnis rental Anda untuk mulai memasarkan armada Plat AB kepada ribuan wisatawan dan pebisnis di Yogyakarta.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-start gap-3 text-xs text-slate-600 bg-blue-50/60 p-4 rounded-2xl border border-blue-100/80">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Kemitraan Resmi DriveO:</strong> Seluruh mitra rental wajib memiliki garasi fisik berizin di Daerah Istimewa Yogyakarta serta komitmen mematuhi SOP serah terima digital anti-penggelapan.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bagian 1: Badan Usaha & Nama Komersial */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              1. Bentuk Usaha & Identitas Komersial
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Bentuk Entitas Bisnis:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["PT", "CV", "PERORANGAN", "KOPERASI"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEntityType(t)}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      entityType === t
                        ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {t === "PERORANGAN" ? "Perseorangan" : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Komersial Rental (Merk yang Dikenal):
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Contoh: Tugu Rent Jogja"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Legal Badan Usaha (Akta / NIB):
                </label>
                <input
                  type="text"
                  required
                  value={legalEntityName}
                  onChange={(e) => setLegalEntityName(e.target.value)}
                  placeholder="Contoh: CV Tugu Transportasi Nusantara"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tahun Mulai Beroperasi:
                </label>
                <input
                  type="number"
                  required
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(Number(e.target.value))}
                  placeholder="Contoh: 2018"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none tabular-nums font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Slogan / Tagline Usaha:
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Contoh: Sewa Mobil Terpercaya di DIY"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bagian 2: Alamat Garasi & Operasional di DIY */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              2. Alamat Garasi & Operasional di Yogyakarta
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kabupaten / Kota di DIY:
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
                >
                  <option value="Kota Yogyakarta">Kota Yogyakarta</option>
                  <option value="Kabupaten Sleman">Kabupaten Sleman</option>
                  <option value="Kabupaten Bantul">Kabupaten Bantul</option>
                  <option value="Kabupaten Kulon Progo">Kabupaten Kulon Progo</option>
                  <option value="Kabupaten Gunungkidul">Kabupaten Gunungkidul</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kecamatan:
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Contoh: Jetis / Depok / Mlati"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Alamat Lengkap Garasi / Kantor Operasional:
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Margo Utomo No. 42, Gowongan, Jetis, Kota Yogyakarta, DIY 55232"
                className="w-full text-xs sm:text-sm p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jam Operasional Garasi:
                </label>
                <input
                  type="text"
                  required
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="06:00 - 23:00 WIB"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kontak Darurat 24 Jam:
                </label>
                <input
                  type="text"
                  required
                  value={emergencyPhone24h}
                  onChange={(e) => setEmergencyPhone24h(e.target.value)}
                  placeholder="081223344550"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  WhatsApp Pelayanan Pemesanan:
                </label>
                <input
                  type="text"
                  required
                  value={whatsappCommercial}
                  onChange={(e) => setWhatsappCommercial(e.target.value)}
                  placeholder="081234567890"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bagian 3: Penanggung Jawab Usaha (PIC) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              3. Profil Penanggung Jawab Operasional (PIC)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap Sesuai KTP:
                </label>
                <input
                  type="text"
                  required
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  placeholder="Agus Pramono"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor Induk Kependudukan (16 Digit NIK):
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={picNik}
                  onChange={(e) => setPicNik(e.target.value)}
                  placeholder="3471012804820003"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor Telepon Pribadi PIC:
                </label>
                <input
                  type="text"
                  required
                  value={picPhone}
                  onChange={(e) => setPicPhone(e.target.value)}
                  placeholder="081223344550"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Link
              href="/jadi-mitra"
              className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all text-center cursor-pointer text-sm"
            >
              Kembali
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Menyimpan Profil...</span>
              ) : (
                <>
                  <span>Simpan & Lanjut ke Verifikasi NIB</span>
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
