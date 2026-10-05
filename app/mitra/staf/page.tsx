"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MitraNav } from "@/components/mitra/mitra-nav";
import { useMitra } from "@/lib/store/mitra-store";
import { useOperationalStaff } from "@/lib/store/operational-store";
import { StaffRole, StaffStatus } from "@/types/domain";
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Power,
  Trash2,
  Copy,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Lock,
} from "lucide-react";

export default function MitraStafPage() {
  const { profile } = useMitra();
  const { staff, inviteStaff, toggleStaffStatus, deleteStaff } = useOperationalStaff();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState<StaffRole>("STAFF_OPERASIONAL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute staff counts
  const stats = useMemo(() => {
    let operational = 0;
    let finance = 0;
    let pending = 0;

    staff.forEach((s) => {
      if (s.status === "MENUNGGU_AKTIVASI") pending++;
      if (s.role === "STAFF_OPERASIONAL") operational++;
      if (s.role === "STAFF_KEUANGAN") finance++;
    });

    return {
      total: staff.length,
      operational,
      finance,
      pending,
    };
  }, [staff]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim() || !invitePhone.trim()) return;

    inviteStaff({
      name: inviteName,
      email: inviteEmail,
      phone: invitePhone,
      role: inviteRole,
      rentalId: profile.id,
      rentalName: profile.businessName,
    });

    setShowInviteModal(false);
    setToastMessage(`Undangan resmi berhasil dibuat untuk ${inviteName} sebagai ${inviteRole}.`);
    setTimeout(() => setToastMessage(null), 4000);

    setInviteName("");
    setInviteEmail("");
    setInvitePhone("");
  };

  const handleCopyInviteLink = (staffEmail: string, role: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteUrl = `${origin}/mitra/staf/terima-undangan?email=${encodeURIComponent(staffEmail)}&role=${role}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setToastMessage("Tautan aktivasi berhasil disalin ke clipboard! Kirimkan ke WhatsApp calon staf.");
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin mencabut hak akses staf ${name}?`)) {
      deleteStaff(id);
      setToastMessage(`Akses untuk ${name} berhasil dihapus.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav
        currentTab="staf"
        actionButton={
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors min-h-[38px] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Undang Staf Baru</span>
          </button>
        }
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>Portal Mitra</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 font-semibold">Manajemen Staf & Akses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Staf Multi-User (FR-RENTAL-004)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Delegasikan wewenang operasional garasi dan administrasi keuangan kepada karyawan rental Anda dengan kontrol hak akses aman.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm min-h-[44px]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Undang Staf Baru</span>
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">Total Tim Terdaftar</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{stats.total}</span>
              <span className="text-xs text-slate-500">Orang</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">Hak akses akun rental</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-blue-700 block">Staff Operasional</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-blue-600 font-mono tabular-nums">{stats.operational}</span>
              <span className="text-xs text-slate-500">Garasi</span>
            </div>
            <span className="text-[11px] text-blue-600 mt-2 block font-medium">Kalender & Serah Terima</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700 block">Staff Keuangan</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600 font-mono tabular-nums">{stats.finance}</span>
              <span className="text-xs text-slate-500">Finance</span>
            </div>
            <span className="text-[11px] text-emerald-600 mt-2 block font-medium">Laporan Omzet & Invoice</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
            <span className="text-xs font-semibold text-amber-800 block">Menunggu Aktivasi</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-700 font-mono tabular-nums">{stats.pending}</span>
              <span className="text-xs text-amber-600">Undangan</span>
            </div>
            <span className="text-[11px] text-amber-700 mt-2 block font-medium">Belum aktivasi sandi</span>
          </div>
        </div>

        {/* Access Role Security Notice Card */}
        <div className="p-4 sm:p-5 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-blue-950">Prinsip Keamanan Akun Multi-User (Role-Based Access Control)</h2>
              <p className="text-xs text-blue-900/80 mt-0.5 max-w-2xl leading-relaxed">
                Staf operasional tidak memiliki akses ke nomor rekening payout bank mitra untuk mencegah penyalahgunaan dana. Hanya akun Pemilik Usaha yang berwenang mengubah rekening bank penerima payout.
              </p>
            </div>
          </div>
        </div>

        {/* Staff List Table / Cards */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Daftar Anggota Tim Garasi & Kantor</h2>
            <span className="text-xs text-slate-500 font-mono">Total {staff.length} Karyawan</span>
          </div>

          <div className="divide-y divide-slate-100">
            {staff.map((stf) => {
              const isPending = stf.status === "MENUNGGU_AKTIVASI";
              const isOps = stf.role === "STAFF_OPERASIONAL";

              return (
                <div
                  key={stf.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      {stf.avatarUrl ? (
                        <Image
                          src={stf.avatarUrl}
                          alt={stf.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {stf.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{stf.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOps
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {isOps ? "Staff Operasional" : "Staff Keuangan"}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            stf.status === "AKTIF"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : stf.status === "MENUNGGU_AKTIVASI"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {stf.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{stf.email}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{stf.phone}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleCopyInviteLink(stf.email, stf.role)}
                        className="px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer min-h-[38px]"
                        title="Salin tautan aktivasi untuk dikirim ke WA staf"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Tautan Aktivasi</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleStaffStatus(stf.id)}
                      className={`p-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer min-h-[38px] flex items-center gap-1 ${
                        stf.status === "AKTIF"
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                      title={stf.status === "AKTIF" ? "Nonaktifkan akun staf" : "Aktifkan kembali akun staf"}
                    >
                      <Power className="w-4 h-4" />
                      <span className="hidden md:inline">{stf.status === "AKTIF" ? "Nonaktifkan" : "Aktifkan"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(stf.id, stf.name)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer min-h-[38px]"
                      title="Cabut akses staf"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL: Undang Staf Baru */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Undang Anggota Tim Baru</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Karyawan *</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Contoh: Danang Prasetyo"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email Kerja *</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Contoh: danang@tugurentjogja.id"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tugaskan Hak Akses Peran *</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: "STAFF_OPERASIONAL",
                        label: "Staff Operasional (Garasi)",
                        desc: "Akses kalender armada, status mobil, dan berita acara serah terima.",
                      },
                      {
                        id: "STAFF_KEUANGAN",
                        label: "Staff Keuangan (Finance)",
                        desc: "Akses laporan transaksi, mutasi escrow, dan rekap invoice sewa.",
                      },
                    ].map((role) => (
                      <label
                        key={role.id}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition-all ${
                          inviteRole === role.id
                            ? "bg-blue-50/70 border-blue-500 text-blue-900 ring-1 ring-blue-500"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={inviteRole === role.id}
                          onChange={() => setInviteRole(role.id as StaffRole)}
                          className="mt-0.5 text-blue-600"
                        />
                        <div>
                          <span className="font-bold block">{role.label}</span>
                          <span className="text-[11px] text-slate-500">{role.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer min-h-[40px]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer min-h-[40px] flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Terbitkan Undangan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
