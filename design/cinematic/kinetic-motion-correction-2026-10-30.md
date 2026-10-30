# Kinetic composition and motion correction

Prepared October 30, 2026 (Asia/Manila). Current source: `a7809f5`, deployed successfully on Vercel. Status: exact-content and syntax/module checks pass; the live observations below are confirmed, with remaining checks explicitly identified.

## Reason for the correction

The user rejected the giant K opening and the largely static presentation of the integrated collections. The original supplied reference, [jeff.marydigisolutions.com](https://jeff.marydigisolutions.com/), was inspected in the owning browser session. The requested upgrade must retain that portfolio's expressive motion and recognizable portrait-led identity while integrating every original detail and the new work. Content completeness alone does not establish the requested visual or interaction quality.

This pass replaces the giant K opening with a deliberately composed Kinetic hero and restores the original section choreography under the new content system. It does not change the complete-content requirement or the approved service ad.

## Current composition and real 3D

- The opening uses large Syne “CREATIVE IN MOTION.” typography, the real portrait, original identity details, role labels and work/contact actions.
- The portrait is a separate DOM image above the scene, with protected foreground layering. Chrome meshes stay behind it. Live desktop/phone frames confirmed face clearance; tablet visual face-clearance review remains pending. Complete headline bounds were measured at the sizes listed below.
- `direction-preview/kinetic-scene.js` constructs two volumetric, open folded chrome ribbons with physical surfaces and cyan edge detail in Three.js. These are actual rendered geometry, not animation of a flat generated sculpture.
- `direction-preview/kinetic-hero.css` controls the desktop composition and the separately arranged phone reading order. The generated atmosphere supports the lighting and negative space; it is not the interactive 3D object.
- `direction-preview/portfolio-page.js` connects hero progress, pointer input, role transitions, preferences and the two motion modules. The older `cinematic-scene.js` K-sculpture source remains historical material and is not the current hero module.

There is no claim of a Blender render or an AI-generated video. The approved English service ad remains unchanged and retains its existing player, captions and audio.

## Restored animation and interaction

The original choreography is rebuilt around the integrated HTML rather than attaching the original root script to an unrelated layout. `portfolio.js` continues to own the content records, selected items and dialogs; the motion modules enhance their presentation.

| Section or interaction | Current implementation |
| --- | --- |
| Story journey | Native sticky stages with a controlled rotated arrival, retaining all five complete stages and their reading order |
| Featured work | Vertical native scroll advances a pinned horizontal case track where the viewport can accommodate the whole case; the ordinary swipe/button gallery remains the alternative |
| Systems Stack | A perspective fan arranged around the selected case, with direct selection, previous/next controls and keyboard handling |
| Reels Universe | An introductory scatter → line → circle transformation followed by a scroll-driven arc; hover/focus flips reveal the original card details; a named item index gives direct access |
| Services | Desktop scroll selects the existing service detail preview without moving keyboard focus or opening a dialog |
| Section entrances | Heading-word motion follows the existing accessible heading content |
| Pointer interaction | Restrained magnetic actions and a soft pointer glow on appropriate fine-pointer layouts |
| Reading modes | Phone, paused and reduced-motion paths retain the full normal content and direct controls instead of requiring the large desktop choreography |

`motion-sequences.js/.css` handle story, featured travel, service scroll selection, headings, magnets and glow. `motion-collections.js/.css` handle the Systems fan and Reels choreography. The table describes the implementation; the observed subset is recorded separately below rather than treating every intended path as tested.

## Content preservation remains unchanged

The exact reconciliation still passes against `content-preservation-baseline-2026-10-29.json`. The current report is `portfolio-completeness-report.json`; it reports no errors. All text, media IDs, tool/result data, destinations, service variants, package terms, shortcuts and footer details remain part of the preservation requirement.

| Preserved collection | Count |
| --- | --- |
| Original section anchors | 9 |
| Story stages | 5 |
| Featured case entries | 4 |
| Original video records | 12 |
| System cases | 6 |
| Services, with complete preview/tool data | 6 |
| Credential resources | 6 |
| Exact original testimonials | 3 |
| Contact/resource cards | 8 |
| Website packages | 4 |
| Package inclusions | 46 total: 10 / 11 / 13 / 12 |
| Add-ons | 11 |
| Original role titles | 5 |
| New supplied website projects | 8 |

The four featured entries overlap the twelve original video records; they are not sixteen unique videos. The complete speaking proof includes the actual event details, both supplied photographs, certificate and event video. The approved English ad remains integrated without alteration.

Root `index.html`, `css/style.css` and `js/script.js` remain unchanged from `d39a7cd`. No production merge is claimed by this correction document.

## Generated asset record

One new supporting atmosphere asset was generated with the built-in Imagegen tool. Its purpose is a quiet dark plate behind the portrait, headline and independently rendered chrome ribbons. It does not depict a real office or event, contain client proof, or substitute for live geometry.

| Field | Record |
| --- | --- |
| Generator | Built-in Imagegen |
| Original generated file | `C:/Users/jeffj/.codex/generated_images/01a15f7e-aed2-7f70-9653-534b44f22928/exec-10990aa7-67dc-44bc-9906-2f687cf087d9.png` |
| Final repository path | `direction-preview/assets/kinetic-atmosphere-v2.webp` |
| Preparation | Format conversion only, Pillow WebP quality 88; original PNG retained intact |
| Placement | Supporting `.hero-atmosphere` background in `kinetic-hero.css` |

Exact generation prompt:

> Use case: stylized-concept. Asset type: finished wide cinematic background plate for an interactive personal portfolio website, landscape 16:9. Create a sophisticated black and deep petroleum-blue studio atmosphere with exceptionally fine film grain, a subtle flowing satin-metal light caustic sweeping along the bottom right, cold cyan rim light and one faint warm-white grazing highlight. A large elegant curved translucent smoked-glass sweep recedes into depth on the far right edge. This is an environmental supporting plate: center right from 65 to 85 percent width and 10 to 60 percent height must remain extremely dark and uncluttered behind a real portrait; left 58 percent must remain near-black negative space behind large white type. Artistic direction: tactile high-end CGI commercial for a creative developer and video editor, measured contrast, fluid energy, deep spatial perspective. Composition must support live chrome ribbon geometry added separately; don't paint a dominant chrome object, pedestal, room, letter, logo, screen, person, UI, label, or text. No stars, particles, busy grid, oversaturated neon, lens-flare clichés, or random decorative shapes. Produce the actual reusable background image, no website mockup.

The older transparent sculpture artwork and its `assets/artwork-prompt.txt` remain separate resources; that prompt must not be attributed to this new atmosphere plate.

## Live browser observations

The owning browser session inspected the deployed `a7809f5` correction. Genuine WebGL reached its ready state. The latest console snapshot contained no warnings or errors, including no application-module errors. Source syntax/module checks and exact-content reconciliation also pass.

| Viewport or feature | Observed result |
| --- | --- |
| Desktop 1440×900 | No horizontal overflow; both headline lines had matching client/scroll widths of 789/789 px; inspected screenshot showed the face clear of overlapping visual elements |
| Phone 390×844 | No horizontal overflow; headline client/scroll widths matched at 314/314 px; primary action bottom was 666.98 px, within the viewport; copy layer was above the background plate at z-index 5; inspected face was clear; role text read “I’m an AI Content Creator” |
| Small phone 360×740 | No horizontal overflow; headline client/scroll widths matched at 290/290 px; primary action bottom was 622 px, within the viewport |
| Small-phone navigation | Opening the menu changed its accessible action to Close; selecting Services closed the menu |
| Phone collections | All 6 systems and all 12 video records remained in normal readable layouts |
| Short desktop 1366×768 | No horizontal overflow; headline client/scroll widths matched at 748/748 px; sticky story and featured enhancements were active |
| Tablet 768×1024 | No horizontal overflow; headline client/scroll widths matched at 500/500 px; the inspected settled frame kept the complete headline above the portrait's face |
| Story journey | All 5 stages had sticky 480 px layouts; native Page Down produced measured first/next stage tops of 117/597 px and an arrival rotation matrix with 0.998599/0.052911 components |
| Systems Stack | All 6 fan cards were displayed with positive/negative horizontal offsets; the selected Content Machine case was centered at horizontal offset 0; screenshot inspected |
| Reels Universe | All 12 named selector buttons were present; native Page Down advanced the ring into a scroll arc at 13% progress; selecting Mary Digi Solutions set its pressed state and focused the card with the observed 180-degree flip; screenshot inspected |
| Navigation anchors | Brand and chapter actions settled at their matching destination hashes |
| Featured next action | Advanced the horizontal track from 0 to 1251 px and document-linked progress from 0 to 0.3389 |
| Featured reverse action | Previous moved the track from 3688 to 2499 px and linked progress from 0.9995 to 0.6773 |
| Manual pause | Removed both motion enhancement classes and restored normal collection layouts; the hero remained visible and the home action returned to the top |
| Desktop service progression | Native Page Down changed the original selected detail from Video Editing to Automation Workflows (index 3), then Content Operations (index 5); the exact service records remain unchanged |

An earlier initial 1728×1080 inspection caught headline clipping, which was corrected. That initial frame is not recorded as a passing layout result, and this record does not claim a new final 1728×1080 pass.

These observations establish the stated behavior in the inspected session, not universal device/browser support or measured rendering speed. The previous [implementation review](implementation-review.md) remains historical evidence for `eec414b`; its results do not automatically carry over to these changed modules.

## Remaining checks and limits

- The current source, `0814a7e`, deployed successfully on the existing Vercel review. The final service-sequencing adjustment was inspected in that deployed version.
- Complete forward/reverse traversal of every motion sequence, every Systems/Reels selection, service scroll synchronization, and resize/deep-link behavior are not established solely by the observed subset above.
- Dialog and media cleanup results from the earlier implementation remain historical; fresh regression results should be added only when observed.
- No new frame-rate benchmark, forced WebGL-failure test, OS reduced-motion test, or JavaScript-disabled browser result is claimed. Browser-back behavior is not established here.
- The generated supporting plate, real-time ribbons and unaltered ad remain distinct resources; no Blender or AI-video production is claimed.
- User review of composition, animation and overall finish remains a separate quality decision. No production merge is claimed.
