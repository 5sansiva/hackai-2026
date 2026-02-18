import React from 'react';
import Image from 'next/image';
import SprayHeroGroup from '@/components/SprayCanvasOverlay';

export default function Home() {
    return (
        <div className="flex items-center w-full justify-center h-full">
            <div className="relative w-full max-w-[1600px] h-[90vh] max-h-[900px]">
                
               
                

                <SprayHeroGroup className="absolute inset-0 z-20" />

                
                
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

                 <div className="
                        absolute z-30
                        right-3 bottom-4
                        w-[150px]
                        sm:right-6 sm:bottom-6 sm:w-[190px]
                        md:right-10 md:bottom-10 md:w-[260px]
                        lg:w-[300px]
                        pointer-events-none
                    "
                    >
                    <div className="relative w-full aspect-square rotate-[20deg] origin-center">
                        <Image
                        src="/Home/heart.svg"
                        alt="Heart"
                        fill
                        className="object-contain"
                        priority
                        />
                        <div className="absolute inset-0 flex items-center justify-center px-5 sm:px-7 md:px-8 text-center">
                        <p
                            className="
                            text-white
                            text-sm sm:text-base md:text-xl lg:text-2xl
                            leading-tight
                            drop-shadow-[0_3px_0_rgba(0,0,0,0.85)]
                            "
                            style={{ fontFamily: "Octin Spraypaint", WebkitTextStroke: "0.5px black" }}
                        >
                            Apps close on <span className="text-pink-300">Feb 24th</span>
                        </p>
                        </div>
                        </div>
                </div>       
            </div>
        </div>
      
    );
}