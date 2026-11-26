import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchArticles, PAGE_SIZE } from '../search-articles';
import * as client from '@shared/services/api-client';
import { makePage } from '@shared/test-utils/fixtures';

afterEach(() => vi.restoreAllMocks());

describe('searchArticles', () => {
  it('requests with query, pageSize 25, json format and cursor', async () => {
    const spy = vi.spyOn(client.apiClient, 'getJson').mockResolvedValue(makePage(1, 1));
    await searchArticles('cancer AND tumour', '*');
    const url = spy.mock.calls[0]![0] as string;
    expect(url).toContain('query=cancer+AND+tumour');
    expect(url).toContain(`pageSize=${PAGE_SIZE}`);
    expect(url).toContain('format=json');
    expect(url).toContain('cursorMark=*');
  });
});
