import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Show } from 'meemaw';
import { ChevronLeft, ChevronRight, Loader2 } from '@icons';
import { Button } from '@ui/index';
import { cn } from '@shared/utils/cn';
import { formatNumber } from '@shared/utils/format-number';

interface PaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly hasPrev: boolean;
  readonly hasNext: boolean;
  readonly busy: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onJump: (oneBasedPage: number) => void;
}

export function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  busy,
  onPrev,
  onNext,
  onJump,
}: PaginationProps) {
  const [jumping, setJumping] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (jumping) inputRef.current?.focus();
  }, [jumping]);

  // Leave jump mode once a navigation settles.
  useEffect(() => {
    if (!busy && jumping) setJumping(false);
  }, [busy]); // eslint-disable-line react-hooks/exhaustive-deps

  function openJump() {
    setValue(String(page + 1));
    setJumping(true);
  }

  function submitJump(event: FormEvent) {
    event.preventDefault();
    const target = Number.parseInt(value, 10);
    if (Number.isFinite(target) && target >= 1 && target <= totalPages) {
      onJump(target);
    } else {
      setJumping(false);
    }
  }

  return (
    <nav aria-label="Results pages" className="flex items-center justify-between gap-3 pt-4">
      <Button variant="secondary" onClick={onPrev} disabled={!hasPrev || busy}>
        <Show when={busy} fallback={<ChevronLeft size={16} aria-hidden="true" />}>
          <Loader2 size={16} aria-hidden="true" className="animate-spin" />
        </Show>
        Previous
      </Button>

      {/* Page position — hover (or focus) to reveal a jump-to-page input */}
      <div className="group relative flex min-w-[9rem] items-center justify-center">
        <Show
          when={jumping}
          fallback={
            <button
              type="button"
              onClick={openJump}
              onFocus={openJump}
              disabled={totalPages <= 1 || busy}
              className={cn(
                'rounded-md px-2 py-1 text-sm text-ink-2 transition-colors',
                'hover:bg-petrol-wash hover:text-petrol-dark',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petrol',
                'disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-ink-2',
              )}
              title="Jump to a page"
              aria-label={`Page ${page + 1} of ${totalPages}. Activate to jump to a page.`}
            >
              <Show
                when={busy}
                fallback={
                  <>
                    Page <span className="font-mono font-semibold text-ink">{page + 1}</span>
                    {' of '}
                    <span className="font-mono">{formatNumber(totalPages)}</span>
                  </>
                }
              >
                <span className="inline-flex items-center gap-1.5 text-petrol-dark">
                  <Loader2 size={14} aria-hidden="true" className="animate-spin" />
                  Loading…
                </span>
              </Show>
            </button>
          }
        >
          <form onSubmit={submitJump} className="flex items-center gap-1.5">
            <label htmlFor="jump-page" className="whitespace-nowrap text-sm text-ink-2">
              Jump to
            </label>
            <input
              ref={inputRef}
              id="jump-page"
              type="number"
              min={1}
              max={totalPages}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => !busy && setJumping(false)}
              onKeyDown={(e) => e.key === 'Escape' && setJumping(false)}
              aria-label={`Page number, 1 to ${totalPages}`}
              className="w-16 rounded-md border border-petrol bg-white px-2 py-1 text-center font-mono text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petrol"
            />
            <Button type="submit" className="px-2.5 py-1" aria-label="Go to page">
              Go
            </Button>
          </form>
        </Show>
      </div>

      <Button variant="secondary" onClick={onNext} disabled={!hasNext || busy}>
        Next
        <Show when={busy} fallback={<ChevronRight size={16} aria-hidden="true" />}>
          <Loader2 size={16} aria-hidden="true" className="animate-spin" />
        </Show>
      </Button>
    </nav>
  );
}
