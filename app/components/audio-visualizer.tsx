"use client";
import { useEffect, useRef } from "react";
import { useMusicContext } from "../utils/music-context";

export default function AudioVisualizer() {
  const { soundRef } = useMusicContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Keep global refs alive between renders
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const audioEl = (soundRef.current as any)?._sounds?.[0]?._node as
      | HTMLMediaElement
      | undefined;
    if (!audioEl || !canvasRef.current) return;

    // ✅ Init AudioContext once
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    // ✅ Init Analyser once
    if (!analyserRef.current) {
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
    }

    // ✅ Connect source only once
    if (!sourceRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioEl);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
      console.log("Audio source connected ✅");
    } else {
      console.log("Reusing existing audio source ♻️");
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    // Ensure resolution matches display
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      const barWidth = canvas.clientWidth / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = "#f97316";
        ctx.fillRect(x, canvas.clientHeight - barHeight, barWidth, barHeight);
        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // ❌ Don’t disconnect or recreate source — keep alive
    };
  }, [soundRef.current]);

  return (
    <div className="overflow-hidden rounded-lg my-4 h-full w-full bg-gradient-to-br from-gray-800/20 via-slate-400/20 to-gray-800/20  flex items-center justify-center">
    {/* Background image box */}
    <div
      className="absolute  left-1/2 -translate-x-1/2 h-64 w-96 bg-cover bg-center z-0 opacity-90"
      style={{ backgroundImage: "url('/assets/sonex-v-wall.png')" }}
    />

      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
