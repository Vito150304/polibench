import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUsers = () => {
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async ({signal}) => {
            try {
                const response = await fetch('/api/v1/users', {
                    signal,
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
    const {mutate: updateUserDetails, isPending, error} = useMutation({
        mutationKey: ['update-user-details'],
        mutationFn: async (userData) => {
            const response = await fetch(`/api/v1/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
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
        }
    });
    return { updateUserDetails, isPending, error };
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const {mutate: deleteUser, isPending, error} = useMutation({
        mutationKey: ['delete-user'],
        mutationFn: async () => {
            const response = await fetch(`/api/v1/users/me`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to delete user');
            }
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });
    return { deleteUser, isPending, error };
}
