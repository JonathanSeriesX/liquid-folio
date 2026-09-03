import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Serve AVIF to browsers that accept it, WebP otherwise. Without this
       the optimizer would re-encode even an AVIF source as WebP (the
       default and only format); with it, the sources in public/icons stay
       AVIF end to end. Encoding is slower than WebP but happens once per
       size and is cached. */
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
