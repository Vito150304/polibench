import { useParams } from "react-router-dom";
import {useDatasetDetails} from "../hooks/useDatasets";
import {useVersions} from "../hooks/useVersions";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import styles from "../styles/DatasetDetailPage.module.css";

function DatasetDetailPage() {

    const {dataset_uuid} = useParams();
    const {datasetDetails, isLoading, error} = useDatasetDetails(dataset_uuid);
    const {versions, isLoading: versionsLoading, error: versionsError} = useVersions(dataset_uuid);
    const navigate = useNavigate();


    const handleDownloadYaml = async (version_uuid, kind) => {
        try {
            const response = await fetch(`/api/v1/dataset-versions/${version_uuid}/yaml/${kind}/raw`);
            if (!response.ok) throw new Error(`Failed to download ${kind} YAML`);

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${datasetDetails.name || 'dataset'}_${kind}.yaml`; 
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (downloadErr) {
            console.error("Download failed:", downloadErr);
            toast.error(`Error while downloading the file ${kind}.`);
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
            <div className={styles.detailsContainer}>
                <p>Task: {datasetDetails.task}</p>
                {datasetDetails.description && <p>Description: {datasetDetails.description}</p>}
                {datasetDetails.created_at && <p>Created: {datasetDetails.created_at}</p>}
                {datasetDetails.latest_version && <p>Latest Version: {datasetDetails.latest_version}</p>}
            </div>
            <div className={styles.versionRegistry}>
                <h3>Version Registry</h3>
                {versions.length === 0 ? (
                    <p>No versions available for this dataset.</p>
                ) : (
                    <ul>
                        {versions.map(version => (
                            <li key={version.uuid}>
                                <p>Version: {version.version}</p>
                                <p>Created: {version.created_at}</p>
                                <p>Status: {version.status}</p> 
                                <p>Density: {version.density}</p> 

                                <div className={styles.versionActions}>
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
            <div className={styles.navigation}>
                <button type="button" onClick={() => navigate(`/datasets/${dataset_uuid}/create-version`)}>Create New Version</button> 
                <button type="button" onClick={() => navigate(`/datasets`)}>Go Back</button>
            </div>
        </>
    );

}
export default DatasetDetailPage;