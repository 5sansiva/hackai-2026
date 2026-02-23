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
      className="relative w-full py-24 flex flex-col items-center text-center 
      overflow-hidden"
      style={{
        backgroundImage: "url('/KeynoteSpeaker/bg-brick.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
    
      {/*Graffiti Background*/}    
      <div
        className="absolute inset-0" 
        style={{
          backgroundImage: "url('/KeynoteSpeaker/bg-graffiti.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/4" />

      {/*light overlay*/}
      <div
      style={{
        backgroundImage: "url('/KeynoteSpeaker/light.svg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
      className="absolute inset-0"
      />

      {/* background graffiti text */}
      <h2 className="absolute 
          left-0 
          top-1/4
          rotate-[-16deg] 
          text-7xl 
          sm:text-8xl 
          md:text-9xl 
          pointer-events-none
          min-w-80
          opacity-60"
        style={{color: "rgba(25,29,35,0.65)", 
          WebkitTextStrokeWidth: "14px",
          WebkitTextStrokeColor: "rgba(152,152,152,0.30)", 
          fontFamily: "Super Feel", 
          paintOrder: "stroke", 
        }}
      >
        dig deep
      </h2>

      <h2 className="absolute 
        top-2/3
        right-0
        text-7xl
        sm:text-8xl
        md:text-9xl
        min-w-80
        text-right
        "
        style={{
        color: "rgba(42,42,42,0.75)", 
        textAlign: "right", 
        WebkitTextStrokeWidth: "8px",
        WebkitTextStrokeColor: "rgba(10,10,10, 0.6)", 
        fontFamily: "Super Feel", 
        fontWeight: "400"
      }}
        >
        ai is cool
      </h2>
     
     
      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col items-center gap-8">

        {/* Title */}
        <div className="relative
          inline-block
          text-5xl 
          sm:text-6xl 
          md:text-6xl"
        >

          <h2 className="relative"
            style={{ 
            color: "#010D48", 
            fontFamily: "Street Flow NYC", 
            WebkitTextStrokeWidth: "3px", 
            WebkitTextStrokeColor: "white", 
            letterSpacing: "3px",
            paintOrder: "stroke"
            }}
          >
            Keynote Speaker
          </h2>

          {/* <img
            src="/KeynoteSpeaker/crown.svg"
            alt="crown"
            className="absolute -top-20 -left-10"
          />

          <img 
            src="/KeynoteSpeaker/exclamation.svg" 
            alt="!" 
            className="absolute top-1/2 -right-11 -translate-y-1/2" 
          />       */}

          

        </div>

        {/* Speaker Image */}
        <div className="relative mb-8">
          <div className="w-48 h-55 sm:w-55 sm:h-60 md:w-65 md:h-72 rounded-full overflow-hidden">
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name & Description*/}
        <div className="flex flex-col">
          
          {/*Name*/}
          <h3 
            className="text-3xl sm:text-4xl md:text-5xl text-white"
            style={{ 
            WebkitTextStrokeWidth: "6px", 
            WebkitTextStrokeColor: "#010D48", 
            paintOrder: "stroke",  
            fontFamily: "Octin Spraypaint",  
            letterSpacing: "2px",
            }}
          >
            {speaker.name}
          </h3>
            
          {/*Description*/}
          <p className="text-lg sm:text-xl text-white max-w-2xl"
            style={{ 
              WebkitTextStrokeWidth: "6px", 
              WebkitTextStrokeColor: "#010D48", 
              paintOrder: "stroke",  
              fontFamily: "Octin Spraypaint",  
              letterSpacing: "2px"
            }}
          >
            {speaker.description}
          </p>
      
        </div>
          
      </div>
    </section>
  );
}