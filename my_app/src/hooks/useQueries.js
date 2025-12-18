import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogService } from '../services/catalog';
import { orderService } from '../services/orders';
import { adminService } from '../services/admin';

// Catalog Queries
export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: catalogService.getAll,
    });
};

export const useProduct = (id) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => catalogService.getById(id),
        enabled: !!id,
    });
};

// Order Queries
export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: orderService.getAll,
    });
};

// Inventory Queries (Admin)
export const useInventory = (id) => {
    return useQuery({
        queryKey: ['inventory', id],
        queryFn: () => adminService.getInventory(id),
        enabled: !!id,
    });
};

// Mutations
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orderService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['orders']);
        },
    });
};

export const useUpdateStock = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.updateStock,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['inventory', variables.product_id]);
            queryClient.invalidateQueries(['products', variables.product_id]);
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => catalogService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['products']);
            queryClient.invalidateQueries(['products', variables.id]);
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: catalogService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
};
