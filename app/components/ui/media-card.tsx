"use client";

import Image from "next/image";
import { Button } from "./button";

interface MediaCardProps {
  name: string;
  image?: string;
  count?: number;
  onClick?: () => void;
  type?: "folder" | "playlist";
}

function MediaCard({ name, image, count, onClick, type }: MediaCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 cursor-pointer  shadow-lg"
    >
      <Image
        src={image || "/assets/file-icon.webp"}
        alt={name || "Media"}
        className="w-12 h-12 rounded-xl object-cover shadow-md"
        width={48}
        height={48}
      />
      <div className="flex-1 min-w-0 hidden sm:block">
        <div className="font-medium truncate text-white">{name}</div>
        {count !== undefined && (
          <div className="text-sm text-white/70">{count} songs</div>
        )}
      </div>
      <div className="text-sm text-white/70 capitalize">{type}</div>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
        // onClick={(e) => {
        //   e.stopPropagation();
        //   setOpenDropdownSongId(
        //     openDropdownSongId === song.id ? null : song.id
        //   );
        // }}
      ></Button>
    </div>
  );
}
export default MediaCard;
