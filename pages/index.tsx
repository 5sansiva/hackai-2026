import React from 'react'
import Head from 'next/head';
import Home from './Home';
import About from './About';
import Stats from './Stats';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HackAIPage() {
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
        <main className="relative pt-24">
          <section className="min-h-screenflex items-center justify-center ">
            <Home />
          </section>

          <section className="min-h-screen flex items-center justify-center ">
            <About />
          </section>

          {/* <section className="min-h-screen flex items-center justify-center ">
            <Stats />
          </section> */}
        </main>
      </div>
      
      <Footer />
    
    
    </div>
  );
}


