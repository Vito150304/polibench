import {useVersionDetails} from '../hooks/useVersions';
import {useParams, useNavigate} from 'react-router-dom';
import {usePipelines} from '../hooks/usePipelines';
import {useState} from 'react';
import {usePipelineDetails} from '../hooks/usePipelines';
import {useExperimentDetails} from '../hooks/useExperiment';
import {useExperimentVersions} from '../hooks/useExperiment';
import useMetrics from '../hooks/useMetrics';
import EmptyState from '../components/EmptyState';
import {formatDate, formatUuid} from "../utils/formatters";
import styles from "../styles/VersionDetailPage.module.css";


function VersionDetailPage() {
    const {version_uuid} = useParams();
    const {versionDetails, isLoading, error} = useVersionDetails(version_uuid);
    const {pipelines, isLoading: pipelinesLoading, error: pipelinesError} = usePipelines(version_uuid);
    const [selectedPipelineUuid, setSelectedPipelineUuid] = useState(null);
    const {pipelineDetails, isLoading: pipelineDetailsLoading, error: pipelineDetailsError} = usePipelineDetails(selectedPipelineUuid);


    //experiment list

    const {experimentList, isLoading: experimentListLoading, error: experimentListError} = useExperimentVersions(version_uuid);
    const [selectedExperimentUuid, setSelectedExperimentUuid] = useState(null);
    const {experimentDetails, isLoading: experimentDetailsLoading, error: experimentDetailsError} = useExperimentDetails(selectedExperimentUuid);

    //metrics

    const {metrics, isLoading: metricsLoading, error: metricsError} = useMetrics(selectedExperimentUuid);
    const metricsList = Object.values(metrics?.metrics_by_split ?? {}).flat();

    const navigate = useNavigate();



    if (isLoading || pipelinesLoading || experimentListLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error fetching version details</div>;
    }
    if (pipelinesError) {
        return <div>Error fetching pipelines</div>;
    }
    if (pipelineDetailsError) {
        return <div>Error fetching pipeline details</div>;
    }
    if (experimentListError) {
        return <div>Error fetching experiment list</div>;
    }
    return (
        <>
            <div className={styles.detailsContainer}>
                <p><span>Version</span> {versionDetails.version}</p>
                <p><span>Status:</span> {versionDetails.status}</p>
                {versionDetails.release_notes && <p><span>Release Notes:</span> {versionDetails.release_notes}</p>}
            </div>
            <div className={styles.pipelineRegistry}>
                <h3>Pipeline Registry</h3>
                {pipelines.length > 0 && (
                    <button className={styles.pipelineButton} type="button" onClick={() => navigate(`/dataset-versions/${version_uuid}/create-pipeline`)}>Create New Pipeline</button> 
                )}
                {pipelines.length === 0 ? (
                    <EmptyState
                        title="No Pipelines Found"
                        description="There are no pipelines registered for this version."
                        action="Create a New Pipeline"
                        route={`/dataset-versions/${version_uuid}/create-pipeline`}
                    />
                ) : (
                    <ul>
                        {pipelines.map(pipeline => (
                            <li key={pipeline.uuid}>
                                <p><span>Pipeline Id:</span> {formatUuid(pipeline?.uuid)}</p>
                                <p><span>Created:</span> {formatDate(pipeline?.created_at)}</p>
                                <p><span>Status:</span> {pipeline.status}</p> 
                                <p><span>Pipeline steps count:</span> {pipeline.steps_count}</p> 
                                <button className={styles.pipelineDetails} type="button" onClick={() => setSelectedPipelineUuid(pipeline.uuid)}>
                                    View Pipeline Details
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedPipelineUuid && (
                <div className={styles.pipelinePreview}>
                    <h2>Pipeline Details</h2>
                    {pipelineDetailsLoading ? (
                        <p>Loading pipeline details...</p>
                    ) : pipelineDetailsError ? (
                    <p>Error loading pipeline details</p>
                ) : (
                <>
                    <p><span>Pipeline Id:</span> {pipelineDetails?.uuid}</p>
                    <p><span>Created:</span> {formatDate(pipelineDetails?.created_at)}</p>
                    <p><span>Status:</span> {pipelineDetails.status}</p>
                    {pipelineDetails?.blocks?.length > 0 ? ( 
                        <>
                            <p><span>Pipeline name:</span> {pipelineDetails.blocks[0].name}</p>
                            <p><span>Pipeline operation:</span> {pipelineDetails.blocks[0].operation}</p>
                            <p><span>Pipeline hyperparameters:</span> {JSON.stringify(pipelineDetails.blocks[0].params)}</p>
                        </>
                        ) : (
                        <p>No pipeline blocks available.</p>
                        )}
                        <button type="button" onClick={() => setSelectedPipelineUuid(null)}>Close Preview</button>
                </>
            )}
            </div>
        )}

{/*Experiment list related to this version*/}
        <div className={styles.experimentList}>
            <h3>Experiment List</h3>
            {experimentList.length === 0 ? (
                <EmptyState
                    title="No Experiments Found"
                    description="There are no experiments registered for this version."
                    action="Register a new Experiment"
                    route={`/experiment`}
                />
            ) : (
                <ul>
                    {experimentList.map(experiment => (
                        <li key={experiment.uuid}>
                            <p><span>Experiment Id:</span> {formatUuid(experiment?.uuid)}</p>
                            <p><span>Created:</span> {formatDate(experiment?.created_at)}</p>
                            <p><span>Status:</span> {experiment.status}</p>
                            <button className={styles.experimentDetails} type="button" onClick={() => setSelectedExperimentUuid(experiment.uuid)}>
                                View Experiment Details
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        {selectedExperimentUuid && (
            <div className={styles.experimentPreview}>
                <h2>Experiment Details</h2>
                {(experimentDetailsLoading || metricsLoading) ? (
                    <p>Loading experiment details...</p>
                ) : (experimentDetailsError || metricsError) ? (
                    <p>Error loading experiment details</p>
                ) : (
                    <>
                        <p><span>Experiment Id:</span> {experimentDetails?.uuid}</p>
                        <p><span>Dataset Id:</span> {experimentDetails?.dataset_uuid}</p>
                        <p><span>Pipeline Id:</span> {experimentDetails?.pipeline_uuid}</p>
                        <p><span>Model name:</span> {experimentDetails?.model_name} </p>
                        <p><span>Created:</span> {formatDate(experimentDetails?.created_at)}</p>
                        <p><span>Status:</span> {experimentDetails?.status}</p>
                        <h2>Metrics</h2>
                        {metricsList.length > 0 ? (
                            <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Metric Name</th>
                                        <th>Value</th>
                                        <th>Split</th>
                                        <th>Direction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metricsList.map((metric) => (
                                        <tr key={metric.uuid}>
                                            <td>
                                                {metric.metric}
                                            </td>
                                            <td>
                                                {metric.value}
                                            </td>
                                            <td>
                                                {metric.split}
                                            </td>
                                            <td>
                                                {metric.direction}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                        ) : (                           
                            <p>No metric available</p>
                        )}
                        <button type="button" onClick={() => setSelectedExperimentUuid(null)}>Close Preview</button>
                    </>
                )}
            </div>
        )}
        <div className={styles.versionButton}>
            <button type="button" onClick={() => navigate(`/datasets`)}>Go Back to Dataset</button>
        </div>
    </>
    );
}
export default VersionDetailPage;
