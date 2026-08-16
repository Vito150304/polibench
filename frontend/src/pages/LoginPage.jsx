import  useAuth  from '../contexts/AuthContext';
import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

function LoginPage() {

    const {login} = useAuth(); //dentro la parentesi ci dovrò mettere tutte le cose che mi possono servire
    const emailRef = useRef();
    const passwordRef = useRef();
    
    function handleSubmit(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        
        login(email, password);
    }

    const NewVerificationEmailMutation = useMutation({
        mutationKey: ['NewVerificationEmail'],
        mutationFn: async ({email}) => {
            let response;
            try {
                response = await fetch('/api/v1/users/resend-verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
            } catch (networkError) {
                console.error("Errore durante la fetch:", networkError);
                throw new Error('Network error during resend verification email', { cause: networkError });
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to resend verification email');
            }

            return await response.json();
        },

        onSuccess: () => {
            alert('Email has been sent again');
        },

        onError: (error) => {
            console.error("Errore durante l'invio della email di verifica:", error);
        }
    });

    const handleNewVerificationEmail = () => {
        const currentEmail = emailRef.current.value;
        
        if (!currentEmail) {
            alert("Per favore, inserisci la tua email nel form prima di richiedere un nuovo link.");
            return; 
        }
        
        NewVerificationEmailMutation.mutate({ email: currentEmail });
    }

    return( //Ci devo mettere l'interfaccia per login con Google
        <>
        <form onSubmit = {handleSubmit}>
            <input type = "email" ref = {emailRef} placeholder = "Email" required />
            <input type = "password" ref = {passwordRef} placeholder = "Password" required />
            <button type = "submit">Login</button>
        </form>
        <button onClick = {handleNewVerificationEmail}>Resend email.</button>
        </>
    )
}
export default LoginPage;