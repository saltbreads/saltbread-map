import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "search.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // 구글 프로필
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // 클라우디너리
      },
    ],
  },
};

export default nextConfig;
