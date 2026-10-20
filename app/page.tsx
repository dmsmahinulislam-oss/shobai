"use client";

import { FormEvent, useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

const starters = [
  { icon: "📚", title: "পড়াশোনা", prompt: "এই বিষয়টি সহজ বাংলায় বুঝিয়ে দাও: " },
  { icon: "✍️", title: "লেখালেখি", prompt: "আমার জন্য একটি সুন্দর বাংলা লেখা তৈরি করো: " },
  { icon: "🛍️", title: "ব্যবসা", prompt: "আমার ছোট ব্যবসার জন্য একটি আকর্ষণীয় বিজ্ঞাপন লেখো: " },
  { icon: "🌐", title: "অনুবাদ", prompt: "এটি অনুবাদ করো এবং সহজ ভাষায় বোঝাও: " }
];

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(value?: string) {
    const text = (value ?? input).trim();
    if (!text || loading) return;
    if (text.length > 4000) {
      setError("মেসেজটি ৪,০০০ অক্ষরের মধ্যে রাখো।");
      return;
    }

    const nextMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8).map((m) => ({ role: m.role, text: m.text }))
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "এখন উত্তর পাওয়া যাচ্ছে না।");
      setMessages([...nextMessages, { role: "assistant", text: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="ShobAI home">
          <span className="brand-icon">✦</span><span>ShobAI</span>
        </a>
        <span className="language">বাংলা · English</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="pulse" /> তোমার প্রতিদিনের AI সহকারী</div>
        <h1>ভাবনা থেকে কাজে,<br /><span>AI থাকুক পাশে।</span></h1>
        <p className="subtitle">শেখো, লেখো, তৈরি করো—নিজের ভাষায়।</p>
      </section>

      <section className="workspace" aria-label="AI chat">
        {messages.length === 0 ? (
          <>
            <div className="welcome">
              <div className="welcome-mark">✧</div>
              <h2>আজ কী করতে চাও?</h2>
              <p>নিচে প্রশ্ন লেখো অথবা একটি সহকারী বেছে নাও।</p>
            </div>
            <div className="starter-grid">
              {starters.map((s) => (
                <button className="starter" key={s.title} onClick={() => setInput(s.prompt)} type="button">
                  <span className="starter-icon">{s.icon}</span>
                  <span><strong>{s.title}</strong><small>শুরু করতে চাপ দাও</small></span>
                  <span className="starter-arrow">↗</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="conversation" aria-live="polite">
            {messages.map((m, i) => (
              <article className={`message ${m.role}`} key={`${i}-${m.role}`}>
                <div className="avatar">{m.role === "user" ? "তুমি" : "✦ AI"}</div>
                <div className="bubble">{m.text}</div>
              </article>
            ))}
            {loading && <article className="message assistant"><div className="avatar">✦ AI</div><div className="bubble typing">উত্তর তৈরি হচ্ছে<span>…</span></div></article>}
            <div id="bottom" />
          </div>
        )}

        <form className="composer" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="prompt">তোমার প্রশ্ন</label>
          <textarea
            id="prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="যেকোনো প্রশ্ন এখানে লেখো…"
            rows={2}
            maxLength={4000}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage();
              }
            }}
          />
          <div className="composer-bottom">
            <span className="hint">Enter = পাঠাও · Shift + Enter = নতুন লাইন</span>
            <button className="send-button" type="submit" disabled={loading || !input.trim()} aria-label="Send message">
              {loading ? "…" : "↑"}
            </button>
          </div>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
        <p className="disclaimer">ShobAI ভুল উত্তর দিতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করে নাও। ব্যক্তিগত বা গোপন তথ্য লিখো না।</p>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} ShobAI · প্রাথমিক সংস্করণ</span>
        <span>বাংলা দিয়ে তৈরি, সবার জন্য ভাবনা</span>
      </footer>
    </main>
  );
}
