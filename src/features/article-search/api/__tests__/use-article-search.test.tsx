import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useArticleSearch } from '../use-article-search';
import { server } from '@shared/test-utils/server';
import { http, HttpResponse } from 'msw';
import { EP } from '@shared/constants/endpoints';
import { makePage } from '@shared/test-utils/fixtures';

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useArticleSearch', () => {
  it('is idle with no query and never fetches', async () => {
    const { result } = renderHook(() => useArticleSearch('   '), { wrapper: makeWrapper() });
    expect(result.current.status).toBe('idle');
  });

  it('loads the first page and reports success + hit count', async () => {
    const { result } = renderHook(() => useArticleSearch('cancer'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.hitCount).toBe(60);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.results).toHaveLength(25);
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);
  });

  it('fetches the next page on next(), then returns to cache on prev() without refetch', async () => {
    const requests: string[] = [];
    server.use(
      http.get(EP.EUROPE_PMC.SEARCH, ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursorMark') ?? '';
        requests.push(cursor);
        if (cursor === '*') return HttpResponse.json(makePage(25, 60, 'c2'));
        return HttpResponse.json(makePage(25, 60, 'c3'));
      }),
    );

    const { result } = renderHook(() => useArticleSearch('cancer'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(requests).toEqual(['*']);

    act(() => result.current.next());
    await waitFor(() => expect(result.current.page).toBe(1));
    expect(requests).toEqual(['*', 'c2']); // one new fetch for page 2

    act(() => result.current.prev());
    await waitFor(() => expect(result.current.page).toBe(0));
    expect(requests).toEqual(['*', 'c2']); // prev did NOT refetch
  });

  it('reports empty when there are zero hits', async () => {
    server.use(http.get(EP.EUROPE_PMC.SEARCH, () => HttpResponse.json(makePage(0, 0))));
    const { result } = renderHook(() => useArticleSearch('zxqwv'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('empty'));
  });

  it('reports error on a failed request', async () => {
    server.use(http.get(EP.EUROPE_PMC.SEARCH, () => HttpResponse.json({}, { status: 500 })));
    const { result } = renderHook(() => useArticleSearch('cancer'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('error'));
  });
});

describe('useArticleSearch — deep page restore', () => {
  it('walks the forward cursor to reach an initial page from a shared link', async () => {
    const { result } = renderHook(() => useArticleSearch('cancer', 2), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('success'), { timeout: 3000 });
    await waitFor(() => expect(result.current.page).toBe(2), { timeout: 3000 });
    // default handler: page 3 (index 2) has 10 of 60 hits, last page
    expect(result.current.hasNext).toBe(false);
    expect(result.current.results).toHaveLength(10);
  });

  it('lands on the last available page when the target is beyond the results', async () => {
    const { result } = renderHook(() => useArticleSearch('cancer', 9), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('success'), { timeout: 3000 });
    await waitFor(() => expect(result.current.page).toBe(2), { timeout: 3000 }); // clamped to last (index 2)
  });
});
