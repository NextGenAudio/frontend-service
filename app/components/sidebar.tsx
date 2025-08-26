"use client";

import {
  Home,
  Search,
  Bell,
  Play,
  Heart,
  BarChart3,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@radix-ui/themes";
import SidebarButton from "./ui/sidebar-button";
import * as Avatar from "@radix-ui/react-avatar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export const SideBar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const { status, data: session } = useSession();
  if (status === "loading") {
    return null;
  }

  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search" },
    { icon: Bell, label: "Notifications" },
    { icon: Play, label: "Player" },
    { icon: Heart, label: "Favorites" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Settings, label: "Settings" },
  ];
  const handleItemClick = (label: string) => {
    console.log(`[v0] Clicked on ${label}`);
    setActiveItem(label);
  };

  const handleProfileClick = () => {
    console.log("[v0] Profile button clicked");
  };

  return (
    <div className="absolute top-0 left-0 h-screen rounded-[32px] w-32 items-center flex flex-col justify-between py-6 pr-5">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
        <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-orange-300" />
        </div>
      </div>

      {/* Glass buttons */}
      <div className="flex flex-col space-y-3 mt-8">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;
          return (
            <button
              key={index}
              onClick={() => handleItemClick(item.label)}
              className={`
                  group relative w-14 h-14 rounded-2xl 
                  backdrop-blur-md border border-white/20
                  transition-all duration-300 ease-out
                  hover:scale-110 hover:bg-white/25 hover:border-white/30
                  active:scale-95 active:bg-white/35 active:border-white/40
                  hover:shadow-lg hover:shadow-orange-500/25
                  active:shadow-xl active:shadow-orange-500/40
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent
                  cursor-pointer
                  ${
                    isActive
                      ? "bg-white/50 shadow-lg shadow-orange-500/30 border-white/30 scale-105"
                      : "bg-white/10 hover:bg-white/20"
                  }
                `}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-orange-400/15 to-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150" />

              {isActive && (
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-orange-400/30 to-red-500/30 animate-pulse" />
              )}

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
  [transition-delay:0ms] group-hover:[transition-delay:2000ms]"
              >
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90" />
              </div>

              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            </button>
          );
        })}
      </div>

      <div className="mt-auto mb-4">
        <button
          onClick={handleProfileClick}
          className="group w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/20 overflow-hidden hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-white/30 hover:border-white/30 hover:shadow-lg hover:shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer"
        >
          <div className="w-full h-full  from-orange-300 to-red-400 flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-300 transition-all duration-300">
            {status === "authenticated" ? (
              <Image
                className="w-5 h-5 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300"
                src={`${session.user!.image}`}
                alt="Profile"
                fill
              />
            ) : null}
          </div>
        </button>
      </div>
    </div>
  );
};
