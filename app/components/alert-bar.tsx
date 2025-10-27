"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const AlertBar = ({
  message,
  setMessage,
}: {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    // create a top-level container to ensure alert is above other app z-stacks
    const container = document.createElement("div");
    // match the extremely high z used by other overlays when necessary
    container.style.zIndex = "2147483647";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.pointerEvents = "none"; // let inner button be clickable via its own pointer-events
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      try {
        document.body.removeChild(container);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const content = (
    <div style={{ pointerEvents: "auto" }} className="p-6">
      <div
        className={`mx-auto max-w-xl backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl transition-all duration-1000 ${
          message.includes("✅")
            ? "bg-green-500/20 border-green-400/30"
            : "bg-red-500/20 border-red-400/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-white text-center text-lg flex-1">{message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessage(null)}
            className="text-white hover:bg-white/10 ml-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (portalContainer) {
    return createPortal(content, portalContainer);
  }

  // Fallback render (should only be used during SSR, but this component is client-only)
  return (
    <div className="fixed top-6 right-6 z-[999999999]">
      <div
        className={`backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl transition-all duration-1000 ${
          message.includes("✅")
            ? "bg-green-500/20 border-green-400/30"
            : "bg-red-500/20 border-red-400/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-white text-center text-lg flex-1">{message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessage(null)}
            className="text-white hover:bg-white/10 ml-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertBar;
