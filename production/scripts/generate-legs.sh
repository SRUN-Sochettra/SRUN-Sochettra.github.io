#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
production/scripts/check-tools.sh
mkdir -p production/raw/legs production/raw/handoffs production/logs
HELP=production/logs/higgsfield-video-help.txt
higgsfield video --help >"$HELP" 2>&1 || { echo "The installed CLI does not expose 'video'." >&2; exit 1; }
for flag in --model --prompt-file --start-image --output; do grep -q -- "$flag" "$HELP" || { echo "Installed video command lacks required $flag; no generation started." >&2; exit 1; }; done
prev=""
for prompt in production/prompts/*-video.txt; do
  id=$(basename "$prompt" -video.txt); out="production/raw/legs/$id.mp4"; log="production/logs/$id-video.log"
  if [ -z "$prev" ]; then start="production/raw/stills/$id.png"; else start="$prev"; fi
  [ -s "$start" ] || { echo "Missing conditioned start image: $start" >&2; exit 1; }
  if [ ! -s "$out" ]; then
    attempt=1; ok=0; while [ "$attempt" -le 3 ]; do higgsfield video --model seedance_2_0 --prompt-file "$prompt" --start-image "$start" --output "$out" >>"$log" 2>&1 && { ok=1; break; }; sleep $((attempt*5)); attempt=$((attempt+1)); done
    [ "$ok" -eq 1 ] || { echo "Leg failed: $id; inspect $log" >&2; exit 1; }
  fi
  prev="production/raw/handoffs/$id-final.png"
  ffmpeg -hide_banner -loglevel error -y -sseof -0.05 -i "$out" -frames:v 1 "$prev" || { echo "Final-frame extraction failed: $id" >&2; exit 1; }
done
