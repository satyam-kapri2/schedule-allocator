import { apiClient, API_BASE_URL } from '@/config/api';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const partnerService = {
  getAllPartners: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/v2/admin/partners', { params });
    return response.data;
  },

  getPartnerById: async (partnerId: string) => {
    const response = await apiClient.get(`/v2/admin/partners/${partnerId}`);
    return response.data;
  },

  getPartnerPublicProfile: async (partnerId: string) => {
    const response = await apiClient.get(`/v2/admin/partners/${partnerId}/public-profile`);
    return response.data;
  },

  getPartnerSchedules: async (partnerId: string) => {
    const response = await apiClient.get(`/v2/admin/partners/${partnerId}/schedules`);
    return response.data;
  },

  getPartnerDocuments: async (partnerId: string) => {
    const response = await apiClient.get(`/v2/admin/partners/${partnerId}/documents`);
    return response.data;
  },

  createPartnerSlots: async (partnerId: string, data: any) => {
    const response = await apiClient.post(`/v2/admin/partners/${partnerId}/slots`, data);
    return response.data;
  },

  deletePartnerSlots: async (partnerId: string, slotIds: string[]) => {
    const response = await apiClient.delete(`/v2/admin/partners/${partnerId}/slots`, {
      data: { slot_ids: slotIds },
    });
    return response.data;
  },

  findAvailablePartners: async (data: any) => {
    const token = useAuthStore.getState().token;
    const response = await axios.post(
      `${API_BASE_URL}/v2/partner/availability/slots`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
