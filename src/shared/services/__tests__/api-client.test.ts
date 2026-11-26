import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiClient, ApiError } from '../api-client';

afterEach(() => vi.restoreAllMocks());

describe('apiClient.getJson', () => {
  it('returns parsed JSON on a 200 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 })),
    );
    await expect(apiClient.getJson<{ ok: boolean }>('https://x.test')).resolves.toEqual({
      ok: true,
    });
  });

  it('throws ApiError with the status on a non-2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 500 })));
    await expect(apiClient.getJson('https://x.test')).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
    });
  });

  it('wraps a network failure in an ApiError with status 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const error = await apiClient.getJson('https://x.test').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(0);
  });
});
