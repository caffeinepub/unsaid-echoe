import { DiaryEntry } from '../../backend';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import EntryColorTag from './EntryColorTag';

interface DiaryListProps {
  entries: DiaryEntry[];
  selectedTimestamp: bigint | null;
  onSelectEntry: (timestamp: bigint) => void;
}

export default function DiaryList({ entries, selectedTimestamp, onSelectEntry }: DiaryListProps) {
  const getEntryPreview = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines[0] || 'Empty entry';
  };

  const getEntryDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <ScrollArea className="h-[500px]">
      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <button
            key={entry.timestamp.toString()}
            onClick={() => onSelectEntry(entry.timestamp)}
            className={cn(
              'w-full text-left p-4 transition-colors hover:bg-accent/50',
              selectedTimestamp === entry.timestamp && 'bg-accent'
            )}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <EntryColorTag color={entry.colorTag || '#3b82f6'} size="sm" className="mt-1" />
                  <p className="font-medium line-clamp-2 diary-entry-text flex-1">
                    {getEntryPreview(entry.text)}
                  </p>
                </div>
                {entry.photo && (
                  <ImageIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                )}
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                {getEntryDate(entry.timestamp)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
