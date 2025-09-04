"use client";

import {
  Home,
  Search,
  Bell,
  Play,
  Heart,
  BarChart3,
  Settings,
  LucideIcon,
} from "lucide-react";

import SidebarButton from "./sidebar-button";
import * as Avatar from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ProfileAvatar from "./profile-avatar";


export interface MenuItem {
  icon: LucideIcon
  label: string;
}

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const { status, data: session } = useSession();
  if (status === "loading") {
    return null;
  }


  const menuItems: MenuItem[] = [
    { icon: Home, label: "Home" },
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
          return (
            <SidebarButton
              key={item.label}
              item={item}
              handleItemClick={handleItemClick}
              isActive={activeItem === item.label}
            />
          );
        })}
      </div>

      <div className="mt-auto mb-4">
        <ProfileAvatar w={14} h={14} />
      </div>
    </div>
  );
};
