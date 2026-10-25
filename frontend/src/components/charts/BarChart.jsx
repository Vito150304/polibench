import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BarTooltip from './BarTooltip';
import useLeaderboard from '../../hooks/useLeaderboard';


function BarChartComponent({filters, datasetId, versionId, pipelineId}) {


  const { leaderboard: data, isLoading, error } = useLeaderboard({ 
    dataset_uuid: datasetId, 
    dataset_version_uuid: versionId,
    pipeline_uuid: pipelineId,
    metric: filters.metric,
    split: filters.split
});

  if (data && data.length === 0) {
    return <p>No results for these filters. Possible reasons: the dataset has no experiments yet, 
      or its experiments have no "{filters.metric}" values in the "{filters.split}" split.</p>;
  }

  const chartData = data?.map((d) => ({ ...d, label: `#${d.rank} ${d.model_name}` }));

return (
  <>
    {isLoading && <div>Loading leaderboard...</div>}
    {error && <div>Error loading leaderboard: {error.message}</div>}
    {data && (
      <BarChart responsive data={chartData} style={{ width: '100%', aspectRatio: '2 / 1', maxHeight: '85vh' }}>
        <CartesianGrid strokeDasharray="5 5" />
        <Bar dataKey="value" fill="#8884d8" maxBarSize={350} />
        <XAxis dataKey="label" />
        <YAxis />
        <Legend />
        <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(128,128,128,0.15)' }} />
    </BarChart>)}
  </>
)
}

export default BarChartComponent;