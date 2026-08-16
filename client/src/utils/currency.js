// ─── BidStream Currency Utility ──────────────────────────────────────────────
//
// All monetary displays in the application use these functions.
// ONE exchange rate. ONE formatting rule. No exceptions.
//
// USD is always the primary/original amount.
// PKR is always the secondary converted amount.

/** USD → PKR exchange rate. Change this one value to update everywhere. */
export const USD_TO_PKR = 279;

/**
 * Format a USD amount as a plain dollar string.
 * e.g. 1240 → "$1,240"
 *
 * @param {number} usd
 * @param {boolean} [cents=false]  When true, shows two decimal places.
 * @returns {string}
 */
export function fmtUSD(usd = 0, cents = false) {
  const n = Number(usd) || 0;
  return '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

/**
 * Convert a USD amount to PKR and format it.
 * e.g. 1240 → "₨346,360"
 *
 * @param {number} usd
 * @returns {string}
 */
export function fmtPKR(usd = 0) {
  const pkr = Math.round((Number(usd) || 0) * USD_TO_PKR);
  return '₨' + pkr.toLocaleString('en-US');
}

/**
 * Returns both currencies as a two-line string array: [usdStr, pkrStr].
 * Intended for block/card display:
 *
 *   $1,240
 *   ≈ ₨346,360
 *
 * @param {number} usd
 * @param {boolean} [cents=false]
 * @returns {{ usd: string, pkr: string }}
 */
export function dualCurrency(usd = 0, cents = false) {
  return {
    usd: fmtUSD(usd, cents),
    pkr: fmtPKR(usd),
  };
}

/**
 * Returns a compact inline dual-currency string.
 * Intended for table cells and tight spaces:
 *
 *   "$1,240 · ₨346,360"
 *
 * @param {number} usd
 * @param {boolean} [cents=false]
 * @returns {string}
 */
export function inlineDual(usd = 0, cents = false) {
  return `${fmtUSD(usd, cents)} · ${fmtPKR(usd)}`;
}

/**
 * Drop-in replacement for the local `currency(v)` functions found across
 * the codebase.  Returns only the USD string (no PKR), so components that
 * use it for things like validation messages / alert text stay readable.
 *
 * For DISPLAYED monetary values use `dualCurrency()` or `<DualAmount />`.
 *
 * @param {number} v
 * @returns {string}
 */
export function currency(v = 0) {
  return fmtUSD(v);
}
