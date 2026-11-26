import type { Operator, Term } from '../article-search.types';

let counter = 0;

/** Build a term with a unique id. The first term in a list carries no operator. */
export function createTerm(value: string, op: Operator | null): Term {
  counter += 1;
  return { id: `term-${counter}-${Date.now()}`, value: value.trim(), op };
}
