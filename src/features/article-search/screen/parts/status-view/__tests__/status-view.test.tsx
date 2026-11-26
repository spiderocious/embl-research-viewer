import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusView } from '../status-view';

describe('StatusView', () => {
  it('renders the idle prompt', () => {
    render(<StatusView status="idle" query="" onRetry={() => {}} />);
    expect(screen.getByText(/search 47 million publications/i)).toBeInTheDocument();
  });

  it('renders the loading state', () => {
    render(<StatusView status="loading" query="cancer" onRetry={() => {}} />);
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('renders the empty state with the query', () => {
    render(<StatusView status="empty" query="zxqwv" onRetry={() => {}} />);
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
    expect(screen.getByText('zxqwv')).toBeInTheDocument();
  });

  it('renders the error state with a working Retry button', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<StatusView status="error" query="cancer" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
