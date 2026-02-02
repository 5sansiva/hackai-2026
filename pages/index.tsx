import React, { useState } from "react";
import Head from "next/head";
import Home from "./Home";
import About from "./About";
import Stats from "./Stats";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import TracksPage from "./Tracks";

export default function HackAIPage() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative">
      <Head>
        <title>HackAI</title>
        <link rel="icon" type="image/png" href="/hackai-logo.png" />
        <meta
          name="description"
          content="Welcome to HackAI: the biggest AI hackathon in North Texas!"
        />
      </Head>


      {loading && <Preloader onDone={() => setLoading(false)} />}

        <div className="relative">
          <div
            className="fixed inset-0 -z-10"
            style={{
              backgroundColor: "black",
              backgroundImage: "url(/mainbg.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          <Navbar />

          <main
            className={`relative pt-24 ${loading ? "pointer-events-none" : ""}`}
          >
            <section
              id="home"
              className="min-h-screen flex items-center justify-center"
            >
              <Home />
            </section>

            <section
              id="about"
              className="min-h-screen flex items-center justify-center"
            >
              <About />
            </section>

            <section
              id="stats"
              className="min-h-screen flex items-center justify-center m-6"
            >
              <Stats />
            </section>

            <section
              id="tracks"
              className="min-h-screen flex items-center justify-center m-6"
            >
              <TracksPage />
            </section>

          </main>
        </div>


      <Footer />
    </div>
  );
}
