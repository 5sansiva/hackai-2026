"use client";

import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export type SponsorTier = "title" | "gold" | "silver";

export type Sponsor = {
  id: string;
  tier: SponsorTier;
  logo: string;
  link: string;
  name?: string;
  order?: number;
};

const TIER_CONFIG: {
  id: SponsorTier;
  label: string;
  labelColor: string;
  circleImage: string;
  slots: number;
}[] = [
  { id: "title", label: "TITLE SPONSOR", labelColor: "#1DFF83", circleImage: "/sponsors/circle-purple.png", slots: 1 },
  { id: "gold", label: "GOLD SPONSOR", labelColor: "#DDD059", circleImage: "/sponsors/circle-gold.png", slots: 2 },
  { id: "silver", label: "SILVER SPONSOR", labelColor: "#FFFFFF", circleImage: "/sponsors/circle-silver.png", slots: 1 },
];

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "sponsors"),
      (snap) => {
        setError(null);
        const validTiers: SponsorTier[] = ["title", "gold", "silver"];
        const rows = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          const rawTier = String(data.tier ?? "").toLowerCase();
          const tier: SponsorTier = validTiers.includes(rawTier as SponsorTier) ? (rawTier as SponsorTier) : "gold";
          return {
            id: d.id,
            tier,
            logo: String(data.logo ?? data.image ?? ""),
            link: String(data.link ?? data.url ?? "#"),
            name: data.name != null ? String(data.name) : undefined,
            order: Number(data.order ?? 0),
          };
        });
        setSponsors(rows.filter((x) => x.logo.trim() !== ""));
        setLoading(false);
      },
      (err) => {
        console.error("Sponsors snapshot error ❌", err);
        setError(err?.message ?? "Failed to load sponsors");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const byTier = useMemo(() => {
    const title: Sponsor[] = [];
    const gold: Sponsor[] = [];
    const silver: Sponsor[] = [];
    const sorted = [...sponsors].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const s of sorted) {
      if (s.tier === "title") title.push(s);
      else if (s.tier === "gold") gold.push(s);
      else if (s.tier === "silver") silver.push(s);
    }
    return { title, gold, silver };
  }, [sponsors]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <div className="text-white tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <div className="text-red-300 tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
          SPONSORS ERROR: {error}
        </div>
      </div>
    );
  }

  const slotRows: { tier: (typeof TIER_CONFIG)[0]; sponsors: Sponsor[] }[] = [
    { tier: TIER_CONFIG[0], sponsors: byTier.title },
    { tier: TIER_CONFIG[1], sponsors: byTier.gold },
    { tier: TIER_CONFIG[2], sponsors: byTier.silver },
  ];

  const flattenedSlots: { tier: (typeof TIER_CONFIG)[0]; sponsor?: Sponsor }[] = [];
  for (const { tier, sponsors: list } of slotRows) {
    for (let i = 0; i < tier.slots; i++) {
      flattenedSlots.push({ tier, sponsor: list[i] });
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: "url(/sponsors/sponsors-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#1a1e24",
      }}
    >
      <div className="flex flex-col items-center justify-center py-16 px-4 md:px-6">
        {/* Title: Sponsors PNG (smaller, closer to circles) */}
        <div className="relative mx-auto mb-4 flex items-center justify-center">
          <img
            src="/sponsors/sponsors-title.png"
            alt="Sponsors"
            className="w-[420px] md:w-[400px] lg:w-[540px] h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* Four sponsor slots: wavy PNG circle frames, bigger circles, more spaced out */}
        <div className="flex flex-wrap items-start justify-center gap-14 md:gap-20 max-w-6xl">
          {flattenedSlots.map(({ tier, sponsor }, idx) => (
            <div key={`${tier.id}-${idx}`} className="flex flex-col items-center">
              <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
                <img
                  src={tier.circleImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                {sponsor?.logo ? (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name ?? tier.label}
                    className="relative z-10 w-[55%] h-[55%] object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
              </div>
              <span
                className="mt-5 text-xs md:text-sm font-semibold tracking-widest uppercase text-center"
                style={{ color: tier.labelColor, fontFamily: "Octin Spraypaint" }}
              >
                {tier.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
