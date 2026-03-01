import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/firebase/clientApp";
import { FaUserCircle } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import type { User } from "firebase/auth";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const normalizeKey = (key: string): string => key.toLowerCase().replace(/[^a-z0-9]/g, "");

const getStringByKeys = (data: Record<string, unknown>, keys: string[]): string => {
  const normalizedEntries = new Map<string, unknown>();
  for (const [key, value] of Object.entries(data)) {
    normalizedEntries.set(normalizeKey(key), value);
  }

  for (const key of keys) {
    const value = normalizedEntries.get(normalizeKey(key));
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const getNameFromDoc = (data: Record<string, unknown>): string => {
  const firstName = getStringByKeys(data, ["fname", "firstName", "first_name", "first name", "firstname"]);
  const lastName = getStringByKeys(data, ["lname", "lastName", "last_name", "last name", "lastname"]);
  const joined = `${firstName} ${lastName}`.trim();
  if (joined) return joined;

  return getStringByKeys(data, [
    "name",
    "fullName",
    "full_name",
    "displayName",
    "display_name",
    "applicantName",
    "preferredName",
    "legalName",
  ]);
};

const getProfileTitle = async (email: string, fallbackDisplayName?: string | null): Promise<string> => {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return fallbackDisplayName?.trim() || "Your Profile";

  const emailCandidates = Array.from(new Set([email.trim(), normalizedEmail]));
  const collectionsToCheck = ["testHackers", "hackers"];

  for (const collectionName of collectionsToCheck) {
    for (const emailCandidate of emailCandidates) {
      const snap = await getDocs(
        query(collection(db, collectionName), where("email", "==", emailCandidate), limit(1))
      );
      if (!snap.empty) {
        const name = getNameFromDoc(snap.docs[0].data() as Record<string, unknown>);
        if (name) return name;
      }
    }
  }

  return fallbackDisplayName?.trim() || "Your Profile";
};

const UserProfile = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileTitle, setProfileTitle] = useState("Your Profile");

  useEffect(() => {
    let active = true;

    const syncProfile = async (user: User | null) => {
      const email = user?.email?.trim() || "";
      if (active) {
        setUserEmail(email || null);
      }

      if (!user) {
        if (active) setProfileTitle("Your Profile");
        return;
      }

      try {
        const resolvedTitle = await getProfileTitle(email, user.displayName);
        if (active) {
          setProfileTitle(resolvedTitle || "Your Profile");
        }
      } catch {
        if (active) {
          setProfileTitle(user.displayName?.trim() || "Your Profile");
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      void syncProfile(user);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0033] via-[#2d0a4b] to-[#0f051d] text-white">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center py-10 px-4 sm:px-8">
        <div className="glass-card rounded-3xl shadow-2xl p-6 w-full max-w-2xl flex flex-col items-center relative z-10 mt-24">
          <FaUserCircle className="text-6xl text-[#a259ff] mb-2" />
          <h2 className="text-3xl font-bold mb-1 text-center">{profileTitle}</h2>
          {userEmail && (
            <div className="mb-4 text-gray-300 text-center text-base">{userEmail}</div>
          )}
          <div className="w-44 h-44 bg-gradient-to-br from-[#2d0a4b] to-[#a259ff] flex items-center justify-center rounded-2xl shadow-lg mb-6">
            {userEmail ? (
              <QRCodeSVG value={userEmail} size={160} bgColor="transparent" fgColor="#fff" level="H" />
            ) : (
              <div className="text-gray-400">Sign in to see your QR code</div>
            )}
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
