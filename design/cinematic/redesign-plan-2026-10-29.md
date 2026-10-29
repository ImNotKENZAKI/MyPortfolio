# KENZAKI — complete portfolio redesign plan

Prepared October 29, 2026. Status: planning and content audit; this document does not implement or publish the redesign.

Implementation update, October 30: the complete original content and new additions are assembled in `/direction-preview/`, with a shared controller, responsive stylesheet, approved ad and actual real-time K scene. Content reconciliation passes. Browser verification is recorded separately in `implementation-review.md`. The original root site remains unchanged; no Blender film or production merge is claimed.

## The outcome

One complete portfolio, with the Kinetic identity, a carefully composed cinematic 3D opening, and every original detail integrated into the same design. The eight supplied websites and the cybersecurity speaking evidence extend the portfolio. Visitors can understand who John Jefferson Manalo is, examine his work and proof, see his services and packages, and contact him without returning to a separate old layout.

The current WebGL gallery is a technical prototype. Its repeating portals, multiple visible screens, bright reflections, decorative labels and independent movements compete for attention. The generated atelier images are visual references, not approved final layouts or a finished 3D scene. Adding more effects to this prototype will not resolve its composition.

## 1. Lock the complete content before layout changes

The original `index.html`, `css/style.css`, and `js/script.js` match baseline commit `d39a7cd5df112b391362d439cb273a97840c0d6b`. Use them as the content source. `content-preservation-baseline-2026-10-29.json` records the original text, actions, media references, dynamic content literals, source hashes and new additions for the later completeness audit.

Preserve paragraphs, descriptions, categories, skill bullets, tool lists, result statements, destinations, video IDs, testimonial quotations, package inclusions and contact details. A matching heading or a link to the old page does not count as migration. Retain all nine original anchor IDs so existing links continue to reach their content.

| Final location | Content that must be present in the new design | Treatment |
| --- | --- | --- |
| Home / `home` | Full identity and introduction, Philippines, BSIT, availability, five existing role titles, AI/GHL/VSL capabilities, portrait, hire/work actions, Portfolio Vault and OLJ shortcuts | Cinematic K composition with a readable identity block. Portrait receives a protected region; shortcuts become aligned actions rather than floating over a face. |
| Story / `story` | Original introduction and all five stages: BSIT, Video Editor, AI Content Creator, Automation Builder, CTO — Mary Digi Solutions | A readable five-step journey, connected by one visual line. All stage paragraphs and badges remain available. |
| Featured videos / `featured` | Four cases: Chip Wilson, LONA Bag, CIC Pro / Hearing Aids, German Client VSL; original copy, bullets, thumbnails and playable media | One large featured stage with direct selection of all four cases. Details remain readable while the media is still. |
| Websites / `web-projects` (new) | Eight supplied MDS/SRG websites, actual screenshots, existing descriptions and exact live destinations | One selected project at a time, with a persistent, named list of all eight. Project details and live-site actions remain normal HTML. |
| Systems / `systems` | Six complete cases: Founder Daily Report Automation, GoHighLevel Funnel Map, AI Video Engine, VSL & Ads Framework, Editing Workflow, Content Machine | Rework the original stack into one focal case with quiet adjacent previews and direct case controls. Preserve every screenshot, tool and result. |
| Reels / `vault` | All twelve video projects, categories, descriptions and players | Keep the Reels Universe identity and controlled depth interaction, with a clear collection index. Every item is reachable directly, on keyboard and touch as well as pointer. |
| Services / `services` | Six service tiles, initial preview copy, six dynamic descriptions and tool lists; four website packages and eleven add-ons | One shared preview beside the services. Keep package details in an accessible dialog/accordion, including all original prices, terms and inquiry action. |
| Speaking / `speaking` (new) | Exact event title, October 2, 2026, DTI / Negosyo Center Roxas-LGU, Roxas, Oriental Mindoro; supplied venue; three supplied images and actual event video | A calm human proof section with one main photograph, supporting recognition/certificate actions and a video opened by the visitor. Preserve complete photo access rather than using one tiny decorative texture. |
| Credentials / `credentials` | Six resource cards with exact copy and destinations: Work Portfolio Vault, Certificates Vault, Web Design Samples, Graphic Design Samples, SMM Samples, Resume / CV | Readable proof/resources layout using the same spacing, typography and accent system. |
| Feedback / `testimonials` | All three original quotes, names, roles and star presentation | A controlled carousel or stacked layout, preserving the exact attributed copy. |
| Contact / `contact` | All eight cards: email, WhatsApp, Discord handle, LinkedIn, OnlineJobs.ph, Upwork, résumé and certificate vault; availability, quick actions and footer identity | Complete contact hub in the new design with clear actions, not a link to the old contact page. |

The four featured entries overlap the twelve unique video IDs. Preserve their different labels and contexts; do not advertise sixteen unique videos. Preserve original service naming and detail variants, including AI Automation / Automation Workflows and Content Systems / Content Operations.

Pricing remains: Basic ₱5,000–₱8,000; Standard ₱8,000–₱15,000; Premium ₱15,000–₱25,000; Business / Pro ₱25,000+. Preserve the respective 10, 11, 13 and 12 inclusions, revision terms, descriptions and all eleven add-ons.

Skills should be grounded in the existing tool/workflow descriptions and supplied work. The update can make website development, landing pages, funnels, responsive design, CRM workflows, automation and public speaking more visible. Do not invent years, performance statistics, client results or expert-level claims. Blender/Three.js are the proposed production tools for this redesign, not automatic new résumé claims.

The explanatory service layer is specified in `service-explainer-and-ad-plan.md`: show the business need, the work being done, an authentic sample or clearly labeled process diagram, the deliverable, and the client's next step. The promotional ad uses English and omits the spoken alias. The current 25.2-second pro edit v3, with generic AI narration, English captions, layered animation, continuous transitions and original stereo audio, is in the workspace's `artifacts/service-ad-pro-v3/`. It supersedes the earlier samples. It is a motion-graphics advertisement, not the final rendered 3D opening, and is not yet embedded in the website.

## 2. Establish a cleaner visual composition

Use the selected Kinetic K as the signature form. The opening should read like a controlled product film: one sculptural object, tactile metal, restrained cyan detail, soft environmental light and enough quiet space for the name and message. The architecture supports the subject; it does not become an exhibition of portals, rings and screens.

- **Desktop:** identity/copy and visual occupy separate regions. Keep a minimum 40 px gap between their projected bounds at supported sizes. Use one main action and a quieter secondary action. Design a settled wide composition before any camera movement.
- **Phone:** compose the K/visual above the text with a dedicated camera pose. Use normal vertical reading, rather than cropping the desktop scene and squeezing copy over it.
- **Faces:** portrait, event photos and recognition photo get explicit protected bounds. No mesh, badge, widget, text, navigation or light flare may cross a face. On short screens, reflow the composition instead of reducing text to fit over the image.
- **Materials:** graphite, brushed metal and controlled reflections; cyan identifies the K and selected controls. Warm light can connect to human proof without changing the site's visual identity.
- **Typography:** one readable sans family for information and at most one display treatment. Body copy targets 16–18 px with comfortable line spacing. Small decorative labels never carry essential facts or actions.
- **Density:** one dominant visual, one main reading block and one active transition at a time. Keep the original content volume through clear hierarchy and browsing, not by putting every object in the same viewport.
- **Navigation:** Work, Story, Services, Proof and Contact remain directly accessible. Supporting menus/indexes expose websites, featured videos, systems, reels, speaking, credentials and feedback. Retain theme switching with deliberate light/dark compositions.

The existing generated frame can inform material quality and lighting. Its hanging screens, rocks and architectural ornaments are not a requirement to copy. No new graphic or video is generated until its role in a specific composition is clear.

## 3. Choreograph the animation as one sequence

| Beat | Dominant visual and movement | Text and interaction |
| --- | --- | --- |
| Detail | Close view of the exact K bevel/cyan seam; a restrained highlight reveals material detail | Identity and navigation are available immediately. No mandatory loading film. |
| Reveal | A smooth, reversible pullback resolves the complete K in its settled composition | Headline settles after the camera arrives; secondary motion remains quiet. |
| Connect | A single metal edge or matching K diagonal connects the scene to the first real work sample | A purposeful matched transition, followed by a stable case title, description and action. |
| Explore | One active project/collection occupies the focal stage | Visitor chooses projects directly. Reading is not timed; captions and links remain still while being read. |
| Human proof | Motion slows into authentic portrait/event imagery | Story, speaking, credentials and feedback stay complete and readable. |
| Contact | The visual motif resolves into a quiet composition | All contact paths and résumé remain easy to use. |

Motion rules:

1. One chapter/shot state owns camera, object transform and text timing. Do not combine separate camera damping, continuous K bobbing, strong pointer drift and unrelated panel transitions.
2. During a camera move, independent rotation, floating, particles and pointer movement become quiet. During reading, the camera settles; gentle ambient lighting can continue only if it does not distract.
3. For project selection: outgoing text exits, visual changes, incoming composition settles, then its caption appears. The visible title, screenshot and live-site link must always refer to the same selected case.
4. Input remains responsive during a transition. A later selection replaces the pending destination without flashing another project's copy or locking the visitor out.
5. Reverse scrolling returns through the same poses. Deep links open the requested content directly. Browser back, resize and orientation changes preserve the selected item and reading position.
6. Keep substantial 3D camera travel in the opening and a few purposeful bridges. Do not reuse the current 760svh/680svh corridor to force visitors through eight projects before reaching the full content.
7. Retain the character of the original story, featured stage, Systems Stack, Reels Universe and service preview. Rebuild their timing under a shared motion system instead of stacking the original scripts on top of the new renderer.
8. Hover is an enhancement. Touch, keyboard, direct buttons and visible labels provide equivalent access. Controls have at least 44×44 px targets.
9. Pause, skip and reduced motion are real reading modes: complete content, static compositions, no long camera corridor, no automatic role changes. Full video/event playback is initiated by the visitor, with playback stopped on close.

## 4. Free production route and resource gate

Use local Blender for scene authoring, material validation and any rendered camera sequence, with the existing vendored Three.js for real interactive geometry. Check the available computer and Blender runtime before selecting rendering settings. Blender availability, render time and device performance are not yet verified; no paid video service is a prerequisite.

| Resource | Existing state | Required before integration |
| --- | --- | --- |
| Kinetic vector and prototype extrusion | Available | Check silhouette, bevels and material scale in final scene. |
| Storyboard, macro and entrance images | Generated references | Simplify composition and establish matching desktop/phone frames. A still is not the final motion sample. |
| Basalt and metal base colors | Candidate images | Validate scale, tiling and color; author coherent roughness/normal detail where needed. |
| Final 3D scene | Missing | Build the actual simplified environment and lighting. Remove repetitive gallery geometry. |
| Macro → reveal → one work sample | Not rendered | Produce a short genuine 3D motion test, with matching interface and reverse-scroll behavior. |
| Eight project screenshots | Available | Keep authentic; optimize size and maintain legible, undistorted framing. |
| Portrait, speaking photos, certificate and video | Available | Preserve identity, complete media access and exact factual details. |
| Full portfolio content | Available in original layout | Integrate every record into the new content/layout system and audit it against the baseline. |

Only create additional graphics when the assembled scene reveals a specific missing resource. Never use fabricated client screens or generated speaking evidence. A pre-rendered sequence can bridge into interactive 3D; it is not itself live geometry. A camera pan over a static generated image does not satisfy the motion sample.

## 5. Implementation order and reviewable results

| Stage | Concrete result | Completion condition |
| --- | --- | --- |
| A — Plan and inventory | This plan plus the preservation baseline | Every original section/data source has a final location; new additions are identified. Completed at the planning level only. |
| B — Composition | One settled desktop frame and one deliberate phone composition, including actual name, copy, navigation and actions | Clear focal point; readable text; no face/visual overlaps; restrained background. |
| C — Motion sample | Short macro/reveal/first-case sequence built from real 3D assets | Material quality, camera continuity, stable caption timing, reverse scroll, pause and phone framing work together. |
| D — Complete integration | All original sections, new website/speaking sections and approved ad, original actions, collections, prices and resources in one redesigned page | No section depends on returning to the original layout. Exact content reconciliation shows no missing record, copy, media or destination. |
| E — Finish and verification | Coherent responsive page, complete link/media check and usable static fallback | All quality conditions below pass before production merge. |

Do not extend an unresolved motion sample across every section. Do not call a technical prototype, generated concept frame or incomplete migration the finished upgrade.

## 6. Acceptance before production merge

- All nine original anchors plus new website/speaking sections are present in the redesigned experience.
- Original counts: 5 story stages, 4 featured cases, 12 video records, 6 systems, 6 services with full dynamic copy, 6 credential resources, 3 exact testimonials, 4 complete packages, 11 add-ons and 8 contact/resource cards. The original introduction, all five role titles, tool lists, shortcuts and footer are also reconciled.
- New additions: all 8 exact website destinations and screenshots; complete October 2, 2026 speaking details; both event photos, certificate and playable event video.
- Project previews, system details, service selection, packages, video close/Escape/focus return, testimonial controls, mobile menu, theme persistence, contact actions and résumé access work.
- Inspect desktop 1440×900, wide 1920×1080, short desktop 1366×768, tablet 768×1024, phone 390×844 and small phone 360×740. No horizontal overflow, cropped essential copy, intersecting layers or face obstruction.
- Native scroll, reverse scroll, rapid project selection, deep links, reload, browser back, orientation/resize, pause and reduced motion remain predictable.
- With WebGL unavailable or lost, and with motion reduced, every content record and action remains accessible in a normal layout. With JavaScript unavailable, core identity, work references, proof and contact remain readable.
- Set a measured rendering budget on available devices: aim for stable 60 fps on capable desktop and 30 fps on phone; reduce resolution/effects when needed. These are targets, not results already achieved.
- Load a small initial poster/composition and essential content first. Do not require all rendered frames or videos before the page becomes usable. Dispose or pause offscreen media/rendering; check render/console/network failures.
- Audit source content, destinations, local assets and package values against the locked baseline. A visual review alone does not prove completeness.

The requested merge means the complete old and new content belong in the redesigned experience. This planning pass does not merge the draft PR or change the live site. Production merge follows the completed integration and verification, using the existing repository and hosting.
