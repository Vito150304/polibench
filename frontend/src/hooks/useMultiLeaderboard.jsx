import { useQuery } from '@tanstack/react-query';

function useMultiLeaderboard({ dataset_uuid, dataset_version_uuid, pipeline_uuid,  metrics, split, sort_by }) {
  const { data: multiLeaderboard, isLoading, error } = useQuery({
    queryKey: ['leaderboardMulti', dataset_uuid, dataset_version_uuid, pipeline_uuid, metrics, split, sort_by],
    
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        dataset_uuid,
        metrics: metrics.join(','),
        split,
        sort_by,
      });
      if (dataset_version_uuid) params.set('dataset_version_uuid', dataset_version_uuid);
      if (pipeline_uuid) params.set('pipeline_uuid', pipeline_uuid);

      const response = await fetch(`/api/v1/leaderboard/multi?${params}`, {
        signal,
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch multi-leaderboard data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!dataset_uuid && !!metrics?.length && !!split && !!sort_by,
  });

  return { multiLeaderboard, isLoading, error };
}
export default useMultiLeaderboard;