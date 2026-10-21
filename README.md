# KENZAKI — portfolio and V2 direction preview

The original portfolio is the content baseline. Its index, styles, and interaction script have been restored from commit d39a7cd. The nine original sections, twelve video projects, six system case studies, service previews, pricing packages, proof links, client feedback, and contact hub remain available.

## Review the new direction

Open `/direction-preview/` on the Vercel preview. This is the first visual and motion prototype for review before applying the selected direction across the full portfolio.

It includes a new hero with the original portrait, original Imagegen chrome artwork, responsive parallax, custom signal trails, a scroll-driven project stage, and three selectable vector logo concepts. The complete existing portfolio remains at `/`.

- A: Kinetic K — angular, directional, and bold.
- B: Nexus K — connected, geometric, and open.
- C: Signature K — expressive and personal.

The concept marks are in `direction-preview/assets/`. The built-in Imagegen prompt is saved alongside the optimized hero artwork as `artwork-prompt.txt`. The original generated PNG is retained for future art direction.

## Next approved stage

Once the visual direction and logo are selected, carry them across the original story journey, featured work, Systems Stack, Reels Universe, service gallery, credentials, feedback, packages, and contact hub. Add the eight supplied MDS/SRG web projects, updated workflow skills, and the October 2 cybersecurity speaking evidence without removing original material. The source screenshots, event photos, certificate, and event video are already retained in this branch.

## Local preview

Run `node scripts/serve.mjs`, then open `http://127.0.0.1:4173/direction-preview/`. No frontend dependency installation or build step is needed. Original server-side email code and its existing SMTP environment configuration are unchanged.

Motion respects the device's reduced-motion setting and can be paused in the prototype header. The new canvas stops while the hero is out of view or the tab is hidden. Project controls and logo options work with the keyboard.

Production is not changed by this draft branch. Review the Vercel preview before merging.
