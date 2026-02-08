"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const NAV = [
    { label: "HOME", id: "home" },
    { label: "ABOUT", id: "about" },
    { label: "STATS", id: "stats" },
    { label: "FAQS", id: "faqs" },
  ];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 110; 
    window.scrollTo({ top: y, behavior: "smooth" });
  };


  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

 
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto mt-4 w-[min(1100px,calc(100%-2rem))] rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="#home" className="relative h-10 w-24">
              <Image
                src="/Home/hackAiLogo.svg"
                alt="HackAI"
                fill
                className="object-contain"
                priority
              />
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  scrollToId(item.id);
                  setOpen(false);
                }}
                className="
                  group w-full text-left
                  rounded-xl px-4 py-3
                  text-white/90 text-base tracking-widest uppercase
                  transition-all duration-150 ease-out
                  hover:text-white
                  hover:bg-white/10
                  hover:shadow-[0_0_18px_rgba(91,227,255,0.35)]
                  hover:-translate-y-[1px]
                  active:translate-y-0
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5be3ff]/70
                "
                style={{ fontFamily: "Street Flow NYC" }}
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  
                </span>
              </button>
            ))}

          </div>

          <div className="flex items-center gap-4">
            {/* Desktop socials */}
            <div className="hidden sm:flex items-center gap-4">
              <button onClick={() => window.open("https://www.instagram.com/utdais/", "_blank")}>
                <img src="Logos/instagram.png" className="h-[1.5rem] object-contain" alt="Instagram" />
              </button>
              <button onClick={() => window.open("https://discord.gg/756atmKkAq", "_blank")}>
                <img src="Logos/discord.png" className="h-[1.5rem] object-contain" alt="YouTube" />
              </button>
              <button onClick={() => window.open("https://www.linkedin.com/company/ais-utd", "_blank")}>
                <img src="Logos/linkedin.png" className="h-[1.5rem] object-contain" alt="LinkedIn" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
              aria-expanded={open}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white/90 hover:text-white"
            >
              <span className="relative block h-5 w-5">
                <span
                  className={`absolute left-0 top-1 block h-[2px] w-5 bg-current transition-transform duration-200 ${
                    open ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-2.5 block h-[2px] w-5 bg-current transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 block h-[2px] w-5 bg-current transition-transform duration-200 ${
                    open ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div className="md:hidden mx-auto w-[min(1100px,calc(100%-2rem))]">
        <div
          className={`mt-3 overflow-hidden rounded-3xl bg-black/50 backdrop-blur-md border border-white/15 transition-all duration-200 ${
            open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-5 flex flex-col gap-4">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  scrollToId(item.id);
                  setOpen(false);
                }}
                className="text-left text-white/90 hover:text-white transition-colors text-base tracking-widest uppercase"
                style={{ fontFamily: "Street Flow NYC" }}
              >
                {item.label}
              </button>
            ))}

            {/* Socials for mobile (optional) */}
            <div className="pt-2 flex items-center gap-4 sm:hidden">
               <button onClick={() => window.open("https://www.instagram.com/utdais/", "_blank")}>
                <img src="Logos/instagram.png" className="h-[1.5rem] object-contain" alt="Instagram" />
              </button>
              <button onClick={() => window.open("https://discord.gg/756atmKkAq", "_blank")}>
                <img src="Logos/discord.png" className="h-[1.5rem] object-contain" alt="YouTube" />
              </button>
              <button onClick={() => window.open("https://www.linkedin.com/company/ais-utd", "_blank")}>
                <img src="Logos/linkedin.png" className="h-[1.5rem] object-contain" alt="LinkedIn" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* click outside backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/30"
          style={{ zIndex: -1 }}
        />
      )}
    </header>
  );
};

export default Navbar;
