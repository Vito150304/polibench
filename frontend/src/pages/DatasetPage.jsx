import {useDatasets} from "../hooks/useDatasets";
import { useNavigate } from "react-router-dom";
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
            <button onClick ={() => navigate("/register-dataset")}>Register a new Dataset</button> {/*aggiungere la rotta e associarla al componente RegisterDatasetPage.jsx*/}
            <div className="Datasets-container">
                {datasets.length === 0 ? (
                    <p>No datasets available.</p>
                ) : (
                    <ul className="Datasets-list">
                        {datasets.map((dataset) => (
                            <li key={dataset.uuid} onClick = {() => navigate(`/datasets/${dataset.uuid}`)}> {/*aggiungere la rotta e associarla al componente DatasetDetailsPage.jsx*/}
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