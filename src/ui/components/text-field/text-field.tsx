import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly id: string;
  readonly hint?: ReactNode;
  readonly error?: string;
}

export function TextField({ label, id, hint, error, className, ...rest }: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={cn(hintId, errorId) || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'rounded-md border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petrol',
          error ? 'border-alert' : 'border-line',
          className,
        )}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
