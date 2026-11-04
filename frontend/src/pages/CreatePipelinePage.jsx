import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreatePipeline } from '../hooks/usePipelines';
import { usePipelinePreview } from '../hooks/usePipelines';
import { toast } from 'react-toastify';
import styles from '../styles/CreatePipelinePage.module.css';

function CreatePipelinePage() {
    const {version_uuid} = useParams();
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [status, setStatus] = useState('draft');

    const {createPipeline, isPending, error} = useCreatePipeline(version_uuid);

    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [parseInfo, setParseInfo] = useState(null);
    const {previewPipeline, isPending: isPreviewing} = usePipelinePreview(version_uuid);

    const [choice, setChoice] = useState('Modalità Upload');
    const [pipelineFile, setPipelineFile] = useState(null);
    const [pipelineText, setPipelineText] = useState('');

    const buildPayload = async () => {
        const payload = { status };
        if (code.trim()) payload.code = code.trim();
        if (choice === 'Modalità Upload') {
            if (pipelineFile) payload.yaml_raw = await pipelineFile.text();
        } else if (pipelineText.trim()) {
            payload.yaml_raw = pipelineText;
        }
        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = await buildPayload();

        createPipeline(payload, {
            onSuccess: () => {
                toast.success('Pipeline created successfully');
                navigate(`/dataset-versions/${version_uuid}`);
            }
        });
    };

    const handleParse = async (e) => {
        e.preventDefault();
        const payload = await buildPayload();

        previewPipeline(payload, {
            onSuccess: (data) => {
                setParseInfo(data);
                setIsOpenPreview(true);
            },
            onError: (error) => {
                console.error('Error previewing pipeline:', error);
                toast.error(`Error previewing pipeline: ${error.message}`);
            }
        });
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Create a new Pipeline</h1>
            <p className={styles.note}>Enter the details for the new pipeline.</p>

            <form onSubmit={handleSubmit} className={styles.form} onChange={() => setIsOpenPreview(false)}>
                <div className={styles.row}>
                    <label className={styles.field}>
                        <span className={styles.label}>Code <span className={styles.optional}>(optional)</span></span>
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                    </label>
                    <label className={styles.field}>
                        <span className={styles.label}>Status</span>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                            <option value="draft">Draft</option>
                            <option value="ready">Ready</option>
                            <option value="processing">Processing</option>
                            <option value="failed">Failed</option>
                        </select>
                    </label>
                </div>

                <label className={styles.field}>
                    <span className={styles.label}>Configuration Mode</span>
                    <select value={choice} onChange={(e) => setChoice(e.target.value)}>
                        <option value="Modalità Upload">Upload YAML file</option>
                        <option value="Modalità Testuale">Enter YAML text</option>
                    </select>
                </label>

                {choice === 'Modalità Upload' ? (
                    <label className={styles.field}>
                        <span className={styles.label}>Pipeline YAML File</span>
                        <input type="file" accept=".yaml,.yml" onChange={(e) => setPipelineFile(e.target.files[0])} />
                    </label>
                ) : (
                    <label className={styles.field}>
                        <span className={styles.label}>Pipeline YAML</span>
                        <textarea
                            rows={8}
                            value={pipelineText}
                            onChange={(e) => setPipelineText(e.target.value)}
                            placeholder="Paste pipeline YAML content..."
                        />
                    </label>
                )}

                {error && <p className={styles.errorMessage}>Error creating pipeline: {error.message}</p>}

                <div className={styles.actions}>
                    <button type="button" className={styles.secondary} onClick={() => navigate(`/dataset-versions/${version_uuid}`)}>
                        Back to Version
                    </button>
                    <button type="button" className={styles.secondary} onClick={handleParse} disabled={isPreviewing}>
                        {isPreviewing ? 'Previewing...' : 'Preview Pipeline'}
                    </button>
                    <button type="submit" className={styles.primary} disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create Pipeline'}
                    </button>
                </div>
            </form>

            {isOpenPreview && parseInfo && (
                <div className={styles.previewCard}>
                    <div className={styles.previewHeader}>
                        <h2 className={styles.previewTitle}>Pipeline Preview</h2>
                        <button
                            type="button"
                            className={styles.closePreview}
                            aria-label="Close preview"
                            onClick={() => setIsOpenPreview(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.previewContent}>
                        <p><strong>Version:</strong> {parseInfo.recognized_version ?? '—'}</p>
                        <p><strong>Requested code:</strong> {parseInfo.requested_code ?? '—'}</p>
                        <p><strong>Pipeline steps:</strong> {parseInfo.pipeline_steps_count ?? '—'}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
export default CreatePipelinePage;