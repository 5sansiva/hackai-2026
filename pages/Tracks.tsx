import Image from "next/image";

type GeneralTrack = {
  title: string;
  description: string;
  // Your assets (swap these paths)
  frameSrc: string; // chalk square frame (transparent center)
  paintSrc: string; // paint/splatter header (transparent bg)
};

type MiniTrack = {
  label: string;
  frameSrc: string; // chalk pill/rounded rectangle frame (transparent center)
};

const generalTrack: GeneralTrack = {
  title: "Education Programs",
  description:
    "INFORMATION ON EDUCATIONAL OPPORTUNITIES, GI BILL BENEFITS, VOCATIONAL TRAINING, AND CAREER TRANSITION ASSISTANCE.",
  frameSrc: "/assets/frames/chalk-square.png",
  paintSrc: "/assets/paint/purple-splatter.png",
};

const miniTracks: MiniTrack[] = [
  { label: "Howdy World", frameSrc: "/assets/frames/chalk-pill-green.png" },
  { label: "Ridin' Solo", frameSrc: "/assets/frames/chalk-pill-green.png" },
  { label: "Bold & Bootiful", frameSrc: "/assets/frames/chalk-pill-green.png" },
];

export default function TracksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#131a20] text-white">
      {/* Subtle speckled/star background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0 1px, transparent 2px),
            radial-gradient(circle at 70% 40%, rgba(255,255,255,0.06) 0 1px, transparent 2px),
            radial-gradient(circle at 45% 75%, rgba(255,255,255,0.05) 0 1px, transparent 2px),
            radial-gradient(circle at 85% 80%, rgba(255,255,255,0.06) 0 1px, transparent 2px)
          `,
          backgroundSize: "240px 240px",
        }}
      />
      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.75)_100%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-16">
        {/* Title */}
        <h1
          className="text-center text-5xl sm:text-6xl md:text-7xl tracking-wide"
          style={{ fontFamily: "var(--font-drip)" }} // <- your drip font variable
        >
          TRACKS
        </h1>

        {/* GENERAL TRACKS */}
        <SectionTitle className="mt-10">GENERAL TRACKS</SectionTitle>

        <div className="mt-8 w-full">
          <div className="mx-auto w-full max-w-[520px]">
            <GeneralTrackCard track={generalTrack} />
          </div>
        </div>

        {/* MINI TRACKS */}
        <SectionTitle className="mt-16">MINI TRACKS</SectionTitle>

        <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-6">
          {miniTracks.map((t) => (
            <MiniTrackPill key={t.label} track={t} />
          ))}
        </div>
      </div>
    </main>
  );
}

function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-center text-lg sm:text-xl tracking-[0.35em] text-white/90 ${className}`}
      style={{ fontFamily: "var(--font-chalk)" }} // <- your chalk font variable
    >
      {children}
    </h2>
  );
}

function GeneralTrackCard({ track }: { track: GeneralTrack }) {
  return (
    <div className="relative aspect-[4/3] w-full">
      {/* Chalk frame asset (recommended) */}
      <Image
        src={track.frameSrc}
        alt=""
        fill
        className="pointer-events-none select-none object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
        priority
      />

      {/* Inner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 py-10">
        {/* Paint header */}
        <div className="relative mb-6 h-20 w-[90%] max-w-[420px]">
          <Image
            src={track.paintSrc}
            alt=""
            fill
            className="pointer-events-none select-none object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div
              className="text-center text-2xl sm:text-3xl"
              style={{ fontFamily: "var(--font-chalk)" }}
            >
              {track.title}
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          className="max-w-[420px] text-center text-[11px] sm:text-xs leading-relaxed tracking-[0.18em] text-white/80"
          style={{ fontFamily: "var(--font-body, system-ui)" }}
        >
          {track.description}
        </p>
      </div>

      {/* Fallback border (if you ever remove the frame image) */}
      <div className="pointer-events-none absolute inset-[10px] rounded-[26px] border border-white/10" />
    </div>
  );
}

function MiniTrackPill({ track }: { track: MiniTrack }) {
  return (
    <div className="relative h-[78px] w-[260px] sm:w-[280px]">
      <Image
        src={track.frameSrc}
        alt=""
        fill
        className="pointer-events-none select-none object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-lg tracking-wide text-white/95"
          style={{ fontFamily: "var(--font-drip)" }}
        >
          {track.label}
        </span>
      </div>
    </div>
  );
}
