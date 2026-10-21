import {Info} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import styles from '../styles/Emptystate.module.css';

function EmptyState({title, description, action, route}) {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.emptyState}>
                <Info />
                <h3>{title}</h3>
                <p>{description}</p>
                {action && route && (
                    <button className={styles.navigation} type="button" onClick={() => navigate(route)}>
                        {action}
                    </button>
                )}
            </div>
        </>
    )
}
export default EmptyState;