import useVersionDetails from '../hooks/useVersionDetails';
import {useParams, useNavigate} from 'react-router-dom';
import usePipelines from '../hooks/usePipelines';
import useState from 'react';
import usePipelineDetails from '../hooks/usePipelineDetails';


function VersionDetailPage() {
    const {version_uuid} = useParams();
    const {versionDetails, isLoading, error} = useVersionDetails(version_uuid);
    const {pipelines, isLoading: pipelinesLoading, error: pipelinesError} = usePipelines(version_uuid);
    const [selectedPipelineUuid, setSelectedPipelineUuid] = useState(null);
    const {pipelineDetails, isLoading: pipelineDetailsLoading, error: pipelineDetailsError} = usePipelineDetails(selectedPipelineUuid);

    const navigate = useNavigate();

    if (isLoading || pipelinesLoading) {
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
    </>
    );
}
export default VersionDetailPage;