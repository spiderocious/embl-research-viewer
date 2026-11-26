import { describe, it, expect } from 'vitest';
import { buildDisplayQuery } from '../build-display-query';
import { buildApiQuery } from '../build-api-query';
import { buildArticleUrl } from '../build-article-url';
import { createTerm } from '../create-term';
import type { Term } from '../../article-search.types';

const t = (value: string, op: Term['op']): Term => createTerm(value, op);

describe('buildDisplayQuery', () => {
  it('returns an empty string for no terms', () => {
    expect(buildDisplayQuery([])).toBe('');
  });

  it('renders a single term with no operator', () => {
    expect(buildDisplayQuery([t('cancer', null)])).toBe('cancer');
  });

  it('joins terms with AND, OR and NOT in order', () => {
    const terms = [t('cancer', null), t('immunotherapy', 'AND'), t('melanoma', 'NOT')];
    expect(buildDisplayQuery(terms)).toBe('cancer AND immunotherapy NOT melanoma');
  });

  it('supports OR', () => {
    expect(buildDisplayQuery([t('covid', null), t('sars', 'OR')])).toBe('covid OR sars');
  });

  it('never starts with an operator even if the first term carries one', () => {
    // defensive: first term op should be ignored
    const terms = [t('cancer', 'AND'), t('tumour', 'AND')];
    expect(buildDisplayQuery(terms)).toBe('cancer AND tumour');
  });

  it('keeps a multi-word phrase as one term', () => {
    expect(buildDisplayQuery([t('breast cancer', null)])).toBe('breast cancer');
  });

  it('falls back to AND when a non-first operator is missing', () => {
    expect(buildDisplayQuery([t('a', null), t('b', null)])).toBe('a AND b');
  });
});

describe('buildApiQuery', () => {
  it('matches the display query for this prototype', () => {
    const terms = [t('cancer', null), t('immunotherapy', 'AND')];
    expect(buildApiQuery(terms)).toBe('cancer AND immunotherapy');
  });
});

describe('buildArticleUrl', () => {
  it('builds the canonical europepmc article url', () => {
    expect(buildArticleUrl({ source: 'MED', id: '42888301' })).toBe(
      'https://europepmc.org/article/MED/42888301',
    );
  });
});

describe('createTerm', () => {
  it('trims the value and assigns a unique id', () => {
    const a = createTerm('  cancer ', null);
    const b = createTerm('tumour', 'AND');
    expect(a.value).toBe('cancer');
    expect(a.op).toBeNull();
    expect(b.op).toBe('AND');
    expect(a.id).not.toBe(b.id);
  });
});
