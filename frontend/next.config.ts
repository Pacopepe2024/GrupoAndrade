import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms.grupoandrade.es" },
      { protocol: "https", hostname: "grupoandrade.es" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.schuecopws.it" }
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
