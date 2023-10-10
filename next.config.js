const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/portal",
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "visitor-badge.laobi.icu",
      "vercel.com",
    ],
    unoptimized: true,
  },
  env: {
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_SUBSCRIBER_ID: process.env.NEXT_PUBLIC_SUBSCRIBER_ID,
    NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY,
    NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID:
      process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID,
    NEXT_PUBLIC_KNOCK_SECRET_API_KEY:
      process.env.NEXT_PUBLIC_KNOCK_SECRET_API_KEY,
  },
};

module.exports = withContentlayer(nextConfig);
