import {useDatasets} from "../hooks/useDatasets";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import styles from "../styles/DatasetPage.module.css";
import { useState } from "react";


function DatasetPage() {

    const {datasets, isLoading, error} = useDatasets();
    const [searchDataset, setSearchDataset] = useState(''); //barra di ricerca
    const navigate = useNavigate();


    if (isLoading) {
        return <div>Loading datasets...</div>;
    }
    if (error) {
        return <div>Error loading datasets: {error.message}</div>;
    }

    const datasetFiltrati = (datasets ?? []).filter((dataset) =>
    dataset.name.toLowerCase().includes(searchDataset.toLowerCase()));

    return (
        <>
            <h1 className={styles.title}>DATASETS</h1>
            <div className={styles.upperSection}>
                <div className={styles.search}>
                    <input
                        value={searchDataset}
                        onChange={(e) => setSearchDataset(e.target.value)}
                        placeholder="Search for a dataset name"
                    />
                </div>
                {(datasets ?? []).length > 0 && (
                    <div className={styles.register}>
                        <button onClick={() => navigate("/register-dataset")}>Register a new Dataset</button>
                    </div>
                )}
            </div>
            <div className={styles.container}>
                {datasetFiltrati.length === 0 ? (
                    <EmptyState
                    title="No Datasets Found"
                    description={searchDataset ? "There are no datasets matching your search." : "There are no datasets registered."}
                    action={searchDataset ? undefined : "Register a new Dataset"}
                    route={searchDataset ? undefined : "/register-dataset"}
                />
                ) : (
                    <>
                        <span className={styles.info}>Click on a dataset to view its details</span>
                        <ul className={styles.list}>
                            {datasetFiltrati.map((dataset) => (
                                <li key={dataset.uuid} onClick = {() => navigate(`/datasets/${dataset.uuid}`)}> 
                                    <div className={styles.infoDataset}>
                                        <p className={styles.name}>{dataset.name}</p>
                                        <div className={styles.description}>
                                            <p> {dataset.visibility}</p>
                                            <p> {dataset.task}</p>
                                        </div>
                                    </div>
                                    {dataset.versions_count === 0 ? (
                                        <p className={styles.countVersion}> There are no versions</p>
                                    ) : ( 
                                        <p className={styles.countVersion}>
                                            {dataset.versions_count} {dataset.versions_count === 1 ? 'version' : 'versions'} </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
    </>
    );
}
export default DatasetPage;