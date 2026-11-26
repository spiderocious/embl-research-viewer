import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUrlState } from '../use-url-state';
import { createTerm } from '../../helpers/create-term';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('useUrlState', () => {
  it('starts with no terms and a clean URL when none are present', () => {
    const { result } = renderHook(() => useUrlState());
    expect(result.current.terms).toHaveLength(0);
    expect(result.current.initialPage).toBe(0);
  });

  it('reads initial terms and page from the URL', () => {
    window.history.replaceState(null, '', '/?terms=cancer~AND:tumour&page=2');
    const { result } = renderHook(() => useUrlState());
    expect(result.current.initialTerms).toHaveLength(2);
    expect(result.current.initialPage).toBe(1); // page=2 is zero-based 1
  });

  it('writes terms into the URL on change', () => {
    const { result } = renderHook(() => useUrlState());
    act(() => result.current.setTerms([createTerm('cancer', null)]));
    expect(window.location.search).toContain('terms=cancer');
  });

  it('syncs the page into the URL', () => {
    const { result } = renderHook(() => useUrlState());
    act(() => result.current.setTerms([createTerm('cancer', null)]));
    act(() => result.current.syncPage(2));
    expect(window.location.search).toContain('page=3'); // zero-based 2 -> 1-based 3
  });

  it('clears the URL when all terms are removed', () => {
    const { result } = renderHook(() => useUrlState());
    act(() => result.current.setTerms([createTerm('cancer', null)]));
    act(() => result.current.setTerms([]));
    expect(window.location.search).toBe('');
  });

  it('ignores a page param when there are no terms', () => {
    window.history.replaceState(null, '', '/?page=5');
    const { result } = renderHook(() => useUrlState());
    expect(result.current.initialPage).toBe(0);
  });
});
