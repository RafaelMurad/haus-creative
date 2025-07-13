#!/usr/bin/env node

/**
 * Bundle Analysis Utility
 * Analyzes Next.js build output and provides optimization recommendations
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function analyzeBundle() {
  log("🔍 Starting Bundle Analysis...", "cyan");
  log("====================================", "blue");

  // Check if .next directory exists
  const buildPath = path.join(process.cwd(), ".next");
  if (!fs.existsSync(buildPath)) {
    log(
      '❌ No .next directory found. Please run "npm run build" first.',
      "red"
    );
    return;
  }

  // Analyze build output
  const staticPath = path.join(buildPath, "static");
  if (fs.existsSync(staticPath)) {
    analyzeStaticAssets(staticPath);
  }

  // Check package.json for dependencies
  const packagePath = path.join(process.cwd(), "package.json");
  if (fs.existsSync(packagePath)) {
    analyzeDependencies(packagePath);
  }

  // Performance recommendations
  provideRecommendations();
}

function analyzeStaticAssets(staticPath) {
  log("\n📦 Static Assets Analysis:", "bright");
  log("----------------------------", "blue");

  try {
    const chunks = path.join(staticPath, "chunks");
    if (fs.existsSync(chunks)) {
      const files = fs.readdirSync(chunks, { withFileTypes: true });
      const jsFiles = files
        .filter((file) => file.isFile() && file.name.endsWith(".js"))
        .map((file) => {
          const filePath = path.join(chunks, file.name);
          const stats = fs.statSync(filePath);
          return {
            name: file.name,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024),
          };
        })
        .sort((a, b) => b.size - a.size);

      log(`📊 JavaScript Chunks (${jsFiles.length} files):`, "green");
      let totalSize = 0;

      jsFiles.slice(0, 10).forEach((file, index) => {
        const sizeColor =
          file.sizeKB > 100 ? "red" : file.sizeKB > 50 ? "yellow" : "green";
        log(`  ${index + 1}. ${file.name} - ${file.sizeKB} KB`, sizeColor);
        totalSize += file.size;
      });

      if (jsFiles.length > 10) {
        const remaining = jsFiles.slice(10);
        const remainingSize = remaining.reduce(
          (sum, file) => sum + file.size,
          0
        );
        totalSize += remainingSize;
        log(
          `  ... and ${remaining.length} more files (${Math.round(
            remainingSize / 1024
          )} KB)`,
          "blue"
        );
      }

      log(
        `\n📈 Total JS Bundle Size: ${Math.round(totalSize / 1024)} KB`,
        "bright"
      );

      // Identify large chunks that might need optimization
      const largeChunks = jsFiles.filter((file) => file.sizeKB > 100);
      if (largeChunks.length > 0) {
        log(`\n⚠️  Large chunks detected (>100KB):`, "yellow");
        largeChunks.forEach((chunk) => {
          log(`  • ${chunk.name} - ${chunk.sizeKB} KB`, "yellow");
        });
      }
    }
  } catch (error) {
    log(`❌ Error analyzing static assets: ${error.message}`, "red");
  }
}

function analyzeDependencies(packagePath) {
  log("\n📚 Dependencies Analysis:", "bright");
  log("-------------------------", "blue");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Check for heavy dependencies
    const heavyDeps = ["gsap", "react-window", "next", "@next/bundle-analyzer"];

    const foundHeavyDeps = heavyDeps.filter((dep) => dependencies[dep]);

    if (foundHeavyDeps.length > 0) {
      log("🔍 Heavy dependencies found:", "yellow");
      foundHeavyDeps.forEach((dep) => {
        log(`  • ${dep} (${dependencies[dep]})`, "yellow");
      });
    }

    // Check for potential tree-shaking opportunities
    const treeShakingCandidates = ["lodash", "moment", "material-ui"];
    const foundCandidates = treeShakingCandidates.filter(
      (dep) => dependencies[dep]
    );

    if (foundCandidates.length > 0) {
      log("\n🌳 Tree-shaking optimization candidates:", "magenta");
      foundCandidates.forEach((dep) => {
        log(`  • ${dep} - Consider importing specific modules only`, "magenta");
      });
    }

    log(
      `\n📊 Total dependencies: ${Object.keys(dependencies).length}`,
      "green"
    );
  } catch (error) {
    log(`❌ Error analyzing dependencies: ${error.message}`, "red");
  }
}

function provideRecommendations() {
  log("\n💡 Optimization Recommendations:", "bright");
  log("=================================", "blue");

  const recommendations = [
    "🎯 Use dynamic imports for heavy components (GSAP, complex galleries)",
    "🖼️ Implement progressive image loading with Next.js Image",
    "📦 Split vendor bundles for better caching",
    "🗜️ Enable compression and modern JavaScript output",
    "⚡ Use React.lazy() for code splitting",
    "🔄 Implement service worker for caching",
    "📊 Monitor Core Web Vitals regularly",
    "🎨 Optimize CSS with critical path extraction",
    "📱 Use responsive images with proper sizing",
    "⚡ Preload critical resources",
  ];

  recommendations.forEach((rec, index) => {
    log(`${index + 1}. ${rec}`, "green");
  });

  log("\n🚀 Next Steps:", "bright");
  log('1. Run "npm run analyze" to see detailed bundle composition', "cyan");
  log('2. Check lighthouse scores with "npm run lighthouse"', "cyan");
  log("3. Monitor bundle size changes in CI/CD", "cyan");
}

// Performance monitoring functions
function createPerformanceConfig() {
  const config = {
    ci: {
      collect: {
        numberOfRuns: 3,
        settings: {
          preset: "desktop",
        },
      },
      assert: {
        assertions: {
          "categories:performance": ["warn", { minScore: 0.9 }],
          "categories:accessibility": ["error", { minScore: 0.9 }],
          "categories:best-practices": ["warn", { minScore: 0.9 }],
          "categories:seo": ["warn", { minScore: 0.9 }],
        },
      },
    },
  };

  const configPath = path.join(process.cwd(), "lighthouserc.js");
  fs.writeFileSync(
    configPath,
    `module.exports = ${JSON.stringify(config, null, 2)}`
  );
  log("✅ Created lighthouse configuration", "green");
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--config")) {
    createPerformanceConfig();
  } else {
    analyzeBundle();
  }
}

module.exports = {
  analyzeBundle,
  createPerformanceConfig,
};
