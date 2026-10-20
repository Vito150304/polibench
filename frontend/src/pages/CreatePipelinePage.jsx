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
    const {previewPipeline, isPending: isPreviewing, error: previewError} = usePipelinePreview(version_uuid);


    const [choice, setChoice] = useState('Modalità Upload'); 

    //stato per il file upload

    const [pipelineFile, setPipelineFile] = useState(null);
    

    //stato per il file testuale


    const [pipelineText, setPipelineText] = useState('');
    



    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            status: status
        };
        if (code) payload.code = code;
        if (choice === 'Modalità Upload') {
            if (pipelineFile) payload.yaml_raw = await pipelineFile.text();
        } else {
            if (pipelineText) payload.yaml_raw = pipelineText;
        }

        createPipeline(payload, {
            onSuccess: () => {
                toast.success('Pipeline created successfully');
                navigate(`/dataset-versions/${version_uuid}`);
            }
        });
        
    };

    const handleParse = async (e) => {
        e.preventDefault();
        const payload = {
            status: status
        };
        if (code) payload.code = code;
        if (choice === 'Modalità Upload') {

            if (pipelineFile) payload.yaml_raw = await pipelineFile.text();
        } else {

            if (pipelineText) payload.yaml_raw = pipelineText;
        }

        previewPipeline(payload, {
            onSuccess: (data) => {
                setParseInfo(data);
                setIsOpenPreview(true);
            },
            onError: (error) => {
                console.error('Error parsing version:', error);
                toast.error(`Error parsing version: ${error.message}`);
            }
        });
    };



    return (
        <>
            <h1>Create a new Pipeline</h1>
            <p className={styles.description}>Enter the details for the new pipeline:</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputContainer}>
                    <label>
                        Code:
                        <input className={styles.input} type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                    </label>
                    <label>
                        Status:
                        <select className={styles.selection} value={status} onChange={(e) => setStatus(e.target.value)} required>
                            <option value="draft">Draft</option>
                            <option value="ready">Ready</option>
                            <option value="processing">Processing</option>
                            <option value="failed">Failed</option>
                        </select>
                    </label>
                </div>

            <p className={styles.description}>Choose configuration mode:</p>
            <select className={styles.select} value={choice} onChange={(e) => setChoice(e.target.value)}>
                <option value="Modalità Upload">Modalità Upload</option>
                <option value="Modalità Testuale">Modalità Testuale</option>
            </select>
            {choice === 'Modalità Upload' ? (
                <div className={styles.uploadMode}>
                    <label>
                        Pipeline YAML File: 
                        <input className={styles.input} type="file" accept=".yaml,.yml" onChange={(e) => setPipelineFile(e.target.files[0])} />
                    </label>
                </div>
            ) : (
                <div className={styles.textMode}>
    
                    <label>
                        Pipeline YAML:
                        <textarea className={styles.textarea} value={pipelineText} onChange={(e) => setPipelineText(e.target.value)} />
                    </label>
                </div>
            )}
            <div className={styles.buttons}>
                    <button type = "button" onClick={() => navigate(`/dataset-versions/${version_uuid}`)}>View Version Details</button>
                    <button type = "button" onClick={handleParse} disabled={isPreviewing}>Preview Pipeline</button>
                    <button type="submit" disabled={isPending}>Create Pipeline</button>
                    {previewError && <p>Error parsing pipeline: {previewError.message}</p>}
                    {error && <p>Error creating pipeline: {error.message}</p>}
            </div>
            </form>
            
            {isOpenPreview && parseInfo && (
                <div className={styles.preview}>
                    <h2>Preview of the new pipeline</h2>
                    <p><span>Version:</span> <span>{parseInfo.recognized_version}</span></p>
                    <p><span>Requested code:</span> <span>{parseInfo.requested_code}</span></p>
                    <p><span>Pipeline steps:</span> <span>{parseInfo.pipeline_steps_count}</span></p>
                    <div className={styles.previewButton}>
                        <button type="button" onClick={() => setIsOpenPreview(false)}>Close Preview</button>
                    </div>
                </div>
            )}
        </>
    )
}
export default CreatePipelinePage;