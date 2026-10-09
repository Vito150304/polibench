import { useParams } from "react-router-dom";
import { useCreateDatasetVersion } from "../hooks/useDatasets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateDatasetVersionPage() {
    const {dataset_uuid} = useParams();
    const navigate = useNavigate();

    const [version, setVersion] = useState('');
    const [status, setStatus] = useState('draft');
    const [releaseNote, setReleaseNote] = useState('');

    const {newVersion, isPending, error} = useCreateDatasetVersion(dataset_uuid);


    const [choice, setChoice] = useState('Modalità Upload'); 

    //stati per i file upload

    const [datasetFile, setDatasetFile] = useState(null);
    const [versionFile, setVersionFile] = useState(null);
    const [pipelineFile, setPipelineFile] = useState(null);
    const [characteristicsFile, setCharacteristicsFile] = useState(null);

    //stati per i file testuali

    const [datasetText, setDatasetText] = useState('');
    const [versionText, setVersionText] = useState('');
    const [pipelineText, setPipelineText] = useState('');
    const [characteristicsText, setCharacteristicsText] = useState('');



    const handleSubmit = (e) => {
        e.preventDefault();

        
        if (choice === 'Modalità Upload') {
            const formData = new FormData();
            
            formData.append('version', version);
            formData.append('status', status);
            if (releaseNote) formData.append('release_notes', releaseNote);


            if (datasetFile) formData.append('dataset_yaml_file', datasetFile);
            if (versionFile) formData.append('version_yaml_file', versionFile);
            if (pipelineFile) formData.append('pipeline_yaml_file', pipelineFile);
            if (characteristicsFile) formData.append('characteristics_yaml_file', characteristicsFile);

            
            newVersion(formData, {
                onSuccess: () => navigate(`/datasets/${dataset_uuid}`) // Torna indietro se va a buon fine
            });

        } else {

            const payload = {
                version: version,
                status: status
            };
            if (releaseNote) payload.release_notes = releaseNote;


            if (datasetText) payload.dataset_yaml = datasetText;
            if (versionText) payload.version_yaml = versionText;
            if (pipelineText) payload.pipeline_yaml = pipelineText;
            if (characteristicsText) payload.characteristics_yaml = characteristicsText;

            
            newVersion(payload, {
                onSuccess: () => navigate(`/datasets/${dataset_uuid}`)
            });
        }
    };

    

    return (
        <>
            <h1>Create a new Dataset Version</h1>
            <p>Enter the details for the new version:</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Version*:
                    <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} required placeholder="e.g. 2.0" />
                </label>
                <label>
                    Status:
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="draft">Draft</option>
                        <option value="released">Released</option>
                    </select>
                </label>
                <label>
                    Release Notes:
                    <textarea value={releaseNote} onChange={(e) => setReleaseNote(e.target.value)} />
                </label>
                <button type="submit" disabled={isPending}>Create Version</button>
                {error && <p>Error creating version: {error.message}</p>}
            
            <p>Choose configuration mode:</p>
            <select value={choice} onChange={(e) => setChoice(e.target.value)}>
                <option value="Modalità Upload">Modalità Upload</option>
                <option value="Modalità Testuale">Modalità Testuale</option>
            </select>
            {choice === 'Modalità Upload' ? (
                <div className="upload-mode">
                    <label>
                        Dataset YAML File: 
                        <input type="file" accept=".yaml,.yml" onChange={(e) => setDatasetFile(e.target.files[0])} />
                    </label>

                    <label>
                        Version YAML File:
                        <input type="file" accept=".yaml,.yml" onChange={(e) => setVersionFile(e.target.files[0])} />
                    </label>
                    <label>
                        Pipeline YAML File:
                        <input type="file" accept=".yaml,.yml" onChange={(e) => setPipelineFile(e.target.files[0])} />
                    </label>
                    <label>
                        Characteristics YAML File:
                        <input type="file" accept=".yaml,.yml" onChange={(e) => setCharacteristicsFile(e.target.files[0])} />
                    </label>
                </div>
            ) : (
                <div className="text-mode">
                    <label>
                        Dataset YAML:
                        <textarea value={datasetText} onChange={(e) => setDatasetText(e.target.value)} />
                    </label>
                    <label>
                        Version YAML:
                        <textarea value={versionText} onChange={(e) => setVersionText(e.target.value)} />
                    </label>
                    <label>
                        Pipeline YAML:
                        <textarea value={pipelineText} onChange={(e) => setPipelineText(e.target.value)} />
                    </label>
                    <label>
                        Characteristics YAML:
                        <textarea value={characteristicsText} onChange={(e) => setCharacteristicsText(e.target.value)} />
                    </label>
                </div>
            )}
            </form>
            <p>*: Campo obbligatorio</p> 
        </>
    )
}
export default CreateDatasetVersionPage;