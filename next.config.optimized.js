// Bundle analysis configuration for Next.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing configuration
  output: "standalone",

  // Optimization settings
  experimental: {
    // Enable modern JavaScript output
    esmExternals: true,

    // Optimize CSS
    optimizeCss: true,

    // Enable SWC minification
    swcMinify: true,
  },

  // Webpack optimizations
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Production optimizations
    if (!dev) {
      // Tree shaking optimization
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,

        // Advanced splitting
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,

            // Vendor chunk for stable caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 10,
              chunks: "all",
            },

            // Common chunk for shared code
            common: {
              name: "common",
              minChunks: 2,
              priority: 5,
              chunks: "all",
              enforce: true,
            },

            // GSAP specific chunk (since it's conditionally loaded)
            gsap: {
              test: /[\\/]node_modules[\\/]gsap[\\/]/,
              name: "gsap",
              priority: 15,
              chunks: "all",
            },

            // React specific chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react",
              priority: 20,
              chunks: "all",
            },
          },
        },
      };

      // Remove unused imports in production
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["next/babel"],
              plugins: [
                // Remove console.log in production
                ["transform-remove-console", { exclude: ["error", "warn"] }],

                // Remove unused imports
                "babel-plugin-transform-remove-unused-imports",
              ],
            },
          },
        ],
      });
    }

    // Alias optimization for better tree shaking
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use ES modules where possible
      gsap: "gsap/dist/gsap",
      "gsap/ScrollTrigger": "gsap/dist/ScrollTrigger",
    };

    return config;
  },

  // Compression and caching
  compress: true,

  // Image optimization
  images: {
    // Enable modern formats
    formats: ["image/webp", "image/avif"],

    // Optimize for different sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Enable placeholder generation
    placeholder: "blur",

    // Quality settings
    quality: 75,
  },

  // Enable HTTP/2 push for critical resources
  generateEtags: true,

  // Headers for caching optimization
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
