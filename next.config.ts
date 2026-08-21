import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/games",
        destination: "/",
        permanent: false,
      },
      {
        source: "/games/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
