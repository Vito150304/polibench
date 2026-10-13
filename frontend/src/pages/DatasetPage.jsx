import {useDatasets} from "../hooks/useDatasets";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
function DatasetPage() {

    const {datasets, isLoading, error} = useDatasets();
    const navigate = useNavigate();

    if (isLoading) {
        return <div>Loading datasets...</div>;
    }
    if (error) {
        return <div>Error loading datasets: {error.message}</div>;
    }

    return (
        <>
            <h1 className="Datasets-title">DATASETS</h1>
            {datasets.length > 0 && (
                <button onClick={() => navigate("/register-dataset")}>Register a new Dataset</button>
            )}
            <div className="Datasets-container">
                {datasets.length === 0 ? (
                    <EmptyState
                        title="No Datasets Found"
                        description="There are no datasets registered."
                        action="Register a new Dataset"
                        route="/register-dataset"
                    />
                ) : (
                    <ul className="Datasets-list">
                        {datasets.map((dataset) => (
                            <li key={dataset.uuid} onClick = {() => navigate(`/datasets/${dataset.uuid}`)}> 
                                <p>Name: {dataset.name}</p>
                                <p>Task: {dataset.task}</p>
                                <p>Visibility: {dataset.visibility}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
    </>
    );
}
export default DatasetPage;