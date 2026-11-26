import type { SearchResponse, ArticleResult } from '@features/article-search/article-search.types';

export function makeArticle(overrides: Partial<ArticleResult> = {}): ArticleResult {
  return {
    id: '42888301',
    source: 'MED',
    title: 'A study of immunotherapy response in solid tumours',
    authorString: 'Smith J, Doe A, Okafor B.',
    pubYear: '2026',
    doi: '10.1000/example',
    pmid: '42888301',
    ...overrides,
  };
}

/** A page of `count` results; cursor points to the next page unless it's the last. */
export function makePage(
  count: number,
  hitCount: number,
  nextCursorMark?: string,
): SearchResponse {
  const result = Array.from({ length: count }, (_, i) =>
    makeArticle({ id: `id-${i}`, pmid: `${i}`, title: `Article number ${i}` }),
  );
  return { hitCount, nextCursorMark, resultList: { result } };
}
