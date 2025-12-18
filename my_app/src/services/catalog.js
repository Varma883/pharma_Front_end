import api from '../api/client';

export const catalogService = {
    // Get all drugs
    getAll: async () => {
        const response = await api.get('/catalog/drugs');
        return response.data;
    },

    // Get single drug by ID
    getById: async (id) => {
        const response = await api.get(`/catalog/drugs/${id}`);
        return response.data;
    },

    // Create new drug (Admin)
    create: async (data) => {
        const response = await api.post('/catalog/drugs', data);
        return response.data;
    },

    // Update drug (Admin)
    update: async (id, data) => {
        const response = await api.put(`/catalog/drugs/${id}`, data);
        return response.data;
    },

    // Delete drug (Admin)
    delete: async (id) => {
        const response = await api.delete(`/catalog/drugs/${id}`);
        return response.data;
    }
};
