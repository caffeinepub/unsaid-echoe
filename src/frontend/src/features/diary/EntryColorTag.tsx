import { cn } from '@/lib/utils';

interface EntryColorTagProps {
  color: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function EntryColorTag({ color, className, size = 'md' }: EntryColorTagProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={cn(
        'rounded-full border border-border shrink-0',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
      title="Entry color"
    />
  );
}
