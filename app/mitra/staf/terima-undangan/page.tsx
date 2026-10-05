"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMitra } from "@/lib/store/mitra-store";
import { useOperationalStaff } from "@/lib/store/operational-store";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserCheck,
  Building2,
  AlertCircle,
  FileText,
} from "lucide-react";

function TerimaUndanganContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "inv-tok-demo-2026";
  const roleParam = searchParams.get("role") || "STAFF_OPERASIONAL";
  const emailParam = searchParams.get("email") || "staf.baru@tugurentjogja.id";

  const { profile } = useMitra();
  const { staff, activateStaff } = useOperationalStaff();

  const [name, setName] = useState("Rizky Firmansyah");
  const [phone, setPhone] = useState("081901234567");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consentPdp, setConsentPdp] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const roleLabel =
    roleParam === "STAFF_KEUANGAN" ? "Staff Keuangan (Finance)" : "Staff Operasional (Fleet & Handover)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !phone.trim()) {
      setErrorMessage("Nama lengkap dan nomor handphone wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Kata sandi harus minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!consentPdp) {
      setErrorMessage("Anda wajib menyetujui komitmen kerahasiaan data privasi pelanggan (UU PDP).");
      return;
    }

    setIsSubmitting(true);

    // Find pending staff matching this email or take first pending
    const pendingStaff = staff.find((s) => s.email === emailParam) || staff[2] || staff[0];
    if (pendingStaff) {
      activateStaff(pendingStaff.id, name, phone);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Akun Staf Berhasil Diaktifkan!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Selamat datang di tim <strong>{profile.businessName}</strong>. Anda kini memiliki hak akses sebagai <strong>{roleLabel}</strong>.
          </p>
          <div className="pt-2">
            <Link
              href="/mitra/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Masuk ke Dashboard Operasional</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-lg w-full mx-auto space-y-6">
        {/* Header Invitation Card */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase font-mono">
            UNDANGAN RESMI MITRA DRIVEO
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Aktivasi Akses Staf Karyawan
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            <strong>{profile.businessName}</strong> telah mengundang Anda untuk bergabung mengelola operasional armada di platform DriveO.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-5">
          {/* Assigned Role Pill */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-blue-700 font-semibold block">Peran yang Ditugaskan:</span>
              <span className="text-sm font-bold text-slate-900">{roleLabel}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {roleParam === "STAFF_KEUANGAN"
                  ? "Hak akses laporan keuangan, invoice, dan data transaksi escrow."
                  : "Hak akses kalender, status armada, dan checklist serah terima fisik."}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email Terdaftar</label>
              <input
                type="email"
                value={emailParam}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Anda *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama sesuai KTP"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Buat Kata Sandi *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ulangi Kata Sandi *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Konfirmasi sandi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Privacy Agreement */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentPdp}
                onChange={(e) => setConsentPdp(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                Saya berkomitmen menjaga kerahasiaan data pribadi wisatawan (KTP, SIM, nomor telepon) dan tidak menyalahgunakannya sesuai ketentuan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (PDP).
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengaktifkan Akun...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Aktifkan Akun & Mulai Bekerja</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function TerimaUndanganPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat tautan undangan...</div>}>
      <TerimaUndanganContent />
    </Suspense>
  );
}
