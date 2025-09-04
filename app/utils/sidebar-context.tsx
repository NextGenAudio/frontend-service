"use client";

import { createContext, useState, useContext } from "react";

type SidebarContextType = {
  player: boolean;
  searchBar: boolean;
  detailPanel: boolean;
  setPlayer: (value: boolean) => void;
  setSearchBar: (value: boolean) => void;
  setDetailPanel: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [detailPanel, setDetailPanel] = useState(false);


  return (
    <SidebarContext.Provider
      value={{
        player,
        searchBar,
        detailPanel,
        setPlayer,
        setSearchBar,
        setDetailPanel
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