import useCreateModel from "../hooks/useCreateModels";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import styles from "../styles/RegisterModelPage.module.css";
function RegisterModelPage() {


    const {createModel, isPending} = useCreateModel();
    const [name, setName] = useState('');
    const [family, setFamily] = useState('');
    const [paper, setPaper] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {name: name}; //rendo obbligatorio il nome nella chiamata
        if (family) {
            payload.family = family;
        }
        if (paper) {
        payload.paper = paper;
    }

        createModel(payload, {
            onSuccess: () => {
                toast.success('Model Registered correctly');
                navigate("/models");
            }
        });
    }

    return (
        <>
            <h1>Register a new Model</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name*:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Family:
                    <input
                        type="text"
                        value={family}
                        onChange={(e) => setFamily(e.target.value)}
                    />
                </label>
                <label>
                    Paper:
                    <input
                        type="text"
                        value={paper}
                        onChange={(e) => setPaper(e.target.value)}
                    />
                </label>
                <div className={styles.createButton}>
                    <button type="submit" disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create Model'}
                    </button>
                </div>
            </form>
            <div className={styles.navigation}>
                <button onClick={() => navigate("/models")}>View Models</button>
            </div>
            <p>*: Required fields</p>
        </>
    )
}
export default RegisterModelPage;