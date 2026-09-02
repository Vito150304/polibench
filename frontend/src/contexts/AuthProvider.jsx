import {useState, useEffect} from "react";
import {AuthContext} from "./AuthContext";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";


function AuthProvider({children}) {

    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem('accessToken') || '';
    });
    //const [utente, setUtente] = useState(null); non serve perchè si deriva da useQuery
    const isLoggedIn = !!accessToken; //posso derivare lo stato di login dal token

    const navigate = useNavigate();
    const [isCheckingSession, setIsCheckingSession] = useState(() => !localStorage.getItem('accessToken')); //se c'è il token, isLoading = false, altrimenti true. è lo stato che ho dovuto aggiungere per il ProtectedRoute



    useEffect(() => {
        // Se NON abbiamo il token, forse stiamo tornando da Google con il Cookie!
        if (!accessToken) {
            const TokenPresoDalCookie = async () => {
                try {
                    const res = await fetch('/api/v1/login/refresh-token', {
                        method: 'GET',
                        credentials: 'include' 
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        const tokenNuovo = data.access_token;
                        
                        setAccessToken(tokenNuovo);
                        localStorage.setItem('accessToken', tokenNuovo);
                    }
                } catch (error) {
                    // Se fallisce, significa semplicemente che non c'era nessun cookie (utente non loggato).
                    console.log("errore: ", error);
                } finally {
                    setIsCheckingSession(false);  
                }
            };
            
            TokenPresoDalCookie();
        } 
    });  

    const {data: utente, isLoading, isError, error} = useQuery({ //principalmente questa chiamata mi serve per prendere le info sugli utenti che mi serviranno per essere stampate nei componenti, ma non è strettamente legata al login
                queryKey: ['user'],
                queryFn: async ({signal}) => {
                    const response = await fetch('/api/v1/users/me', {
                        signal: signal,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (!response.ok) {
                         const errorData = await response.json().catch(() => ({}));
                         throw new Error(errorData.detail || 'Failed to fetch user data');
                    }
                    return await response.json();
                },
                enabled: isLoggedIn, 
                staleTime: 1000 * 60 * 10, //di default vale zero ms, ma impostato a 10 min, implica che se cambio pagina non richiedo dati al backend per questo intervallo di tempo
            })
   
    const loginMutation = useMutation({

        mutationKey: ['login'],
        mutationFn: async ({ username, password }) => {
            const params = new URLSearchParams(); //perchè il backend si aspetta i dati in formato x-www-form-urlencoded
            params.append('username', username);
            params.append('password', password);
            let response;
            try {
                response = await fetch('/api/v1/login/access-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params 
                
            });
        } catch (networkError) {
            console.error("Errore durante la fetch:", networkError);
            throw new Error('Network error during login', { cause: networkError });
        }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Login failed');
            }
            
            return await response.json();
        },
        onSuccess: (data) => {
            const tokenRicevuto = data.access_token; 
            
            setAccessToken(tokenRicevuto);
            localStorage.setItem('accessToken', tokenRicevuto);
            navigate('/'); 
            
        },
        onError: (error) => {
            console.error("Errore durante il login:", error);
        }
    });

    
    const login = (username, password) => {
        if (isLoggedIn || !username || !password) {
            return;
        }
        loginMutation.mutate({ username, password });
    }



    const logout = () => {
        if (!isLoggedIn) {
            return;
        }
        setAccessToken('');
        localStorage.removeItem('accessToken');
    }

    return (
        <AuthContext.Provider value={{isLoggedIn, accessToken, login, logout, utente, isLoading, isError, error, isCheckingSession}}>
            {children}
        </AuthContext.Provider>
    )
            
}

export default AuthProvider;