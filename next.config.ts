import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: ["192.168.1.9"],
     images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.emojiterra.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

};

export default nextConfig;
