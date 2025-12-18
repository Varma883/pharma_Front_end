import api from '../api/client';

export const adminService = {
    // Inventory
    getInventory: async (id) => {
        // GET http://localhost/inventory/{id}
        const response = await api.get(`/inventory/${id}`);
        return response.data;
    },

    updateStock: async (stockData) => {
        // POST http://localhost/inventory/admin/set-stock
        const response = await api.post('/inventory/admin/set-stock', stockData);
        return response.data;
    },

    // Users (Superadmin)
    getUsers: async () => {
        // GET http://localhost/auth/users
        const response = await api.get('/auth/users');
        return response.data;
    }
};
