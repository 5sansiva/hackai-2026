import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { auth } from "@/firebase/clientApp";
import { FaUserCircle, FaQrcode } from "react-icons/fa";

const UserProfile = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserEmail(user?.email || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0033] via-[#2d0a4b] to-[#0f051d] text-white">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <div className="glass-card rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center relative z-10">
          <FaUserCircle className="text-6xl text-[#a259ff] mb-2" />
          <h2 className="text-3xl font-bold mb-1 text-center">Your Profile</h2>
          {userEmail && (
            <div className="mb-4 text-gray-300 text-center text-base">{userEmail}</div>
          )}
          <div className="w-44 h-44 bg-gradient-to-br from-[#2d0a4b] to-[#a259ff] flex items-center justify-center rounded-2xl shadow-lg mb-6">
            <FaQrcode className="text-6xl text-white/80" />
          </div>
          <hr className="w-2/3 border-t border-gray-600 mb-6" />
          <p className="text-lg text-center mb-2">Welcome to HackAI 2026!</p>
          <p className="text-base text-gray-300 text-center">Show this QR code at check-in.<br />If you have questions, visit the help desk or contact us.</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
