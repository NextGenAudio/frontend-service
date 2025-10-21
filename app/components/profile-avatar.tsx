import React from "react";
// import { useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "lucide-react";
import { ProfileDropdown } from "./profile-dropdown";
import { useSidebar } from "./../utils/sidebar-context";
import Cookies from "js-cookie";

const profileAvatar = ({ w, h }: { w: number; h: number }) => {
  const { profile, setProfile } = useSidebar();

  // Get user image from cookie
  let userImage = null;
  const cookie = Cookies.get("sonex_user");
  if (cookie) {
    try {
      const parsed = JSON.parse(cookie);
      userImage =
        parsed.User?.profileImageURL ||
        parsed.User?.image ||
        parsed.profileImageURL ||
        parsed.image ||
        null;
    } catch {
      userImage = null;
    }
  }
  return (
    <div>
      <div className="w-full h-full flex items-center justify-center transition-all duration-300">
        <div className="mt-auto ">
          <button
            onClick={() => setProfile(!profile)}
            className={`group w-${w} h-${h} rounded-full bg-white/20 backdrop-blur-md border border-white/20 overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-white/30 hover:border-white/30 hover:shadow-lg  focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer`}
          >
            <div className="w-full h-full bg-gradient-to-t  from-slate-700 to-slate-800 flex items-center justify-center group-hover:from-slate-600 group-hover:to-slate-600 transition-all duration-300">
              {userImage ? (
                <Image
                  className="full text-white/80 group-hover:text-white group-hover:scale-105 transition-all duration-300"
                  src={userImage}
                  alt="Profile"
                  fill
                />
              ) : (
                <User className="full text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default profileAvatar;
