import { Platform } from 'react-native';
import api from '../client';
import { ENDPOINTS } from '../endpoints';

export const fcmApi = {
  /**
   * POST /fcm-tokens
   * Registers the device's FCM push token with your backend.
   * Call this after login so your backend can send push notifications to this device.
   *
   * Body: { fcmToken, platform, deviceName? }
   */
  register: async (fcmToken: string, deviceName?: string) => {
    const { data } = await api.post(ENDPOINTS.FCM_TOKENS.REGISTER, {
      fcmToken,
      deviceName,
      platform: Platform.OS,
    });
    return data;
  },

  /**
   * DELETE /fcm-tokens
   * Unregisters the push token on logout.
   * Body: { fcmToken }
   */
  remove: async (fcmToken: string) => {
    const { data } = await api.delete(ENDPOINTS.FCM_TOKENS.REMOVE, {
      data: { fcmToken },
    });
    return data;
  },
};
