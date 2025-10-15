"use client";
import { useEffect, useRef } from "react";
import { useMusicContext } from "../utils/music-context";
import { useTheme } from "../utils/theme-context";
import { getThemeHexColors } from "../lib/theme-colors";

export default function AudioVisualizer() {
  const { soundRef, isPlaying } = useMusicContext();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Keep global refs alive between mounts
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioElementRef = useRef<HTMLMediaElement | null>(null);
  const currentAudioElementRef = useRef<HTMLMediaElement | null>(null); // Track current audio element
  const isAnimatingRef = useRef(false); // Track animation state

  useEffect(() => {
    console.log("🎵 Visualizer: Starting setup...");
    console.log("🎵 Visualizer: isPlaying:", isPlaying);

    const setupVisualizer = (audioEl: HTMLMediaElement) => {
      console.log("🎵 Visualizer: Setting up with audio element:", audioEl);
      console.log("🎵 Visualizer: canvasRef.current:", canvasRef.current);

      if (!canvasRef.current) {
        console.log("🎵 Visualizer: No canvas element");
        return;
      }

      try {
        // ✅ Create AudioContext once with proper state management
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          console.log("🎵 Visualizer: AudioContext created");
        }

        // ✅ Resume audio context if suspended
        if (audioCtxRef.current.state === "suspended") {
          console.log("🎵 Visualizer: Resuming suspended AudioContext");
          audioCtxRef.current.resume();
        }

        // ✅ Create analyser once
        if (!analyserRef.current) {
          analyserRef.current = audioCtxRef.current.createAnalyser();
          analyserRef.current.fftSize = 128;
          console.log("🎵 Visualizer: Analyser created");
        }

        // ✅ Handle audio source changes (new song)
        if (
          currentAudioElementRef.current &&
          currentAudioElementRef.current !== audioEl
        ) {
          console.log(
            "🎵 Visualizer: Audio element changed, disconnecting old source"
          );
          if (sourceRef.current) {
            try {
              sourceRef.current.disconnect();
              sourceRef.current = null;
            } catch (error) {
              console.warn(
                "🎵 Visualizer: Error disconnecting old source:",
                error
              );
            }
          }
        }

        currentAudioElementRef.current = audioEl;

        // ✅ Only create MediaElementSource once per audio element
        if (!sourceRef.current) {
          try {
            sourceRef.current =
              audioCtxRef.current.createMediaElementSource(audioEl);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioCtxRef.current.destination);
            console.log(
              "🎵 Visualizer: Audio source connected successfully! 🎉"
            );
          } catch (error) {
            console.error(
              "🎵 Visualizer: Failed to create MediaElementSource:",
              error
            );
            return;
          }
        } else {
          console.log("🎵 Visualizer: Reusing existing audio source ♻️");
        }

        // ✅ Start the visualization (only if not already animating)
        if (!isAnimatingRef.current) {
          startVisualization();
        } else {
          console.log("🎵 Visualizer: Animation already running");
        }
      } catch (error) {
        console.error("🎵 Visualizer: Error in setup:", error);
      }
    };
    const startVisualization = () => {
      if (!analyserRef.current || !canvasRef.current) {
        console.log(
          "🎵 Visualizer: Missing analyser or canvas for visualization"
        );
        return;
      }

      // Prevent duplicate animations
      if (isAnimatingRef.current) {
        console.log("🎵 Visualizer: Animation already running, skipping start");
        return;
      }

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      // Handle high DPI
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      isAnimatingRef.current = true; // Mark as animating

      const draw = () => {
        // Get fresh audio data from analyser (will naturally decay to zero when paused)
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        const barWidth = canvas.clientWidth / bufferLength;
        const themeColors = getThemeHexColors(theme.primary);
        let x = 0;

        // Check if we have any signal
        let hasSignal = false;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.clientHeight;

          if (dataArray[i] > 1) hasSignal = true;

          // Create a gradient effect using theme colors
          const intensity = dataArray[i] / 255;
          if (intensity > 0.7) {
            ctx.fillStyle = themeColors.accent;
          } else if (intensity > 0.4) {
            ctx.fillStyle = themeColors.primary;
          } else {
            ctx.fillStyle = themeColors.secondary;
          }

          ctx.fillRect(
            x,
            canvas.clientHeight - barHeight,
            Math.max(1, barWidth - 1),
            barHeight
          );
          x += barWidth;
        }

        // ✅ Only stop animation when signal is completely gone AND music is paused
        if (!hasSignal && !isPlaying) {
          console.log(
            "🎵 Visualizer: Natural decay complete, stopping animation"
          );
          isAnimatingRef.current = false;
          animationRef.current = null;
          return;
        }

        // Continue animation
        animationRef.current = requestAnimationFrame(draw);
      };

      console.log("🎵 Visualizer: Starting animation loop! 🎨");
      draw();
    };

    // Listen for the audioReady event from layout
    const handleAudioReady = (event: CustomEvent) => {
      console.log("🎵 Visualizer: Received audioReady event");
      const audioElement = event.detail.audioElement as HTMLMediaElement;
      audioElementRef.current = audioElement;
      setupVisualizer(audioElement);
    };

    // Add event listener for audioReady
    window.addEventListener("audioReady", handleAudioReady as EventListener);

    // If we already have an audio element, set up visualizer
    if (audioElementRef.current) {
      setupVisualizer(audioElementRef.current);
    }

    // ✅ Restart animation when play resumes after natural decay
    if (
      isPlaying &&
      !isAnimatingRef.current &&
      analyserRef.current &&
      canvasRef.current
    ) {
      console.log("🎵 Visualizer: Restarting animation after play resume");
      startVisualization();
    }

    return () => {
      // Remove event listener
      window.removeEventListener(
        "audioReady",
        handleAudioReady as EventListener
      );

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        isAnimatingRef.current = false;
      }
    };
  }, [isPlaying, theme.primary]); // ✅ Remove soundRef.current dependency

  return (
    <div className="overflow-hidden rounded-lg h-full w-full bg-gradient-to-br from-gray-700/20 via-slate-700/20 to-gray-700/30 flex items-center justify-center relative">
      <div
        className="absolute left-1/2 -translate-x-1/2 h-64 w-96 bg-cover bg-center z-0 opacity-90"
        style={{ backgroundImage: "url('/assets/sonex-v-wall.webp')" }}
      />
      <canvas ref={canvasRef} className="w-full h-full relative z-10" />
    </div>
  );
}
