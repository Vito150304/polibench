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
            name: name.trim(),
            task: task,
            visibility: visibility,
        };
        if (description.trim()) {
            payload.description = description.trim();
        }
        newDataset(payload, {
            onSuccess: () => {
                toast.success('Dataset Registered');
                navigate("/datasets");
            }
        });
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Register a new Dataset</h1>
            <p className={styles.note}>Fields marked with <span className={styles.star}>*</span> are required.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.field}>
                    <span className={styles.label}>Name <span className={styles.star}>*</span></span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Task <span className={styles.star}>*</span></span>
                    <select value={task} onChange={(e) => setTask(e.target.value)} required>
                        <option value="ranking">Ranking</option>
                        <option value="rating_prediction">Rating Prediction</option>
                    </select>
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Visibility</span>
                    <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Description</span>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>

                <div className={styles.actions}>
                    <button type="button" className={styles.secondary} onClick={() => navigate("/datasets")}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.primary} disabled={isPending || !name.trim()}>
                        {isPending ? 'Creating...' : 'Create Dataset'}
                    </button>
                </div>
            </form>
        </div>
    )
}
export default RegisterDatasetPage;