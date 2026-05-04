/**
 * Force Update Screen
 *
 * Shown when:
 *   - `force_update = "true"` in Firebase Remote Config, AND
 *   - Current app version < `minimum_version`
 *
 * The user CANNOT dismiss this screen — they must update before using the app.
 *
 * To trigger:
 *   Firebase Console → Remote Config →
 *     force_update     = "true"
 *     minimum_version  = "2.0.0"  ← version users must have
 *     store_url_ios    = "https://apps.apple.com/app/id..."
 *     store_url_android = "https://play.google.com/store/apps/details?id=..."
 *   → Publish
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-paper';

import AppButton from '../../components/AppButton';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { getStoreUrl, getMinimumVersion } from '../../services/remoteConfigService';
import { safeDeviceInfo } from '../../utils/safeDeviceInfo';

const ForceUpdateScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, fonts, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  const currentVersion = safeDeviceInfo.getVersion();
  const minimumVersion = getMinimumVersion();
  const storeUrl = getStoreUrl();

  const handleUpdate = async () => {
    if (!storeUrl) {
      Alert.alert(
        t('forceUpdate.title'),
        t('forceUpdate.description'),
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(storeUrl);
      if (supported) {
        await Linking.openURL(storeUrl);
      } else {
        Alert.alert(t('common.error'), t('common.error'));
      }
    } catch {
      Alert.alert(t('common.error'), t('common.error'));
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      {/* Hero gradient */}
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Icon source="rocket-launch-outline" size={56} color="#FFFFFF" />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={[styles.content, { paddingHorizontal: spacing.xl }]}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xxl },
          ]}
        >
          {t('forceUpdate.title')}
        </Text>

        <Text
          style={[
            styles.message,
            { color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: fonts.size.base, marginTop: spacing.md },
          ]}
        >
          {t('forceUpdate.description')}
        </Text>

        {/* Version info */}
        <View
          style={[
            styles.versionBadge,
            { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginTop: spacing.lg },
          ]}
        >
          <View style={styles.versionRow}>
            <Text style={[{ color: colors.textSecondary, fontSize: fonts.size.sm }]}>{t('forceUpdate.yourVersion')}</Text>
            <Text style={[{ color: colors.error, fontFamily: fonts.family.bold }]}>{currentVersion}</Text>
          </View>
          <View style={[styles.versionDivider, { backgroundColor: colors.border }]} />
          <View style={styles.versionRow}>
            <Text style={[{ color: colors.textSecondary, fontSize: fonts.size.sm }]}>{t('forceUpdate.requiredVersion')}</Text>
            <Text style={[{ color: colors.success, fontFamily: fonts.family.bold }]}>{minimumVersion}</Text>
          </View>
        </View>

        {/* Update button */}
        <AppButton
          label={t('forceUpdate.updateNow')}
          onPress={handleUpdate}
          style={{ marginTop: spacing.xl }}
          testID="force-update-btn"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
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
  versionBadge: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  versionDivider: { height: 1 },
});

export default ForceUpdateScreen;
