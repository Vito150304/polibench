import { useParams, useNavigate } from "react-router-dom";
import { useCreateDatasetVersion } from "../hooks/useDatasets";
import { useState } from "react";
import { useVersionParse } from "../hooks/useDatasets";

function CreateDatasetVersionPage() {
    const {dataset_uuid} = useParams();
    const navigate = useNavigate();

    const [version, setVersion] = useState('');
    const [status, setStatus] = useState('draft');
    const [releaseNote, setReleaseNote] = useState('');

    const {newVersion, isPending, error} = useCreateDatasetVersion(dataset_uuid);

    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [parseInfo, setParseInfo] = useState(null);
    const {parseVersion, isPending: isParsing, error: parseError} = useVersionParse(dataset_uuid);


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



    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            version: version,
            status: status
        };
        if (releaseNote) payload.release_notes = releaseNote;
        if (choice === 'Modalità Upload') {
            if (datasetFile) payload.dataset_yaml_raw = await datasetFile.text();
            if (versionFile) payload.version_yaml_raw = await versionFile.text();
            if (pipelineFile) payload.pipeline_yaml_raw = await pipelineFile.text();
            if (characteristicsFile) payload.characteristics_yaml_raw = await characteristicsFile.text();
        } else {
            if (datasetText) payload.dataset_yaml_raw = datasetText;
            if (versionText) payload.version_yaml_raw = versionText;
            if (pipelineText) payload.pipeline_yaml_raw = pipelineText;
            if (characteristicsText) payload.characteristics_yaml_raw = characteristicsText;
        }

        newVersion(payload, {
            onSuccess: () => navigate(`/datasets/${dataset_uuid}`)
        });
        
    };

    const handleParse = async (e) => {
        e.preventDefault();
        const payload = {
            version: version,
            status: status
        };
        if (releaseNote) payload.release_notes = releaseNote;
        if (choice === 'Modalità Upload') {
            if (datasetFile) payload.dataset_yaml_raw = await datasetFile.text();
            if (versionFile) payload.version_yaml_raw = await versionFile.text();
            if (pipelineFile) payload.pipeline_yaml_raw = await pipelineFile.text();
            if (characteristicsFile) payload.characteristics_yaml_raw = await characteristicsFile.text();
        } else {
            if (datasetText) payload.dataset_yaml_raw = datasetText;
            if (versionText) payload.version_yaml_raw = versionText;
            if (pipelineText) payload.pipeline_yaml_raw = pipelineText;
            if (characteristicsText) payload.characteristics_yaml_raw = characteristicsText;
        }

        parseVersion(payload, {
            onSuccess: (data) => {
                setParseInfo(data);
                setIsOpenPreview(true);
            },
            onError: (error) => {
                console.error('Error parsing version:', error);
                alert(`Error parsing version: ${error.message}`);
            }
        });
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
                        <option value="ready">Ready</option>
                        <option value="processing">Processing</option>
                        <option value="failed">Failed</option>
                    </select>
                </label>
                <label>
                    Release Notes:
                    <textarea value={releaseNote} onChange={(e) => setReleaseNote(e.target.value)} />
                </label>
                
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
            <div className="buttons">
                    <button type = "button" onClick={() => navigate(`/datasets/${dataset_uuid}`)}>View Datasets</button>
                    <button type = "button" onClick={handleParse} disabled={isParsing}>Preview Version</button>
                    <button type="submit" disabled={isPending}>Create Version</button>
                    {parseError && <p>Error parsing version: {parseError.message}</p>}
                    {error && <p>Error creating version: {error.message}</p>}
            </div>
            </form>
            
            {isOpenPreview && parseInfo && (
                <div className="preview">
                    <h2>Preview of the new version</h2>
                    <span>Version:</span> <p>{parseInfo.recognized_version}</p>
                    <span>Parsed Sources:</span> <p>{parseInfo.source_count}</p>
                    <span>Parsed Resources:</span> <p>{parseInfo.resource_count}</p>
                    <span>Pipeline steps:</span> <p>{parseInfo.pipeline_steps_count}</p>
                    <span>Characteristics:</span> 
                    <p>{parseInfo.characteristics?.n_users}</p>
                    <p>{parseInfo.characteristics?.n_items}</p>
                    <p>{parseInfo.characteristics?.n_interactions}</p>
                    <p>{parseInfo.characteristics?.density}</p>
                    <button type="button" onClick={() => setIsOpenPreview(false)}>Close Preview</button>
                </div>
            )}
            <p>*: Required fields</p>
        </>
    )
}
export default CreateDatasetVersionPage;