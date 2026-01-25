"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const NAV = [
    { label: "HOME", id: "home" },
    { label: "ABOUT", id: "about" },
    { label: "STATS", id: "stats" },
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
                className="text-white/90 hover:text-white transition-colors text-sm tracking-widest uppercase"
                style={{ fontFamily: "Street Flow NYC" }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop socials */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/utdais/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/3VSEQv7ncR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="Discord"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4.6A16.4 16.4 0 0 0 16 3l-.5 1a14.7 14.7 0 0 1 3.4 1.6c-3-1.4-6-1.4-9 0A14.7 14.7 0 0 1 13.3 4L12.8 3A16.4 16.4 0 0 0 8 4.6C5.9 7.8 5.3 11 5.5 14.2c1.4 1 2.9 1.7 4.6 2.2l.6-1.1a9 9 0 0 1-1.4-.7l.3-.2c2.7 1.3 5.5 1.3 8.2 0l.3.2c-.4.3-.9.5-1.4.7l.6 1.1c1.7-.5 3.2-1.2 4.6-2.2.3-3.5-.4-6.7-2.5-9.6ZM9.7 13.1c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.7 0 1.2.6 1.2 1.3s-.5 1.3-1.2 1.3Zm4.6 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.7 0 1.2.6 1.2 1.3s-.5 1.3-1.2 1.3Z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/ais-utd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-1 7h2v11H3V10Zm6 0h2v2c.6-1.2 1.8-2.2 3.7-2.2 2.6 0 4.3 1.7 4.3 5v6.2h-2v-6c0-2-.8-3.2-2.5-3.2-1.8 0-2.8 1.2-2.8 3.2v6H9V10Z" />
                </svg>
              </a>
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
              <a
                href="https://www.instagram.com/utdais/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/3VSEQv7ncR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="Discord"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4.6A16.4 16.4 0 0 0 16 3l-.5 1a14.7 14.7 0 0 1 3.4 1.6c-3-1.4-6-1.4-9 0A14.7 14.7 0 0 1 13.3 4L12.8 3A16.4 16.4 0 0 0 8 4.6C5.9 7.8 5.3 11 5.5 14.2c1.4 1 2.9 1.7 4.6 2.2l.6-1.1a9 9 0 0 1-1.4-.7l.3-.2c2.7 1.3 5.5 1.3 8.2 0l.3.2c-.4.3-.9.5-1.4.7l.6 1.1c1.7-.5 3.2-1.2 4.6-2.2.3-3.5-.4-6.7-2.5-9.6ZM9.7 13.1c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.7 0 1.2.6 1.2 1.3s-.5 1.3-1.2 1.3Zm4.6 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.7 0 1.2.6 1.2 1.3s-.5 1.3-1.2 1.3Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/ais-utd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-1 7h2v11H3V10Zm6 0h2v2c.6-1.2 1.8-2.2 3.7-2.2 2.6 0 4.3 1.7 4.3 5v6.2h-2v-6c0-2-.8-3.2-2.5-3.2-1.8 0-2.8 1.2-2.8 3.2v6H9V10Z" />
                </svg>
              </a>
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
