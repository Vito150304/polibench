import { useCreateDataset } from "../hooks/useCreateDataset";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterDatasetPage() {
    const {newDataset, isPending, error} = useCreateDataset();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [task, setTask] = useState('');
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
        newDataset(payload);
    }

    return (
        <>
            <h1>Register a new Dataset</h1>
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
                    Task*:
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        required
                    />
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
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create Dataset'}
                </button>
                {error && <p>{error}</p>}
                {!error && !isPending && navigate("/datasets")} {/*aggiungere la rotta se non l'ho fatto*/}
                <p>*: Campo obbligatorio</p>
            </form>
        </>
    )
}
export default RegisterDatasetPage;