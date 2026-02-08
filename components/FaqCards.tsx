"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/clientApp"; // <-- adjust to your actual firebase client file

type FAQ = { id: string; question: string; answer: string };

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("FAQSection render ✅");

  useEffect(() => {
    console.log("FAQ useEffect start ✅");

    const unsub = onSnapshot(
      collection(db, "faqs"),
      (snap) => {
        console.log("Project ID from client:", (db as any)?._app?.options?.projectId);
        console.log("FAQ snapshot size:", snap.size);
        console.log("First doc data:", snap.docs[0]?.data());


        const rows = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            question: String(data.question ?? ""),
            answer: String(data.answer ?? ""),
          };
        });

        setFaqs(rows.filter((x) => x.question && x.answer));
        setLoading(false);
      },
      (err) => {
        console.error("FAQ snapshot error ❌", err);
        setError(err?.message ?? "Failed to load FAQs");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="text-white" style={{ fontFamily: "Octin Spraypaint" }}>
        LOADING...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-300">
        FAQ ERROR: {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl py-24">
      <div className="flex justify-center">
        <h2
          className="text-white text-5xl md:text-6xl tracking-widest uppercase"
          style={{ fontFamily: "Street Flow NYC" }}
        >
          FAQS
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {faqs.map((f) => {
          const isOpen = openId === f.id;
          return (
            <div key={f.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => setOpenId((prev) => (prev === f.id ? null : f.id))}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/10 transition-colors"
              >
                <span className="text-white/90 tracking-widest uppercase" style={{ fontFamily: "Octin Spraypaint" }}>
                  {f.question}
                </span>
                <span className={`h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#5aa9ff] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden transition-[max-height,opacity] duration-200`}>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/25 px-5 py-4 flex flex-col">
                  <p className="text-white/85 leading-relaxed" style={{ fontFamily: "Octin Spraypaint" }}>
                    {f.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
