import { cn } from '@shared/utils/cn';

interface LogoProps {
  readonly className?: string;
}

/** EMBL-EBI ring-of-dots mark + wordmark, as its own reusable component. */
export function Logo({ className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="grid size-5 grid-cols-3 gap-[1.5px] rounded-sm bg-petrol p-[3px]"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={cn('rounded-full', i === 4 ? 'bg-embl-green' : 'bg-white/90')}
          />
        ))}
      </span>
      <span className="text-sm font-semibold tracking-wide">EMBL-EBI</span>
    </span>
  );
}
