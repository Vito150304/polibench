import {useCreateExperiment} from '../hooks/useExperiment';
import { useState, useEffect } from 'react';
import { useDatasets } from '../hooks/useDatasets';
import { useVersions } from '../hooks/useVersions';
import { usePipelines } from '../hooks/usePipelines';
import useModels from '../hooks/useModels';
import { toast } from 'react-toastify'; 
import {useQueryClient} from '@tanstack/react-query';
import {Link} from 'react-router-dom';
import { validateMetricsCsv } from '../utils/metricsCsv';
import { useUploadMetricImport, useMetricImportStatus } from '../hooks/useMetricImport';
import styles from '../styles/SubmitExperimentPage.module.css';


function SubmitExperimentPage() {

const {createExperiment, isCreating} = useCreateExperiment();
const [datasetUuid, setDatasetUuid] = useState('');
const [versionUuid, setVersionUuid] = useState('');
const [pipelineUuid, setPipelineUuid] = useState('');
const [modelUuid, setModelUuid] = useState('');
const [runName, setRunName] = useState('');
const [seed, setSeed] = useState('');
const [notes, setNotes] = useState('');
const [csvFile, setCsvFile] = useState(null);
const [csvError, setCsvError] = useState('');

//CSV
const [createdExperimentUuid, setCreatedExperimentUuid] = useState('');
const [createdVersionUuid, setCreatedVersionUuid] = useState('');
const [formKey, setFormKey] = useState(0); // cambiandolo il form si ricrea da zero, e il campo file si svuota
const queryClient = useQueryClient();
const { uploadMetricImport, isUploading, uploadError } = useUploadMetricImport();
const { latestImport } = useMetricImportStatus(createdExperimentUuid);



const {datasets, isLoading: datasetsLoading, error: datasetsError} = useDatasets();
const {versions, isLoading: versionsLoading, error: versionsError} = useVersions(datasetUuid);
const {pipelines, isLoading: pipelinesLoading, error: pipelinesError} = usePipelines(versionUuid);
const {models, isLoading: modelsLoading, error: modelsError} = useModels();




const handleCsvChange = async (e) => {
    const file = e.target.files?.[0] ?? null;
    setCsvFile(null);
    setCsvError('');
    if (!file) return;
    const problem = await validateMetricsCsv(file);
    if (problem) {
        setCsvError(problem);
        e.target.value = ''; // svuota il campo, così si può scegliere un altro file
        return;
    }
    setCsvFile(file);
};


useEffect(() => {
    if (latestImport?.status === 'completed') {
        queryClient.invalidateQueries({ queryKey: ['experiment-versions', createdVersionUuid] });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['leaderboardMulti'] });
        toast.success('Results imported successfully!', { toastId: 'metric-import-done' });
    }
}, [latestImport?.status, queryClient, createdVersionUuid]);



const sendCsv = (experimentUuid) => {
    uploadMetricImport({ experimentUuid, file: csvFile }, {
        onError: (error) => {
            console.error('Error uploading CSV:', error);
            toast.error(`Error uploading results: ${error.message}`);
        },
    });
};

let importMessage = '';
if (createdExperimentUuid) {
    if (isUploading) importMessage = 'Uploading the file...';
    else if (uploadError) importMessage = `Upload failed: ${uploadError.message}`;
    else if (latestImport?.status === 'completed') importMessage = 'Results imported successfully.';
    else if (latestImport?.status === 'failed') importMessage = `Import failed: ${latestImport.error_message}`;
    else importMessage = 'Importing the results...';
}
const canRetry = !!createdExperimentUuid && !isUploading && !!csvFile
    && (uploadError || latestImport?.status === 'failed');

const resetForm = () => {
    setDatasetUuid(''); setVersionUuid(''); setPipelineUuid(''); setModelUuid('');
    setRunName(''); setSeed(''); setNotes('');
    setCsvFile(null); setCsvError('');
    setCreatedExperimentUuid(''); setCreatedVersionUuid('');
    setFormKey((key) => key + 1);
};



const handleSubmit = async (e) => {
    e.preventDefault();
    setCsvError('');
    if (csvFile && (!versionUuid || !pipelineUuid)) {
        setCsvError('To upload results, select a dataset version and a pipeline.');
        return;
    }
    const payload = {
        model_uuid: modelUuid, //il model_uuid obbligatorio dal backend
    }
    if (datasetUuid) payload.dataset_uuid = datasetUuid;
    if (versionUuid) payload.dataset_version_uuid = versionUuid;
    if (pipelineUuid) payload.pipeline_uuid = pipelineUuid;
    if (runName) payload.run_name = runName;
    if (seed) payload.seed = Number(seed);
    if (notes) payload.notes = notes;

    createExperiment(payload, {
        onSuccess: (data) => {
            if (!csvFile) {
                toast.success('Experiment created successfully! Go to the related specific version to see it.');
                return;
            }
            toast.success('Experiment created. Uploading the results...');
            setCreatedExperimentUuid(data.uuid);
            setCreatedVersionUuid(versionUuid);
            sendCsv(data.uuid);
        },
        onError: (error) => {
            console.error('Error creating experiment:', error);
            toast.error(`Error creating experiment: ${error.message}`);
        }
    });
}



    return (
        <>
        <h1>Submit Experiment</h1>
        <div className={styles.page}>
        <form onSubmit={handleSubmit} className={styles.form} key={formKey}>
            <div className={styles.inputContainer}>
                <label>
                    Dataset:
                    <select value={datasetUuid} onChange={(e) => {
                        setDatasetUuid(e.target.value);
                        setVersionUuid(''); // Reset version, pipeline e model quando cambia il dataset 
                        setPipelineUuid('');  
                    }} disabled={datasetsLoading || datasetsError || datasets?.length === 0}>
                        {datasetsLoading ? (
                            <option value="" disabled>Loading datasets...</option>
                        ) : datasetsError ? (
                            <option value="" disabled>Error loading datasets</option>
                        ) : datasets?.length === 0 ? (
                            <option value="" disabled>No datasets registered. Register a dataset to submit an experiment.</option>
                        ) : (
                            <>
                                <option value="">Select a dataset</option>
                                {datasets?.map(dataset => (
                                    <option key={dataset.uuid} value={dataset.uuid}>
                                        {dataset.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                </label>
                <label>
                    Version:
                    <select value={versionUuid} onChange={(e) => {
                        setVersionUuid(e.target.value);
                        setPipelineUuid('');
                    }} disabled={versionsLoading || versionsError || !datasetUuid || versions?.length === 0}>
                        {versionsLoading ? (
                            <option value="" disabled>Loading versions...</option>
                        ) : versionsError ? (
                            <option value="" disabled>Error loading versions</option>
                        ) : versions?.length === 0 ? (
                            <option value="" disabled>No versions available</option>
                        ) : (
                            <>
                                <option value="">Select a version</option>
                                {versions?.map(version => (
                                    <option key={version.uuid} value={version.uuid}>
                                {version.version}
                            </option>
                        ))}
                        </>
                        )}
                    </select>
                </label>
                <label>
                    Pipeline:
                    <select value={pipelineUuid} onChange={(e) => {
                        setPipelineUuid(e.target.value);
                    }} disabled={pipelinesLoading || pipelinesError || !versionUuid || pipelines?.length === 0}>
                        {pipelinesLoading ? (
                            <option value="" disabled>Loading pipelines...</option>
                        ) : pipelinesError ? (
                            <option value="" disabled>Error loading pipelines</option>
                        ) : pipelines?.length === 0 ? (
                            <option value="" disabled>No pipelines available</option>
                        ) : (
                            <>
                                <option value="">Select a pipeline</option>
                        {/*Se c'è il code lo mostro, altrimenti mostro "Pipeline"*/}
                                {pipelines?.map(pipeline => {
                                const formattedDate = new Date(pipeline.created_at).toLocaleDateString();
                                    const shortUuid = pipeline.uuid.substring(0, 6);
                                    const label = pipeline.code ? `${pipeline.code} (${shortUuid})` : `Pipeline (${shortUuid}) - ${formattedDate} (${pipeline.steps_count} steps)`;
                                    return (
                                        <option key={pipeline.uuid} value={pipeline.uuid}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </>
                        )}
                    </select>
                </label>
                <label>
                    Model:* <span className={styles.required}>(required)</span>
                    <select value={modelUuid} onChange={(e) => setModelUuid(e.target.value)} disabled={modelsLoading || modelsError || models?.length === 0} required>
                        {modelsLoading ? (
                            <option value="" disabled>Loading models...</option>
                        ) : modelsError ? (
                            <option value="" disabled>Error loading models</option>
                        ) : models?.length === 0 ? (
                            <option value="" disabled>No models available</option>
                        ) : (
                            <>
                                <option value="">Select a model</option>
                                {models?.map(model => (
                                    <option key={model.uuid} value={model.uuid}>
                                {model.name}
                            </option>
                        ))}
                        </>
                        )}
                    </select>
                </label>
                <label>
                    Run Name:
                    <input className={styles.input} type="text" value={runName} onChange={(e) => setRunName(e.target.value)} placeholder="e.g. My Experiment" />
                </label>
                <label>
                    Seed:
                    <input className={styles.seed} type="number" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="e.g. 15" />
                </label>
                <label>
                    Notes:
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                </label>
                   <label>
                        Results (CSV): <span className={styles.optional}>(optional)</span>
                        <input type="file" accept=".csv,text/csv" onChange={handleCsvChange} />
                    </label>
                    <p className={styles.hint}>
                        Columns: split, metric, k, value, direction. Only "metric" and "value" are required.
                    </p>
                    {csvError && <p className={styles.error} role="alert">{csvError}</p>}
            </div>
            <div className={styles.button}>
                <button type="submit" disabled={isCreating || !!createdExperimentUuid}>
                    {isCreating ? 'Creating...' : 'Create Experiment'}
                </button>
            </div>
            {createdExperimentUuid && (
                <div className={styles.importStatus} role="status">
                    <p>{importMessage}</p>
                    {canRetry && (
                        <button type="button" onClick={() => sendCsv(createdExperimentUuid)}>Retry upload</button>
                    )}
                    {latestImport?.status === 'completed' && (
                        <>
                         <Link to={`/dataset-versions/${createdVersionUuid}`}>View the version</Link>
                         <button type="button" onClick={resetForm}>Submit another experiment</button>
                        </>
                    )}
                </div>
            )}
            </form>
            </div>
        </>
    );
}
export default SubmitExperimentPage;