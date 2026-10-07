import useModels from "../hooks/useModels";
import { useNavigate } from "react-router-dom";

function ModelPage() {
    
    const {models, isLoading, error} = useModels();
    const navigate = useNavigate();

    if (isLoading) {
        return <div>Loading models...</div>;
    }
    if (error) {
        return <div>Error loading models: {error.message}</div>;
    }
    if (!models || models.length === 0) return <div>No models registered</div>;

    const RegisterModel = () => {
        navigate("/register-model"); //aggiungere la rotta e associarla al componente RegisterModelPage.jsx
    }
    
    return (
        <>
            <h1 className = "Models-title">MODELS</h1>
            <button onClick = {RegisterModel}>Register a new Model</button>
            <div className = "Models-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Family</th>
                            <th>Paper</th>
                        </tr>
                    </thead>
                    <tbody>
                        {models.map((modello) => (
                            <tr key={modello.id}>
                                <td>{modello.name}</td>
                                <td>{modello.family}</td>
                                <td>{modello.paper ? <a href={modello.paper}>View Paper</a> : "No Paper Available"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            
        </>
    );
}
export default ModelPage;