import { http, HttpResponse } from 'msw';
import { EP } from '@shared/constants/endpoints';
import { makePage } from './fixtures';

/** Default happy-path: 60 hits over 3 pages of 25/25/10. */
export const handlers = [
  http.get(EP.EUROPE_PMC.SEARCH, ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursorMark');
    if (cursor === '*') return HttpResponse.json(makePage(25, 60, 'cursor-2'));
    if (cursor === 'cursor-2') return HttpResponse.json(makePage(25, 60, 'cursor-3'));
    return HttpResponse.json(makePage(10, 60));
  }),
];
