import { useQuery } from '@tanstack/react-query';


function useVersions(datasetId) {
  const { data: versions, isLoading, error } = useQuery({
    queryKey: ['versions', datasetId], 
    queryFn: async ({signal}) => {
            try {
                const response = await fetch(`/api/v1/datasets/${datasetId}/versions`, {
                    signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch versions');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during datasets versions fetch:", networkError);
                throw new Error('Failed to fetch datasets versions', {cause: networkError});
            }
        },
        enabled: !!datasetId, 
    });

  return { 
    versions, 
    isLoading, 
    error 
  };
}

export default useVersions;