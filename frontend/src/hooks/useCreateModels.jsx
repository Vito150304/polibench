import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateModel() {
    //POST

    const queryClient = useQueryClient();

    const {mutate: createModel, isLoading, error} = useMutation({
        mutationKey: ['create-model'],
        mutationFn: async (nuovoModello) => {
            try {
                const response = await fetch(`/api/v1/ml-models`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuovoModello)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to create model');
                }
                return await response.json();
            } catch (networkError) {
                console.error('Error creating model:', networkError);
                throw new Error('Failed to create model', { cause: networkError });
            }
        },
        onSuccess: () => {
            //Appena la POST ha successo, diciamo a React Query 
            // che i dati con queryKey ['models'] sono vecchi. 
            // Lui farà partire in automatico una nuova GET per aggiornare la tabella!
            queryClient.invalidateQueries({ queryKey: ['models'] });
        },
        onError: (error) => {
            console.error('Error creating model:', error);
        }
    });

    return { createModel, isLoading, error };
}

export default useCreateModel;