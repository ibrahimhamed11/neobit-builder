/**
 * {{APP_NAME}} — Notification Service
 * Push notification token management
 *
 * This is a stub implementation. To enable push notifications:
 * 1. Install @react-native-firebase/messaging
 * 2. Configure FCM in your Firebase console
 * 3. Implement getToken() to return the FCM token
 */

export const notificationService = {
  async getToken(): Promise<string | null> {
    console.warn('[{{APP_NAME}}] notificationService.getToken() not implemented');
    return null;
  },
};

export default notificationService;
