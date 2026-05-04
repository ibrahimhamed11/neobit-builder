/**
 * AppListItem — Settings/menu style row
 *
 * Usage:
 *   <AppListItem
 *     icon="lock-outline"
 *     label="Change Password"
 *     onPress={handlePress}
 *     showChevron
 *   />
 *   <AppListItem icon="bell" label="Notifications" rightElement={<Switch ... />} />
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AppListItemProps {
  icon?: string;
  iconColor?: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  destructive?: boolean;            // red label (for "Delete Account", "Logout")
  style?: ViewStyle;
}

const AppListItem: React.FC<AppListItemProps> = ({
  icon,
  iconColor,
  label,
  sublabel,
  onPress,
  showChevron = true,
  rightElement,
  destructive = false,
  style,
}) => {
  const { colors, fonts, spacing, borderRadius } = useAppTheme();

  const labelColor = destructive ? colors.error : colors.text;
  const resolvedIconColor = iconColor ?? colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.base,
          backgroundColor: colors.card,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      {/* Left icon */}
      {icon && (
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: `${resolvedIconColor}18`,
              borderRadius: borderRadius.sm,
            },
          ]}
        >
          <Icon source={icon} size={20} color={resolvedIconColor} />
        </View>
      )}

      {/* Label + sublabel */}
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            { color: labelColor, fontFamily: fonts.family.medium, fontSize: fonts.size.base },
          ]}
        >
          {label}
        </Text>
        {sublabel && (
          <Text style={[styles.sublabel, { color: colors.textSecondary, fontSize: fonts.size.sm }]}>
            {sublabel}
          </Text>
        )}
      </View>

      {/* Right element or chevron */}
      {rightElement ?? (
        showChevron && onPress && (
          <Icon source="chevron-right" size={20} color={colors.textSecondary} />
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '500',
  },
  sublabel: {
    marginTop: 2,
  },
});

export default AppListItem;
