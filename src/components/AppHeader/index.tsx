/**
 * AppHeader — Reusable screen header
 *
 * Usage:
 *   <AppHeader title="Home" showBack onBack={() => navigation.goBack()} />
 *   <AppHeader title="Profile" rightIcon="cog" onRightPress={openSettings} />
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

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  rightElement?: React.ReactNode;   // custom right side
  style?: ViewStyle;
  light?: boolean;                  // white text (for dark/gradient backgrounds)
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
  rightElement,
  style,
  light = false,
}) => {
  const { colors, fonts, spacing } = useAppTheme();

  const textColor = light ? '#FFFFFF' : colors.text;
  const iconColor = light ? '#FFFFFF' : colors.icon;

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.base }, style]}>
      {/* Left — back button or spacer */}
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.iconBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon source="arrow-left" size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center — title */}
      <View style={styles.center}>
        <Text
          style={[
            styles.title,
            {
              color: textColor,
              fontFamily: fonts.family.bold,
              fontSize: fonts.size.lg,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: light ? 'rgba(255,255,255,0.7)' : colors.textSecondary, fontSize: fonts.size.sm },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right — action or spacer */}
      <View style={styles.side}>
        {rightElement ?? (
          rightIcon && onRightPress ? (
            <TouchableOpacity
              onPress={onRightPress}
              style={styles.iconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon source={rightIcon} size={24} color={iconColor} />
            </TouchableOpacity>
          ) : null
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    padding: 4,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 1,
  },
});

export default AppHeader;
