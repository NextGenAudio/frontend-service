"use client";
import React, { useRef, useEffect } from "react";

import { createContext, useState, useContext } from "react";

type Folder = {
  id: number;
  name: string;
  description?: string;
  folderArt?: string; // comes from DB
  musicCount?: number;
};

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  coverImage?: string;
  playlistArt?: string; // for compatibility with existing code
  musicCount?: number;
  createdAt?: string;
  updatedAt?: string;
  musics?: any[]; // Add musics property
  tracks?: any[]; // Add tracks property
}

type EntityContextType = {
  entityName: string | null;
  entityArt: string | null;
  entityType: "folder" | "playlist" | null;

  setEntityName: (value: string | null) => void;
  setEntityArt: (value: string | null) => void;
  setEntityType: (value: "folder" | "playlist" | null) => void;

  folderList: Folder[];
  playlistList: Playlist[];
  setFolderList: (value: Folder[]) => void;
  setPlaylistList: (value: Playlist[]) => void;
  entityDescription: string;
  setEntityDescription: (value: string) => void;
};

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export function EntityProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize with default values first (for SSR)
  const [entityName, setEntityName] = useState<string | null>(null);
  const [entityArt, setEntityArt] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<"folder" | "playlist" | null>(
    null
  );
  const [entityDescription, setEntityDescription] = useState("");

  const [folderList, setFolderList] = useState<any[]>([]);
  const [playlistList, setPlaylistList] = useState<any[]>([]);
  const [playingSongDuration, setPlayingSongDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [repeatMode, setRepeatMode] = useState(0);
  const [liked, setliked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Load from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);

    // Helper function to safely load from localStorage
    const loadFromStorage = (key: string, defaultValue: any) => {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
        return defaultValue;
      }
    };

    // Load all values from localStorage
    setEntityName(loadFromStorage("entityName", null));
    setEntityArt(loadFromStorage("entityArt", null));
    setEntityType(loadFromStorage("entityType", null));
    setEntityDescription(loadFromStorage("entityDescription", ""));
  }, []);

  // Save to localStorage whenever values change (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("entityName", JSON.stringify(entityName));
      } catch (error) {
        console.error("Error saving entityName to localStorage:", error);
      }
    }
  }, [entityName, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("entityArt", JSON.stringify(entityArt));
      } catch (error) {
        console.error("Error saving entityArt to localStorage:", error);
      }
    }
  }, [entityArt, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("entityType", JSON.stringify(entityType));
      } catch (error) {
        console.error("Error saving entityType to localStorage:", error);
      }
    }
  }, [entityType, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(
          "entityDescription",
          JSON.stringify(entityDescription)
        );
      } catch (error) {
        console.error("Error saving entityDescription to localStorage:", error);
      }
    }
  }, [entityDescription, isHydrated]);

  const value = {
    entityName,
    entityArt,
    entityType,

    folderList,
    playlistList,
    setFolderList,
    setPlaylistList,

    setEntityName,
    setEntityArt,
    setEntityType,
    entityDescription,
    setEntityDescription,
  };

  return (
    <EntityContext.Provider value={value}>{children}</EntityContext.Provider>
  );
}

export function useEntityContext() {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error("useEntityContext must be used within a EntityProvider");
  }
  return context;
}

export default EntityContext;
