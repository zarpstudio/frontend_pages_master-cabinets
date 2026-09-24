import type { NextConfig } from "next";
import { allRedirects } from "./redirects.config";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // One static-generation worker, so the build-time CMS pacer in
    // src/lib/build-cms-pacer.ts is a single global queue. With N workers
    // the build would hit the rate-limited CMS at N times the paced rate.
    cpus: 1,
  },
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
