#!/bin/bash
# Convert all gallery PNGs to high-quality WebP
# Uses cwebp with quality 90 and method 6 (best compression)
set -euo pipefail

QUALITY=90
ASSETS_DIR="public/assets"

for dir in "$ASSETS_DIR"/gallery{1,2,3,4,5,6,7,8,9,10}; do
  [ -d "$dir" ] || continue
  echo "Processing $(basename "$dir")..."
  for png in "$dir"/*.png; do
    [ -f "$png" ] || continue
    webp="${png%.png}.webp"
    cwebp -q "$QUALITY" -m 6 "$png" -o "$webp"
    echo "  Converted: $(basename "$png") -> $(basename "$webp")"
  done
done

echo ""
echo "Conversion complete. Verify WebP files, then remove PNGs with:"
echo "  find public/assets -name '*.png' -delete"
