import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import {useAuth} from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const usePipelines = (versionId) => {
    const { data: pipelines, isLoading, error } = useQuery({
    queryKey: ['pipelines', versionId], 
    queryFn: async ({signal}) => {
        let response;
            try {
                response = await fetch(`/api/v1/dataset-versions/${versionId}/pipelines`, {
                    signal
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', {cause: networkError});
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch pipelines');
            }
            return response.json();
            
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
            let response;
            try {
                response = await fetch(`/api/v1/pipelines/${pipeline_uuid}`, {
                    signal
                });
             } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch pipeline details');
            }
            return response.json();
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
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();
    const {mutate: createPipeline, isPending, error} = useMutation({
        mutationKey: ['create-pipeline', version_uuid],
        mutationFn: async (payload) => {
            let response;
            try {
                response = await fetch(`/api/v1/dataset-versions/${version_uuid}/pipelines`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(payload)
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to create pipeline');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pipelines', version_uuid] });
        }
    });

    return {
        createPipeline,
        isPending,
        error
    };
}

export const usePipelinePreview = (version_uuid) => {
    const { accessToken } = useAuth();
    const {mutate: previewPipeline, isPending, error} = useMutation({
        mutationKey: ['preview-pipeline', version_uuid],
        mutationFn: async (payload) => {
            let response;
            try {
                response = await fetch(`/api/v1/dataset-versions/${version_uuid}/pipelines/preview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(payload)
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to preview pipeline');
            }
            return response.json();
        }
    });

    return {
        previewPipeline,
        isPending,
        error
    };
}
