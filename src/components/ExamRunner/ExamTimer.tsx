"use client";

import React, { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";
import { formatTime, parseDurationToMs } from "@/lib/utils/timerUtils";

interface ExamTimerProps {
  duration: string; // e.g., "2 hours", "4 hours"
  onTimeUp: () => void;
  examKey: string; // Unique key for localStorage
  isFinished?: boolean;
}

const ExamTimer: React.FC<ExamTimerProps> = ({
  duration,
  onTimeUp,
  examKey,
  isFinished = false,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const timerStorageKey = `${examKey}-timer`;

  useEffect(() => {
    if (isFinished) {
      // Clear timer when exam is finished
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(timerStorageKey);
      }
      return;
    }

    // Initialize timer
    const initTimer = () => {
      if (typeof window === "undefined") return;

      const totalDurationMs = parseDurationToMs(duration);
      if (totalDurationMs <= 0) {
        console.warn("Invalid duration:", duration);
        return;
      }

      // Check if there's an existing timer in localStorage
      const saved = localStorage.getItem(timerStorageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const elapsed = Date.now() - parsed.startTime;
          const remaining = parsed.totalDuration - elapsed;

          if (remaining > 0) {
            setTimeRemaining(remaining);
            startTimeRef.current = parsed.startTime;
          } else {
            // Time already expired
            setTimeRemaining(0);
            onTimeUp();
            return;
          }
        } catch (error) {
          console.error("Error parsing saved timer:", error);
          // Start fresh
          setTimeRemaining(totalDurationMs);
          startTimeRef.current = Date.now();
          localStorage.setItem(
            timerStorageKey,
            JSON.stringify({
              startTime: startTimeRef.current,
              totalDuration: totalDurationMs,
            })
          );
        }
      } else {
        // Start new timer
        setTimeRemaining(totalDurationMs);
        startTimeRef.current = Date.now();
        localStorage.setItem(
          timerStorageKey,
          JSON.stringify({
            startTime: startTimeRef.current,
            totalDuration: totalDurationMs,
          })
        );
      }

      setIsInitialized(true);
    };

    initTimer();

    // Update timer every second
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;

      const elapsed = Date.now() - startTimeRef.current;
      const totalDurationMs = parseDurationToMs(duration);
      const remaining = totalDurationMs - elapsed;

      if (remaining <= 0) {
        setTimeRemaining(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        localStorage.removeItem(timerStorageKey);
        onTimeUp();
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, examKey, timerStorageKey, onTimeUp, isFinished]);

  if (!isInitialized || isFinished) {
    return null;
  }

  const isWarning = timeRemaining < 5 * 60 * 1000; // Less than 5 minutes
  const isCritical = timeRemaining < 1 * 60 * 1000; // Less than 1 minute

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-mono font-bold text-lg ${
        isCritical
          ? "bg-red-50 border-red-500 text-red-600"
          : isWarning
          ? "bg-yellow-50 border-yellow-500 text-yellow-600"
          : "bg-primaryColor/10 border-primaryColor text-primaryColor"
      }`}
    >
      <Clock className="w-5 h-5" />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default ExamTimer;

