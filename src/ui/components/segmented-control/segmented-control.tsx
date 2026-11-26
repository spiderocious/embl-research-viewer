import { Repeat } from 'meemaw';
import { cn } from '@shared/utils/cn';

export interface SegmentOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly hint?: string;
}

interface SegmentedControlProps<T extends string> {
  readonly value: T;
  readonly options: ReadonlyArray<SegmentOption<T>>;
  readonly onChange: (value: T) => void;
  readonly label: string;
  readonly className?: string;
}

/** A small keyboard-accessible segmented toggle (a radio group that looks like tabs). */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('inline-flex rounded-md border border-line bg-bg-alt p-0.5', className)}
    >
      <Repeat each={[...options]}>
        {(option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              title={option.hint}
              onClick={() => onChange(option.value)}
              className={cn(
                'rounded px-2.5 py-1 font-mono text-xs font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petrol',
                selected
                  ? 'bg-petrol text-white shadow-sm'
                  : 'text-ink-2 hover:text-petrol-dark',
              )}
            >
              {option.label}
            </button>
          );
        }}
      </Repeat>
    </div>
  );
}
