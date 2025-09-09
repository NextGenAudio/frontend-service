"use client";

import { createContext, useState, useContext } from "react";

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
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [home, setHome] = useState(true);
  const [player, setPlayer] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [detailPanel, setDetailPanel] = useState(false);
  const [upload, setUpload] = useState(false);
  const [createFolder, setCreateFolder] = useState(false);
  const [visualizer, setVisualizer] = useState(false);
  const [profile, setProfile] = useState(false);
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
        setHome,
        setPlayer,
        setSearchBar,
        setDetailPanel,
        setUpload,
        setCreateFolder,
        setVisualizer,
        setProfile,
      
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