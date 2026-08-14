
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';



function useRegister() {


    const navigate = useNavigate();

    const RegisterMutation = useMutation({
        mutationFn: async ({nome, cognome, email, password}) => {
            const response = await fetch('/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nome, cognome, email, password})
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
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