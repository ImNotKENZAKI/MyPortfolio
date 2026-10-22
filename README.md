# KENZAKI — portfolio and cinematic 3D review

The original portfolio is the content baseline. Its index, styles, and interaction script have been restored from commit d39a7cd. The nine original sections, twelve video projects, six system case studies, service previews, pricing packages, proof links, client feedback, and contact hub remain available.

## Review the new direction

Open `/direction-preview/` on the Vercel preview. This is a cinematic 3D direction for review before applying the selected look across the full portfolio.

The preview uses an actual WebGL architectural gallery with an extruded Kinetic K sculpture, physical metal materials, generated softbox lighting, a reflective floor, and a perspective camera driven by native scrolling. The camera travels from the entrance to eight MDS/SRG website screens and a dedicated speaking scene. The speaking certificate and event video are available directly, and an editorial profile and full-portfolio index follow the experience. The complete existing portfolio remains at `/`.

Kinetic K remains the selected identity. Its original vector geometry is rebuilt as beveled 3D shapes. The previous flat prototype sources and original artwork remain available for reference; they are no longer the active preview.

Three.js 0.180.0 and its Reflector helper are vendored under `direction-preview/vendor/` with the MIT license, so the scene does not depend on a third-party script CDN. `scene.js` owns the world and camera; `cinema.js` owns navigation, project controls, accessibility, video, and fallbacks; `projects.js` contains the eight supplied website destinations. Reference videos informed the lighting, camera travel, scale, and scene transitions; no third-party reference footage is published as portfolio work.

## Next approved stage

After the refined visual direction is reviewed, carry the selected Kinetic identity across the original story journey, featured work, Systems Stack, Reels Universe, service gallery, credentials, feedback, packages, and contact hub. Add the eight supplied MDS/SRG web projects, updated workflow skills, and the October 2 cybersecurity speaking evidence without removing original material. The source screenshots, event photos, certificate, and event video are already retained in this branch.

## Local preview

Run `node scripts/serve.mjs`, then open `http://127.0.0.1:4173/direction-preview/`. No frontend dependency installation or build step is needed. Original server-side email code and its existing SMTP environment configuration are unchanged.

Motion respects the device's reduced-motion setting and can be paused in the header. The renderer stops outside the experience and while the tab is hidden. A conventional image gallery is used when WebGL is unavailable. Native page scrolling, direct chapter links, keyboard project controls, and a skip-experience link remain available. The event video plays only after an explicit action.

Production is not changed by this draft branch. Review the Vercel preview before merging.
