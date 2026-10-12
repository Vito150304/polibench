import { useUsers } from '../hooks/useUsers';
import { useState } from 'react';

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
        <>
            <p>Select a user to view details</p> 
            <div className="Users-list">
                <ul>
                    {users.map(user => (
                        <li key={user.uuid} onClick={() => setSelectedUser(user)}>
                            {user.first_name} {user.last_name} ({user.email})
                        </li>
                    ))}
                </ul>
            </div>
            {selectedUser && (
                <div className="User-details">
                    <h3>User Details</h3>
                    <p>{selectedUser.first_name} {selectedUser.last_name}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>{selectedUser.isActive}</p>
                    <p>{selectedUser.isVerified}</p>
                </div>
            )}
        </>
    );
}
export default UsersPage;