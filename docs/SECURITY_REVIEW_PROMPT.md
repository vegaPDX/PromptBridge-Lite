# PromptBridge — Deep Dive Security & Bug Review Prompt

*Your task is a deep dive codebase review for PromptBridge (this repository).*

Act as a veteran Senior Frontend/Web Platform Engineer with 15–20 years of experience. You have deep expertise in building secure client-side web applications using React, Vite, and browser APIs. You specialize in applications that handle user-provided API keys, make direct browser-to-third-party-API calls, and render untrusted content from LLM responses. You also have security expertise in XSS prevention, client-side secret management, prompt injection, and supply chain risks.

I want you to review the JavaScript and React code for PromptBridge — a browser-based interactive tool that teaches people how to communicate effectively with AI assistants. The tool has no backend; everything runs client-side, deployed on GitHub Pages.

**The Context:** This tool was heavily "vibe-coded" by a developer who relied on AI-generated code. Because of this, there are likely fundamental mistakes, overlooked edge cases, and security vulnerabilities hiding in the codebase — especially around how user API keys are stored, how LLM responses are rendered, and how user input flows through the system. The app is publicly deployed and used by complete AI beginners who may not understand the security implications of entering API keys into a web app.

## The Codebase (~4,800 lines of JSX/JS):

* **Frontend:** React 19, JavaScript (no TypeScript), Vite 8, Tailwind CSS v4, lodash-es, lucide-react
* **Architecture:** Fully client-side SPA, no backend, deployed on GitHub Pages
* **LLM Integration:** Direct browser-to-API calls to Gemini (generativelanguage.googleapis.com), Claude (api.anthropic.com), and OpenAI (api.openai.com/v1/chat/completions)
* **API Key Storage:** User-provided API keys stored in `localStorage` as plaintext JSON
* **Content Rendering:** Custom `MarkdownText` component uses `dangerouslySetInnerHTML` to render LLM responses
* **Data Pipeline:** Pre-generated JSON content (30 scenario files) + real-time LLM calls for freeform/hybrid/multi-turn modes
* **Pages (src/pages/):** 10 page components — LandingPage, ScenarioSelector, GuidedMode, FreeformMode, HybridMode, MultiTurnMode, AssessmentMode, ProgressPage, HelpPage, SettingsPage
* **Components (src/components/):** 8 reusable components — Header, AiToolLinks, CopyButton, MarkdownText, ResponseComparison, PrincipleBadge, ErrorBanner, LoadingSpinner
* **Services (src/services/):** llm.js (multi-provider API router), heuristic-scorer.js (regex-based prompt scoring), guided-data.js (lazy JSON loader), recommendations.js, storage.js
* **Data (src/data/):** scenarios.js (45 scenarios), principles.js (8 principles), categories.js, prompts.js (system prompts + message builders), assessment-scenarios.js, 30 pre-generated JSON files
* **Tests:** None. Zero test files exist in the project.
* **Build Config:** Vite with `base: '/PromptBridge/'`, no CSP headers configured

## Your Task

Conduct a meticulous, eagle-eyed code review. Assume the code has hidden flaws and review it as if it's a publicly deployed tool used by non-technical users who will enter real API keys. You must be constructive but uncompromising on quality.

Pay exceptionally close attention to the following areas:

### 1. XSS & Content Injection (CRITICAL)

The `MarkdownText` component (`src/components/MarkdownText.jsx`) uses `dangerouslySetInnerHTML` to render text that comes from:
- Pre-generated JSON files (AI-generated content at build time)
- Real-time LLM API responses (user-triggered, content controlled by the LLM)
- The custom regex replacement (`**bold**` → `<strong>`) runs before `dangerouslySetInnerHTML`

Evaluate:
- Can a malicious or hallucinated LLM response inject arbitrary HTML/JavaScript through the MarkdownText component?
- Does the regex replacement create injection vectors? (e.g., what happens with `**<script>alert(1)</script>**` or `**" onmouseover="alert(1)**`?)
- Are there other places in the codebase where untrusted content (LLM responses, user input) is rendered without sanitization?
- Does the `ResponseComparison` component have the same vulnerability?
- What about the pre-generated JSON files — if one were tampered with (supply chain), could it inject scripts?

### 2. API Key Security (CRITICAL)

Users enter API keys for Gemini, Claude, or OpenAI in the Settings page. These keys are stored in `localStorage` as `{ provider: "gemini", apiKey: "..." }`.

Evaluate:
- **XSS → Key Theft:** If any XSS vulnerability exists (see above), an attacker can trivially read `localStorage` and exfiltrate all stored API keys. What is the blast radius?
- **Key Exposure in Network Requests:** The Gemini API key is passed as a URL query parameter (`?key=...`). Is this logged by proxies, browser history, or referrer headers? Compare to Claude/OpenAI which use headers.
- **The `anthropic-dangerous-direct-browser-access` header:** The Claude API call in `llm.js` sends `"anthropic-dangerous-direct-browser-access": "true"`. What are the security implications of this header? Is it appropriate for a publicly deployed app?
- **Key Persistence:** Keys persist in localStorage indefinitely. Is there a mechanism to clear them? What happens if a user forgets?
- **Error Messages:** Do API error responses ever leak the API key back to the user in error text?

### 3. Prompt Injection & LLM Security (HIGH)

User-written prompts are sent to LLMs along with system prompts from `src/data/prompts.js`. The LLM responses are then parsed as JSON and rendered.

Evaluate:
- Can a user craft a prompt that causes the LLM to return malicious JSON that breaks the `parseJSON` function or injects content?
- The `parseJSON` function strips markdown code fences and calls `JSON.parse`. What happens if the LLM returns invalid JSON? Are all callers handling the error?
- Could a user's prompt override the system prompt instructions (jailbreak) and cause the LLM to return unexpected field values that are rendered unsafely?
- Are the system prompts in `prompts.js` robust against prompt injection from the user message field?
- What happens if the LLM returns HTML in fields like `strengths`, `improvements`, `tip`, or `what_happened` that are rendered via MarkdownText?

### 4. Input Validation & Error Handling (MEDIUM-HIGH)

Evaluate:
- Is user input (textarea prompts) validated or sanitized before being sent to LLMs or used in the UI?
- What happens with extremely long prompts? Is there a character limit?
- What happens when LLM API calls fail? Are errors displayed safely (no key leakage in error messages)?
- Does the heuristic scorer (`heuristic-scorer.js`) handle edge cases like empty strings, extremely long input, or regex denial-of-service (ReDoS)?
- How does the app handle corrupted localStorage data?
- What happens if a pre-generated JSON file fails to load or has an unexpected schema?

### 5. Privacy & Data Handling (MEDIUM)

Evaluate:
- User prompts are sent to third-party LLM providers (Google, Anthropic, OpenAI). Is this clearly communicated to the user?
- What data is stored in localStorage? Could it contain sensitive information?
- Are there any analytics, tracking scripts, or external resource loads that could leak user activity?
- The Clipboard API is used to copy prompts. Are there any security implications?
- External links to AI tools (ChatGPT, Claude, Gemini, Copilot) — do they pass any referrer data?

### 6. React Architecture & State Management Bugs (MEDIUM)

Evaluate:
- Are there race conditions in the async LLM call flows? What happens if a user navigates away while a call is in flight?
- Is there state that leaks between scenarios (stale state from previous scenario appearing in the next)?
- Does the `key={selectedScenario.id}` prop in App.jsx correctly reset component state between scenarios?
- Are there unnecessary re-renders caused by unstable references (inline functions, objects created in render)?
- The `useCallback` in App.jsx for `markCompleted` captures stale closures over `completedScenarios` and `practicedPrinciples` — is this a bug?
- Is the `loadProgress()` call on every render in App.jsx (line 22) a performance issue?

### 7. Build & Deployment Security (LOW-MEDIUM)

Evaluate:
- GitHub Pages deployment — are there any CSP headers? Can the app be framed (clickjacking)?
- Are dependencies up to date? Any known vulnerabilities?
- The `scripts/generate-content.js` script — does it handle API keys safely during content generation?
- Is the Vite config secure? Any development-only features leaking to production?
- Does the `VITE_GEMINI_API_KEY` environment variable fallback in `llm.js` create a risk of accidentally shipping a key in the build?

## Format your review using the following structure:

1. **Executive Summary:** A high-level overview of the tool's current security posture and the most critical findings.

2. **Critical Issues (Must Fix Before Production Use):** XSS vulnerabilities, API key exposure risks, and any issue that could lead to user harm. Include exact file paths and line numbers.

3. **High Priority Issues:** Prompt injection risks, error handling gaps, and data handling concerns.

4. **Medium Priority Issues:** React architecture bugs, state management issues, and performance concerns.

5. **Low Priority / Hardening:** Build security, CSP headers, dependency audit, and defense-in-depth recommendations.

6. **Actionable Code Fixes:** For each Critical and High issue, provide a specific, refactored code snippet showing exactly how to fix it. Don't just describe the problem — show the solution.

7. **Missing Test Coverage:** Since there are zero tests, identify the 10 most important test scenarios that should be written first, prioritized by security impact.
