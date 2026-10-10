import CreateExperiment from '../hooks/useCreateExperiment';
import { useState } from 'react';
import { useDatasets } from '../hooks/useDatasets';
import { useVersions } from '../hooks/useVersions';
import { usePipelines } from '../hooks/usePipelines';
import { useModels } from '../hooks/useModels';
import { useNavigate } from 'react-router-dom';

function SubmitExperimentPage() {

const {createExperiment, isCreating, createError} = CreateExperiment();
const [datasetUuid, setDatasetUuid] = useState('');
const [versionUuid, setVersionUuid] = useState('');
const [pipelineUuid, setPipelineUuid] = useState('');
const [modelUuid, setModelUuid] = useState('');
const [runName, setRunName] = useState('');
const [seed, setSeed] = useState('');
const [metrics, setMetrics] = useState(''); //campo aggiuntivo che voleva il prof. DA QUELLO CHE RICORDO. VERIFICARE. Non voleva più il file csv però
const [notes, setNotes] = useState('');


const {datasets, isLoading: datasetsLoading, error: datasetsError} = useDatasets();
const {versions, isLoading: versionsLoading, error: versionsError} = useVersions(datasetUuid);
const {pipelines, isLoading: pipelinesLoading, error: pipelinesError} = usePipelines(versionUuid);
const {models, isLoading: modelsLoading, error: modelsError} = useModels();

const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        model_uuid: modelUuid, //il model_uuid obbligatorio dal backend
    }
    if (datasetUuid) payload.dataset = datasetUuid;
    if (versionUuid) payload.version = versionUuid;
    if (pipelineUuid) payload.pipeline = pipelineUuid;
    if (runName) payload.run_name = runName;
    if (seed) payload.seed = Number(seed);
    if (metrics) payload.metrics = metrics;
    if (notes) payload.notes = notes;

    await createExperiment(payload, {
        onSuccess: () => {
            navigate('/experiments');
        },
        onError: (error) => {
            console.error('Error creating experiment:', error);
        }
    });
}

    return (
        <>
        <h2>Submit Experiment</h2>
        <form onSubmit={handleSubmit}>
            <label>
                Dataset:
                <select value={datasetUuid} onChange={(e) => {
                    setDatasetUuid(e.target.value);
                    setVersionUuid(''); // Reset version, pipeline e model quando cambia il dataset 
                    setPipelineUuid(''); 
                    setModelUuid(''); 
                }} disabled={datasetsLoading || datasetsError}>
                    <option value="">Select a dataset</option>
                    {datasetsLoading && <option value="" disabled>Loading datasets...</option>}
                    {datasetsError && <option value="" disabled>Error loading datasets</option>}
                    {datasets?.map(dataset => (
                        <option key={dataset.uuid} value={dataset.uuid}>
                            {dataset.name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Version:
                <select value={versionUuid} onChange={(e) => {
                    setVersionUuid(e.target.value);
                    setPipelineUuid('');
                    setModelUuid('');
                }} disabled={versionsLoading || versionsError || !datasetUuid}>
                    <option value="">Select a version</option>
                    {versionsLoading && <option value="" disabled>Loading versions...</option>}
                    {versionsError && <option value="" disabled>Error loading versions</option>}
                    {versions?.map(version => (
                        <option key={version.uuid} value={version.uuid}>
                            {version.version}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Pipeline:
                <select value={pipelineUuid} onChange={(e) => {
                    setPipelineUuid(e.target.value);
                    setModelUuid('');
                }} disabled={pipelinesLoading || pipelinesError || !versionUuid}>
                    <option value="">Select a pipeline</option>
                    {pipelinesLoading && <option value="" disabled>Loading pipelines...</option>}
                    {pipelinesError && <option value="" disabled>Error loading pipelines</option>}
                    {pipelines?.map(pipeline => {  {/*la pipeline non ha un name, o version, quindi ho solo uuid e code.
                    Mostrare l'intero uuid non è sicuramente una buona pratica, quindi mostro solo i primi 6 caratteri e la data di creazione. 
                    Se c'è il code lo mostro, altrimenti mostro "Pipeline"*/}
                        const formattedDate = new Date(pipeline.created_at).toLocaleDateString();
                        const shortUuid = pipeline.uuid.substring(0, 6); 
                        const label = pipeline.code ? `${pipeline.code} (${shortUuid})` : `Pipeline (${shortUuid}) - ${formattedDate} (${pipeline.steps_count} steps)`;
                        return (
                            <option key={pipeline.uuid} value={pipeline.uuid}>
                                {label}
                            </option>
                        );
                    })}
                </select>
            </label>
            <label>
                Model*:
                <select value={modelUuid} onChange={(e) => setModelUuid(e.target.value)} disabled={modelsLoading || modelsError} required>
                    <option value="">Select a model</option>
                    {modelsLoading && <option value="" disabled>Loading models...</option>}
                    {modelsError && <option value="" disabled>Error loading models</option>}
                    {models?.map(model => (
                        <option key={model.uuid} value={model.uuid}>
                            {model.name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Run Name:
                <input type="text" value={runName} onChange={(e) => setRunName(e.target.value)} />
            </label>
            <label>
                Seed:
                <input type="number" value={seed} onChange={(e) => setSeed(e.target.value)} />
            </label>
            <label>
                Metrics:
                <input type="text" value={metrics} onChange={(e) => setMetrics(e.target.value)} /> {/*capire modalità di inserimento*/}
            </label>
            <label>
                Notes:
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Experiment'}
            </button>
            {createError && <p>Error creating experiment: {createError.message}</p>}
        </form>
        <p>*: Required fields</p>
        </>
    );
}
export default SubmitExperimentPage;