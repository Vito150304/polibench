import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const {isLoggedIn, isCheckingSession} = useAuth();

    
    if (isCheckingSession) {
        return <div>Loading...</div>; //volendo ci posso mettere un'icona o componente di caricamento diverso
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }


    return children;
}
export default ProtectedRoute;