import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  async headers() {
    return [
      // ✅ Cache Next.js hashed build assets for 1 year (safe + big win on repeat loads)
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // ✅ Cache common static files from /public by extension (1 year)
      // Uses path-to-regexp param regex: /:ext(...)
      {
        source:
          "/:path*.:ext(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf|otf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },

      // ✅ Your routes (match both /Home and /home etc.)
      {
        source: "/(Home|home)/:path*",
        headers: [
          {
            // Better CDN behavior than must-revalidate for pages
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/(Stats|stats)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
