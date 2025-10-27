import React from "react";

// Server-safe deterministic loading fallback for the player route.
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="relative z-50 flex flex-col items-center space-y-6 p-8 text-center">
        <div className="w-20 h-20 border-4 border-white/20 rounded-full animate-spin" />
        <div className="text-white">Loading player…</div>
        <div className="flex items-end space-x-1 mt-4">
          <div
            className="bg-white/60 rounded-full"
            style={{ width: 4, height: 24 }}
          />
          <div
            className="bg-white/60 rounded-full"
            style={{ width: 4, height: 32 }}
          />
          <div
            className="bg-white/60 rounded-full"
            style={{ width: 4, height: 20 }}
          />
          <div
            className="bg-white/60 rounded-full"
            style={{ width: 4, height: 28 }}
          />
          <div
            className="bg-white/60 rounded-full"
            style={{ width: 4, height: 22 }}
          />
        </div>
      </div>
    </div>
  );
}
