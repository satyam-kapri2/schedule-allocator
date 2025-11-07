import { apiClient } from '@/config/api';

export const authService = {
  sendOtp: async (phone: string) => {
    const response = await apiClient.post('/v2/auth/send-otp', { phone });
    return response.data;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const response = await apiClient.post('/v2/auth/verify-otp', { phone, otp });
    return response.data;
  },
};
