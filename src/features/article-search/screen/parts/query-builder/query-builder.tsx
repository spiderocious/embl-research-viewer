import { useState, type FormEvent } from 'react';
import { Show, Repeat } from 'meemaw';
import { Plus, Search, X } from '@icons';
import { Button, SegmentedControl, type SegmentOption } from '@ui/index';
import { cn } from '@shared/utils/cn';
import type { Operator, Term } from '../../../article-search.types';
import { createTerm } from '../../../helpers/create-term';
import { buildDisplayQuery } from '../../../helpers/build-display-query';

interface QueryBuilderProps {
  readonly terms: ReadonlyArray<Term>;
  readonly onChange: (terms: ReadonlyArray<Term>) => void;
}

const OPERATOR_OPTIONS: ReadonlyArray<SegmentOption<Operator>> = [
  { value: 'AND', label: 'AND', hint: 'Results must match this term too' },
  { value: 'OR', label: 'OR', hint: 'Results may match this term' },
  { value: 'NOT', label: 'NOT', hint: 'Exclude results matching this term' },
];

interface Example {
  readonly label: string;
  readonly terms: ReadonlyArray<readonly [string, Operator | null]>;
}

const EXAMPLES: ReadonlyArray<Example> = [
  {
    label: 'cancer AND immunotherapy NOT melanoma',
    terms: [
      ['cancer', null],
      ['immunotherapy', 'AND'],
      ['melanoma', 'NOT'],
    ],
  },
  {
    label: 'CRISPR AND gene editing',
    terms: [
      ['CRISPR', null],
      ['gene editing', 'AND'],
    ],
  },
  {
    label: 'COVID-19 OR SARS-CoV-2',
    terms: [
      ['COVID-19', null],
      ['SARS-CoV-2', 'OR'],
    ],
  },
];

const operatorTone: Record<Operator, string> = {
  AND: 'text-petrol-dark',
  OR: 'text-embl-blue-dark',
  NOT: 'text-alert',
};

export function QueryBuilder({ terms, onChange }: QueryBuilderProps) {
  const [value, setValue] = useState('');
  const [op, setOp] = useState<Operator>('AND');
  const isEmpty = terms.length === 0;
  const canAdd = value.trim().length > 0;
  const displayQuery = buildDisplayQuery(terms);

  function addTerm(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onChange([...terms, createTerm(trimmed, isEmpty ? null : op)]);
    setValue('');
  }

  function removeTerm(id: string) {
    const next = terms
      .filter((term) => term.id !== id)
      .map((term, index) => (index === 0 ? { ...term, op: null } : term));
    onChange(next);
  }

  function setOperatorAt(id: string, nextOp: Operator) {
    onChange(terms.map((term) => (term.id === id ? { ...term, op: nextOp } : term)));
  }

  function loadExample(example: Example) {
    onChange(example.terms.map(([text, operator]) => createTerm(text, operator)));
    setValue('');
  }

  return (
    <section aria-labelledby="qb-heading" className="flex flex-col gap-4">
      <div>
        <h2 id="qb-heading" className="text-base font-semibold text-ink">
          Build your search
        </h2>
        <p className="mt-0.5 text-sm text-ink-2">Add terms and combine them. Press Enter to add.</p>
      </div>

      {/* Canonical query string: announced to assistive tech and used in tests. */}
      <span className="sr-only" aria-live="polite" data-testid="query-preview">
        {displayQuery || 'Add a term to start'}
      </span>

      {/* The search string, assembled from the chips (only once there are terms) */}
      <Show when={!isEmpty}>
        <div className="rounded-lg border border-line bg-bg-alt px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Repeat each={[...terms]}>
              {(term, index: number) => (
                <span key={term.id} className="inline-flex items-center gap-1.5">
                  <Show when={index > 0 && term.op !== null}>
                    <SegmentedControl
                      label={`Operator before ${term.value}`}
                      value={term.op ?? 'AND'}
                      options={OPERATOR_OPTIONS}
                      onChange={(next) => setOperatorAt(term.id, next)}
                      className="scale-90"
                    />
                  </Show>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white py-1 pl-2.5 pr-1 text-sm text-ink">
                    {term.value}
                    <button
                      type="button"
                      onClick={() => removeTerm(term.id)}
                      aria-label={`Remove ${term.value}`}
                      className="grid size-4 place-items-center rounded-full text-ink-3 hover:bg-line-soft hover:text-ink"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </span>
                </span>
              )}
            </Repeat>
          </div>
        </Show>
      </div>

      {/* Add a term */}
      <form onSubmit={addTerm} className="flex flex-col gap-2">
        <Show when={!isEmpty}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-3">
              Combine with
            </span>
            <SegmentedControl
              label="Operator for the next term"
              value={op}
              options={OPERATOR_OPTIONS}
              onChange={setOp}
            />
          </div>
        </Show>

        <div className="flex items-stretch gap-2">
          <div className="relative flex-1">
            <label htmlFor="qb-term" className="sr-only">
              Keyword or phrase
            </label>
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
            />
            <input
              id="qb-term"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isEmpty ? 'e.g. immunotherapy' : 'Add another term…'}
              className={cn(
                'w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink',
                'placeholder:text-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petrol',
              )}
            />
          </div>
          <Button type="submit" aria-label="Add term" disabled={!canAdd}>
            <Plus size={16} aria-hidden="true" />
            Add
          </Button>
        </div>
      </form>

      {/* Starter queries, only on a blank slate */}
      <Show when={isEmpty}>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-3">
            Try an example
          </span>
          <div className="flex flex-col gap-1.5">
            <Repeat each={[...EXAMPLES]}>
              {(example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => loadExample(example)}
                  className="group flex items-center gap-2 rounded-md border border-line-soft bg-white px-3 py-2 text-left text-sm text-ink-2 transition-colors hover:border-petrol hover:bg-petrol-wash"
                >
                  <Search
                    size={13}
                    aria-hidden="true"
                    className="shrink-0 text-ink-3 group-hover:text-petrol"
                  />
                  <span className="font-mono text-xs">
                    <QueryPreviewText label={example.label} />
                  </span>
                </button>
              )}
            </Repeat>
          </div>
        </div>
      </Show>
    </section>
  );
}

/** Render an example query string with its operators tinted. */
function QueryPreviewText({ label }: { readonly label: string }) {
  const parts = label.split(/\b(AND|OR|NOT)\b/);
  return (
    <>
      <Repeat each={parts}>
        {(part, index) => {
          const tone = operatorTone[part as Operator];
          return (
            <span key={index} className={tone ? cn('font-semibold', tone) : undefined}>
              {part}
            </span>
          );
        }}
      </Repeat>
    </>
  );
}
