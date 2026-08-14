import {useState, useEffect} from "react";
import {AuthContext} from "./AuthContext";
import {useMutation, useQuery} from "@tanstack/react-query";


function AuthProvider({children}) {

    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem('accessToken') || '';
    });
    //const [utente, setUtente] = useState(null); non serve perchè si deriva da useQuery
    const isLoggedIn = !!accessToken; //posso derivare lo stato di login dal token


    //LOGIN CON GOOGLE, FLUSSO:
    
    
    //1) Fai il login con Google.

    //2) Il backend ti imposta il cookie invisibile (che dura solo 2 minuti, max_age=120) e ti ributta sul frontend.

    //3) Il tuo frontend, non appena si avvia e capisce di non avere il token nel localStorage, bussa alla rotta /refresh-token.

    //4) Il browser invia automaticamente il cookie invisibile.

    //5) Il backend lo riconosce, ti dice "Ok, sei tu!" e ti restituisce finalmente il token in formato JSON classico, che tu puoi salvare nel localStorage.



    // voglio prendere il token dal cookie, strategia utilizzata per il login con Google.
    useEffect(() => {
        // Se NON abbiamo il token, forse stiamo tornando da Google con il Cookie!
        // Proviamo a "scambiare" il cookie per un vero token
        if (!accessToken) {
            const TokenPresoDalCookie = async () => {
                try {
                    const res = await fetch('/api/v1/login/refresh-token', {
                        method: 'GET',
                        // QUESTO È FONDAMENTALE: dice al browser di allegare il cookie invisibile!
                        credentials: 'include' 
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        const tokenNuovo = data.access_token;
                        
                        setAccessToken(tokenNuovo);
                        localStorage.setItem('accessToken', tokenNuovo);
                    }
                } catch (error) {
                    // Se fallisce, significa semplicemente che non c'era nessun cookie.
                    // L'utente non è loggato in alcun modo. Tutto normale.
                    console.log("errore: ", error);
                }
            };
            
            TokenPresoDalCookie();
        }
    }, [accessToken]); // Dipende da accessToken


    const {data: utente, isLoading, isError, error} = useQuery({ //principalmente questa chiamata mi serve per prendere le info sugli utenti che mi serviranno per essere stampate nei componenti, ma non è strettamente legata al login
                queryKey: ['user'],
                queryFn: async ({signal}) => {
                    const res = await fetch('/api/v1/users/me', {
                        signal: signal,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (!res.ok) {
                        throw new Error('Failed to fetch user');
                    }
                    return await res.json();
                },
                enabled: isLoggedIn, //Poichè useQuery parte già all'avvio,
                //  avrei un 401 ancora prima di dare la possibilità di mettere i dati.
                // la query viene eseguita solo se l'utente è loggato
            })
   
    const loginMutation = useMutation({

        
        mutationFn: async ({ username, password }) => {
            const params = new URLSearchParams(); //perchè il backend si aspetta i dati in formato x-www-form-urlencoded
            params.append('username', username);
            params.append('password', password);

            const response = await fetch('/api/v1/login/access-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params //non si fa JSON.stringify perchè il backend si aspetta i dati in formato x-www-form-urlencoded e non JSON
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            return await response.json();
        },
        // Cosa fare quando la chiamata ha successo:
        onSuccess: (data) => {
            // Il backend restituisce "access_token" con l'underscore
            const tokenRicevuto = data.access_token; 
            
            setAccessToken(tokenRicevuto);
            localStorage.setItem('accessToken', tokenRicevuto);
            
            
        },
        onError: (error) => {
            console.error("Errore durante il login:", error);
        }
    });

    // 3. La tua funzione login ora diventa un semplice "grilletto"
    const login = (username, password) => {
        if (isLoggedIn || !username || !password) {
            return;
        }
        // Fa partire la mutation passando i dati
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
        <AuthContext.Provider value={{isLoggedIn, accessToken, login, logout, utente, isLoading, isError, error}}>
            {children}
        </AuthContext.Provider>
    )
            
}

export default AuthProvider;