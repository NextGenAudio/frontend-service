"use client";
import { LucideIcon } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { useState } from "react";
import { deflate } from "zlib";
import { useTheme } from "../utils/theme-context";

interface SidebarButtonProps {
  Icon: LucideIcon;
  isActive: boolean;
  label: string;
  handleItemClick: (label: string) => void;
}

const SidebarButton = ({
  Icon,
  label,
  handleItemClick,
  isActive,
}: SidebarButtonProps) => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <button
        onClick={() => handleItemClick(label)}
        className={`
                  group relative w-14 h-14 rounded-2xl 
                  backdrop-blur-md border border-white/20
                  transition-all duration-300 ease-out
                  hover:scale-110 hover:bg-white/25 hover:border-white/30
                  active:scale-95 active:bg-white/35 active:border-white/40
                  hover:shadow-lg hover:shadow-white/25
                  active:shadow-xl active:${theme.primary}/40
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
                  cursor-pointer
                  ${
                    isActive
                      ? `bg-white/50 shadow-lg shadow-${theme.primary}/30 border-white/30 scale-105`
                      : "bg-white/10 hover:bg-white/20"
                  }
                `}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-orange-400/15 to-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150" />

        {/* {isActive && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-orange-400/30 to-red-500/30 animate-pulse" />
        )} */}

        <Icon
          className={`
                    w-6 h-6 relative z-10 mx-auto
                    transition-all duration-300 ease-out
                    group-hover:scale-110 group-active:scale-95
                    ${
                      isActive
                        ? "text-white drop-shadow-sm"
                        : "text-white/70 group-hover:text-white group-hover:drop-shadow-sm"
                    }
                  `}
        />

        <div
          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap z-50 group-hover:translate-x-1 backdrop-blur-sm border border-white/10 shadow-lg
  [transition-delay:0ms] group-hover:[transition-delay:1000ms]"
        >
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90" />
        </div>

        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      </button>
    </div>
  );
};

export default SidebarButton;