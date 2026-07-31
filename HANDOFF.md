# Handoff — BloomHer Next.js Migration

Read `MIGRATION_PROGRESS.md` first for the checklist/status table. This
file explains **how** to continue: the exact conversion pattern, gotchas,
and how to validate.

## Project state right now

**Migration is functionally complete.** All 11 original pages + home +
the Maya chat API are ported. Only optional cleanup remains (see bottom
of this file).

- The project root (`BloomHer/`) is now a Next.js 16 App Router app.
  With the user's confirmation, the legacy static site has been
  **deleted**: root `index.html`, `mainpages/*.html`, root
  `stylepages/*.css`, and root `scriptpages/*.js` are all gone. The
  original source material referenced throughout this doc (e.g.
  `mainpages/blog.html`, `scriptpages/blog.js`) **no longer exists on
  disk** — if you need to reference "what the original looked like" for
  any reason, check git history instead.
- `npm run dev` and `npm run build` both work (verified — see
  "Validation performed"/"Cleanup performed" in `MIGRATION_PROGRESS.md`).
  All 12 page routes (`/` + 11 under `/mainpages/*`) plus
  `/api/maya/chat` exist and were smoke-tested (every route returns
  `200`, no server errors), including after the legacy-file deletion.
- `public/images`, `public/sounds`, `public/scriptpages`,
  `public/stylepages` are what Next.js actually serves at
  `/images/...`, `/sounds/...`, `/scriptpages/...`, `/stylepages/...`.
  **This is now the only copy of these assets** — the root-level
  duplicates that used to exist have been deleted. If you ever need to
  add/edit a CSS or JS asset referenced by absolute path, edit the copy
  under `public/` (there is no other copy anymore).

## Conversion pattern (apply to every remaining page)

Reference implementation: `app/page.js` (home page) + `app/layout.js`.
Read those two files first — they are the template.

For a page named `<name>` (e.g. `blog`), with source files
`mainpages/<name>.html`, `scriptpages/<script>.js`,
`stylepages/<name>.css`:

1. Create `app/mainpages/<name>/page.js`.
2. Top of file: `'use client';` then `import { useEffect } from 'react';`
   and `import Script from 'next/script';` (only if the page uses Lucide
   icons — `contactus` doesn't, see below).
3. Convert the HTML `<body>` markup into JSX inside the returned
   fragment:
   - `class` → `className`, `for` → `htmlFor`, self-close void elements
     (`<img>`, `<input>`, `<br>` → `<br />`), HTML comments `<!-- -->` →
     `{/* */}`, escape stray apostrophes/quotes in copy text
     (`don't` → `don&apos;t`) if JSX complains, inline `style="..."`
     strings → `style={{ camelCase: 'value' }}` objects (only if any
     page actually has inline styles — most don't).
   - Keep every `id`, `className`, and DOM structure **exactly** as in
     the original HTML — the page's script selects elements by these
     names, so they must not change.
   - Put `<title>{original <title> text}</title>` and
     `<link rel="stylesheet" href="/stylepages/<name>.css" />` directly
     in the returned JSX (React 19 hoists `<title>`/`<link>` rendered
     anywhere in the tree up into `<head>` automatically — no need for
     a separate metadata export or a server-component wrapper).
   - Internal links: change `.html` targets to the new route path
     without extension, and to the correct absolute path.
     - `href="/index.html"` → `href="/"`
     - `href="/mainpages/foo.html"` → `href="/mainpages/foo"`
     - `href="foo.html"` (relative, no leading slash) → also
       `href="/mainpages/foo"` (all mainpages live in the same
       `/mainpages/*` route namespace, so relative links between them
       resolve the same absolute path)
     - Keep plain `<a href="...">` (do **not** switch to Next's
       `<Link>`) — the original site is a true multi-page app with full
       reloads between pages, and every page's own script relies on
       `DOMContentLoaded`-equivalent timing (our `useEffect`) re-running
       on every navigation. Using `<a>` preserves that exact behavior.
       This is intentional, not an oversight.
   - Icons:
     - If the page's original `<head>` includes
       `<script src="https://unpkg.com/lucide@latest">`: add
       ```jsx
       <Script
         src="https://unpkg.com/lucide@latest"
         strategy="afterInteractive"
         onReady={() => { if (window.lucide) window.lucide.createIcons(); }}
       />
       ```
       and also call `window.lucide.createIcons()` at the top of your
       `useEffect` (belt-and-suspenders, matches how `mainscript.js`
       called it unconditionally at top level).
     - `contactus` is the only page that uses Boxicons instead of
       Lucide — add
       `<link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />`
       instead of the Lucide `<Script>`. No JS init call needed for
       Boxicons (it's pure CSS icon font, `<i class="bx bx-xxx">`).
   - Do **not** add a `<Script src="/scriptpages/maya-assistant.js">`
     to any individual page — it's already loaded once, globally, in
     `app/layout.js`.
4. Convert the page's own script (`scriptpages/<script>.js`) logic:
   - Open the file, find the `document.addEventListener('DOMContentLoaded', function () { ... })` wrapper (sometimes there may be multiple
     top-level listeners/blocks in one file — check the whole file, e.g.
     `expert.js`/`community.js` are large).
   - Move the **body** of that callback into
     `useEffect(() => { ...body... }, [])`, verbatim logic (selectors,
     class toggles, fetch calls, etc.) — do not rewrite the logic into
     `useState`/`useRef`-driven code unless something genuinely cannot
     work otherwise (e.g. two effects racing, or a selector that
     no longer matches because of a JSX change you made — there
     shouldn't be any if you kept ids/classes identical).
   - Any code **outside** the `DOMContentLoaded` wrapper (rare, e.g.
     `mainscript.js` had a top-level `lucide.createIcons();`) also goes
     inside the same `useEffect`, at the top.
   - **Add a cleanup function** returned from the `useEffect` that
     undoes anything persistent:
     - `element.removeEventListener(...)` for every `addEventListener`
       you kept a named function reference for (don't use anonymous
       inline arrow functions passed straight to `addEventListener` if
       you'll need to remove them later — assign to a `const` first).
     - `observer.disconnect()` for any `IntersectionObserver`/
       `MutationObserver`/`ResizeObserver`.
     - `clearInterval`/`clearTimeout` for any timers.
     - `.remove()` any DOM nodes the script created and appended via
       `document.body.appendChild`/`createElement` (rare outside the
       home page and `maya-assistant.js`, but check).
     - This is required because Next.js dev runs React `StrictMode`,
       which mounts → unmounts → remounts every component once in
       development, double-invoking effects. Without cleanup you will
       see duplicated listeners/nodes (usually shows up as "double
       toast messages" or "click handler fires twice" bugs during
       `npm run dev` — worth manually smoke-testing once per page).
   - If the script references `localStorage`/`sessionStorage` (e.g.
     `log.js`, `tracker.js` likely do — check), that's fine as-is inside
     `useEffect`/event handlers, `window`/`document`/`localStorage` are
     all available in client components after mount.
   - If a script does `window.location.href = 'foo.html'` or similar
     redirects, update the target the same way as the `<a>` links above
     (drop `.html`, correct absolute `/mainpages/...` path).
5. Double check nothing else in `<head>` was missed (rare
   page-specific `<link>`/`<meta>` beyond stylesheet + icon lib —
   `contactus.html` is the one page with a second external stylesheet).
6. Save, then spot check with `npm run build` (fast, catches JSX/syntax
   errors) before moving to the next page. Run `npm run dev` and hit the
   route in a browser occasionally to visually diff against the original
   `.html` file (open the original file directly in a browser to
   compare, since it's plain static HTML/CSS/JS with no build step).

## Backend / API notes

- Only one API endpoint exists in the whole app: `POST /api/maya/chat`
  (already migrated, `app/api/maya/chat/route.js`). No other page script
  calls a backend — everything else (`log.js`, `tracker.js`, etc.) is
  pure `localStorage`-based, client-only. Confirmed via
  `grep -r "fetch("` across `scriptpages/` before starting.
- `bloomher-backend/` (Express + Mongoose, register/login/menstrual/PCOS
  routes) is dead code, not called from any frontend script. Leave it
  alone — it's explicitly out of scope for this migration.

## Validation checklist per page

- [ ] `npm run build` succeeds with no new errors/warnings.
- [ ] Visiting the new route renders identical markup/styling to opening
      the original `.html` file directly in a browser.
- [ ] Any interactive behavior (buttons, forms, toggles, animations)
      still works exactly as before.
- [ ] No duplicated DOM nodes / doubled event firing when testing under
      `npm run dev` (StrictMode double-invoke check).
- [ ] Internal links (`<a href>`) point at the new route paths and
      actually navigate correctly (full page reload is expected/fine).

## After all 11 pages are migrated

1. Run `npm run build` once for the whole project. ✅ Done.
2. Update `MIGRATION_PROGRESS.md` (mark 100% complete), `HANDOFF.md`
   (state it's done), and `CHANGELOG.md`. ✅ Done.
3. Ask the user whether to delete the now-fully-superseded legacy files.
   ✅ Done — user confirmed, and `index.html`, `mainpages/`, root-level
   `stylepages/`/`scriptpages/` have been deleted (kept only `public/`'s
   copies, which Next.js actually serves). `server.cjs` and
   `bloomher-backend/` were **not** deleted (not yet confirmed unused/
   wanted-gone by the user) — ask again separately if that comes up.

## If you're picking this up with limited context budget

All 11 original pages are now migrated: `contactus`, `shop`, `exercises`,
`diet`, `log`, `tracker`, `sleep`, `community`, `blog`, `stress`, `expert`
(see `app/mainpages/<name>/page.js` for reference examples of the
pattern, in addition to `app/page.js`). There is no remaining per-page
conversion work.

The full-project `npm run build` and a `npm run dev` smoke test of every
route have already been done (see `MIGRATION_PROGRESS.md`) and both
passed cleanly. The only thing left is optional cleanup — see
`MIGRATION_PROGRESS.md`'s "Still remaining" checklist: deciding with the
user whether to delete the now-superseded legacy static files
(`index.html`, `mainpages/*.html`, root `stylepages/`/`scriptpages/`,
`server.cjs`, `bloomher-backend/`). **Do not delete anything without the
user's explicit go-ahead.**

### Extra gotchas found so far (apply the same scrutiny to remaining pages)

- Some original scripts register **multiple separate**
  `document.addEventListener('DOMContentLoaded', ...)` blocks in the
  same file (e.g. `diet.js` has 4). When converting to a single
  `useEffect`, wrap each original block in its own `try/catch` so a
  failure in one doesn't silently prevent the others from running —
  that matches the original browser behavior of independently-invoked
  listeners. Don't add extra try/catch *inside* a single block around
  sequential calls — those should still fail together, exactly like the
  original single function body would.
- Some pages have **pre-existing bugs** in the original (duplicate
  `id`s, scripts referencing elements that don't exist, missing icon
  stylesheets). Preserve these exactly — do not silently fix them. If
  you spot one, note it in `MIGRATION_PROGRESS.md` under the page's
  entry so the user is aware.
- Inline HTML event attributes (`onclick="someGlobalFn()"`) must become
  a proper `onClick={someGlobalFn}` JSX prop with the function defined
  in the component — this is a required/necessary conversion for React,
  not a behavior change.
- `log.js` mixes top-level script code with a single `DOMContentLoaded`
  listener, and both scopes declare several identically-named `const`s
  (harmless in real JS since the scopes never overlap, but means you
  can't just dump everything into one flat `useEffect` body — wrap each
  original scope in its own `try { }` block, or you'll get
  "already declared" errors). When a page like this also has several
  addEventListener calls whose target elements are looked up freshly in
  each of two separate blocks (so you can't share one named `const` for
  cleanup across both), track cleanups via a
  `const cleanupFns = []; cleanupFns.push(() => el.removeEventListener(...))`
  array instead of trying to hoist every element reference to a single
  outer scope — simpler and avoids the naming collisions. See
  `app/mainpages/log/page.js`.
- `tracker.js` calls two functions that are never defined anywhere in
  the file or any other loaded script (`createCalendar(...)` inside its
  first `DOMContentLoaded` listener, and `updateTodaySummary()` inside
  every `logPeriod`/`logSymptom`/`logMood`/`logCraving` call). Both
  throw `ReferenceError`s at runtime in the original site, silently
  breaking downstream code (see `app/mainpages/tracker/page.js` and its
  notes in `MIGRATION_PROGRESS.md`). When you see a bare function call
  with no matching declaration anywhere in the codebase, don't
  "helpfully" stub it in — just call it as-is inside a `try/catch` so it
  throws (and gets caught) exactly like the original, preserving the
  bug faithfully. Also watch for scripts that read the legacy global
  `event` object directly (`event.target`, not a declared parameter) —
  keep it as bare `event` (relying on `window.event`), don't rewrite it
  to take an explicit event parameter, since that would change the
  function's public call signature relative to the original.
