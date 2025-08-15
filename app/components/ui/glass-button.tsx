"use client";

import { Button } from "@radix-ui/themes";
import type { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface GlassButtonProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ icon: Icon, label, active = false, onClick, className = "" }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        variant="ghost"
        className={`
          group relative w-14 h-14 rounded-2xl p-0 cursor-pointer
          backdrop-blur-md border border-white/20
          transition-all duration-300 ease-out
          hover:scale-110 hover:bg-white/25 hover:border-white/30
          active:scale-95 active:bg-white/35 active:border-white/40
          hover:shadow-lg hover:shadow-orange-500/25
          active:shadow-xl active:shadow-orange-500/40
          focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
          ${
            active
              ? "bg-white/30 shadow-lg shadow-orange-500/30 border-white/30 scale-105"
              : "bg-white/10 hover:bg-white/20"
          }
          ${className}
        `}
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Active gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-orange-400/10 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-150" />

        {/* Active state pulsing ring */}
        {active && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-orange-400/20 to-red-500/20 animate-pulse" />
        )}

        {/* Icon */}
        <Icon
          className={`
            w-6 h-6 relative z-10
            transition-all duration-300 ease-out
            group-hover:scale-110 group-active:scale-95
            ${
              active
                ? "text-white drop-shadow-sm"
                : "text-white/70 group-hover:text-white group-hover:drop-shadow-sm"
            }
          `}
        />

        {/* Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 group-hover:translate-x-1 backdrop-blur-sm border border-white/10">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90" />
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      </Button>
    );
  }
);

GlassButton.displayName = "GlassButton";
