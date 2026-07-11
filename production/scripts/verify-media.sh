#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."; command -v ffprobe >/dev/null
for id in 01-origin 02-backend 03-product 04-ai 05-hardware 06-open-source 07-contact; do
 for f in "public/world/video/$id.mp4" "public/world/video/$id-m.mp4"; do [ -s "$f" ] || { echo "Missing: $f" >&2; exit 1; }; ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate -show_entries format=duration -of default=nw=1 "$f"; done
done
if find public/world/video -type f -name '*.mp4' -exec ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 {} \; | grep -q .; then echo "Audio track detected." >&2; exit 1; fi
echo "All expected media files passed structural validation. Frame-identical seams require visual and pixel-level review."
