import {useUpdateUserDetails} from '../hooks/useUsers';
import { useState } from 'react';
import { useAuth } from '../hooks/AuthProvider';
import {useDeleteUser} from '../hooks/useUsers';


function ProfilePage() {

    const { utente, isLoading, error } = useAuth();
    const {updateUserDetails, isPending, error: updateError} = useUpdateUserDetails();
    const {deleteUser, isPending: isDeleting, error: deleteError} = useDeleteUser();
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
            <div className="User-details">
                <h3>User Details</h3>
                <p>{utente.first_name} {utente.last_name}</p>
                <p>Email: {utente.email}</p>
                <p>{utente.isActive}</p>
                <p>{utente.isVerified}</p>
            </div>
            <form onSubmit={handleUpdateUser}>
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
                <button type="submit" disabled={isPending || (!name && !lastName && !email)}>Update Profile</button>
                {updateError && <p>Error updating user: {updateError.message}</p>}
            </form>

            {/*chiedere a raffaele se solo il superuser può cambiare la password perché altrimenti non troverei l'endpoint*/}

            <button onClick={handleDeleteUser} disabled={isDeleting}>Delete Account</button>
            {deleteError && <p>Error deleting user: {deleteError.message}</p>}
        </>

    );
}
export default ProfilePage;





