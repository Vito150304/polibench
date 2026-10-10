import { useParams } from "react-router-dom";
import {useDatasetDetails} from "../hooks/useDatasetDetails";
import {useVersions} from "../hooks/useVersions";
import { useNavigate } from "react-router-dom";

function DatasetDetailPage() {

    const {dataset_uuid} = useParams();
    const {datasetDetails, isLoading, error} = useDatasetDetails(dataset_uuid);
    const {versions, isLoading: versionsLoading, error: versionsError} = useVersions(dataset_uuid);
    const navigate = useNavigate();


    const handleDownloadYaml = async (version_uuid, kind) => {
        try {
            // Usa l'endpoint corretto per il download raw
            const response = await fetch(`/api/v1/dataset-versions/${version_uuid}/yaml/${kind}/raw`);
            if (!response.ok) throw new Error(`Failed to download ${kind} YAML`);

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${datasetDetails.name || 'dataset'}_${kind}.yaml`; // Nome dinamico
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (downloadErr) {
            console.error("Download fallito:", downloadErr);
            alert(`Errore durante il download del file ${kind}.`);
        }
    };

    if (isLoading) {
        return <div>Loading dataset details...</div>;
    }
    if (error) {
        return <div>Error loading dataset details: {error.message}</div>;
    }

    if (versionsLoading) {
        return <div>Loading dataset versions...</div>;
    }
    if (versionsError) {
        return <div>Error loading dataset versions: {versionsError.message}</div>;
    }


    return (
        <>
            <h3>Dataset Metadata</h3>
            <div className="DatasetDetails-container">
                <p>Task: {datasetDetails.task}</p>
                <p>Created: {datasetDetails.created_at}</p>
                <p>Latest Version: {datasetDetails.latest_version}</p>
            </div>
            <div className="Version-Registry">
                <h3>Version Registry</h3>
                {versions.length === 0 ? (
                    <p>No versions available for this dataset.</p>
                ) : (
                    <ul>
                        {versions.map(version => (
                            <li key={version.uuid}>
                                <p>Version: {version.version}</p>
                                <p>Created: {version.created_at}</p>
                                <p>Status: {version.status}</p> {/*ex: draft*/}
                                <p>Density: {version.density}</p> {/*sarebbe?*/}

                                <div className="version-actions">
                                    <button type="button" onClick={() => navigate(`/dataset-versions/${version.uuid}`)}>
                                        View Version Details
                                    </button>

                                    <button type="button" onClick={() => handleDownloadYaml(version.uuid, 'dataset')}>
                                        Dataset YAML
                                    </button>
                                    <button type="button" onClick={() => handleDownloadYaml(version.uuid, 'version')}>
                                        Version YAML
                                    </button>
                                    <button type="button" onClick={() => handleDownloadYaml(version.uuid, 'metrics')}>
                                        Metrics YAML
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="version-buttons">
                <button type="button" onClick={() => navigate(`/datasets/${dataset_uuid}/create-version`)}>Create New Version</button> {/* Aggiungi qui il pulsante per creare una nuova versione */}
                <button type="button" onClick={() => navigate(`/datasets`)}>Go Back</button> {/*Controllare che l'endpoint con la lista di tutti i datasets sia corretto*/}
            </div>
        </>
    );

}
export default DatasetDetailPage;