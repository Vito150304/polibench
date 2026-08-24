import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';
import useLeaderboard from '../../hooks/useLeaderboard';


function BarChartComponent() {

  const { data, isLoading, error } = useLeaderboard({ //dati passati in realtà tramite filtri, anche se dovrò definire dei valori di default 
    dataset_uuid: "test-uuid-123", 
    metric: "NDCG",
    split: "test"
});

return (
  <>
    {isLoading && <div>Loading leaderboard...</div>}
    {error && <div>Error loading leaderboard: {error.message}</div>}
    {data && (
      <BarChart responsive data={data} style={{ width: '100%', aspectRatio: '16/9' }}>
        <CartesianGrid strokeDasharray="5 5" />
        <Bar dataKey="value" fill="#8884d8" />
        <XAxis dataKey="model_name" />
        <YAxis />
        <Legend />
        <Tooltip content={<CustomTooltip />} />
    </BarChart>)}
  </>
)
}

export default BarChartComponent;