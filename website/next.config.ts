import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // devIndicators: {
  //   buildActivity: false,
  //   appIsrStatus: false,
  // },
};

export default nextConfig;
