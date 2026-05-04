/**
 * AppBadge — Notification count badge
 *
 * Usage:
 *   <AppBadge count={5} />
 *   <AppBadge dot />           // just a dot, no number
 *   <AppBadge count={99} max={99} />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppBadgeProps {
  count?: number;
  max?: number;           // default 99
  dot?: boolean;
  color?: string;
  style?: ViewStyle;
}

const AppBadge: React.FC<AppBadgeProps> = ({
  count = 0,
  max = 99,
  dot = false,
  color,
  style,
}) => {
  const { colors, fonts } = useAppTheme();
  const bg = color ?? colors.error;

  if (dot) {
    return <View style={[styles.dot, { backgroundColor: bg }, style]} />;
  }

  if (!count || count <= 0) return null;

  const label = count > max ? `${max}+` : String(count);

  return (
    <View style={[styles.badge, { backgroundColor: bg, minWidth: 18 }, style]}>
      <Text style={[styles.text, { fontFamily: fonts.family.bold, fontSize: fonts.size.xs }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#FFFFFF', lineHeight: 14 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export default AppBadge;
