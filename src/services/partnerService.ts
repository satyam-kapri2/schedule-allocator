import { apiClient } from '@/config/api';

export const partnerService = {
  getAllPartners: async (params?: { page?: number; pageSize?: number; serviceCategoryId?: string; serviceId?: string }) => {
    const response = await apiClient.get('/api/v1/partner/', { params });
    return response.data;
  },

  getPartnerById: async (partnerId: string) => {
    const response = await apiClient.get(`/api/v1/partner/${partnerId}`);
    return response.data;
  },

  getPartnerPublicProfile: async (partnerId: string) => {
    const response = await apiClient.get(`/api/v1/partner/${partnerId}/public-profile`);
    return response.data;
  },

  getPartnerSchedules: async (partnerId: string) => {
    const response = await apiClient.get(`/api/v1/partner/schedule/${partnerId}`);
    return response.data;
  },

  getPartnerDocuments: async (partnerId: string) => {
    const response = await apiClient.get(`/api/v1/partner/${partnerId}/documents`);
    return response.data;
  },

  createPartnerSlots: async (data: { partnerId: string; date: string; startTime: string; endTime: string; status?: string }) => {
    const response = await apiClient.post('/api/v1/partner/slots', data);
    return response.data;
  },

  deletePartnerSlots: async (partnerId: string, params: { date: string; startTime: string; endTime: string }) => {
    const response = await apiClient.delete(`/api/v1/partner/${partnerId}/slots`, { params });
    return response.data;
  },

  findAvailablePartners: async (data: any) => {
    const response = await apiClient.post('/api/v2/partner/availability/slots', data);
    return response.data;
  },
};
