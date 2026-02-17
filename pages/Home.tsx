import React from 'react';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="flex items-center w-full justify-center h-full">
            <div className="relative w-full max-w-[1600px] h-[90vh] max-h-[900px]">
                
               
                <div
                    className="absolute left-1/2 top-[21%] -translate-x-1/2 z-30 text-center text-white text-lg md:text-2xl leading-tight drop-shadow-[0_3px_0_rgba(0,0,0,0.9)] uppercase tracking-widest"
                    style={{ fontFamily: "Street Flow NYC", WebkitTextStroke: "1px black" }}
                >
                    Artificial Intelligence Society Presents
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
                src="/Home/hackAiLogoWhite.png"
                alt="hackAi Logo"
                width={1000}
                height={1000}
                className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                />

                
                <div
                    className="absolute left-1/2 top-[66%] -translate-x-1/2 z-30 text-center text-white text-2xl md:text-4xl drop-shadow-[0_4px_0_rgba(0,0,0,0.9)] uppercase tracking-widest mt-12"
                    style={{ fontFamily: "Street Flow NYC", WebkitTextStroke: "2px black" }}
                    >
                        March 7-8, 2026
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