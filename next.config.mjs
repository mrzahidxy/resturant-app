/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": ["@vercel/og/svg", { runtime: "nodejs" }],
      },
    },
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
