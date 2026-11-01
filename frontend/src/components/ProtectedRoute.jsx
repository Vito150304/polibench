import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';

function ProtectedRoute({ children, requireSuperuser = false }) {
    const {isLoggedIn, isCheckingSession, utente, isLoading, isError} = useAuth();

    if (isCheckingSession) {
        return <div>Loading...</div>; //volendo ci posso mettere un'icona o componente di caricamento diverso
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // per le pagine riservate al superuser serve sapere chi è l'utente
    if (requireSuperuser) {
        if (isLoading) {
            return <div>Loading...</div>;
        }
        if (isError) {
            return <div>Could not verify your permissions. Please try again.</div>;
        }
        if (!utente?.is_superuser) {
            return (
                <div>
                    <h1>Access denied</h1>
                    <p>You do not have permission to view this page.</p>
                    <Link to="/">Back to the home page</Link>
                </div>
            );
        }
    }

    return children;
}
export default ProtectedRoute;