import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import useBestConfiguration from '../../hooks/useBestConfiguration';
import {useEffect} from 'react';
import LineTooltip from './LineTooltip';

function SmoothLineChart({ datasetId, versionId, pipelineId, filters }) {
    const { mutate, data: chartData, isPending } = useBestConfiguration();

    useEffect(() => {
        if (datasetId && versionId && pipelineId) {
            mutate({
                dataset_uuid: datasetId, 
                dataset_version_uuid: versionId,
                pipeline_uuid: pipelineId,
                split: filters.split,
                target_metric: filters.metric, 
                direction: 'max', 
                metrics: [filters.metric], // Il backend vuole un array di stringhe qui
                group_by_hyperparams: [] // Parametro richiesto dal backend, per ora vuoto
            });
        }
    }, [mutate, datasetId, versionId, pipelineId, filters]);

    const punti = chartData?.groups?.map((item) => ({
        model_name: item.model_name, //asse x
        value: item.best_value,
    }));

    if (isPending) return <div>Loading chart data...</div>;
    if (!chartData) return <div>No data available</div>;

return (  
    <LineChart responsive data={punti} style={{ width: '100%', aspectRatio: '16/9' }}>
        <CartesianGrid strokeDasharray="5 5" />
        <Line dataKey="value" type="monotone"  />
        <XAxis dataKey="model_name" />
        <YAxis label={{ value: 'Score', position: 'insideLeft', angle: -90 }} />
        <Legend />
        <Tooltip content={<LineTooltip />} />
    </LineChart>
)
}
export default SmoothLineChart;