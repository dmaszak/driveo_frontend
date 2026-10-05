"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MitraNav } from "@/components/mitra/mitra-nav";
import { useMitraVehicles } from "@/lib/store/vehicle-store";
import { useOperationalCalendar } from "@/lib/store/operational-store";
import { CalendarBlock, CalendarBlockSource } from "@/types/domain";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Lock,
  Unlock,
  Car,
  Filter,
  Info,
  CheckCircle2,
  Clock,
  Wrench,
  MessageSquare,
  AlertCircle,
  X,
  Search,
} from "lucide-react";

export default function MitraKalenderPage() {
  const { vehicles } = useMitraVehicles();
  const { blocks, addCalendarBlock, deleteCalendarBlock } = useOperationalCalendar();

  // Selected date anchor (Default October 2026 for simulation)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal State for Manual WhatsApp / Offline Block (BR-029)
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [modalVehicleId, setModalVehicleId] = useState(vehicles[0]?.id || "");
  const [modalStartDate, setModalStartDate] = useState("2026-10-09");
  const [modalEndDate, setModalEndDate] = useState("2026-10-10");
  const [modalSource, setModalSource] = useState<CalendarBlockSource>("OFFLINE_WHATSAPP");
  const [modalCustomerName, setModalCustomerName] = useState("");
  const [modalCustomerPhone, setModalCustomerPhone] = useState("");
  const [modalNotes, setModalNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detail Block Modal
  const [activeBlockDetail, setActiveBlockDetail] = useState<CalendarBlock | null>(null);

  // Month navigation
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === "ALL" || v.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [vehicles, searchQuery, categoryFilter]);

  // Format date helper: YYYY-MM-DD
  const formatCellDate = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  // Find block for a vehicle on a specific date
  const getBlockForVehicleDate = (vehicleId: string, day: number) => {
    const dateStr = formatCellDate(day);
    return blocks.find((b) => {
      return b.vehicleId === vehicleId && dateStr >= b.startDate && dateStr <= b.endDate;
    });
  };

  const handleOpenBlockModal = (vehicleId?: string, day?: number) => {
    if (vehicleId) setModalVehicleId(vehicleId);
    if (day) {
      const dStr = formatCellDate(day);
      setModalStartDate(dStr);
      setModalEndDate(dStr);
    }
    setShowBlockModal(true);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVehicle = vehicles.find((v) => v.id === modalVehicleId);
    if (!targetVehicle) return;

    addCalendarBlock({
      vehicleId: targetVehicle.id,
      vehiclePlate: targetVehicle.licensePlate,
      vehicleName: targetVehicle.name,
      rentalId: targetVehicle.rentalId,
      startDate: modalStartDate,
      endDate: modalEndDate,
      source: modalSource,
      title:
        modalSource === "OFFLINE_WHATSAPP"
          ? `Sewa WhatsApp: ${modalCustomerName || "Pelanggan Offline"}`
          : modalSource === "BENGKEL_MAINTENANCE"
          ? `Perawatan Berkala: ${modalNotes || "Bengkel"}`
          : `Blokir Internal Garasi`,
      customerName: modalCustomerName,
      customerPhone: modalCustomerPhone,
      notes: modalNotes,
    });

    setShowBlockModal(false);
    setToastMessage(`Jadwal armada ${targetVehicle.licensePlate} berhasil dikunci (BR-029).`);
    setTimeout(() => setToastMessage(null), 4000);

    // Reset inputs
    setModalCustomerName("");
    setModalCustomerPhone("");
    setModalNotes("");
  };

  const handleDeleteBlock = (blockId: string) => {
    if (confirm("Buka kembali kunci jadwal ini agar armada tersedia untuk sewa online?")) {
      deleteCalendarBlock(blockId);
      setActiveBlockDetail(null);
      setToastMessage("Kunci jadwal berhasil dihapus. Tanggal kembali terbuka untuk pemesanan.");
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      <MitraNav
        currentTab="kalender"
        actionButton={
          <button
            type="button"
            onClick={() => handleOpenBlockModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors min-h-[38px] cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci Jadwal Offline (BR-029)</span>
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
              <span className="text-blue-600 font-semibold">Kalender Ketersediaan Multi-Kanal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Matrix Kalender Ketersediaan Armada
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Sinkronisasi pesanan online marketplace DriveO dan pemesanan offline WhatsApp (BR-028 & BR-029) untuk mencegah tumpang tindih unit.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenBlockModal()}
            className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm min-h-[44px]"
          >
            <Lock className="w-4 h-4" />
            <span>Kunci Jadwal Offline</span>
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Color Legend Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-slate-700">Keterangan Status:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
              <span className="text-slate-600">Tersedia (Bisa Dipesan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-blue-600" />
              <span className="text-slate-600">Sewa Online DriveO (Escrow)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-800" />
              <span className="text-slate-600 font-semibold">Blokir Manual WhatsApp / Offline (BR-029)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-500" />
              <span className="text-slate-600">Servis Bengkel</span>
            </div>
          </div>

          {/* Month Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer min-h-[36px]"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-slate-900 min-w-32 text-center font-mono">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer min-h-[36px]"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari armada (mis. Zenix, AB 1001)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {["ALL", "MPV", "SUV", "CITY_CAR", "EV"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MATRIX CALENDAR TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                  <th className="p-3 font-bold sticky left-0 bg-slate-100/90 backdrop-blur-md z-10 w-64 shadow-xs">
                    Armada Mobil Plat AB
                  </th>
                  {daysArray.map((day) => {
                    const isToday =
                      currentYear === 2026 && currentMonth === 9 && day === 5;
                    const dateObj = new Date(currentYear, currentMonth, day);
                    const dayName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][dateObj.getDay()];
                    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                    return (
                      <th
                        key={day}
                        className={`p-2 text-center font-mono border-l border-slate-200/60 min-w-10 ${
                          isToday
                            ? "bg-blue-100 text-blue-900 font-bold"
                            : isWeekend
                            ? "bg-slate-100/50 text-slate-700"
                            : ""
                        }`}
                      >
                        <span className="block text-[10px] text-slate-400 font-sans">{dayName}</span>
                        <span className="text-xs font-bold">{day}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Sticky Fleet Name Column */}
                    <td className="p-3 sticky left-0 bg-white/95 backdrop-blur-md z-10 border-r border-slate-200 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-900 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded shrink-0">
                          {vehicle.licensePlate}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block truncate" title={vehicle.name}>
                            {vehicle.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {vehicle.transmission} • {vehicle.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Day Cells */}
                    {daysArray.map((day) => {
                      const block = getBlockForVehicleDate(vehicle.id, day);

                      if (!block) {
                        return (
                          <td
                            key={day}
                            onClick={() => handleOpenBlockModal(vehicle.id, day)}
                            className="p-1 text-center border-l border-slate-100 hover:bg-emerald-50 cursor-pointer transition-colors group relative"
                            title={`Klik untuk kunci jadwal ${vehicle.licensePlate} tgl ${day}`}
                          >
                            <div className="w-full h-8 rounded flex items-center justify-center text-[10px] text-emerald-600/0 group-hover:text-emerald-700 font-bold">
                              +
                            </div>
                          </td>
                        );
                      }

                      // Color based on block source
                      let bgClass = "bg-blue-600 text-white";
                      if (block.source === "OFFLINE_WHATSAPP") {
                        bgClass = "bg-slate-900 text-white";
                      } else if (block.source === "BENGKEL_MAINTENANCE") {
                        bgClass = "bg-amber-500 text-white";
                      }

                      return (
                        <td
                          key={day}
                          onClick={() => setActiveBlockDetail(block)}
                          className="p-1 border-l border-slate-100 cursor-pointer"
                          title={`${block.title} (${block.startDate} s.d ${block.endDate})`}
                        >
                          <div
                            className={`w-full h-8 rounded px-1 flex items-center justify-center font-bold text-[10px] truncate shadow-2xs ${bgClass}`}
                          >
                            {block.source === "DRIVEO_BOOKING" && "Online"}
                            {block.source === "OFFLINE_WHATSAPP" && "WA"}
                            {block.source === "BENGKEL_MAINTENANCE" && "Servis"}
                            {block.source === "INTERNAL_USE" && "Internal"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: Kunci Jadwal WhatsApp / Offline (BR-029) */}
        {showBlockModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-800" />
                  <h2 className="text-base font-bold text-slate-900">Kunci Jadwal Offline (BR-029)</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveBlock} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Armada Mobil Plat AB *</label>
                  <select
                    value={modalVehicleId}
                    onChange={(e) => setModalVehicleId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    required
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.licensePlate} — {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Pemblokiran *</label>
                  <select
                    value={modalSource}
                    onChange={(e) => setModalSource(e.target.value as CalendarBlockSource)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="OFFLINE_WHATSAPP">Pesanan Offline / WhatsApp / Walk-in</option>
                    <option value="BENGKEL_MAINTENANCE">Jadwal Servis / Bengkel Berkala</option>
                    <option value="INTERNAL_USE">Kebutuhan Operasional Internal Rental</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Mulai *</label>
                    <input
                      type="date"
                      value={modalStartDate}
                      onChange={(e) => setModalStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Selesai *</label>
                    <input
                      type="date"
                      value={modalEndDate}
                      onChange={(e) => setModalEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                      required
                    />
                  </div>
                </div>

                {modalSource === "OFFLINE_WHATSAPP" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penyewa Offline</label>
                      <input
                        type="text"
                        value={modalCustomerName}
                        onChange={(e) => setModalCustomerName(e.target.value)}
                        placeholder="Contoh: Bu Ratna (Hotel Tentrem)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Pelanggan</label>
                      <input
                        type="text"
                        value={modalCustomerPhone}
                        onChange={(e) => setModalCustomerPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan</label>
                  <textarea
                    rows={2}
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="Contoh: Titik temu di Bandara YIA / hotel, DP Rp 200rb via transfer manual..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowBlockModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer min-h-[38px]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs cursor-pointer min-h-[38px] flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Kunci Tanggal Ini</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Detail Blokir Jadwal */}
        {activeBlockDetail && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-blue-600 font-mono">
                  {activeBlockDetail.vehiclePlate}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveBlockDetail(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeBlockDetail.title}</h3>
                <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                  {activeBlockDetail.startDate} s.d {activeBlockDetail.endDate}
                </span>
                {activeBlockDetail.customerPhone && (
                  <p className="text-xs text-slate-700 mt-2">
                    Kontak: <strong className="font-mono">{activeBlockDetail.customerPhone}</strong>
                  </p>
                )}
                {activeBlockDetail.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border mt-2">
                    {activeBlockDetail.notes}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                {activeBlockDetail.source !== "DRIVEO_BOOKING" ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(activeBlockDetail.id)}
                    className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Buka Kunci Jadwal</span>
                  </button>
                ) : (
                  <Link
                    href={`/mitra/booking/${activeBlockDetail.bookingId}`}
                    className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                  >
                    Buka Rincian Booking
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setActiveBlockDetail(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
