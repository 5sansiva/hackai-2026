import React from "react";
import Image from "next/image";

type FooterProps = {
  hackAiLogoSrc?: string;
  aisLogoSrc?: string;
  emailHref?: string;
  instagramHref?: string;
  youtubeHref?: string;
  linkedinHref?: string;
  discordHref?: string;
};

const Footer = ({
  hackAiLogoSrc = "/footer/hackaiyellow.svg",
  aisLogoSrc = "/footer/AISLogo.svg",
  instagramHref = "https://www.instagram.com/utdais/",
  linkedinHref = "https://www.linkedin.com/company/ais-utd/",
  discordHref = "https://discord.gg/3VSEQv7ncR",
}: FooterProps) => {
  return (
    <footer className="w-full bg-[#14181d] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-16 w-56 md:h-20 md:w-72">
            <Image
              src={hackAiLogoSrc}
              alt="HackAI"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div
            className="mt-6 text-base md:text-lg leading-tight text-white/90"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            <div className="text-white/80">an initiative by</div>
            <div className="text-white">artificial intelligence society @ utd</div>
          </div>
        </div>

        <div className="relative mt-14">
          <div className="h-[2px] w-full bg-white/90" />

          <div
            className="absolute right-0 -top-10 hidden md:block text-right text-xs text-white/90"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            <div className="rotate-[-6deg] leading-tight">
              make sure to join our discord for
              <br />
              updates!!
            </div>
            <div className="mt-1 flex justify-end">
              <svg width="88" height="24" viewBox="0 0 88 24" fill="none" className="text-white/90">
                <path
                  d="M2 6 C14 2, 22 18, 34 14 C45 10, 52 2, 64 6 C76 10, 80 20, 86 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M78 18 L86 18 L82 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6 md:grid md:grid-cols-3 md:items-center">
          <div className="flex items-center gap-3 md:justify-self-start">
            <div className="relative h-10 w-10">
              <Image src={aisLogoSrc} alt="AIS" fill className="object-contain" />
            </div>
            <div
              className="text-xs leading-tight text-white/90"
              style={{ fontFamily: "Octin Spraypaint" }}
            >
              <div>ARTIFICIAL</div>
              <div>INTELLIGENCE</div>
              <div>SOCIETY</div>
            </div>
          </div>

          <div
            className="text-sm md:text-base text-white/90 text-center md:justify-self-center"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            see you at the hackathon :)
          </div>

          <div className="flex items-center gap-4 md:justify-self-end">

            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
              </svg>
            </a>

            {/* <a
              href={youtubeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <svg width="36" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31.4 31.4 0 0 0 2 12s.1 3.1.4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.3-1.7.4-4.8.4-4.8s0-3.1-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
              </svg>
            </a> */}

            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-1 7h2v11H3V10Zm6 0h2v2c.6-1.2 1.8-2.2 3.7-2.2 2.6 0 4.3 1.7 4.3 5v6.2h-2v-6c0-2-.8-3.2-2.5-3.2-1.8 0-2.8 1.2-2.8 3.2v6H9V10Z" />
              </svg>
            </a>

            <a
              href={discordHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Discord"
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4.6A16.4 16.4 0 0 0 16 3l-.5 1a14.7 14.7 0 0 1 3.4 1.6c-3-1.4-6-1.4-9 0A14.7 14.7 0 0 1 13.3 4L12.8 3A16.4 16.4 0 0 0 8 4.6C5.9 7.8 5.3 11 5.5 14.2c1.4 1 2.9 1.7 4.6 2.2l.6-1.1a9 9 0 0 1-1.4-.7l.3-.2c2.7 1.3 5.5 1.3 8.2 0l.3.2c-.4.3-.9.5-1.4.7l.6 1.1c1.7-.5 3.2-1.2 4.6-2.2.3-3.5-.4-6.7-2.5-9.6ZM9.7 13.1c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.7 0 1.2.6 1.2 1.3s-.5 1.3-1.2 1.3Zm4.6 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.7 0 1.2.6 1.2 1.3s-.5 1.3-1.2 1.3Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
