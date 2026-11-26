import { Loader2, FileSearch, AlertCircle, Search } from '@icons';
import { Button, StatusMessage } from '@ui/index';
import type { SearchStatus } from '../../../api/use-article-search';

interface StatusViewProps {
  readonly status: Exclude<SearchStatus, 'success'>;
  readonly query: string;
  readonly onRetry: () => void;
}

export function StatusView({ status, query, onRetry }: StatusViewProps) {
  if (status === 'idle') {
    return (
      <StatusMessage
        tone="info"
        icon={<Search size={32} />}
        title="Search 47 million publications"
        description="Add one or more terms above, combine them with AND, OR or NOT, and the matching Europe PMC articles appear here."
      />
    );
  }

  if (status === 'loading') {
    return (
      <StatusMessage
        tone="info"
        icon={<Loader2 size={32} className="animate-spin" />}
        title="Searching…"
        description="Fetching matching publications from Europe PMC."
      />
    );
  }

  if (status === 'empty') {
    return (
      <StatusMessage
        tone="empty"
        icon={<FileSearch size={32} />}
        title="No results"
        description={
          <>
            Nothing matched <span className="font-mono text-ink">{query}</span>. Try removing a term
            or broadening it with OR.
          </>
        }
      />
    );
  }

  return (
    <StatusMessage
      tone="error"
      role="alert"
      icon={<AlertCircle size={32} />}
      title="Something went wrong"
      description="The search request to Europe PMC failed. Check your connection and try again."
      action={
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      }
    />
  );
}
