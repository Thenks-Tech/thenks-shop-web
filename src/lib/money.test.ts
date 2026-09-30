import { describe, expect, it } from "vitest";
import {
  formatMoneyFromDecimal,
  multiplyMoneyDecimal,
  parseDecimalToMinorUnits,
} from "@/lib/money";

describe("money decimal strings", () => {
  it("parses and formats without float drift", () => {
    expect(parseDecimalToMinorUnits("1000.00")).toBe(100000n);
    expect(multiplyMoneyDecimal("19.99", 3)).toBe("59.97");
  });

  it("formats currency from decimal strings", () => {
    const formatted = formatMoneyFromDecimal("2116.00", "KES");
    expect(formatted).toContain("2,116");
  });
});
