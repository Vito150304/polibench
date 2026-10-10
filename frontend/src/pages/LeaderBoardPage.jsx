import SmoothLineChart from '../components/charts/SmoothLineChart';
import BarChartComponent from '../components/charts/BarChart';
import RadarChartComponent from '../components/charts/RadarChart';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilterMenu from '../components/FilterMenu';
import {useDatasets} from '../hooks/useDatasets';
import useVersions from '../hooks/useVersions';
import usePipelines from '../hooks/usePipelines';


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

    const navigate = useNavigate();


    const {datasets} = useDatasets();
    const {versions} = useVersions(datasetId);
    const {pipelines} = usePipelines(versionId);

    return (
        <>
        <h1>Leader Board </h1>

        <div className = "change-chart">
            <button onClick={() => setChart('barChart')}>Bar Chart</button>
            <button onClick={() => setChart('radarChart')}>Radar Chart</button>
            <button onClick={() => setChart('lineChart')}>Smooth Line Chart</button>
        </div>


        
        <div className="navigation">
            <label>Dataset ID: </label>
            <select value={datasetId} onChange={(e) => navigate(`/leaderboard/${e.target.value}/${versionId}/${pipelineId}`)}>
                {datasets?.map((dataset) => (
                    <option key = {dataset.uuid} value = {dataset.uuid}>{dataset.name}</option>
                ))}
            </select>

            <label>Version ID: </label>
            <select value={versionId} onChange={(e) => navigate(`/leaderboard/${datasetId}/${e.target.value}/${pipelineId}`)}>
                {versions?.map((version) => (
                    <option key = {version.uuid} value = {version.uuid}>{version.name}</option>
                ))}
            </select>

            <label>Pipeline ID: </label>
            <select value={pipelineId} onChange={(e) => navigate(`/leaderboard/${datasetId}/${versionId}/${e.target.value}`)}>
                {pipelines?.map((pipeline) => (
                    <option key = {pipeline.uuid} value = {pipeline.uuid}>{pipeline.name}</option>
                ))}
            </select>
        </div>

        <section className="filters">
            <FilterMenu filters={filters} setFilters={setFilters} />
        </section>

            
        <section className="charts-container">

            {chart === 'barChart' && <BarChartComponent filters={filters} datasetId={datasetId} />}
            {chart === 'radarChart' && <RadarChartComponent filters={filters} datasetId={datasetId} />}
            {chart === 'lineChart' && <SmoothLineChart filters={filters} datasetId={datasetId} versionId={versionId} pipelineId={pipelineId} />}

        </section>
        </>
    );
}
export default LeaderBoardPage;