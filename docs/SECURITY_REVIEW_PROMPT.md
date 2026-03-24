# PromptBridge — Security, Bug, Dead Code & Language Audit (v4)

*Your task is a comprehensive audit of the PromptBridge codebase — security review, bug hunting, dead code cleanup, and user-facing language review.*

Act as a veteran Senior Frontend/Web Platform Engineer with 15-20 years of experience. You have deep expertise in building secure client-side web applications using React, Vite, and browser APIs. You specialize in static sites that render pre-generated content, handle user input for client-side scoring, and interact with the clipboard API. You also have strong UX writing instincts and can identify jargon, inconsistent tone, and language that would confuse a complete beginner.

## Context

PromptBridge is a **fully static web application** deployed on GitHub Pages that teaches people to communicate effectively with AI assistants. It makes **zero outbound network requests**, stores **no secrets**, and has **no backend**. Users practice with interactive scenarios, get client-side heuristic feedback on their prompts, then copy their prompts to real AI tools (ChatGPT, Claude, Gemini, Copilot).

**Recent changes since the last audit (v3):**
- Expanded from 8 to **12 communication principles** (added P9 "Verify before you trust", P10 "Include everything needed — but nothing extra", P11 "Know what AI can't do", P12 "Use AI responsibly")
- Expanded from 45 to **68 scenarios** (53 guided + 15 freeform)
- **New page:** `AiSafetyPage.jsx` — standalone "Using AI Wisely" guide with 9 risk items, extracted from HelpPage
- **Feedback rewrite:** All 53 generated JSON files now use flat, choice-neutral feedback format (no more nested weak/medium/strong feedback variants)
- **Collapsible categories** in ScenarioSelector with completion counters
- **New icons:** `EyeOff` and `Heart` added to icon-map.js
- **Updated generate-content.js:** Added `--feedback-only` mode, changed from 3 feedback variants to 1 neutral feedback per scenario
- **Landing page:** Added "Heads Up" button linking to AI Safety page
- **Header:** Added AlertTriangle icon button for AI Safety page navigation
- **HelpPage:** AI Safety content replaced with summary card + link to standalone page

Your goals are:
1. **Find security vulnerabilities** in the current static architecture
2. **Find bugs** — React state issues, edge cases, broken flows
3. **Find dead code** — orphaned imports, unused components, leftover references
4. **Audit user-facing language** — jargon, inconsistent tone, unclear wording for beginners
5. **Verify the data layer integrity** — all 12 principles referenced correctly, no dangling scenario IDs

## The Codebase

* **Frontend:** React 19, JavaScript (no TypeScript), Vite 8, Tailwind CSS v4, lodash-es (groupBy only), lucide-react
* **Architecture:** Fully static SPA, zero outbound network requests, deployed on GitHub Pages
* **Content:** 53 pre-generated JSON scenario files (generated once by a local Node.js script, committed to repo)
* **Scoring:** Client-side heuristic scorer using regex pattern matching against 12 communication principles
* **Storage:** Progress, assessment results, and user context stored in `localStorage` as JSON
* **Content Rendering:** Custom `MarkdownText` component uses `escapeHtml()` + regex bold/italic + `dangerouslySetInnerHTML`
* **Content Security Policy:** `<meta>` tag in `index.html` (verify current directives)
* **Clickjacking:** JavaScript frame-buster in `main.jsx`
* **Tests:** None. Zero test files exist.
* **Build Config:** Vite with `base: '/PromptBridge/'`

### File inventory

**Pages (src/pages/) — 8 components:**
LandingPage, ScenarioSelector, GuidedMode, FreeformMode, AssessmentMode, ProgressPage, HelpPage, AiSafetyPage

**Components (src/components/) — 8 files:**
Header, AiToolLinks, CopyButton, MarkdownText, ResponseComparison, PrincipleBadge, ErrorBanner, LoadingSpinner

**Services (src/services/) — 4 files:**
heuristic-scorer.js, guided-data.js, recommendations.js, storage.js

**Data (src/data/) — 8 files + 53 generated JSON:**
scenarios.js (68 scenarios), principles.js (12 principles), categories.js, prompts.js (used only by generate-content.js script), assessment-scenarios.js, demo.js, icon-map.js, plus `generated/*.json`

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
- **NEW:** The `AiSafetyPage.jsx` renders hardcoded JSX strings. Verify no dynamic content is rendered unsafely on this page.

---

## Audit Area 2: Content Security Policy (HIGH)

Check the current CSP in `index.html` (it may have been updated since v3).

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

**Verify the following:**

- **`src/components/ResponseComparison.jsx`** — This component was used by deleted API-powered modes. Is it imported anywhere? Is it safe to delete?
- **`src/data/prompts.js`** — Exports functions used only by `scripts/generate-content.js` (NOT part of the built app). Verify: does Vite tree-shake this file out of the production bundle, or does it get included because other data files import from `principles.js` which is in the same directory?
- **`.env.example`** — Verify it no longer references any `VITE_` prefixed variables.
- **Search the entire `src/` directory** for remaining references to deleted features: `hasApiKey`, `callLLM`, `analyzeFreeform`, `simulateResponses`, `generateVariations`, `generateInitialResponse`, `generateImprovedResponse`, `generateMultiTurnFeedback`, `getProviderConfig`, `PROVIDER_STORAGE_KEY`, `promptbridge_provider`, `HybridMode`, `MultiTurnMode`, `SettingsPage`, `llm.js`, `apiKey`, `api_key`, `BYOK`.
- **Check for stale feedback format handling:** `GuidedMode.jsx` has a `resolveFeedback()` function that handles both flat and nested (weak/medium/strong) feedback formats. All 53 generated files now use flat format. Is the nested format fallback dead code? Are there any generated JSON files that still use the nested format?
- **Check for unused lucide-react icons** in each file. Recently added `EyeOff` and `Heart` — verify they're used. Check all other files for icons imported but not rendered.
- **Check localStorage keys:** The app previously stored API keys under `promptbridge_provider`. Is there any code that still reads or writes this key?
- **`user_picked_best` field:** This field was removed from the feedback generation. Verify no source code references it. Verify no generated JSON files still contain it.

---

## Audit Area 5: localStorage Security & Resilience (MEDIUM)

`src/services/storage.js` manages three localStorage buckets:
- `promptbridge_progress` — `{ completedScenarios: [], practicedPrinciples: [] }`
- `promptbridge_assessment` — `{ pre: null|object, post: null|object }`
- `promptbridge_user_context` — string or null

**Audit tasks:**
- All `JSON.parse` calls are wrapped in try/catch with fallback defaults. Verify this is correct and that no parse failure can crash the app.
- Could a malicious browser extension modify localStorage to inject unexpected data? What happens with non-string values in arrays, invalid principle IDs (e.g., "P13" which doesn't exist), or oversized data?
- What happens if localStorage is full (quota exceeded)?
- Is there a way for the user to reset all data? Should the app clean up unknown/stale localStorage keys?

---

## Audit Area 6: React State & Component Bugs (MEDIUM)

### 6a. `handleScenarioComplete` stale closure

In `App.jsx`, `markCompleted` calls `setCompletedScenarios(newCompleted)`, but the immediately following `completedScenarios.includes()` reads pre-update state. Verify this is robust.

### 6b. GuidedMode async loading

`GuidedMode.jsx` has a `useEffect` that loads pre-generated JSON with a `cancelled` flag, and a `retryFromError` function with an `unmountedRef` guard. Verify both async paths are protected against unmount.

### 6c. Collapsible category state

`ScenarioSelector.jsx` now uses `expandedCategories` state (a `Set`) to track which categories are expanded. Verify:
- Does the Set state update correctly (immutable pattern with `new Set(prev)`)?
- When switching between Guided Practice and Write Your Own tabs, does the expanded state reset or persist? Is either behavior correct?
- With all categories collapsed by default, is there a usability issue where a first-time user doesn't know to click to expand?

### 6d. Key prop correctness

`App.jsx` uses `key={selectedScenario.id}` on GuidedMode and FreeformMode. Verify this works correctly when navigating between scenarios via "Next Scenario."

### 6e. AiSafetyPage routing

The new `"ai-safety"` route is added to App.jsx. Verify:
- The Header highlights the correct icon when on the AI Safety page
- Navigation from HelpPage → AI Safety → back works correctly
- The "Back to scenarios" link on AiSafetyPage functions correctly

---

## Audit Area 7: Data Layer Integrity (MEDIUM)

The data layer was significantly expanded. Verify internal consistency:

**Principles:**
- `principles.js` defines P1–P12. Verify all 12 have valid `id`, `name`, `description`, `icon`, and `learnMoreUrl`.
- `icon-map.js` must import and export every icon referenced by principles. Verify `EyeOff` and `Heart` are present alongside the original 10 icons.
- `heuristic-scorer.js` must have a `PRINCIPLE_CHECKS` entry for every principle P1–P12. Verify all 12 exist and their regex patterns are syntactically valid.

**Scenarios:**
- `scenarios.js` defines 68 scenarios (53 guided + 15 freeform). Run `node scripts/validate-scenario.js --all` to verify.
- Every guided scenario must have a corresponding JSON file in `generated/`. List any guided scenario IDs that are missing a generated file.
- Every generated JSON file must have a corresponding scenario in `scenarios.js`. List any orphaned JSON files.
- Every principle referenced in a scenario's `principles` array must exist in `principles.js`. No dangling references like "P13".

**Feedback format:**
- All 53 generated JSON files should now have flat feedback: `{ what_happened, principle, principle_name, tip }`. No nested `{ weak: {...}, medium: {...}, strong: {...} }` format should remain.
- No generated JSON file should contain the field `user_picked_best`.

**Categories:**
- `categories.js` defines 5 categories. Verify every `category` value used in `scenarios.js` exists in `categories.js`.

**Prompts:**
- `prompts.js` lists principles in the `FEEDBACK_GENERATOR_SYSTEM` prompt. Verify all 12 principle names are listed and match `principles.js`.

---

## Audit Area 8: Heuristic Scorer (MEDIUM)

`src/services/heuristic-scorer.js` uses regex patterns to detect communication principles in user prompts. Now covers P1–P12.

**Audit tasks:**
- **ReDoS:** Review each regex in `PRINCIPLE_CHECKS` for catastrophic backtracking. The patterns use alternation (`|`) inside `\b...\b`. Are any of the 12 patterns vulnerable to ReDoS with crafted input?
- **New patterns P11 and P12:** The P11 pattern matches terms like `knowledge cutoff`, `training data`, `browse`, `internet access`. The P12 pattern matches terms like `bias`, `stereotype`, `assumption`, `harmful`, `ethical`. Are these patterns too broad (false positives on normal prompts) or too narrow (missing obvious signals)?
- **Empty/whitespace input:** What happens if `scorePrompt` receives an empty string?
- **Edge cases:** Very long input (close to 4000 char limit), Unicode text, emoji, RTL characters.

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
- Check `lucide-react` tree-shaking — with 14 icons now imported (`Target`, `Users`, `Lightbulb`, `AlertCircle`, `Eye`, `PenTool`, `HelpCircle`, `Sparkles`, `RefreshCw`, `Zap`, `ShieldCheck`, `Scale`, `EyeOff`, `Heart`), verify only these appear in the bundle.
- Does `prompts.js` get included in the production bundle? It's only used by the generation script.
- Verify `base: '/PromptBridge/'` is correct for GitHub Pages deployment.

---

## Audit Area 11: Content Generation Script (LOW — local dev only)

`scripts/generate-content.js` is NOT part of the built app. It runs locally to produce JSON files.

**Audit tasks:**
- **`--feedback-only` mode:** This new mode reads existing JSON files, regenerates only the feedback field, and writes back. Verify it preserves the `options` and `responses` fields unchanged. Verify it doesn't introduce data corruption if interrupted mid-write.
- **Error sanitization:** `sanitizeErrorText()` strips API key patterns from error messages. Verify the regex patterns are comprehensive.
- **Path traversal:** The script writes to `src/data/generated/${scenario.id}.json`. Could a malicious scenario ID with `../` cause path traversal?
- **parseJSON fallback:** The character-by-character control-character sanitization fallback — is it correct?

---

## Audit Area 12: User-Facing Language & Tone Audit (HIGH)

PromptBridge's primary audience is complete AI beginners — people who have never used ChatGPT, Claude, or any AI tool. All user-facing text must be plain language, jargon-free, and encouraging.

### 12a. Jargon scan

Search ALL user-facing text (JSX content, not code comments) across every page and component for:

- **AI/ML jargon that should never appear:** "prompt engineering," "tokens," "context window," "system prompt," "temperature," "few-shot," "zero-shot," "RLHF," "fine-tuning," "embeddings," "RAG," "inference," "parameters," "weights," "training data" (except when explaining AI limitations), "LLM," "large language model," "neural network," "transformer," "hallucination" (except in the AI Safety page where it's defined), "sycophancy" (should never appear — use plain language equivalent)
- **Academic jargon that should never appear in the UI:** "Gricean," "maxim," "pragmatics," "cooperative principle," "sub-maxim," "Miehling," "EMNLP," "ASSETS," "NeuroBridge" (this belongs in README/docs only, not in the user-facing app)
- **Technical web jargon:** "localStorage," "JSON," "API," "API key," "backend," "frontend," "CSP," "XSS"

Report every instance found, with file path and the specific text.

### 12b. Tone consistency

All feedback and instructional text should follow these rules:
- **Never open with a criticism** of the user's approach. Always normalize first ("This is how most people would phrase it").
- **Use "you" naturally** but never in a judgmental way ("Your prompt was too vague" is bad; "When a prompt is vague, the AI has to guess" is good).
- **Collaborative language:** "Next time, try..." not "You should have..."
- **No condescension:** Avoid "simply," "just," "obviously," "of course," "easy."

Check all hardcoded UI text in:
- `LandingPage.jsx` (hero text, demo labels)
- `HelpPage.jsx` (all instructional sections)
- `AiSafetyPage.jsx` (all 9 risk items, verification techniques)
- `ScenarioSelector.jsx` (category descriptions, tab labels)
- `GuidedMode.jsx` (step labels, feedback panel headers, button text)
- `FreeformMode.jsx` (instructions, scoring feedback)
- `ProgressPage.jsx` (progress descriptions)
- `AssessmentMode.jsx` (assessment instructions)

### 12c. Generated content language

The 53 generated JSON files contain AI-written text for:
- `options[].text` — the three prompt examples (weak/medium/strong)
- `responses.response_weak`, `response_medium`, `response_strong` — simulated AI responses
- `feedback.what_happened` — explanation of what the user saw
- `feedback.principle` — principle explanation
- `feedback.tip` — actionable advice

**Spot-check at least 10 generated files** (mix of old and new scenarios) for:
- Any remaining choice-based language ("you chose," "you picked," "great instinct," "your selection")
- Jargon or academic terminology that leaked through generation
- Condescending or judgmental tone
- References to "prompt engineering" instead of "how you talk to AI"

### 12d. Principle names and descriptions

Review all 12 entries in `principles.js`. Each `name` and `description` will be displayed directly to users. Verify:
- Names are action-oriented and self-explanatory (a beginner should understand what each means without additional context)
- Descriptions use plain language — no jargon
- Consistency in style (all should follow the same grammatical pattern)

### 12e. Category descriptions

Review all 5 entries in `categories.js`. These are shown on the scenario selector page. Verify:
- Descriptions are clear and inviting for beginners
- No jargon or academic terminology
- Each description accurately reflects the scenarios within that category (including newly added P11/P12 scenarios)

---

## Audit Area 13: Accessibility (LOW)

**Audit tasks:**
- Are all interactive elements properly labeled with `aria-label` or visible text? Pay special attention to the new icon-only buttons (AlertTriangle for AI Safety in the header).
- Can the collapsible category sections in ScenarioSelector be navigated with keyboard? Do they have appropriate ARIA roles (`button`, `region`, `aria-expanded`)?
- The new AiSafetyPage — does it have proper heading hierarchy and landmark elements?
- Do color combinations meet WCAG AA contrast ratios? Check amber/stone combinations on AiSafetyPage.
- GuidedMode uses color (rose/amber/emerald) to indicate tier quality. Is this accessible to colorblind users? Is there a non-color indicator (the icon + label)?

---

## Format your review as:

1. **Executive Summary:** Overall security posture, code quality, and language consistency. What's the remaining attack surface? How beginner-friendly is the current language?

2. **Critical/High Issues:** Anything that poses real risk, is clearly broken, or contains jargon visible to users. Include exact file paths and line numbers.

3. **Dead Code & Cleanup:** Every orphaned file, unused import, stale format, or leftover reference. For each, state whether it should be deleted or kept and why.

4. **Language Issues:** Every jargon instance, tone violation, or confusing wording found. Organized by file, with the current text and a suggested replacement.

5. **Data Integrity Issues:** Any mismatches between principles, scenarios, generated files, and categories.

6. **Medium/Low Issues:** Bugs, edge cases, and hardening opportunities.

7. **Actionable Fixes:** For each Critical or High issue, provide a specific code snippet showing the fix.

8. **Recommended Test Scenarios:** The 10 most important manual test cases, focusing on edge cases, new features (collapsible categories, AI Safety page, new scenarios), and language consistency.
