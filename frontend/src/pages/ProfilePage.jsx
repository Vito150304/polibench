import {useUpdateUserDetails} from '../hooks/useUsers';
import { useState } from 'react';
import  {useAuth}  from '../contexts/AuthContext';
import {useDeleteUser} from '../hooks/useUsers';
import styles from '../styles/ProfilePage.module.css';


function ProfilePage() {

    const { utente, isLoading, error } = useAuth();
    const {updateUserDetails, isPending} = useUpdateUserDetails();
    const {deleteUser, isPending: isDeleting} = useDeleteUser();
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    if (isLoading || isPending) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error fetching user: {error.message}</div>;
    }

    if (isDeleting) {
        return <div>Deleting user...</div>;
    }

    const handleUpdateUser = (e) => {
        e.preventDefault();
        const payload = {};
        if (name) payload.first_name = name;
        if (lastName) payload.last_name = lastName;
        if (email) payload.email = email;
        updateUserDetails(payload);
    };

    const handleDeleteUser = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            deleteUser();
        }
    };

    return (
        <>  
            <h3>User Details</h3>
            <p className={styles.userName}>{utente.first_name} {utente.last_name}</p>
            <p className={styles.userEmail}>Email: {utente.email}</p>
            <p>{utente.isActive}</p>
            <p>{utente.isVerified}</p>
            <form onSubmit={handleUpdateUser}>
                <h3>Update Profile</h3>
                <div className={styles.inputContainer}>
                <label>
                    First Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Last Name:
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <div className={styles.buttonUpdate}>
                <button type="submit" disabled={isPending || (!name && !lastName && !email)}>Update Profile</button>
                </div>
                </div>
            </form>

            {/*chiedere a raffaele se solo il superuser può cambiare la password perché altrimenti non troverei l'endpoint*/}
            <div className={styles.button}>
                <button onClick={handleDeleteUser} disabled={isDeleting}>Delete Account</button>
            </div>
        </>

    );
}
export default ProfilePage;





