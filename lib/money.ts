/**
 * Money helpers.
 *
 * All amounts in the DB are stored as `bigint` in the smallest unit of their
 * currency. These helpers convert to/from display units and format for the UI.
 *
 * - TZS has no practical decimal subunit. We still store as bigint so the math
 *   is identical across currencies; conversion divides by 1 for display.
 * - USD uses cents (2 decimal places).
 */

export type CurrencyCode = 'TZS' | 'USD';

const MINOR_PER_MAJOR: Record<CurrencyCode, number> = {
  TZS: 1,
  USD: 100,
};

export function minorToMajor(amountMinor: bigint, currency: CurrencyCode): number {
  const divisor = MINOR_PER_MAJOR[currency];
  // bigint → number is safe here because our upper bound is billions of
  // shillings, well within Number.MAX_SAFE_INTEGER.
  return Number(amountMinor) / divisor;
}

export function majorToMinor(amountMajor: number, currency: CurrencyCode): bigint {
  const multiplier = MINOR_PER_MAJOR[currency];
  return BigInt(Math.round(amountMajor * multiplier));
}

/**
 * Convert a minor-unit amount in `currency` to the base currency, using the
 * FX rate that was snapshotted at the time of the trip.
 */
export function toBaseMinor(
  amountMinor: bigint,
  sourceCurrency: CurrencyCode,
  fxRateToBase: string | number,
  baseCurrency: CurrencyCode,
): bigint {
  const sourceMajor = minorToMajor(amountMinor, sourceCurrency);
  const rate = typeof fxRateToBase === 'string' ? parseFloat(fxRateToBase) : fxRateToBase;
  const baseMajor = sourceMajor * rate;
  return majorToMinor(baseMajor, baseCurrency);
}

/**
 * Format a minor-unit amount for display in the user's locale.
 * TZS: no decimals, grouped with commas
 * USD: 2 decimals, $ prefix
 */
export function formatMoney(amountMinor: bigint, currency: CurrencyCode): string {
  const major = minorToMajor(amountMinor, currency);
  if (currency === 'TZS') {
    return `TZS ${major.toLocaleString('en-TZ', { maximumFractionDigits: 0 })}`;
  }
  return major.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Compact display for large numbers in KPI cards: 1.2M, 340K, etc.
 */
export function formatMoneyCompact(
  amountMinor: bigint,
  currency: CurrencyCode,
): string {
  const major = minorToMajor(amountMinor, currency);
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  const symbol = currency === 'USD' ? '$' : 'TZS ';
  return `${symbol}${formatter.format(major)}`;
}
