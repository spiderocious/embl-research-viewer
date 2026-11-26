import { ChevronLeft, ChevronRight } from '@icons';
import { Button } from '@ui/index';

interface PaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly hasPrev: boolean;
  readonly hasNext: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

export function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <nav aria-label="Results pages" className="flex items-center justify-between gap-3 pt-4">
      <Button variant="secondary" onClick={onPrev} disabled={!hasPrev}>
        <ChevronLeft size={16} aria-hidden="true" />
        Previous
      </Button>
      <p aria-live="polite" className="text-sm text-ink-2">
        Page <span className="font-mono font-semibold text-ink">{page + 1}</span>
        {' of '}
        <span className="font-mono">{totalPages}</span>
      </p>
      <Button variant="secondary" onClick={onNext} disabled={!hasNext}>
        Next
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </nav>
  );
}
