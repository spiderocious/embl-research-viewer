import { apiClient } from '@shared/services/api-client';
import { EP } from '@shared/constants/endpoints';
import type { SearchResponse } from '../article-search.types';

export const PAGE_SIZE = 25;

/** One page of Europe PMC search results for a query + cursor mark. */
export function searchArticles(
  query: string,
  cursorMark: string,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    query,
    format: 'json',
    pageSize: String(PAGE_SIZE),
    resultType: 'lite',
    cursorMark,
  });
  return apiClient.getJson<SearchResponse>(`${EP.EUROPE_PMC.SEARCH}?${params.toString()}`, signal);
}
