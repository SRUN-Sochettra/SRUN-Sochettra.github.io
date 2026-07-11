#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."; command -v ffmpeg >/dev/null; command -v ffprobe >/dev/null
mkdir -p public/world/video production/encoded/desktop
for src in production/raw/legs/*.mp4; do [ -e "$src" ] || { echo "No raw legs found." >&2; exit 1; }; id=$(basename "$src" .mp4); out="production/encoded/desktop/$id.mp4"
 ffmpeg -hide_banner -y -i "$src" -an -vf "unsharp=5:5:0.8:5:5:0.0" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$out"
 ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,pix_fmt -of default=nw=1 "$out"
 cp "$out" "public/world/video/$id.mp4"
done
