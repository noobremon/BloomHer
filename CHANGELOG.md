# Changelog

## Session 1 — Next.js migration kickoff

### Added
- Next.js 16 (App Router) scaffolding: `next.config.js`, `jsconfig.json`,
  `app/layout.js`, `app/page.js`, `app/api/maya/chat/route.js`.
- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
  scripts (Next.js), replacing the previous default `npm start` (now
  available as `npm run legacy-server`).

### Changed
- `package.json`: added `next`, `react`, `react-dom`; `"type"` changed
  from `commonjs` to `module` (required by Next.js App Router's ESM
  files).
- Home page (`index.html` + `stylepages/mainstyle.css` +
  `scriptpages/mainscript.js`) migrated 1:1 to `app/page.js`. All DOM
  logic (mobile menu, sticky nav, smooth scroll, scroll-reveal
  animations, parallax, animated background gradient, services dropdown,
  "Start Your Journey" popup) converted from a `DOMContentLoaded` handler
  into a `useEffect` with matching cleanup. Styling and markup unchanged;
  only internal links were updated from `*.html` to route paths (e.g.
  `/mainpages/blog.html` → `/mainpages/blog`).
- Maya AI assistant widget (`scriptpages/maya-assistant.js`) now loaded
  once, globally, from `app/layout.js` via `next/script` — unchanged
  file, since it's self-contained and already handles being loaded after
  the DOM is ready.
- `server.js`'s Gemini chat proxy (`POST /api/maya/chat`) ported to a
  Next.js Route Handler at `app/api/maya/chat/route.js`, same
  request/response contract and status codes.

### Renamed
- `server.js` → `server.cjs` (content unchanged) so it keeps working as
  CommonJS after the package was switched to `"type": "module"`. No
  longer run by default; use `npm run legacy-server` if needed.

### Added (continued)
- Migrated 4 more pages 1:1 to Next.js: `contactus`, `shop`, `exercises`,
  `diet` (each now `app/mainpages/<name>/page.js`). Same conversion
  pattern as the home page: markup → JSX, per-page CSS reused via
  `<link>`, Lucide/Boxicons loaded per-page as needed, page scripts'
  `DOMContentLoaded` logic moved into a cleaned-up `useEffect`.
- Preserved several pre-existing bugs in the original site verbatim
  (documented in `MIGRATION_PROGRESS.md`): missing Boxicons stylesheet
  on `exercises`, duplicate input `id`s on `shop`, and dead/broken
  `DOMContentLoaded` blocks in `diet.js` referencing a non-existent
  `#cycleInfo` element.

### Added (continued, 2)
- Migrated `sleep` and `community` 1:1 to Next.js
  (`app/mainpages/sleep/page.js`, `app/mainpages/community/page.js`).
  Same conversion pattern; mutable state that was module-level in the
  original scripts (`sleep`'s `userData`/`sounds`/`currentSound`,
  `community`'s `communityData`) moved into `useRef`s since it needed to
  be shared between the mount `useEffect` and several `onClick`/
  `onSubmit` JSX handlers.
- Preserved several pre-existing bugs verbatim (documented in
  `MIGRATION_PROGRESS.md`): a duplicate `calculateSleepDuration`
  declaration and dead `userData.sleepLogs`-based rendering path in
  `sleep.js`; an undefined `toggleReplyLike` reference and an
  uncommented "example post" placeholder block in `community.js`.
  Adapted (rather than left literally broken) two cases where the
  required onclick→onClick JSX conversion would have caused a genuine
  new functional regression not present in the original: `community`'s
  `filterPosts()` (previously found the active button via its `onclick`
  attribute text, which no longer exists once converted to `onClick`) now
  receives the clicked button element directly instead.

### Added (continued, 3)
- Migrated `log`, `tracker`, `blog`, `stress`, and `expert` 1:1 to
  Next.js (`app/mainpages/log/page.js`, `app/mainpages/tracker/page.js`,
  `app/mainpages/blog/page.js`, `app/mainpages/stress/page.js`,
  `app/mainpages/expert/page.js`), completing the migration of all 11
  original `mainpages/*.html` pages. Same conversion pattern throughout.
- `blog`: found and preserved a significant pre-existing bug — the
  "Write Blog Section" markup in the original `blog.html` is
  malformed/incomplete, which (per HTML5's error-recovery parsing rules)
  causes the browser to nest the site's real footer inside that hidden
  (`display: none`) section, so the footer never actually renders on the
  live original page. Reproduced verbatim rather than "fixed". Also
  isolated a second, entirely dead `DOMContentLoaded` block in `blog.js`
  (referencing nonexistent `#writeBlogForm`/`#blogGrid` elements) in its
  own `try/catch`, matching its independently-invoked original behavior.
- `stress`: found and preserved two pre-existing bugs — a
  `document.querySelectorAll('.action-btn')` reference that always
  matches zero elements (the real buttons use `.action-card`), and a
  `saveJournalEntry()` call to `document.getElementById('journalForm').reset()`
  targeting a `<form>` id that doesn't exist in `stress.html` (always
  throws after the success alert/modal-close already ran).
- `tracker`: found and preserved two pre-existing bugs — a call to an
  undefined `createCalendar(...)` function, and calls to an undefined
  `updateTodaySummary()` function inside every log-action handler that
  made the subsequent `saveToLocalStorage()` call unreachable dead code.
- `sleep`/`community` bug notes carried over from the previous session
  (see `MIGRATION_PROGRESS.md` for full detail on all pages' preserved
  quirks).

### Validated
- Ran a full-project `npm run build`: clean, all 12 routes (`/` plus 11
  under `/mainpages/*`) plus `/api/maya/chat` compile with no
  errors/warnings.
- Ran `npm run dev` and issued a real HTTP request to every single
  route: all returned `200`, no server-side errors in the logs.

### Fixed
- `app/mainpages/community/page.js`: removed a literal `src=""` on the
  "Create Post" image-preview `<img>`, which triggered a React console
  warning (empty `src` causes browsers to re-request the current page
  URL). The image stays hidden via the parent's `display: none` either
  way, and the existing `handleImageUrlInput()` logic already sets the
  real `src` dynamically once a user enters an image URL, so this is a
  pure bugfix with no behavior change. (The visually-similar
  `src=""` in `app/mainpages/blog/page.js` is inside a plain
  `innerHTML` template string, not JSX, so React never renders/warns
  about it — left untouched.)

## Session 2 — Login / sign-up / create-account bug fixes

### Fixed
- `app/mainpages/log/page.js` was fully rewritten (still same visual
  design/CSS classes/markup) to fix several real functional bugs
  inherited from the original `scriptpages/log.js`:
  - The role-selection buttons had **three separate, conflicting click
    handlers** fighting over the registration form's `display` value
    (`'flex'` vs `'block'`, the latter breaking the CSS's intended
    flex-centered layout) and duplicating/contradicting each other's
    section-visibility logic. Replaced with a single React state
    machine (`screen`: role/register/login, `role`: primary/partner,
    `partnerInfoSaved`) driving one consistent set of conditionally
    rendered sections.
  - The account-creation form had **two separate submit handlers** on
    the same `<form>`; the "is this a care-partner submission" check in
    one of them tested a section's visibility *after* that section had
    already been hidden by an earlier step, so it was always false in
    practice — meaning care-partner data (relationship, primary user's
    email, partner's name) was **silently dropped** and never saved.
    Fixed by capturing `relationship`/`primaryUserEmail` in React state
    (so they survive the partner-info section unmounting) and always
    including them, plus `partnerName`, in the saved account data when
    `role === 'partner'`.
  - The manually-entered "Age" field existed in the form but was never
    read or saved anywhere — now included in the saved account object.
  - Password-visibility "eye" toggle buttons used a Lucide icon whose
    `data-lucide` value needed to change dynamically (eye ↔ eye-off).
    Lucide's `createIcons()` *replaces* the `<i>` element with a raw
    `<svg>`, detaching it from React's reference to that node — on the
    next toggle, React would try to update a DOM node lucide had
    already swapped out, which is unreliable. Replaced with small,
    visually-identical inline SVG icons (matching Lucide's actual eye /
    eye-off artwork) driven by normal React state, sidestepping the
    conflict entirely for this one dynamic icon (all other, static
    icons on the page still use `data-lucide` as before — no issue
    there since they never change after first mount).
  - Login now correctly compares against the single locally-stored
    account (`localStorage['cyclecare_user_data']`, guarded against an
    empty/no-account case) and redirects to `/mainpages/tracker` on
    success, or alerts "Invalid email or password" otherwise — same
    behavior as intended originally, now reliably reachable.
  - "Forgot password" and the role-selection ↔ registration ↔ login
    back-navigation all continue to work exactly as before, just driven
    by state instead of scattered `style.display` writes.
  - Minor UX fix: the "Already have an account? Log in" link is now
    always visible on the registration screen (previously it lived in
    the same footer as the submit button, whose visibility depended on
    form-section state) so users aren't stuck if they land on the wrong
    flow.
- Validated with `npm run build` (clean) and `npm run dev`
  (`/mainpages/log` returns `200`, no console/runtime errors).

### Removed
- Deleted the now-superseded legacy static files, with user
  confirmation: root `index.html`, `mainpages/` (11 `.html` files),
  root `stylepages/` (CSS), root `scriptpages/` (JS). These were never
  served by Next.js — the live copies Next.js actually serves
  (`public/stylepages/`, `public/scriptpages/`, `public/images/`,
  `public/sounds/`) are untouched.
- Re-ran `npm run build` and `npm run dev` after deletion: clean build,
  and spot-checked static asset URLs (`/stylepages/mainstyle.css`,
  `/scriptpages/maya-assistant.js`, `/images/img1.webp`,
  `/sounds/rain.mp3`) plus several pages — all `200`.

### Notes
- `bloomher-backend/` (separate Express/Mongoose service) and
  `server.cjs` (legacy Express static server) are left in place,
  untouched — out of scope for this migration, not yet confirmed for
  removal.
- **Migration and cleanup are both complete.** All 11 original pages
  are migrated and validated, and the superseded legacy static files
  have been removed.
