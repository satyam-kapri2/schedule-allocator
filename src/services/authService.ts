import { apiClient } from '@/config/api';

export const authService = {
  sendOtp: async (phoneNumber: string) => {
    const response = await apiClient.post('/api/v1/user/send-otp', { phoneNumber });
    return response.data;
  },

  verifyOtp: async (phoneNumber: string, otp: string) => {
    const response = await apiClient.post('/api/v1/user/phone-register-verify', { phoneNumber, otp });
    return response.data;
  },
};
