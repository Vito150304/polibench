import { useQuery } from '@tanstack/react-query';

function useMetrics(experiment_uuid) {
    const {data: metrics, isLoading, error} = useQuery({
        queryKey: ['metrics', experiment_uuid],
        queryFn: async ({signal}) => {
            try {
                const response = await fetch(`/api/v1/experiments/${experiment_uuid}/metrics`, {
                    signal
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch metrics');
                }
                return await response.json();
            } catch (networkError) {
                console.error('Error fetching metrics:', networkError);
                throw new Error('Failed to fetch metrics', { cause: networkError });
            }
        }, 
        enabled: !!experiment_uuid,
    });

    return { metrics, isLoading, error };
}
export default useMetrics;