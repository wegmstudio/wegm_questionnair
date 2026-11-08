import type { NextConfig } from "next";

// Frontend-only app: exported as static HTML/JS so it can be hosted anywhere
// (any static host, a sub-folder of wegmstudio.shop, Netlify, Vercel, GitHub Pages).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
