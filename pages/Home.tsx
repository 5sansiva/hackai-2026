import React from 'react';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="flex items-center w-full justify-center h-full">
            <div className="relative w-full max-w-[1600px] h-[90vh] max-h-[900px]">
                
                <div className="absolute left-1/2 top-[23%] -translate-x-1/2 z-30 text-center">
                    <div
                        className="text-white text-lg md:text-2xl leading-tight drop-shadow-[0_3px_0_rgba(0,0,0,0.9)] uppercase tracking-widest"
                        style={{ fontFamily: "Street Flow NYC" }}
                    >
                        Artificial Intelligence Society Presents
                    </div>
                </div>

                <Image
                src="/Home/graffitti.svg"
                alt="Graffitti outer"
                fill
                className="object-contain"
                priority
                />

                
                <Image
                src="/Home/splatters.svg"
                alt="Graffitti inner"
                fill
                className="object-contain pointer-events-none"
                style={{
                    transform: "translateX(clamp(-160px, -8vw, -20px)) translateY(clamp(6px, 1vw, 18px))",
                    transformOrigin: "center",
                }}
                priority
                />

               <Image
                src="/Home/hackAiLogo.svg"
                alt="hackAi Logo"
                width={1200}
                height={1200}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                />

                <div className="absolute left-1/2 top-[66%] -translate-x-1/2 z-30 text-center">
                    <div
                        className="text-white text-2xl md:text-4xl drop-shadow-[0_4px_0_rgba(0,0,0,0.9)] uppercase tracking-widest mt-12"
                        style={{ fontFamily: "Street Flow NYC" }}
                    >
                        March 7-8, 2026
                    </div>
                </div>
                
                <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 z-30 flex gap-6">
                    {/* <button
                    className="
                    inline-flex items-center justify-center
                    px-6 py-2.5 md:px-7 md:py-3
                    rounded-full
                    bg-[#043335]
                    text-[#b7d3df] text-base md:text-xl
                    tracking-widest
                    ring-5 ring-black
                    shadow-[inset_0_0_0_3.5px_rgba(255,255,255,0.08),0_7px_0_0_rgba(0,0,0,0.55)]
                    hover:-translate-y-0.5 active:translate-y-0
                    transition-transform duration-150
                    "
                    >
                        HACKERPACK
                    </button> */}

                    <button
                        type="button"
                        onClick={() => window.open("https://coda.io/form/Hack-AI-2026_dlNfpT9nhkE", "_blank")}
                        className="
                        relative isolate inline-flex items-center justify-center
                        px-6 py-2.5 md:px-7 md:py-3 rounded-full
                        bg-[#043335] text-[#b7d3df] text-base md:text-xl tracking-widest
                        ring-5 ring-black
                        shadow-[inset_0_0_0_3.5px_rgba(255,255,255,0.08),0_7px_0_0_rgba(0,0,0,0.55)]
                        transform-gpu will-change-transform
                        transition-transform duration-75 ease-out
                        hover:-translate-y-0.5 active:translate-y-0

                        after:content-[''] after:absolute after:inset-[-8px] after:-z-10 after:rounded-full
                        after:opacity-0 hover:after:opacity-100
                        after:transition-opacity after:duration-75 after:ease-linear
                        after:bg-[radial-gradient(circle,rgba(91,227,255,0.55),transparent_60%)]
                    "

                        style={{ fontFamily: "Octin Spraypaint" }}
                    >
                        APPLY NOW!
                    </button>
                </div>

                
            </div>
        </div>
      
    );
}