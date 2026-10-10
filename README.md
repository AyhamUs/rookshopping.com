# Rook

Website development and custom agentic solutions for local businesses.

Live site: https://ayhamus.github.io/rookshopping.com/

## Run locally

This iteration is a static, dependency-free HTML/CSS/JavaScript site.

```sh
python3 -m http.server 4173
```

Open http://localhost:4173. No package install or build is required.

## Source layout

- `index.html`: page content and semantic structure
- `assets/styles.css`: responsive design and reduced-motion styles
- `assets/main.js`: navigation, demos, calculator, and project planner
- `assets/no-js.css`: fallback styles loaded only without JavaScript

## Checks

```sh
python3 scripts/check_site.py
```

Requires Python 3 and Node.js. Checks document structure, unique IDs, internal fragments, ARIA references, basic metadata, local asset references, and JavaScript syntax. It does not replace browser testing.

Before publishing, check desktop and narrow mobile layouts, navigation, keyboard-operated demo tabs, FAQ disclosures, project planner validation, copy/download, modal dismissal and focus restoration, reduced-motion preferences, and the calculator's zero/invalid inputs.

## Deployment

The site is served from the repository's existing GitHub Pages configuration. Changes to `main` can take about five minutes to appear. Verify the rendered page after a deployment; a pushed commit alone is not proof the published site updated.

## Content and functionality

- Workflow examples are clearly labeled fictional simulations. No AI API, email account, calendar, or CRM is connected.
- The project planner builds a brief in the browser. It does not send inquiries or store the entered information.
- A verified business contact email or approved contact endpoint is needed to receive leads. Do not substitute a guessed address or show a fake submission-success message.
- Time estimates describe the user's entered workload assumptions; they are not promised savings.
- No invented clients, testimonials, performance results, or pricing.
- Google Fonts supplies the typefaces; system fonts are fallbacks. No analytics are configured.

## Framework and library decisions

For this one-page site, native HTML, CSS and JavaScript keep deployment simple and runtime costs small. Avoid adding a UI framework just for its name.

If the site grows into multiple service pages or case studies, [Astro](https://docs.astro.build/en/concepts/islands/) is a good migration path: reusable templates with static HTML and selective interactive islands. [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) describes the build/deploy workflow. Set the project base to `/rookshopping.com` for the current URL and commit the package lockfile.

[shadcn/ui supports Astro](https://ui.shadcn.com/docs/installation/astro), with React and Tailwind. Consider it for complex accessible controls if they become necessary; retain Rook's custom visual direction rather than adopting a stock landing-page template.

[Motion](https://motion.dev/docs/animate) offers vanilla animation APIs if a future demonstration requires coordinated motion. Existing CSS motion should remain restrained and respect `prefers-reduced-motion`.

## Design principles

Concrete service copy, generous spacing, a distinctive rook motif, readable typography, purposeful interaction, honest proof, and minimal visual clutter. Remove repeated slogans and decorative elements that do not help visitors understand the business.
