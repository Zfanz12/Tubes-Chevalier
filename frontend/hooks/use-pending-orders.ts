import { useState, useEffect } from "react";
import { getTransaksi, type ApiTransaksi } from "@/lib/api";
import { useAuthStore } from "@/lib/useAuthStore";

/**
 * Returns the number of orders with status "pending" (Menunggu)
 * for the currently logged-in petani.
 * Refreshes every 60 seconds.
 */
export function usePendingOrderCount(): number {
  const token = useAuthStore((s) => s.token);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchCount = async () => {
      try {
        const data = await getTransaksi(token);
        if (Array.isArray(data)) {
          const pending = data.filter(
            (tx: ApiTransaksi) => tx.status_pesanan === "pending"
          );
          setCount(pending.length);
        }
      } catch {
        // Silently fail — badge just stays at 0
      }
    };

    fetchCount();

    // Refresh every 60 seconds to keep badge fresh
    const interval = setInterval(fetchCount, 60_000);
    return () => clearInterval(interval);
  }, [token]);

  return count;
}
