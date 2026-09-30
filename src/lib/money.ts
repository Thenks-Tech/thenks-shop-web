/**
 * Money helpers using integer minor units (no float arithmetic).
 * API amounts are decimal strings with 2 fraction digits.
 */

export function parseDecimalToMinorUnits(amount: string): bigint {
  const trimmed = amount.trim();
  if (!/^-?\d+(\.\d{1,2})?$/.test(trimmed)) {
    throw new Error(`Invalid money amount: ${amount}`);
  }
  const negative = trimmed.startsWith("-");
  const normalized = negative ? trimmed.slice(1) : trimmed;
  const [whole, frac = ""] = normalized.split(".");
  const paddedFrac = (frac + "00").slice(0, 2);
  const minor = BigInt(whole) * 100n + BigInt(paddedFrac);
  return negative ? -minor : minor;
}

export function minorUnitsToDecimal(minor: bigint): string {
  const negative = minor < 0n;
  const abs = negative ? -minor : minor;
  const whole = abs / 100n;
  const frac = (abs % 100n).toString().padStart(2, "0");
  return `${negative ? "-" : ""}${whole}.${frac}`;
}

export function multiplyMoneyDecimal(
  unitPrice: string,
  quantity: number,
): string {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("quantity must be a non-negative integer");
  }
  const unitMinor = parseDecimalToMinorUnits(unitPrice);
  return minorUnitsToDecimal(unitMinor * BigInt(quantity));
}

export function formatMoneyFromDecimal(
  amount: string,
  currencyCode: string,
): string {
  const minor = parseDecimalToMinorUnits(amount);
  const abs = minor < 0n ? -minor : minor;
  const whole = abs / 100n;
  const frac = (abs % 100n).toString().padStart(2, "0");
  const value = Number(`${negativeSign(minor)}${whole}.${frac}`);
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currencyCode} ${whole}.${frac}`;
  }
}

function negativeSign(minor: bigint): string {
  return minor < 0n ? "-" : "";
}
