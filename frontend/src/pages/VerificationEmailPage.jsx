import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function VerificationEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const {isLoading , isError, isSuccess} = useQuery({
        queryKey: ['verifyEmail', token],
        queryFn: async () => {
            const response = await fetch(`/api/v1/users/verify/${token}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Email verification failed');
            }
            return await response.json();
        },
        retry: false, //non riprovare in caso di errore
        refetchOnWindowFocus: false, //non riprovare se l'utente cambia scheda
        refetchOnMount: false, //non rifare al muont/unmount
        enabled: !!token, //non fare la query se il token non è presente    
    });

    useEffect(() => { //solo perchè navigate non posso usarlo nel return insieme al messaggio da mostrare
        if (isSuccess) {
            // Aspetta 5 secondi per fargli leggere il messaggio, poi cambia pagina
            const timer = setTimeout(() => {
                navigate('/login');
            }, 5000);
            
            // Cleanup del timer
            return () => clearTimeout(timer); 
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        if (isError) {
            // Aspetta 8 secondi per fargli leggere il messaggio, poi cambia pagina
            const timer = setTimeout(() => {
                navigate('/login');
            }, 8000);
            
            // Cleanup del timer
            return () => clearTimeout(timer); 
        }
    }, [isError, navigate]);



    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return  (
            <div>Something went wrong: your verification link might be invalid or expired.
            Please, in order to retry go to the Login page.</div>
            
        );
    }

    
    if (isSuccess) {
        return <div>Email verified successfully!</div>;
        
    }

    return null;
}
export default VerificationEmailPage;