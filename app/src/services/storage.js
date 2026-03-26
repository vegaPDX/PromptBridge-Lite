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
    return true;
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("localStorage full — progress not saved. Clear site data to free space.");
    }
    return false;
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
    return true;
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("localStorage full — assessment not saved. Clear site data to free space.");
    }
    return false;
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
    return true;
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("localStorage full — user context not saved. Clear site data to free space.");
    }
    return false;
  }
}

// ── Safety banner flags ────────────────────────────────────

const SAFETY_INTRO_KEY = "promptbridge_seen_safety_intro";
const PRE_SCENARIO_KEY = "promptbridge_seen_pre_scenario";

export function hasSeenSafetyIntro() {
  try {
    return localStorage.getItem(SAFETY_INTRO_KEY) === "true";
  } catch (e) {
    return false;
  }
}

export function markSafetyIntroSeen() {
  try {
    localStorage.setItem(SAFETY_INTRO_KEY, "true");
    return true;
  } catch (e) {
    return false;
  }
}

export function hasSeenPreScenarioBanner() {
  try {
    return localStorage.getItem(PRE_SCENARIO_KEY) === "true";
  } catch (e) {
    return false;
  }
}

export function markPreScenarioBannerSeen() {
  try {
    localStorage.setItem(PRE_SCENARIO_KEY, "true");
    return true;
  } catch (e) {
    return false;
  }
}
