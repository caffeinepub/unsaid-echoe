import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';

const themes = [
  { value: 'light', label: 'Light', color: 'oklch(0.97 0.02 60)' },
  { value: 'dark', label: 'Dark', color: 'oklch(0.18 0.02 40)' },
  { value: 'ocean', label: 'Ocean', color: 'oklch(0.55 0.15 200)' },
  { value: 'sunset', label: 'Sunset', color: 'oklch(0.60 0.18 25)' },
  { value: 'forest', label: 'Forest', color: 'oklch(0.50 0.14 160)' },
  { value: 'lavender', label: 'Lavender', color: 'oklch(0.55 0.16 280)' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: t.color }}
            />
            <span className={theme === t.value ? 'font-semibold' : ''}>
              {t.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
