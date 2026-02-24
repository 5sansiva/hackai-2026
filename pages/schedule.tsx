"use client";

import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export type EventType = "MANDATORY" | "FOOD" | "FUN" | "WORKSHOP" | "SUPPORT";

export type ScheduleEvent = {
  id: string;
  name: string;
  location: string;
  time: string;
  tag: EventType;
  day: "saturday" | "sunday";
  order: number;
};

// Event type config: label, background hex (with alpha), and icon path
const EVENT_TYPES: { id: EventType; label: string; bg: string; iconPath: string }[] = [
  { id: "MANDATORY", label: "MANDATORY", bg: "#FF000466", iconPath: "/schedule/icons/mandatory.png" },
  { id: "FOOD", label: "FOOD", bg: "#1DFF8366", iconPath: "/schedule/icons/food.png" },
  { id: "FUN", label: "FUN", bg: "#DDD05966", iconPath: "/schedule/icons/fun.png" },
  { id: "WORKSHOP", label: "WORKSHOP", bg: "#5FACFE66", iconPath: "/schedule/icons/workshop.png" },
  { id: "SUPPORT", label: "SUPPORT", bg: "#8A38F566", iconPath: "/schedule/icons/support.png" },
];

function getTagBg(tag: EventType): string {
  const t = EVENT_TYPES.find((e) => e.id === tag);
  return t ? t.bg : "#6b728066";
}

function EventTypeIcon({ tag, className = "h-3.5 w-3.5" }: { tag: EventType; className?: string }) {
  const config = EVENT_TYPES.find((e) => e.id === tag);
  if (!config) return null;
  return (
    <img
      src={config.iconPath}
      alt=""
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

export default function ScheduleSection() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventType | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "schedule"),
      (snap) => {
        console.log("Project ID from client:", (db as { _app?: { options?: { projectId?: string } } })?._app?.options?.projectId);
        console.log("Schedule snapshot size:", snap.size);
        console.log("First schedule doc:", snap.docs[0]?.data());

        setError(null);
        const validTags: EventType[] = ["MANDATORY", "FOOD", "FUN", "WORKSHOP", "SUPPORT"];
        const rows = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          // Support both naming conventions: location/room, tag/eventType (Firestore may use lowercase)
          const location = String(data.location ?? data.room ?? "");
          const rawTag = String(data.tag ?? data.eventType ?? "").toUpperCase() as EventType;
          const tag: EventType = validTags.includes(rawTag) ? rawTag : "WORKSHOP";
          // Normalize day to literal type
          let rawDay = (data.day as string) ?? "saturday";
          rawDay = rawDay.trim().toLowerCase();
          const day = rawDay === "sunday" ? "sunday" : "saturday";
          return {
            id: d.id,
            name: String(data.name ?? ""),
            location,
            time: String(data.time ?? ""),
            tag,
            day: day as "saturday" | "sunday",
            order: Number(data.order ?? 0),
          };
        });
        setEvents(rows.filter((x) => x.name.trim() !== ""));
        setLoading(false);
      },
      (err) => {
        console.error("Schedule snapshot error ❌", err);
        setError(err?.message ?? "Failed to load schedule");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const { saturday, sunday } = useMemo(() => {
    const sat = events.filter((e) => e.day === "saturday").sort((a, b) => a.order - b.order);
    const sun = events.filter((e) => e.day === "sunday").sort((a, b) => a.order - b.order);
    return { saturday: sat, sunday: sun };
  }, [events]);

  const filteredSaturday = useMemo(() => {
    if (!activeFilter) return saturday;
    return saturday.filter((e) => e.tag === activeFilter);
  }, [saturday, activeFilter]);

  const filteredSunday = useMemo(() => {
    if (!activeFilter) return sunday;
    return sunday.filter((e) => e.tag === activeFilter);
  }, [sunday, activeFilter]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl py-24 px-4 md:px-6 flex justify-center">
        <div className="text-white tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl py-24 px-4 md:px-6 flex justify-center">
        <div className="text-red-300 tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
          SCHEDULE ERROR: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl py-24 px-4 md:px-6">
      <div className="flex justify-center mb-10">
        <h2
          className="text-white text-5xl md:text-6xl tracking-widest uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "Street Flow NYC" }}
        >
          Schedule
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-center mb-10">
        <span
          className="text-white/80 text-xs md:text-sm tracking-widest uppercase"
          style={{ fontFamily: "Octin Spraypaint" }}
        >
          FILTER BY EVENT TYPE:
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          {EVENT_TYPES.map(({ id, label, bg, iconPath }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(activeFilter === id ? null : id)}
              style={{ backgroundColor: bg, fontFamily: "Octin Spraypaint" }}
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white text-xs font-medium tracking-widest uppercase
                transition-all duration-150 border border-white/20
                ${activeFilter === id ? "ring-2 ring-white/50 ring-offset-2 ring-offset-black" : ""}
              `}
            >
              <img
                src={iconPath}
                alt=""
                className="h-3.5 w-3.5"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <div className="rounded-[28px] border-2 border-white/25 bg-black/25 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.65)] overflow-hidden">
          <div
            className="px-6 py-4 border-b border-white/15 text-white text-lg tracking-widest uppercase bg-white/5"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            Saturday
          </div>
          <div className="divide-y divide-white/15">
            {filteredSaturday.length === 0 ? (
              <div className="px-6 py-8 text-white/60 text-sm tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
                No events for this filter
              </div>
            ) : (
              filteredSaturday.map((event) => (
                <div
                  key={event.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.0))]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium tracking-widest uppercase text-sm md:text-base" style={{ fontFamily: "Octin Spraypaint" }}>
                      {event.name}
                    </div>
                    <div className="text-white/60 text-xs md:text-sm mt-0.5 tracking-wide" style={{ fontFamily: "Octin Spraypaint" }}>
                      {event.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-white text-sm tracking-widest whitespace-nowrap" style={{ fontFamily: "Octin Spraypaint" }}>
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-white text-[10px] font-medium tracking-widest" style={{ backgroundColor: getTagBg(event.tag) }}>
                      <EventTypeIcon tag={event.tag} />
                      {event.tag}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[28px] border-2 border-white/25 bg-black/25 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.65)] overflow-hidden">
          <div
            className="px-6 py-4 border-b border-white/15 text-white text-lg tracking-widest uppercase bg-white/5"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            Sunday
          </div>
          <div className="divide-y divide-white/15">
            {filteredSunday.length === 0 ? (
              <div className="px-6 py-8 text-white/60 text-sm tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
                No events for this filter
              </div>
            ) : (
              filteredSunday.map((event) => (
                <div
                  key={event.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.0))]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium tracking-widest uppercase text-sm md:text-base" style={{ fontFamily: "Octin Spraypaint" }}>
                      {event.name}
                    </div>
                    <div className="text-white/60 text-xs md:text-sm mt-0.5 tracking-wide" style={{ fontFamily: "Octin Spraypaint" }}>
                      {event.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-white text-sm tracking-widest whitespace-nowrap" style={{ fontFamily: "Octin Spraypaint" }}>
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-white text-[10px] font-medium tracking-widest" style={{ backgroundColor: getTagBg(event.tag) }}>
                      <EventTypeIcon tag={event.tag} />
                      {event.tag}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
