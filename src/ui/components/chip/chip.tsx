import type { ReactNode } from 'react';
import { X } from '@icons';
import { cn } from '@shared/utils/cn';

interface ChipProps {
  readonly children: ReactNode;
  readonly onRemove?: () => void;
  readonly removeLabel?: string;
  readonly className?: string;
}

export function Chip({ children, onRemove, removeLabel, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line bg-white',
        'px-2.5 py-1 text-sm text-ink',
        className,
      )}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? 'Remove'}
          className="grid size-4 place-items-center rounded-full text-ink-3 hover:bg-line-soft hover:text-ink"
        >
          <X size={12} aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}
