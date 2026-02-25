"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export type Sponsor = {
  id: string;
  logo: string;
  link: string;
  name?: string;
  order?: number;
};

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "sponsors"),
      (snap) => {
        setError(null);
        const rows = snap.docs
          .map((d) => {
            const data = d.data() as Record<string, unknown>;
            return {
              id: d.id,
              logo: String(data.logo ?? data.image ?? ""),
              link: String(data.link ?? data.url ?? "#"),
              name: data.name != null ? String(data.name) : undefined,
              order: Number(data.order ?? 0),
            };
          })
          .filter((s) => s.logo?.trim());
        setSponsors(rows.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
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

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-24 bg-black">
        <div className="text-white tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-24 bg-black">
        <div className="text-red-300 tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
          SPONSORS ERROR: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Brick wall background */}
      <img
        src="/sponsors/brick-wall-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        draggable={false}
      />
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: "40vh",
          minHeight: "200px",
          background: "linear-gradient(to bottom, #000 0%, #000 25%, rgba(0,0,0,0.92) 50%, rgba(0,0,0,0.6) 78%, transparent 100%)",
        }}
      />

      <div className="relative z-10 pt-6 md:pt-8 pb-8 md:pb-12 px-4 md:px-8">
        {/* Title */}
        <div className="flex justify-center mb-6 md:mb-10">
          <img
            src="/sponsors/sponsors-title.png"
            alt="Sponsors"
            className="w-[560px] md:w-[640px] lg:w-[800px] max-w-full h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
          />
        </div>

        {/* Sponsor grid — 2 columns, taller boxes */}
        {sponsors.length > 0 && (
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6 md:gap-8">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full aspect-[4/3] flex items-center justify-center group"
              >
                {/* Frame */}
                <img
                  src="/sponsors/logo-box-empty.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-fill block"
                  aria-hidden
                />
                {/* Sponsor logo */}
                <img
                  src={sponsor.logo}
                  alt={sponsor.name || "Sponsor logo"}
                  className="relative z-10 max-w-[70%] max-h-[70%] w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 