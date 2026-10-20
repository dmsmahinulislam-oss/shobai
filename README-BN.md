# ShobAI MVP (বাংলা নির্দেশিকা)

এটি ShobAI-এর প্রাথমিক ওয়েব MVP: বাংলা/ইংরেজি চ্যাট, স্টাডি, লেখালেখি ও ব্যবসার কনটেন্ট তৈরির জন্য একটি সহজ ইন্টারফেস।

## যা লাগবে
- কম্পিউটার/ল্যাপটপে Node.js-এর LTS সংস্করণ
- Google AI Studio থেকে Gemini API key
- একটি কোড এডিটর (যেমন VS Code)

## লোকালি চালানো
1. এই ZIP extract করো।
2. প্রজেক্ট ফোল্ডারে Terminal/Command Prompt খোলো।
3. চালাও: `npm install`
4. `.env.example` ফাইল কপি করে `.env.local` নামে রাখো।
5. `.env.local`-এ নিজের API key বসাও:
   `GEMINI_API_KEY=তোমার_গোপন_API_key`
6. চালাও: `npm run dev`
7. ব্রাউজারে `http://localhost:3000` খোলো।

## API key কীভাবে পাবে
Google AI Studio-তে নিজের অ্যাকাউন্ট থেকে Gemini API key তৈরি করো। ফ্রি টিয়ার, কোন মডেল পাওয়া যায়, ডেটা ব্যবহারের শর্ত ও মূল্য আগে যাচাই করো:
https://ai.google.dev/gemini-api/docs/pricing

**API key কখনো `app/page.tsx`-এ বা অন্য browser-side কোডে রাখবে না।** শুধু `.env.local` এবং server route-এ থাকবে। `.env.local` GitHub-এ আপলোড কোরো না।

## কীভাবে অনলাইনে প্রকাশ করবে
1. GitHub-এ একটি private repository তৈরি করো এবং কোড push করো; `.env.local` push করবে না।
2. Vercel-এ repository import করো।
3. Project Settings → Environment Variables-এ `GEMINI_API_KEY` যোগ করো।
4. Deploy করো এবং নিজের সাইটে চ্যাট পরীক্ষা করো।
5. প্রকাশের আগে API usage/billing limit এবং host-এর বর্তমান শর্ত যাচাই করো।

Official docs:
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Vercel + Next.js: https://vercel.com/docs/frameworks/full-stack/nextjs
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing

## নিরাপত্তা ও সীমাবদ্ধতা
এই ZIP একটি শেখার/পরীক্ষার MVP, বড় পাবলিক লঞ্চের জন্য প্রস্তুত নয়।
- Login নেই, তাই যে কেউ API endpoint-এ অনুরোধ পাঠাতে পারে।
- Origin check ও message-length limit পূর্ণ abuse protection নয়।
- Production-এ চালুর আগে persistent rate limiting (যেমন Redis/Upstash), bot protection, usage caps, monitoring, privacy notice, abuse reporting এবং প্রয়োজনীয় আইন/নীতিমালা যাচাই করতে হবে।
- Gemini free tier-এ পাঠানো ডেটা কীভাবে ব্যবহৃত হয় তা provider-এর শর্তে দেখে নাও। ব্যবহারকারীদের গোপন বা সংবেদনশীল তথ্য না দিতে বলো।
- API key-এ usage/billing limit থাকলে সেট করো; সম্ভব না হলে public launch কোরো না।
- গুরুত্বপূর্ণ স্বাস্থ্য, আইন বা আর্থিক বিষয়ে AI-এর উত্তর যাচাই করা প্রয়োজন।
- `console.error`-এ কেবল সংক্ষিপ্ত error message লেখা হয়; request body বা API key log কোরো না।

## ফোল্ডার কাঠামো
- `app/page.tsx` — চ্যাট UI
- `app/api/chat/route.ts` — server-side AI endpoint
- `app/globals.css` — responsive styling
- `app/layout.tsx` — page metadata
- `.env.example` — environment variable template
