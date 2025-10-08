import { describe, it, expect } from "vitest";

describe("sanity", () => {
  it("rodou o Vitest + jsdom + setup", () => {
    expect(1 + 1).toBe(2);
    expect(document).toBeDefined();
  });
});
