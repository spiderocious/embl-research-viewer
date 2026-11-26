import type { Term } from '../article-search.types';

/**
 * Turn the ordered term list into the human-readable query string, e.g.
 * `cancer AND immunotherapy NOT melanoma`. The first term never carries an
 * operator, so the string can never start with one.
 */
export function buildDisplayQuery(terms: ReadonlyArray<Term>): string {
  return terms
    .map((term, index) => {
      const value = term.value.trim();
      if (index === 0) return value;
      return `${term.op ?? 'AND'} ${value}`;
    })
    .filter((part) => part.length > 0)
    .join(' ')
    .trim();
}
