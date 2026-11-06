import { useUsers } from '../hooks/useUsers';
import { useState } from 'react';
import styles from '../styles/UsersPage.module.css';

function UsersPage() {

    const { users, isLoading, error } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching users: {error.message}</div>;
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Users</h1>
            <p className={styles.note}>Select a user to view details.</p>

            <div className={styles.layout}>
                <ul className={styles.list}>
                    {users.map(user => (
                        <li key={user.uuid}>
                            <button
                                type="button"
                                className={selectedUser?.uuid === user.uuid ? `${styles.userButton} ${styles.selected}` : styles.userButton}
                                onClick={() => setSelectedUser(user)}
                            >
                                {user.first_name} {user.last_name} ({user.email})
                            </button>
                        </li>
                    ))}
                </ul>

                {selectedUser && (
                    <section className={styles.details}>
                        <h2 className={styles.detailsTitle}>User Details</h2>
                        {selectedUser?.first_name && selectedUser?.last_name && (
                            <p><span className={styles.label}>Name:</span> {selectedUser.first_name} {selectedUser.last_name}</p>
                        )}
                        <p><span className={styles.label}>Email:</span> {selectedUser.email}</p>
                        <p><span className={styles.label}>Account status:</span> {selectedUser.is_active ? 'Active' : 'Inactive'}</p>
                        <p><span className={styles.label}>Email verification:</span> {selectedUser.is_verified ? 'Verified' : 'Not verified'}</p>
                        <p><span className={styles.label}>Account type:</span> {selectedUser.is_superuser ? 'Administrator' : 'Standard user'}</p>
                    </section>
                )}
            </div>
        </div>
    );
}
export default UsersPage;