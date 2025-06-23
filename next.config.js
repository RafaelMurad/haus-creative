/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Configure image optimization for high-quality galleries
    formats: ["image/webp", "image/avif"],

    // Configure device sizes for better responsive images
    deviceSizes: [640, 768, 1024, 1280, 1600, 1920, 2048],

    // Configure image sizes for better optimization
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Allow local images without domain restriction
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

    // Increase cache time for better performance
    minimumCacheTTL: 86400, // 24 hours
  },

  // Enable experimental features for better image handling
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

module.exports = nextConfig;
