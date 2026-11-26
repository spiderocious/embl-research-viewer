import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: Variant;
  readonly children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-md font-medium text-sm px-3.5 py-2 ' +
  'transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-petrol focus-visible:ring-offset-2';

const variants: Record<Variant, string> = {
  primary: 'bg-petrol text-white hover:bg-petrol-dark',
  secondary: 'border border-petrol text-petrol-dark bg-white hover:bg-petrol-wash',
  ghost: 'text-ink-2 hover:bg-line-soft',
};

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
