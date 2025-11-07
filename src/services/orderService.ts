import { apiClient } from '@/config/api';

export const orderService = {
  getAllOrders: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get('/api/v1/order/', { params });
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await apiClient.get(`/api/v1/order/${orderId}`);
    return response.data;
  },
};
