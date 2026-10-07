import {useQuery} from '@tanstack/react-query';

function useModels() {
    //GET

    const {data: models, isLoading, error} = useQuery({
        queryKey: ['models'],
        queryFn: async ({signal}) => {
            try {
                const response = await fetch(`/api/v1/ml-models`, {
                    signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch models');
                }
                return await response.json();
            } catch (networkError) {
                console.error('Error fetching models:', networkError);
                throw new Error('Failed to fetch models', { cause: networkError });
            }
        },
        staleTime: 5 * 60 * 1000, 
        cacheTime: 10 * 60 * 1000, 
        refetchOnWindowFocus: false,
        retry: 1, 
    });

    return { models, isLoading, error };
}

export default useModels;


