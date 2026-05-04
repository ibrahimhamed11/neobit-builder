/**
 * EmptyState — Empty list / zero-data placeholder
 *
 * Usage:
 *   <EmptyState
 *     icon="inbox-outline"
 *     title="Nothing here yet"
 *     subtitle="Your items will appear here once you add them."
 *     actionLabel="Get Started"
 *     onAction={handleAction}
 *   />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppTheme } from '../../hooks/useAppTheme';
import AppButton from '../AppButton';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors, fonts, spacing } = useAppTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxxl }, style]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <Icon source={icon} size={40} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.lg, marginTop: spacing.lg }]}>
        {title}
      </Text>

      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: fonts.size.base, marginTop: spacing.xs }]}>
          {subtitle}
        </Text>
      )}

      {actionLabel && onAction && (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          style={{ marginTop: spacing.xl }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { textAlign: 'center', fontWeight: '700' },
  subtitle: { textAlign: 'center', lineHeight: 22 },
});

export default EmptyState;
