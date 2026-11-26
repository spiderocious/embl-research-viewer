import { useRef, useEffect } from 'react';
import { Repeat } from 'meemaw';
import { formatNumber } from '@shared/utils/format-number';
import type { UseArticleSearchResult } from '../../../api/use-article-search';
import { ResultRow } from './result-row';
import { Pagination } from './pagination';

interface ResultsPanelProps {
  readonly search: UseArticleSearchResult;
}

export function ResultsPanel({ search }: ResultsPanelProps) {
  const listRef = useRef<HTMLUListElement>(null);

  // Scroll the results back to the top whenever the page changes.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (typeof list.scrollTo === 'function') {
      list.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      list.scrollTop = 0;
    }
  }, [search.page]);

  return (
    <section aria-labelledby="results-heading" className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-baseline justify-between border-b border-line pb-2">
        <h2 id="results-heading" className="text-base font-semibold text-ink">
          Results
        </h2>
        <p className="text-sm text-ink-2" aria-live="polite">
          <span className="font-mono font-semibold text-ink">{formatNumber(search.hitCount)}</span>{' '}
          publications
        </p>
      </div>

      <ul
        ref={listRef}
        data-testid="results-scroll"
        className="min-h-0 flex-1 list-none overflow-y-auto"
      >
        <Repeat each={[...search.results]}>
          {(article) => <ResultRow key={article.id} article={article} />}
        </Repeat>
      </ul>

      <div className="shrink-0 border-t border-line-soft">
        <Pagination
          page={search.page}
          totalPages={search.totalPages}
          hasPrev={search.hasPrev}
          hasNext={search.hasNext}
          busy={search.isNavigating}
          onPrev={search.prev}
          onNext={search.next}
          onJump={search.jumpTo}
        />
      </div>
    </section>
  );
}
