import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { VestibularProvider } from "@/lib/store";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vestibular Lab | Interactive Semicircular Canal Simulator",
  description:
    "An interactive 3D educational simulator for the semicircular canals and vestibular system - built for DPT, medical, audiology, and neuroscience students, and vestibular rehabilitation clinicians.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04060b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="flex h-full min-h-screen flex-col bg-[#04060b] font-sans text-slate-100 antialiased">
        <VestibularProvider>{children}</VestibularProvider>
      </body>
    </html>
  );
}
