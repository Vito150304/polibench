import { useQuery } from '@tanstack/react-query';

function useMultiLeaderboard({ dataset_uuid, metric, split, sort_by }) {
  const { data: multiLeaderboard, isLoading, error } = useQuery({
    queryKey: ['leaderboardMulti', dataset_uuid, metric, split, sort_by],
    
    queryFn: async ({ signal }) => {
      try {
        const response = await fetch(`/api/v1/leaderboard/multi?dataset_uuid=${dataset_uuid}&metric=${metric}&split=${split}&sort_by=${sort_by}`, {
          signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch multi-leaderboard data');
        }
        
        return await response.json();
      } catch (networkError) {
        console.error("Network error during multi-leaderboard fetch:", networkError);
        throw new Error('Network error during multi-leaderboard fetch', { cause: networkError });
      }
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: false,
    retry: 1, 
    enabled: !!dataset_uuid && !!metric && !!split, 
  });

  return { // gli hooks non ritornano JSX, ma solo dati e funzioni
    multiLeaderboard,
    isLoading,
    error
  };
}

export default useMultiLeaderboard;