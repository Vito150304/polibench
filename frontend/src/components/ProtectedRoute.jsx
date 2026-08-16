import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const {isLoggedIn, isLoadingWithCookie} = useAuth();

    //devo gestire il caso di login con cookie. 
    // a livello di token,e di conseguenza di isLoggedIn, non cambia nulla. 
    // La differenza sta nei tempi (useEffect vs ProtectedRoute): all'avvio
    // localStorage è vuoto, quindi React pensa temporaneamente che l'utente 
    // non sia autenticato mentre la chiamata asincrona di recupero del cookie 
    // è ancora in volo (tempi dettati da useEffect). 
    // Se ProtectedRoute agisce subito, reindirizza l'utente a /login prima che 
    // la chiamata al refresh-token finisca.
    if (isLoadingWithCookie) {
        return <div>Loading...</div>; //volendo ci posso mettere un'icona o componente di caricamento diverso
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }


    return children;
}
export default ProtectedRoute;