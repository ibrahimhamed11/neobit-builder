/**
 * AppInput — Form text input with label, icon, and error state
 *
 * Usage:
 *   <AppInput label="Email" value={email} onChangeText={setEmail} leftIcon="email" />
 *   <AppInput label="Password" secureTextEntry error="Required" />
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  testID,
  ...rest
}) => {
  const { colors, fonts, spacing, borderRadius } = useAppTheme();
  const hasError = !!error;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: fonts.family.medium, fontSize: fonts.size.sm }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.inputBackground,
            borderRadius: borderRadius.md,
            borderWidth: 1.5,
            borderColor: hasError ? colors.error : colors.border,
            paddingHorizontal: spacing.sm,
            minHeight: 48,
          },
        ]}
      >
        {leftIcon && (
          <Icon source={leftIcon} size={20} color={hasError ? colors.error : colors.textSecondary} />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              fontFamily: fonts.family.regular,
              fontSize: fonts.size.base,
              flex: 1,
              marginHorizontal: spacing.xs,
            },
          ]}
          placeholderTextColor={colors.placeholder}
          testID={testID}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon source={rightIcon} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <Text style={[styles.error, { color: colors.error, fontFamily: fonts.family.regular, fontSize: fonts.size.sm }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { marginBottom: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { paddingVertical: 10 },
  error: { marginTop: 4 },
});

export default AppInput;
