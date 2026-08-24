import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, PolarRadiusAxis} from 'recharts';
import useMultiLeaderboard from '../../hooks/useMultiLeaderboard';

function RadarChartComponent() {
    const { data, isLoading, error } = useMultiLeaderboard({
        dataset_uuid: "test-uuid-123",
        metric: "NDCG",
        split: "test",
        sort_by: "asc"
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <RadarChart responsive data={data} style={{ width: '100%', aspectRatio: '16/9' }}>
            <PolarGrid /> {/*penso sia l'equivalente di CartesianGrid */}
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 450]} />
            <Radar dataKey="uv"  stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} /> 
            <Legend />
        </RadarChart>
    )
}
export default RadarChartComponent;