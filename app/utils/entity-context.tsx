"use client";
import React, { useRef } from "react";

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
  playlistId?: number; // for compatibility
  name: string;
  description?: string;
  coverImage?: string;
  image?: string; // for compatibility with existing code
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
  const [entityName, setEntityName] = useState<string | null>(null);
  const [entityArt, setEntityArt] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<"folder" | "playlist" | null>(
    null
  );

  const [folderList, setFolderList] = useState<any[]>([]);
  const [playlistList, setPlaylistList] = useState<any[]>([]);
  const [playingSongDuration, setPlayingSongDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [repeatMode, setRepeatMode] = useState(0);
  const [liked, setliked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [entityDescription, setEntityDescription] = useState("");

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
