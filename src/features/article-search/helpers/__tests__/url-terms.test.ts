import { describe, it, expect } from 'vitest';
import { encodeTerms, decodeTerms } from '../url-terms';
import { createTerm } from '../create-term';
import { buildDisplayQuery } from '../build-display-query';

describe('encodeTerms', () => {
  it('encodes an empty list as an empty string', () => {
    expect(encodeTerms([])).toBe('');
  });

  it('encodes a single term with no operator', () => {
    expect(encodeTerms([createTerm('cancer', null)])).toBe('cancer');
  });

  it('encodes operators for later terms', () => {
    const terms = [createTerm('cancer', null), createTerm('immunotherapy', 'AND'), createTerm('melanoma', 'NOT')];
    expect(encodeTerms(terms)).toBe('cancer~AND:immunotherapy~NOT:melanoma');
  });
});

describe('decodeTerms', () => {
  it('returns no terms for null or empty', () => {
    expect(decodeTerms(null)).toHaveLength(0);
    expect(decodeTerms('')).toHaveLength(0);
  });

  it('round-trips with encodeTerms', () => {
    const terms = [createTerm('cancer', null), createTerm('immunotherapy', 'AND'), createTerm('melanoma', 'NOT')];
    const decoded = decodeTerms(encodeTerms(terms));
    expect(buildDisplayQuery(decoded)).toBe('cancer AND immunotherapy NOT melanoma');
    expect(decoded[0]!.op).toBeNull();
    expect(decoded[1]!.op).toBe('AND');
    expect(decoded[2]!.op).toBe('NOT');
  });

  it('defaults a non-first term with no valid operator to AND', () => {
    const decoded = decodeTerms('cancer~tumour');
    expect(buildDisplayQuery(decoded)).toBe('cancer AND tumour');
  });

  it('ignores an unknown operator prefix and keeps the value', () => {
    const decoded = decodeTerms('cancer~XOR:tumour');
    // "XOR:tumour" is not a valid op -> whole segment becomes a plain AND term
    expect(buildDisplayQuery(decoded)).toContain('cancer');
    expect(decoded).toHaveLength(2);
  });

  it('handles a phrase value with spaces', () => {
    const decoded = decodeTerms('breast cancer~OR:lung cancer');
    expect(buildDisplayQuery(decoded)).toBe('breast cancer OR lung cancer');
  });
});
