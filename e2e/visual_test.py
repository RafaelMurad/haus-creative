#!/usr/bin/env python3
"""
Visual regression test script for HAUS Creative portfolio.

Captures screenshots of all pages at desktop (1920x1080) and mobile (375x812)
viewports, then compares against baselines using file-hash and dimension checks.

Usage:
    # Capture baselines (first run or after intentional visual changes):
    python3 e2e/visual_test.py --baseline

    # Compare current against baselines:
    python3 e2e/visual_test.py

    # With server management (recommended):
    python3 .agents/skills/webapp-testing/scripts/with_server.py \
        --server "npm start" --port 3000 -- python3 e2e/visual_test.py

    # Update a single baseline:
    python3 e2e/visual_test.py --baseline --page /about
"""

import argparse
import hashlib
import json
import os
import struct
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")

VIEWPORTS = {
    "desktop": {"width": 1920, "height": 1080},
    "mobile": {"width": 375, "height": 812},
}

# All routes to test — matches the 14 known routes
PAGES = [
    "/",
    "/about",
    "/contact",
    "/work",
    "/work/ouronyx",
    "/work/marie-claire-arabia",
    "/work/ysl",
    "/work/wao-cosmo",
    "/work/vivara",
    "/work/bucherer-summer",
    "/work/sk",
    "/work/bfj",
    "/work/life",
    "/work/bride-story",
]

# Directories
SCRIPT_DIR = Path(__file__).resolve().parent
BASELINE_DIR = SCRIPT_DIR / "screenshots" / "baseline"
CURRENT_DIR = SCRIPT_DIR / "screenshots" / "current"


# ---------------------------------------------------------------------------
# Comparison utilities
# ---------------------------------------------------------------------------


def _png_dimensions(filepath: Path) -> tuple:
    """Read width and height from a PNG file's IHDR chunk (fast, no decoding)."""
    with open(filepath, "rb") as f:
        sig = f.read(8)
        if sig != b"\x89PNG\r\n\x1a\n":
            raise ValueError(f"Not a valid PNG: {filepath}")
        f.read(4)  # chunk length
        chunk_type = f.read(4)
        if chunk_type != b"IHDR":
            raise ValueError(f"First chunk is not IHDR: {filepath}")
        ihdr = f.read(8)
        width = struct.unpack(">I", ihdr[0:4])[0]
        height = struct.unpack(">I", ihdr[4:8])[0]
    return width, height


def _file_hash(filepath: Path) -> str:
    """Compute SHA-256 hash of a file."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def compare_screenshots(baseline_path: Path, current_path: Path) -> dict:
    """
    Compare two PNG screenshots using hash and dimension checks.

    Returns dict with:
      - match: True if screenshots are identical
      - reason: human-readable explanation
      - baseline_hash, current_hash: SHA-256 hashes
      - baseline_size, current_size: (width, height) tuples
    """
    if not baseline_path.exists():
        return {
            "match": False,
            "reason": "baseline missing",
        }

    if not current_path.exists():
        return {
            "match": False,
            "reason": "current screenshot missing",
        }

    # Quick hash comparison — if identical bytes, it's a match
    b_hash = _file_hash(baseline_path)
    c_hash = _file_hash(current_path)

    if b_hash == c_hash:
        return {
            "match": True,
            "reason": "identical",
            "baseline_hash": b_hash[:12],
            "current_hash": c_hash[:12],
        }

    # Hashes differ — check dimensions to provide useful diagnostics
    try:
        b_dims = _png_dimensions(baseline_path)
        c_dims = _png_dimensions(current_path)
    except Exception as e:
        return {
            "match": False,
            "reason": f"failed to read PNG headers: {e}",
            "baseline_hash": b_hash[:12],
            "current_hash": c_hash[:12],
        }

    if b_dims != c_dims:
        return {
            "match": False,
            "reason": f"dimension mismatch: baseline {b_dims[0]}x{b_dims[1]} vs current {c_dims[0]}x{c_dims[1]}",
            "baseline_hash": b_hash[:12],
            "current_hash": c_hash[:12],
            "baseline_size": b_dims,
            "current_size": c_dims,
        }

    # Same dimensions, different content
    b_bytes = baseline_path.stat().st_size
    c_bytes = current_path.stat().st_size
    return {
        "match": False,
        "reason": f"pixel differences detected (same dimensions {b_dims[0]}x{b_dims[1]}, file size {b_bytes} vs {c_bytes} bytes)",
        "baseline_hash": b_hash[:12],
        "current_hash": c_hash[:12],
        "baseline_size": b_dims,
        "current_size": c_dims,
    }


# ---------------------------------------------------------------------------
# Screenshot capture
# ---------------------------------------------------------------------------


def _screenshot_name(page_path: str, viewport_name: str) -> str:
    """Generate a filename from page path and viewport name."""
    # "/" -> "home", "/about" -> "about", "/work/ysl" -> "work-ysl"
    if page_path == "/":
        slug = "home"
    else:
        slug = page_path.strip("/").replace("/", "-")
    return f"{slug}--{viewport_name}.png"


def capture_screenshots(
    output_dir: Path,
    pages: list,
    headless: bool = True,
) -> list:
    """
    Capture screenshots of all pages at all viewports.
    Returns a list of dicts with capture results.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)

        for viewport_name, viewport_size in VIEWPORTS.items():
            context = browser.new_context(
                viewport=viewport_size,
                device_scale_factor=1,
                # Disable animations for consistent screenshots
                reduced_motion="reduce",
            )

            page = context.new_page()

            for page_path in pages:
                url = f"{BASE_URL}{page_path}"
                filename = _screenshot_name(page_path, viewport_name)
                filepath = output_dir / filename

                try:
                    # Use "domcontentloaded" — pages with video elements may
                    # never fire "load" due to streaming media
                    page.goto(url, wait_until="domcontentloaded", timeout=30000)

                    # Wait for layout to settle, fonts and images to render
                    page.wait_for_timeout(2500)

                    # Capture full-page screenshot
                    page.screenshot(path=str(filepath), full_page=True)

                    results.append(
                        {
                            "page": page_path,
                            "viewport": viewport_name,
                            "file": filename,
                            "status": "ok",
                        }
                    )
                    print(f"  OK  {viewport_name:>7}  {page_path}")

                except Exception as e:
                    results.append(
                        {
                            "page": page_path,
                            "viewport": viewport_name,
                            "file": filename,
                            "status": "error",
                            "error": str(e),
                        }
                    )
                    print(f"  FAIL {viewport_name:>7}  {page_path}: {e}")

            context.close()

        browser.close()

    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Visual regression tests for HAUS Creative portfolio"
    )
    parser.add_argument(
        "--baseline",
        action="store_true",
        help="Capture baseline screenshots (overwrites existing baselines)",
    )
    parser.add_argument(
        "--page",
        type=str,
        default=None,
        help="Test a single page path (e.g. /about). Default: all pages.",
    )
    parser.add_argument(
        "--headed",
        action="store_true",
        help="Run browser in headed mode (visible window)",
    )
    args = parser.parse_args()

    # Filter pages if --page is specified
    pages = PAGES
    if args.page:
        if args.page not in PAGES:
            print(f"Unknown page: {args.page}")
            print(f"Available pages: {', '.join(PAGES)}")
            sys.exit(1)
        pages = [args.page]

    if args.baseline:
        # ---- Baseline mode ----
        print(
            f"\nCapturing baselines for {len(pages)} page(s) "
            f"x {len(VIEWPORTS)} viewport(s)..."
        )
        print(f"Output: {BASELINE_DIR}\n")

        results = capture_screenshots(BASELINE_DIR, pages, headless=not args.headed)

        ok_count = sum(1 for r in results if r["status"] == "ok")
        fail_count = sum(1 for r in results if r["status"] == "error")
        total = len(results)

        print(f"\nBaseline capture complete: {ok_count}/{total} succeeded")
        if fail_count > 0:
            print(f"  {fail_count} failed — check errors above")
            sys.exit(1)

    else:
        # ---- Comparison mode ----
        print(
            f"\nCapturing current screenshots for {len(pages)} page(s) "
            f"x {len(VIEWPORTS)} viewport(s)..."
        )
        print(f"Output: {CURRENT_DIR}\n")

        capture_results = capture_screenshots(
            CURRENT_DIR, pages, headless=not args.headed
        )

        capture_errors = [r for r in capture_results if r["status"] == "error"]
        if capture_errors:
            print(f"\n{len(capture_errors)} capture error(s):")
            for r in capture_errors:
                print(f"  {r['viewport']} {r['page']}: {r['error']}")

        # Compare against baselines
        print("\nComparing against baselines...\n")
        comparison_results = []
        passed = 0
        failed = 0
        skipped = 0

        for r in capture_results:
            if r["status"] == "error":
                skipped += 1
                continue

            baseline_path = BASELINE_DIR / r["file"]
            current_path = CURRENT_DIR / r["file"]

            cmp = compare_screenshots(baseline_path, current_path)
            cmp["page"] = r["page"]
            cmp["viewport"] = r["viewport"]
            cmp["file"] = r["file"]
            comparison_results.append(cmp)

            if cmp["match"]:
                print(f"  PASS {r['viewport']:>7}  {r['page']}")
                passed += 1
            else:
                print(f"  FAIL {r['viewport']:>7}  {r['page']} — {cmp['reason']}")
                failed += 1

        # Summary
        total = passed + failed + skipped
        print(f"\n{'=' * 60}")
        print(
            f"Visual regression results: {passed} passed, "
            f"{failed} failed, {skipped} skipped / {total} total"
        )
        print(f"{'=' * 60}")

        # Write JSON report
        report_path = CURRENT_DIR / "report.json"
        report = {
            "summary": {
                "total": total,
                "passed": passed,
                "failed": failed,
                "skipped": skipped,
            },
            "results": comparison_results,
        }
        report_path.write_text(json.dumps(report, indent=2))
        print(f"\nReport written to: {report_path}")

        if failed > 0:
            sys.exit(1)


if __name__ == "__main__":
    main()
