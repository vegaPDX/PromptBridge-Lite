import { describe, it, expect, beforeEach, vi } from "vitest";

// Create a proper localStorage mock before importing storage module
function createLocalStorageMock() {
  let store = {};
  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => { store[key] = String(value); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i) => Object.keys(store)[i] || null),
    _store: () => store,
  };
}

const mockStorage = createLocalStorageMock();
vi.stubGlobal("localStorage", mockStorage);

// Import after stubbing
const {
  loadProgress,
  saveProgress,
  hasSeenSafetyIntro,
  markSafetyIntroSeen,
  hasSeenPreScenarioBanner,
  markPreScenarioBannerSeen,
} = await import("../services/storage");

beforeEach(() => {
  mockStorage.clear();
  vi.clearAllMocks();
});

describe("Progress storage", () => {
  it("returns defaults on first visit", () => {
    const progress = loadProgress();
    expect(progress).toEqual({
      completedScenarios: [],
      practicedPrinciples: [],
    });
  });

  it("saves and loads progress correctly", () => {
    const data = {
      completedScenarios: ["1.1-snow-shoveling", "1.3-meal-plan"],
      practicedPrinciples: ["P1", "P2"],
    };
    saveProgress(data);
    const loaded = loadProgress();
    expect(loaded).toEqual(data);
  });

  it("handles corrupt JSON gracefully", () => {
    localStorage.setItem("promptbridge_lite_progress", "not valid json{{{");
    const progress = loadProgress();
    expect(progress).toEqual({
      completedScenarios: [],
      practicedPrinciples: [],
    });
  });

  it("handles missing fields in stored data", () => {
    localStorage.setItem("promptbridge_lite_progress", JSON.stringify({ completedScenarios: ["1.1-snow-shoveling"] }));
    const progress = loadProgress();
    expect(progress.completedScenarios).toEqual(["1.1-snow-shoveling"]);
    expect(progress.practicedPrinciples).toEqual([]);
  });

  it("handles old/stale format data gracefully", () => {
    localStorage.setItem(
      "promptbridge_lite_progress",
      JSON.stringify({ completedScenarios: ["1.1-snow-shoveling"], oldField: true, version: 1 })
    );
    const progress = loadProgress();
    expect(progress.completedScenarios).toEqual(["1.1-snow-shoveling"]);
    expect(progress.practicedPrinciples).toEqual([]);
  });

  it("saveProgress returns true on success", () => {
    const result = saveProgress({ completedScenarios: [], practicedPrinciples: [] });
    expect(result).toBe(true);
  });

  it("handles localStorage quota exceeded gracefully", () => {
    mockStorage.setItem.mockImplementationOnce(() => {
      throw new DOMException("QuotaExceededError", "QuotaExceededError");
    });
    const result = saveProgress({ completedScenarios: [], practicedPrinciples: [] });
    expect(result).toBe(false);
  });
});

describe("Safety intro banner storage", () => {
  it("returns false on first visit", () => {
    expect(hasSeenSafetyIntro()).toBe(false);
  });

  it("returns true after marking as seen", () => {
    markSafetyIntroSeen();
    expect(hasSeenSafetyIntro()).toBe(true);
  });

  it("persists across calls", () => {
    markSafetyIntroSeen();
    expect(hasSeenSafetyIntro()).toBe(true);
    expect(localStorage.getItem("promptbridge_lite_seen_safety_intro")).toBe("true");
  });

  it("markSafetyIntroSeen returns true on success", () => {
    const result = markSafetyIntroSeen();
    expect(result).toBe(true);
  });
});

describe("Pre-scenario banner storage", () => {
  it("returns false on first visit", () => {
    expect(hasSeenPreScenarioBanner()).toBe(false);
  });

  it("returns true after marking as seen", () => {
    markPreScenarioBannerSeen();
    expect(hasSeenPreScenarioBanner()).toBe(true);
  });

  it("persists across calls", () => {
    markPreScenarioBannerSeen();
    expect(hasSeenPreScenarioBanner()).toBe(true);
    expect(localStorage.getItem("promptbridge_lite_seen_pre_scenario")).toBe("true");
  });

  it("markPreScenarioBannerSeen returns true on success", () => {
    const result = markPreScenarioBannerSeen();
    expect(result).toBe(true);
  });
});

describe("Storage — localStorage failure handling", () => {
  it("hasSeenSafetyIntro returns false when localStorage throws", () => {
    mockStorage.getItem.mockImplementationOnce(() => {
      throw new Error("localStorage blocked");
    });
    expect(hasSeenSafetyIntro()).toBe(false);
  });

  it("hasSeenPreScenarioBanner returns false when localStorage throws", () => {
    mockStorage.getItem.mockImplementationOnce(() => {
      throw new Error("localStorage blocked");
    });
    expect(hasSeenPreScenarioBanner()).toBe(false);
  });

  it("markSafetyIntroSeen returns false when localStorage throws", () => {
    mockStorage.setItem.mockImplementationOnce(() => {
      throw new Error("localStorage blocked");
    });
    expect(markSafetyIntroSeen()).toBe(false);
  });

  it("markPreScenarioBannerSeen returns false when localStorage throws", () => {
    mockStorage.setItem.mockImplementationOnce(() => {
      throw new Error("localStorage blocked");
    });
    expect(markPreScenarioBannerSeen()).toBe(false);
  });
});
