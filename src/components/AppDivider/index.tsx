/**
 * AppDivider — Section separator
 *
 * Usage:
 *   <AppDivider />
 *   <AppDivider label="OR" />
 *   <AppDivider inset={16} />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppDividerProps {
  label?: string;
  inset?: number;           // left indent (for list separators)
  style?: ViewStyle;
}

const AppDivider: React.FC<AppDividerProps> = ({ label, inset = 0, style }) => {
  const { colors, fonts } = useAppTheme();

  if (label) {
    return (
      <View style={[styles.labeledRow, style]}>
        <View style={[styles.line, { backgroundColor: colors.divider }]} />
        <Text style={[styles.labelText, { color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: fonts.size.sm }]}>
          {label}
        </Text>
        <View style={[styles.line, { backgroundColor: colors.divider }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.divider, marginLeft: inset },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: { height: 1 },
  labeledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  line: { flex: 1, height: 1 },
  labelText: { textAlign: 'center' },
});

export default AppDivider;
