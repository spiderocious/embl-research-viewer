import { europePmcArticleUrl } from '@shared/constants/endpoints';
import type { ArticleResult } from '../article-search.types';

/** Canonical public Europe PMC article URL for a result. */
export function buildArticleUrl(article: Pick<ArticleResult, 'source' | 'id'>): string {
  return europePmcArticleUrl(article.source, article.id);
}
