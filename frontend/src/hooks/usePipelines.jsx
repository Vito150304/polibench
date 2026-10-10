import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export const usePipelines = (versionId) => {
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

export const usePipelineDetails = (pipeline_uuid) => {
    const { data: pipelineDetails, isLoading, error } = useQuery({
        queryKey: ['pipelineDetails', pipeline_uuid],
        queryFn: async ({ signal }) => {
            try {
                const response = await fetch(`/api/v1/pipelines/${pipeline_uuid}`, {
                    signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch pipeline details');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during pipeline details fetch:", networkError);
                throw new Error('Failed to fetch pipeline details', { cause: networkError });
            }
        },
        enabled: !!pipeline_uuid,
    });

    return {
        pipelineDetails,
        isLoading,
        error
    };
}

export const useCreatePipeline = (version_uuid) => {
    const {mutate: createPipeline, isPending, error} = useMutation({
        mutationKey: ['create-pipeline', version_uuid],
        mutationFn: async (payload) => {
            try {
                const response = await fetch(`/api/v1/datasets-versions/${version_uuid}/pipelines`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to create pipeline');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during pipeline creation:", networkError);
                throw new Error('Failed to create pipeline', { cause: networkError });
            }
        }
    });

    return {
        createPipeline,
        isPending,
        error
    };
}

export const usePipelinePreview = (version_uuid) => {
    const {mutate: previewPipeline, isPending, error} = useMutation({
        mutationKey: ['preview-pipeline', version_uuid],
        mutationFn: async (payload) => {
            try {
                const response = await fetch(`/api/v1/datasets-versions/${version_uuid}/pipelines/preview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to preview pipeline');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during pipeline preview:", networkError);
                throw new Error('Failed to preview pipeline', { cause: networkError });
            }
        }
    });

    return {
        previewPipeline,
        isPending,
        error
    };
}
