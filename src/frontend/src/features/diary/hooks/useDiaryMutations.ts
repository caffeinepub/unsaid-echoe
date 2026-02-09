import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { Photo } from '../../../backend';

interface AddEntryParams {
  text: string;
  photo?: Photo | null;
  colorTag: string;
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, photo, colorTag }: AddEntryParams) => {
      if (!actor) throw new Error('Actor not available');
      
      const timestamp = BigInt(Date.now() * 1000000);
      
      if (photo) {
        await actor.addEntryWithPhoto(text, timestamp, photo, colorTag);
      } else {
        await actor.addEntry(text, timestamp, colorTag);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryEntries'] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timestamp: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteDiaryEntry(timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryEntries'] });
    },
  });
}
