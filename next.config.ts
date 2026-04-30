import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  },
  experimental: {
    //@ts-expect-error Object literal may only specify known properties, and 'turbo' does not exist in type 'ExperimentalConfig'. (typescript 2353)
    turbo: false,
  },
};

export default nextConfig;
