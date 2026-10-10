import { useQuery } from '@tanstack/react-query';


export const useVersions = (datasetId) => {
  const { data: versions, isLoading, error } = useQuery({
    queryKey: ['versions', datasetId],
    queryFn: async ({ signal }) => {
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

export const useVersionDetails = (version_uuid) => {
  const { data: versionDetails, isLoading, error } = useQuery({
    queryKey: ['versionDetails', version_uuid],
    queryFn: async ({ signal }) => {
      try {
        const response = await fetch(`/api/v1/dataset-versions/${version_uuid}`, {
          signal
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch version details');
        }
        return response.json();
      } catch (networkError) {
        console.error("Network error during version details fetch:", networkError);
        throw new Error('Failed to fetch version details', { cause: networkError });
      }
    },
    enabled: !!version_uuid,
  });

  return {
    versionDetails,
    isLoading,
    error
  };
};
