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
import { useFileHandling } from "../utils/file-handling-context";
import { useRouter } from "next/navigation";
import { useEntityContext } from "../utils/entity-context";

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

export const LibraryPanel = () => {
  const { setUpload, setHome, setCreateFolder, setPlaylist } = useSidebar();
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
  const { setSongList } = useMusicContext();
  const { folderCreateRefresh, songUploadRefresh } = useFileHandling();
  const router = useRouter();
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

  // Handle folder click
  const handleFolderClick = async (folder: Folder) => {
    setSelectedFolder(folder);
    try {
      setEntityType("folder");
      setEntityName(folder.name);
      setEntityArt(
        folder.folderArt ? `http://localhost:8080/${folder.folderArt}` : ""
      );
      setEntityDescription(folder.description || "");
      router.push(`/player/folder/${folder.id}`);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  const playlists = [
    {
      id: "1",
      name: "My Favorites",
      songCount: 42,
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: "2",
      name: "Chill Vibes",
      songCount: 28,
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&crop=center",
    },
  ];

  const defaultImage = "/placeholder.svg";

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
          <TabsContent value="all" className="flex-1 px-3 overflow-y-auto">
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <MediaCard
                  key={`playlist-${playlist.id}`}
                  name={playlist.name}
                  image={playlist.image || defaultImage}
                  count={playlist.songCount}
                  type="playlist"
                />
              ))}
              {folderList.map((folder) => (
                <MediaCard
                  key={`folder-${folder.id}`}
                  name={folder.name}
                  image={
                    folder.folderArt
                      ? `http://localhost:8080/${folder.folderArt}`
                      : defaultImage
                  }
                  count={folder.musicCount}
                  type="folder"
                  onClick={() => handleFolderClick(folder)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Playlists only */}
          <TabsContent
            value="playlists"
            className="flex-1 px-3 overflow-y-auto"
          >
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <MediaCard
                  key={`playlist-${playlist.id}`}
                  name={playlist.name}
                  image={playlist.image || defaultImage}
                  count={playlist.songCount}
                  type="playlist"
                />
              ))}
            </div>
          </TabsContent>

          {/* Folders only */}
          <TabsContent value="folders" className="flex-1 px-3 overflow-y-auto">
            <div className="space-y-2">
              {folderList.map((folder) => (
                <MediaCard
                  key={`folder-${folder.id}`}
                  name={folder.name}
                  image={
                    folder.folderArt
                      ? `http://localhost:8080/${folder.folderArt}`
                      : defaultImage
                  }
                  count={folder.musicCount}
                  onClick={() => handleFolderClick(folder)}
                  type="folder"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
