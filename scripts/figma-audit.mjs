#!/usr/bin/env node

/**
 * Figma Gallery Layout Audit Script
 *
 * Queries the Figma REST API to extract layout properties for each project's
 * gallery items (desktop + mobile frames). Outputs a structured JSON report
 * used to align the GalleryGrid component with Figma designs.
 *
 * Usage:
 *   node scripts/figma-audit.mjs
 *
 * Requires FIGMA_API_KEY in .env (same dir or parent).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Load .env
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = resolve(ROOT, ".env");
  const content = readFileSync(envPath, "utf-8");
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

const env = loadEnv();
const API_KEY = env.FIGMA_API_KEY;
if (!API_KEY) {
  console.error("ERROR: FIGMA_API_KEY not found in .env");
  process.exit(1);
}

const FILE_KEY = "DfLEWBgyOQxK8Utc1TSyQY";
const API_BASE = "https://api.figma.com/v1";

// ---------------------------------------------------------------------------
// Project frame definitions
// ---------------------------------------------------------------------------
// For projects with duplicate frames, both are listed for comparison.
const PROJECTS = [
  {
    slug: "marie-claire-arabia",
    desktop: ["118:122"],
    mobile: ["118:46"],
  },
  {
    slug: "ysl",
    desktop: ["141:2"],
    mobile: ["141:110"],
  },
  {
    slug: "wao-cosmo",
    desktop: ["497:102", "368:31"],   // newer first, older second
    mobile: ["497:2", "368:225"],
  },
  {
    slug: "vivara",
    desktop: ["424:1202"],
    mobile: ["140:30"],
  },
  {
    slug: "bucherer-summer",
    desktop: ["240:48"],
    mobile: ["293:1183"],
  },
  {
    slug: "sk",
    desktop: ["296:1672"],
    mobile: ["328:314"],
  },
  {
    slug: "bfj",
    desktop: ["363:2", "447:450"],   // original + duplicate
    mobile: ["371:425"],
  },
  {
    slug: "life",
    desktop: ["287:13"],
    mobile: ["287:519", "447:288"],   // original + duplicate
  },
  {
    slug: "ouronyx",
    desktop: ["442:833"],
    mobile: ["447:105"],
  },
];

// ---------------------------------------------------------------------------
// Rate-limited Figma API fetcher
// ---------------------------------------------------------------------------
let lastRequestTime = 0;
const MIN_DELAY_MS = 15000; // 15s between requests — Figma rate limits aggressively
const MAX_RETRY_WAIT_S = 90; // Never wait more than 90s for retry
let retryCount = 0;

async function figmaFetch(path) {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY_MS) {
    const wait = MIN_DELAY_MS - elapsed;
    console.log(`  ⏳ Rate limit: waiting ${(wait / 1000).toFixed(1)}s...`);
    await new Promise((r) => setTimeout(r, wait));
  }

  const url = `${API_BASE}${path}`;
  console.log(`  → GET ${path.slice(0, 100)}...`);
  lastRequestTime = Date.now();

  const res = await fetch(url, {
    headers: { "X-FIGMA-TOKEN": API_KEY },
  });

  if (res.status === 429) {
    retryCount++;
    // Cap retry wait — Figma sometimes returns absurd retry-after values
    const rawRetry = parseInt(res.headers.get("retry-after") || "60", 10);
    const waitSecs = Math.min(rawRetry, MAX_RETRY_WAIT_S);
    console.log(`  ⚠️  429 rate limited (attempt ${retryCount}) — waiting ${waitSecs}s (raw: ${rawRetry}s)...`);
    if (retryCount > 5) {
      throw new Error("Too many 429 retries — aborting. Try again later.");
    }
    await new Promise((r) => setTimeout(r, waitSecs * 1000));
    return figmaFetch(path); // retry
  }

  retryCount = 0; // reset on success

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Fetch node trees for given IDs (batched)
// ---------------------------------------------------------------------------
async function fetchNodes(nodeIds) {
  const ids = nodeIds.join(",");
  const data = await figmaFetch(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`);
  return data.nodes;
}

// ---------------------------------------------------------------------------
// Extract layout data from a frame node
// ---------------------------------------------------------------------------
function isGalleryItem(node) {
  // Skip non-visual elements: text sections, headers, footers, rectangles (backgrounds)
  const name = (node.name || "").toUpperCase();
  const skipPrefixes = ["TXT", "HEAD", "RODAPÉ", "FOOTER", "RECTANGLE", "NAVBAR", "NAV", "LOGO"];
  for (const prefix of skipPrefixes) {
    if (name.startsWith(prefix)) return false;
  }
  // Skip very small elements (decorative lines, dots)
  if (node.absoluteBoundingBox) {
    const { width, height } = node.absoluteBoundingBox;
    if (width < 50 || height < 50) return false;
  }
  return true;
}

function extractFills(node) {
  const fills = [];
  if (node.fills && Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.visible === false) continue;
      if (fill.type === "SOLID" && fill.color) {
        const { r, g, b } = fill.color;
        const hex = "#" + [r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("");
        fills.push({ type: "SOLID", color: hex.toUpperCase() });
      } else if (fill.type === "IMAGE") {
        fills.push({ type: "IMAGE", imageRef: fill.imageRef });
      }
    }
  }
  return fills;
}

function simplifyRatio(w, h) {
  // Return aspect ratio as a simplified string like "3/4", "16/9", "1/1"
  if (w === 0 || h === 0) return "0/0";
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const rw = Math.round(w);
  const rh = Math.round(h);
  const d = gcd(rw, rh);
  const sw = rw / d;
  const sh = rh / d;
  // If the simplified ratio has large numbers, approximate to common ratios
  const decimal = w / h;
  const commonRatios = [
    { r: "1/1", v: 1 },
    { r: "3/4", v: 0.75 },
    { r: "4/3", v: 1.333 },
    { r: "16/9", v: 1.778 },
    { r: "9/16", v: 0.5625 },
    { r: "4/5", v: 0.8 },
    { r: "5/4", v: 1.25 },
    { r: "2/3", v: 0.667 },
    { r: "3/2", v: 1.5 },
    { r: "1/2", v: 0.5 },
    { r: "2/1", v: 2 },
    { r: "610/790", v: 0.772 },  // phone frame
  ];
  for (const { r, v } of commonRatios) {
    if (Math.abs(decimal - v) < 0.03) return r;
  }
  // Return simplified if small numbers, else decimal approximation
  if (sw <= 20 && sh <= 20) return `${sw}/${sh}`;
  return `${Math.round(decimal * 100) / 100}`;
}

function analyseFrame(frameNode) {
  if (!frameNode) return null;

  const frame = frameNode.document || frameNode;
  const frameBbox = frame.absoluteBoundingBox;
  if (!frameBbox) return null;

  const result = {
    frameId: frame.id,
    frameName: frame.name,
    frameWidth: frameBbox.width,
    frameHeight: frameBbox.height,
    layoutMode: frame.layoutMode || null,
    itemSpacing: frame.itemSpacing ?? null,
    paddingLeft: frame.paddingLeft ?? null,
    paddingRight: frame.paddingRight ?? null,
    paddingTop: frame.paddingTop ?? null,
    paddingBottom: frame.paddingBottom ?? null,
    fills: extractFills(frame),
    childCount: (frame.children || []).length,
    items: [],
  };

  const children = frame.children || [];
  for (const child of children) {
    if (!isGalleryItem(child)) continue;

    const bbox = child.absoluteBoundingBox;
    if (!bbox) continue;

    const item = {
      nodeId: child.id,
      name: child.name,
      type: child.type,
      x: Math.round(bbox.x - frameBbox.x),  // relative to frame
      y: Math.round(bbox.y - frameBbox.y),
      width: Math.round(bbox.width),
      height: Math.round(bbox.height),
      aspectRatio: simplifyRatio(bbox.width, bbox.height),
      fills: extractFills(child),
      isFullWidth: bbox.width >= frameBbox.width * 0.9,
      widthPercent: Math.round((bbox.width / frameBbox.width) * 100),
      children: [],
    };

    // Inspect one level deeper to detect padding (container → image)
    if (child.children && child.children.length > 0) {
      for (const grandchild of child.children) {
        const gcBbox = grandchild.absoluteBoundingBox;
        if (!gcBbox) continue;
        const gcItem = {
          nodeId: grandchild.id,
          name: grandchild.name,
          type: grandchild.type,
          x: Math.round(gcBbox.x - bbox.x), // relative to parent
          y: Math.round(gcBbox.y - bbox.y),
          width: Math.round(gcBbox.width),
          height: Math.round(gcBbox.height),
          fills: extractFills(grandchild),
        };
        // Calculate padding if this is an image inside a container
        if (grandchild.fills?.some((f) => f.type === "IMAGE") || grandchild.type === "RECTANGLE") {
          gcItem.paddingLeft = Math.round(gcBbox.x - bbox.x);
          gcItem.paddingTop = Math.round(gcBbox.y - bbox.y);
          gcItem.paddingRight = Math.round(bbox.x + bbox.width - (gcBbox.x + gcBbox.width));
          gcItem.paddingBottom = Math.round(bbox.y + bbox.height - (gcBbox.y + gcBbox.height));
        }
        item.children.push(gcItem);
      }
    }

    result.items.push(item);
  }

  // Sort items by Y position (top to bottom), then X (left to right)
  result.items.sort((a, b) => {
    if (Math.abs(a.y - b.y) > 20) return a.y - b.y;
    return a.x - b.x;
  });

  // Compute inter-row gaps
  result.rowAnalysis = analyseRows(result.items, frameBbox.width);

  return result;
}

/**
 * Group items into rows and compute gaps between them.
 */
function analyseRows(items, frameWidth) {
  if (items.length === 0) return { rows: [], gaps: [] };

  // Group by approximate Y position (items within 20px are same row)
  const rows = [];
  let currentRow = [items[0]];

  for (let i = 1; i < items.length; i++) {
    const prev = currentRow[0];
    const curr = items[i];
    if (Math.abs(curr.y - prev.y) <= 20) {
      currentRow.push(curr);
    } else {
      rows.push(currentRow);
      currentRow = [curr];
    }
  }
  rows.push(currentRow);

  // Compute gaps between consecutive rows
  const gaps = [];
  for (let i = 1; i < rows.length; i++) {
    const prevRow = rows[i - 1];
    const currRow = rows[i];
    const prevBottom = Math.max(...prevRow.map((item) => item.y + item.height));
    const currTop = Math.min(...currRow.map((item) => item.y));
    gaps.push(Math.round(currTop - prevBottom));
  }

  return {
    rowCount: rows.length,
    rows: rows.map((row, idx) => ({
      index: idx,
      itemCount: row.length,
      items: row.map((item) => ({
        name: item.name,
        nodeId: item.nodeId,
        widthPercent: item.widthPercent,
        aspectRatio: item.aspectRatio,
        isFullWidth: item.isFullWidth,
      })),
    })),
    gaps,
    averageGap: gaps.length > 0 ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0,
  };
}

// ---------------------------------------------------------------------------
// Main — single API call strategy
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== Figma Gallery Layout Audit ===\n");
  console.log(`File: ${FILE_KEY}`);
  console.log(`Projects: ${PROJECTS.length}\n`);

  // Step 1: Collect ALL node IDs across ALL projects into one batch
  const allNodeIds = new Set();
  for (const project of PROJECTS) {
    for (const id of project.desktop) allNodeIds.add(id);
    for (const id of project.mobile) allNodeIds.add(id);
  }
  const batchIds = [...allNodeIds];
  console.log(`Fetching ${batchIds.length} frames in a single API call...\n`);

  let allNodes;
  try {
    allNodes = await fetchNodes(batchIds);
  } catch (err) {
    console.error(`Fatal: Could not fetch nodes: ${err.message}`);
    process.exit(1);
  }

  console.log(`\nReceived data for ${Object.keys(allNodes).length} nodes.\n`);

  // Step 2: Process each project using the cached data
  const report = {
    generatedAt: new Date().toISOString(),
    figmaFileKey: FILE_KEY,
    projects: {},
  };

  for (const project of PROJECTS) {
    console.log(`\n📋 ${project.slug}`);
    console.log("─".repeat(40));

    const projectReport = { desktop: null, mobile: null, duplicates: {} };

    // Process desktop frames
    for (let i = 0; i < project.desktop.length; i++) {
      const id = project.desktop[i];
      const nodeData = allNodes[id];
      if (!nodeData) {
        console.log(`  ⚠️  Desktop frame ${id} not found`);
        continue;
      }
      const analysis = analyseFrame(nodeData);
      if (i === 0) {
        projectReport.desktop = analysis;
        console.log(`  ✅ Desktop: ${analysis?.frameName} (${analysis?.items.length} items, ${analysis?.rowAnalysis.rowCount} rows)`);
      } else {
        projectReport.duplicates[`desktop_alt_${id}`] = analysis;
        console.log(`  📎 Desktop alt: ${analysis?.frameName} (${analysis?.items.length} items, ${analysis?.rowAnalysis.rowCount} rows)`);
      }
    }

    // Process mobile frames
    for (let i = 0; i < project.mobile.length; i++) {
      const id = project.mobile[i];
      const nodeData = allNodes[id];
      if (!nodeData) {
        console.log(`  ⚠️  Mobile frame ${id} not found`);
        continue;
      }
      const analysis = analyseFrame(nodeData);
      if (i === 0) {
        projectReport.mobile = analysis;
        console.log(`  ✅ Mobile: ${analysis?.frameName} (${analysis?.items.length} items, ${analysis?.rowAnalysis.rowCount} rows)`);
      } else {
        projectReport.duplicates[`mobile_alt_${id}`] = analysis;
        console.log(`  📎 Mobile alt: ${analysis?.frameName} (${analysis?.items.length} items, ${analysis?.rowAnalysis.rowCount} rows)`);
      }
    }

    // Log gap summary
    if (projectReport.desktop?.rowAnalysis) {
      const { gaps, averageGap } = projectReport.desktop.rowAnalysis;
      if (gaps.length > 0) {
        console.log(`  📐 Desktop gaps: [${gaps.join(", ")}] avg=${averageGap}px`);
      } else {
        console.log(`  📐 Desktop gaps: none (flush)`);
      }
    }

    report.projects[project.slug] = projectReport;
  }

  // Write report
  const outPath = resolve(__dirname, "figma-layout-report.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\n✅ Report written to ${outPath}`);
  console.log(`   ${Object.keys(report.projects).length} projects analysed`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
