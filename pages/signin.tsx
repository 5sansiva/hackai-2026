import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { db, auth } from "@/firebase/clientApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const ADMIN_BYPASS_CODE = "000000";

const SignIn = () => {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"register" | "login">("register");
  const [error, setError] = useState("");
  const [codeDocId, setCodeDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const adminBypassTriggeredRef = useRef(false);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/userProfile");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (mode !== "register") return;
    if (adminBypassTriggeredRef.current) return;
    if (code.join("") !== ADMIN_BYPASS_CODE) return;
    adminBypassTriggeredRef.current = true;
    localStorage.setItem("hackai_admin", "true");
    router.replace("/");
  }, [code, mode, router]);

  // Focus next/prev input on change and handle backspace
  const handleChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < 5) {
      const next = document.getElementById(`code-input-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  // Handle backspace to move focus to previous input
  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      const prev = document.getElementById(`code-input-${idx - 1}`);
      if (prev) {
        (prev as HTMLInputElement).focus();
        const newCode = [...code];
        newCode[idx - 1] = "";
        setCode(newCode);
        e.preventDefault();
      }
    }
  };

  // Validate code and fetch email
  const validateCode = async () => {
    if (code.join("").length !== 6) {
      setError("Please enter the 6-digit code.");
      return false;
    }
    setError("");
    setLoading(true);
    try {
      const codeStr = code.join("");
      if (codeStr === ADMIN_BYPASS_CODE) {
        localStorage.setItem("hackai_admin", "true");
        setLoading(false);
        router.replace("/");
        return false;
      }

      const docRef = doc(db, "hackers", codeStr);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setError("Invalid code. Please check and try again.");
        setLoading(false);
        return false;
      }
      const data = docSnap.data();
      if (data.hasLoggedin && mode === "register") {
        setError("This code has already been used to register.");
        setLoading(false);
        return false;
      }
      setCodeDocId(codeStr);
      setEmail(data.email || "");
      setLoading(false);
      return true;
    } catch {
      setError("Error verifying code. Please try again.");
      setLoading(false);
      return false;
    }
  };

  // Handle register/login submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register") {
      const valid = await validateCode();
      if (!valid) return;
      if (!/^[^@\s]+@gmail\.com$/.test(email)) {
        setError("Invalid email. Please use the one you used on the application.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      setError("");
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // No email verification required, allow immediate login
        if (codeDocId) {
          const docRef = doc(db, "hackers", codeDocId);
          await updateDoc(docRef, { hasLoggedin: true });
        }
        alert("Account created! You can now log in.");
        window.location.href = "/signin";
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error creating account. Try again.";
        setError(message);
      }
      setLoading(false);
    } else {
      // Login mode
      if (!/^[^@\s]+@gmail\.com$/.test(email)) {
        setError("Invalid email. Please use the one you used on the application.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      setError("");
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/userProfile");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error signing in. Try again.";
        setError(message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div style={{ height: '110px' }} />
      <div className="flex flex-1 items-center justify-center relative">
        {/* Background image */}
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
        <div
          className="rounded-2xl shadow-xl py-8 flex flex-col items-center relative z-10 text-white mt-56 md:mt-64"
          style={{
            maxWidth: '650px',
            minWidth: '320px',
            width: '90%',
            background: 'linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.10) 100%)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            backdropFilter: 'blur(18px) saturate(180%)',
            WebkitBackdropFilter: 'blur(18px) saturate(180%)',
            border: '.5px solid rgba(255,255,255,0.35)',
            outline: '1.5px solid rgba(255,255,255,0.18)'
          }}
        >
          <div className="w-full px-4 md:px-8">
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-2 text-center">
            {mode === "register" ? "Create an account" : "Login"}
          </h2>
          <div className="mb-2 text-center text-gray-400">
            {mode === "register" ? (
              <>
                Already have an account?{' '}
                <span className="text-green-300 cursor-pointer underline" onClick={() => setMode("login")}>Sign in</span>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <span className="text-green-300 cursor-pointer underline" onClick={() => setMode("register")}>Create one</span>
              </>
            )}
          </div>
          {/* 6-digit code input */}
          {mode === "register" && (
            <div className="w-full mb-4">
              <label className="block mb-2 text-left text-gray-300 font-semibold">Enter 6-digit login code</label>
              <div className="flex gap-3 justify-start w-full pl-1">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`w-12 h-14 text-2xl text-center border-2 rounded-lg focus:outline-none transition-all bg-black/60 ${digit ? "border-green-500" : "border-gray-400"}`}
                    value={digit}
                    onChange={e => handleChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    onFocus={e => e.target.select()}
                    required
                  />
                ))}
              </div>
            </div>
          )}
          {/* Email input (editable for both modes) */}
          <input
            type="email"
            placeholder="Enter your email address"
            className="mb-4 px-4 py-3 rounded-lg border border-gray-300 w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="mb-4 px-4 py-3 rounded-lg border border-gray-300 w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="w-full flex flex-col gap-2 mb-4">
            <button type="submit" className="w-full py-3 rounded-lg bg-[#2d0a4b] text-white font-semibold text-lg hover:bg-[#4b1c7a] transition" disabled={loading}>
              {loading ? "Loading..." : mode === "register" ? "Create Account" : "Sign In"}
            </button>
          </div>
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
