/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: [
            {
              loader: "@vercel/og/svg",
              options: { runtime: "nodejs" },
            },
          ],
          as: "*.js",
        },
      },
    },
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
