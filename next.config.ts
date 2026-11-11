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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5119",
        pathname: "/api/favicon",
      },
      {
        protocol: "https",
        hostname: "api.pulse.velovix.com",
        pathname: "/api/favicon",
      },
    ],
  },
};

export default nextConfig;
