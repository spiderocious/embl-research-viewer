import { useMemo, useEffect } from 'react';
import { Show } from 'meemaw';
import { Logo } from '@ui/index';
import { buildApiQuery } from '../helpers/build-api-query';
import { useArticleSearch } from '../api/use-article-search';
import { useUrlState } from '../utils/use-url-state';
import { QueryBuilder } from './parts/query-builder/query-builder';
import { ResultsPanel } from './parts/results-panel/results-panel';
import { StatusView } from './parts/status-view/status-view';

export function ArticleSearchScreen() {
  const { initialPage, terms, setTerms, syncPage } = useUrlState();
  const query = useMemo(() => buildApiQuery(terms), [terms]);
  const search = useArticleSearch(query, initialPage);

  // Mirror the current page into the URL so a link restores the exact search.
  useEffect(() => {
    syncPage(search.page);
  }, [search.page, syncPage]);

  return (
    <div className="flex h-screen flex-col bg-white text-ink">
      <header className="shrink-0 bg-mast text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-5 py-2.5 text-sm">
          <Logo />
          <span className="text-white/40">·</span>
          <span className="text-white/90">Europe PMC</span>
        </div>
      </header>

      <div className="shrink-0 bg-petrol text-white">
        <div className="mx-auto max-w-5xl px-5 py-6">
          <p className="font-mono text-xs uppercase tracking-widest text-white/80">
            Research Search Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Find scientific literature</h1>
          <p className="mt-2 max-w-xl text-sm text-white/90">
            Build a query from keywords, combine them with AND, OR and NOT, and explore matching
            publications — no search syntax required.
          </p>
        </div>
      </div>

      <main className="mx-auto grid min-h-0 w-full max-w-5xl flex-1 gap-8 px-5 py-6 lg:grid-cols-[22rem_1fr]">
        <div className="min-h-0 overflow-y-auto lg:pr-1">
          <QueryBuilder terms={terms} onChange={setTerms} />
        </div>

        <div className="flex min-h-0 flex-col">
          <Show
            when={search.status === 'success'}
            fallback={
              <StatusView
                status={search.status === 'success' ? 'idle' : search.status}
                query={query}
                onRetry={search.retry}
              />
            }
          >
            <ResultsPanel search={search} />
          </Show>
        </div>
      </main>
    </div>
  );
}
