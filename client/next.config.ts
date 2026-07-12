import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/brand images come from the backend's S3 bucket; seed data also
    // carries placeholder hosts. Keep dev permissive; tighten for production.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
