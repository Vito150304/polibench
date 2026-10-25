import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import useBestConfiguration from '../../hooks/useBestConfiguration';
import {useEffect} from 'react';
import BestPerModelTooltip from './BestPerModelTooltip';

function BestPerModelChart({ datasetId, versionId, pipelineId, filters }) {
    const { mutate, data: chartData, isPending } = useBestConfiguration();

    useEffect(() => {
    if (datasetId && versionId && pipelineId) {
        mutate({
            dataset_uuid: datasetId,
            dataset_version_uuid: versionId,
            pipeline_uuid: pipelineId,
            split: filters.split,
            target_metric: filters.metric,
            direction: filters.direction,       
        });
    }
}, [mutate, datasetId, versionId, pipelineId, filters]);

const punti = chartData?.groups?.map((item) => ({
    ...item,
    value: item.best_value,
}));

if (!versionId || !pipelineId) return <div>Select a version and a pipeline to see this chart.</div>;
if (isPending) return <div>Loading chart data...</div>;
if (!chartData?.groups?.length) return <p>No results for these filters. Possible reasons: the dataset has no experiments yet, 
      or its experiments have no "{filters.metric}" values in the "{filters.split}" split.</p>;

return (
    <BarChart responsive data={punti} style={{ width: '100%', aspectRatio: '2 / 1', maxHeight: '85vh' }}>
        <CartesianGrid strokeDasharray="5 5" />
        <Bar dataKey="value" fill="#8884d8" maxBarSize={350} />
        <XAxis dataKey="model_name" />
        <YAxis domain={[0, 'auto']} label={{ value: 'Score', position: 'insideLeft', angle: -90 }} />
        <Tooltip content={<BestPerModelTooltip />} cursor={{ fill: 'rgba(128,128,128,0.15)' }} />
    </BarChart>
)
}
export default BestPerModelChart;