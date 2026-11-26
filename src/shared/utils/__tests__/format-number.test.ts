import { describe, it, expect } from 'vitest';
import { formatNumber } from '../format-number';

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(280474)).toBe('280,474');
  });
  it('handles zero and small numbers', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(42)).toBe('42');
  });
  it('handles millions', () => {
    expect(formatNumber(5670103)).toBe('5,670,103');
  });
});
