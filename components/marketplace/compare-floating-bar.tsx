"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/lib/store/compare-store";
import { FEATURED_YOGYAKARTA_VEHICLES } from "@/lib/mock-data/yogyakarta";
import { Scale, X, ArrowRight } from "lucide-react";

export function CompareFloatingBar() {
  const { compareIds, count, remove, clear } = useCompare();

  if (count === 0) return null;

  const selectedVehicles = FEATURED_YOGYAKARTA_VEHICLES.filter((v) =>
    compareIds.includes(v.id)
  );

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left info & thumbnails */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Komparasi Armada</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                {count}/3
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Bandingkan tarif, deposit, & spek head-to-head
            </div>
          </div>
        </div>

        {/* Selected vehicle avatars */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {selectedVehicles.map((veh) => (
            <div
              key={veh.id}
              className="relative group shrink-0 w-12 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-800"
              title={veh.name}
            >
              <Image
                src={veh.thumbnailUrl}
                alt={veh.name}
                fill
                className="object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(veh.id);
                }}
                className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                title="Hapus dari komparasi"
                aria-label={`Hapus ${veh.name} dari komparasi`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={() => clear()}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-2 transition-colors cursor-pointer"
          >
            Reset
          </button>
          <Link
            href="/bandingkan"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <span>Bandingkan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
