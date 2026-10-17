import useModels from "../hooks/useModels";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EmptyState from "../components/EmptyState";
import {Search} from 'lucide-react';
import styles from "../styles/ModelPage.module.css";

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

    const RegisterModel = () => {
        navigate("/register-model"); 
    }

    const modelliFiltrati =  models.filter((modello) => modello.name.toLowerCase().includes(searchModel.toLowerCase())); //barra di ricerca
    
    return ( //Possibile implementazione futura (anche backend) è aggiungere un endpoint DELETE
        //per cancellare un modello registrato per sbaglio ad esempio
        <>
            <h1 className = {styles.title}>MODELS</h1>
            <div className = {styles.search}>
                <Search size={27} />
                <input value = {searchModel} onChange = {(e) => setSearchModel(e.target.value)} placeholder = "Search for a model name" />
            </div>
            <div className = {styles.container}>
                {modelliFiltrati.length === 0 ? (
                    <EmptyState
                        title="No Models Found"
                        description="There are no models matching your search or registered."
                        action="Register a new Model"
                        route="/register-model"
                    />
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
                                <td>{modello.family ? modello.family : (
                                    <span>-</span>
                                    )}</td>
                                <td>{modello.paper_url ? <a href={modello.paper_url}>View Paper</a> : "No Paper Available"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}
            </div>
            <div className = {styles.register}>
            <button onClick = {RegisterModel}>Register a new Model</button>
            </div>
        </>
    );
}
export default ModelPage;