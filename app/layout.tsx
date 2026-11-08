import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: [
    { path: "./fonts/Manrope-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Manrope-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Manrope-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Manrope-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Manrope-800.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "WEGM Studio — Website Requirements Questionnaire", template: "%s · WEGM Studio" },
  description: "Tell WEGM Studio exactly what kind of website you need and receive a downloadable project brief.",
  applicationName: "WEGM Studio Questionnaire",
};

export const viewport: Viewport = { themeColor: "#14233B", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}
