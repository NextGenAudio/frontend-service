"use client";

import { useState, useEffect, use } from "react";
import { Heart, Share2, MoreHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { ScrollArea } from "@radix-ui/themes";
import SongCover from "./song-cover";
import clsx from "clsx";
import { useSidebar } from "../utils/sidebar-context";
import { useMusicContext } from "../utils/music-context";
import axios from "axios";
import { set } from "react-hook-form";
import { useEntityContext } from "../utils/entity-context";
interface Song {
  id: string;
  title: string | undefined;
  filename: string;
  artist: string | undefined;
  album: string | undefined;
  uploadedAt: Date;
  // duration: string;
  source: string;
  metadata: any;
  liked: boolean;
}

interface GlassSongDetailsPanelProps {
  song: Song | null;
}

export const SongDetailsPanel = ({ song }: GlassSongDetailsPanelProps) => {
  const [liked, setliked] = useState(false);
  const { player, setDetailPanel } = useSidebar();
  useEffect(() => {
    console.log(song?.metadata);
    if (song) {
      setliked(song.liked);
    }
  }, [song]);
  const{entityName, entityType}= useEntityContext();
  const handleLikeClick = async () => {
    try {
      const newLikeStatus = !liked; // Calculate the new status first
      const response = await fetch(
        `http://localhost:8080/files/${song!.id}/like?like=${newLikeStatus}`,

        {
          method: "POST",
          credentials: "include",
        }
      );
      console.log(response);
      if (response.status === 200) {
        setliked(newLikeStatus);
        song!.liked = newLikeStatus; // Update local song object
        console.log("Like status updated successfully");
      }
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  return (
    <div className="h-full overflow-y-auto relative overflow-hidden">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-amber-300/15 to-red-400/20" />
      <div className="absolute inset-0 backdrop-blur-xl bg-white/5" /> */}
      <div className="bg-gradient-to-b from-gray-900/80 via-gray-900/80 to-gray-900/90"></div>
      <div className="backdrop-blur-xl bg-white/10"></div>

      <div className="relative h-full flex flex-col">
        <div className="p-4 cursor-pointer group transition-all duration-300 ">
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg  ">
            <h2 className="text-lg font-semibold text-white/90">
             Music Details
             {/* <span className="text-2xl text-white/60 font-normal ml-2">|</span>
             <span className="text-sm text-white/60 font-normal ml-2"></span> */}
            </h2>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-xl bg-white/10 hover:bg-red-500/20 border border-white/20 text-white/70 hover:text-red-400 transition-all duration-300"
              onClick={() => setDetailPanel(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            {/* <ChevronDown
                  className={`h-4 w-4 text-white/70 transition-all duration-300 ${isOpen ? "rotate-180" : ""} group-hover:text-white/90`}
                /> */}
          </div>
        </div>

        <div className="space-y-6 mx-3">
          <div className="overflow-hidden aspect-square bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/20  transition-all duration-500 group">
            <div className="text-center">
              <SongCover song={song} />
            </div>
          </div>

          <div className="text-center space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="text-xl font-bold text-white/90">{song?.title}</h3>
            <p className="text-white/70 font-medium">{song?.artist}</p>
            <p className="text-sm text-white/60">{song?.album}</p>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className={`bg-white/10 rounded-xl backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg ${
                liked
                  ? "text-orange-400 bg-orange-500/20 border-orange-400/30"
                  : "text-white/70 hover:text-white/90"
              }`}
              onClick={handleLikeClick}
            >
              <Heart
                className={`h-5 w-5 transition-all duration-300 ${
                  liked ? "fill-current scale-110" : ""
                }`}
              />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/10 rounded-xl backdrop-blur-md border border-white/20 text-white/70 hover:text-white/90 hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/10 rounded-xl backdrop-blur-md border border-white/20 text-white/70 hover:text-white/90 hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          <div className={"p-4 space-y-4"}>
            <div
              className={clsx(
                "backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg",
                player ? "mb-52" : "mb-8"
              )}
            >
              <h4 className="font-medium text-white/80 mb-4 text-center">
                Metadata
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
                  <span className="text-white/60">Year</span>
                  <span className="text-white/80 font-medium">
                    {song?.metadata?.year || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
                  <span className="text-white/60">Bitrate</span>
                  <span className="text-white/80 font-medium">
                    {(song?.metadata?.bitrate / 1000).toFixed(0)} kbps
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
                  <span className="text-white/60">Sample Rate</span>
                  <span className="text-white/80 font-medium">
                    {(song?.metadata?.sample_rate / 1000).toFixed(0)} kHz
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
                  <span className="text-white/60">File Format</span>
                  <span className="text-white/80 font-medium">
                    {song?.metadata?.format || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
                  <span className="text-white/60">Duration</span>
                  <span className="text-white/80 font-medium">
                    {`${Math.floor(song?.metadata?.track_length / 60)}:${(
                      song?.metadata?.track_length % 60
                    )
                      .toString()
                      .padStart(2, "0")} min` || "Unknown"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
                  <span className="text-white/60">Added</span>
                  <span className="text-white/80 font-medium">
                    {song?.uploadedAt
                      ? new Date(song.uploadedAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
