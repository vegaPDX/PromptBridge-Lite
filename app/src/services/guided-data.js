// ============================================================
// Guided Data — Lazy-loads pre-generated JSON for guided scenarios
// ============================================================

// Use import.meta.glob to discover all pre-generated JSON files.
// The { eager: false } default means each file is loaded on demand.
const modules = import.meta.glob("../data/generated/*.json");

/**
 * Load pre-generated guided content for a specific scenario.
 * @param {string} scenarioId — e.g. "1.1-snow-shoveling"
 * @returns {Promise<object>} The parsed JSON content for that scenario
 * @throws {Error} If no JSON file is found for the given scenario ID
 */
export async function loadGuidedContent(scenarioId) {
  const key = `../data/generated/${scenarioId}.json`;

  const loader = modules[key];
  if (!loader) {
    throw new Error(
      `No pre-generated content found for scenario "${scenarioId}". ` +
      `Expected file at src/data/generated/${scenarioId}.json`
    );
  }

  const mod = await loader();
  // Vite JSON imports expose the data as the default export
  const data = mod.default ?? mod;

  // Ensure response_medium exists (older generated files may lack it)
  if (data.responses && !data.responses.response_medium) {
    data.responses.response_medium = data.responses.response_weak || "Response not available.";
  }

  return data;
}
