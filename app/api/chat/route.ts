import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 8;

type HistoryItem = { role: "user" | "assistant"; text: string };

export async function POST(request: NextRequest) {
  try {
    // Basic same-origin check for browser requests. This is not a complete abuse-prevention system.
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return Response.json({ error: "অনুরোধটি গ্রহণ করা যায়নি।" }, { status: 403 });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "AI সংযোগ এখনো সেটআপ করা হয়নি। .env.local ফাইলে API key যোগ করো।" },
        { status: 503 }
      );
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return Response.json({ error: "সঠিক মেসেজ পাঠাও।" }, { status: 400 });
    }

    const { message, history } = body as { message?: unknown; history?: unknown };
    if (typeof message !== "string" || !message.trim()) {
      return Response.json({ error: "আগে একটি প্রশ্ন লেখো।" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ error: "মেসেজ ৪,০০০ অক্ষরের মধ্যে রাখো।" }, { status: 413 });
    }

    const safeHistory: HistoryItem[] = Array.isArray(history)
      ? history.slice(-MAX_HISTORY_ITEMS).filter((item): item is HistoryItem =>
          !!item &&
          typeof item === "object" &&
          ((item as HistoryItem).role === "user" || (item as HistoryItem).role === "assistant") &&
          typeof (item as HistoryItem).text === "string"
        ).map((item) => ({ role: item.role, text: item.text.slice(0, 2000) }))
      : [];

    const ai = new GoogleGenAI({ apiKey });
    const contents = [
      ...safeHistory.map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text }]
      })),
      { role: "user", parts: [{ text: message.trim() }] }
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction:
          "তুমি ShobAI, বাংলাদেশের মানুষের জন্য সহায়ক বাংলা-ইংরেজি AI সহকারী। ব্যবহারকারীর ভাষায় স্পষ্ট, বন্ধুত্বপূর্ণ ও ব্যবহারিক উত্তর দাও। না জানলে তা স্বীকার করো; তথ্য বানিয়ে বলো না। চিকিৎসা, আইন, অর্থ বা নিরাপত্তার মতো গুরুত্বপূর্ণ বিষয়ে সাধারণ তথ্য দাও এবং প্রয়োজন হলে যোগ্য পেশাদারের সাহায্য নিতে বলো। গোপন তথ্য চাইবে না।"
      }
    });

    const reply = result.text?.trim();
    if (!reply) {
      return Response.json({ error: "এবার উত্তর তৈরি হয়নি। আবার চেষ্টা করো।" }, { status: 502 });
    }

    return Response.json({ reply }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    // Keep provider errors and secrets out of the browser response.
    console.error("ShobAI chat request failed:", error instanceof Error ? error.message : "unknown error");
    return Response.json(
      { error: "AI-এর সঙ্গে সংযোগ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করো।" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
