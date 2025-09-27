"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Music,
  MoreHorizontal,
  FolderPlus,
  ListMusic,
  Upload,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import { useSidebar } from "../utils/sidebar-context";
import { useMusicContext } from "../utils/music-context";
import MediaCard from "./ui/media-card";
import { set } from "react-hook-form";
import { useFileHandling } from "../utils/entity-handling-context";
import { useRouter } from "next/navigation";
import { useEntityContext } from "../utils/entity-context";
import { ScrollArea } from "./ui/scroll-area";
import clsx from "clsx";

type Folder = {
  id: number;
  name: string;
  description?: string;
  folderArt?: string; // comes from DB
  musicCount?: number;
};

interface Song {
  id: string;
  title: string | undefined;
  filename: string;
  artist: string | undefined;
  album: string | undefined;
  path: string;
  uploadedAt: Date;
  // duration: string;
  source: string;
  metadata: any;
  // liked: boolean;
}

interface Playlist {
  playlistId: number;
  name: string;
  description?: string;
  coverImage?: string;
  image?: string; // for compatibility with existing code
  songCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const LibraryPanel = () => {
  const { player } = useSidebar();
  const {
    folderList,
    setFolderList,
    setEntityName,
    setEntityArt,
    setEntityType,
    setEntityDescription,
  } = useEntityContext();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { setSongList } = useMusicContext();
  const { folderCreateRefresh, songUploadRefresh, playlistCreateRefresh, songAddToPlaylistRefresh } = useFileHandling();
  const router = useRouter();

  // Fetch folders
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch("http://localhost:8080/folders", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched folders:", data);
        setFolderList(data);
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };
    fetchFolders();
  }, [folderCreateRefresh, songUploadRefresh]);

  // Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(
          "http://localhost:8082/playlist-service/playlists",
          {
            method: "GET",
            credentials: "include",
          }
        );

        console.log("Playlist fetch response status:", res.status);
        console.log(
          "Playlist fetch response headers:",
          res.headers.get("content-type")
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Playlist fetch failed:", res.status, errorText);
          return;
        }

        const data = await res.json();
        console.log("Fetched playlists:", data);
        console.log("Playlists type:", typeof data);
        console.log("Is array:", Array.isArray(data));
        console.log("Length:", Array.isArray(data) ? data.length : "not array");

        if (Array.isArray(data)) {
          setPlaylists(data);
        } else {
          console.warn("Expected array but got:", typeof data, data);
          setPlaylists([]);
        }
      } catch (err) {
        console.error("Error fetching playlists:", err);
      }
    };
    fetchPlaylists();
  }, [ playlistCreateRefresh, songAddToPlaylistRefresh]);

  // Handle folder click
  const handleFolderClick = async (folder: Folder) => {
    setSelectedFolder(folder);
    try {
      setEntityType("folder");
      setEntityName(folder.name);
      setEntityArt(
        folder.folderArt ? `${folder.folderArt}` : "/assets/file-icon.webp"
      );
      setEntityDescription(folder.description || "");
      router.push(`/player/folder/${folder.id}`);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  // Handle playlist click
  const handlePlaylistClick = async (playlist: Playlist) => {
    try {
      setEntityType("playlist");
      setEntityName(playlist.name);
      setEntityArt(
        playlist.coverImage || playlist.image || "/assets/music-icon.webp"
      );
      setEntityDescription(playlist.description || "");
      router.push(`/player/playlist/${playlist.playlistId}`);
    } catch (err) {
      console.error("Error navigating to playlist:", err);
    }
  };

  const defaultFolderImage = "/assets/file-icon.webp";
  const defaultPlaylistImage = "/assets/music-icon.webp";

  return (
    <div className="h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-slate-800/80 to-gray-900/90"></div>
      {/* <div className="absolute inset-0 backdrop-blur-xl bg-white/5"></div> */}

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="p-4 pt-6 border-b border-white/20 cursor-pointer backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl ml-3 font-semibold text-white drop-shadow-sm">
              Your Library
            </h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="p-5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white">
                    <Plus className="h-4 w-4" />
                    <span>Create</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-gray-900/95 backdrop-blur-md border border-white/20 text-white"
                >
                  <DropdownMenuItem
                    onClick={() => router.push("/player/upload")}
                    className="hover:bg-white/10 focus:bg-white/10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Music
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/player/newfolder")}
                    className="hover:bg-white/10 focus:bg-white/10"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/player/playlist/create")}
                    className="hover:bg-white/10 focus:bg-white/10"
                  >
                    <ListMusic className="h-4 w-4 mr-2" />
                    Create Playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 m-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white/30 rounded-l-xl text-white/80 hover:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="playlists"
              className="data-[state=active]:bg-white/30 text-white/80 hover:text-white"
            >
              Playlists
            </TabsTrigger>
            <TabsTrigger
              value="folders"
              className="data-[state=active]:bg-white/30 rounded-r-xl text-white/80 hover:text-white"
            >
              Folders
            </TabsTrigger>
          </TabsList>

          {/* All = playlists + folders */}
          <ScrollArea className="flex-1">
            <TabsContent
              value="all"
              className={clsx(`px-3 flex-1 ${player ? "pb-80" : "pb-44"}`)}
            >
              <div className="space-y-2">
                {Array.isArray(playlists) &&
                  playlists.map((playlist) => (
                    <MediaCard
                      key={`playlist-${playlist.playlistId}`}
                      name={playlist.name}
                      image={
                        playlist.coverImage || playlist.image || defaultPlaylistImage
                      }
                      count={playlist.songCount}
                      type="playlist"
                      onClick={() => handlePlaylistClick(playlist)}
                    />
                  ))}
                {folderList.map((folder) => (
                  <MediaCard
                    key={`folder-${folder.id}`}
                    name={folder.name}
                    image={folder.folderArt ? folder.folderArt : defaultFolderImage}
                    count={folder.musicCount}
                    type="folder"
                    onClick={() => handleFolderClick(folder)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Playlists only */}
            <TabsContent value="playlists" className="px-3">
              <div className="space-y-2">
                {Array.isArray(playlists) &&
                  playlists.map((playlist) => (
                    <MediaCard
                      key={`playlist-${playlist.playlistId}`}
                      name={playlist.name}
                      image={
                        playlist.coverImage || playlist.image || defaultPlaylistImage
                      }
                      count={playlist.songCount}
                      type="playlist"
                      onClick={() => handlePlaylistClick(playlist)}
                    />
                  ))}
              </div>
            </TabsContent>

            {/* Folders only */}
            <TabsContent value="folders" className="px-3">
              <div className="space-y-2">
                {folderList.map((folder) => (
                  <MediaCard
                    key={`folder-${folder.id}`}
                    name={folder.name}
                    image={
                      folder.folderArt
                        ? `http://localhost:8080/${folder.folderArt}`
                        : defaultFolderImage
                    }
                    count={folder.musicCount}
                    onClick={() => handleFolderClick(folder)}
                    type="folder"
                  />
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};
