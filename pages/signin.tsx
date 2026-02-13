import React, { useState, useEffect } from "react";

const SignIn = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"code" | "email">("code");
  const [error, setError] = useState("");

  // Focus next input on change
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

  // Handle code submit (simulate verification)
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join("").length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setError("");
    // TODO: Verify code (simulate success)
    setStep("email");
  };

  // Handle email submit (simulate account creation)
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@gmail\.com$/.test(email)) {
      setError("Please enter a valid Gmail address.");
      return;
    }
    setError("");
    // TODO: Create account and log in
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
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
      <div className="glass-card rounded-3xl shadow-xl p-10 w-full max-w-md flex flex-col items-center relative z-10 text-white">
        {step === "code" ? (
          <form onSubmit={handleCodeSubmit} className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-center">Confirm it’s you</h2>
            <p className="mb-6 text-center text-gray-700">Enter the 6-digit code you received before the event</p>
            <div className="flex gap-3 mb-6">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`code-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`w-12 h-14 text-2xl text-center border-2 rounded-lg focus:outline-none transition-all ${digit ? "border-green-500" : "border-gray-300"}`}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onFocus={e => e.target.select()}
                  required
                />
              ))}
            </div>
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            <button type="submit" className="w-full py-3 rounded-lg bg-[#2d0a4b] text-white font-semibold text-lg hover:bg-[#4b1c7a] transition mb-2">Done</button>
            <div className="text-center text-sm text-gray-600">Didn’t get the code? Contact the organizers.</div>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4 text-center">Create your account</h2>
            <input
              type="email"
              placeholder="Enter your Gmail address"
              className="mb-4 px-4 py-3 rounded-lg border border-gray-300 w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Set a password"
              className="mb-4 px-4 py-3 rounded-lg border border-gray-300 w-full text-lg focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
              required
            />
            <div className="w-full flex flex-col gap-2 mb-4">
              <button type="submit" className="w-full py-3 rounded-lg bg-[#2d0a4b] text-white font-semibold text-lg hover:bg-[#4b1c7a] transition">Create Account</button>
              <button type="button" className="w-full py-3 rounded-lg bg-[#4285F4] text-white font-semibold text-lg hover:bg-[#357ae8] transition flex items-center justify-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M21.805 10.023h-9.765v3.977h5.588c-.241 1.238-1.03 2.287-2.199 2.963v2.463h3.555c2.083-1.922 3.291-4.757 2.821-8.403z" fill="#4285F4"/><path d="M12.04 21c2.7 0 4.968-.89 6.624-2.413l-3.555-2.463c-.987.663-2.25 1.057-3.069 1.057-2.357 0-4.36-1.591-5.078-3.73H3.322v2.522C4.969 19.553 8.23 21 12.04 21z" fill="#34A853"/><path d="M6.962 13.451a5.987 5.987 0 0 1 0-3.451V7.478H3.322a8.997 8.997 0 0 0 0 8.044l3.64-2.071z" fill="#FBBC05"/><path d="M12.04 6.509c1.47 0 2.789.507 3.827 1.497l2.872-2.872C17.004 3.89 14.736 3 12.04 3c-3.81 0-7.071 1.447-8.718 3.478l3.64 2.071c.718-2.139 2.721-3.74 5.078-3.74z" fill="#EA4335"/></g></svg>
                Sign in with Google
              </button>
            </div>
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
