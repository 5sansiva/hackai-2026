import React, { useEffect, useMemo, useState } from "react";

type Props = {
  target?: Date | string | number;
  leftGraffitiSrc?: string;
  rightGraffitiSrc?: string;
  frameSrc?: string;
  heightClassName?: string;
  title?: string;
  footerText?: string;
};

function toMs(t: NonNullable<Props["target"]>) {
  return t instanceof Date ? t.getTime() : typeof t === "string" ? new Date(t).getTime() : t;
}

function nextMarch7Local(hour = 9, minute = 0, second = 0) {
  const now = new Date();
  const year = now.getFullYear();
  const candidate = new Date(year, 2, 7, hour, minute, second, 0);
  return candidate.getTime() <= now.getTime()
    ? new Date(year + 1, 2, 7, hour, minute, second, 0)
    : candidate;
}

function pad2(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

export default function CountdownHero({
  target,
  leftGraffitiSrc,
  rightGraffitiSrc,
  frameSrc,
  heightClassName = "h-[740px] md:h-[460px]",
  title = "Countdown",
  footerText = "till hacking begins",
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const targetMs = useMemo(() => {
    if (target != null) return toMs(target);
    return nextMarch7Local(9, 0, 0).getTime();
  }, [target]);

  // ✅ hydration-safe "now"
  const [now, setNow] = useState<number>(0);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = mounted ? Math.max(0, targetMs - now) : 0;
  const totalSec = mounted ? Math.floor(diff / 1000) : 0;

  const days = Math.floor(totalSec / (60 * 60 * 24));
  const hours = Math.floor((totalSec % (60 * 60 * 24)) / (60 * 60));
  const mins = Math.floor((totalSec % (60 * 60)) / 60);
  const secs = totalSec % 60;

  const safeDays = mounted ? String(days).padStart(2, "0") : "--";
  const safeHours = mounted ? pad2(hours) : "--";
  const safeMins = mounted ? pad2(mins) : "--";
  const safeSecs = mounted ? pad2(secs) : "--";

  return (
    <section className={`relative w-full overflow-hidden ${heightClassName}`}>
      {/* ... left/right graffiti unchanged ... */}

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-start sm:justify-center px-3 sm:px-4 pt-6 sm:pt-0">
        <h2
          className="mb-4 sm:mb-6 md:mb-8 text-white text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-[0_4px_0_rgba(0,0,0,0.85)] tracking-wide"
          style={{ fontFamily: "Street Flow NYC", WebkitTextStroke: "1px black" }}
        >
          {title}
        </h2>

        <div className="flex flex-col items-center gap-5 sm:hidden">
          <Block value={safeDays} label="days" />
          <Block value={safeHours} label="hours" />
          <Block value={safeMins} label="mins" />
          <Block value={safeSecs} label="sec" />
        </div>

        <div className="relative hidden sm:block w-[min(980px,94vw)]">
          {/* ✅ only render frame image when frameSrc exists */}
          {frameSrc ? (
            <img
              src={frameSrc}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              draggable={false}
            />
          ) : null}

          <div className="relative w-full px-8.5 py-7 md:px-15.5 md:py-11">
            <div className="flex items-end justify-center gap-8 md:gap-10">
              <Block value={safeDays} label="days" />
              <DotColon />
              <Block value={safeHours} label="hours" />
              <DotColon />
              <Block value={safeMins} label="mins" />
              <DotColon />
              <Block value={safeSecs} label="sec" />
            </div>
          </div>
        </div>

        {/* ... rest unchanged ... */}
      </div>

      {/* ... style jsx unchanged ... */}
      <style jsx>{`
        .glitch {
          position: relative;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          opacity: 0.22;
          pointer-events: none;
        }

        .glitch::before {
          transform: translate(1px, 0);
          clip-path: inset(0 0 55% 0);
        }

        .glitch::after {
          transform: translate(-1px, 0);
          clip-path: inset(55% 0 0 0);
        }
      `}</style>
    </section>
  );
}

// DotColon + Block unchanged

function DotColon() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-7">
      <span className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-pink-200/95 shadow-[0_0_14px_rgba(255,112,190,0.22)]" />
      <span className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-pink-200/95 shadow-[0_0_14px_rgba(255,112,190,0.22)]" />
    </div>
  );
}

function Block({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center w-35 sm:w-37.5 md:w-47.5">
      <div className="relative">
        <div
          className="glitch leading-none text-[72px] sm:text-[88px] md:text-[112px] text-white"
          style={{
            fontFamily: "Octin Spraypaint",
            WebkitTextStroke: "1px #ff2fb2",
          }}
          data-text={value}
          suppressHydrationWarning
        >
          {value}
        </div>
      </div>

      <div
        className="mt-2 sm:mt-4 text-[16px] sm:text-[22px] md:text-[26px] font-semibold text-emerald-200 tracking-wide drop-shadow-[0_2px_0_rgba(0,0,0,0.9)]"
        style={{ WebkitTextStroke: "0.8px black" }}
      >
        {label}
      </div>
    </div>
  );
}