import type { Term } from '../article-search.types';
import { buildDisplayQuery } from './build-display-query';

/**
 * The query string sent to the Europe PMC API. For this prototype it is the
 * same literal boolean form the user sees; keeping it a separate function means
 * the API encoding can change later (quoting phrases, grouping) without
 * touching the display string.
 */
export function buildApiQuery(terms: ReadonlyArray<Term>): string {
  return buildDisplayQuery(terms);
}
