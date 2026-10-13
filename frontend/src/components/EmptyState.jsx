import {Info} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

function EmptyState({title, description, action, route}) {
    const navigate = useNavigate();

    return (
        <>
            <div className="empty-state">
                <Info />
                <h3>{title}</h3>
                <p>{description}</p>
                {action && route && (
                    <button type="button" onClick={() => navigate(route)}>
                        {action}
                    </button>
                )}
            </div>
        </>
    )
}
export default EmptyState;