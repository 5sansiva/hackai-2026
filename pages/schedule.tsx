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

const EVENT_TYPES: { id: EventType; label: string; tagImagePath: string }[] = [
  { id: "MANDATORY", label: "MANDATORY", tagImagePath: "/schedule/tags/mandatory.png" },
  { id: "FOOD",      label: "FOOD",      tagImagePath: "/schedule/tags/food.png" },
  { id: "FUN",       label: "FUN",       tagImagePath: "/schedule/tags/fun.png" },
  { id: "WORKSHOP",  label: "WORKSHOP",  tagImagePath: "/schedule/tags/workshop.png" },
  { id: "SUPPORT",   label: "SUPPORT",   tagImagePath: "/schedule/tags/support.png" },
];

function getTagImagePath(tag: EventType): string {
  const t = EVENT_TYPES.find((e) => e.id === tag);
  return t ? t.tagImagePath : EVENT_TYPES[3].tagImagePath;
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
        const rows: ScheduleEvent[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          const location = String(data.location ?? data.room ?? "");
          const rawTag = String(data.tag ?? data.eventType ?? "")
            .trim()
            .toUpperCase() as EventType;
          const tag: EventType = validTags.includes(rawTag) ? rawTag : "WORKSHOP";
          const rawDay = (data.day as string) ?? "saturday";
          const day: "saturday" | "sunday" = rawDay === "sunday" ? "sunday" : "saturday";
          return {
            id: d.id,
            name: String(data.name ?? ""),
            location,
            time: String(data.time ?? ""),
            tag,
            day,
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
      <div className="w-full py-24 px-4 md:px-6 flex justify-center">
        <div className="text-white font-bold text-xs md:text-sm tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-24 px-4 md:px-6 flex justify-center">
        <div className="text-red-300 tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
          SCHEDULE ERROR: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-[135vh] pt-16 pb-40 px-4 md:px-6"
      style={{
        backgroundImage: "url('/schedule/bg.svg')",
        backgroundSize: "100% auto",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        overflowX: "hidden",
      }}
    >
      {/* Dice doodle */}
      {/* Guitar doodle */}
      <img
        src="/schedule/doodles/guitar.png"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none select-none object-contain absolute bottom-[20%] left-[40%] w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 opacity-90"
      />

      <div className="relative z-10 w-full max-w-[90vw] mx-auto">
        {/* Title */}
        <div className="flex justify-center mb-10">
          <h2
            className="text-white text-5xl md:text-6xl tracking-widest uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "Street Flow NYC" }}
          >
            Schedule
          </h2>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 justify-center mb-10">
          <span
            className="text-white/80 text-xs md:text-sm tracking-widest uppercase"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            FILTER BY EVENT TYPE:
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            {EVENT_TYPES.map(({ id, tagImagePath }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFilter(activeFilter === id ? null : id)}
                className={
                  activeFilter === id
                    ? "inline-flex items-center justify-center rounded-lg transition-all duration-150 border-2 border-transparent ring-2 ring-white/60 ring-offset-2 ring-offset-black opacity-100"
                    : "inline-flex items-center justify-center rounded-lg transition-all duration-150 border-2 border-transparent opacity-70 hover:opacity-90"
                }
              >
                <img
                  src={tagImagePath}
                  alt={id}
                  className="h-10 md:h-11 w-auto object-contain"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Saturday / Sunday grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* SATURDAY COLUMN */}
          <div className="rounded-[28px] border-2 border-white/25 bg-black/25 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.65)] overflow-hidden min-h-[260px]">
            <div
              className="px-6 py-4 border-b border-white/15 text-white text-lg tracking-widest uppercase bg-white/5"
              style={{ fontFamily: "Octin Spraypaint" }}
            >
              Saturday
            </div>
            <div className="divide-y divide-white/15 h-full">
              {filteredSaturday.length === 0 ? (
                <div className="px-6 py-8 text-white/60 text-sm tracking-widest uppercase text-center" style={{ fontFamily: "Octin Spraypaint" }}>
                  No events for this filter
                </div>
              ) : (
                filteredSaturday.map((event) => (
                  <div
                    key={event.id}
                    className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.0))]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold tracking-widest uppercase text-base md:text-lg" style={{ fontFamily: "Octin Spraypaint" }}>
                        {event.name}
                      </div>
                      <div className="text-white/80 text-xs md:text-sm mt-1 tracking-wide" style={{ fontFamily: "Octin Spraypaint" }}>
                        {event.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-white text-sm md:text-base tracking-widest whitespace-nowrap" style={{ fontFamily: "Octin Spraypaint" }}>
                        {event.time}
                      </span>
                      <span className="inline-flex items-center shrink-0">
                        <img
                          src={getTagImagePath(event.tag)}
                          alt={event.tag}
                          className="h-7 md:h-8 w-auto object-contain"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SUNDAY COLUMN */}
          <div className="rounded-[28px] border-2 border-white/25 bg-black/25 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.65)] overflow-hidden min-h-[260px]">
            <div
              className="px-6 py-4 border-b border-white/15 text-white text-lg tracking-widest uppercase bg-white/5"
              style={{ fontFamily: "Octin Spraypaint" }}
            >
              Sunday
            </div>
            <div className="divide-y divide-white/15 h-full">
              {filteredSunday.length === 0 ? (
                <div className="px-6 py-8 text-white/60 text-sm tracking-widests uppercase text-center" style={{ fontFamily: "Octin Spraypaint" }}>
                  No events for this filter
                </div>
              ) : (
                filteredSunday.map((event) => (
                  <div
                    key={event.id}
                    className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.0))]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold tracking-widest uppercase text-base md:text-lg" style={{ fontFamily: "Octin Spraypaint" }}>
                        {event.name}
                      </div>
                      <div className="text-white/80 text-xs md:text-sm mt-1 tracking-wide" style={{ fontFamily: "Octin Spraypaint" }}>
                        {event.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-white text-sm md:text-base tracking-widest whitespace-nowrap" style={{ fontFamily: "Octin Spraypaint" }}>
                        {event.time}
                      </span>
                      <span className="inline-flex items-center shrink-0">
                        <img
                          src={getTagImagePath(event.tag)}
                          alt={event.tag}
                          className="h-7 md:h-8 w-auto object-contain"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}