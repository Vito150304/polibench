import {useQuery} from '@tanstack/react-query';

function useLeaderboard({ dataset_uuid, dataset_version_uuid, pipeline_uuid, metric, split }) {
    const {data: leaderboard, isLoading, error} = useQuery({

      queryKey: ['leaderboard', dataset_uuid, dataset_version_uuid, pipeline_uuid, metric, split],
      queryFn: async ({signal}) => {

        const params = new URLSearchParams({ dataset_uuid, metric, split });
        if (dataset_version_uuid) params.set('dataset_version_uuid', dataset_version_uuid);
        if (pipeline_uuid) params.set('pipeline_uuid', pipeline_uuid);
        
        const response = await fetch(`/api/v1/leaderboard?${params}`, { signal });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch leaderboard data');
        }
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1, 
      enabled: !!dataset_uuid && !!metric && !!split, // esegui la query solo se tutti i parametri sono presenti  
    },
  );
    return { //gli hooks non ritornano JSX, ma solo dati e funzioni
      leaderboard,
      isLoading,
      error
    };
  }
export default useLeaderboard;