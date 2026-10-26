import { useQuery } from '@tanstack/react-query';


export const useVersions = (datasetId) => {
  const { data: versions, isLoading, error } = useQuery({
    queryKey: ['versions', datasetId],
    queryFn: async ({ signal }) => {
      let response;
      try {
        response = await fetch(`/api/v1/datasets/${datasetId}/versions`, {
          signal
        });
        } catch (networkError) {
        throw new Error('Could not reach the server', { cause: networkError });
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch versions');
      }
      return response.json();
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
      let response;
      try {
        response = await fetch(`/api/v1/dataset-versions/${version_uuid}`, {
          signal
        });
      } catch (networkError) {
        throw new Error('Could not reach the server', { cause: networkError });
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch version details');
      }
      return response.json();
    },
    enabled: !!version_uuid,
  });

  return {
    versionDetails,
    isLoading,
    error
  };
};
