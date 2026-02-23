import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Home from "./Home";
import About from "./About";
import Stats from "./Stats";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TracksPage from "./Tracks";
import ScheduleSection from "./schedule";
import SponsorsSection from "./Sponsors";
import FAQSection from "@/components/FaqCards";
import Countdown from "./countdown";
import Donors from "./Donors";
import KeynoteSpeaker from "@/components/KeynoteSpeaker";

export default function HackAIPage() {

  return (
    <div className="relative">
      <Head> 
        <title>HackAI</title> 
        <link rel="icon" type="image/png" href="/hackai-logo.png" /> 
        <meta name="description" content="Welcome to HackAI: the biggest AI hackathon in North Texas!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Background always visible so the lighting has something to reveal */}
      <div className="fixed inset-0 -z-10 bg-black">
        <img
          src="/mainbg.svg"
          alt="Main background"
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -10,
          }}
          loading="eager"
        />
      </div>
      
      {/* Desktop MLH (not fixed) */}
        <div className="hidden md:block relative">
          <a
            id="mlh-trust-badge-desktop"
            className="absolute right-6 -top-2 z-20 block w-[110px]"
            href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=black"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-black.svg"
              alt="Major League Hacking 2026 Hackathon Season"
              className="w-full h-auto"
            />
          </a>
        </div>




      {/* Rest of the content */}
      <div className="relative">
        <Navbar />
        

        {/* Mobile MLH spacer (reserves vertical space below fixed navbar) */}
        <div className="md:hidden h-22" />

        {/* Mobile MLH badge (not fixed) */}
        <div className="md:hidden w-full flex justify-end pr-4 -mt-22 pt-4 pb-2">
          <a
            id="mlh-trust-badge-mobile"
            className="block w-16 sm:w-18"
            href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=black"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-black.svg"
              alt="Major League Hacking 2026 Hackathon Season"
              className="w-full h-auto"
            />
          </a>
        </div>



        <main className="relative pt-24">
          <section id="home" className="min-h-screen flex items-center justify-center pt-12">
            <Home />
          </section>
          
          <section id="about" className="min-h-screen flex items-center justify-center">
            <About />
          </section>

            <section
              id="stats"
              className="min-h-screen flex items-center justify-center "
            >
              <Stats />
            </section>
          <section
              id="countdown"
              className="min-h-screen flex items-center justify-center"
          >
            <Countdown
              /*leftGraffitiSrc="/Countdown/bunny.svg"
              rightGraffitiSrc="/Countdown/target.svg" */
              frameSrc="/Countdown/countdownBg.svg"
            />

          </section>
           

          <section
            id="donors"
            className="min-h-screen flex items-center justify-center"
          >
            <Donors />
          </section>

            

            {/* <section
              id="schedule"
              className="min-h-screen flex items-center justify-center m-6"
            >
              <ScheduleSection />
            </section> */}

            <section
              id="faqs"
              className="min-h-screen flex items-center justify-center m-2"
            >
              <FAQSection />

              
            </section>
            
            <section
              id="keynote"
            >
              <KeynoteSpeaker />
            </section>
            

        </main>

        {/* Sponsors: its own full-width block, visually separate from main content and footer
        <section id="sponsors">
          <SponsorsSection />
        </section> */}

        <Footer />
      </div>
    </div>
  );
}