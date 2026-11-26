// Standalone end-to-end smoke test against the REAL Europe PMC API (no MSW).
// Run explicitly; not part of the unit suite.
import { describe, it, expect, beforeAll } from 'vitest';
import { fetch as undiciFetch, Headers as H, Request as Rq, Response as Rs } from 'undici';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArticleSearchScreen } from '@features/article-search/screen/article-search-screen';
import { renderWithQuery } from '@shared/test-utils/render-with-query';

beforeAll(() => {
  Object.assign(globalThis, { fetch: undiciFetch, Headers: H, Request: Rq, Response: Rs });
});

describe('LIVE Europe PMC end-to-end', () => {
  it('searches cancer AND immunotherapy NOT melanoma and renders real results + pagination', async () => {
    const user = userEvent.setup();
    renderWithQuery(<ArticleSearchScreen />);

    async function add(term: string, op?: 'AND' | 'OR' | 'NOT') {
      if (op) await user.selectOptions(screen.getByLabelText(/join with/i), op);
      await user.type(screen.getByLabelText(/keyword or phrase/i), term);
      await user.click(screen.getByRole('button', { name: /add term/i }));
    }
    await add('cancer');
    await add('immunotherapy', 'AND');
    await add('melanoma', 'NOT');

    expect(screen.getByTestId('query-preview')).toHaveTextContent('cancer AND immunotherapy NOT melanoma');

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument(), { timeout: 15000 });
    // real result links present
    const links = await screen.findAllByRole('link', { name: /opens in a new tab/i }, { timeout: 15000 });
    console.log('LIVE results rendered:', links.length);
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]!.getAttribute('href')).toMatch(/^https:\/\/europepmc\.org\/article\//);

    // paginate forward against the real cursor
    await user.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByText(/page/i)).toHaveTextContent('2'), { timeout: 15000 });
    console.log('LIVE pagination to page 2 OK');
  }, 40000);
});
