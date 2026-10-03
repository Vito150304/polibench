import SmoothLineChart from '../components/charts/SmoothLineChart';
import BarChartComponent from '../components/charts/BarChart';
import RadarChartComponent from '../components/charts/RadarChart';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import FilterMenu from '../components/FilterMenu';


function LeaderBoardPage() {

    const [chart, setChart] = useState('barChart');
    const { datasetId, versionId, pipelineId } = useParams();
    const [filters, setFilters] = useState({
        split: 'validation',
        metric: 'NDCG@10', 
        multiMetrics: ['NDCG@10', 'Precision@10', 'Recall@10'], // Per il Radar
        sortBy: 'desc',
        direction: 'max'
    })

    return (
        <>
        <h1>Leader Board </h1>

        <div className = "change-chart">
            <button onClick={() => setChart('barChart')}>Bar Chart</button>
            <button onClick={() => setChart('radarChart')}>Radar Chart</button>
            <button onClick={() => setChart('lineChart')}>Smooth Line Chart</button>
        </div>

        <section className="filters">
            <FilterMenu filters={filters} setFilters={setFilters} />
        </section>

            
        <section className="charts-container">

            {chart === 'barChart' && <BarChartComponent filters={filters} datasetId={datasetId} versionId={versionId} pipelineId={pipelineId} />}
            {chart === 'radarChart' && <RadarChartComponent filters={filters} datasetId={datasetId} versionId={versionId} pipelineId={pipelineId} />}
            {chart === 'lineChart' && <SmoothLineChart filters={filters} datasetId={datasetId} versionId={versionId} pipelineId={pipelineId} />}

        </section>
        </>
    );
}
export default LeaderBoardPage;