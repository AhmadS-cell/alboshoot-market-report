# Prototype Instructions

## Approved direction — 4 October 2026

Latest user feedback overrides older homepage-unified-v4 mock. White ground #FFFFFF, burgundy #5C1E32, original Noto Naskh Arabic 400/500/600, exact approved flowing SVG wordmark and lam favicon. Arabic UI; English only within logo. Use original independent photos, never regenerate full-page images to modify UI. Men and women represented. One hero CTA; manual multiple banners without autoplay.

Separate arrivals near top and curated products immediately before gifting, no tabs. Product rails have prices, arrows and swipe. Heritage title and collection link centered above photo. Heritage and details share one container width, with 180px desktop / 96px mobile white gap. Other independent sections: 160px desktop / 88px mobile. Exact inverse flow pattern in a subtle separate footer strip. Service links consistent. Concept products and prices illustrative, not verified inventory. No fabricated reviews, delivery guarantees or contact details. Validate 390px mobile and 1440px desktop; export full PNG directly from browser.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Latest refinement: omit the visible illustrative-price labels from rails and footer. Keep category arrows beside their labels (10px desktop / 8px mobile), with product rail controls remaining on the left. Preserve the approved v5 PNG's prices, palette, imagery and generous spacing.
Hero refinement: pagination chevrons 16px at 0.7 opacity, primary hero CTA arrow 18px; keep large button hit areas. Category titles use approved muted gray #5D5C5E, with softened adjacent icons. User prioritizes the perceived softness of the v5 PNG over the heavier appearance of the live HTML.

Published v5 team preview is part of the GitHub knowledge base: /alboshoot-market-report/homepage-preview-v5/index.html. Report section: #homepage-preview (section 27). Build with --base /alboshoot-market-report/homepage-preview-v5/ for GitHub Pages; preserve import.meta.env.BASE_URL in asset URLs. Packaging is the next phase after team review; dimensions and materials must be confirmed before print-ready production files.

Typography decision — 5 October 2026: use unmodified Noto Naskh Arabic across body and UI as well as headings. Headlines 600, hero statements and product names 500, body 400. No Arabic letter-spacing. Maintain readable mobile sizes and approved independent-section spacing.

Mobile details decision — 5 October 2026: keep the eyebrow, title, description and link over the original fabric photograph. No separate black text panel beneath it. Mobile image height 360px with a balanced crop showing fabric and zari; preserve readable light text. CTA text is «شاهد القطعة» on every viewport.
Gifting decision — 5 October 2026: homepage gifting photograph must use the approved burgundy bag from the report, with light handles and lam repeats on the side and lower front. Use an enlarged stock-white gift box with a separate burgundy paper sleeve carrying the lam and flow pattern. Keep both pieces fully visible on mobile. Current photo: photos/gifting-approved-daylight.png.

Box construction correction — 5 October 2026: use the exact stock-white corrugated tuck-top mailer shown in report/packaging-2026-10-04/assets/box-02-white.png. Attached folding lid and tuck-in front/side tabs; no detachable lid or rigid two-piece gift box. Preserve approved bag and separate lam/flow paper sleeve. Corrected photo: photos/gifting-approved-mailer-daylight.png.

Collection decision — 5 October 2026: each category opens its own collection page (bisht, abaya, thobe, farwa). No filtering for the small catalog. Compact photographic header, products near the top on mobile, editorial banner beneath the products, and distinct collection description at the bottom for SEO. Preserve approved product names and weights. Prepare real page links for pagination at eight products per page; hide unnecessary pagination for a single page. Preview catalog/prices remain illustrative; preview routes use noindex until the real catalog and store domain are confirmed.

