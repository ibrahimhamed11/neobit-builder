/**
 * ScreenWrapper — Safe area container with optional scroll
 *
 * Usage:
 *   <ScreenWrapper scroll>
 *     <Text>Content</Text>
 *   </ScreenWrapper>
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;                     // adds horizontal padding
  onRefresh?: () => void;               // enables pull-to-refresh
  refreshing?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  statusBarStyle?: 'light-content' | 'dark-content';
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scroll = false,
  padded = true,
  onRefresh,
  refreshing = false,
  style,
  contentStyle,
  statusBarStyle,
}) => {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background, paddingTop: insets.top },
    style,
  ];

  const innerStyle = [
    padded && { paddingHorizontal: spacing.base },
    contentStyle,
  ];

  const barStyle = statusBarStyle ?? (colors.background === '#FFFFFF' ? 'dark-content' : 'light-content');

  if (scroll) {
    return (
      <View style={containerStyle}>
        <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[innerStyle, { paddingBottom: insets.bottom + spacing.xl }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[containerStyle, innerStyle as ViewStyle]}>
      <StatusBar barStyle={barStyle} backgroundColor={colors.background} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ScreenWrapper;
