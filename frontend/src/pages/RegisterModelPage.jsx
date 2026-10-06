import useCreateModel from "../hooks/useCreateModel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function RegisterModelPage() {


    const {createModel, isPending, error} = useCreateModel();
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

        createModel(payload);
    }

    return (
        <>
            <h1>Register a new Model</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
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
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create Model'}
                </button>
                {error && <p>Error creating model: {error.message}</p>}
                {!error && !isPending && navigate("/models")} {/*aggiungere la rotta se non l'ho fatto*/}
            </form>
            <button onClick={() => navigate("/models")}>View Models</button>
        </>
    )
}
export default RegisterModelPage;