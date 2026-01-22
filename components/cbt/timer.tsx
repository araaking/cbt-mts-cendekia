"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface TimerProps {
  durationMinutes: number; // Total duration in minutes
  startTime: Date; // When the test started
  onTimeUp: () => void;
}

export function Timer({ durationMinutes, startTime, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const endTime = new Date(startTime).getTime() + durationMinutes * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        onTimeUp();
      } else {
        setTimeLeft(distance);
        // Warn if less than 5 minutes
        if (distance < 5 * 60 * 1000) {
          setIsWarning(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMinutes, onTimeUp]);

  // Format time
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg border shadow-sm transition-colors",
        isWarning
          ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
          : "bg-white text-slate-700 border-slate-200"
      )}
    >
      <Clock className="w-5 h-5" />
      <span>
        {hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""}
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
