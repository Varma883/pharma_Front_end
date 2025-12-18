import api from '../api/client';

export const orderService = {
    create: async (orderData) => {
        // POST http://localhost/orders
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    getAll: async () => {
        // GET http://localhost/orders
        const response = await api.get('/orders');
        return response.data;
    }
};
