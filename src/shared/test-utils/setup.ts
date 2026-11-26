import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import {
  fetch as undiciFetch,
  Headers as UndiciHeaders,
  Request as UndiciRequest,
  Response as UndiciResponse,
} from 'undici';
import { server } from './server';

// jsdom installs its own fetch/Request classes that reject React Query's
// AbortSignal (a realm mismatch). Pin fetch + friends to one realm (undici,
// which MSW already intercepts) so the signal and fetch agree.
Object.assign(globalThis, {
  fetch: undiciFetch,
  Headers: UndiciHeaders,
  Request: UndiciRequest,
  Response: UndiciResponse,
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
