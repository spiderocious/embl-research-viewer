import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../pagination';

describe('Pagination', () => {
  it('shows the current page position', () => {
    render(
      <Pagination page={1} totalPages={3} hasPrev hasNext onPrev={() => {}} onNext={() => {}} />,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('disables Previous on the first page and Next on the last', () => {
    const { rerender } = render(
      <Pagination page={0} totalPages={3} hasPrev={false} hasNext onPrev={() => {}} onNext={() => {}} />,
    );
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();

    rerender(
      <Pagination page={2} totalPages={3} hasPrev hasNext={false} onPrev={() => {}} onNext={() => {}} />,
    );
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls onNext and onPrev when clicked', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const onPrev = vi.fn();
    render(
      <Pagination page={1} totalPages={3} hasPrev hasNext onPrev={onPrev} onNext={onNext} />,
    );
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(onNext).toHaveBeenCalledOnce();
    expect(onPrev).toHaveBeenCalledOnce();
  });
});
