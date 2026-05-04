/**
 * AppCard — Reusable card container with shadow
 *
 * Usage:
 *   <AppCard>
 *     <Text>Any content</Text>
 *   </AppCard>
 *
 *   <AppCard onPress={handlePress} style={{ marginBottom: 12 }}>
 *     <Text>Pressable card</Text>
 *   </AppCard>
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
}

const AppCard: React.FC<AppCardProps> = ({
  children,
  onPress,
  style,
  padded = true,
}) => {
  const { colors, borderRadius, shadows, spacing } = useAppTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      ...shadows.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    padded && { padding: spacing.base },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.75}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
});

export default AppCard;
