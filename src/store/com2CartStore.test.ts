import { describe, expect, it } from "vitest";
import {
  clampQuantityToStock,
  nextLineQuantityAfterAdd,
} from "@/store/com2CartStore";

describe("com2 cart stock limits", () => {
  it("clamps quantity to available stock", () => {
    expect(clampQuantityToStock(5, 3)).toBe(3);
    expect(clampQuantityToStock(2, 0)).toBe(0);
  });

  it("caps add-to-cart when stock is limited", () => {
    expect(nextLineQuantityAfterAdd(2, 5, 4)).toBe(4);
    expect(nextLineQuantityAfterAdd(0, 1, 10)).toBe(1);
  });
});
