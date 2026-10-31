import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

const FINAL_STATUSES = ['completed', 'failed'];

export const isImportFinished = (status) =>
    FINAL_STATUSES.includes(String(status).toLowerCase());

// Invia il file CSV delle metriche di un esperimento già creato
export const useUploadMetricImport = () => {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();
    const { mutate: uploadMetricImport, isPending: isUploading, error: uploadError } = useMutation({
        mutationKey: ['upload-metric-import'],
        mutationFn: async ({ experimentUuid, file }) => {
            const formData = new FormData();
            formData.append('file', file); // il backend si aspetta il campo "file"
            let response;
            try {
                response = await fetch(`/api/v1/experiments/${experimentUuid}/metric-import`, {
                    method: 'POST',
                    // niente Content-Type: lo imposta il browser, con il separatore giusto
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                    body: formData,
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(typeof errorData.detail === 'string' ? errorData.detail : 'Failed to upload the CSV file');
            }
            return await response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['metric-imports', variables.experimentUuid] });
        }
    });
    return { uploadMetricImport, isUploading, uploadError };
};

// Legge lo stato dell'importazione, ogni 2 secondi finché non è conclusa
export const useMetricImportStatus = (experimentUuid) => {
    const { accessToken } = useAuth();
    const { data: imports, isLoading, error } = useQuery({
        queryKey: ['metric-imports', experimentUuid],
        queryFn: async () => {
            let response;
            try {
                response = await fetch(`/api/v1/experiments/${experimentUuid}/metric-imports`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
            } catch (networkError) {
                throw new Error('Could not reach the server', { cause: networkError });
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(typeof errorData.detail === 'string' ? errorData.detail : 'Failed to load the import status');
            }
            return await response.json();
        },
        enabled: !!experimentUuid,
        refetchInterval: (query) => {
            if (query.state.status === 'error') return false;
            const latest = query.state.data?.[0]; // il backend li ordina dal più recente
            return latest && isImportFinished(latest.status) ? false : 2000;
        },
    });
    return { latestImport: imports?.[0] ?? null, isLoading, error };
};