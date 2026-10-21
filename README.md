# KENZAKI Portfolio

John Jefferson Manalo's personal portfolio: websites and landing pages, video editing, AI content, GoHighLevel automation, and cybersecurity speaking.

## Preview

With Node.js 20 or newer, run `node scripts/serve.mjs`, then open `http://127.0.0.1:4173/`. This is a buildless HTML/CSS/JavaScript site. No frontend dependency installation is needed.

## Content

- `index.html`: biography, services, speaking evidence, resource links, and contact information.
- `js/script.js`: project descriptions, supplied live URLs, video IDs, gallery filters, previews, and motion controls.
- `css/style.css`: responsive layout, custom graphics, and animations.
- `images/`: original assets plus optimized portraits and event photographs.
- `media/cybersecurity-speaking-oct-2026.mp4`: supplied event highlights. Loads only when the visitor chooses to play it.
- `resume.pdf`: the supplied résumé, retained without content changes.

The speaking section is grounded in the supplied October 2, 2026 certificate for the Training on Cashless Society and Cybersecurity Awareness, issued by DTI / Negosyo Center Roxas-LGU. All eight web projects use the URLs supplied by the owner and screenshots captured from their live websites. Website screenshots show client website content; any performance figures within those screenshots are not claims about this portfolio owner's results.

## Deployment

Keep the existing Vercel project's framework setting as Other, with the repository root as its output directory and no build command. Merge the review branch through GitHub to update the connected production deployment. Preview changes before merging.

The displayed contact actions open email, WhatsApp, or professional profiles directly. No SMTP setup is required for those actions. The original optional `api/contact.js` endpoint is retained; it requires the existing `SMTP_USER`, `SMTP_PASS`, and optional SMTP settings if used separately. Never put credentials in the repository.

## Accessibility and motion

Keyboard navigation, native dialogs with focus restoration, visible focus indicators, and a skip link are supported. Motion respects the system's reduced-motion preference and can be paused with the header control. The orbital canvas stops rendering while it is outside the viewport or the tab is hidden. Video previews load on demand; YouTube embeds include a direct viewing link.

Run `node --check js/script.js`, `node --check scripts/serve.mjs`, and `node --check api/contact.js` for syntax checks, or use `npm run check` when npm is available.
