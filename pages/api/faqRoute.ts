import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/firebase/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const snap = await adminDb
      .collection("faqs")
      .where("visible", "==", true)
      .orderBy("order", "asc")
      .get();

    const faqs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    return res.status(200).json({ faqs });
  } catch (e: any) {
    console.error("faqRoute error:", e);
    return res.status(500).json({ error: e?.message ?? "Failed to load FAQs" });
  }
}
