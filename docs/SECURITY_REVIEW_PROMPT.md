# PromptBridge — Security, Bug & Dead Code Audit (v3)

*Your task is a comprehensive audit of the PromptBridge codebase — security review, bug hunting, and dead code cleanup.*

Act as a veteran Senior Frontend/Web Platform Engineer with 15-20 years of experience. You have deep expertise in building secure client-side web applications using React, Vite, and browser APIs. You specialize in static sites that render pre-generated content, handle user input for client-side scoring, and interact with the clipboard API.

## Context

PromptBridge is a **fully static web application** deployed on GitHub Pages that teaches people to communicate effectively with AI assistants. It makes **zero outbound network requests**, stores **no secrets**, and has **no backend**. Users practice with interactive scenarios, get client-side heuristic feedback on their prompts, then copy their prompts to real AI tools (ChatGPT, Claude, Gemini, Copilot).

The app recently underwent a major architectural pivot: all API key functionality, browser-to-LLM calls, and API-dependent modes were removed. This is the first audit of the post-pivot codebase. Your goals are:

1. **Find security vulnerabilities** in the current static architecture
2. **Find bugs** — React state issues, edge cases, broken flows
3. **Find dead code** — orphaned imports, unused components, leftover references from the API removal
4. **Verify the security hardening** applied during the pivot is correct and complete

## The Codebase

* **Frontend:** React 19, JavaScript (no TypeScript), Vite 8, Tailwind CSS v4, lodash-es (groupBy only), lucide-react
* **Architecture:** Fully static SPA, zero outbound network requests, deployed on GitHub Pages
* **Content:** 30 pre-generated JSON scenario files (generated once by a local Node.js script, committed to repo)
* **Scoring:** Client-side heuristic scorer using regex pattern matching against 8 communication principles
* **Storage:** Progress, assessment results, and user context stored in `localStorage` as JSON
* **Content Rendering:** Custom `MarkdownText` component uses `escapeHtml()` + regex bold/italic + `dangerouslySetInnerHTML`
* **Content Security Policy:** `<meta>` tag in `index.html`:
  ```
  default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';
  ```
* **Clickjacking:** JavaScript frame-buster in `main.jsx` (since CSP `frame-ancestors` doesn't work in `<meta>` tags)
* **Tests:** None. Zero test files exist.
* **Build Config:** Vite with `base: '/PromptBridge/'`

### File inventory

**Pages (src/pages/) — 7 components:**
LandingPage, ScenarioSelector, GuidedMode, FreeformMode, AssessmentMode, ProgressPage, HelpPage

**Components (src/components/) — 8 files:**
Header, AiToolLinks, CopyButton, MarkdownText, ResponseComparison, PrincipleBadge, ErrorBanner, LoadingSpinner

**Services (src/services/) — 4 files:**
heuristic-scorer.js, guided-data.js, recommendations.js, storage.js

**Data (src/data/) — 7 files + 30 generated JSON:**
scenarios.js (45 scenarios), principles.js, categories.js, prompts.js (used only by generate-content.js script), assessment-scenarios.js, demo.js, icon-map.js, plus `generated/*.json`

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

---

## Audit Area 2: Content Security Policy (HIGH)

Current CSP in `index.html`:
```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';
```

**Audit tasks:**
- Is `'unsafe-inline'` for styles actually required by Tailwind CSS v4's Vite plugin? Could it be replaced with a hash or nonce approach? What attack vectors does `'unsafe-inline'` for styles enable (CSS injection, data exfiltration)?
- There is no `connect-src` directive. With `default-src 'self'`, `connect-src` falls back to `'self'`. Should `connect-src 'none'` be set explicitly to prevent any fetch/XHR from same-origin?
- There is no `font-src` directive. Falls back to `default-src 'self'`. Is this correct?
- `frame-ancestors` is absent (intentionally — doesn't work in meta tags). Is the JavaScript frame-buster in `main.jsx` a sufficient replacement? What are its limitations (e.g., sandbox attribute, JavaScript disabled)?
- On GitHub Pages, `script-src 'self'` means any JS file served from the same GitHub Pages origin could execute. Could an attacker inject a malicious JS file via a PR to the repo? How does CODEOWNERS mitigate this?

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
- Can this be bypassed with the `sandbox` attribute on an iframe (e.g., `sandbox="allow-scripts"`)?
- What happens if JavaScript is disabled in the framing page? Is the frame-buster still effective?
- Is `document.body.innerHTML = '...'` safe here, or could it be a vector itself? (The string is a hardcoded literal, but verify.)
- Should `window.top.location = window.self.location` be used instead of/in addition to blanking the body?

---

## Audit Area 4: Dead Code & Orphaned Artifacts (HIGH)

The recent architectural pivot removed HybridMode, MultiTurnMode, SettingsPage, and the LLM service. **Verify the cleanup was thorough:**

- **`src/components/ResponseComparison.jsx`** — This component is defined but NOT imported by any file. It was used by the deleted API-powered modes and the API branch of GuidedMode/FreeformMode. Is it safe to delete? Are there any references to it?
- **`src/data/prompts.js`** — Exports 6 functions/constants used only by `scripts/generate-content.js` (which is NOT part of the built app). Verify: does Vite tree-shake this file out of the production bundle, or does it get included because it's in `src/data/`?
- **`.env.example`** — Verify it no longer references any `VITE_` prefixed variables (which would be bundled by Vite).
- **Search the entire `src/` directory** for any remaining references to: `hasApiKey`, `callLLM`, `analyzeFreeform`, `simulateResponses`, `generateVariations`, `generateInitialResponse`, `generateImprovedResponse`, `generateMultiTurnFeedback`, `getProviderConfig`, `PROVIDER_STORAGE_KEY`, `promptbridge_provider`, `HybridMode`, `MultiTurnMode`, `SettingsPage`, `llm.js`, `apiKey`, `api_key`, `provider` (in a config context), `BYOK`.
- **Check localStorage keys:** The app previously stored API keys under `promptbridge_provider`. Is there any code that still reads or writes this key? If a user has this key from a previous session, does it cause any issues?
- **Check for unused lucide-react icons** in each file — were all icon imports cleaned up after removing features?

---

## Audit Area 5: localStorage Security & Resilience (MEDIUM)

`src/services/storage.js` manages three localStorage buckets:
- `promptbridge_progress` — `{ completedScenarios: [], practicedPrinciples: [] }`
- `promptbridge_assessment` — `{ pre: null|object, post: null|object }`
- `promptbridge_user_context` — string or null

`App.jsx` loads these via lazy `useState` initializers.

**Audit tasks:**
- All `JSON.parse` calls are wrapped in try/catch with fallback defaults. Verify this is correct and that no parse failure can crash the app or cause inconsistent state.
- Could a malicious browser extension modify localStorage values to inject unexpected data? What happens if `completedScenarios` contains non-string values? If `practicedPrinciples` contains invalid principle IDs?
- What happens if localStorage is full (quota exceeded)? The `catch` blocks log errors but the app continues. Could this cause data loss or inconsistent state?
- `App.jsx` calls `loadProgress()` twice on init (once for `completedScenarios`, once for `practicedPrinciples`). Is this a double-parse inefficiency?
- Is there a way for the user to reset all data? Currently only progress is used — but stale `promptbridge_provider` keys from before the architectural pivot might persist. Should the app clean up unknown localStorage keys?

---

## Audit Area 6: React State & Component Bugs (MEDIUM)

### 6a. `handleScenarioComplete` stale closure

In `App.jsx`:
```javascript
const handleScenarioComplete = (scenario, extraPrinciples) => {
    markCompleted(scenario, extraPrinciples);
    // completedScenarios is stale here — markCompleted just called setCompletedScenarios
    const next = pool.find((s, i) => i > currentIdx && !completedScenarios.includes(s.id));
```

`markCompleted` calls `setCompletedScenarios(newCompleted)`, but the immediately following `completedScenarios.includes()` reads the pre-update state. The `i > currentIdx` check prevents the just-completed scenario from being selected as "next," but verify this is robust.

### 6b. GuidedMode async loading

`GuidedMode.jsx` has a `useEffect` that loads pre-generated JSON content with a `cancelled` flag, and a `retryFromError` function with an `unmountedRef` guard. Verify:
- Does the `cancelled` flag in the `useEffect` correctly prevent double-loading in React 19 StrictMode?
- Is the `unmountedRef` guard applied to all async paths?

### 6c. Key prop correctness

`App.jsx` uses `key={selectedScenario.id}` on GuidedMode and FreeformMode to force remounting when the scenario changes. Verify this works correctly when navigating between scenarios via "Next Scenario."

### 6d. Inline function props

`App.jsx` passes inline arrow functions as props (e.g., `onBack={() => navigate("scenarios")}`). In an app this size, this shouldn't cause performance issues — but verify there are no unexpected re-render cascades.

---

## Audit Area 7: Heuristic Scorer (LOW-MEDIUM)

`src/services/heuristic-scorer.js` uses regex patterns to detect communication principles in user prompts.

**Audit tasks:**
- **ReDoS:** Review each regex in `PRINCIPLE_CHECKS` for catastrophic backtracking. The patterns use alternation (`|`) inside `\b...\b`. Are any vulnerable to ReDoS with crafted input?
- **Empty/whitespace input:** What happens if `scorePrompt` receives an empty string? The callers check `userPrompt.trim()` before calling, but is the scorer itself resilient?
- **Edge cases:** What happens with very long input (close to the 4000 char limit)? Any performance concerns?
- **Encoding:** What happens if the user pastes Unicode text, emoji, or RTL characters into the textarea? Does the scorer handle these gracefully?

---

## Audit Area 8: Clipboard API (LOW)

Multiple components use `navigator.clipboard.writeText()`:
- `CopyButton.jsx` (line 14)
- `AiToolLinks.jsx` (line 17)

**Audit tasks:**
- Failures are caught but only logged to `console.error`. The user gets no visible feedback if the copy fails. For beginners, this could be confusing. Is there a fallback mechanism?
- `navigator.clipboard` requires a secure context (HTTPS) and user gesture. GitHub Pages serves over HTTPS, so the secure context requirement is met. But are there browsers or configurations where this fails silently?
- In `AiToolLinks.jsx`, `setTimeout(() => setCopied(false), 2000)` is used without cleanup. If the component unmounts before the timeout fires, React 19 will silently ignore the setState — but is this the right pattern?

---

## Audit Area 9: Build & Dependency Audit (LOW)

**Audit tasks:**
- Run `npm audit` and report any vulnerabilities in the dependency tree.
- Verify that `lodash-es` is tree-shaken correctly — only `groupBy` should be in the production bundle (previously `shuffle` was also used by the deleted HybridMode).
- Check the production bundle size. Is `lucide-react` being tree-shaken properly, or are all icons included?
- Verify the Vite build configuration. Is `base: '/PromptBridge/'` correct for the GitHub Pages deployment path?
- Does `prompts.js` (which is only used by the generation script, not the app) get included in the production bundle? If so, it adds ~5KB of unused prompt template strings.

---

## Audit Area 10: Content Generation Script (LOW — local dev only)

`scripts/generate-content.js` is NOT part of the built app — it runs locally on developer machines. But it produces the JSON files that ship with the app.

**Audit tasks:**
- **Error sanitization:** The script now has a `sanitizeErrorText()` function that strips API key patterns from error messages. Verify the regex patterns are correct and comprehensive.
- **Path traversal:** The script writes to `src/data/generated/${scenario.id}.json`. Scenario IDs come from `scenarios.js` (developer-controlled). Could a malicious scenario ID with `../` cause a path traversal? (Low risk since IDs are hardcoded, but verify `path.join` behavior.)
- **Output validation:** The script writes LLM output as JSON without validating the schema. Could malformed LLM output produce JSON files that crash the app at runtime?
- **parseJSON fallback:** The script has a character-by-character control-character sanitization fallback (lines ~115-140). Is this implementation correct?

---

## Audit Area 11: Accessibility (LOW)

**Audit tasks:**
- Are all interactive elements (buttons, links, inputs) properly labeled with `aria-label` or visible text?
- Can the entire app be navigated with keyboard only? Are there focus traps?
- Do the color combinations meet WCAG AA contrast ratios? The app uses stone/indigo/emerald/amber/rose color tokens.
- Is `role` used appropriately? Are there any missing landmark elements?
- The side-by-side comparison in GuidedMode uses color (rose vs. emerald) to indicate weak vs. strong. Is this accessible to colorblind users?

---

## Format your review as:

1. **Executive Summary:** Overall security posture of the static app. Is it well-hardened? What's the remaining attack surface?

2. **Critical/High Issues:** Anything that poses real risk or is clearly broken. Include exact file paths and line numbers.

3. **Dead Code & Cleanup:** Every orphaned file, unused import, or leftover reference from the API removal. For each, state whether it should be deleted or kept and why.

4. **Medium/Low Issues:** Bugs, edge cases, and hardening opportunities.

5. **Actionable Fixes:** For each Critical or High issue, provide a specific code snippet showing the fix.

6. **Recommended Test Scenarios:** The 10 most important manual test cases, focusing on edge cases and the areas most likely to break.
