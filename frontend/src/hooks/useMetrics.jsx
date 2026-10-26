import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

function useMetrics(experiment_uuid) {
    const { accessToken } = useAuth();
    const {data: metrics, isLoading, error} = useQuery({
        queryKey: ['metrics', experiment_uuid],
        queryFn: async ({signal}) => {
            let response;
            try {
                response = await fetch(`/api/v1/experiments/${experiment_uuid}/metrics`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                signal
            });
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch metrics');
            }
            return await response.json();
        }, 
        enabled: !!experiment_uuid,
    });

    return { metrics, isLoading, error };
}
export default useMetrics;