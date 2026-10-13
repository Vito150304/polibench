import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const useCreateExperiment = () => {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();
    const {mutate: createExperiment, isPending: isCreating, error: createError} = useMutation({
        mutationKey: ['create-experiment'],
        mutationFn: async (experimentData) => {
            try {
                const response = await fetch(`/api/v1/experiments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
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
        }, //data è la risposta del backend, variables è il payload che ho mandato al backend
        onSuccess: (data, variables) => {
            //se la versione è nel payload, invalido la query delle versioni di quell'esperimento, altrimenti invalido la query di tutti gli esperimenti
            if (variables.version) {
                queryClient.invalidateQueries({ queryKey: ['experiment-versions', variables.version] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['experiments'] });
            }
        }
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


export const useExperimentDetails = (experiment_uuid) => {
    const { accessToken } = useAuth();
    const { data: experimentDetails, isLoading: isLoadingExperimentDetails, error: experimentDetailsError } = useQuery({
        queryKey: ['experiment-details', experiment_uuid],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/v1/experiments/${experiment_uuid}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch experiment details');
                }
                return await response.json();
            } catch (networkError) {
                console.error('Error fetching experiment details:', networkError);
                throw new Error('Failed to fetch experiment details', { cause: networkError });
            }
        },
        enabled: !!experiment_uuid,
    });
    return { experimentDetails, isLoadingExperimentDetails, experimentDetailsError };
};
