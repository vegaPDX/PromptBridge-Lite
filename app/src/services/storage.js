// ============================================================
// Storage — Synchronous localStorage wrappers for progress
// ============================================================

const STORAGE_KEY = "promptbridge_progress";

const DEFAULT_PROGRESS = {
  completedScenarios: [],
  practicedPrinciples: [],
};

/**
 * Load user progress from localStorage.
 * Returns { completedScenarios: [], practicedPrinciples: [] } on first visit
 * or if data is missing/corrupt.
 */
export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedScenarios: parsed.completedScenarios || [],
        practicedPrinciples: parsed.practicedPrinciples || [],
      };
    }
  } catch (e) {
    // First visit or corrupt data — return defaults
  }
  return { ...DEFAULT_PROGRESS };
}

/**
 * Save user progress to localStorage.
 * @param {{ completedScenarios: string[], practicedPrinciples: string[] }} data
 */
export function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

// ── Assessment storage ──────────────────────────────────────

const ASSESSMENT_KEY = "promptbridge_assessment";

export function loadAssessment() {
  try {
    const raw = localStorage.getItem(ASSESSMENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // corrupt data
  }
  return { pre: null, post: null };
}

export function saveAssessment(data) {
  try {
    localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save assessment:", e);
  }
}

// ── User context storage ────────────────────────────────────

const CONTEXT_KEY = "promptbridge_user_context";

export function loadUserContext() {
  try {
    const raw = localStorage.getItem(CONTEXT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // corrupt data
  }
  return null;
}

export function saveUserContext(data) {
  try {
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save user context:", e);
  }
}
