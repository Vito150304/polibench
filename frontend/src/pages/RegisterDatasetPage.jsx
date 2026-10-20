import { useCreateDataset } from "../hooks/useDatasets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {toast} from 'react-toastify';
import styles from "../styles/RegisterDatasetPage.module.css";

function RegisterDatasetPage() {
    const {newDataset, isPending} = useCreateDataset();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [task, setTask] = useState('ranking');
    const [visibility, setVisibility] = useState('private');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: name, 
            task: task, 
            visibility: visibility, 
        };
        if (description) {
            payload.description = description;
        }
        newDataset(payload, {
            onSuccess: () => {
                toast.success('Dataset Registered');
                navigate("/datasets");
            }
        });
    }

    return (
        <>
            <h1>Register a new Dataset</h1>
            <div className={styles.page}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputContainer}>
                <label>
                    Name:*
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Task:*
                    <select value={task} onChange={(e) => setTask(e.target.value)} required>
                        <option value="ranking">Ranking</option>
                        <option value="rating_prediction">Rating Prediction</option>
                        <option value="ctr">CTR (Click-Through Rate)</option>
                    </select>
                </label>
                <label>
                    Visibility:
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <div className={styles.button}>
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create Dataset'}
                </button>
                </div>
                </div>
            </form>
            <div className={styles.navigation}>
                <button onClick={() => navigate("/datasets")}>View Datasets</button>
            </div>
            </div>
            <p className={styles.required}>*: Required fields</p>
        </>
    )
}
export default RegisterDatasetPage;