import { describe, it, expect } from "vitest";
import { PRINCIPLES, PRINCIPLE_MAP } from "../data/principles";
import { SCENARIOS, GUIDED_SCENARIOS, FREEFORM_SCENARIOS } from "../data/scenarios";
import { CATEGORIES } from "../data/categories";
import fs from "fs";
import path from "path";

const GENERATED_DIR = path.resolve(__dirname, "../data/generated");

describe("Principles data integrity", () => {
  it("all 12 principles have a teachingOrder field", () => {
    expect(PRINCIPLES).toHaveLength(12);
    for (const p of PRINCIPLES) {
      expect(p).toHaveProperty("teachingOrder");
      expect(typeof p.teachingOrder).toBe("number");
    }
  });

  it("teachingOrder values are unique", () => {
    const orders = PRINCIPLES.map((p) => p.teachingOrder);
    const unique = new Set(orders);
    expect(unique.size).toBe(orders.length);
  });

  it("teachingOrder values are sequential 1-12", () => {
    const orders = PRINCIPLES.map((p) => p.teachingOrder).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("every principle has required fields", () => {
    for (const p of PRINCIPLES) {
      expect(p.id).toMatch(/^P\d+$/);
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.icon).toBeTruthy();
      expect(p.teachingOrder).toBeGreaterThanOrEqual(1);
      expect(p.teachingOrder).toBeLessThanOrEqual(12);
    }
  });

  it("PRINCIPLE_MAP contains all principles by id", () => {
    for (const p of PRINCIPLES) {
      expect(PRINCIPLE_MAP[p.id]).toBe(p);
    }
  });
});

describe("Scenarios data integrity", () => {
  it("has correct total count (26 scenarios)", () => {
    expect(SCENARIOS).toHaveLength(26);
  });

  it("has 26 guided and 0 freeform scenarios", () => {
    expect(GUIDED_SCENARIOS).toHaveLength(26);
    expect(FREEFORM_SCENARIOS).toHaveLength(0);
  });

  it("every scenario has required fields", () => {
    for (const s of SCENARIOS) {
      expect(s.id).toBeTruthy();
      expect(s.maxim).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.situation).toBeTruthy();
      expect(s.mode).toBe("guided");
      expect(Array.isArray(s.principles)).toBe(true);
      expect(s.principles.length).toBeGreaterThan(0);
    }
  });

  it("all scenario IDs are unique", () => {
    const ids = SCENARIOS.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every scenario references principles that exist", () => {
    for (const s of SCENARIOS) {
      for (const pid of s.principles) {
        expect(PRINCIPLE_MAP).toHaveProperty(pid);
      }
    }
  });

  it("all maxims used in scenarios exist in categories.js", () => {
    const validCategories = Object.keys(CATEGORIES);
    for (const s of SCENARIOS) {
      expect(validCategories).toContain(s.maxim);
    }
  });
});

describe("Generated JSON file integrity", () => {
  const generatedFiles = fs.readdirSync(GENERATED_DIR).filter((f) => f.endsWith(".json"));

  it("every guided scenario has a corresponding JSON file", () => {
    for (const s of GUIDED_SCENARIOS) {
      const filename = `${s.id}.json`;
      expect(generatedFiles).toContain(filename);
    }
  });

  it("every generated JSON file has a corresponding guided scenario", () => {
    const guidedIds = new Set(GUIDED_SCENARIOS.map((s) => s.id));
    for (const file of generatedFiles) {
      const id = file.replace(".json", "");
      expect(guidedIds.has(id)).toBe(true);
    }
  });

  it("no orphaned generated JSON files", () => {
    const guidedIds = new Set(GUIDED_SCENARIOS.map((s) => s.id));
    const orphans = generatedFiles.filter((f) => !guidedIds.has(f.replace(".json", "")));
    expect(orphans).toEqual([]);
  });

  it("all generated JSON files have required structure", () => {
    for (const file of generatedFiles) {
      const content = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, file), "utf-8"));
      expect(content.scenarioId).toBeTruthy();
      expect(content.options).toHaveLength(3);
      expect(content.responses).toBeTruthy();
      expect(content.feedback).toBeTruthy();

      // Verify options have required fields
      for (const opt of content.options) {
        expect(opt.id).toBeTruthy();
        expect(opt.text).toBeTruthy();
        expect(["weak", "medium", "strong"]).toContain(opt.quality);
      }

      // Verify responses exist
      expect(content.responses.response_weak).toBeTruthy();
      expect(content.responses.response_medium).toBeTruthy();
      expect(content.responses.response_strong).toBeTruthy();
    }
  });

  it("all generated JSON files use flat feedback format (not nested)", () => {
    for (const file of generatedFiles) {
      const content = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, file), "utf-8"));
      const fb = content.feedback;

      // Flat format has these direct keys
      expect(fb.what_happened).toBeTruthy();
      expect(fb.principle).toBeTruthy();
      expect(fb.principle_name).toBeTruthy();
      expect(fb.tip).toBeTruthy();

      // Should NOT have nested weak/medium/strong feedback
      expect(fb).not.toHaveProperty("weak");
      expect(fb).not.toHaveProperty("medium");
      expect(fb).not.toHaveProperty("strong");
    }
  });

  it("generated JSON scenarioIds match their filenames", () => {
    for (const file of generatedFiles) {
      const content = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, file), "utf-8"));
      const expectedId = file.replace(".json", "");
      expect(content.scenarioId).toBe(expectedId);
    }
  });
});
