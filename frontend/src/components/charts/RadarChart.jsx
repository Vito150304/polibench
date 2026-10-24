import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, PolarRadiusAxis, Tooltip} from 'recharts';
import useMultiLeaderboard from '../../hooks/useMultiLeaderboard';
import RadarTooltip from './RadarTooltip';

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function RadarChartComponent({ filters, datasetId, versionId, pipelineId }) {
    const { multiLeaderboard: data, isLoading, error } = useMultiLeaderboard({
        dataset_uuid: datasetId,
        dataset_version_uuid: versionId,
        pipeline_uuid: pipelineId,
        metrics: filters.multiMetrics,
        split: filters.split,
        sort_by: filters.metric,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data || data.length === 0) {
        return <p>No results for these filters. Possible reasons: the dataset has no experiments yet, 
      or its experiments have no "{filters.metric}" values in the "{filters.split}" split.</p>;
    }

    const label = (m) => `${m.model_name} · ${m.pipeline_code} · #${m.rank}`;

    // 1) prima costruisco radarData...
    const radarData = filters.multiMetrics.map((metric) => {
        const vertice = { metrica: metric };
        data.forEach((modello) => {
            vertice[label(modello)] = modello.metrics?.[metric];
        });
        return vertice;
    });

    // 2) ...poi lo uso per trovare il valore più alto
    const maxValue = Math.max(
        ...radarData.flatMap((r) =>
            Object.entries(r)
                .filter(([k]) => k !== 'metrica')
                .map(([, v]) => v ?? 0)
        )
    ) || 1;
    const radiusMax = Math.ceil(maxValue * 20) / 20;   // arrotonda a multipli di 0.05

    return (
        <RadarChart responsive data={radarData} style={{ width: '100%', aspectRatio: '16/9' }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metrica" />
            <PolarRadiusAxis angle={30} domain={[0, radiusMax]} />
            {data.map((modello, index) => (
                <Radar key={modello.experiment_uuid} name={label(modello)} dataKey={label(modello)}
                       stroke={colors[index % colors.length]} fill={colors[index % colors.length]} fillOpacity={0.3} />
            ))}
            <Legend />
            <Tooltip content={<RadarTooltip />} />
        </RadarChart>
    )
}
export default RadarChartComponent;