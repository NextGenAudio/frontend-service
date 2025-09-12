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



export function ProfileDropdown(
) {
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { status, data: session } = useSession();
      const router = useRouter();
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

  function handleProfileClick() {

    router.push("/player/profile");
  }
  

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <div className="fixed bottom-8 left-28  w-72 bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-orange-600/10">
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
                  {session?.user?.name}
                </h3>
                <p className="text-white/60 text-xs">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.href == "/profile") {
                    handleProfileClick();
                  }
                  // Handle navigation here
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 group"
              >
                <item.icon className="w-4 h-4 text-white/60 group-hover:text-orange-400 transition-colors" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={() => signOut()}
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
