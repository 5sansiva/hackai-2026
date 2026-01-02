import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto mt-4 w-[min(1100px,calc(100%-2rem))] rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="relative h-10 w-24">
              <Image
                src="/Home/hackAiLogo.svg"
                alt="HackAI"
                fill
                className="object-contain"
                priority
              />
            </a>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {["ABOUT"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-white/90 hover:text-white transition-colors text-sm tracking-widest uppercase"
                style={{ fontFamily: "Street Flow NYC" }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
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
      </nav>
    </header>
  );
};

export default Navbar;
