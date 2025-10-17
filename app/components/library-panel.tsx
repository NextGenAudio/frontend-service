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
import { Playlist } from "../utils/entity-context";
import { Song } from "../utils/music-context";
import axios from "axios";
import { on } from "events";
import AlertBar from "./alert-bar";
import { usePathname } from "next/navigation";

type Folder = {
  id: number;
  name: string;
  description?: string;
  folderArt?: string; // comes from DB
  musicCount?: number;
};

const MUSIC_LIBRARY_SERVICE_URL =
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;
const PLAYLIST_SERVICE_URL = process.env.NEXT_PUBLIC_PLAYLIST_SERVICE_URL;

export const LibraryPanel = () => {
  const { player } = useSidebar();
  const [message, setMessage] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<{
    type: string;
    id: number;
  } | null>(null);
  const pathname = usePathname();
  const {
    folderList,
    playlistList,
    setPlaylistList,
    setFolderList,
    setEntityName,
    setEntityArt,
    setEntityType,
    setEntityDescription,
  } = useEntityContext();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const { setSongList } = useMusicContext();
  const {
    folderCreateRefresh,
    songUploadRefresh,
    playlistCreateRefresh,
    songAddToPlaylistRefresh,
  } = useFileHandling();
  const router = useRouter();

  // Detect active item from URL
  useEffect(() => {
    if (pathname) {
      const folderMatch = pathname.match(/\/player\/folder\/(\d+)/);
      const playlistMatch = pathname.match(/\/player\/playlist\/(\d+)/);

      if (folderMatch) {
        setActiveItem({ type: "folder", id: parseInt(folderMatch[1]) });
      } else if (playlistMatch) {
        setActiveItem({ type: "playlist", id: parseInt(playlistMatch[1]) });
      } else {
        setActiveItem(null);
      }
    }
  }, [pathname]);

  // Fetch folders
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch(`${MUSIC_LIBRARY_SERVICE_URL}/folders`, {
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
          `${PLAYLIST_SERVICE_URL}/playlist-service/playlists`,
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
          setPlaylistList(data);
        } else {
          console.warn("Expected array but got:", typeof data, data);
          setPlaylistList([]);
        }
      } catch (err) {
        console.error("Error fetching playlists:", err);
      }
    };
    fetchPlaylists();
  }, [playlistCreateRefresh, songAddToPlaylistRefresh]);

  // Handle folder click
  const handleFolderClick = async (folder: Folder) => {
    setSelectedFolder(folder);
    setActiveItem({ type: "folder", id: folder.id });
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
    setActiveItem({ type: "playlist", id: playlist.id });
    try {
      setEntityType("playlist");
      setEntityName(playlist.name);
      setEntityArt(
        playlist.coverImage || playlist.playlistArt || "/assets/music-icon.webp"
      );
      setEntityDescription(playlist.description || "");
      router.push(`/player/playlist/${playlist.id}`);
    } catch (err) {
      console.error("Error navigating to playlist:", err);
    }
  };

  const handlePlaylistDelete = async (id: number) => {
    try {
      // Optimistically remove from UI first
      setPlaylistList(playlistList.filter((playlist) => playlist.id !== id));
      router.back();

      // Make the API call
      const response = await axios.delete(
        `${PLAYLIST_SERVICE_URL}/playlist-service/playlists/${id}`,
        {
          withCredentials: true,
        }
      );

      console.log("Playlist deleted:", response.data);

      // Show success message
      setMessage("✅ Playlist deleted successfully");

      // Auto-clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Failed to delete playlist", err);

      // Restore the playlist to the list if deletion failed
      // You might want to refetch the playlists here instead

      // Show error message
      setMessage("❌ Failed to delete playlist. Please try again.");

      // Auto-clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleFolderDelete = async (id: number) => {
    try {
      // Optimistically remove from UI first
      setFolderList(folderList.filter((folder) => folder.id !== id));
      router.back();

      // Make the API call
      const response = await axios.delete(
        `${MUSIC_LIBRARY_SERVICE_URL}/folders/${id}`,
        {
          withCredentials: true,
        }
      );

      console.log("Folder deleted:", response.data);

      // Show success message
      setMessage("✅ Folder deleted successfully");

      // Auto-clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Failed to delete folder", err);

      // Restore the folder to the list if deletion failed
      // You might want to refetch the folders here instead

      // Show error message
      setMessage("❌ Failed to delete folder. Please try again.");

      // Auto-clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
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
                {Array.isArray(playlistList) &&
                  playlistList.map((playlist) => (
                    <MediaCard
                      key={`playlist-${playlist.id}`}
                      id={playlist.id}
                      name={playlist.name}
                      image={
                        playlist.coverImage ||
                        playlist.playlistArt ||
                        defaultPlaylistImage
                      }
                      count={playlist.musicCount}
                      type="playlist"
                      isActive={
                        activeItem?.type === "playlist" &&
                        activeItem?.id === playlist.id
                      }
                      onClick={() => handlePlaylistClick(playlist)}
                      onPlaylistDelete={() => handlePlaylistDelete(playlist.id)}
                    />
                  ))}
              
                {folderList && folderList?.map((folder) => (
                  <MediaCard
                    key={`folder-${folder.id}`}
                    id={folder.id}
                    onFolderDelete={() => handleFolderDelete(folder.id)}
                    name={folder.name}
                    image={
                      folder.folderArt ? folder.folderArt : defaultFolderImage
                    }
                    count={folder.musicCount}
                    type="folder"
                    isActive={
                      activeItem?.type === "folder" &&
                      activeItem?.id === folder.id
                    }
                    onClick={() => handleFolderClick(folder)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Playlists only */}
            <TabsContent
              value="playlists"
              className={clsx(`px-3 flex-1 ${player ? "pb-80" : "pb-44"}`)}
            >
              <div className="space-y-2">
                {Array.isArray(playlistList) &&
                  playlistList.map((playlist) => (
                    <MediaCard
                      key={`playlist-${playlist.id}`}
                      id={playlist.id}
                      name={playlist.name}
                      onPlaylistDelete={() => handlePlaylistDelete(playlist.id)}
                      image={
                        playlist.coverImage ||
                        playlist.playlistArt ||
                        defaultPlaylistImage
                      }
                      count={playlist.musicCount}
                      type="playlist"
                      isActive={
                        activeItem?.type === "playlist" &&
                        activeItem?.id === playlist.id
                      }
                      onClick={() => handlePlaylistClick(playlist)}
                    />
                  ))}
              </div>
            </TabsContent>

            {/* Folders only */}
            <TabsContent
              value="folders"
              className={clsx(`px-3 flex-1 ${player ? "pb-80" : "pb-44"}`)}
            >
              <div className="space-y-2">
                {folderList?.map((folder) => (
                  <MediaCard
                    key={`folder-${folder.id}`}
                    id={folder.id}
                    name={folder.name}
                    onFolderDelete={() => handleFolderDelete(folder.id)}
                    image={
                      folder.folderArt ? folder.folderArt : defaultFolderImage
                    }
                    count={folder.musicCount}
                    onClick={() => handleFolderClick(folder)}
                    type="folder"
                    isActive={
                      activeItem?.type === "folder" &&
                      activeItem?.id === folder.id
                    }
                  />
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Alert Bar for delete feedback */}
        {message && <AlertBar message={message} setMessage={setMessage} />}
      </div>
    </div>
  );
};
