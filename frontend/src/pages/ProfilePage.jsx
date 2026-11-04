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

    if (isLoading) {
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
        if (name.trim()) payload.first_name = name.trim();
        if (lastName.trim()) payload.last_name = lastName.trim();
        if (email.trim()) payload.email = email.trim();
        updateUserDetails(payload);
    };

    const handleDeleteUser = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            deleteUser();
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Profile</h1>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>User Details</h2>
                {utente?.first_name && (
                    <p><span className={styles.label}>Name:</span> {utente.first_name} {utente.last_name}</p>
                )}
                {utente?.email && (
                    <p><span className={styles.label}>Email:</span> {utente.email}</p>
                )}
                <p><span className={styles.label}>Account status:</span> {utente.is_active ? 'Active' : 'Inactive'}</p>
                <p><span className={styles.label}>Email verification:</span> {utente.is_verified ? 'Verified' : 'Not verified'}</p>
                {!utente.is_verified && (
                    <p className={styles.warning}>
                        Your email is not verified yet, so you cannot create datasets, models or experiments.
                        Open the verification link you received, or use "Resend verification email" on the login page.
                    </p>
                )}
            </section>

            <form onSubmit={handleUpdateUser} className={styles.card}>
                <h2 className={styles.cardTitle}>Update Profile</h2>
                <p className={styles.hint}>Fill in only the fields you want to change.</p>
                <label className={styles.field}>
                    <span className={styles.label}>First name</span>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={utente.first_name} />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Last name</span>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={utente.last_name} />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={utente.email} />
                </label>
                <div className={styles.actions}>
                    <button type="submit" disabled={isPending || (!name.trim() && !lastName.trim() && !email.trim())}>
                        {isPending ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </form>

            <section className={styles.dangerCard}>
                <h2 className={styles.cardTitle}>Delete Account</h2>
                <p>Deleting your account is permanent and cannot be undone.</p>
                <button type="button" className={styles.danger} onClick={handleDeleteUser} disabled={isDeleting}>
                    Delete Account
                </button>
            </section>
        </div>
    );
}
export default ProfilePage;