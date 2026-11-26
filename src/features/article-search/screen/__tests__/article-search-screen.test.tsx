import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ArticleSearchScreen } from '../article-search-screen';
import { renderWithQuery } from '@shared/test-utils/render-with-query';
import { server } from '@shared/test-utils/server';
import { EP } from '@shared/constants/endpoints';
import { makePage } from '@shared/test-utils/fixtures';

async function searchFor(term: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/keyword or phrase/i), term);
  await user.click(screen.getByRole('button', { name: /add term/i }));
  return user;
}

describe('ArticleSearchScreen (integration)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('shows the idle prompt on first load', () => {
    renderWithQuery(<ArticleSearchScreen />);
    expect(screen.getByText(/search 47 million publications/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /find scientific literature/i }),
    ).toBeInTheDocument();
  });

  it('runs a search and shows results with a hit count', async () => {
    renderWithQuery(<ArticleSearchScreen />);
    await searchFor('cancer');
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument(),
    );
    expect(await screen.findByText('60')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /article number 0/i })).toBeInTheDocument();
  });

  it('paginates next then previous through results', async () => {
    renderWithQuery(<ArticleSearchScreen />);
    const user = await searchFor('cancer');
    await waitFor(() => expect(screen.getByText('60')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByText(/page/i)).toHaveTextContent('2'));

    await user.click(screen.getByRole('button', { name: /previous/i }));
    await waitFor(() => expect(screen.getByText(/page/i)).toHaveTextContent('1'));
  });

  it('shows the empty state when nothing matches', async () => {
    server.use(http.get(EP.EUROPE_PMC.SEARCH, () => HttpResponse.json(makePage(0, 0))));
    renderWithQuery(<ArticleSearchScreen />);
    await searchFor('zxqwv');
    expect(await screen.findByText(/no results/i)).toBeInTheDocument();
  });

  it('shows the error state and recovers on Retry', async () => {
    let fail = true;
    server.use(
      http.get(EP.EUROPE_PMC.SEARCH, () => {
        if (fail) return HttpResponse.json({}, { status: 500 });
        return HttpResponse.json(makePage(25, 60, 'c2'));
      }),
    );
    renderWithQuery(<ArticleSearchScreen />);
    const user = await searchFor('cancer');
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fail = false;
    await user.click(screen.getByRole('button', { name: /retry/i }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument(),
    );
  });

  it('puts the query into the URL as it is built', async () => {
    renderWithQuery(<ArticleSearchScreen />);
    await searchFor('cancer');
    expect(window.location.search).toContain('terms=cancer');
  });

  it('restores a search from a shared link on load', async () => {
    window.history.replaceState(null, '', '/?terms=cancer~AND:immunotherapy');
    renderWithQuery(<ArticleSearchScreen />);
    // chips restored
    expect(screen.getByTestId('query-preview')).toHaveTextContent('cancer AND immunotherapy');
    // and the search runs automatically
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument(),
    );
  });

  it('renders the results in their own scroll container', async () => {
    renderWithQuery(<ArticleSearchScreen />);
    await searchFor('cancer');
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument(),
    );
    const list = screen.getByTestId('results-scroll');
    expect(list.className).toContain('overflow-y-auto');
  });
});
