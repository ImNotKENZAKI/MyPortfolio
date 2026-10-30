# Website gallery and motion workload revision

The old website index and single browser-framed preview made the work feel like a template. The replacement is an image-first project wall with two client collections, varied image widths and plain captions. All eight authentic screenshots, descriptions, project types and live destinations remain in the page as normal HTML.

## Presentation and browsing

- Mary Digi Solutions: agency website, Insurance & CPA, Real Estate and Healthcare.
- SRG Advisors: Review, STR Advisory, Second Opinion and Strategy.
- Desktop uses a 7/5-column rhythm with restrained vertical offsets. Tablet uses two equal columns; small phones use one column. Images reserve their actual dimensions and retain their native proportions.
- Each image opens the shared native dialog. Gallery-only controls browse all eight projects, with captions, count, keyboard arrows and the matching live-site link. Escape returns focus to the original image. Other proof dialogs keep their normal behavior.
- There is no gallery animation loop, image filter, canvas or background video. A small hover zoom and arrow movement respect motion pause and reduced motion. Native screenshot/live links remain available in unenhanced HTML.

## Motion workload

The existing 3D chrome assembly, scroll camera, story pinning, horizontal featured cases, Systems fan and Reels sequence remain. The changes reduce unnecessary work:

- The real WebGL hero now renders on demand and sleeps after entry, camera and pointer easing settle. It suspends offscreen. Diagnostic attributes update at a bounded rate. The drawing buffer is capped at 1.6 million desktop pixels; phone DPR is capped at 1.
- The Systems fan repaints on selection or layout changes. Reels cache their geometry and measurements, avoid per-frame layout reads and stop scheduling while offscreen.
- The page controller caches hero/page ranges and skips duplicate camera/style writes. Scroll progress uses a transform instead of changing its width.
- Heading and credential entrances retain their motion without animated blur. Navigation blur is reduced. The retired website selector, duplicate archive and film-wipe controller are removed.

## Verification

Source `85508d4` deployed successfully to the existing Vercel branch preview. The full-content audit passes: all nine original sections, five story records, four featured cases, six systems, twelve reels, six services, six credentials, three testimonials, eight contacts, four packages, 46 package inclusions and eleven add-ons remain. The eight gallery entries are checked against `projects.js` for exact title, description, type, image and live URL. All 26 referenced local media assets exist; JavaScript syntax and Git whitespace checks pass.

Browser observations on the deployed page:

- 1280 × 720: staggered project wall, no horizontal overflow; full-image viewer, next, previous, wraparound, matching URLs and Escape/focus return work.
- 768 × 1024: two equal image columns with readable captions and no horizontal overflow.
- 360 × 740: one image column, native screenshot aspect ratios, a 46px gallery heading and no overflowing headings; viewer fits the viewport with 44px browsing controls.
- 1920 × 1080: both client collections and all eight images load; varied widths and offsets remain within the page.
- Systems still fan in 3D and next selects GoHighLevel Funnel Map with the matching pressed control.
- All twelve Reels remain in the moving arc; selecting LONA Bag updates the pressed index and centers its card.
- Native camera scroll reached progress 1 and the renderer entered its sleeping state. Away from the hero, its frame count remained 26 across gallery browsing and scrolling, with its loop suspended.
- At the hero, the frame counter remained 31 with the renderer sleeping across successive observations. A fresh load began the assembly at reveal 0 with an active loop, then reached reveal 1 and slept at frame 84 with six draw calls.

Local screenshot evidence is saved in the task workspace under `artifacts/portfolio-review/website-gallery-*.png`.

These checks establish correct rendering and reduced idle/offscreen work; they are not an FPS benchmark or a guarantee for every device. A live OS-level reduced-motion override and a JavaScript-disabled browser session were not exercised in this pass. The fallback links and motion rules were inspected in source.

The original root site remains unchanged from `d39a7cd`. Main/production is not merged by this preview revision.
