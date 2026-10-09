import {useQuery} from '@tanstack/react-query';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useDatasets = () => {
    const {data: datasets, isLoading, error} = useQuery({
        queryKey: ['datasets'],
        queryFn: async ({signal}) => {
            try {
                const response = await fetch(`/api/v1/datasets`, {
                    signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch datasets');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during datasets fetch:", networkError);
                throw new Error('Failed to fetch datasets', {cause: networkError});
            }
        },
        staleTime: 5 * 60 * 1000, 
        gcTime: 10 * 60 * 1000, 
        refetchOnWindowFocus: false,
        retry: 1, // riprova una volta in caso di errore
    });
    return { datasets, isLoading, error };
};

export const useCreateDataset = () => {
    const queryClient = useQueryClient();
    const {mutate: newDataset, isPending, error} = useMutation({
        mutationKey: ['create-dataset'],
        mutationFn: async (newDataset) => {
            try {
                const response = await fetch(`/api/v1/datasets`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newDataset)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to create dataset');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during dataset creation:", networkError);
                throw new Error('Failed to create dataset', {cause: networkError});
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['datasets']});
        },
        onError: (error) => {
            console.error('Error creating dataset:', error);
        }
    });
    return {newDataset, isPending, error};
}

export const useDatasetDetails = (dataset_uuid) => {
    const {data: datasetDetails, isLoading, error} = useQuery({
        queryKey: ['dataset-details', dataset_uuid],
        queryFn: async ({signal}) => {
            try {
                const response = await fetch(`/api/v1/datasets/${dataset_uuid}`, {
                    signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch dataset details');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during dataset details fetch:", networkError);
                throw new Error('Failed to fetch dataset details', {cause: networkError});
            }
        }
    });
    return { datasetDetails, isLoading, error };
}

export const useVersions = (dataset_uuid) => {
    const {data: versions, isLoading, error} = useQuery({
        queryKey: ['versions', dataset_uuid],
        queryFn: async ({signal}) => {
            try {
                const response = await fetch(`/api/v1/datasets/${dataset_uuid}/versions`, {
                    signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch dataset versions');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during dataset versions fetch:", networkError);
                throw new Error('Failed to fetch dataset versions', {cause: networkError});
            }
        }
    });
    return { versions, isLoading, error };
}


export const useCreateDatasetVersion = (dataset_uuid) => {
    const queryClient = useQueryClient();
    const {mutate: newVersion, isPending, error} = useMutation({
        mutationKey: ['create-dataset-version', dataset_uuid],
        mutationFn: async (newDatasetVersion) => {
            try {
                const response = await fetch(`/api/v1/datasets/${dataset_uuid}/versions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newDatasetVersion)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to create dataset version');
                }
                return response.json();
            } catch (networkError) {
                console.error("Network error during dataset version creation:", networkError);
                throw new Error('Failed to create dataset version', {cause: networkError});
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['versions', dataset_uuid]});
        },
        onError: (error) => {
            console.error('Error creating dataset version:', error);
        }
    });
    return {newVersion, isPending, error};
}