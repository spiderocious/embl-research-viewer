/** Boolean operator joining a term to the one before it. */
export type Operator = 'AND' | 'OR' | 'NOT';

/** One term in the query builder. `op` is null on the first term only. */
export interface Term {
  readonly id: string;
  readonly value: string;
  readonly op: Operator | null;
}

/** A single publication from the Europe PMC `lite` result set. */
export interface ArticleResult {
  readonly id: string;
  readonly source: string;
  readonly title: string;
  readonly authorString?: string;
  readonly pubYear?: string;
  readonly doi?: string;
  readonly pmid?: string;
}

/** Shape of one page returned by the Europe PMC search endpoint. */
export interface SearchResponse {
  readonly hitCount: number;
  readonly nextCursorMark?: string;
  readonly resultList: { readonly result: ReadonlyArray<ArticleResult> };
}
