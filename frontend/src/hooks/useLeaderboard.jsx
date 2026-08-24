import {useQuery} from '@tanstack/react-query';

function useLeaderboard({ dataset_uuid, metric, split }) {
    const {data: leaderboard, isLoading, error} = useQuery({
    queryKey: ['leaderboard', dataset_uuid, metric, split],
    queryFn: async ({signal}) => {
      try {
        const response = await fetch(`/api/v1/leaderboard?dataset_uuid=${dataset_uuid}&metric=${metric}&split=${split}`, {
          signal
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch leaderboard data');
        }
        return await response.json();
      } catch (networkError) {
        console.error("Network error during leaderboard fetch:", networkError);
        throw new Error('Network error during leaderboard fetch', { cause: networkError });
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minuti
    gcTime: 10 * 60 * 1000, // 10 minuti
    refetchOnWindowFocus: false,
    retry: 1, // riprova una volta in caso di errore
    enabled: !!dataset_uuid && !!metric && !!split, // esegui la query solo se tutti i parametri sono presenti
  });
  return { //gli hooks non ritornano JSX, ma solo dati e funzioni
    leaderboard,
    isLoading,
    error
  };
}
export default useLeaderboard;