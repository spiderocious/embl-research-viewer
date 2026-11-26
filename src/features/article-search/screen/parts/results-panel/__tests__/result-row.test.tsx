import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultRow } from '../result-row';
import { makeArticle } from '@shared/test-utils/fixtures';

describe('ResultRow', () => {
  it('links the title to the europepmc article and opens in a new tab', () => {
    render(
      <ul>
        <ResultRow article={makeArticle({ title: 'My paper', source: 'MED', id: '99' })} />
      </ul>,
    );
    const link = screen.getByRole('link', { name: /my paper/i });
    expect(link).toHaveAttribute('href', 'https://europepmc.org/article/MED/99');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('renders authors, year, pmid and doi', () => {
    render(
      <ul>
        <ResultRow
          article={makeArticle({
            authorString: 'Okafor B.',
            pubYear: '2025',
            pmid: '7',
            doi: '10.1/x',
          })}
        />
      </ul>,
    );
    expect(screen.getByText('Okafor B.')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText(/PMID: 7/)).toBeInTheDocument();
    expect(screen.getByText(/DOI: 10\.1\/x/)).toBeInTheDocument();
  });

  it('omits optional metadata when absent', () => {
    render(
      <ul>
        <ResultRow article={{ id: '1', source: 'PPR', title: 'Preprint only' }} />
      </ul>,
    );
    expect(screen.queryByText(/PMID/)).not.toBeInTheDocument();
    expect(screen.queryByText(/DOI/)).not.toBeInTheDocument();
    expect(screen.getByText('PPR')).toBeInTheDocument();
  });
});
