import useCreateModel from "../hooks/useCreateModels";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import styles from "../styles/RegisterModelPage.module.css";

function RegisterModelPage() {
    const {createModel, isPending} = useCreateModel();
    const [name, setName] = useState('');
    const [family, setFamily] = useState('');
    const [paper, setPaper] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { name: name.trim() }; 
        if (family.trim()) payload.family = family.trim();
        if (paper.trim()) payload.paper_url = paper.trim();

        createModel(payload, {
            onSuccess: () => {
                toast.success('Model Registered correctly');
                navigate("/models");
            }
        });
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Register a new Model</h1>
            <p className={styles.note}>Fields marked with <span className={styles.star}>*</span> are required.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.field}>
                    <span className={styles.label}>Name <span className={styles.star}>*</span></span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. LightGCN"
                        required
                    />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Family</span>
                    <input
                        type="text"
                        value={family}
                        onChange={(e) => setFamily(e.target.value)}
                        placeholder="e.g. matrix-factorization"
                    />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Paper</span>
                    <input
                        type="url"
                        value={paper}
                        onChange={(e) => setPaper(e.target.value)}
                        placeholder="https://..."
                    />
                </label>

                <div className={styles.actions}>
                    <button type="button" className={styles.secondary} onClick={() => navigate("/models")}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.primary} disabled={isPending || !name.trim()}>
                        {isPending ? 'Creating...' : 'Create Model'}
                    </button>
                </div>
            </form>
        </div>
    )
}
export default RegisterModelPage;