/**
 * {{APP_NAME}} — Session Events
 *
 * Used to emit a "session expired" event when the JWT refresh fails.
 * The app listens to this and navigates the user to Login.
 *
 * Note: Custom implementation - Node.js EventEmitter not available in React Native
 */

const listeners = new Set<() => void>();

export const emitSessionExpired = () => {
  listeners.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.warn('Error in session expired listener:', error);
    }
  });
};

export const onSessionExpired = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};
