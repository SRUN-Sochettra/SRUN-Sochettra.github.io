#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
production/scripts/check-tools.sh
mkdir -p production/raw/stills production/logs
HELP=production/logs/higgsfield-image-help.txt
higgsfield image --help >"$HELP" 2>&1 || { echo "The installed CLI does not expose 'image'. Inspect production/logs/higgsfield-help.txt." >&2; exit 1; }
for flag in --model --prompt-file --output; do grep -q -- "$flag" "$HELP" || { echo "Installed image command lacks required $flag; no generation started." >&2; exit 1; }; done
pids=""
for prompt in production/prompts/*-still.txt; do id=$(basename "$prompt" -still.txt); out="production/raw/stills/$id.png"; log="production/logs/$id-still.log"; [ -s "$out" ] && continue
  (attempt=1; while [ "$attempt" -le 3 ]; do higgsfield image --model gpt_image_2 --prompt-file "$prompt" --output "$out" >>"$log" 2>&1 && exit 0; sleep $((attempt*4)); attempt=$((attempt+1)); done; exit 1) & pids="$pids $!"
done
failed=0; for pid in $pids; do wait "$pid" || failed=1; done; [ "$failed" -eq 0 ] || { echo "One or more still jobs failed; inspect production/logs." >&2; exit 1; }
