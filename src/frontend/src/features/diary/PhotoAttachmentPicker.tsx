import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoAttachmentPickerProps {
  onPhotoSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export default function PhotoAttachmentPicker({
  onPhotoSelect,
  selectedFile,
  disabled = false,
}: PhotoAttachmentPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (PNG, JPEG, or WebP)');
        return;
      }
      onPhotoSelect(file);
    }
  };

  const handleRemove = () => {
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Photo Attachment</span>
      </div>

      {!selectedFile ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Choose Image
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPEG, or WebP (max 5MB recommended)
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-3 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={disabled}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {previewUrl && (
            <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
