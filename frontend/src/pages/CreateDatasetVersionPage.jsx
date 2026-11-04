import { useParams, useNavigate } from "react-router-dom";
import { useCreateDatasetVersion, useVersionParse } from "../hooks/useDatasets";
import { useState } from "react";
import { toast } from 'react-toastify';
import styles from '../styles/CreateDatasetVersionPage.module.css';

function CreateDatasetVersionPage() {
    const { dataset_uuid } = useParams();
    const navigate = useNavigate();

    const [version, setVersion] = useState('');
    const [status, setStatus] = useState('draft');
    const [releaseNote, setReleaseNote] = useState('');

    const { newVersion, isPending, error } = useCreateDatasetVersion(dataset_uuid);

    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [parseInfo, setParseInfo] = useState(null);
    const { parseVersion, isPending: isParsing } = useVersionParse(dataset_uuid);

    const [choice, setChoice] = useState('Modalità Upload'); 

    // Stati per i file upload
    const [datasetFile, setDatasetFile] = useState(null);
    const [versionFile, setVersionFile] = useState(null);
    const [pipelineFile, setPipelineFile] = useState(null);
    const [characteristicsFile, setCharacteristicsFile] = useState(null);

    // Stati per i file testuali
    const [datasetText, setDatasetText] = useState('');
    const [versionText, setVersionText] = useState('');
    const [pipelineText, setPipelineText] = useState('');
    const [characteristicsText, setCharacteristicsText] = useState('');

    const buildPayload = async () => {
        const payload = { version: version.trim(), status };
        if (releaseNote.trim()) payload.release_notes = releaseNote.trim();

        if (choice === 'Modalità Upload') {
            if (datasetFile) payload.dataset_yaml_raw = await datasetFile.text();
            if (versionFile) payload.version_yaml_raw = await versionFile.text();
            if (pipelineFile) payload.pipeline_yaml_raw = await pipelineFile.text();
            if (characteristicsFile) payload.characteristics_yaml_raw = await characteristicsFile.text();
        } else {
            if (datasetText.trim()) payload.dataset_yaml_raw = datasetText.trim();
            if (versionText.trim()) payload.version_yaml_raw = versionText.trim();
            if (pipelineText.trim()) payload.pipeline_yaml_raw = pipelineText.trim();
            if (characteristicsText.trim()) payload.characteristics_yaml_raw = characteristicsText.trim();
        }
        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = await buildPayload();

        newVersion(payload, {
            onSuccess: () => {
                toast.success('Version created successfully');
                navigate(`/datasets/${dataset_uuid}`);
            }
        });
    };

    const handleParse = async (e) => {
        e.preventDefault();
        const payload = await buildPayload();

        parseVersion(payload, {
            onSuccess: (data) => {
                setParseInfo(data);
                setIsOpenPreview(true);
            },
            onError: (err) => {
                console.error('Error parsing version:', err);
                toast.error(`Error parsing version: ${err.message}`);
            }
        });
    };

    const characteristicKeys = ['n_users', 'n_items', 'n_interactions', 'density'];
    const shownCharacteristics = characteristicKeys.filter(
        (key) => parseInfo?.characteristics?.[key] != null
    );

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Create a new Dataset Version</h1>
            <p className={styles.note}>Fields marked with <span className={styles.star}>*</span> are required.</p>

            <form className={styles.form} onSubmit={handleSubmit} onChange={() => setIsOpenPreview(false)}>
                
                {/* 1. Meta Informazioni principali (Version & Status affiancati) */}
                <div className={styles.row}>
                    <label className={styles.field}>
                        <span className={styles.label}>
                            Version <span className={styles.star}>*</span>
                        </span>
                        <input 
                            type="text" 
                            value={version} 
                            onChange={(e) => setVersion(e.target.value)} 
                            required 
                            placeholder="e.g. 2.0" 
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>
                            Status <span className={styles.star}>*</span>
                        </span>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                            <option value="draft">Draft</option>
                            <option value="ready">Ready</option>
                            <option value="processing">Processing</option>
                            <option value="failed">Failed</option>
                        </select>
                    </label>
                </div>

                <label className={styles.field}>
                    <span className={styles.label}>Release Notes</span>
                    <textarea 
                        rows={3}
                        value={releaseNote} 
                        onChange={(e) => setReleaseNote(e.target.value)} 
                    />
                </label>

                <hr className={styles.divider} />

                {/* 2. Selezione Modalità Configuration */}
                <label className={styles.field}>
                    <span className={styles.label}>Configuration Mode</span>
                    <select value={choice} onChange={(e) => setChoice(e.target.value)}>
                        <option value="Modalità Upload">Upload YAML Files</option>
                        <option value="Modalità Testuale">Enter Text / YAML directly</option>
                    </select>
                </label>

                {/* 3. Modalità Upload vs Text */}
                {choice === 'Modalità Upload' ? (
                    <div className={styles.fileGrid}>
                        <label className={styles.field}>
                            <span className={styles.label}>Dataset YAML File</span>
                            <input type="file" accept=".yaml,.yml" onChange={(e) => setDatasetFile(e.target.files[0])} />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Version YAML File</span>
                            <input type="file" accept=".yaml,.yml" onChange={(e) => setVersionFile(e.target.files[0])} />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Pipeline YAML File</span>
                            <input type="file" accept=".yaml,.yml" onChange={(e) => setPipelineFile(e.target.files[0])} />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Characteristics YAML File</span>
                            <input type="file" accept=".yaml,.yml" onChange={(e) => setCharacteristicsFile(e.target.files[0])} />
                        </label>
                    </div>
                ) : (
                    <div className={styles.textGrid}>
                        <label className={styles.field}>
                            <span className={styles.label}>Dataset YAML</span>
                            <textarea rows={4} value={datasetText} onChange={(e) => setDatasetText(e.target.value)} placeholder="Paste dataset YAML content..." />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Version YAML</span>
                            <textarea rows={4} value={versionText} onChange={(e) => setVersionText(e.target.value)} placeholder="Paste version YAML content..." />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Pipeline YAML</span>
                            <textarea rows={4} value={pipelineText} onChange={(e) => setPipelineText(e.target.value)} placeholder="Paste pipeline YAML content..." />
                        </label>

                        <label className={styles.field}>
                            <span className={styles.label}>Characteristics YAML</span>
                            <textarea rows={4} value={characteristicsText} onChange={(e) => setCharacteristicsText(e.target.value)} placeholder="Paste characteristics YAML content..." />
                        </label>
                    </div>
                )}

                {/* Error Banner se presente */}
                {error && <p className={styles.errorMessage}>Error creating version: {error.message}</p>}

                {/* 4. Azioni Form */}
                <div className={styles.actions}>
                    <button type="button" className={styles.secondary} onClick={() => navigate(`/datasets/${dataset_uuid}`)}>
                        Back to Dataset
                    </button>
                    <button type="button" className={styles.secondary} onClick={handleParse} disabled={isParsing}>
                        {isParsing ? 'Parsing...' : 'Preview Version'}
                    </button>
                    <button type="submit" className={styles.primary} disabled={isPending || !version.trim()}>
                        {isPending ? 'Creating...' : 'Create Version'}
                    </button>
                </div>
            </form>

            {/* 5. Box di Preview (Card condizionale sottostante) */}
            {isOpenPreview && parseInfo && (
                <div className={styles.previewCard}>
                    <div className={styles.previewHeader}>
                        <h3>Parsed Version Preview</h3>
                        <button type="button" className={styles.closePreview} aria-label="Close preview" onClick={() => setIsOpenPreview(false)}>
                            ✕
                        </button>
                    </div>

                    <div className={styles.previewContent}>
                        {parseInfo.recognized_version && (
                            <p><strong>Version:</strong> {parseInfo.recognized_version}</p>
                        )}
                        <p><strong>Parsed Sources:</strong> {parseInfo.source_count}</p>
                        <p><strong>Parsed Resources:</strong> {parseInfo.resource_count}</p>
                        {parseInfo.pipeline_steps_count != null && (
                            <p><strong>Pipeline Steps:</strong> {parseInfo.pipeline_steps_count}</p>
                        )}

                        <div className={styles.previewCharacteristics}>
                            <strong>Characteristics:</strong>
                            {shownCharacteristics.length === 0 ? (
                                <span> None provided</span>
                            ) : (
                                <ul className={styles.charList}>
                                    {shownCharacteristics.map((key) => (
                                        <li key={key}>
                                            <span className={styles.charKey}>{key}:</span> {parseInfo.characteristics[key]}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateDatasetVersionPage;