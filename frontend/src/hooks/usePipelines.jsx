import { useQuery } from '@tanstack/react-query';

function usePipelines(versionId) {
    const { data: pipelines, isLoading, error } = useQuery({
    queryKey: ['pipelines', versionId], 
    queryFn: async ({signal}) => {
            try {
                const response = await fetch(`/api/v1/datasets-versions/${versionId}/pipelines`, {
                    signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch pipelines');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during datasets pipelines fetch:", networkError);
                throw new Error('Failed to fetch datasets pipelines', {cause: networkError});
            }
        },
        enabled: !!versionId, 
    });

  return { 
    pipelines, 
    isLoading, 
    error 
  };
}

export default usePipelines;
