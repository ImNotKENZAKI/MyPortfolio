# KENZAKI — portfolio and V2 direction preview

The original portfolio is the content baseline. Its index, styles, and interaction script have been restored from commit d39a7cd. The nine original sections, twelve video projects, six system case studies, service previews, pricing packages, proof links, client feedback, and contact hub remain available.

## Review the new direction

Open `/direction-preview/` on the Vercel preview. This is the first visual and motion prototype for review before applying the selected direction across the full portfolio.

It includes a new hero with the original portrait, original Imagegen chrome artwork, responsive parallax, custom signal trails, and a scroll-driven project stage. The portrait is bounded by the hero's height, with larger supporting text and quieter artwork. The complete existing portfolio remains at `/`.

Kinetic K is the selected identity. The identity section shows its monogram, signature, and palette. The other original vector concepts are retained in the assets for reference.

The concept marks are in `direction-preview/assets/`. The built-in Imagegen prompt is saved alongside the optimized hero artwork as `artwork-prompt.txt`. The original generated PNG is retained for future art direction.

## Next approved stage

After the refined visual direction is reviewed, carry the selected Kinetic identity across the original story journey, featured work, Systems Stack, Reels Universe, service gallery, credentials, feedback, packages, and contact hub. Add the eight supplied MDS/SRG web projects, updated workflow skills, and the October 2 cybersecurity speaking evidence without removing original material. The source screenshots, event photos, certificate, and event video are already retained in this branch.

## Local preview

Run `node scripts/serve.mjs`, then open `http://127.0.0.1:4173/direction-preview/`. No frontend dependency installation or build step is needed. Original server-side email code and its existing SMTP environment configuration are unchanged.

Motion respects the device's reduced-motion setting and can be paused in the prototype header. The new canvas stops while the hero is out of view or the tab is hidden. Project controls work with the keyboard.

Production is not changed by this draft branch. Review the Vercel preview before merging.
