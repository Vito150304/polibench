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
            let response;
            try {
                response = await fetch(`/api/v1/experiments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(experimentData),
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to create experiment');
                }
                return await response.json();
        }, //data è la risposta del backend, variables è il payload che ho mandato al backend
        onSuccess: (data, variables) => {
            //se la versione è nel payload, invalido la query delle versioni di quell'esperimento, altrimenti invalido la query di tutti gli esperimenti
            if (variables.dataset_version_uuid) {
                queryClient.invalidateQueries({ queryKey: ['experiment-versions', variables.dataset_version_uuid] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['experiments'] });
            }
        }
    });
    return { createExperiment, isCreating, createError };
};

export const useExperimentVersions = (version_uuid) => {
    const {data: experimentList, isLoading, error} = useQuery({
        queryKey: ['experiment-versions', version_uuid],
        queryFn: async () => {
            let response;
            try {
                response = await fetch(`/api/v1/dataset-versions/${version_uuid}/experiments`);
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch experiment versions');
            }
            return await response.json();
        },
        enabled: !!version_uuid,
    });
    return { experimentList, isLoading, error };
};


export const useExperimentDetails = (experiment_uuid) => {
    const { accessToken } = useAuth();
    const { data: experimentDetails, isLoading: isLoadingExperimentDetails, error: experimentDetailsError } = useQuery({
        queryKey: ['experiment-details', experiment_uuid],
        queryFn: async () => {
            let response;
            try {
                response = await fetch(`/api/v1/experiments/${experiment_uuid}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch experiment details');
            }
            return await response.json();
        },
        enabled: !!experiment_uuid,
    });
    return { experimentDetails, isLoadingExperimentDetails, experimentDetailsError };
};
