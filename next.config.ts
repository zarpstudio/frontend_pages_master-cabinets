import type { NextConfig } from "next";
import { allRedirects } from "./redirects.config";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yuerqsaspdqzpshs.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return allRedirects;
  },
};

export default nextConfig;
