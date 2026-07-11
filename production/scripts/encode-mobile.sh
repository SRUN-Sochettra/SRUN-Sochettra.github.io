#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."; command -v ffmpeg >/dev/null; command -v ffprobe >/dev/null
mkdir -p public/world/video production/encoded/mobile
for src in production/raw/legs/*.mp4; do [ -e "$src" ] || { echo "No raw legs found." >&2; exit 1; }; id=$(basename "$src" .mp4); out="production/encoded/mobile/$id-m.mp4"
 ffmpeg -hide_banner -y -i "$src" -an -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$out"
 ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,pix_fmt -of default=nw=1 "$out"
 cp "$out" "public/world/video/$id-m.mp4"
done
