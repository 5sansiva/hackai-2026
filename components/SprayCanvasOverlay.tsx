"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type SprayLogoProps = {
  wrapperClassName?: string;
  logoSrc?: string;
  width?: number;
  height?: number;
  defaultColor?: string;
  yOffsetPx?: number; // move logo down without breaking transforms
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function SprayLogo({
  wrapperClassName = "absolute left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20",
  logoSrc = "/Home/hackAiLogo.svg",
  width = 1150,
  height = 1150,
  defaultColor = "#ff4fd8",
  yOffsetPx = 0,
}: SprayLogoProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  const [hover, setHover] = useState(false);
  const [color, setColor] = useState(defaultColor);
  const last = useRef<{ x: number; y: number } | null>(null);

  const rgb = useMemo(() => hexToRgb(color), [color]);

  // Stronger spray settings
  const radius = 20;
  const density = 42;
  const step = 2.2;

  useEffect(() => {
    const img = new window.Image();
    img.src = logoSrc;
    img.onload = () => {
      logoImgRef.current = img;
      paintMask();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoSrc]);

  const paintMask = () => {
    const mctx = maskCtxRef.current;
    const m = maskCanvasRef.current;
    const img = logoImgRef.current;
    if (!mctx || !m || !img) return;

    mctx.clearRect(0, 0, m.width, m.height);

    const w = wrapRef.current?.getBoundingClientRect().width ?? width;
    const h = wrapRef.current?.getBoundingClientRect().height ?? height;

    mctx.drawImage(img, 0, 0, w, h);
  };

  const sizeCanvases = () => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    if (!maskCanvasRef.current) {
      maskCanvasRef.current = document.createElement("canvas");
    }
    const m = maskCanvasRef.current;
    m.width = canvas.width;
    m.height = canvas.height;

    const mctx = m.getContext("2d");
    if (!mctx) return;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    maskCtxRef.current = mctx;

    paintMask();
  };

  useEffect(() => {
    sizeCanvases();
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(sizeCanvases);
    ro.observe(wrap);

    window.addEventListener("resize", sizeCanvases);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sizeCanvases);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localPoint = (e: React.PointerEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const applyMask = () => {
    const ctx = ctxRef.current;
    const mask = maskCanvasRef.current;
    const wrap = wrapRef.current;
    if (!ctx || !mask || !wrap) return;

    const w = wrap.getBoundingClientRect().width;
    const h = wrap.getBoundingClientRect().height;

    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(mask, 0, 0, w, h);
    ctx.restore();
  };

  const sprayAt = (x: number, y: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    for (let i = 0; i < density; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;

      const px = x + Math.cos(a) * r + (Math.random() - 0.5) * 2;
      const py = y + Math.sin(a) * r + (Math.random() - 0.5) * 2;

      const dot = Math.random() * 2.2 + 0.6;
      const alpha = Math.random() * 0.35 + 0.35;

      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, dot, 0, Math.PI * 2);
      ctx.fill();
    }

    applyMask();
  };

  const sprayLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const n = Math.max(1, Math.floor(dist / step));

    for (let i = 0; i <= n; i++) {
      const t = i / n;
      sprayAt(from.x + dx * t, from.y + dy * t);
    }
  };

  const onEnter = () => {
    setHover(true);
    last.current = null;
  };

  const onLeave = () => {
    setHover(false);
    last.current = null;
  };

  const onMove = (e: React.PointerEvent) => {
    if (!hover) return;
    const p = localPoint(e);

    if (last.current) sprayLine(last.current, p);
    else sprayAt(p.x, p.y);

    last.current = p;
  };

  const reset = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const swatches = ["#ffffff", "#ff4fd8", "#7c4dff", "#ffd84d", "#4df0ff", "#57ff7a"];

  // ✅ Apply yOffset without touching transform:
  // If wrapper uses top-1/2, we override top with calc(50% + yOffsetPx)
  const wrapperStyle: React.CSSProperties =
    wrapperClassName.includes("top-1/2")
      ? { top: `calc(50% + ${yOffsetPx}px)` }
      : { marginTop: yOffsetPx };

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      {/* Controls */}
      <div className="absolute -left-14 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-md border border-white/30 bg-transparent p-0"
          title="Spray color"
        />
        <button
          onClick={reset}
          className="rounded-md border border-white/30 bg-black/40 px-2 py-1 text-xs text-white hover:bg-black/60"
        >
          Reset
        </button>
      </div>

      <div className="absolute -right-14 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {swatches.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="h-6 w-6 rounded-full border border-white/30"
            style={{ background: c }}
            title={c}
          />
        ))}
      </div>

      {/* Paint area */}
      <div
        ref={wrapRef}
        className="relative"
        style={{ width, height }}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onPointerMove={onMove}
      >
        <Image
          src={logoSrc}
          alt="hackAi Logo"
          width={width}
          height={height}
          priority
          className="pointer-events-none select-none"
          draggable={false}
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ mixBlendMode: "normal" }}
        />
      </div>
    </div>
  );
}
