"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, SAMPLE_USERS } from "@/lib/store/auth-store";
import { User } from "@/types/domain";
import {
  Car,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Users,
  Sparkles,
  Building2,
  ChevronRight,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";

  const [authState, store] = useAuthStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Multi-rental context selection modal
  const [contextModalUser, setContextModalUser] = useState<User | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Silakan masukkan email/nomor WhatsApp dan kata sandi.");
      return;
    }

    if (failedAttempts >= 5) {
      setErrorMessage(
        "Akun terkunci sementara demi keamanan (5 kali percobaan gagal). Silakan tunggu 15 menit atau reset kata sandi."
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Match against mock database
      const foundUser = authState.allUsers.find(
        (u) =>
          u.email.toLowerCase() === identifier.trim().toLowerCase() ||
          u.phone === identifier.trim()
      );

      // Simple password check (demo accepts "password" or matching mock)
      if (foundUser && (password === "password" || password.length >= 6)) {
        // Check if multi-rental staff (FR-AUTH-002 alternative)
        if (
          foundUser.role === "STAFF_OPERASIONAL" &&
          foundUser.secondaryRentalIds &&
          foundUser.secondaryRentalIds.length > 0
        ) {
          setContextModalUser(foundUser);
          return;
        }

        executeLogin(foundUser);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        setErrorMessage(
          nextAttempts >= 3
            ? `Email/Nomor WhatsApp atau kata sandi tidak cocok. (${nextAttempts}/5 percobaan sebelum akun terkunci sementara)`
            : "Email/Nomor WhatsApp atau kata sandi tidak cocok. Silakan periksa kembali."
        );
      }
    }, 400);
  };

  const executeLogin = (
    user: User,
    selectedContext?: { id: string; name: string }
  ) => {
    store.login(user);
    if (selectedContext) {
      store.switchRentalContext(selectedContext.id, selectedContext.name);
    }

    // Determine target redirect
    if (redirectParam && redirectParam.startsWith("/")) {
      router.push(redirectParam);
      return;
    }

    // Role-based routing
    if (["RENTAL", "STAFF_OPERASIONAL", "STAFF_KEUANGAN"].includes(user.role)) {
      router.push("/mitra/dashboard");
    } else if (
      ["ADMIN", "TIM_VERIFIKASI", "CUSTOMER_SUPPORT", "TIM_MEDIASI"].includes(
        user.role
      )
    ) {
      router.push("/admin/dashboard");
    } else {
      router.push("/akun");
    }
  };

  const quickLoginAs = (user: User) => {
    setIdentifier(user.email);
    setPassword("password123");
    executeLogin(user);
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
          <span>Belum punya akun?</span>
          <Link
            href={
              redirectParam
                ? `/daftar?redirect=${encodeURIComponent(redirectParam)}`
                : "/daftar"
            }
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline min-h-[44px] flex items-center"
          >
            Daftar Sekarang
          </Link>
        </div>
      </header>

      {/* Main Split Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Left Hero Cinematic Panel (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white bg-slate-950 overflow-hidden">
            {/* Background Image */}
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
                Ekosistem Rental Mobil Bergaransi Escrow
              </p>
            </div>

            {/* Bottom Benefit Cards */}
            <div className="relative z-10 space-y-3 pt-24">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Jaminan Rekening Escrow</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Uang sewa & deposit jaminan Anda ditahan aman di rekening resmi
                  sampai serah terima unit di Jogja sukses.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>100% Mitra Ber-NIB & STNK Asli</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Bebas dari rental fiktif. Seluruh armada terverifikasi resmi
                  berplat AB Daerah Istimewa Yogyakarta.
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
                  Selamat Datang Kembali
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Masuk ke akun DriveO untuk mengelola booking, armada, atau
                  melanjutkan pesanan mobil di Jogja.
                </p>
              </div>

              {/* Redirect Notice if present */}
              {redirectParam && (
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Masuk sekarang untuk melanjutkan pemesanan unit mobil yang
                    telah Anda pilih.
                  </span>
                </div>
              )}

              {/* Error Alert (SEC-001 Neutral Handling) */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Identifier Input (Email or WhatsApp) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Email atau Nomor WhatsApp</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Contoh: budi@gmail.com / 0812xxxx
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Masukkan email atau 08..."
                      autoComplete="username"
                      required
                      className="w-full text-xs sm:text-sm p-3.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Kata Sandi
                    </label>
                    <Link
                      href="/lupa-password"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline min-h-[36px] flex items-center"
                    >
                      Lupa sandi?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      autoComplete="current-password"
                      required
                      className="w-full text-xs sm:text-sm p-3.5 pl-10 pr-10 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[48px]"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  {isLoading ? (
                    <span>Memverifikasi Akun...</span>
                  ) : (
                    <>
                      <span>Masuk ke Akun</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Demo Personas (Evaluator & Dev Tool) */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <span>Akses Cepat Pengujian Peran (Demo Persona):</span>
                <span className="font-mono text-blue-600">8 Role SRS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => quickLoginAs(SAMPLE_USERS[0])}
                  className="p-2 rounded-xl text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-xs transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-900 truncate">Penyewa</div>
                  <div className="text-[10px] text-slate-500 truncate">Budi (Verified)</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickLoginAs(SAMPLE_USERS[1])}
                  className="p-2 rounded-xl text-left bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-xs transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-900 truncate">Owner Rental</div>
                  <div className="text-[10px] text-slate-500 truncate">Agus (Tugu Rent)</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickLoginAs(SAMPLE_USERS[2])}
                  className="p-2 rounded-xl text-left bg-slate-50 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 text-xs transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-900 truncate">Staf Ops</div>
                  <div className="text-[10px] text-slate-500 truncate">Rizky (Multi-usaha)</div>
                </button>

                <button
                  type="button"
                  onClick={() => quickLoginAs(SAMPLE_USERS[4])}
                  className="p-2 rounded-xl text-left bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-xs transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-900 truncate">Super Admin</div>
                  <div className="text-[10px] text-slate-500 truncate">Admin DriveO</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Multi-Rental Context Selector Modal (FR-AUTH-002 Alt) */}
      {contextModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                Pilih Konteks Kerja Rental
              </h3>
              <p className="text-xs text-slate-500">
                Akun staf Anda ({contextModalUser.name}) terikat ke lebih dari satu
                usaha rental mitra di Yogyakarta. Pilih usaha yang ingin Anda
                kelola hari ini:
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  executeLogin(contextModalUser, {
                    id: "rental-tugu",
                    name: "Tugu Rent Jogja",
                  })
                }
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer min-h-[48px]"
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">
                    Tugu Rent Jogja (Utama)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Gedongtengen, Kota Yogyakarta
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() =>
                  executeLogin(contextModalUser, {
                    id: "rental-sleman",
                    name: "Sleman Auto Perkasa",
                  })
                }
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between cursor-pointer min-h-[48px]"
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">
                    Sleman Auto Perkasa (Sekunder)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Mlati, Sleman, DIY
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="px-4 py-4 text-center text-xs text-slate-400">
        &copy; 2026 DriveO Yogyakarta • Kepatuhan PP 80/2019 & UU PDP 27/2022
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs">
          Memuat Halaman Masuk...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
