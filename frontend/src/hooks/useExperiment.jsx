import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

export const useCreateExperiment = () => {
    const {mutate: createExperiment, isLoading: isCreating, error: createError} = useMutation({
        mutationKey: ['create-experiment'],
        mutationFn: async (experimentData) => {
            try {
                const response = await fetch(`/api/v1/experiments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(experimentData),
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to create experiment');
                }
                return await response.json();
            } catch (networkError) {
                console.error('Error creating experiment:', networkError);
                throw new Error('Failed to create experiment', { cause: networkError });
            }
        },
    });
    return { createExperiment, isCreating, createError };
};

export const useExperimentVersions = (version_uuid) => {
    const {data: experimentList, isLoading: isLoadingExperimentList, error: ExperimentListError} = useQuery({
        queryKey: ['experiment-versions', version_uuid],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/v1/dataset-versions/${version_uuid}/experiments`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch experiment versions');
                }
                return await response.json();
            } catch (networkError) {
                console.error('Error fetching experiment versions:', networkError);
                throw new Error('Failed to fetch experiment versions', { cause: networkError });
            }
        },
        enabled: !!version_uuid,
    });
    return { experimentList, isLoadingExperimentList, ExperimentListError };
};
