import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    registry: ["./registry/**/*"],
  },
  /* config options here */
  output: process.env.NODE_ENV === "development" ? undefined : "standalone",
};

export default nextConfig;
