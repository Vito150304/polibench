import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useUsers = () => {
    const { accessToken } = useAuth();
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async ({signal}) => {
            try {
                const response = await fetch('/api/v1/users', {
                    signal,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Failed to fetch users');
                }
                const data = await response.json();
                return data;
            } catch (networkError) {
                console.error('Error fetching users:', networkError);
                throw new Error('Failed to fetch users', { cause: networkError });
            }
        }
    });
    return { users, isLoading, error };
}

export const useUpdateUserDetails = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();
    const {mutate: updateUserDetails, isPending, error} = useMutation({
        mutationKey: ['update-user-details'],
        mutationFn: async (userData) => {
            const response = await fetch(`/api/v1/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to update user');
            }
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('User details updated successfully');
        },
        onError: (error) => {
            console.error('Error updating user details:', error);
            toast.error(error.message || 'Failed to update user details');
        }
    });
    return { updateUserDetails, isPending, error };
}

export const useDeleteUser = () => {
    const { logout, accessToken } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {mutate: deleteUser, isPending, error} = useMutation({
        mutationKey: ['delete-user'],
        mutationFn: async () => {
            const response = await fetch(`/api/v1/users/me`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to delete user');
            }
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('User deleted successfully');
            logout(); 
            navigate('/login');
        },
        onError: (error) => {
            console.error('Error deleting user:', error);
            toast.error(error.message || 'Failed to delete user');
        }
    });
    return { deleteUser, isPending, error };
}
