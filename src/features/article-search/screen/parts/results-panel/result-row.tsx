import { Show } from 'meemaw';
import { ExternalLink } from '@icons';
import type { ArticleResult } from '../../../article-search.types';
import { buildArticleUrl } from '../../../helpers/build-article-url';

interface ResultRowProps {
  readonly article: ArticleResult;
}

export function ResultRow({ article }: ResultRowProps) {
  const url = buildArticleUrl(article);
  return (
    <li className="border-b border-line-soft py-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-start gap-1.5 font-semibold text-embl-blue hover:text-embl-blue-dark hover:underline"
      >
        {article.title}
        <ExternalLink size={13} aria-hidden="true" className="mt-1 shrink-0 text-ink-3" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>

      <Show when={Boolean(article.authorString)}>
        <p className="mt-1 text-sm text-ink-2">{article.authorString}</p>
      </Show>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3">
        <Show when={Boolean(article.pubYear)}>
          <span>{article.pubYear}</span>
        </Show>
        <span className="font-mono">{article.source}</span>
        <Show when={Boolean(article.pmid)}>
          <span className="font-mono">PMID: {article.pmid}</span>
        </Show>
        <Show when={Boolean(article.doi)}>
          <span className="font-mono">DOI: {article.doi}</span>
        </Show>
      </div>
    </li>
  );
}
