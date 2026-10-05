"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { AccountNav } from "@/components/account/account-nav";
import { useAuth } from "@/lib/store/auth-store";
import { formatIndonesianDate } from "@/lib/utils";
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Trash2,
  Info,
  Clock,
  KeyRound,
  FileText,
  X,
  RotateCcw,
} from "lucide-react";

export default function PrivacySettingsPage() {
  const { user, requestDeletion, cancelDeletion } = useAuth();

  // Consent states (FR-USER-003)
  const [operationalConsent, setOperationalConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(user?.marketingConsent || false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [saveConsentSuccess, setSaveConsentSuccess] = useState(false);

  // Deletion modal state (FR-USER-004)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const handleSaveConsent = () => {
    setSaveConsentSuccess(true);
    setTimeout(() => setSaveConsentSuccess(false), 3000);
  };

  const handleConfirmDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordConfirm.trim()) {
      setDeleteError("Harap masukkan kata sandi akun Anda untuk konfirmasi.");
      return;
    }
    requestDeletion();
    setIsDeleteModalOpen(false);
    setPasswordConfirm("");
    setDeleteError("");
  };

  const isDeletionPending = Boolean(user?.deletionRequestedAt);

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
          <Link href="/akun" className="hover:text-blue-600 transition-colors">
            Akun Saya
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Privasi & Perlindungan Data PDP</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <AccountNav />

          {/* Main Privacy Controls */}
          <div className="flex-1 w-full space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span>Kepatuhan UU PDP No. 27 Tahun 2022</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950">
                Pusat Kendali Privasi & Persetujuan Data Pribadi
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Anda memiliki kendali penuh atas bagaimana informasi identitas, dokumen e-KYC, dan data preferensi sewa Anda digunakan di ekosistem DriveO.
              </p>
            </div>

            {/* SECTION 1: CONSENT MANAGEMENT (FR-USER-003) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    Manajemen Persetujuan Pemrosesan Data (Consent)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atur izin pemrosesan data sesuai Pasal 20 UU Perlindungan Data Pribadi.
                  </p>
                </div>

                {saveConsentSuccess && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Preferensi Tersimpan</span>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                {/* Operational (Mandatory for booking) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Verifikasi e-KYC & Kelayakan Sewa Armada
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        Wajib untuk Sewa
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                      Izin kepada DriveO untuk memverifikasi keaslian dokumen e-KTP dan SIM A Anda untuk serah terima armada dan pencegahan penggelapan unit di Yogyakarta.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={operationalConsent}
                    disabled
                    className="w-5 h-5 rounded text-blue-600 accent-blue-600 mt-1 cursor-not-allowed opacity-70"
                  />
                </div>

                {/* Marketing / Recommendations (Optional) */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900">
                      Rekomendasi Armada & Penawaran Eksklusif Yogyakarta
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                      Terima notifikasi pembaruan ketersediaan armada populer (Zenix, Xforce) dan promo sewa akhir pekan di Jogja via WhatsApp atau email.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Telemetry / Anonymous Analytics */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900">
                      Peningkatan Performa & Telemetri Aplikasi
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                      Membantu kami meningkatkan kecepatan muat halaman dan kenyamanan antarmuka web melalui log penggunaan anonim tanpa identitas pribadi.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={analyticsConsent}
                      onChange={(e) => setAnalyticsConsent(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Audit trail indicator */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Log persetujuan terakhir: {formatIndonesianDate(new Date().toISOString())} (Pukul 09:30 WIB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveConsent}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Simpan Preferensi
                </button>
              </div>
            </div>

            {/* SECTION 2: RIGHT TO BE FORGOTTEN (FR-USER-004) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-rose-600 font-extrabold text-sm mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Zona Bahaya: Hak Penghapusan Data Pribadi</span>
                </div>
                <h2 className="text-base font-bold text-slate-950">
                  Permohonan Penghapusan Akun & Data (Right to be Forgotten)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Sesuai Pasal 8 UU PDP No. 27/2022, Anda berhak mengajukan penghapusan data pribadi Anda dari sistem kami.
                </p>
              </div>

              {/* Status if already requested */}
              {isDeletionPending ? (
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm">
                        Permohonan Penghapusan Akun Sedang Berjalan (Grace Period 30 Hari)
                      </h3>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        Anda telah mengajukan permohonan penghapusan akun pada{" "}
                        <strong>{formatIndonesianDate(user?.deletionRequestedAt || "")}</strong>. Akun dan seluruh dokumen identitas Anda dijadwalkan dimusnahkan permanen setelah masa tenggang 30 hari.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between">
                    <span className="text-xs text-amber-700">
                      Berubah pikiran? Anda dapat membatalkan permohonan kapan saja sebelum masa tenggang berakhir.
                    </span>
                    <button
                      type="button"
                      onClick={() => cancelDeletion()}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Batalkan Penghapusan</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-950 block">
                      Konsekuensi Penghapusan Akun Permanen
                    </span>
                    <p className="text-[11px] text-rose-800 leading-relaxed max-w-xl">
                      Foto e-KTP, SIM A, riwayat pemesanan sewa, skor reputasi penyewa, dan seluruh catatan audit akan dimusnahkan secara permanen. Anda tidak dapat memulihkan akun ini setelah masa tenggang berakhir.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ajukan Penghapusan Akun</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL FOR ACCOUNT DELETION */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />

          <div
            className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-950 text-center">
              Konfirmasi Penghapusan Akun & Data
            </h3>
            <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed">
              Tindakan ini akan menjadwalkan pemusnahan seluruh identitas e-KYC dan riwayat sewa Anda di DriveO. Masukkan kata sandi akun Anda untuk melanjutkan:
            </p>

            <form onSubmit={handleConfirmDeletion} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kata Sandi Akun
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password Anda"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                {deleteError && (
                  <span className="text-[11px] text-rose-600 font-semibold block mt-1">
                    {deleteError}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                Sesuai SOP UU PDP, permohonan memiliki masa tenggang 30 hari sebelum data dihapus permanen.
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Konfirmasi Hapus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
