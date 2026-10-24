import BestPerModelChart from '../components/charts/BestPerModelChart';
import BarChartComponent from '../components/charts/BarChart';
import RadarChartComponent from '../components/charts/RadarChart';
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilterMenu from '../components/FilterMenu';
import {useDatasets} from '../hooks/useDatasets';
import {useVersions} from '../hooks/useVersions';
import {usePipelines} from '../hooks/usePipelines';
import { metrics_by_task } from '../utils/metrics';


function LeaderBoardPage() {

    const [chart, setChart] = useState('barChart');
    const { datasetId, versionId, pipelineId } = useParams();
    const [filters, setFilters] = useState({
    split: 'test',
    metric: 'ndcg@10',
    multiMetrics: ['ndcg@10', 'recall@20', 'hit@10'],
    direction: 'max'
})

    const navigate = useNavigate();

    // costruisce l'URL saltando i pezzi mancanti: /leaderboard/ds, /leaderboard/ds/ver, ...
    const go = (...parts) => navigate(['/leaderboard', ...parts].filter(Boolean).join('/'));

    const {datasets, isLoading: datasetsLoading, error: datasetsError} = useDatasets();
    const {versions, isLoading: versionsLoading, error: versionsError} = useVersions(datasetId);
    const {pipelines, isLoading: pipelinesLoading, error: pipelinesError} = usePipelines(versionId);

    const task = datasets?.find((d) => d.uuid === datasetId)?.task;
    const metricOptions = metrics_by_task[task] ?? metrics_by_task.ranking;

    // filtri "effettivi": metrica, direzione e metriche del radar dipendono dal tipo di dataset
    const effectiveFilters = useMemo(() => {
        const current = metricOptions.find((m) => m.value === filters.metric) ?? metricOptions[0];
        return {
            ...filters,
            metric: current.value,
            direction: current.direction,
            multiMetrics: metricOptions.map((m) => m.value),
        };
    }, [filters, metricOptions]);

    // messaggio di stato mostrato sotto le select
    let status = null;
    const hasNoVersions = datasetId && !versionsLoading && versions?.length === 0;
    const chartVersionId = pipelineId ? versionId : undefined;
    if (datasetsError) status = 'Could not load the datasets.';
    else if (datasetsLoading) status = 'Loading datasets...';
    else if (versionsError) status = 'Could not load the versions of this dataset.';
    else if (datasetId && versionsLoading) status = 'Loading versions...';
    else if (datasetId && versions?.length === 0) status = 'This dataset has no versions yet: there is nothing to compare.';
    else if (pipelinesError) status = 'Could not load the pipelines of this version.';
    else if (versionId && pipelinesLoading) status = 'Loading pipelines...';
    else if (versionId && !pipelineId && chart !== 'lineChart') status = 'Select a pipeline to filter by version. Until then, the results cover all versions of the dataset.';


    return (
        <>
        <h1>Leader Board </h1>

        <div className = "change-chart">
            <button onClick={() => setChart('barChart')}>Bar Chart</button>
            <button onClick={() => setChart('radarChart')}>Radar Chart</button>
            <button onClick={() => setChart('lineChart')}>Best Per Model Chart</button>
        </div>

        <div className="navigation">
            <label htmlFor="ds">Dataset: </label>
            <select id="ds" value={datasetId ?? ''} onChange={(e) => go(e.target.value)}>
                <option value="">Select a dataset</option>
                {datasets?.map((dataset) => (
                    <option key={dataset.uuid} value={dataset.uuid}>{dataset.name}</option>
                ))}
            </select>

            <label htmlFor="ver">Version: </label>
            <select id="ver" value={versionId ?? ''} disabled={!datasetId}
                    onChange={(e) => go(datasetId, e.target.value)}>
                <option value="">All versions</option>
                {versions?.map((version) => (
                    <option key={version.uuid} value={version.uuid}>{version.version}</option>
                ))}
            </select>

            <label htmlFor="pipe">Pipeline: </label>
            <select id="pipe" value={pipelineId ?? ''} disabled={!versionId}
                    onChange={(e) => go(datasetId, versionId, e.target.value)}>
                <option value="">All pipelines</option>
                {pipelines?.map((pipeline) => (
                    <option key={pipeline.uuid} value={pipeline.uuid}>{pipeline.code}</option>
                ))}
            </select>
        </div>
        {status && <p role="status">{status}</p>}

        <section className="filters">
            <FilterMenu filters={effectiveFilters} setFilters={setFilters} metricOptions={metricOptions} />
        </section>

        <section className="charts-container">
            {!datasetId ? (
                <p>Select a dataset to see the leaderboard.</p>
            ) : hasNoVersions ? null : (
            <>
                {chart === 'barChart' && <BarChartComponent filters={effectiveFilters} datasetId={datasetId} versionId={chartVersionId} pipelineId={pipelineId} />}
                {chart === 'radarChart' && <RadarChartComponent filters={effectiveFilters} datasetId={datasetId} versionId={chartVersionId} pipelineId={pipelineId} />}
                {chart === 'lineChart' && <BestPerModelChart filters={effectiveFilters} datasetId={datasetId} versionId={versionId} pipelineId={pipelineId} />}
            </>
    )}
</section>
        </>
    );
}
export default LeaderBoardPage;