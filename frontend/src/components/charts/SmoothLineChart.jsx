import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import useBestConfiguration from '../../hooks/useBestConfiguration';
import {useEffect} from 'react';

function SmoothLineChart() {
    const {mutate, data: chartData, isPending} = useBestConfiguration();

    useEffect(() => {
      mutate({
        dataset_uuid: "uuid", 
        dataset_version_uuid: "version-uuid",
        pipeline_uuid: "pipeline-uuid",
        split: "test",
        target_metric: "NDCG",
        direction: "max" 
      })
    }, [mutate])

    if (isPending) return <div>Loading chart data...</div>;
    if (!chartData) return <div>No data available</div>;

return ( //modificare i dati e le etichette
    <LineChart responsive data={chartData} style={{ width: '100%', aspectRatio: '16/9' }}>
        <CartesianGrid strokeDasharray="5 5" />
        <Line dataKey="uv" type="monotone" name="Vito"  />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'UV', position: 'insideLeft', angle: -90 }} />
        <Legend />
        <Tooltip />
    </LineChart>
)
}
export default SmoothLineChart;