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
import { useSidebar } from "../utils/sidebar-context";

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [home, setHome] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [settings, setSettings] = useState(false);

  const {
    player,
    searchBar,
    detailPanel,
    setPlayer,
    setSearchBar,
    setDetailPanel,
  } = useSidebar();

  const { status, data: session } = useSession();
  if (status === "loading") {
    return null;
  }

  const handleToggleButton = (label: string) => {
    console.log(`Clicked on ${label}`);

    if (label === "Home") {
      setHome((prev) => !prev);
    }
    if (label == "Player") {
      setPlayer(!player);
    }
    if (label === "Search") {
      setSearchBar(!searchBar);
    }
    if (label === "Notifications") {
      setNotifications(true);
    }
    if (label === "Favorites") {
      setFavorites(true);
    }
    if (label === "Analytics") {
      setAnalytics(true);
    }
    if (label === "Settings") {
      setSettings(true);
    }
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
        <SidebarButton
          // key={item.label}
          label={"Home"}
          Icon={Home}
          handleItemClick={handleToggleButton}
          isActive={home}
        />
        <SidebarButton
          label={"Search"}
          Icon={Search}
          handleItemClick={handleToggleButton}
          isActive={searchBar}
        />
        <SidebarButton
          label={"Notifications"}
          Icon={Bell}
          handleItemClick={handleToggleButton}
          isActive={notifications}
        />
        <SidebarButton
          label={"Player"}
          Icon={Play}
          handleItemClick={handleToggleButton}
          isActive={player}
        />
        <SidebarButton
          label={"Favorites"}
          Icon={Heart}
          handleItemClick={handleToggleButton}
          isActive={favorites}
        />
        <SidebarButton
          label={"Analytics"}
          Icon={BarChart3}
          handleItemClick={handleToggleButton}
          isActive={analytics}
        />
        <SidebarButton
          label={"Settings"}
          Icon={Settings}
          handleItemClick={handleToggleButton}
          isActive={settings}
        />
      </div>

      <div className="mt-auto mb-4">
        <ProfileAvatar w={14} h={14} />
      </div>
    </div>
  );
};
