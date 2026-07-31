# BloomHer → Next.js Migration Progress

Strict 1:1 migration from static HTML/CSS/JS to Next.js (App Router).
Rules: no UI/UX/behavior changes, reuse existing CSS/assets, convert DOM
scripts to React hooks only where required, keep folder structure unless
Next.js requires otherwise.

## ✅ Completed

### Phase 0 — Scaffolding
- Added Next.js (App Router) to the existing project **in place** (did not
  create a new project/folder). Root directory `BloomHer` is now both the
  legacy static site AND the Next.js app.
- `package.json`:
  - Added `next`, `react`, `react-dom` deps.
  - Changed `"type": "commonjs"` → `"type": "module"` (required because
    Next.js App Router files use ESM `import`/`export`).
  - Scripts: `dev`, `build`, `start`, `lint` now run Next.js. Old
    `node server.js` moved to `npm run legacy-server` (now points at
    `server.cjs`, see below).
- `next.config.js` — minimal config, ESM (`export default`), with
  `turbopack.root` pinned to the project dir (silences a workspace-root
  warning caused by an unrelated lockfile in the user's home directory).
- `jsconfig.json` — added `@/*` path alias (not yet used, available for
  future convenience).
- `server.js` → renamed to **`server.cjs`** (still CommonJS/Express, kept
  as the untouched legacy dev server, now unused by `npm run dev`/`build`,
  but still runnable via `npm run legacy-server`). This was required
  because `"type": "module"` at the package root would otherwise break its
  `require()` calls.
- `bloomher-backend/` (separate Express+Mongoose backend) — **untouched**.
  It was already an unused scaffold (register/login/menstrual/PCOS routes)
  not called by any frontend script. Not part of this migration.
- Confirmed `public/images`, `public/sounds`, `public/scriptpages`,
  `public/stylepages` already exactly mirror the root
  `images/sounds/scriptpages/stylepages` folders — so all
  `<img src="/images/...">`, `/sounds/...`, `/stylepages/...`,
  `/scriptpages/...` absolute paths used throughout the original HTML/JS
  keep working unchanged, served by Next.js from `public/`.

### Phase 1 — Home page (`index.html` → `app/page.js`)
- `app/layout.js`: root layout. Renders `{children}` plus a single global
  `<Script src="/scriptpages/maya-assistant.js" strategy="afterInteractive" />`
  — this widget is included on **every** original page
  (`<script src="/scriptpages/maya-assistant.js">`), is fully
  self-contained/self-initializing (guards itself with
  `window.__mayaAssistantLoaded`, and already handles the
  "DOM already loaded" case via `document.readyState` check), so it did
  not need any React conversion — loading it once globally is a 1:1
  behavioral match.
- `app/page.js`: `'use client'` component.
  - Reuses `stylepages/mainstyle.css` unchanged via
    `<link rel="stylesheet" href="/stylepages/mainstyle.css" />` (served
    from `public/`).
  - Lucide icon CDN script loaded via `next/script`
    (`strategy="afterInteractive"`, calls `lucide.createIcons()` in
    `onReady`, and also once more at the end of the effect as a safety
    net).
  - All DOM logic from `scriptpages/mainscript.js` (mobile menu toggle,
    sticky-nav-on-scroll, smooth-scroll anchors, IntersectionObserver
    reveal animations, community parallax, animated background-gradient
    on scroll, services dropdown, and the "Start Your Journey" popup menu
    that's built via `innerHTML`/`appendChild`) was moved into a single
    `useEffect(() => {...}, [])`, with a matching **cleanup function**
    that removes every listener and the injected `journeyMenu` node.
    This cleanup is required because Next.js dev mode uses React
    `StrictMode`, which double-invokes effects — without cleanup this
    would have duplicated the journey-menu popup and event listeners.
  - Internal links updated from `*.html` to the new route paths (e.g.
    `/mainpages/blog.html` → `/mainpages/blog`) — required for Next.js
    routing, no visual/behavioral change.
  - `class` → `className`, `<img>` self-closed, apostrophes in copy
    escaped as `&apos;`/`&apos;s` where needed for valid JSX — purely
    syntactic, no visual change.

### Phase 2 — Maya AI assistant chat API
- `server.js`'s `POST /api/maya/chat` (Gemini proxy) ported 1:1 to
  `app/api/maya/chat/route.js` (Next.js Route Handler, `POST` export).
  Same system prompt, same request/response shape, same status codes
  (`400` no message, `503` no API key configured, `502` upstream failure,
  `200` success). Uses native `fetch` instead of the `https` module
  (Node built-in, same behavior). `scriptpages/maya-assistant.js` already
  calls `/api/maya/chat` by default (`API_URL = window.__mayaAssistantApiUrl || '/api/maya/chat'`),
  so **no frontend script changes were needed** for this to work.
- `.env` (already present, gitignored) continues to work as-is — Next.js
  reads `.env`/`.env.local` automatically; the `dotenv` package is no
  longer required for the Next.js app (still a dependency for the legacy
  `server.cjs`).

### Validation performed
- `npm install` — OK.
- `npm run build` — OK, clean production build (Turbopack), routes:
  `/` (static), `/api/maya/chat` (dynamic).
- `npm run dev` — OK, server starts (`Ready in ~750ms`).
- Manual smoke test against the dev server:
  - `GET /` → `200`
  - `POST /api/maya/chat` (no `GEMINI_API_KEY` set) → `503` with
    `{"error":"Gemini API key is not configured.","fallback":true}`,
    matching original `server.js` behavior exactly.

## 🚧 Remaining work

### Phase 3 — completed pages (11 of 11) 🎉

| # | Original page | Status | Target route |
|---|---|---|---|
| 1 | `mainpages/contactus.html` | ✅ Done | `app/mainpages/contactus/page.js` |
| 2 | `mainpages/shop.html` | ✅ Done | `app/mainpages/shop/page.js` |
| 3 | `mainpages/exercises.html` | ✅ Done | `app/mainpages/exercises/page.js` |
| 4 | `mainpages/diet.html` | ✅ Done | `app/mainpages/diet/page.js` |
| 5 | `mainpages/log.html` | ✅ Done | `app/mainpages/log/page.js` |
| 6 | `mainpages/tracker.html` | ✅ Done | `app/mainpages/tracker/page.js` |
| 7 | `mainpages/sleep.html` | ✅ Done | `app/mainpages/sleep/page.js` |
| 8 | `mainpages/community.html` | ✅ Done | `app/mainpages/community/page.js` |
| 9 | `mainpages/blog.html` | ✅ Done | `app/mainpages/blog/page.js` |
| 10 | `mainpages/stress.html` | ✅ Done | `app/mainpages/stress/page.js` |
| 11 | `mainpages/expert.html` | ✅ Done | `app/mainpages/expert/page.js` |

All 11 original pages (plus the home page) have now been migrated. See
the per-page notes below (including several pre-existing bugs found and
preserved as-is) and the "Next task" section at the bottom of this file
for the remaining project-wide wrap-up steps.

Notes on the completed ones:
- `contactus`: uses Boxicons (CDN `<link>`), not Lucide. No other page
  uses Boxicons.
- `exercises`: uses Boxicons classes (`bx bx-droplet` etc.) in the phase
  cards, but the original `exercises.html` does **not** load the
  Boxicons stylesheet — this is a pre-existing bug in the original site
  (those icons never rendered). Faithfully preserved as-is; do **not**
  add the missing stylesheet, that would be a behavior change.
- `shop`: original HTML has **duplicate** `id="searchInput"` /
  `id="searchButton"` (desktop nav + mobile menu both use the same
  ids) — a pre-existing bug (only the first/desktop input is wired up
  by `getElementById`). Preserved as-is.
- `diet`: original `scriptpages/diet.js` has messy/dead code — 4
  separate `DOMContentLoaded` listeners, one of which
  (`document.getElementById('cycleInfo')`) references an element that
  doesn't exist anywhere in `diet.html` and will throw if reached.
  Converted each of the 4 original listeners into its own isolated
  `try/catch` block inside the single `useEffect` so a failure in one
  doesn't block the others — this replicates the original's behavior of
  4 independently-invoked browser event listeners. Also converted the
  inline `onclick="handleCyclePhaseClick()"` HTML attribute to a proper
  `onClick={handleCyclePhaseClick}` React prop (necessary for React;
  behavior unchanged — still navigates to the tracker page).
- `blog`: original `mainpages/blog.html` has a significant pre-existing
  bug — the "Write Blog Section" (`#writeBlogSection`) markup is
  malformed/incomplete (missing the intended form content and closing
  tags). Per HTML5's error-recovery parsing rules, the browser ends up
  nesting the site's *real* footer (logo + About/Contact Us links)
  *inside* that hidden (`display: none`) section instead of rendering it
  as a normal page footer — so **the footer never actually appears** on
  the live original page. Verified by manually tracing the HTML5 parser's
  tag-stack algorithm against the exact source. Reproduced verbatim in
  `app/mainpages/blog/page.js` (footer nested inside the hidden section)
  to match the real rendered behavior, not the presumably-intended
  structure. Also, `scriptpages/blog.js` has a second, entirely dead
  `DOMContentLoaded` block at the bottom of the file referencing
  `#writeBlogForm` / `#blogGrid`, neither of which exists anywhere in
  `blog.html` — it always throws a `TypeError` immediately in the
  original site too. Isolated in its own `try/catch` in the effect,
  matching the two originally-separate listeners. Functions referenced by
  inline `onclick="..."` strings injected via `innerHTML` (`toggleWriteForm`,
  `deleteBlog`) are attached to `window` inside the effect (and cleaned up
  on unmount) since that's how the original global-scope script made them
  reachable from dynamically-injected HTML.
- `stress`: original `scriptpages/stress.js` references
  `document.querySelectorAll('.action-btn')` inside its `DOMContentLoaded`
  listener, but no element in `stress.html` has class `action-btn` (the
  actual quick-action buttons use `action-card` instead) — this is
  pre-existing dead code that silently does nothing (no error, just an
  empty `NodeList`). Also, `saveJournalEntry()` calls
  `document.getElementById('journalForm').reset()` at the very end, but
  there is no `<form id="journalForm">` anywhere in `stress.html` (the
  journal fields are plain `<div>`s) — this always throws a `TypeError`
  in the original site too, after the success alert and modal close have
  already run. Both preserved as-is. All the `onclick="..."` attributes
  written directly in the static HTML (`startBreathing()`, `closeModal(...)`,
  `startMeditationSession(n)`, etc.) were converted to `onClick={...}` JSX
  props on functions/closures defined at module scope (outside the
  component), since they're pure click handlers that don't need to run on
  mount — mirrors the original's global `function` declarations.
  `window.onclick` (used for click-outside-to-close-modal) is set/cleared
  in the effect the same way the original set it directly on `window`.
- `log`: original `scriptpages/log.js` mixes top-level script code
  (outside any `DOMContentLoaded` wrapper) with a single
  `DOMContentLoaded` listener, and re-declares several identically-named
  `const`s (`roleSelection`, `registrationForm`, `partnerSection`, etc.)
  in the two separate scopes — a pre-existing quirk, harmless because the
  scopes never overlap in real JS. Converted using two `try/catch`
  blocks inside one `useEffect` (top-level code first, since it runs
  before `DOMContentLoaded` fires in the browser; the listener body
  second) and a `cleanupFns` array (rather than named-const tracking) to
  sidestep the duplicate-name scoping issue while still removing every
  listener on unmount. Also found: the `.role-btn` buttons get **three**
  separate, redundant `click` listeners across the file (two inside the
  `DOMContentLoaded` block, one at top level) — all three do overlapping
  work; preserved exactly, not merged. Redirects updated from
  `'../tracker/index.html'` → `/mainpages/tracker`.
- `tracker`: original `scriptpages/tracker.js` has two significant
  pre-existing bugs, both preserved as-is:
  1. Its first `DOMContentLoaded` listener calls `createCalendar(...)`,
     a function that is **never defined** anywhere in the script. This
     throws immediately, so that listener's log-card header click
     handlers and its "restore saved date on page load" logic never run
     in the original site either (a second, separate `DOMContentLoaded`
     listener happens to re-register the log-card header click handlers
     successfully, so that part still works; the calendar itself is
     actually built by a *different*, unrelated top-level
     `renderCalendar();` call at the bottom of the file).
  2. `logPeriod`/`logSymptom`/`logMood`/`logCraving` each call
     `updateTodaySummary()`, a function that is **also never defined**.
     This throws every time any flow/symptom/mood/craving button is
     clicked, meaning the `saveToLocalStorage()` call right after it
     (which would set the `cycleData` key read by `diet.js` and other
     pages) is unreachable dead code — the tracker page's cycle data
     essentially never gets persisted via that path. Only
     `saveFirstPeriod()` (`firstPeriodDate` key) actually writes to
     `localStorage` successfully in practice. `saveCycleDay`,
     `saveCycleData`, `updateCycleDay`, and `selectDay` are additional
     dead/unused functions (never called from anywhere reachable).
  Also relies on the legacy global `event` object (`event.target`)
  inside `logPeriod`/`logSymptom`/`logMood`/`logCraving` instead of an
  event parameter — preserved as-is (works via `window.event` in
  Chromium-based browsers). Converted the module-level `let`/`function`
  declarations to live outside the component (module scope, mirroring
  the original script's top-level scope) so they're shared between the
  mount effect and the `onClick` JSX handlers that replaced the original
  `onclick="..."` attributes.
- `sleep`: original `scriptpages/sleep.js` has several pre-existing bugs,
  all preserved as-is:
  1. `calculateSleepDuration` is declared **twice** at the top level (once
     returning a `"Xh Ym"` string, once returning a plain number of
     hours). The second declaration silently overwrites the first in
     plain JS, so only the numeric version was ever actually used —
     including by `updateUI()`, which displays the result assuming a
     `"Xh Ym"` string (so it would show e.g. `"7.5"` instead of
     `"7h 30m"`). Implemented as a single function matching the
     second/winning definition, since declaring it twice would be
     redundant, not more "faithful".
  2. `userData.sleepLogs` (persisted under the `cyclecare_sleep_data`
     localStorage key) is never pushed to anywhere in the script — only
     ever replaced wholesale by `loadUserData()`. `updateUI()`/
     `updateStats()` operate on this always-empty array and target the
     same DOM (`#sleepLogGrid`, `#avgSleepDuration`, etc.) that
     `loadSleepLogs()`/`updateStatistics()` (backed by the *separate*
     `sleepLogs` localStorage key) overwrite immediately afterward in the
     init sequence — so `updateUI()`/`updateStats()` are effectively dead
     code. Preserved verbatim, including the call order.
  3. `loadUserData()` calls `document.querySelector('.sound-card:has(h3:contains(...))')` —
     `:contains()` is jQuery-only syntax, not valid CSS, so this throws a
     `SyntaxError` whenever saved sound-volume settings exist in
     localStorage. Preserved as-is.
  4. `toggleSound()`'s "reset the previously-playing button's icon" logic
     looks up that button via `document.querySelector('.btn-play[onclick="toggleSound(\'ID\', this)"]')` —
     i.e. by matching the literal `onclick` HTML attribute text. In the
     original static HTML this only ever matched the White Noise button
     (the only `Audio` object with `.id` set). Converting the buttons'
     `onclick="..."` attributes to React `onClick` props (required for
     JSX) means this attribute no longer exists anywhere in the rendered
     DOM, so the lookup now always returns `null` — the icon-reset
     no longer happens for **any** sound (a minor regression forced by
     the mandatory onclick→onClick conversion, not a deliberate change;
     documented in code comments at the call site).
  Also: the `.quality-btn` buttons are wired up **twice** — once via each
  button's own `onclick="selectQuality(...)"` attribute (→ `onClick` prop)
  and again via a `querySelectorAll('.quality-btn')` + `addEventListener`
  loop inside the original `DOMContentLoaded` handler — both preserved,
  so clicking a quality button calls `selectQuality` twice (harmless,
  idempotent). `loadSleepLogs()` builds per-log delete buttons via
  `innerHTML` with a literal `onclick="deleteSleepLog(${index})"` string;
  since that string is resolved against the global scope by the browser
  when clicked, `deleteSleepLog` is exposed as `window.deleteSleepLog`
  inside the mount effect (removed on cleanup) so it keeps working,
  mirroring how a plain non-module `<script>` implicitly puts its
  top-level functions on `window`. Sound/user-data mutable state
  (`sounds`, `userData`, `currentSound`) was moved into `useRef`s (rather
  than `useEffect`-local variables) because it's read/written by both the
  mount effect and several `onClick` JSX handlers that must exist outside
  that effect.
- `community`: original `scriptpages/community.js` has pre-existing bugs,
  preserved as-is:
  1. `renderComments()` builds each reply's like button via `innerHTML`
     with `onclick="toggleReplyLike(${reply.id})"`, but `toggleReplyLike`
     is **never defined** anywhere in the original script — clicking a
     reply's like button throws `ReferenceError`. Left undefined here too
     (not implemented).
  2. The static `postsGrid` container in the original HTML contains a
     literal, non-commented-out "example post element" block (with
     un-interpolated `${post.id}`/`${commentCount}` text and a call to
     `openCommentsModal(...)`, a function that doesn't exist anywhere in
     `community.js` either) that was clearly meant to be documentation
     but was never wrapped in an actual `<!-- -->` comment. It gets wiped
     out by `renderPosts()`'s `grid.innerHTML = ''` on every load, so it's
     invisible in practice. Reproduced verbatim as inert JSX (literal text,
     no `onClick`, since React doesn't support a literal lowercase
     `onclick="..."` string attribute the way raw HTML does — this
     specific placeholder markup never worked in the original either way).
  3. `createPostForm` is wired up **twice**: once via its own
     `onsubmit="handlePostSubmit(event)"` HTML attribute (→ `onSubmit`
     prop) and again via `addEventListener('submit', handlePostSubmit)`
     in `setupEventListeners()`. Both fire on every submit; the second
     (redundant) call runs against the already-`reset()` form from the
     first call, so a successful post is immediately followed by an
     unexpected "Title and content are required." alert. Preserved as-is
     (both bindings kept).
  4. `filterPosts(filter)` originally located the just-clicked filter
     button via `document.querySelector('[onclick="filterPosts(\'FILTER\')"]')`
     — a lookup against the literal `onclick` attribute text, which
     *did* work in the original (the attribute existed in real HTML).
     Converting these buttons' `onclick` attributes to `onClick` props
     (required for JSX) removes that attribute from the DOM entirely, so
     this lookup would always return `null` and `.classList.add('active')`
     would throw — breaking the filter buttons completely (not just a
     minor cosmetic regression, an actual crash on every click). Since
     that would be a genuine functionality regression (the original
     filter buttons worked), `filterPosts` was adapted to accept the
     clicked button element directly (`onClick={(e) => filterPosts('all', e.currentTarget)}`)
     instead of re-deriving it from a now-nonexistent attribute — the only
     deliberate behavior-preserving deviation from a literal 1:1 port in
     this page.
  `deletePost`, `toggleLike`, `showComments`, `toggleCommentLike`,
  `showReplyForm`, and `handleReplySubmit` are all invoked via literal
  `onclick="..."` strings inside `innerHTML`-generated post/comment cards,
  so (like `sleep`'s `deleteSleepLog`) they're exposed as `window.X`
  inside the mount effect and cleaned up on unmount. `communityData`
  (posts/comments/reactions) was moved into a `useRef` for the same reason
  as `sleep`'s `userData`/`sounds` refs — shared between the mount effect
  and multiple `onClick`/`onSubmit` JSX handlers.

### Still remaining

None — all 11 original `mainpages/*.html` pages have been migrated (see
table above). Remaining work is project-wide wrap-up only:

- [x] Run `npm run build` once for the whole project (full check, not
      just per-page) to confirm there are no cross-page regressions. —
      **Done, clean build**, all 12 routes (`/` + 11 `/mainpages/*`) plus
      `/api/maya/chat` compile successfully with Turbopack, no errors.
- [x] Spot check every migrated page with `npm run dev` — **Done**. Started
      the dev server and issued a request to every route
      (`/`, `/mainpages/blog`, `/mainpages/community`, `/mainpages/contactus`,
      `/mainpages/diet`, `/mainpages/exercises`, `/mainpages/expert`,
      `/mainpages/log`, `/mainpages/shop`, `/mainpages/sleep`,
      `/mainpages/stress`, `/mainpages/tracker`): all returned `200`. Server
      logs showed no errors.
- [x] Fixed a React console warning on `/mainpages/community`: the JSX
      `<img id="imagePreview" src="" alt="Preview" />` in the "Create Post"
      form (`app/mainpages/community/page.js`) passed a literal empty
      string to `src`, which browsers treat as a request for the current
      page URL (wasted network request) and React explicitly warns
      against. Removed the `src=""` attribute entirely (leaving `src`
      unset) — the image stays hidden via the parent's
      `style={{ display: 'none' }}` either way, and `handleImageUrlInput()`
      already sets `previewImg.src = url` dynamically once the user types
      an image URL, so behavior is unchanged, this only removes a
      needless network request and the console warning. Note:
      `app/mainpages/blog/page.js` has the same-looking
      `<img id="imagePreview" src="" alt="Preview">` markup, but there it's
      inside a plain JS template-literal string assigned via `innerHTML`
      (not real JSX), so React never renders/warns about it — left as-is
      since it's not React-controlled markup.
- [ ] Decide (with the user) whether to delete the now-superseded legacy
      files (`index.html`, `mainpages/*.html`, and the original
      `stylepages/*.css` / `scriptpages/*.js` at the project root, keeping
      only the `public/` copies which Next.js actually serves) and
      `server.cjs`/`bloomher-backend/` if confirmed unused. **Do not
      delete anything until the user confirms.**
- [ ] Update `HANDOFF.md` and `CHANGELOG.md` to reflect the migration is
      complete.

Reference notes kept below for context on the conversion pattern used
for pages other than `contactus`:
- `contactus.html` is the ONE page that does **not** use Lucide icons —
  it uses Boxicons via a CDN `<link>` instead
  (`https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css`). All other 10
  pages + home use Lucide.
- All pages' original scripts were wrapped in
  `document.addEventListener('DOMContentLoaded', ...)` **without** a
  `document.readyState` guard — converted to `useEffect(() => {...}, [])`
  in every page (cannot stay as raw `<script src>` tags, since
  `DOMContentLoaded` will never fire again once the script is attached
  via `next/script` after hydration). `maya-assistant.js` is the only
  exception (already global, already guarded, loaded once in
  `app/layout.js`, not duplicated per page).

## 📝 Modified / added files so far

- `package.json` (modified)
- `next.config.js` (added)
- `jsconfig.json` (added)
- `.gitignore` (modified — added `.next/`, `out/`, `next-env.d.ts`)
- `server.js` → `server.cjs` (renamed only, content untouched)
- `app/layout.js` (added)
- `app/page.js` (added)
- `app/api/maya/chat/route.js` (added)
- `app/mainpages/contactus/page.js` (added)
- `app/mainpages/shop/page.js` (added)
- `app/mainpages/exercises/page.js` (added)
- `app/mainpages/diet/page.js` (added)
- `app/mainpages/log/page.js` (added)
- `app/mainpages/tracker/page.js` (added)
- `app/mainpages/sleep/page.js` (added)
- `app/mainpages/community/page.js` (added)
- `app/mainpages/blog/page.js` (added)
- `app/mainpages/stress/page.js` (added)
- `app/mainpages/expert/page.js` (added)

## ⚠️ Known issues

- `npm install` reports 8 vulnerabilities (2 moderate, 6 high) from
  transitive deps — pre-existing risk profile of `npm audit`, not
  introduced by this migration; not addressed since out of scope
  (`Fix issues only if required for the migration`).
- Next.js printed a one-time workspace-root inference warning caused by
  an unrelated `pnpm-lock.yaml` in the user's home directory
  (`C:\Users\User\pnpm-lock.yaml`) — fixed via `turbopack.root` in
  `next.config.js`, not a project bug.
- The old root-level `index.html`, `mainpages/*.html` and legacy
  `server.cjs` are no longer wired up to `npm run dev`/`build` but are
  intentionally left in place (untouched) as a fallback/reference until
  the full migration is verified by the user.

## 🧹 Cleanup performed (post-migration)

With the user's explicit go-ahead, deleted the now-superseded legacy
static files that were never served by Next.js:
- `index.html` (root)
- `mainpages/` (all 11 original `.html` files)
- `stylepages/` (root-level CSS — **not** `public/stylepages/`, which is
  untouched and still live)
- `scriptpages/` (root-level JS — **not** `public/scriptpages/`, which is
  untouched and still live, including `maya-assistant.js`)

**Left in place** (out of scope / user has not confirmed removal):
- `server.cjs` (legacy Express static server, unused by `npm run dev`/
  `build`/`start`, still runnable via `npm run legacy-server`)
- `bloomher-backend/` (separate unused Express+Mongoose scaffold)

Re-validated after deletion:
- `npm run build` — clean, same 12 routes + API route as before.
- `npm run dev` — spot-checked every static-asset URL class
  (`/stylepages/mainstyle.css`, `/scriptpages/maya-assistant.js`,
  `/images/img1.webp`, `/sounds/rain.mp3`) plus representative pages
  (`/`, `/mainpages/blog`, `/mainpages/sleep`) — all `200`, confirming
  everything actually being served comes from `public/`, not the
  now-deleted root copies.

## 🔧 Post-migration bug fix: log/sign-up/create-account (`app/mainpages/log/page.js`)

The user asked to actually **fix** (not just faithfully port) the
login/sign-up/create-account flow, since the ported original had real
functional bugs (see `CHANGELOG.md` "Session 2" for full detail). This
went beyond strict 1:1 migration by design, per the user's explicit
request. Summary of what was wrong and fixed:

- Three conflicting click handlers on the role buttons (inherited from
  the original's messy top-level + `DOMContentLoaded` duplication) —
  replaced with a single React state machine (`screen`/`role`/
  `partnerInfoSaved`).
- Care-partner submissions silently dropped `relationship`,
  `primaryUserEmail`, and `partnerName` because the "is this a partner
  submission" check tested a section's visibility *after* it had
  already been hidden — fixed by tracking those values in React state
  that survives the section unmounting, and always including them for
  partner accounts.
- The "Age" field was collected nowhere — now saved.
- The password show/hide "eye" icon used a Lucide icon that needed to
  change dynamically; Lucide replaces `<i data-lucide>` elements with
  raw `<svg>` nodes, which conflicts with React's own reference to that
  node on subsequent re-renders. Fixed by using small inline SVG icons
  (visually matching Lucide's eye/eye-off) for just these two dynamic
  buttons; every other (static, never-changing) icon on the page still
  uses `data-lucide` as before.
- Login/forgot-password/back-navigation all re-verified working.

Validated: `npm run build` clean, `npm run dev` → `/mainpages/log`
returns `200`, `diagnostics` reports no errors for the file.

## ▶️ Next task

Migration, cleanup, and the log-page bug fixes are all complete and
validated. Nothing is outstanding. If further work is desired, it would
be user-directed (e.g. deciding on `server.cjs` / `bloomher-backend/`,
fixing similarly-styled bugs on other pages such as `tracker.js`'s
known undefined-function issues noted earlier in this file, or new
feature work).
