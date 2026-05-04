/**
 * Maintenance Screen
 *
 * Shown when `maintenance_mode = "true"` in Firebase Remote Config.
 * Text is pulled from Remote Config so you can update the message without an app release.
 *
 * To activate maintenance:
 *   Firebase Console → Remote Config → set `maintenance_mode` = "true" → Publish
 * To deactivate:
 *   Set `maintenance_mode` = "false" → Publish
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { getMaintenanceContent } from '../../services/remoteConfigService';

const MaintenanceScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, fonts, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  // TODO: Replace with your i18n current language
  const lang = 'en';
  const { title: remoteTitle, message: remoteMessage } = getMaintenanceContent(lang);
  const title = remoteTitle || t('maintenance.title');
  const message = remoteMessage || t('maintenance.description');

  // ── Pulse animation for the gear icon ────────────────────────────────────
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      {/* Icon */}
      <Animated.View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.primaryLight,
            transform: [{ scale: pulse }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon source="cog" size={52} color={colors.primary} />
        </Animated.View>
      </Animated.View>

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xxl, marginTop: spacing.xl },
        ]}
      >
        {title}
      </Text>

      {/* Message from Remote Config */}
      <Text
        style={[
          styles.message,
          { color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: fonts.size.base, marginTop: spacing.md },
        ]}
      >
        {message}
      </Text>

      {/* Decorative dots */}
      <View style={[styles.dots, { marginTop: spacing.xxxl }]}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === 1 ? colors.primary : colors.border }]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  message: {
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default MaintenanceScreen;
