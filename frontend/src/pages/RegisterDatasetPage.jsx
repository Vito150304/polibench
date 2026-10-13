import { useCreateDataset } from "../hooks/useDatasets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {toast} from 'react-toastify';

function RegisterDatasetPage() {
    const {newDataset, isPending} = useCreateDataset();
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
                </button>S
                <p>*: Required fields</p>
            </form>
        </>
    )
}
export default RegisterDatasetPage;