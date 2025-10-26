"use client";

import { createContext, useState, useContext, useRef, useEffect } from "react";

type SidebarContextType = {
  home: boolean;
  player: boolean;
  searchBar: boolean;
  detailPanel: boolean;
  upload: boolean;
  createFolder: boolean;
  visualizer: boolean;
  profile: boolean;
  setHome: (value: boolean) => void;
  setPlayer: (value: boolean) => void;
  setSearchBar: (value: boolean) => void;
  setDetailPanel: (value: boolean) => void;
  setUpload: (value: boolean) => void;
  setCreateFolder: (value: boolean) => void;
  setVisualizer: (value: boolean) => void;
  setProfile: (value: boolean) => void;
  playlist: boolean;
  setPlaylist: (value: boolean) => void;
  queue: boolean;
  setQueue: (value: boolean) => void;
  collaborators: boolean;
  setCollaborators: (value: boolean) => void;
  profileUpdate?: boolean;
  setProfileUpdate: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [home, setHome] = useState(false);
  const [player, setPlayer] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [detailPanel, setDetailPanel] = useState(false);
  const [upload, setUpload] = useState(false);
  const [createFolder, setCreateFolder] = useState(false);
  const [visualizer, setVisualizer] = useState<boolean>(
    getInitialVisualizerState()
  );
  const [profile, setProfile] = useState(false);
  const [playlist, setPlaylist] = useState(false);
  const [queue, setQueue] = useState(false);
  const [collaborators, setCollaborators] = useState(false);
  const [profileUpdate, setProfileUpdate] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("visualizer", String(visualizer));
    } catch {
      // ignore
    }
  }, [visualizer]);

  function getInitialVisualizerState() {
    try {
      if (typeof window === "undefined") return true;
      const raw = localStorage.getItem("visualizer");
      if (raw === null) return true;
      return raw === "true";
    } catch {
      return true;
    }
  }

  return (
    <SidebarContext.Provider
      value={{
        home,
        player,
        searchBar,
        detailPanel,
        upload,
        createFolder,
        visualizer,
        profile,
        playlist,
        queue,
        collaborators,
        profileUpdate,
        setHome,
        setPlayer,
        setSearchBar,
        setDetailPanel,
        setUpload,
        setCreateFolder,
        setVisualizer,
        setProfile,
        setPlaylist,
        setQueue,
        setCollaborators,
        setProfileUpdate,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used inside a SidebarProvider");
  }
  return context;
}
