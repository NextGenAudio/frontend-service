"use client";
import { useEffect, useRef } from "react";
import { useMusicContext } from "../utils/music-context";
import { useTheme } from "../utils/theme-context";
import { getThemeHexColors } from "../lib/theme-colors";

export default function AudioVisualizer() {
  const { soundRef } = useMusicContext();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Keep global refs alive between mounts
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const audioEl = (soundRef.current as any)?._sounds?.[0]?._node as
      | HTMLMediaElement
      | undefined;
    if (!audioEl || !canvasRef.current) return;

    // Create AudioContext once
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    // Create analyser once
    if (!analyserRef.current) {
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
    }

    // Only create MediaElementSource once per <audio>
    if (!sourceRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioEl);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
      console.log("Audio source connected ");
    } else {
      console.log("Reusing existing audio source ♻️");
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

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // ❌ don’t disconnect source — reuse on next mount
    };
  }, [soundRef.current]);

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
