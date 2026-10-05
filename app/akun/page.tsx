"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { AccountNav } from "@/components/account/account-nav";
import { useAuth } from "@/lib/store/auth-store";
import { formatIndonesianDate } from "@/lib/utils";
import {
  User as UserIcon,
  ShieldCheck,
  AlertCircle,
  Clock,
  Save,
  CheckCircle2,
  Lock,
  ChevronRight,
  Star,
  Car,
  CreditCard,
  MapPin,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

export default function AccountProfilePage() {
  const { user, updateProfile, login, allUsers } = useAuth();

  // If no user is logged in (e.g. fresh state), default to Budi Santoso for smooth demo experience
  useEffect(() => {
    if (!user) {
      const defaultUser = allUsers.find((u) => u.id === "usr-penyewa-01");
      if (defaultUser) login(defaultUser);
    }
  }, [user, allUsers, login]);

  const [name, setName] = useState(user?.name || "Budi Santoso");
  const [phone, setPhone] = useState(user?.phone || "081234567890");
  const [city, setCity] = useState(user?.city || "Jakarta Selatan");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      if (user.city) setCity(user.city);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      city,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
          <span className="text-slate-900 font-semibold">Profil & Akun Penyewa</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <AccountNav />

          {/* Main Profile Form Area */}
          <div className="flex-1 w-full space-y-6">
            {/* Verification Status Notice if Not Verified */}
            {user?.verificationStatus !== "VERIFIED" && (
              <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-950 text-sm">
                      {user?.verificationStatus === "MENUNGGU"
                        ? "Verifikasi e-KYC Sedang Ditinjau Tim DriveO"
                        : "Identitas e-KYC Belum Terverifikasi"}
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5 max-w-xl">
                      {user?.verificationStatus === "MENUNGGU"
                        ? "Dokumen KTP & SIM A Anda sedang divalidasi. Perkiraan waktu selesai ≤ 30 menit."
                        : "Unggah e-KTP dan SIM A aktif untuk langsung menikmati layanan sewa lepas kunci tanpa perlu meninggalkan KTP fisik asli."}
                    </p>
                  </div>
                </div>

                <Link
                  href="/akun/verifikasi"
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 shadow-sm"
                >
                  {user?.verificationStatus === "MENUNGGU"
                    ? "Lihat Status e-KYC"
                    : "Mulai Verifikasi"}
                </Link>
              </div>
            )}

            {/* Profile Statistics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Total Sewa Selesai
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums flex items-baseline gap-1">
                  <span>{user?.totalRentals || 6}</span>
                  <span className="text-xs text-slate-500 font-normal">Kali</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Skor Reputasi
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>{user?.rating || 4.95}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Deposit Aktif
                </span>
                <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                  Rp 0
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Semua deposit cair</span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Member Sejak
                </span>
                <div className="text-sm font-bold text-slate-900 mt-2 truncate">
                  {user?.createdAt ? formatIndonesianDate(user.createdAt) : "Januari 2026"}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Yogyakarta Hub</span>
              </div>
            </div>

            {/* Profile Edit Form */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-950">Informasi Pribadi Penyewa</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data digunakan untuk pencocokan serah terima armada dan koordinasi penjemputan.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Perubahan Berhasil Disimpan!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Nama Lengkap (Sesuai KTP)
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Nomor WhatsApp / HP
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                      <span>Alamat Email</span>
                      <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Terkunci (Keamanan Akun)
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        disabled
                        value={user?.email || "budi.santoso@gmail.com"}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-500 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Kota Asal / Domisili
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Contoh: Jakarta Selatan, Surabaya"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
