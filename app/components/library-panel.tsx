"use client";
import { useState } from "react";
import { Plus, Music, MoreHorizontal } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";

export const LibrariesPanel = () => {
  const [isOpen, setIsOpen] = useState(true);

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
    {
      id: "3",
      name: "Workout Mix",
      songCount: 35,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: "4",
      name: "Road Trip",
      songCount: 23,
      image:
        "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: "5",
      name: "Study Session",
      songCount: 19,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
    },
  ];

  return (
    <div className="h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-700/80 to-orange-600/90"></div>
      <div className="absolute inset-0 backdrop-blur-xl bg-white/10"></div>

      <div className="relative h-full flex flex-col">
        {/* <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild> */}
            <div className="p-4 border-b border-white/20 cursor-pointer  backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white drop-shadow-sm">
                  Libraries
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm text-white hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          {/* </CollapsibleTrigger> */}

          {/* <CollapsibleContent className="flex-1"> */}
            <Tabs defaultValue="playlists" className="h-full flex flex-col">
              <TabsList className="grid  grid-cols-3 m-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white/30  data-[state=active]:text-white text-white/80 hover:text-white transition-all duration-200 data-[state=active]:shadow-lg rounded-xl"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="playlists"
                  className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/80 hover:text-white transition-all duration-200 data-[state=active]:shadow-lg rounded-xl"
                >
                  Playlists
                </TabsTrigger>
                <TabsTrigger
                  value="imports"
                  className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-white/80 hover:text-white transition-all duration-200 data-[state=active]:shadow-lg rounded-xl"
                >
                  Imports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="flex-1 px-3 overflow-y-auto">
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-[1.02] cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-xl"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={playlist.image || "/placeholder.svg"}
                          alt={playlist.name}
                          className="w-12 h-12 rounded-xl object-cover shadow-md"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                      </div>
                      <div className="flex-1 min-w-0 hidden sm:block">
                        <div className="font-medium truncate text-white drop-shadow-sm">
                          {playlist.name}
                        </div>
                        <div className="text-sm text-white/70">
                          {playlist.songCount} songs
                        </div>
                      </div>
                      <Button
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/30 border border-white/30 text-white hover:scale-110 transition-all duration-200 hidden sm:flex backdrop-blur-sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {["Local Files", "Downloaded"].map((item, index) => (
                    <div
                      key={`special-${index}`}
                      className="flex items-center gap-3 p-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl hover:bg-white/25 hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <Music className="h-6 w-6 text-white/80" />
                      </div>
                      <div className="text-sm font-medium hidden sm:block text-white drop-shadow-sm">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent
                value="playlists"
                className="flex-1 px-3 overflow-y-auto"
              >
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-[1.02] cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-xl"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={playlist.image || "/placeholder.svg"}
                          alt={playlist.name}
                          className="w-12 h-12 rounded-xl object-cover shadow-md"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                      </div>
                      <div className="flex-1 min-w-0 hidden sm:block">
                        <div className="font-medium truncate text-white drop-shadow-sm">
                          {playlist.name}
                        </div>
                        <div className="text-sm text-white/70">
                          {playlist.songCount} songs
                        </div>
                      </div>
                      <Button
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/30 border border-white/30 text-white hover:scale-110 transition-all duration-200 hidden sm:flex backdrop-blur-sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent
                value="imports"
                className="flex-1 px-3 overflow-y-auto"
              >
                <div className="space-y-2">
                  <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl">
                    <div className="text-sm font-medium text-white drop-shadow-sm">
                      Spotify Import
                    </div>
                    <div className="text-xs text-white/70">
                      Last synced 2 days ago
                    </div>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl">
                    <div className="text-sm font-medium text-white drop-shadow-sm">
                      Apple Music
                    </div>
                    <div className="text-xs text-white/70">
                      Last synced 1 week ago
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          {/* </CollapsibleContent>
        </Collapsible> */}
      </div>
    </div>
  );
};
