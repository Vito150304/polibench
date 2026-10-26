import {useQuery} from '@tanstack/react-query';

function useModels() {
    //GET

    const {data: models, isLoading, error} = useQuery({
        queryKey: ['models'],
        queryFn: async ({signal}) => {
            let response;
            try {
                response = await fetch(`/api/v1/ml-models`, {
                    signal
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch models');
            }
            return await response.json();
        },
        staleTime: 5 * 60 * 1000, 
        gcTime: 10 * 60 * 1000, 
        refetchOnWindowFocus: false,
        retry: 1, 
    });

    return { models, isLoading, error };
}

export default useModels;