"use client"

import { useEffect, useState } from "react"
import { Music, Headphones } from "lucide-react"

export default function AppLoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Glassmorphism overlay */}
      {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" /> */}

      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div className="w-2 h-2 bg-white/20 rounded-full" />
          </div>
        ))}
      </div> */}

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        {/* Logo section */}
 

        {/* Loading spinner */}
        <div className="relative">
          <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-spin">
            <div
              className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"
              style={{ animationDuration: "1s" }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>


        {/* Sound waves animation */}
        <div className="flex items-end space-x-1 mt-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white/60 rounded-full animate-pulse"
              style={{
                width: "4px",
                height: `${20 + Math.random() * 30}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.8 + Math.random() * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      {/* <div className="absolute top-8 left-8">
        <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 animate-pulse" />
      </div>
      <div className="absolute bottom-8 right-8">
        <div
          className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
      <div className="absolute top-1/4 right-16">
        <div
          className="w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div> */}
    </div>
  )
}
