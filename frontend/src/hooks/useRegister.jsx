
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
                throw new Error('Network error during registration', { cause: networkError }); 
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || 'Registration failed');
            }
            return await response.json();
        },
        onSuccess: () => {
            console.log('Registration successful');
            navigate('/email-sent'); 

        },
        onError: (error) => {
            console.error("Errore durante la registrazione:", error);
        }
    })

    return RegisterMutation;
}

export default useRegister;