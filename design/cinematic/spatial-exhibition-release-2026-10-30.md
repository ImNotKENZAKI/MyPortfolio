# Spatial website exhibition and root release

The previous image wall still felt ordinary to the portfolio owner. Website work now becomes a distinct light chapter with a real Three.js screen installation, rather than another repeated card layout. Original project screenshots sit on thin beveled panels with supports, floor lighting and contact shadows. Selecting a screen moves the chosen project forward while neighboring panels take staggered positions; the camera eases into a new perspective. Direct screen selection uses actual 3D raycasting.

## Complete experience

- All eight MDS/SRG builds retain their original names, descriptions, types, screenshot proportions and live destinations. They can be browsed through visible stage arrows, keyboard controls, phone swipe or the complete thumbnail strip.
- The shared screenshot dialog supports the selected exhibition project, then all eight projects, while returning focus to the visible exhibition action on close.
- The complete native catalog starts open. Only a successfully rendered, visible 3D scene collapses it. Failure keeps the native catalog open; no project depends on WebGL to be read or opened.
- The original hero, story, featured cases, Systems fan, Reels, services/packages, credentials, testimonials, speaking evidence and contacts remain. This revision does not replace those collections with placeholder content.

## Rendering bounds

Both 3D scenes render on demand and sleep after interpolation settles. Offscreen and hidden-page states suspend rendering. Exhibition textures load for nearby projects, retain native proportions and are disposed with the scene. The new scene caps its drawing buffer at 1.4 million desktop pixels and 0.8 million phone pixels, with phone DPR capped at 1. No postprocessing, live video textures, shadow maps, paid asset services or new runtime dependencies are introduced.

## Production entry

The complete implementation is promoted into root `index.html`, rather than a redirect or a base-URL workaround. Runtime modules/styles stay under `direction-preview/`. Relative document assets are rebased while native `#anchors` and inline SVG stay intact. Root metadata is indexable and uses the supplied portfolio domain. The noindex preview route remains available. Robots and sitemap are updated accordingly.

Original HTML is archived at `design/baseline/original-index.html`; immutable Git commit `d39a7cd` remains the audit baseline. The production helper validates 48 local file references, twelve modules, eight stylesheets, internal anchors and unchanged embedded SVG. Separate completeness reports for production and preview preserve all nine original sections and exact service/package data, plus all eight new website records.

## Browser observations before main publication

- The deployed branch root `/` loads `direction-preview/portfolio-page.js`; navigation remains on native root anchors.
- 1280 × 720: real renderer ready, multiple textured physical panels visible, no horizontal overflow. Clicking the CPA screen selected original index 5 and updated its title, counter, live URL and screenshot action. The shared dialog showed project 02/08 and returned focus to the exhibition action on Escape. The renderer settled to sleeping at frame 202.
- 360 × 740: no heading or document overflow; real 3D renderer ready, phone controls measure 44 × 44px. Next selected MDS / Real Estate with its matching destination. The native screenshot dialog remains available.
- 768 × 1024: no document or heading overflow. Opening the native catalog exposed all eight exact project names; closing it restored the compact exhibition. The 3D renderer suspended while its stage was offscreen.
- Manual motion pause and the catalog fallback are preserved. Source/controller checks cover keyboard modifiers, horizontal-only swipe, lazy initialization, hidden/offscreen scheduling and disposal. All active JavaScript syntax checks and complete-content audits pass.

Unloaded distant screens remain hidden until their screenshots arrive, preventing empty placeholder panels during browsing. A deferred-texture lifecycle check verified initial loading, selection of an unloaded project, no blank draws, and stopped scheduling after pause/disposal.

These observations verify functionality, actual GPU rendering and bounded idle work. They are not a universal FPS benchmark. Forced GPU loss and an OS-level reduced-motion override were not exercised in this browser pass.

Local proof screenshots are saved under the task's `artifacts/portfolio-review/` directory. Main publication is performed only after the final root and responsive checks; its resulting commit/deployment is reported to the owner.
