import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "lucide-react";
import { ProfileDropdown } from "./profile-dropdown";
import { useSidebar } from "./../utils/sidebar-context";

const profileAvatar = ({w,h}:{w:number,h:number}) => {
      const { status, data: session } = useSession();
      const { profile, setProfile } = useSidebar();  
  if (status === "loading") {
    return null; // or a loading spinner
  }
  return (
    <div>
      <div className="w-full h-full   flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-300 transition-all duration-300">
        <div className="mt-auto ">
          <button
            onClick={() => setProfile(!profile)}
            className={`group w-${w} h-${h} rounded-full bg-white/20 backdrop-blur-md border border-white/20 overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-white/30 hover:border-white/30 hover:shadow-lg  focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer`}
          >
            <div className="w-full h-full bg-gradient-to-t  from-orange-600 to-red-600 flex items-center justify-center group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300">
              {session?.user?.image && (
                <Image
                  className="full text-white/80 group-hover:text-white group-hover:scale-105 transition-all duration-300"
                  src={`${session.user!.image}`}
                  alt="Profile"
                  fill
                />
              )}
              {!session?.user?.image && (
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
