"use client";
import { useEffect, useRef } from "react";
import { useMusicContext } from "../utils/music-context";
import { useTheme } from "../utils/theme-context";
import { getThemeHexColors } from "../lib/theme-colors";

export default function AudioVisualizer() {
  const { soundRef, isPlaying } = useMusicContext(); // ✅ Added isPlaying
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Keep global refs alive between mounts
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    console.log("🎵 Visualizer: Starting setup...");
    console.log("🎵 Visualizer: soundRef.current:", soundRef.current);
    console.log("🎵 Visualizer: isPlaying:", isPlaying);

    // ✅ Early return if not playing
    if (!isPlaying) {
      console.log("🎵 Visualizer: Not playing, stopping animation");
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const setupVisualizer = () => {
      const audioEl = (soundRef.current as any)?._sounds?.[0]?._node as HTMLMediaElement | undefined;
      
      console.log("🎵 Visualizer: audioEl:", audioEl);
      console.log("🎵 Visualizer: canvasRef.current:", canvasRef.current);

      if (!audioEl) {
        console.log("🎵 Visualizer: No audio element, retrying in 100ms...");
        setTimeout(setupVisualizer, 100);
        return;
      }

      if (!canvasRef.current) {
        console.log("🎵 Visualizer: No canvas element");
        return;
      }

      try {
        // ✅ Create AudioContext once with proper state management
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          console.log("🎵 Visualizer: AudioContext created");
        }

        // ✅ Resume audio context if suspended
        if (audioCtxRef.current.state === 'suspended') {
          console.log("🎵 Visualizer: Resuming suspended AudioContext");
          audioCtxRef.current.resume();
        }

        // ✅ Create analyser once
        if (!analyserRef.current) {
          analyserRef.current = audioCtxRef.current.createAnalyser();
          analyserRef.current.fftSize = 128;
          console.log("🎵 Visualizer: Analyser created");
        }

        // ✅ Only create MediaElementSource once per audio element
        if (!sourceRef.current) {
          try {
            sourceRef.current = audioCtxRef.current.createMediaElementSource(audioEl);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioCtxRef.current.destination);
            console.log("🎵 Visualizer: Audio source connected successfully! 🎉");
          } catch (error) {
            console.error("🎵 Visualizer: Failed to create MediaElementSource:", error);
            return;
          }
        } else {
          console.log("🎵 Visualizer: Reusing existing audio source ♻️");
        }

        // ✅ Start the visualization
        startVisualization();

      } catch (error) {
        console.error("🎵 Visualizer: Error in setup:", error);
      }
    };

    const startVisualization = () => {
      if (!analyserRef.current || !canvasRef.current) {
        console.log("🎵 Visualizer: Missing analyser or canvas for visualization");
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

      const draw = () => {
        // ✅ Check if still playing before continuing animation
        if (!isPlaying) {
          console.log("🎵 Visualizer: Stopping animation - not playing");
          return;
        }

        animationRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        const barWidth = canvas.clientWidth / bufferLength;
        const themeColors = getThemeHexColors(theme.primary);
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.clientHeight;

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
      };

      console.log("🎵 Visualizer: Starting animation loop! 🎨");
      draw();
    };

    // Start setup
    setupVisualizer();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [soundRef.current, isPlaying, theme.primary]); // ✅ Added proper dependencies

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