import type { Operator, Term } from '../article-search.types';
import { createTerm } from './create-term';

const OPERATORS: ReadonlyArray<Operator> = ['AND', 'OR', 'NOT'];

function isOperator(value: string): value is Operator {
  return (OPERATORS as ReadonlyArray<string>).includes(value);
}

/**
 * Encode the term list as a compact, URL-safe string:
 *   `cancer~AND:immunotherapy~NOT:melanoma`
 * The first term has no operator; later terms are `<OP>:<value>`.
 */
export function encodeTerms(terms: ReadonlyArray<Term>): string {
  return terms
    .map((term, index) => {
      const value = term.value.trim();
      if (value.length === 0) return '';
      if (index === 0 || term.op === null) return value;
      return `${term.op}:${value}`;
    })
    .filter((part) => part.length > 0)
    .join('~');
}

/** Rebuild the term list from the encoded string. Invalid input yields no terms. */
export function decodeTerms(encoded: string | null): ReadonlyArray<Term> {
  if (!encoded) return [];
  return encoded
    .split('~')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .map((segment, index) => {
      const sep = segment.indexOf(':');
      if (index > 0 && sep > 0) {
        const op = segment.slice(0, sep);
        const value = segment.slice(sep + 1).trim();
        if (isOperator(op) && value.length > 0) return createTerm(value, op);
      }
      // first term, or no valid operator prefix -> plain value (default AND for non-first)
      return createTerm(segment, index === 0 ? null : 'AND');
    })
    .filter((term) => term.value.length > 0);
}
