import {useDatasets} from "../hooks/useDatasets";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import styles from "../styles/DatasetPage.module.css";
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
            <h1 className={styles.title}>DATASETS</h1>
            <div className={styles.container}>
                {datasets.length === 0 ? (
                    <EmptyState
                        title="No Datasets Found"
                        description="There are no datasets registered."
                        action="Register a new Dataset"
                        route="/register-dataset"
                    />
                ) : (
                    <ul className={styles.list}>
                        {datasets.map((dataset) => (
                            <li key={dataset.uuid} onClick = {() => navigate(`/datasets/${dataset.uuid}`)}> 
                                <p><strong className={styles.bold}>Name:</strong> {dataset.name}</p>
                                <p><strong className={styles.bold}>Task:</strong> {dataset.task}</p>
                                <p><strong className={styles.bold}>Visibility:</strong> {dataset.visibility}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {datasets.length > 0 && (
                <div className={styles.register}>
                    <button onClick={() => navigate("/register-dataset")}>Register a new Dataset</button>
                </div>
            )}
    </>
    );
}
export default DatasetPage;