import { useMutation } from '@tanstack/react-query';

function useBestConfiguration() {
    const ChartMutation = useMutation({
        mutationKey: ['best-configuration-leaderboard'],
        mutationFn: async ({dataset_uuid, dataset_version_uuid, pipeline_uuid, split, target_metric, direction}) => {
            try {
                const response = await fetch('/api/v1/leaderboard/best-configuration', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        dataset_uuid: dataset_uuid, 
                        dataset_version_uuid: dataset_version_uuid,   
                        pipeline_uuid: pipeline_uuid,
                        split: split,
                        target_metric: target_metric,
                        direction: direction
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch leaderboard data');
                }
                
                return await response.json();
            } catch(networkError) {
                console.error("Network error:", networkError);
                throw networkError;
            }
        }
    });

    return ChartMutation;
}

export default useBestConfiguration;