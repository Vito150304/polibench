
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';



function useRegister() {

    const navigate = useNavigate();


    const RegisterMutation = useMutation({
        mutationKey: ['registerUser'],
        mutationFn: async ({first_name, last_name, email, password}) => {
            let response;
            try { 
                response = await fetch('/api/v1/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: first_name, 
                        last_name: last_name,   
                        email: email,
                        password: password
                    })
                });
            } catch (networkError) {
                console.error("Errore durante la fetch:", networkError);
                throw new Error('Network error during registration', { cause: networkError }); //l'ultima parte è solo per esLint
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); //serve anche se c'è errore perchè il backend spiega il motivo dell'errore e lo fa in JSON
                throw new Error(errorData.detail || 'Registration failed'); //devo fare per forza throw new Error perchè altrimenti non si attiva onError (per la fetch il codice 400 o 422 è andato a buon fine)
            } //il .detail è perchè il backend restituisce un JSON con la chiave "detail" che contiene il messaggio di errore
            return await response.json();
        },
        onSuccess: () => {
            console.log('Registration successful');
            navigate('/login'); 
        },
        onError: (error) => {
            console.error("Errore durante la registrazione:", error);
        }
    })

    return RegisterMutation;
}

export default useRegister;