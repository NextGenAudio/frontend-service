"use client";

import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { createPortal } from "react-dom";

export default function AppLoadingScreen() {
  const [progress, setProgress] = useState(0);
  // heights/durations should only be generated on the client after mount
  // to avoid server/client markup differences during hydration.
  const [bars, setBars] = useState<{ height: number; duration: number }[]>(() =>
    Array.from({ length: 5 }, () => ({ height: 20, duration: 0.8 }))
  );

  useEffect(() => {
    // create randomized bar values on mount (client-only)
    setBars(
      Array.from({ length: 5 }, () => ({
        height: 20 + Math.random() * 30,
        duration: 0.8 + Math.random() * 0.4,
      }))
    );

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Main loading content */}
      <div className="relative z-50 flex flex-col items-center space-y-8 p-8">
        {/* Loading spinner */}
        <div className="relative">
          <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-spin">
            <div
              className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"
              style={{ animationDuration: "1s" }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        {/* Sound waves animation */}
        <div className="flex items-end space-x-1 mt-8">
          {bars.map((b, i) => (
            <div
              key={i}
              className="bg-white/60 rounded-full animate-pulse"
              style={{
                width: "4px",
                height: `${Math.round(b.height)}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${b.duration}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
