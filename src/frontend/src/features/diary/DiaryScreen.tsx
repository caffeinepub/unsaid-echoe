import { useState } from 'react';
import { useGetEntries } from './hooks/useDiaryEntries';
import { UserProfile } from '../../backend';
import DiaryList from './DiaryList';
import DiaryEditor from './DiaryEditor';
import AuthButton from '../../components/AuthButton';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import InlineStatus, { EntrySkeleton } from '../../components/InlineStatus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Plus } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';

interface DiaryScreenProps {
  userProfile: UserProfile | null;
}

export default function DiaryScreen({ userProfile }: DiaryScreenProps) {
  const { data: entries, isLoading, isError, error } = useGetEntries();
  const [selectedTimestamp, setSelectedTimestamp] = useState<bigint | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleNewEntry = () => {
    setSelectedTimestamp(null);
    setIsCreating(true);
  };

  const handleSelectEntry = (timestamp: bigint) => {
    setIsCreating(false);
    setSelectedTimestamp(timestamp);
  };

  const handleCloseEditor = () => {
    setIsCreating(false);
    setSelectedTimestamp(null);
  };

  const selectedEntry = selectedTimestamp !== null && entries 
    ? entries.find(e => e.timestamp === selectedTimestamp) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold">Unsaid Echoe</h1>
                {userProfile && (
                  <p className="text-sm text-muted-foreground">{userProfile.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Entries List */}
          <Card className="lg:col-span-1 diary-page h-fit lg:sticky lg:top-24">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold">Entries</h2>
                <Button
                  onClick={handleNewEntry}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New
                </Button>
              </div>
            </div>

            {isLoading && <EntrySkeleton />}
            {isError && (
              <InlineStatus
                type="error"
                message={error?.message || 'Failed to load entries'}
              />
            )}
            {!isLoading && !isError && entries && entries.length === 0 && (
              <InlineStatus
                type="empty"
                message="No entries yet. Start writing your first entry!"
              />
            )}
            {!isLoading && !isError && entries && entries.length > 0 && (
              <DiaryList
                entries={entries}
                selectedTimestamp={selectedTimestamp}
                onSelectEntry={handleSelectEntry}
              />
            )}
          </Card>

          {/* Editor/Viewer */}
          <Card className="lg:col-span-2 diary-page min-h-[600px]">
            {!isCreating && selectedEntry === null && (
              <div className="flex items-center justify-center h-full min-h-[600px] p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-semibold">
                      Welcome to Your Diary
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Select an entry from the list or create a new one to start writing.
                    </p>
                  </div>
                  <Button onClick={handleNewEntry} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create First Entry
                  </Button>
                </div>
              </div>
            )}
            {(isCreating || selectedEntry !== null) && (
              <DiaryEditor
                entry={selectedEntry}
                isCreating={isCreating}
                onClose={handleCloseEditor}
              />
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Unsaid Echoe</span>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              Built with <SiCaffeine className="h-4 w-4 text-primary" /> caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
