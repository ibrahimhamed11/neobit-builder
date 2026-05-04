/**
 * AppButton — Primary action button
 *
 * Usage:
 *   <AppButton label="Login" onPress={handleLogin} loading={isLoading} />
 *   <AppButton label="Cancel" variant="outline" onPress={cancel} />
 *   <AppButton label="Delete" variant="ghost" destructive onPress={del} />
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

type Variant = 'filled' | 'outline' | 'ghost';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  destructive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'filled',
  destructive = false,
  style,
  textStyle,
  testID,
}) => {
  const { colors, fonts, spacing, borderRadius } = useAppTheme();

  const baseColor = destructive ? colors.error : colors.primary;
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [
    styles.button,
    {
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      opacity: isDisabled ? 0.6 : 1,
    },
    variant === 'filled' && { backgroundColor: baseColor },
    variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: baseColor },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    style as ViewStyle,
  ];

  const labelColor =
    variant === 'filled'
      ? '#FFFFFF'
      : baseColor;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            { color: labelColor, fontFamily: fonts.family.semiBold, fontSize: fonts.size.md },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  label: { fontWeight: '600', textAlign: 'center' },
});

export default AppButton;
