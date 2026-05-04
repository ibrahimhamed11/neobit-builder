/**
 * AppSnackbar — Toast notification (success / error / info)
 *
 * Usage:
 *   <AppSnackbar visible={show} message="Saved!" type="success" onDismiss={() => setShow(false)} />
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppTheme } from '../../hooks/useAppTheme';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface AppSnackbarProps {
  visible: boolean;
  message: string;
  type?: SnackbarType;
  duration?: number;      // ms before auto-dismiss
  onDismiss: () => void;
}

const TYPE_CONFIG: Record<SnackbarType, { icon: string; bg: string }> = {
  success: { icon: 'check-circle-outline', bg: '#10B981' },
  error:   { icon: 'alert-circle-outline', bg: '#EF4444' },
  warning: { icon: 'alert-outline',        bg: '#F59E0B' },
  info:    { icon: 'information-outline',  bg: '#3B82F6' },
};

const AppSnackbar: React.FC<AppSnackbarProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}) => {
  const { fonts, spacing, borderRadius } = useAppTheme();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const config = TYPE_CONFIG[type];

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      const timer = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(onDismiss);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          marginHorizontal: spacing.base,
          opacity,
        },
      ]}
    >
      <Icon source={config.icon} size={20} color="#FFFFFF" />
      <Text style={[styles.text, { fontFamily: fonts.family.medium, fontSize: fonts.size.base }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  text: { color: '#FFFFFF', flex: 1 },
});

export default AppSnackbar;
