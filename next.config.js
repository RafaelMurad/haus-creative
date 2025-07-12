/** @type {import('next').NextConfig} */
const path = require('path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // Advanced webpack configuration for production optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Optimize bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Framework bundle (React, Next.js)
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          // GSAP animation library
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: 'gsap',
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          // Vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 20,
            minSize: 20000,
            maxSize: 300000,
          },
          // Common components
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      }

      // Advanced tree shaking
      config.optimization.usedExports = true
      config.optimization.sideEffects = false

      // Babel optimizations for production
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
            plugins: [
              // Remove console logs in production
              ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
              // Remove unused imports
              'babel-plugin-transform-remove-unused-imports',
            ],
          },
        },
      })
    }

    // Path aliases for better imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/data': path.resolve(__dirname, 'src/data'),
    }

    return config
  },

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

  // Enable experimental features for better optimization
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
    optimizeCss: true,
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Output configuration
  output: 'standalone',
};

module.exports = withBundleAnalyzer(nextConfig);
