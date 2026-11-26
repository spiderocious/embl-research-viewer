import { useCallback, useRef, useState } from 'react';
import type { Term } from '../article-search.types';
import { encodeTerms, decodeTerms } from '../helpers/url-terms';

export interface UrlState {
  readonly terms: ReadonlyArray<Term>;
  readonly page: number;
}

function readFromUrl(): UrlState {
  if (typeof window === 'undefined') return { terms: [], page: 0 };
  const params = new URLSearchParams(window.location.search);
  const terms = decodeTerms(params.get('terms'));
  const rawPage = Number.parseInt(params.get('page') ?? '1', 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage - 1 : 0;
  return { terms, page: terms.length > 0 ? page : 0 };
}

function writeToUrl(terms: ReadonlyArray<Term>, page: number): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  const encoded = encodeTerms(terms);
  if (encoded.length > 0) {
    params.set('terms', encoded);
    if (page > 0) params.set('page', String(page + 1));
  }
  const query = params.toString();
  const next = `${window.location.pathname}${query ? `?${query}` : ''}`;
  window.history.replaceState(null, '', next);
}

/**
 * Keeps the query terms and page in the URL so a search is shareable and
 * bookmarkable. Reads the initial state once on mount, then mirrors every
 * change into the URL with replaceState (no history spam).
 */
export function useUrlState() {
  const initial = useRef<UrlState>(readFromUrl());
  const [terms, setTermsState] = useState<ReadonlyArray<Term>>(initial.current.terms);

  const setTerms = useCallback((nextTerms: ReadonlyArray<Term>) => {
    setTermsState(nextTerms);
    writeToUrl(nextTerms, 0);
  }, []);

  const syncPage = useCallback(
    (page: number) => {
      writeToUrl(terms, page);
    },
    [terms],
  );

  return { initialTerms: initial.current.terms, initialPage: initial.current.page, terms, setTerms, syncPage };
}
