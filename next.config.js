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
  },
};

module.exports = withContentlayer(nextConfig);
