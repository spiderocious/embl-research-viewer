import { useState, type FormEvent } from 'react';
import { Show, Repeat } from 'meemaw';
import { Plus } from '@icons';
import { Button, Chip, TextField } from '@ui/index';
import { cn } from '@shared/utils/cn';
import type { Operator, Term } from '../../../article-search.types';
import { createTerm } from '../../../helpers/create-term';
import { buildDisplayQuery } from '../../../helpers/build-display-query';

interface QueryBuilderProps {
  readonly terms: ReadonlyArray<Term>;
  readonly onChange: (terms: ReadonlyArray<Term>) => void;
}

const OPERATORS: ReadonlyArray<Operator> = ['AND', 'OR', 'NOT'];

export function QueryBuilder({ terms, onChange }: QueryBuilderProps) {
  const [value, setValue] = useState('');
  const [op, setOp] = useState<Operator>('AND');
  const displayQuery = buildDisplayQuery(terms);

  function addTerm(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    const term = createTerm(trimmed, terms.length === 0 ? null : op);
    onChange([...terms, term]);
    setValue('');
  }

  function removeTerm(id: string) {
    const nextTerms = terms
      .filter((term) => term.id !== id)
      .map((term, index) => (index === 0 ? { ...term, op: null } : term));
    onChange(nextTerms);
  }

  return (
    <section aria-labelledby="qb-heading" className="flex flex-col gap-4">
      <h2 id="qb-heading" className="text-base font-semibold text-ink">
        Build your search
      </h2>

      <form onSubmit={addTerm} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Show when={terms.length > 0}>
          <div className="flex flex-col gap-1">
            <label htmlFor="qb-operator" className="text-sm font-medium text-ink">
              Join with
            </label>
            <select
              id="qb-operator"
              value={op}
              onChange={(e) => setOp(e.target.value as Operator)}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petrol"
            >
              <Repeat each={[...OPERATORS]}>
                {(operator) => (
                  <option key={operator} value={operator}>
                    {operator}
                  </option>
                )}
              </Repeat>
            </select>
          </div>
        </Show>

        <div className="flex-1">
          <TextField
            id="qb-term"
            label="Keyword or phrase"
            placeholder="e.g. immunotherapy"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <Button type="submit" aria-label="Add term" disabled={value.trim().length === 0}>
          <Plus size={16} aria-hidden="true" />
          Add term
        </Button>
      </form>

      <Show when={terms.length > 0}>
        <div className="flex flex-wrap gap-2">
          <Repeat each={[...terms]}>
            {(term) => (
              <Chip
                key={term.id}
                onRemove={() => removeTerm(term.id)}
                removeLabel={`Remove ${term.value}`}
              >
                <Show when={term.op !== null}>
                  <span className="font-mono text-xs font-semibold text-petrol-dark">
                    {term.op}
                  </span>
                </Show>
                {term.value}
              </Chip>
            )}
          </Repeat>
        </div>
      </Show>

      <div
        className={cn(
          'rounded-md border border-line bg-petrol-wash/60 px-3 py-2',
          'font-mono text-sm text-ink',
        )}
      >
        <span className="mr-2 text-xs uppercase tracking-wide text-ink-3">Query</span>
        <span aria-live="polite" data-testid="query-preview">
          {displayQuery || <span className="text-ink-3">Add a term to start</span>}
        </span>
      </div>
    </section>
  );
}
