import { useState, useEffect } from 'react';
import { DiaryEntry, Photo } from '../../backend';
import { useAddEntry, useDeleteEntry } from './hooks/useDiaryMutations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Save, X, Loader2, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PhotoAttachmentPicker from './PhotoAttachmentPicker';
import EntryColorPicker from './EntryColorPicker';
import EntryColorTag from './EntryColorTag';

interface DiaryEditorProps {
  entry: DiaryEntry | null;
  isCreating: boolean;
  onClose: () => void;
}

export default function DiaryEditor({ entry, isCreating, onClose }: DiaryEditorProps) {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(isCreating);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [colorTag, setColorTag] = useState('#3b82f6');
  const addEntry = useAddEntry();
  const deleteEntry = useDeleteEntry();

  useEffect(() => {
    if (entry) {
      setText(entry.text);
      setColorTag(entry.colorTag || '#3b82f6');
      setIsEditing(false);
      setSelectedPhoto(null);
      
      // Create blob URL for existing photo
      if (entry.photo) {
        const blob = new Blob([new Uint8Array(entry.photo.bytes)], { type: entry.photo.mimeType });
        const url = URL.createObjectURL(blob);
        setPhotoUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPhotoUrl(null);
      }
    } else if (isCreating) {
      setText('');
      setColorTag('#3b82f6');
      setIsEditing(true);
      setSelectedPhoto(null);
      setPhotoUrl(null);
    }
  }, [entry, isCreating]);

  const handleSave = async () => {
    if (!text.trim()) {
      toast.error('Entry cannot be empty');
      return;
    }

    try {
      let photoData: Photo | null = null;
      
      if (selectedPhoto) {
        // Convert file to bytes and get dimensions
        const arrayBuffer = await selectedPhoto.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        // Get image dimensions
        const img = new Image();
        const imgUrl = URL.createObjectURL(selectedPhoto);
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imgUrl;
        });
        
        URL.revokeObjectURL(imgUrl);
        
        photoData = {
          bytes,
          mimeType: selectedPhoto.type,
          width: BigInt(img.width),
          height: BigInt(img.height),
        };
      }

      await addEntry.mutateAsync({ text, photo: photoData, colorTag });
      toast.success('Entry saved successfully');
      onClose();
    } catch (error: any) {
      console.error('Failed to save entry:', error);
      toast.error(error?.message || 'Failed to save entry');
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!entry) return;

    const confirmed = window.confirm('Are you sure you want to delete this entry? This action cannot be undone.');
    
    if (!confirmed) return;

    try {
      await deleteEntry.mutateAsync(entry.timestamp);
      toast.success('Entry deleted successfully');
      onClose();
    } catch (error: any) {
      console.error('Failed to delete entry:', error);
      toast.error(error?.message || 'Failed to delete entry');
    }
  };

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-display font-semibold">
              {isCreating ? 'New Entry' : 'View Entry'}
            </h2>
            {entry && (
              <p className="text-xs text-muted-foreground">
                {formatDate(entry.timestamp)}
              </p>
            )}
          </div>
          {!isEditing && entry && (
            <EntryColorTag color={entry.colorTag || '#3b82f6'} size="lg" className="ml-2" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && entry && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteEntry.isPending}
              className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Delete entry"
            >
              {deleteEntry.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {isEditing ? (
            <>
              <EntryColorPicker value={colorTag} onChange={setColorTag} />
              <div className="space-y-2">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your thoughts..."
                  className="min-h-[400px] resize-none diary-entry-text text-base"
                  autoFocus
                />
              </div>
              <PhotoAttachmentPicker
                selectedFile={selectedPhoto}
                onPhotoSelect={setSelectedPhoto}
              />
            </>
          ) : (
            <>
              <div className="prose prose-lg max-w-none">
                <p className="diary-entry-text whitespace-pre-wrap">{text}</p>
              </div>
              {photoUrl && (
                <div className="space-y-2">
                  <Separator />
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={photoUrl}
                      alt="Entry attachment"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {isEditing && (
        <div className="p-4 border-t border-border flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={addEntry.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={addEntry.isPending || !text.trim()}
            className="gap-2"
          >
            {addEntry.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Entry
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
