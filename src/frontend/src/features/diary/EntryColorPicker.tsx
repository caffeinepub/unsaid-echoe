import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EntryColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const colorOptions = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' },
];

export default function EntryColorPicker({ value, onChange, className }: EntryColorPickerProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">Entry Color</Label>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={cn(
              'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
              value === color.value ? 'border-foreground ring-2 ring-ring ring-offset-2 ring-offset-background' : 'border-border'
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
          >
            <span className="sr-only">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
