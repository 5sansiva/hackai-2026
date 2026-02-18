"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  /** Positioning of the whole hero art block (same as where your fill images live) */
  className?: string;

  /** Spray settings */
  defaultColor?: string; // hex
  maskToLogoOnly?: boolean; // true = only paint visible on hackAiLogo
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "").trim();
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function SprayHeroGroup({
  className = "absolute inset-0 z-20",
  defaultColor = "#ff4fd8",
  maskToLogoOnly = true,
}: Props) {
  const groupRef = useRef<HTMLDivElement | null>(null);

  // paint canvas (visible)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // offscreen mask canvas + logo image (for masking spray to logo)
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  const [hover, setHover] = useState(false);
  const [color, setColor] = useState(defaultColor);
  const last = useRef<{ x: number; y: number } | null>(null);

  const rgb = useMemo(() => hexToRgb(color), [color]);

  // Strong spray feel
  const radius = 20;
  const density = 44;
  const step = 2.2;

  // Load the logo as an Image for masking (same-origin public asset)
  useEffect(() => {
    const img = new window.Image();
    img.src = "/Home/hackAiLogo.svg";
    img.onload = () => {
      logoImgRef.current = img;
      paintMask();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sizeCanvases = () => {
    const group = groupRef.current;
    const canvas = canvasRef.current;
    if (!group || !canvas) return;

    const rect = group.getBoundingClientRect();
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

  /**
   * Draw the logo into the mask canvas in the SAME position it appears in the group.
   * We position the logo exactly like your original: absolute left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2, with fixed w/h 1150.
   * If you later change logo positioning, update this draw logic to match.
   */
  const paintMask = () => {
    const group = groupRef.current;
    const mctx = maskCtxRef.current;
    const m = maskCanvasRef.current;
    const logoImg = logoImgRef.current;
    if (!group || !mctx || !m || !logoImg) return;

    const rect = group.getBoundingClientRect();

    // Clear mask
    mctx.clearRect(0, 0, rect.width, rect.height);

    // Compute logo draw box in GROUP-local coordinates:
    const logoW = 1150;
    const logoH = 1150;

    // left-[55%] and top-1/2 with translate -1/2, -1/2
    const centerX = rect.width * 0.55;
    const centerY = rect.height * 0.5;

    const x = centerX - logoW / 2;
    const y = centerY - logoH / 2;

    mctx.drawImage(logoImg, x, y, logoW, logoH);
  };

  useEffect(() => {
    sizeCanvases();
    const group = groupRef.current;
    if (!group) return;

    const ro = new ResizeObserver(sizeCanvases);
    ro.observe(group);

    window.addEventListener("resize", sizeCanvases);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sizeCanvases);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localPoint = (e: React.PointerEvent) => {
    const rect = groupRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const applyMask = () => {
    if (!maskToLogoOnly) return;

    const ctx = ctxRef.current;
    const mask = maskCanvasRef.current;
    const group = groupRef.current;
    if (!ctx || !mask || !group) return;

    const w = group.getBoundingClientRect().width;
    const h = group.getBoundingClientRect().height;

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

  return (
    <div
      ref={groupRef}
      className={`${className} pointer-events-auto`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerMove={onMove}
    >
      {/* OUTER GRAFFITI */}
      <Image
        src="/Home/graffitti.svg"
        alt="Graffitti outer"
        fill
        className="object-contain"
        priority
      />

      {/* INNER SPLATTERS */}
      <Image
        src="/Home/splatters.svg"
        alt="Graffitti inner"
        fill
        className="object-contain pointer-events-none"
        style={{
          transform:
            "translateX(clamp(-160px, -8vw, -20px)) translateY(clamp(6px, 1vw, 18px))",
          transformOrigin: "center",
        }}
        priority
      />

      {/* LOGO (same spot as before) */}
      <Image
        src="/Home/hackAiLogo.svg"
        alt="hackAi Logo"
        width={1150}
        height={1150}
        className="absolute left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none"
        priority
        draggable={false}
      />

      {/* CANVAS OVERLAY (paint only shows on logo if maskToLogoOnly=true) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ mixBlendMode: "normal" }}
      />

      {/* CONTROLS (on sides, above apply button) */}
      <div className="absolute left-6 bottom-[18%] z-40 flex flex-col gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-md border border-white/30 bg-black/30 p-0"
          title="Spray color"
        />
        <button
          onClick={reset}
          className="rounded-md border border-white/30 bg-black/40 px-2 py-1 text-xs text-white hover:bg-black/60"
        >
          Reset
        </button>
      </div>

      <div className="absolute right-6 bottom-[18%] z-40 flex flex-col gap-2">
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
    </div>
  );
}
