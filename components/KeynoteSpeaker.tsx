"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

type speaker = {
    id: string;
    name: string;
    description: string;
    image: string;
};

export default function KeynoteSpeaker() {
    const [speaker, setSpeaker] = useState<speaker | null>(null);

useEffect(() => {
  const unsub = onSnapshot(
    collection(db, "keynote"),
    (snap) => {
      console.log("Speakers snapshot size:", snap.size);
      console.log("First speaker:", snap.docs[0]?.data());
      console.log("Project ID from client:", (db as any)?._app?.options?.projectId);
        console.log("FAQ snapshot size:", snap.size);
          console.log("First doc data:", snap.docs[0]?.data());

      if (snap.docs.length > 0) {
        const data = snap.docs[0].data();
        setSpeaker({
          id: snap.docs[0].id,
          name: data.name ?? "",
          description: data.description ?? "",
          image: data.image ?? "",
        });
      }
    },
    (err) => {
      console.error("Speakers error:", err);
    }
  );

  return () => unsub();
}, []);

if (!speaker) {
  return <div className="text-white">Loading speaker...</div>;
}

  return (
    <section
      className="relative w-full min-h-[720px] flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage: "url('/KeynoteSpeaker/bg-brick.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
    
    {/*bg graffiti with text*/}    
    <div 
    style={{backgroundImage: "url('/KeynoteSpeaker/bg-graffiti.svg')",
            backgroundPosition: "center",
    }}
    className="absolute inset-0 h-full w-full overflow-hidden"
    >

        <h2 style={{color: "rgba(25,29,35,0.65)", textAlign: "left", WebkitTextStrokeWidth: "14px",
                    WebkitTextStrokeColor: "rgba(152,152,152,0.30)", fontFamily: "Super Feel", fontSize: "157px",
                    fontWeight: "400", paintOrder: "stroke", width: "735px",     // Moved to style
            height: "308px",    // Moved to style
            transform: "rotate(-16deg)", // Native CSS rotation
            position: "absolute",
            top: "140px"
        }}
        className="">
            dig deep

        </h2>

        <h2 style={{color: "rgba(42,42,42,0.75)", textAlign: "right", WebkitTextStrokeWidth: "13px",
                    WebkitTextStrokeColor: "#0A0A0A", fontFamily: "Super Feel", fontSize: "128px",
                    fontWeight: "400",  width: "776px",     // Moved to style
            height: "130px",    // Moved to style
            position: "absolute",
            bottom: "175px",
            right: "20px"
        }}
        className="flex flex-col justify-right mt-10 w-194 h-23 text-right">
            ai is cool

        </h2>

    {/*light overlay*/}
    <div
    style={{backgroundImage: "url('/KeynoteSpeaker/light.svg')",
            backgroundPosition: "center"
    }}
    className="absolute inset-0">
       
        
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/4" />

      
      {/* Content wrapper */}
      <div className="relative mt-10 z-10 flex flex-col items-center px-4">
        
        {/* Title */}
        <div className="relative mt-12 inline-block">
          <h2 style={{ color: "#010D48", fontFamily: "Street Flow NYC", WebkitTextStrokeWidth: "5px", 
          WebkitTextStrokeColor: "white", fontWeight: "400", fontSize: "64px", letterSpacing: "3.2px",
          textAlign: "center", paintOrder: "stroke"}}
          >
            Keynote Speaker
          </h2>
        <img
            src="/KeynoteSpeaker/crown.svg"
            alt="crown"
            className="absolute"
            style={{
                top: "-64px",         
                left: "-40px"
        }}
  />
        <img 
          src="/KeynoteSpeaker/exclamation.svg" 
          alt="!" 
          className="absolute" 
          style={{
                top: "-30px",         
                right: "-50px"
            }}
        />

        </div>

        {/* Speaker Image */}
        <div className="relative mb-8">
          <div className="w-65 h-83 rounded-full overflow-hidden border-blue-900">
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name & Description*/}
        <h3 style={{color: "white", textAlign: "center", WebkitTextStrokeWidth: "6px", WebkitTextStrokeColor: "#010D48", 
            paintOrder: "stroke", fontSize: "48px", fontFamily: "Octin Spraypaint", fontWeight: "400", letterSpacing: "2.4px",
            lineHeight: "normal"}}
        >
          {speaker.name}
          <p style={{fontSize: "36px", letterSpacing: "1.8px"}}
          >
            {speaker.description}
        </p>
        </h3>

      </div>
      </div>
      </div>
    </section>
  );
}