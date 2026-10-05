/**
 * UTILITY HELPERS - DRIVEO YOGYAKARTA
 * Standar UI/UX Pro Max: Format mata uang IDR tabular, tanggal Indonesia, dan perhitungan waktu.
 */

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIndonesianDate(isoString: string): string {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): {
  label: string;
  isStale: boolean;
} {
  if (!isoString) return { label: "Data terverifikasi", isStale: false };
  try {
    const now = Date.now();
    const past = new Date(isoString).getTime();
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) {
      return {
        label: `Diperbarui ${Math.max(5, diffMins)}m lalu`,
        isStale: false,
      };
    }
    if (diffHours < 6) {
      return {
        label: `Diperbarui ${diffHours}j lalu`,
        isStale: false,
      };
    }
    return {
      label: `Perlu Konfirmasi (${diffHours}j lalu)`,
      isStale: true,
    };
  } catch {
    return { label: "Diperbarui baru saja", isStale: false };
  }
}
