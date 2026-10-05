"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { AccountNav } from "@/components/account/account-nav";
import { useNotifications } from "@/lib/store/notification-store";
import {
  Bell,
  MessageSquare,
  Mail,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  Save,
} from "lucide-react";

export default function NotificationPreferencesPage() {
  const { preferences, updatePreferences } = useNotifications();
  const [formData, setFormData] = useState(preferences);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
          <Link href="/akun" className="hover:text-blue-600 transition-colors">
            Akun Saya
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Preferensi Notifikasi</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <AccountNav />

          {/* Main Form Content */}
          <div className="flex-1 w-full space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Pengaturan Kanal Notifikasi
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Atur saluran komunikasi dan jenis informasi yang Anda terima (FR-NOTIFICATION-001/002/004)
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Kepatuhan UU PDP No. 27/2022</span>
                </div>
              </div>

              <form onSubmit={handleSave} className="pt-6 space-y-8">
                {/* Saluran WhatsApp */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                      WA
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Kanal WhatsApp Resmi (Prioritas Utama)
                      </h2>
                      <span className="text-xs text-slate-500">
                        Pesan otomatis instan ke nomor WhatsApp terdaftar Anda
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Pemberitahuan Transaksi & Escrow
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Bukti pembayaran DP, instruksi QRIS, dan pelepasan deposit jaminan
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">
                        Wajib Aktif
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Pengingat Jadwal Serah Terima & Pengembalian
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Notifikasi H-1 jam penjemputan unit di Stasiun Tugu / Bandara YIA
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.whatsappReminder}
                        onChange={() => handleToggle("whatsappReminder")}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Penawaran Khusus & Diskon Armada Jogja
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Pemberitahuan promo musim liburan dan cashback
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.whatsappPromo}
                        onChange={() => handleToggle("whatsappPromo")}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Saluran Email */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Kanal Surat Elektronik (Email)
                      </h2>
                      <span className="text-xs text-slate-500">
                        Dokumen resmi dan salinan hukum PDF
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Kwitansi Pembayaran & Invoice Resmi
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Tanda terima sah perpajakan PMSE format PDF
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">
                        Wajib Aktif
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Salinan Kontrak Perjanjian Sewa Digital
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Arsip kontrak berkekuatan hukum dengan hash audit trail
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.emailContract}
                        onChange={() => handleToggle("emailContract")}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Buletin Panduan Wisata & Rute DIY
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Rekomendasi rute tersembunyi dan destinasi kuliner Jogja
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.emailNewsletter}
                        onChange={() => handleToggle("emailNewsletter")}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Saluran Web Push */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Notifikasi Web Push Peramban (Browser)
                      </h2>
                      <span className="text-xs text-slate-500">
                        Pemberitahuan pop-up saat Anda menggunakan website
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Pembaruan Status Pesanan Real-Time
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Persetujuan sewa oleh rental dan perubahan alur inspeksi
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.pushWebOrder}
                        onChange={() => handleToggle("pushWebOrder")}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Peringatan Keamanan Akun & e-KYC
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Aktivitas login baru dan status persetujuan dokumen identitas
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.pushWebSecurity}
                        onChange={() => handleToggle("pushWebSecurity")}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 flex items-center justify-between">
                  {savedSuccess ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Preferensi notifikasi berhasil disimpan!
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Perubahan akan langsung aktif secara real-time
                    </span>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan</span>
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
