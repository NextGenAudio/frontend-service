"use client";

import { createContext, useState, useContext } from "react";

type SidebarContextType = {
  player: boolean;
  searchBar: boolean;
  detailPanel: boolean;
  togglePlayer: () => void;
  toggleSearchBar: () => void;
  toggleDetailPanel: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [detailPanel, setDetailPanel] = useState(false);

  const togglePlayer = () => setPlayer((prev) => !prev);
  const toggleSearchBar = () => setSearchBar((prev) => !prev);
  const toggleDetailPanel = () => setDetailPanel((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        player,
        searchBar,
        detailPanel,
        togglePlayer,
        toggleSearchBar,
        toggleDetailPanel,
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