import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import { DiaryEntry } from '../../../backend';

export function useGetEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DiaryEntry[]>({
    queryKey: ['diaryEntries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEntries();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
  });
}
