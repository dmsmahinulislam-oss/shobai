
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShobAI — তোমার AI সহকারী",
  description: "বাংলা ও ইংরেজিতে পড়াশোনা, লেখালেখি ও ব্যবসার কাজে AI সহকারী।",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101828",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
