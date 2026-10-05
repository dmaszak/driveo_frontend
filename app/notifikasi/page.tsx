"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { useNotifications } from "@/lib/store/notification-store";
import { formatIndonesianDate } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  DollarSign,
  Car,
  Scale,
  ChevronRight,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredNotifs = useMemo(() => {
    if (selectedCategory === "ALL") return notifications;
    if (selectedCategory === "UNREAD") return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.category === selectedCategory);
  }, [notifications, selectedCategory]);

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "TRANSAKSI":
        return {
          icon: DollarSign,
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          label: "Transaksi & Escrow",
        };
      case "OPERASIONAL":
        return {
          icon: Car,
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Operasional Sewa",
        };
      case "KEAMANAN":
        return {
          icon: ShieldCheck,
          bg: "bg-purple-100",
          text: "text-purple-700",
          label: "Keamanan Akun",
        };
      case "SENGKETA":
        return {
          icon: Scale,
          bg: "bg-amber-100",
          text: "text-amber-800",
          label: "Mediasi Sengketa",
        };
      default:
        return {
          icon: Bell,
          bg: "bg-slate-100",
          text: "text-slate-700",
          label: "Umum",
        };
    }
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
          <span className="text-slate-900 font-semibold">Pusat Pesan Notifikasi</span>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Kotak Masuk Notifikasi
                  </h1>
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold font-mono">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pembaruan instan status pembayaran, operasional serah terima, dan mediasi (FR-NOTIFICATION-003)
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: "Semua" },
              { id: "UNREAD", label: `Belum Dibaca (${unreadCount})` },
              { id: "TRANSAKSI", label: "Transaksi Uang" },
              { id: "OPERASIONAL", label: "Operasional" },
              { id: "SENGKETA", label: "Mediasi Sengketa" },
              { id: "KEAMANAN", label: "Keamanan" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-sm">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Tidak Ada Pesan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Semua notifikasi pada kategori ini telah Anda baca.
              </p>
            </div>
          ) : (
            filteredNotifs.map((notif) => {
              const conf = getCategoryConfig(notif.category);
              const Icon = conf.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer relative ${
                    notif.isRead
                      ? "bg-white border-slate-200/80 hover:border-slate-300"
                      : "bg-blue-50/40 border-blue-200 hover:border-blue-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl ${conf.bg} ${conf.text} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {conf.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatIndonesianDate(notif.timestamp)}
                        </span>
                      </div>

                      <h3
                        className={`text-sm ${
                          notif.isRead ? "font-bold text-slate-800" : "font-extrabold text-slate-950"
                        }`}
                      >
                        {notif.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                        {notif.message}
                      </p>

                      <div className="pt-2 flex items-center justify-between">
                        <Link
                          href={notif.linkUrl}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                          <span>Buka Detail Transaksi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {!notif.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
