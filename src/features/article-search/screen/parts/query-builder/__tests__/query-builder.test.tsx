import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { QueryBuilder } from '../query-builder';
import type { Term } from '../../../../article-search.types';

function Harness() {
  const [terms, setTerms] = useState<ReadonlyArray<Term>>([]);
  return <QueryBuilder terms={terms} onChange={setTerms} />;
}

const input = () => screen.getByLabelText(/keyword or phrase/i);
const addButton = () => screen.getByRole('button', { name: /add term/i });
const preview = () => screen.getByTestId('query-preview');

describe('QueryBuilder', () => {
  it('shows the placeholder query before any term', () => {
    render(<Harness />);
    expect(preview()).toHaveTextContent('Add a term to start');
  });

  it('adds a term and shows it in the live query', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(input(), 'cancer');
    await user.click(addButton());
    expect(preview()).toHaveTextContent('cancer');
  });

  it('adds a term by pressing Enter', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(input(), 'immunotherapy{Enter}');
    expect(preview()).toHaveTextContent('immunotherapy');
    expect(input()).toHaveValue(''); // input clears after adding
  });

  it('combines two terms with the chosen operator (segmented control)', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(input(), 'cancer{Enter}');
    // pick NOT from the "next term" operator group
    const group = screen.getByRole('radiogroup', { name: /operator for the next term/i });
    await user.click(within(group).getByRole('radio', { name: 'NOT' }));
    await user.type(input(), 'melanoma{Enter}');
    expect(preview()).toHaveTextContent('cancer NOT melanoma');
  });

  it("changes a term's operator in place from its chip", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(input(), 'cancer{Enter}');
    await user.type(input(), 'tumour{Enter}'); // defaults to AND
    expect(preview()).toHaveTextContent('cancer AND tumour');
    // the chip before "tumour" exposes an operator group
    const chipGroup = screen.getByRole('radiogroup', { name: /operator before tumour/i });
    await user.click(within(chipGroup).getByRole('radio', { name: 'OR' }));
    expect(preview()).toHaveTextContent('cancer OR tumour');
  });

  it('removes a term and clears the leading operator', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(input(), 'cancer{Enter}');
    await user.type(input(), 'tumour{Enter}');
    await user.click(screen.getByRole('button', { name: /remove cancer/i }));
    expect(preview()).toHaveTextContent('tumour');
    expect(preview()).not.toHaveTextContent('AND');
  });

  it('does not add an empty term', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(addButton()).toBeDisabled();
    await user.type(input(), '   ');
    expect(addButton()).toBeDisabled();
  });

  it('loads an example query on click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(
      screen.getByRole('button', { name: /cancer AND immunotherapy NOT melanoma/i }),
    );
    expect(preview()).toHaveTextContent('cancer AND immunotherapy NOT melanoma');
  });
});
