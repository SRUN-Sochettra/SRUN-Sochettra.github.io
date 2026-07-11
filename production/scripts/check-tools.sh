#!/bin/sh
set -eu
for cmd in higgsfield ffmpeg ffprobe python3; do command -v "$cmd" >/dev/null 2>&1 || { echo "Missing required command: $cmd" >&2; exit 1; }; done
mkdir -p production/logs
if ! higgsfield auth status >production/logs/auth-status.log 2>&1; then
  echo "Higgsfield authentication is unavailable. Run: higgsfield auth login" >&2
  exit 2
fi
higgsfield --help >production/logs/higgsfield-help.txt 2>&1 || { echo "Unable to inspect Higgsfield CLI help." >&2; exit 1; }
# Never print auth output: it may contain account metadata.
echo "Tooling and Higgsfield authentication checks passed."
