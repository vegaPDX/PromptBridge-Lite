# PromptBridge — Security, Bug, Dead Code & Language Audit (v5)

*Your task is a comprehensive audit of the PromptBridge codebase — security review, bug hunting, dead code cleanup, test coverage review, and user-facing language review.*

Act as a veteran Senior Frontend/Web Platform Engineer with 15-20 years of experience. You have deep expertise in building secure client-side web applications using React, Vite, and browser APIs. You specialize in static sites that render pre-generated content, handle user input for client-side scoring, and interact with the clipboard API. You also have strong UX writing instincts and can identify jargon, inconsistent tone, and language that would confuse a complete beginner.

## Context

PromptBridge is a **fully static web application** deployed on GitHub Pages that teaches people to communicate effectively with AI assistants. It makes **zero outbound network requests**, stores **no secrets**, and has **no backend**. Users practice with interactive scenarios, get client-side heuristic feedback on their prompts, then copy their prompts to real AI tools (ChatGPT, Claude, Gemini, Copilot).

**Recent changes since the last audit (v4) — Research-driven improvement round (Phases 1-6):**

Based on a research report analyzing 80+ real user complaints about AI tools, a 6-phase improvement was executed:

- **Phase 1 — Principle reordering:** Added `teachingOrder` field to all 12 principles. New teaching sequence: P8→P1→P2→P5→P3→P7→P4→P6→P9→P10→P11→P12. Recommendation engine (`recommendations.js`) now sorts by `teachingOrder` so new users start with P8 ("Ask the AI to write prompts for you") as the gateway skill.
- **Phase 2 — AI safety visibility:** Three new touchpoints ensure every user sees AI safety content before their first scenario:
  - `AiSafetyBanner.jsx` (NEW) — first-visit welcome card with 3 key AI facts, dismissable, stored in localStorage
  - `PreScenarioBanner.jsx` (NEW) — one-line amber reminder before first scenario, dismissable, stored in localStorage
  - `LandingPage.jsx` — new "We believe in being honest about AI" section (3 bullet points: hallucination, sycophancy, 60% communication stat)
  - `AiSafetyPage.jsx` — new "New to AI? Start here" section (P9-P12 cards) + "Why this matters" 60/40 split section
  - `Header.jsx` — AI safety button now has "AI Limits" text label (was icon-only)
  - `storage.js` — 4 new functions for banner flag persistence (`hasSeenSafetyIntro`, `markSafetyIntroSeen`, `hasSeenPreScenarioBanner`, `markPreScenarioBannerSeen`)
  - `App.jsx` — banner state management with lazy-loaded localStorage reads
  - `ScenarioSelector.jsx` — accepts `showPreScenarioBanner` and `onDismissPreScenario` props
- **Phase 3 — Content updates:**
  - `heuristic-scorer.js` — P5 detection expanded with 10+ new patterns (quoted blocks, "here's an example," "in the style of," etc.)
  - `GuidedMode.jsx` — P5 research callout box (indigo, 0%-to-90% stat) shown for P5 scenarios
  - `HelpPage.jsx` — new "When AI isn't giving you what you want" debugging protocol (3 steps + "Common traps" section)
  - `FreeformMode.jsx` — contextual P6 tip when user's prompt is missing specific feedback skill
  - `LandingPage.jsx` — language audit: hero ("Tired of generic AI responses?"), research stat (0%-to-90%), skills heading ("12 ways to stop getting generic AI slop"), user vernacular throughout
  - `ProgressPage.jsx` — principles sorted by `teachingOrder`, explanatory text about research-driven ordering
- **Phase 4 — New scenarios:** 8 new guided scenarios added (76 total: 61 guided + 15 freeform). Research-driven pain points: generic email (P1,P2,P5), code debugging (P2,P3,P6), context window cliff (P2,P11), endless redo loop (P4,P6), AI sycophancy (P9,P12), prompt regression (P1,P2,P5), safety wall (P3,P11), five-minute expert (P8,P7). All 8 generated JSON files are hand-crafted (not pipeline-generated).
- **Phase 5 — Test infrastructure:** Added vitest with 123 tests across 6 files covering data integrity, heuristic scorer (all 12 principles + P5 expanded patterns), recommendation engine (teachingOrder sorting), storage (banner flags + failure handling), and component smoke tests.
- **Phase 6 — Holistic review:** Fixed LandingPage sycophancy icon (Check→AlertTriangle) and inconsistent "Heads Up"→"AI Limits" labeling.

Your goals are:
1. **Find security vulnerabilities** in the current static architecture
2. **Find bugs** — React state issues, edge cases, broken flows
3. **Find dead code** — orphaned imports, unused components, leftover references
4. **Audit user-facing language** — jargon, inconsistent tone, unclear wording for beginners
5. **Verify the data layer integrity** — all 12 principles referenced correctly, no dangling scenario IDs, teachingOrder consistency
6. **Review test coverage** — gaps, false-positive tests, edge cases not covered

## The Codebase

* **Frontend:** React 19, JavaScript (no TypeScript), Vite 8, Tailwind CSS v4, lodash-es (groupBy only), lucide-react
* **Architecture:** Fully static SPA, zero outbound network requests, deployed on GitHub Pages
* **Content:** 61 pre-generated JSON scenario files (53 pipeline-generated + 8 hand-crafted), committed to repo
* **Scoring:** Client-side heuristic scorer using regex pattern matching against 12 communication principles
* **Storage:** Progress, assessment results, user context, and 2 banner flags stored in `localStorage` as JSON/strings
* **Content Rendering:** Custom `MarkdownText` component uses `escapeHtml()` + regex bold/italic + `dangerouslySetInnerHTML`
* **Content Security Policy:** `<meta>` tag in `index.html` (verify current directives)
* **Clickjacking:** JavaScript frame-buster in `main.jsx`
* **Tests:** Vitest 4.1.1 with jsdom, @testing-library/react, @testing-library/jest-dom — 123 tests across 6 files
* **Build Config:** Vite with `base: '/PromptBridge/'`

### File inventory

**Pages (src/pages/) — 8 components:**
LandingPage, ScenarioSelector, GuidedMode, FreeformMode, AssessmentMode, ProgressPage, HelpPage, AiSafetyPage

**Components (src/components/) — 9 files:**
Header, CopyButton, AiToolLinks, MarkdownText, PrincipleBadge, ErrorBanner, LoadingSpinner, AiSafetyBanner, PreScenarioBanner

**Services (src/services/) — 4 files:**
heuristic-scorer.js, guided-data.js, recommendations.js, storage.js

**Data (src/data/) — 8 files + 61 generated JSON:**
scenarios.js (76 scenarios), principles.js (12 principles with teachingOrder), categories.js, prompts.js (used only by generate-content.js script), assessment-scenarios.js, demo.js, icon-map.js, plus `generated/*.json`

**Tests (src/__tests__/) — 6 files:**
data-integrity.test.js (22 tests), heuristic-scorer.test.js (42 tests), recommendations.test.js (10 tests), storage.test.js (19 tests), components.test.jsx (16 tests), plus setup.js and vitest.config.js

**Scripts (scripts/) — 2 files (local dev only, not in the built app):**
generate-content.js, validate-scenario.js

---

## Audit Area 1: XSS Prevention (CRITICAL)

The `MarkdownText` component (`src/components/MarkdownText.jsx`) is the only place in the app that uses `dangerouslySetInnerHTML`. It processes text from pre-generated JSON files (AI-written content):

```javascript
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Per line: escapeHtml → bold regex → italic regex → dangerouslySetInnerHTML
const escaped = escapeHtml(line);
const formatted = escaped
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.+?)\*/g, "<em>$1</em>");
```

**Audit tasks:**
- Is the `escapeHtml` function complete? Are there characters or encoding tricks that could bypass it?
- After escaping, the bold/italic regex injects `<strong>` and `<em>` tags. The `$1` capture groups contain pre-escaped content. Could any input sequence cause the escape+regex pipeline to produce executable HTML?
- The `text` prop comes from pre-generated JSON (AI-written). If a future content generation run produces HTML in the response text, does the escaping catch it?
- Are there any OTHER rendering paths in the codebase where untrusted strings are rendered unsafely? Search for `innerHTML`, `dangerouslySetInnerHTML`, `document.write`, `eval` across all files.
- Several components render strings from pre-generated JSON as React text nodes (e.g., `{content.feedback.what_happened}`). Confirm these are all safe (React auto-escapes text nodes).
- `AiSafetyPage.jsx` renders hardcoded JSX strings. Verify no dynamic content is rendered unsafely on this page.
- **NEW:** `AiSafetyBanner.jsx` and `PreScenarioBanner.jsx` render hardcoded text. Verify no dynamic content paths exist.
- **NEW:** The 8 hand-crafted JSON files in Phase 4 were not pipeline-generated. Verify they don't contain any HTML or script content that could bypass escaping. Spot-check at least 3 of these files: `3.1-generic-email.json`, `6.4-ai-agreed-bad-idea.json`, `6.6-safety-wall.json`.

---

## Audit Area 2: Content Security Policy (HIGH)

Check the current CSP in `index.html` (it may have been updated since v4).

**Audit tasks:**
- Is `'unsafe-inline'` for styles actually required by Tailwind CSS v4's Vite plugin? Could it be replaced with a hash or nonce approach?
- Is there a `connect-src` directive? With `default-src 'self'`, `connect-src` falls back to `'self'`. Should `connect-src 'none'` be set explicitly?
- There is no `font-src` directive. Falls back to `default-src 'self'`. Is this correct?
- `frame-ancestors` is absent (doesn't work in meta tags). Is the JavaScript frame-buster sufficient?
- On GitHub Pages, `script-src 'self'` means any JS file served from the same origin could execute. How does CODEOWNERS mitigate this?

---

## Audit Area 3: Frame-Buster Implementation (MEDIUM)

`src/main.jsx` contains:
```javascript
if (window.self !== window.top) {
  document.body.innerHTML = '<p>PromptBridge cannot be loaded in a frame.</p>';
  throw new Error('Refused to load in frame');
}
```

**Audit tasks:**
- Can this be bypassed with the `sandbox` attribute on an iframe?
- What happens if JavaScript is disabled?
- Is `document.body.innerHTML = '...'` safe here?
- Should `window.top.location = window.self.location` be used instead?

---

## Audit Area 4: Dead Code & Orphaned Artifacts (HIGH)

**Carry-forward items from v4 (verify these are still clean):**

- **`src/components/ResponseComparison.jsx`** — This component has been removed. Verify no references remain in source code.
- **`src/data/prompts.js`** — Exports functions used only by `scripts/generate-content.js` (NOT part of the built app). Verify: does Vite tree-shake this file out of the production bundle, or does it get included because other data files import from `principles.js` which is in the same directory?
- **`.env.example`** — Verify it no longer references any `VITE_` prefixed variables.
- **Search the entire `src/` directory** for remaining references to deleted features: `hasApiKey`, `callLLM`, `analyzeFreeform`, `simulateResponses`, `generateVariations`, `generateInitialResponse`, `generateImprovedResponse`, `generateMultiTurnFeedback`, `getProviderConfig`, `PROVIDER_STORAGE_KEY`, `promptbridge_provider`, `HybridMode`, `MultiTurnMode`, `SettingsPage`, `llm.js`, `apiKey`, `api_key`, `BYOK`.
- **`user_picked_best` field:** Verify no source code references it. Verify no generated JSON files still contain it.

**New items from Phases 1-6:**

- **`resolveFeedback()` in GuidedMode.jsx:** This function handles both flat and nested (weak/medium/strong) feedback formats. All 61 generated files now use flat format. Is the nested format fallback dead code? Are there any generated JSON files that still use the nested format? If all 61 files are flat, this fallback code should be flagged.
- **Check for unused lucide-react icons** in each file. The app now imports icons across 10+ files. Verify every imported icon is actually rendered in each file. Pay special attention to files modified across multiple phases (LandingPage.jsx was touched by Phases 2, 3, and 6).
- **Check localStorage keys:** The app now uses 5 localStorage keys: `promptbridge_progress`, `promptbridge_assessment`, `promptbridge_user_context`, `promptbridge_seen_safety_intro`, `promptbridge_seen_pre_scenario`. Verify no code reads or writes any other keys (e.g., the old `promptbridge_provider` for API keys).
- **Phase completion artifacts:** The project root contains `PHASE_1_COMPLETE.md` through `PHASE_5_COMPLETE.md`, `PHASE_6_REVIEW.md`, `HANDOFF_NOTES.md`, and `PROMPTBRIDGE_IMPROVEMENT_PLAN.md`. These are documentation artifacts — they should NOT be committed to the main branch. Flag them for removal before pushing.
- **`docs/IMPROVEMENT_CHANGELOG.md`** — Created by Phase 1. Verify it's in the `docs/` directory (appropriate for repo docs, not the built app).

---

## Audit Area 5: localStorage Security & Resilience (MEDIUM)

`src/services/storage.js` now manages **five** localStorage keys:

| Key | Type | Purpose |
|-----|------|---------|
| `promptbridge_progress` | JSON object | `{ completedScenarios: [], practicedPrinciples: [] }` |
| `promptbridge_assessment` | JSON object | `{ pre: null\|object, post: null\|object }` |
| `promptbridge_user_context` | JSON string/null | User's AI usage context (e.g., "Work emails & docs") |
| `promptbridge_seen_safety_intro` | string `"true"` | Whether first-visit banner has been dismissed |
| `promptbridge_seen_pre_scenario` | string `"true"` | Whether pre-scenario reminder has been dismissed |

**Audit tasks:**
- All `JSON.parse` calls are wrapped in try/catch with fallback defaults. Verify this is correct and that no parse failure can crash the app.
- The banner flags use string comparison (`=== "true"`) rather than JSON parsing. Verify this is consistent and that no code path could store a non-string value.
- Could a malicious browser extension modify localStorage to inject unexpected data? What happens with non-string values in arrays, invalid principle IDs (e.g., "P13" which doesn't exist), or oversized data?
- What happens if localStorage is full (quota exceeded)? Verify all `setItem` calls return meaningful success/failure.
- Is there a way for the user to reset all data? Should the app clean up unknown/stale localStorage keys?
- **NEW:** The banner dismiss flow: `App.jsx` reads `hasSeenSafetyIntro()` in a lazy `useState` initializer. If localStorage is corrupted, does the banner re-appear (safe default) or fail silently?

---

## Audit Area 6: React State & Component Bugs (MEDIUM)

### 6a. `handleScenarioComplete` stale closure

In `App.jsx`, `markCompleted` uses `useCallback` with `[completedScenarios, practicedPrinciples]` dependencies. It reads the current state values within the callback, constructs new arrays, and calls setters. The `handleScenarioComplete` function reads the return value of `markCompleted` for the "next scenario" logic. Verify this chain is robust and doesn't have stale closure issues.

### 6b. GuidedMode async loading

`GuidedMode.jsx` has a `useEffect` that loads pre-generated JSON with a `cancelled` flag, and a `retryFromError` function with an `unmountedRef` guard. Verify both async paths are protected against unmount.

### 6c. Collapsible category state

`ScenarioSelector.jsx` now uses `expandedCategories` state (a `Set`) to track which categories are expanded. Verify:
- Does the Set state update correctly (immutable pattern with `new Set(prev)`)?
- When switching between Guided Practice and Write Your Own tabs, does the expanded state reset or persist? Is either behavior correct?
- With all categories collapsed by default, is there a usability issue where a first-time user doesn't know to click to expand?

### 6d. Key prop correctness

`App.jsx` uses `key={selectedScenario.id}` on GuidedMode and FreeformMode. Verify this works correctly when navigating between scenarios via "Next Scenario."

### 6e. Banner state management (NEW)

`App.jsx` manages two banner visibility states (`showSafetyBanner`, `showPreScenario`) with lazy initializers from localStorage. Verify:
- The `AiSafetyBanner` only renders when `page === "landing"` AND `showSafetyBanner` is true. After dismissal, it never re-appears (even on page navigation).
- The `PreScenarioBanner` is passed as props through `ScenarioSelector`. Verify the prop drilling is correct and the dismiss callback reaches `App.jsx`.
- If a user clears localStorage manually, both banners should re-appear on next visit. Does the lazy initializer handle this correctly?

### 6f. ProgressPage teachingOrder sort (NEW)

`ProgressPage.jsx` sorts principles with `[...PRINCIPLES].sort((a, b) => a.teachingOrder - b.teachingOrder)`. Verify:
- The spread-then-sort doesn't mutate the original `PRINCIPLES` array.
- The sorted order is stable and matches the expected P8→P1→P2→P5→P3→P7→P4→P6→P9→P10→P11→P12 sequence.

### 6g. GuidedMode P5 callout conditional (NEW)

`GuidedMode.jsx` shows an indigo callout box when `scenario.principles.includes("P5")`. Verify:
- The callout appears only during the "explore" step, not during "write-own" or "write-results."
- Scenarios that don't include P5 never show this callout.
- The callout doesn't interfere with the accordion layout below it.

### 6h. FreeformMode P6 contextual tip (NEW)

`FreeformMode.jsx` shows an amber tip when `heuristic.principlesMissing.includes("P6")`. Verify:
- This only appears in the "heuristic-results" step, not before scoring.
- The tip doesn't show when P6 IS detected.
- What happens for scenarios that don't include P6 in their principles array at all?

---

## Audit Area 7: Data Layer Integrity (MEDIUM)

The data layer was significantly expanded in Phases 1 and 4. Verify internal consistency:

**Principles:**
- `principles.js` defines P1–P12. Verify all 12 have valid `id`, `name`, `description`, `icon`, `teachingOrder`, and `learnMoreUrl`.
- **NEW:** `teachingOrder` values must be unique integers 1–12 with no gaps. Expected mapping: P8=1, P1=2, P2=3, P5=4, P3=5, P7=6, P4=7, P6=8, P9=9, P10=10, P11=11, P12=12.
- `icon-map.js` must import and export every icon referenced by principles. Verify `EyeOff` and `Heart` are present alongside the original 10 icons.
- `heuristic-scorer.js` must have a `PRINCIPLE_CHECKS` entry for every principle P1–P12. Verify all 12 exist and their regex patterns are syntactically valid.

**Scenarios:**
- `scenarios.js` defines **76 scenarios** (61 guided + 15 freeform). Run `node scripts/validate-scenario.js --all` to verify.
- Every guided scenario must have a corresponding JSON file in `generated/`. List any guided scenario IDs that are missing a generated file.
- Every generated JSON file must have a corresponding scenario in `scenarios.js`. List any orphaned JSON files.
- Every principle referenced in a scenario's `principles` array must exist in `principles.js`. No dangling references like "P13".
- **NEW:** Verify the 8 new scenario IDs match their generated JSON filenames: `3.1-generic-email`, `2.15-code-almost-works`, `2.16-context-window-cliff`, `3.13-endless-redo`, `6.4-ai-agreed-bad-idea`, `6.5-refusal-decoder`, `6.6-safety-wall`, `4a.21-five-minute-expert`.

**Feedback format:**
- All 61 generated JSON files should have flat feedback: `{ what_happened, principle, principle_name, tip }`. No nested `{ weak: {...}, medium: {...}, strong: {...} }` format should remain.
- No generated JSON file should contain the field `user_picked_best`.
- **NEW:** The 8 hand-crafted JSON files (Phase 4) should match the same schema as the 53 pipeline-generated files. Spot-check that `scenarioId` matches filename, `options` has exactly 3 entries with `weak`/`medium`/`strong` quality values, and `responses` has all 3 response keys.

**Recommendation engine:**
- **NEW:** `recommendations.js` sorts by `minTeachingOrder` among unpracticed principles. Verify that new users (no practiced principles) get P8 scenarios first, and that after completing P8, P1 scenarios come next.

**Categories:**
- `categories.js` defines 5 categories. Verify every `category` value used in `scenarios.js` exists in `categories.js`.
- **NEW:** Verify the new scenario category assignments are correct: `3.1-generic-email` → `vague_vs_specific`, `2.15-code-almost-works` and `2.16-context-window-cliff` → `context_and_framing`, `3.13-endless-redo` → `iterative_refinement`, `4a.18` through `4a.21` → `smart_strategies`.

**Prompts:**
- `prompts.js` lists principles in the `FEEDBACK_GENERATOR_SYSTEM` prompt. Verify all 12 principle names are listed and match `principles.js`.

---

## Audit Area 8: Heuristic Scorer (MEDIUM)

`src/services/heuristic-scorer.js` uses regex patterns to detect communication principles in user prompts. Now covers P1–P12 with expanded P5 detection.

**Audit tasks:**
- **ReDoS:** Review each regex in `PRINCIPLE_CHECKS` for catastrophic backtracking. The patterns use alternation (`|`) inside `\b...\b`. Are any of the 12 patterns vulnerable to ReDoS with crafted input?
- **P5 expanded patterns (NEW):** Phase 3 added 10+ new patterns to P5 detection: `here's an example of what i want`, `here's a sample`, `something like`, `for reference`, `for instance`, `modeled on`, `in the style of`, `based on this example`. It also added quoted text block detection: double-quoted strings (20+ chars), triple-backtick code blocks, and `>` blockquote markers. Verify:
  - These new P5 patterns don't cause false positives on normal prompts. E.g., does "I want something like a professional email" falsely trigger P5?
  - The quoted block regex `/[""][^""]{20,}[""]/` — does this handle curly quotes correctly? What about escaped quotes inside the block?
  - The blockquote regex `/^>.*$/m` — this matches any line starting with `>`. In a multi-line prompt, could this false-positive on email-style quoting or comparison operators?
- **P11 and P12 patterns:** The P11 pattern matches terms like `knowledge cutoff`, `training data`, `browse`, `internet access`. The P12 pattern matches terms like `bias`, `stereotype`, `assumption`, `harmful`, `ethical`. Are these patterns too broad (false positives on normal prompts) or too narrow (missing obvious signals)?
- **Empty/whitespace input:** What happens if `scorePrompt` receives an empty string?
- **Edge cases:** Very long input (close to 4000 char limit), Unicode text, emoji, RTL characters.
- **P5 suggestion text (NEW):** The P5 suggestion now includes the research stat "This one technique can improve AI accuracy from 0% to 90%." Verify this text is grammatically correct and doesn't appear as jargon to beginners.

---

## Audit Area 9: Clipboard API (LOW)

Multiple components use `navigator.clipboard.writeText()`:
- `CopyButton.jsx`
- `AiToolLinks.jsx`

**Audit tasks:**
- Failures are caught but only logged to `console.error`. The user gets no visible feedback if copy fails. Is there a fallback?
- `setTimeout(() => setCopied(false), 2000)` is used without cleanup on unmount. React 19 silently ignores setState on unmounted components — but is this the right pattern?

---

## Audit Area 10: Build & Dependency Audit (LOW)

**Audit tasks:**
- Run `npm audit` and report any vulnerabilities.
- Verify `lodash-es` is tree-shaken correctly — only `groupBy` should be in the production bundle.
- Check `lucide-react` tree-shaking — the app now imports icons across many files (`Target`, `Users`, `Lightbulb`, `AlertCircle`, `Eye`, `PenTool`, `HelpCircle`, `Sparkles`, `RefreshCw`, `Zap`, `ShieldCheck`, `Scale`, `EyeOff`, `Heart`, `AlertTriangle`, `MessageSquare`, `X`, `Check`, `ChevronRight`, `ChevronLeft`, `ChevronDown`, `ArrowLeft`, `ArrowRight`, `Send`, `BookOpen`, `Star`, `BarChart3`, `Award`, `ExternalLink`, `Link`, `Shield`, `Search`). Verify only actually-used icons appear in the bundle.
- Does `prompts.js` get included in the production bundle? It's only used by the generation script.
- Verify `base: '/PromptBridge/'` is correct for GitHub Pages deployment.
- **NEW:** Verify test dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) are in `devDependencies` (not `dependencies`) and are NOT included in the production bundle.

---

## Audit Area 11: Content Generation Script (LOW — local dev only)

`scripts/generate-content.js` is NOT part of the built app. It runs locally to produce JSON files.

**Audit tasks:**
- **`--feedback-only` mode:** This mode reads existing JSON files, regenerates only the feedback field, and writes back. Verify it preserves the `options` and `responses` fields unchanged. Verify it doesn't introduce data corruption if interrupted mid-write.
- **Error sanitization:** `sanitizeErrorText()` strips API key patterns from error messages. Verify the regex patterns are comprehensive.
- **Path traversal:** The script writes to `src/data/generated/${scenario.id}.json`. Could a malicious scenario ID with `../` cause path traversal?
- **parseJSON fallback:** The character-by-character control-character sanitization fallback — is it correct?
- **NEW:** 8 of the 61 generated files were hand-crafted (not generated by this script). If the script is run with `--all`, will it overwrite the hand-crafted files? Is there a protection mechanism?

---

## Audit Area 12: User-Facing Language & Tone Audit (HIGH)

PromptBridge's primary audience is complete AI beginners — people who have never used ChatGPT, Claude, or any AI tool. All user-facing text must be plain language, jargon-free, and encouraging. Phase 3 did a language audit — verify the results are comprehensive and consistent.

### 12a. Jargon scan

Search ALL user-facing text (JSX content, not code comments) across every page and component for:

- **AI/ML jargon that should never appear:** "prompt engineering," "tokens," "context window," "system prompt," "temperature," "few-shot," "zero-shot," "RLHF," "fine-tuning," "embeddings," "RAG," "inference," "parameters," "weights," "training data" (except when explaining AI limitations), "LLM," "large language model," "neural network," "transformer," "hallucination" (except in the AI Safety page where it's defined), "sycophancy" (should never appear — use plain language equivalent)
- **Academic jargon that should never appear in the UI:** "Gricean," "maxim," "pragmatics," "cooperative principle," "sub-maxim," "Miehling," "EMNLP," "ASSETS," "NeuroBridge" (this belongs in README/docs only, not in the user-facing app)
- **Technical web jargon:** "localStorage," "JSON," "API," "API key," "backend," "frontend," "CSP," "XSS"
- **NEW — Research language that should be plain:** Phase 3 introduced research-backed language. Verify these appear as intended (user-friendly), not as raw academic citations. Specifically check for:
  - The 0%-to-90% stat — should be framed simply, not with citation details
  - The 60/40 split — should say "about 60% ... about 40%," not "according to our analysis of 80+ complaints"
  - "Peer-reviewed" — acceptable on the landing page as credibility signal, but verify it's not overused

Report every instance found, with file path and the specific text.

### 12b. Tone consistency

All feedback and instructional text should follow these rules:
- **Never open with a criticism** of the user's approach. Always normalize first ("This is how most people would phrase it").
- **Use "you" naturally** but never in a judgmental way ("Your prompt was too vague" is bad; "When a prompt is vague, the AI has to guess" is good).
- **Collaborative language:** "Next time, try..." not "You should have..."
- **No condescension:** Avoid "simply," "just," "obviously," "of course," "easy."
- **NEW — User vernacular:** Phase 3 introduced informal language from the research: "generic AI slop," "sounds like AI," "going in circles." Verify these are used naturally and don't come across as trying too hard to be casual.

Check all hardcoded UI text in:
- `LandingPage.jsx` (hero text, demo labels, AI honesty section, skills heading)
- `HelpPage.jsx` (all instructional sections, debugging protocol, common traps)
- `AiSafetyPage.jsx` (9 risk items, verification techniques, "New to AI" section, 60/40 section)
- `ScenarioSelector.jsx` (category descriptions, tab labels, pre-scenario banner)
- `GuidedMode.jsx` (step labels, feedback panel headers, P5 callout, button text)
- `FreeformMode.jsx` (instructions, scoring feedback, P6 contextual tip)
- `ProgressPage.jsx` (progress descriptions, teaching order explanation)
- `AssessmentMode.jsx` (assessment instructions)
- `AiSafetyBanner.jsx` (3 facts, dismiss button text)
- `PreScenarioBanner.jsx` (reminder text)

### 12c. Generated content language

The 61 generated JSON files contain AI-written or hand-crafted text for:
- `options[].text` — the three prompt examples (weak/medium/strong)
- `responses.response_weak`, `response_medium`, `response_strong` — simulated AI responses
- `feedback.what_happened` — explanation of what the user saw
- `feedback.principle` — principle explanation
- `feedback.tip` — actionable advice

**Spot-check at least 15 generated files** (mix of original 53 and the 8 new hand-crafted) for:
- Any remaining choice-based language ("you chose," "you picked," "great instinct," "your selection")
- Jargon or academic terminology that leaked through generation
- Condescending or judgmental tone
- References to "prompt engineering" instead of "how you talk to AI"
- **NEW:** The 8 hand-crafted files (Phase 4) should use the same user vernacular style as the Phase 3 language updates. Verify they use "generic AI slop," "sounds confident and still be wrong," etc. where appropriate — not academic phrasing.
- **NEW:** P5 scenarios (`3.1-generic-email`, `6.5-refusal-decoder`) should demonstrate few-shot prompting in their "strong" prompt option (pasting an example of desired output). Verify the examples are realistic and helpful.

### 12d. Principle names and descriptions

Review all 12 entries in `principles.js`. Each `name` and `description` will be displayed directly to users. Verify:
- Names are action-oriented and self-explanatory (a beginner should understand what each means without additional context)
- Descriptions use plain language — no jargon
- Consistency in style (all should follow the same grammatical pattern)
- **NEW:** The `teachingOrder` field is not user-facing but affects the order on `ProgressPage.jsx`. Verify the displayed order makes intuitive sense to a beginner (P8 "Ask the AI to write prompts for you" appearing first, etc.).

### 12e. Category descriptions

Review all 5 entries in `categories.js`. These are shown on the scenario selector page. Verify:
- Descriptions are clear and inviting for beginners
- No jargon or academic terminology
- Each description accurately reflects the scenarios within that category (including the 8 newly added scenarios from Phase 4)

---

## Audit Area 13: Accessibility (MEDIUM)

**Audit tasks:**
- Are all interactive elements properly labeled with `aria-label` or visible text? Pay special attention to:
  - Header: "AI Limits" button now has text but still needs a descriptive `aria-label` (currently "Using AI Wisely")
  - `AiSafetyBanner.jsx`: X dismiss button has `aria-label="Dismiss welcome banner"`
  - `PreScenarioBanner.jsx`: X dismiss button has `aria-label="Dismiss reminder"`
- Can the collapsible category sections in ScenarioSelector be navigated with keyboard? Do they have appropriate ARIA roles (`button`, `region`, `aria-expanded`)?
- The AiSafetyPage — does it have proper heading hierarchy and landmark elements?
- Do color combinations meet WCAG AA contrast ratios? Check:
  - Amber/stone combinations on AiSafetyPage and PreScenarioBanner
  - Indigo/stone on AiSafetyBanner and P5 callout in GuidedMode
  - Rose/stone on LandingPage sycophancy bullet
- GuidedMode uses color (rose/amber/emerald) to indicate tier quality. Is this accessible to colorblind users? Is there a non-color indicator (the icon + label)?
- **NEW:** `ProgressPage.jsx` sorts principles by `teachingOrder`. Is this reordering communicated to screen readers? The explanatory text says "Ordered by impact" — verify this is clear enough.
- **NEW:** The P5 callout in `GuidedMode.jsx` uses a `Star` icon. Is this purely decorative or does it need an aria label?
- **NEW:** The P6 tip in `FreeformMode.jsx` uses a `Lightbulb` icon. Is this purely decorative?

---

## Audit Area 14: Test Coverage Review (NEW)

Phase 5 added 123 tests. Review the test infrastructure and coverage for gaps:

**Infrastructure:**
- `vitest.config.js` — Verify the configuration is correct: jsdom environment, React plugin, setup file path, test file pattern.
- `setup.js` — Imports `@testing-library/jest-dom/vitest`. Verify this provides the expected matchers.
- The localStorage mock in `storage.test.js` uses `vi.stubGlobal`. Verify this doesn't leak between tests (proper cleanup in `beforeEach`/`afterEach`).

**Coverage gaps to investigate:**
- **No test for `resolveFeedback()` in GuidedMode.** This function handles flat vs. nested feedback formats. Is it tested anywhere? If not, this is a gap since it's the only defense against a format mismatch.
- **No test for LandingPage rendering.** Phase 5 notes explain this was skipped due to complex dependencies. What specific dependencies block testing? Could the AI honesty section be tested in isolation?
- **No test for AiSafetyPage content.** The "New to AI" section and 60/40 split section were added in Phase 2. Are there tests verifying these render?
- **No test for HelpPage debugging protocol.** Phase 3 added a significant content section. Is there at least a smoke test?
- **No test for ProgressPage teachingOrder sort.** Phase 3 changed the display order. Is there a test verifying the sort?
- **Heuristic scorer P5 quoted block detection:** The test file covers P5 patterns — verify it specifically tests the quoted block regex (20+ char strings, triple backticks, blockquote markers).
- **Recommendation engine edge cases:** What happens if `PRINCIPLE_MAP[id]?.teachingOrder` returns `undefined` for an unknown principle? The `?? 99` fallback is tested?
- **Component tests:** `AiSafetyBanner` and `PreScenarioBanner` are tested. `Header` is tested. Are the test assertions specific enough? Do they test the actual user-visible text (e.g., "AI Limits" label, "Got it, let's start learning" button)?

**Test quality:**
- Are any tests tautological (testing the implementation rather than the behavior)?
- Are the localStorage mock patterns consistent across test files?
- Could any tests pass even if the feature is broken (false positives)?

---

## Format your review as:

1. **Executive Summary:** Overall security posture, code quality, test coverage, and language consistency. What's the remaining attack surface? How beginner-friendly is the current language? Are there meaningful test gaps?

2. **Critical/High Issues:** Anything that poses real risk, is clearly broken, or contains jargon visible to users. Include exact file paths and line numbers.

3. **Dead Code & Cleanup:** Every orphaned file, unused import, stale format, or leftover reference. For each, state whether it should be deleted or kept and why.

4. **Language Issues:** Every jargon instance, tone violation, or confusing wording found. Organized by file, with the current text and a suggested replacement.

5. **Data Integrity Issues:** Any mismatches between principles, scenarios, generated files, categories, or teachingOrder.

6. **Test Coverage Issues:** Gaps in the test suite, false-positive risk, infrastructure concerns.

7. **Medium/Low Issues:** Bugs, edge cases, and hardening opportunities.

8. **Actionable Fixes:** For each Critical or High issue, provide a specific code snippet showing the fix.

9. **Recommended Test Additions:** The 10 most valuable tests to add next, focusing on the gaps identified in Area 14.

10. **Recommended Manual Test Scenarios:** The 10 most important manual test cases, focusing on the new Phase 1-6 features: teaching order flow, AI safety banners, P5 callout, debugging protocol, new scenarios, and language consistency.
