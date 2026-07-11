# Seam QA checklist

- [ ] Leg N+1 was conditioned from the exact extracted final frame of leg N.
- [ ] No camera direction or velocity reversal at the handoff.
- [ ] First decoded frame of N+1 visually matches the N handoff frame.
- [ ] Materials, light, miniature scale, and camera height remain coherent.
- [ ] No text, letters, logos, or people appeared.
- [ ] Desktop encodes use native source resolution and GOP 8.
- [ ] Mobile encodes fit within 1280×720, use even dimensions, and GOP 4.
- [ ] Outputs contain no audio and use yuv420p with faststart.
- [ ] Seek-test the seam in Chromium, Firefox, Safari, and iOS Safari before calling it seamless.
- [ ] Record any mismatch; do not hide it with a claim. A short crossfade is fallback, not proof of continuity.
