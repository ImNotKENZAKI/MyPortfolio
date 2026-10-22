# KENZAKI — first cinematic motion test

Status: production brief and resource preparation. No AI video has been generated. The current live WebGL gallery is a spatial prototype, not an implementation of the generated art target.

## One continuous visual language

Use the generated atelier storyboard as the visual target. Graphite stone provides quiet negative space; brushed metal carries the Kinetic geometry; restrained cyan identifies the creative/technical seam; warm light leads toward the human story. Real project screens and speaking evidence remain authentic media. Typography and readable navigation stay outside the generated images.

## First motion test

| Moment | Camera and image | Interaction | Transition and text |
| --- | --- | --- | --- |
| 0–2 s | Intimate macro view of a brushed bevel and cyan seam. Shallow focus, controlled highlights. | Waiting does not force a long intro. An obvious enter or skip choice remains. | Name and a short headline arrive only after the visual settles. |
| 2–5 s | Smooth dolly back with a gentle lateral reveal resolves the K and the architectural entrance. Same horizon, stone, and lighting. | Native scrolling advances the visual; reverse scrolling reverses the sequence when using a rendered frame sequence or real-time camera. | Maintain screen-space continuity for the cyan seam and the K's outline. Do not use a generic fade as the only bridge. |
| 5–8 s | Camera follows the geometric opening into the atelier. An occluding brushed-metal edge briefly fills the frame. | Pointer movement is subtle and never interferes with scroll, links, or mobile touch. | The occluding edge can hide a matched cut between pre-rendered detail and the real-time scene. Match direction, brightness, framing, and velocity before the cut. |
| 8–12 s | One real project exhibit resolves in focus. Surrounding architecture supports the composition. | Select a case, move previous/next, or open the real site. All controls remain keyboard accessible. | Project title and purpose appear as the camera settles; the live-site link is clear and stable. |

Timing is an editorial starting point, not a forced playback requirement. The website should respond to the visitor and remain usable before or after any cinematic sequence.

## Image-to-video generation brief

Input: `atelier-entrance-v1.png` as the visual identity and ending wide-shot reference. The matching `atelier-macro-v1.png` is prepared as the starting-frame candidate; the entrance is the ending wide-frame candidate. See `video-brief.json`.

> A single restrained premium architectural product-film move inside the same fictional graphite-basalt atelier at blue hour. Begin close to the finely brushed silver K bevel and its cyan seam; glide slowly back and laterally to reveal the exact split-stem angular K sculpture and the coastal aperture. Preserve the precise K silhouette, cyan accent geometry, stone architecture, lighting direction, distant coastline, exposure, and warm/cool palette. Physically credible parallax, subtle depth of field, natural highlight travel, no morphing, new objects, text, people, pulsing light, wobble, liquid metal, flicker, excessive bloom, or impossible camera acceleration. End with a stable wide composition and quiet left-side space for HTML typography. Silent output. Use a short shot suitable for controlled scroll playback or conversion to a frame sequence.

No frame sequence should be presented as interactive geometry by itself. If used, it provides a controlled cinematic bridge into real-time interactive exhibits. Do not substitute a panning still image for the requested camera move.

## Required resources and current state

| Resource | Current state | Before use |
| --- | --- | --- |
| Four-beat storyboard | Generated, saved | Review the unified visual direction. |
| Entrance keyframe | Generated, saved | Check headline placement and phone crop without covering the focal sculpture. |
| Basalt base color | Generated candidate | Test tiling, physical scale, contrast, and lighting in the renderer. |
| Brushed-metal base color | Generated candidate | Test grain scale on the actual K and specular behavior. |
| Roughness/normal detail | Not authored as a finished PBR set | Derive or author coherent maps; validate against the generated visual target. |
| Final 3D atelier model | Not built | Rebuild the prototype architecture to match the approved space rather than retaining the simple repeating portal room. |
| Matching macro keyframe | Generated, saved | Review start/end continuity and stability in the video test. |
| AI video bridge | Not generated | Add and connect a suitable generation service; Runway was suggested but connection is unconfirmed. |
| Actual work / speaking proof | Existing supplied assets | Keep original files and verified factual details. |
| Mobile experience | Prototype exists | Deliberate reframing and input testing; not an automatic desktop crop. |

## Review as a complete experience

- Visuals: material detail, composition, typography, lighting, depth, and a clear focal point all meet the same standard.
- Motion: camera speed, easing, parallax, occlusion, scene changes, and text timing support the story together.
- Interaction: scroll, project selection, links, keyboard, touch, pause, and skip remain predictable.
- Continuity: transitions connect spaces through framing and light; they do not read as unrelated animations stacked together.
- Performance: optimized assets, deliberate resolution, stable frame pacing, no unnecessary downloads before user action, reduced-motion support, and a readable fallback.
- Content: preserve every original portfolio section and work item; add the supplied projects and speaking proof without invented metrics or fake evidence.
