import {useQuery} from '@tanstack/react-query';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'react-toastify';
import {useAuth} from '../contexts/AuthContext';

export const useDatasets = () => {
    const {data: datasets, isLoading, error} = useQuery({
        queryKey: ['datasets'],
        queryFn: async ({signal}) => {
            let response;
            try {
                response = await fetch(`/api/v1/datasets`, {
                    signal
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', {cause: networkError});
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch datasets');
            }
            return response.json();   
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
    const {accessToken} = useAuth();
    const {mutate: newDataset, isPending, error} = useMutation({
        mutationKey: ['create-dataset'],
        mutationFn: async (newDataset) => {
            let response;
            try {
                response = await fetch(`/api/v1/datasets`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(newDataset)
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', {cause: networkError});
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to create dataset');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['datasets']});
        },
        onError: (error) => {
            console.error('Error creating dataset:', error);
            toast.error(error.message || 'Failed to create dataset');
        }
    });
    return {newDataset, isPending, error};
}

export const useDatasetDetails = (dataset_uuid) => {
    const {data: datasetDetails, isLoading, error} = useQuery({
        queryKey: ['dataset-details', dataset_uuid],
        queryFn: async ({signal}) => {
            let response;
            try {
                response = await fetch(`/api/v1/datasets/${dataset_uuid}`, {
                    signal
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', {cause: networkError});
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch dataset details');
            }
            return response.json();
        }
    });
    return { datasetDetails, isLoading, error };
};


export const useCreateDatasetVersion = (dataset_uuid) => {
    const queryClient = useQueryClient();
    const {accessToken} = useAuth();
    const {mutate: newVersion, isPending, error} = useMutation({
        mutationKey: ['create-dataset-version', dataset_uuid],
        mutationFn: async (newDatasetVersion) => {
            let response;
            try {
                response = await fetch(`/api/v1/datasets/${dataset_uuid}/versions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(newDatasetVersion)
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', {cause: networkError});
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to create dataset version');
                }
            return response.json();
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

export const useVersionParse = (dataset_uuid) => {
    const { accessToken } = useAuth();
    const {mutate: parseVersion, isPending, error} = useMutation({
        mutationKey: ['parse-dataset-version', dataset_uuid],
        mutationFn: async (versionData) => {
            let response;
            try {
                response = await fetch(`/api/v1/datasets/${dataset_uuid}/versions/preview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(versionData)
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', {cause: networkError});
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to parse dataset version');
            }
            return response.json();
        }
    });
    return {parseVersion, isPending, error};
}
