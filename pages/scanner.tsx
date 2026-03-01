import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FaQrcode, FaHistory, FaCamera, FaStop } from "react-icons/fa";
import { db } from "@/firebase/clientApp";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

type ScanMode =
  | "check-in"
  | "saturday-lunch"
  | "sunday-lunch"
  | "dinner"
  | "breakfast";

type ScanRecord = {
  id: string;
  mode: ScanMode;
  value: string;
  createdAt: string;
};

type ScanStatus = {
  tone: "success" | "error" | "info";
  text: string;
};

type DetectedCode = { rawValue?: string };
type QRDetector = {
  detect: (source: HTMLCanvasElement) => Promise<DetectedCode[]>;
};
type QRDetectorConstructor = new (opts?: { formats?: string[] }) => QRDetector;

const SCAN_STORAGE_KEY = "hackai_scanner_records";
const HACKERS_COLLECTION = "testHackers";
const MODE_TO_HACKER_FIELD: Record<ScanMode, string> = {
  "check-in": "isCheckedIn",
  "saturday-lunch": "lunch1",
  "sunday-lunch": "lunch2",
  dinner: "dinner",
  breakfast: "breakfast",
};

const SCAN_MODES: { value: ScanMode; label: string; help: string }[] = [
  { value: "check-in", label: "Check In", help: "Use for event check in." },
  { value: "saturday-lunch", label: "Saturday-Lunch", help: "Use for Saturday lunch distribution." },
  { value: "sunday-lunch", label: "Sunday-Lunch", help: "Use for Sunday lunch distribution." },
  { value: "dinner", label: "Dinner", help: "Use for dinner scans." },
  { value: "breakfast", label: "Breakfast", help: "Use for breakfast scans." },
];

function ScannerPage() {
  const router = useRouter();
  const [mode, setMode] = useState<ScanMode>("check-in");
  const [scanValue, setScanValue] = useState("");
  const [status, setStatus] = useState<ScanStatus | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [records, setRecords] = useState<ScanRecord[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(SCAN_STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as ScanRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const isAdmin = localStorage.getItem("hackai_admin") === "true";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<QRDetector | null>(null);
  const loopTimerRef = useRef<number | null>(null);
  const lastScanRef = useRef<{ value: string; at: number }>({ value: "", at: 0 });
  const isDetectingRef = useRef(false);
  const hackerIdCacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/signin");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    localStorage.setItem(SCAN_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const selectedMode = useMemo(
    () => SCAN_MODES.find((m) => m.value === mode) ?? SCAN_MODES[0],
    [mode]
  );

  const counts = useMemo(() => {
    const seed: Record<ScanMode, number> = {
      "check-in": 0,
      "saturday-lunch": 0,
      "sunday-lunch": 0,
      dinner: 0,
      breakfast: 0,
    };
    for (const record of records) seed[record.mode] += 1;
    return seed;
  }, [records]);

  const visibleStatModes = useMemo(
    () => SCAN_MODES.filter((item) => counts[item.value] >= 1),
    [counts]
  );

  const findHackerIdByQrValue = useCallback(async (rawValue: string): Promise<string | null> => {
    const trimmed = rawValue.trim();
    if (!trimmed) return null;

    const lower = trimmed.toLowerCase();
    if (hackerIdCacheRef.current[lower]) {
      return hackerIdCacheRef.current[lower];
    }

    const hackersRef = collection(db, HACKERS_COLLECTION);

    const lowerMatchSnap = await getDocs(
      query(hackersRef, where("email", "==", lower), limit(1))
    );
    if (!lowerMatchSnap.empty) {
      const hackerId = lowerMatchSnap.docs[0].id;
      hackerIdCacheRef.current[lower] = hackerId;
      return hackerId;
    }

    if (trimmed !== lower) {
      const exactMatchSnap = await getDocs(
        query(hackersRef, where("email", "==", trimmed), limit(1))
      );
      if (!exactMatchSnap.empty) {
        const hackerId = exactMatchSnap.docs[0].id;
        hackerIdCacheRef.current[lower] = hackerId;
        return hackerId;
      }
    }

    const idMatchSnap = await getDoc(doc(db, HACKERS_COLLECTION, trimmed));
    if (idMatchSnap.exists()) {
      hackerIdCacheRef.current[lower] = idMatchSnap.id;
      return idMatchSnap.id;
    }

    return null;
  }, []);

  const persistScanToFirestore = useCallback(
    async (record: ScanRecord) => {
      try {
        const hackerId = await findHackerIdByQrValue(record.value);
        if (!hackerId) {
          setStatus({
            tone: "error",
            text: `Scan saved locally, but no hacker was found in ${HACKERS_COLLECTION} for "${record.value}".`,
          });
          return;
        }

        await addDoc(collection(db, HACKERS_COLLECTION, hackerId, "scans"), {
          mode: record.mode,
          value: record.value,
          scannedAt: serverTimestamp(),
          createdAtLabel: record.createdAt,
        });

        const targetField = MODE_TO_HACKER_FIELD[record.mode];
        const updates: Record<string, unknown> = {
          lastScannedAt: serverTimestamp(),
          scanCount: increment(1),
        };
        if (targetField) {
          updates[targetField] = true;
        }

        await updateDoc(doc(db, HACKERS_COLLECTION, hackerId), updates);

        const modeLabel = SCAN_MODES.find((item) => item.value === record.mode)?.label ?? record.mode;
        setStatus({
          tone: "success",
          text: `Scan successful: ${modeLabel} -> ${record.value} (updated ${targetField} in Firebase).`,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save scan to Firebase.";
        setStatus({
          tone: "error",
          text: `Scan saved locally, but Firebase save failed: ${message}`,
        });
      }
    },
    [findHackerIdByQrValue]
  );

  const addScanRecord = useCallback(
    (value: string): ScanRecord | null => {
      const trimmed = value.trim();
      if (!trimmed) {
        setStatus({ tone: "error", text: "Scan failed: no QR value detected." });
        return null;
      }

      const now = new Date();
      const record: ScanRecord = {
        id: `${now.getTime()}-${Math.random().toString(16).slice(2, 8)}`,
        mode,
        value: trimmed,
        createdAt: now.toLocaleString(),
      };

      setRecords((prev) => [record, ...prev].slice(0, 100));
      setScanValue("");
      setStatus({
        tone: "success",
        text: `Scan successful: ${selectedMode.label} -> ${trimmed} (saving to Firebase...)`,
      });
      return record;
    },
    [mode, selectedMode.label]
  );

  const stopScanner = useCallback(() => {
    if (loopTimerRef.current) {
      window.clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScannerActive(false);
  }, []);

  const tickDetect = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;
    if (isDetectingRef.current) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      loopTimerRef.current = window.setTimeout(() => {
        void tickDetect();
      }, 220);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      isDetectingRef.current = true;
      const codes = await detectorRef.current.detect(canvas);
      const rawValue = codes[0]?.rawValue?.trim();
      if (rawValue) {
        const nowMs = Date.now();
        const isSameAsLast =
          rawValue === lastScanRef.current.value && nowMs - lastScanRef.current.at < 1500;
        if (!isSameAsLast) {
          lastScanRef.current = { value: rawValue, at: nowMs };
          const record = addScanRecord(rawValue);
          if (record) {
            void persistScanToFirestore(record);
          }
        } else {
          setStatus({
            tone: "info",
            text: "Scan ignored: duplicate QR detected too quickly.",
          });
        }
      }
    } catch {
      // detector can throw while camera frames are initializing
    } finally {
      isDetectingRef.current = false;
      loopTimerRef.current = window.setTimeout(() => {
        void tickDetect();
      }, 220);
    }
  }, [addScanRecord, persistScanToFirestore]);

  const startScanner = useCallback(async () => {
    setScannerError("");
    try {
      const Ctor = (window as unknown as { BarcodeDetector?: QRDetectorConstructor })
        .BarcodeDetector;

      if (!Ctor) {
        setScannerError("This browser does not support camera QR detection.");
        setStatus({
          tone: "error",
          text: "Scan failed: this browser does not support QR camera scanning.",
        });
        return;
      }

      const detector = new Ctor({ formats: ["qr_code"] });
      detectorRef.current = detector;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setScannerActive(true);
      setStatus({
        tone: "info",
        text: "Scanner started. Point camera at a QR code.",
      });
      void tickDetect();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to start camera.";
      setScannerError(message);
      setStatus({
        tone: "error",
        text: `Scan failed: ${message}`,
      });
      stopScanner();
    }
  }, [stopScanner, tickDetect]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0033] via-[#2d0a4b] to-[#0f051d] text-white">
        Loading scanner...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0033] via-[#2d0a4b] to-[#0f051d] text-white">
      <div className="px-5 md:px-10 pt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="relative h-10 w-24 cursor-pointer"
          aria-label="Go to home"
        >
          <img
            src="/Home/hackAiLogoColor.webp"
            alt="HackAI"
            className="object-contain w-full h-full"
          />
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/hackers")}
          className="rounded-xl px-4 py-2 bg-[#2d0a4b] text-white font-semibold transition hover:bg-[#4b1c7a]"
        >
          Hackers
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="rounded-3xl shadow-2xl p-8 w-full max-w-3xl flex flex-col items-center relative z-10 border border-white/20 bg-white/10 backdrop-blur-md">
          <FaQrcode className="text-5xl text-[#DDD059] mb-2" />
          <h1 className="text-3xl font-bold mb-1 text-center">Admin Scanner</h1>
          <p className="text-gray-200 text-center mb-6">{selectedMode.help}</p>

          <div className="w-full mb-4">
            <label className="block mb-2 text-sm uppercase tracking-widest text-gray-200">
              Scanner Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ScanMode)}
              className="w-full rounded-xl px-4 py-3 bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
            >
              {SCAN_MODES.map((item) => (
                <option key={item.value} value={item.value} className="text-black">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {visibleStatModes.length > 0 && (
            <div className="w-full flex flex-wrap gap-3 mb-5">
              {visibleStatModes.map((item) => (
                <div
                  key={item.value}
                  className="flex-1 min-w-[140px] rounded-xl border border-white/20 bg-black/35 px-4 py-3"
                >
                  <div className="text-[11px] uppercase tracking-widest text-gray-200">{item.label}</div>
                  <div className="text-2xl font-bold text-[#DDD059]">{counts[item.value]}</div>
                </div>
              ))}
            </div>
          )}

          <div className="w-full mb-4 rounded-xl border border-white/20 bg-black/35 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-sm uppercase tracking-widest text-gray-200">QR Camera Scanner</div>
              {scannerActive ? (
                <button
                  type="button"
                  onClick={stopScanner}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#5b1a1a] hover:bg-[#7a2525] px-3 py-2 text-sm font-semibold"
                >
                  <FaStop />
                  Stop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startScanner}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1a4f2a] hover:bg-[#22663a] px-3 py-2 text-sm font-semibold"
                >
                  <FaCamera />
                  Start Camera
                </button>
              )}
            </div>

            <div className="relative w-full overflow-hidden rounded-lg border border-white/15 bg-black">
              <video ref={videoRef} className="w-full max-h-[360px] object-cover" muted playsInline />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            {scannerError && <p className="mt-2 text-sm text-red-300">{scannerError}</p>}
          </div>

          <div className="w-full mb-4">
            <label className="block mb-2 text-sm uppercase tracking-widest text-gray-200">
              Manual Value (Fallback)
            </label>
            <input
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              placeholder="Paste/enter QR value"
              className="w-full rounded-xl px-4 py-3 bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const record = addScanRecord(scanValue);
              if (record) {
                void persistScanToFirestore(record);
              }
            }}
            className="w-full rounded-xl px-4 py-3 bg-[#2d0a4b] text-white font-semibold transition hover:bg-[#4b1c7a]"
          >
            Save Manual Scan
          </button>

          {status && (
            <p
              className={`mt-3 text-sm ${
                status.tone === "success"
                  ? "text-green-300"
                  : status.tone === "error"
                    ? "text-red-300"
                    : "text-[#DDD059]"
              }`}
            >
              {status.text}
            </p>
          )}

          <div className="w-full mt-7">
            <div className="flex items-center gap-2 mb-3 text-gray-200">
              <FaHistory />
              <span className="text-sm uppercase tracking-widest">Recent Scans</span>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-white/15 bg-black/30">
              {records.length === 0 ? (
                <div className="px-4 py-4 text-sm text-gray-300">No scans recorded yet.</div>
              ) : (
                records.map((record) => (
                  <div key={record.id} className="px-4 py-3 border-b border-white/10 last:border-b-0">
                    <div className="text-xs text-[#DDD059] uppercase tracking-widest">
                      {SCAN_MODES.find((m) => m.value === record.mode)?.label ?? record.mode}
                    </div>
                    <div className="text-sm text-white break-all">{record.value}</div>
                    <div className="text-xs text-gray-300">{record.createdAt}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ScannerPage), { ssr: false });
