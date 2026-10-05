"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { User, UserRole } from "@/types/domain";
import {
  Car,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";
  const roleQueryParam = searchParams.get("role") || "";

  const [authState, store] = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<"PENYEWA" | "RENTAL">(
    roleQueryParam.toLowerCase() === "rental" ? "RENTAL" : "PENYEWA"
  );

  // Common Fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Renter specific
  const [renterName, setRenterName] = useState("");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPdp, setConsentPdp] = useState(false);

  // Rental Partner specific
  const [businessName, setBusinessName] = useState("");
  const [picName, setPicName] = useState("");
  const [cityDistrict, setCityDistrict] = useState("Kota Yogyakarta");
  const [garageAddress, setGarageAddress] = useState("");
  const [consentMerchant, setConsentMerchant] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password strength logic
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: "Belum diisi", color: "bg-slate-200" };
    if (password.length < 6)
      return { level: 1, text: "Sangat Lemah", color: "bg-rose-500" };
    if (password.length < 8)
      return { level: 2, text: "Sedang", color: "bg-amber-500" };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password))
      return { level: 3, text: "Kuat", color: "bg-emerald-500" };
    return { level: 2, text: "Cukup", color: "bg-blue-500" };
  };

  const strength = getPasswordStrength();

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validations
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    if (selectedRole === "PENYEWA") {
      if (!renterName.trim()) {
        setErrorMessage("Silakan masukkan nama lengkap sesuai KTP.");
        return;
      }
      if (!consentTerms || !consentPdp) {
        setErrorMessage(
          "Wajib menyetujui Syarat & Ketentuan serta pemrosesan data identitas untuk melanjutkan."
        );
        return;
      }
    } else {
      if (!businessName.trim() || !picName.trim() || !garageAddress.trim()) {
        setErrorMessage("Silakan lengkapi seluruh informasi usaha rental.");
        return;
      }
      if (!consentMerchant) {
        setErrorMessage("Wajib menyetujui Perjanjian Kemitraan Merchant DriveO.");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const newUserId = `usr-${selectedRole.toLowerCase()}-${Date.now().toString().slice(-4)}`;
      const newUser: User = {
        id: newUserId,
        name: selectedRole === "PENYEWA" ? renterName.trim() : picName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: selectedRole,
        rentalId: selectedRole === "RENTAL" ? `rental-${newUserId}` : undefined,
        rentalName: selectedRole === "RENTAL" ? businessName.trim() : undefined,
        isActive: true,
        verificationStatus: selectedRole === "PENYEWA" ? "BELUM_VERIFIKASI" : "MENUNGGU",
        consentAccepted: true,
        consentTimestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      store.register(newUser);

      // Redirect logic
      if (selectedRole === "PENYEWA") {
        if (redirectParam && redirectParam.startsWith("/")) {
          router.push(redirectParam);
        } else {
          router.push("/verifikasi-email");
        }
      } else {
        router.push("/mitra/onboarding");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top Simple Header */}
      <header className="px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span>Sudah punya akun?</span>
          <Link
            href={
              redirectParam
                ? `/masuk?redirect=${encodeURIComponent(redirectParam)}`
                : "/masuk"
            }
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline min-h-[44px] flex items-center"
          >
            Masuk Sekarang
          </Link>
        </div>
      </header>

      {/* Main Split Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-4 w-full flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Left Hero Cinematic Panel (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white bg-slate-950 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="/images/hero-jogja-family.jpg"
                alt="Rental Mobil Jogja Bergaransi Escrow"
                className="w-full h-full object-cover object-center brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40" />
            </div>

            {/* Top Brand Tag */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                  <Car className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="font-heading font-extrabold text-lg text-white">
                  Drive<span className="text-blue-400">O</span>
                </span>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  JOGJA
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Pendaftaran Akun Terverifikasi
              </p>
            </div>

            {/* Bottom Benefit Cards */}
            <div className="relative z-10 space-y-3 pt-24">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Garansi Escrow & Perlindungan Sengketa</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Semua transaksi sewa lepas kunci dilindungi rekening penampung
                  resmi dan dokumentasi inspeksi digital.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Privasi Data Terjaga (UU PDP)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Data KTP & SIM Anda dienkripsi aman dan hanya digunakan untuk
                  kebutuhan verifikasi serah terima armada di Jogja.
                </p>
              </div>
            </div>
          </div>

          {/* Right Form Panel (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Form Heading */}
              <div className="space-y-1.5">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Buat Akun Baru
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Pilih peran pendaftaran Anda untuk mendapatkan akses yang sesuai
                  di ekosistem DriveO Yogyakarta.
                </p>
              </div>

              {/* Role Segment Switcher (FR-AUTH-001 vs FR-RENTAL-001) */}
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("PENYEWA");
                    setErrorMessage("");
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                    selectedRole === "PENYEWA"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Penyewa Mobil</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("RENTAL");
                    setErrorMessage("");
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                    selectedRole === "RENTAL"
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Mitra Usaha Rental</span>
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Conditional Fields based on Role */}
                {selectedRole === "PENYEWA" ? (
                  /* RENTER FIELDS */
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Nama Lengkap (Sesuai KTP)</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Wajib sama untuk verifikasi e-KYC
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={renterName}
                        onChange={(e) => setRenterName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        required
                        className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                      />
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                ) : (
                  /* RENTAL PARTNER FIELDS */
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Nama Usaha Rental (Komersial)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Contoh: Tugu Rent Jogja"
                          required
                          className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all min-h-[48px]"
                        />
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Nama Penanggung Jawab (PJ)
                        </label>
                        <input
                          type="text"
                          value={picName}
                          onChange={(e) => setPicName(e.target.value)}
                          placeholder="Nama sesuai KTP PJ"
                          required
                          className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all min-h-[48px]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Wilayah Garasi di DIY
                        </label>
                        <select
                          value={cityDistrict}
                          onChange={(e) => setCityDistrict(e.target.value)}
                          className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all min-h-[48px]"
                        >
                          <option value="Kota Yogyakarta">Kota Yogyakarta</option>
                          <option value="Sleman">Kabupaten Sleman</option>
                          <option value="Bantul">Kabupaten Bantul</option>
                          <option value="Kulon Progo">Kabupaten Kulon Progo</option>
                          <option value="Gunungkidul">Kabupaten Gunungkidul</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Alamat Lengkap Garasi
                      </label>
                      <input
                        type="text"
                        value={garageAddress}
                        onChange={(e) => setGarageAddress(e.target.value)}
                        placeholder="Contoh: Jl. Sosrowijayan No. 42, Gedongtengen"
                        required
                        className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all min-h-[48px]"
                      />
                    </div>
                  </div>
                )}

                {/* Common Fields: Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Nomor WhatsApp Aktif
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        required
                        className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        required
                        className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        required
                        className="w-full text-xs sm:text-sm p-3.5 pl-10 pr-9 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Konfirmasi Sandi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi kata sandi"
                        required
                        className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Kekuatan Sandi:</span>
                      <span className="font-bold">{strength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.level / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Consent Checkboxes (BR-040 & UU PDP) */}
                <div className="pt-2 space-y-2.5 text-xs text-slate-600">
                  {selectedRole === "PENYEWA" ? (
                    <>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentTerms}
                          onChange={(e) => setConsentTerms(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                        />
                        <span className="leading-tight">
                          Saya menyetujui{" "}
                          <Link
                            href="/syarat-ketentuan"
                            target="_blank"
                            className="text-blue-600 font-semibold underline"
                          >
                            Syarat & Ketentuan Sewa
                          </Link>{" "}
                          serta Kebijakan Penggunaan Platform DriveO.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentPdp}
                          onChange={(e) => setConsentPdp(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                        />
                        <span className="leading-tight">
                          Saya memberikan persetujuan pemrosesan data identitas KTP &
                          SIM untuk kebutuhan verifikasi sewa lepas kunci sesuai{" "}
                          <Link
                            href="/kebijakan-privasi"
                            target="_blank"
                            className="text-blue-600 font-semibold underline"
                          >
                            Kebijakan Privasi UU PDP No. 27/2022
                          </Link>
                          .
                        </span>
                      </label>
                    </>
                  ) : (
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentMerchant}
                        onChange={(e) => setConsentMerchant(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 shrink-0"
                      />
                      <span className="leading-tight">
                        Saya menyetujui Perjanjian Kemitraan Usaha Rental DriveO dan
                        bersedia mengunggah dokumen legalitas (NIB/STNK) pada tahap
                        onboarding berikutnya.
                      </span>
                    </label>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-2xl text-white font-heading font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] ${
                    selectedRole === "PENYEWA"
                      ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-600/25"
                      : "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-amber-600/25"
                  }`}
                >
                  {isLoading ? (
                    <span>Memproses Pendaftaran...</span>
                  ) : (
                    <>
                      <span>
                        {selectedRole === "PENYEWA"
                          ? "Daftar Sebagai Penyewa"
                          : "Daftar Mitra & Lanjut Onboarding"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="px-4 py-4 text-center text-xs text-slate-400">
        &copy; 2026 DriveO Yogyakarta • Perlindungan Konsumen PP 80/2019
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs">
          Memuat Halaman Pendaftaran...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
