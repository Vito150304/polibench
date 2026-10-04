import {useQuery} from '@tanstack/react-query';

function useDatasets() {
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
}
export default useDatasets;