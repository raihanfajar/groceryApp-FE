import { useEffect, useState } from "react";

export function useCountdown(expiryAt: string | Date | null) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!expiryAt) return;

    const expiryDate = new Date(expiryAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = expiryDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryAt]);

  return timeLeft;
}
