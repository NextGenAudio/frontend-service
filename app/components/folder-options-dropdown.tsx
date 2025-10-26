"use client";

import { useRef, useEffect } from "react";
import {
  FolderOpen,
  Edit3,
  Trash2,
} from "lucide-react";
import { useTheme } from "../utils/theme-context";
import { getGeneralThemeColors } from "../lib/theme-colors";
import { Button } from "@radix-ui/themes";

interface FolderOptionsDropdownProps {
  folderId: number;
  folderName: string;
  onOpen?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
//   onShare?: () => void;
//   onCopy?: () => void;
//   onMove?: () => void;
//   onDownload?: () => void;
//   onCreateSubfolder?: () => void;
  onClose?: () => void;
}

export function FolderOptionsDropdown({
  folderId,
  folderName,
  onOpen,
  onRename,
  onDelete,
//   onShare,
//   onCopy,
//   onMove,
//   onDownload,
//   onCreateSubfolder,
  onClose,
}: FolderOptionsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeColors = getGeneralThemeColors(theme.primary);

  useEffect(() => {
    console.log("Folder dropdown mounted");
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleOptionClick = (callback?: () => void) => {
    callback?.();
    onClose?.();
  };

  return (
    <div className="absolute right-0 top-0 z-[9999]" ref={dropdownRef}>
      <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Glass background overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-10 backdrop-blur-xl`}
        />
        <div className="absolute inset-0 bg-white/5" />

        <div className="relative z-10 py-2">
          {/* Open Folder */}
          <Button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onOpen)}
          >
            <FolderOpen
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Open folder
          </Button>

          {/* Divider */}
          {/* <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" /> */}

          {/* Rename */}
          <Button
            className={`w-full px-4 py-3 text-left text-sm text-white ${themeColors.hoverBg} hover:${themeColors.text} transition-all duration-200 flex items-center gap-3 group`}
            onClick={() => handleOptionClick(onRename)}
          >
            <Edit3
              className={`h-4 w-4 ${themeColors.text} group-hover:scale-110 transition-transform`}
            />
            Rename folder
          </Button>

          {/* Divider */}
          <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Delete */}
          <Button
            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 flex items-center gap-3 group"
            onClick={() => handleOptionClick(onDelete)}
          >
            <Trash2 className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
            Delete folder
          </Button>
        </div>
      </div>
    </div>
  );
}
