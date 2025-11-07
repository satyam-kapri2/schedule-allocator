import { apiClient } from '@/config/api';

export const orderService = {
  getAllOrders: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get('/v2/admin/order-items', { params });
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await apiClient.get(`/v2/admin/order-items/${orderId}`);
    return response.data;
  },
};
