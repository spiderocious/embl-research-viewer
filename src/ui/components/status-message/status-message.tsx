import type { ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

type Tone = 'info' | 'empty' | 'error';

interface StatusMessageProps {
  readonly tone: Tone;
  readonly icon: ReactNode;
  readonly title: string;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
  /** 'status' for polite updates, 'alert' for errors. */
  readonly role?: 'status' | 'alert';
}

const toneRing: Record<Tone, string> = {
  info: 'text-petrol',
  empty: 'text-ink-3',
  error: 'text-alert',
};

export function StatusMessage({
  tone,
  icon,
  title,
  description,
  action,
  role = 'status',
}: StatusMessageProps) {
  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className="flex flex-col items-center gap-2 rounded-lg border border-line-soft bg-white px-6 py-12 text-center"
    >
      <span className={cn('mb-1', toneRing[tone])} aria-hidden="true">
        {icon}
      </span>
      <p className="text-base font-semibold text-ink">{title}</p>
      {description ? <p className="max-w-sm text-sm text-ink-2">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
