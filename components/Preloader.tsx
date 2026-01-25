import React, { useRef } from "react";

type PreloaderProps = {
  onDone: () => void;
};

export default function Preloader({ onDone }: PreloaderProps) {
  const finishedRef = useRef(false);

  const finishOnce = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Lighting overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: "#000",
          mixBlendMode: "multiply",
          // Darkness fades out starting at 3s, taking 0.5s (ends at 3.5s)
          animation: "fadeOut 0.5s ease-out 3s forwards",
        }}
        onAnimationEnd={finishOnce} 
      >
        {/* Left Spotlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 10% 30%, #fff9c4 0%, transparent 40%)",
            opacity: 0,
            animation: "leftFlicker 0.8s steps(1) 0.3s",
          }}
        />

        {/* Right Spotlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 90% 30%, #fff9c4 0%, transparent 40%)",
            opacity: 0,
            animation: "rightFlicker 0.8s steps(1) 1.3s",
          }}
        />

        {/* Full Illumination */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, #ffffff 20%, transparent 120%)",
            opacity: 0,
            animation: "fullLight 0.7s steps(1) 2.3s forwards",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes leftFlicker {
          0% { opacity: 0; }
          5% { opacity: 1; }
          10% { opacity: 0; }
          15% { opacity: 0; }
          20% { opacity: 1; }
          25% { opacity: 0; }
          30% { opacity: 1; }
          35% { opacity: 1; }
          40% { opacity: 0; }
          45% { opacity: 0; }
          50% { opacity: 1; }
          55% { opacity: 0; }
          60% { opacity: 1; }
          65% { opacity: 0; }
          70% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes rightFlicker {
          0% { opacity: 0; }
          8% { opacity: 1; }
          12% { opacity: 0; }
          18% { opacity: 0; }
          22% { opacity: 1; }
          28% { opacity: 0; }
          32% { opacity: 1; }
          38% { opacity: 1; }
          42% { opacity: 0; }
          48% { opacity: 1; }
          52% { opacity: 0; }
          58% { opacity: 0; }
          62% { opacity: 1; }
          68% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes fullLight {
          0% { opacity: 0; }
          10% { opacity: 1; }
          15% { opacity: 0; }
          20% { opacity: 1; }
          25% { opacity: 0; }
          30% { opacity: 0; }
          35% { opacity: 1; }
          40% { opacity: 0; }
          45% { opacity: 1; }
          50% { opacity: 1; }
          55% { opacity: 0; }
          60% { opacity: 1; }
          100% { opacity: 1; }
        }

        @keyframes fadeOut {
          to { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  );
}
