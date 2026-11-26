const numberFormatter = new Intl.NumberFormat('en-GB');

/** Format a whole number with thousands separators, e.g. 280474 -> "280,474". */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
