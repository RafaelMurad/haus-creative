/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simple configuration for gallery app
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;