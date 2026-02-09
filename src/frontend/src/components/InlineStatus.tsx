import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';

interface InlineStatusProps {
  type: 'loading' | 'error' | 'empty';
  message?: string;
}

export default function InlineStatus({ type, message }: InlineStatusProps) {
  if (type === 'loading') {
    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{message || 'Loading...'}</span>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {message || 'An error occurred. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (type === 'empty') {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-muted-foreground text-base">
          {message || 'No entries yet'}
        </p>
      </div>
    );
  }

  return null;
}

export function EntrySkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
