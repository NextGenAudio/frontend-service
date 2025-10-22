"use client";

import { useState, useRef, useEffect, use } from "react";
import {
  User,
  Settings,
  LogOut,
  Music,
  Heart,
  Download,
  HelpCircle,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Sign } from "crypto";
import { useRouter } from "next/navigation";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import Cookies from "js-cookie";
import { getFullName } from "../player/profile/page";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const themeColors = getGeneralThemeColors(theme.primary);

  useEffect(() => {
    const cookie = Cookies.get("sonex_user");
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        console.log("Parsed cookie data:", parsed);
        setUserData(parsed);
      } catch (err) {
        console.error("Invalid cookie data:", err);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },

    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <div className="fixed bottom-8 left-28  w-72 bg-slate-800/60 backdrop-blur-xl border border-white/10 border-  rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div
            className={`p-4 border-b border-white/10 bg-${theme.primary}/10`}
          >
            <div className="flex items-center gap-3">
              {/* <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-0.5">
                <img
                  src={userAvatar || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-gray-800"
                />
              </div> */}
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {userData
                    ? getFullName(userData.firstName, userData.lastName)
                    : "Guest"}
                </h3>
                <p className="text-white/60 text-xs">
                  {userData ? userData.email : "guest@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  userData.role?.roleName === "artist"
                    ? router.push("/player/profile/artist")
                    : router.push(`/player/profile`);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 group`}
              >
                <item.icon
                  className={`w-4 h-4 text-white/60 transition-colors`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={() => {
                // Remove cookies
                Cookies.remove("sonex_token");
                Cookies.remove("sonex_user");
                // Remove localStorage/sessionStorage tokens if any
                localStorage.clear();
                sessionStorage.clear();
                // Optionally sign out from NextAuth
                signOut({ redirect: false });
                // Redirect to login
                router.push("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 rounded-lg group"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
