import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { QueryBuilder } from '../query-builder';
import type { Term } from '../../../../article-search.types';

function Harness() {
  const [terms, setTerms] = useState<ReadonlyArray<Term>>([]);
  return <QueryBuilder terms={terms} onChange={setTerms} />;
}

describe('QueryBuilder', () => {
  it('shows the placeholder query before any term', () => {
    render(<Harness />);
    expect(screen.getByTestId('query-preview')).toHaveTextContent('Add a term to start');
  });

  it('adds a term and shows it in the live query', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByLabelText(/keyword or phrase/i), 'cancer');
    await user.click(screen.getByRole('button', { name: /add term/i }));
    expect(screen.getByTestId('query-preview')).toHaveTextContent('cancer');
  });

  it('combines two terms with the chosen operator', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByLabelText(/keyword or phrase/i);
    await user.type(input, 'cancer');
    await user.click(screen.getByRole('button', { name: /add term/i }));
    await user.selectOptions(screen.getByLabelText(/join with/i), 'NOT');
    await user.type(input, 'melanoma');
    await user.click(screen.getByRole('button', { name: /add term/i }));
    expect(screen.getByTestId('query-preview')).toHaveTextContent('cancer NOT melanoma');
  });

  it('removes a term and clears the leading operator', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByLabelText(/keyword or phrase/i);
    await user.type(input, 'cancer');
    await user.click(screen.getByRole('button', { name: /add term/i }));
    await user.type(input, 'tumour');
    await user.click(screen.getByRole('button', { name: /add term/i }));
    // remove the first term -> "tumour" must not start with AND
    await user.click(screen.getByRole('button', { name: /remove cancer/i }));
    expect(screen.getByTestId('query-preview')).toHaveTextContent('tumour');
    expect(screen.getByTestId('query-preview')).not.toHaveTextContent('AND');
  });

  it('does not add an empty term', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const button = screen.getByRole('button', { name: /add term/i });
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText(/keyword or phrase/i), '   ');
    expect(button).toBeDisabled();
  });
});
