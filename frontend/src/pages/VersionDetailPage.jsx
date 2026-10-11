import useVersionDetails from '../hooks/useVersionDetails';
import {useParams, useNavigate} from 'react-router-dom';
import usePipelines from '../hooks/usePipelines';
import useState from 'react';
import usePipelineDetails from '../hooks/usePipelineDetails';
import useExperimentDetails from '../hooks/useExperimentDetails';
import useExperimentVersions from '../hooks/useExperimentVersions';


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
            <div className="VersionDetails-container">
                <span>Version</span> <p>{versionDetails.version}</p>
                <p>Status: {versionDetails.status}</p>
                <p>Release Notes: {versionDetails.release_notes}</p>
            </div>
            <div className="Pipeline-Registry">
                <h3>Pipeline Registry</h3>
                <button type="button" onClick={() => navigate(`/dataset-versions/${version_uuid}/create-pipeline`)}>Create New Pipeline</button> {/* Aggiungi qui il pulsante per creare una nuova pipeline */}
                {pipelines.length === 0 ? (
                    <p>No pipelines available for this version.</p>
                ) : (
                    <ul>
                        {pipelines.map(pipeline => (
                            <li key={pipeline.uuid}>
                                <p>Pipeline Id: {pipeline.uuid}</p>
                                <p>Created: {pipeline.created_at}</p>
                                <p>Status: {pipeline.status}</p> 
                                <p>Pipeline steps count: {pipeline.steps_count}</p> 
                                <button type="button" onClick={() => setSelectedPipelineUuid(pipeline.uuid)}>
                                    View Pipeline Details
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedPipelineUuid && (
                <div className="pipeline-preview">
                    <h2>Pipeline Details</h2>
                    {pipelineDetailsLoading ? (
                        <p>Loading pipeline details...</p>
                    ) : pipelineDetailsError ? (
                    <p>Error loading pipeline details</p>
                ) : (
                <>
                    <p>Pipeline Id: {pipelineDetails.uuid}</p>
                    <p>Created: {pipelineDetails.created_at}</p>
                    <p>Status: {pipelineDetails.status}</p>
                    {pipelineDetails?.blocks?.length > 0 ? ( 
                        <>
                            <p>Pipeline name: {pipelineDetails.blocks[0].name}</p>
                            <p>Pipeline operation: {pipelineDetails.blocks[0].operation}</p>
                            <p>Pipeline hyperparameters: {JSON.stringify(pipelineDetails.blocks[0].params)}</p>
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
        <div className="Experiment-List">
            <h3>Experiment List</h3>
            {experimentList.length === 0 ? (
                <p>No experiments available for this version.</p>
            ) : (
                <ul>
                    {experimentList.map(experiment => (
                        <li key={experiment.uuid}>
                            <p>Experiment Id: {experiment.uuid}</p>
                            <p>Created: {experiment.created_at}</p>
                            <p>Status: {experiment.status}</p>
                            <button type="button" onClick={() => setSelectedExperimentUuid(experiment.uuid)}>
                                View Experiment Details
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        {selectedExperimentUuid && (
            <div className="experiment-preview">
                <h2>Experiment Details</h2>
                {experimentDetailsLoading ? (
                    <p>Loading experiment details...</p>
                ) : experimentDetailsError ? (
                    <p>Error loading experiment details</p>
                ) : (
                    <>
                        <p>Experiment Id: {experimentDetails.uuid}</p>
                        <p>Dataset Id: {experimentDetails.dataset_uuid}</p>
                        <p>Pipeline Id: {experimentDetails.pipeline_uuid}</p>
                        <p>Model name: {experimentDetails.model_name} </p>
                        <p>Created: {experimentDetails.created_at}</p>
                        <p>Status: {experimentDetails.status}</p>
                        <button type="button" onClick={() => setSelectedExperimentUuid(null)}>Close Preview</button>
                    </>
                )}
            </div>
        )}
        <div className="version-buttons">
            <button type="button" onClick={() => navigate(`/datasets`)}>Go Back to Dataset</button>
        </div>
    </>
    );
}
export default VersionDetailPage;
