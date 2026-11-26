import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect, useRef } from 'react';
import { searchArticles, PAGE_SIZE } from './search-articles';
import type { ArticleResult, SearchResponse } from '../article-search.types';

export type SearchStatus = 'idle' | 'loading' | 'error' | 'empty' | 'success';

export interface UseArticleSearchResult {
  readonly status: SearchStatus;
  readonly results: ReadonlyArray<ArticleResult>;
  readonly hitCount: number;
  readonly page: number;
  readonly totalPages: number;
  readonly hasPrev: boolean;
  readonly hasNext: boolean;
  readonly isFetchingNext: boolean;
  next: () => void;
  prev: () => void;
  retry: () => void;
}

export const articleSearchQueryKey = (query: string) => ['articles', query] as const;

/**
 * Owns the search for a query. The API is a forward-only cursor, so we fetch
 * forward with useInfiniteQuery and navigate backward with a page pointer over
 * the cached pages — "Previous" never triggers a request.
 */
export function useArticleSearch(query: string, initialPage = 0): UseArticleSearchResult {
  const enabled = query.trim().length > 0;
  const [page, setPage] = useState(initialPage);
  // The page we still need to walk forward to when restoring a shared link.
  const [targetPage, setTargetPage] = useState(initialPage);
  const lastQuery = useRef(query);

  const q = useInfiniteQuery({
    queryKey: articleSearchQueryKey(query),
    queryFn: ({ pageParam, signal }) => searchArticles(query, pageParam, signal),
    initialPageParam: '*',
    getNextPageParam: (last: SearchResponse) => last.nextCursorMark ?? undefined,
    enabled,
  });

  // A genuine query change resets the pointer to the first page. The initial
  // query is left alone so a restored page target can still be walked to.
  useEffect(() => {
    if (lastQuery.current !== query) {
      lastQuery.current = query;
      setPage(0);
      setTargetPage(0);
    }
  }, [query]);

  // Restore a deep page from a shared link by walking the forward-only cursor
  // until we reach the target page or run out of results.
  useEffect(() => {
    const loaded = q.data?.pages.length ?? 0;
    if (targetPage > 0 && loaded > 0 && loaded <= targetPage && q.hasNextPage && !q.isFetchingNextPage) {
      void q.fetchNextPage();
    } else if (targetPage > 0 && loaded > targetPage) {
      setPage(Math.min(targetPage, loaded - 1));
      setTargetPage(0);
    } else if (targetPage > 0 && loaded > 0 && !q.hasNextPage) {
      // target is beyond the result set — land on the last available page
      setPage(loaded - 1);
      setTargetPage(0);
    }
  }, [targetPage, q.data?.pages.length, q.hasNextPage, q.isFetchingNextPage, q]);

  const pages = q.data?.pages ?? [];
  // While walking forward to a restored page, clamp the shown page to what's
  // loaded so we never index past the fetched pages.
  const safePage = pages.length > 0 ? Math.min(page, pages.length - 1) : page;
  const current = pages[safePage];
  const hitCount = pages[0]?.hitCount ?? 0;
  const totalPages = Math.ceil(hitCount / PAGE_SIZE);
  const results = current?.resultList.result ?? [];

  const hasPrev = safePage > 0;
  const hasNext = safePage + 1 < totalPages;

  const next = useCallback(() => {
    if (safePage === pages.length - 1 && q.hasNextPage) {
      void q.fetchNextPage();
    }
    setPage(safePage + 1);
  }, [safePage, pages.length, q]);

  const prev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const retry = useCallback(() => {
    void q.refetch();
  }, [q]);

  let status: SearchStatus;
  if (!enabled) status = 'idle';
  else if (q.isPending) status = 'loading';
  else if (q.isError) status = 'error';
  else if (hitCount === 0) status = 'empty';
  else status = 'success';

  return {
    status,
    results,
    hitCount,
    page: safePage,
    totalPages,
    hasPrev,
    hasNext,
    isFetchingNext: q.isFetchingNextPage,
    next,
    prev,
    retry,
  };
}
