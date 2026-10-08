import useModels from "../hooks/useModels";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ModelPage() {
    
    const {models, isLoading, error} = useModels();
    const [searchModel, setSearchModel] = useState(''); //barra di ricerca
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

    const modelliFiltrati =  models.filter((modello) => modello.name.toLowerCase().includes(searchModel.toLowerCase())); //barra di ricerca
    
    return ( //con i dati di mockup la GET funziona. Quindi dovrò verificare solo se funziona anche con le fetch. Per la post
        //dovrò aggiungere la rotta. Possibile implementazione futura (anche backend) è aggiungere un endpoint DELETE
        //per cancellare un modello registrato per sbaglio ad esempio
        <>
            <h1 className = "Models-title">MODELS</h1>
            <input value = {searchModel} onChange = {(e) => setSearchModel(e.target.value)} placeholder = "Search for a model name" />
            <button onClick = {RegisterModel}>Register a new Model</button>
            <div className = "Models-container">
                {modelliFiltrati.length === 0 ? (
                    <p>No models registered.</p>
                ) : (   
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Family</th>
                            <th>Paper</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modelliFiltrati.map((modello) => (
                            <tr key={modello.uuid}>
                                <td>{modello.name}</td>
                                <td>{modello.family}</td>
                                <td>{modello.paper_url ? <a href={modello.paper_url}>View Paper</a> : "No Paper Available"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}
            </div>

            
        </>
    );
}
export default ModelPage;