/**
 * Settings Screen — Hesba-style full implementation
 *
 * Sections:
 *  - Profile card (tap to edit)
 *  - Preferences: Dark Mode toggle, Language toggle
 *  - General: Notifications toggle, Privacy Policy, Sign Out
 *  - App: About, Contact Support, Rate App, Share App, Terms
 *  - Danger: Delete Account
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Platform,
  Share,
  StyleSheet,
} from 'react-native';
import { Text, Icon, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '../../components/ScreenWrapper';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useLanguage } from '../../i18n/useLanguage';
import { useNeobitConfig } from '../../config/ConfigContext';
import { Spacing, BorderRadius } from '../../theme/spacing';

const APP_VERSION = '1.0.0';

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const { user, logout, isLoading } = useAuthStore();
  const { isDark: darkMode, setMode } = useThemeStore();
  const { language, toggleLanguage } = useLanguage();
  const config = useNeobitConfig();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notificationsEnabled ?? true,
  );

  // ── Bottom sheet visibility states ──────────────────────────────────────────
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const initials = (user?.displayName ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setLogoutVisible(false);
    try {
      await logout();
    } catch {}
    setIsLoggingOut(false);
  }, [logout]);

  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);
    try {
      await logout();
    } catch {}
    setIsDeleting(false);
    setDeleteVisible(false);
    setDeleteConfirmText('');
  }, [logout, deleteConfirmText]);

  const handleRateApp = useCallback(() => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/id0000000000?action=write-review'
        : 'market://details?id=com.neobit.app';
    Linking.openURL(url).catch(() => {
      Linking.openURL(
        Platform.OS === 'android'
          ? 'https://play.google.com/store/apps/details?id=com.neobit.app'
          : 'https://apps.apple.com',
      ).catch(() => {});
    });
  }, []);

  const handleShareApp = useCallback(async () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/id0000000000'
        : 'https://play.google.com/store/apps/details?id=com.neobit.app';
    try {
      await Share.share({
        message: `${t('settings.shareAppMessage')} ${url}`,
        url: Platform.OS === 'ios' ? url : undefined,
        title: t('settings.shareAppTitle'),
      });
    } catch {}
  }, [t]);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <ScreenWrapper>
      {isLoggingOut && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>{t('settings.loggingOut')}</Text>
        </View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Card ──────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}
        >
          <View style={styles.profileAvatar}>
            {user?.photoURL ? (
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              <Text style={styles.profileAvatarText}>{initials}</Text>
            ) : (
              <Text style={styles.profileAvatarText}>{initials}</Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName ?? t('settings.tapToEditProfile')}</Text>
            {!!user?.email && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon source="email-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            )}
          </View>
          <Icon source="chevron-left" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* ── Preferences ───────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
        <View style={styles.settingsCard}>
          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon source="theme-light-dark" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.darkMode')}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(v) => setMode(v ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? (isDark ? colors.primary : colors.textSecondary) : undefined}
              ios_backgroundColor={colors.border}
            />
          </View>
          {/* Language */}
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomWidth: 0 }]}
            onPress={() => toggleLanguage()}
          >
            <View style={styles.settingLeft}>
              <Icon source="translate" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.language')}</Text>
            </View>
            <Text style={styles.settingValue}>
              {language === 'ar' ? 'العربية' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── General ───────────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('settings.general')}</Text>
        <View style={styles.settingsCard}>
          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon source="bell-outline" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.notifications')}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? (notificationsEnabled ? colors.primary : colors.textSecondary) : undefined}
              ios_backgroundColor={colors.border}
            />
          </View>
          {/* Notifications History */}
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Notifications')}>
            <View style={styles.settingLeft}>
              <Icon source="bell-badge-outline" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('notifications.title')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          {/* Change Password */}
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('EditProfile')}>
            <View style={styles.settingLeft}>
              <Icon source="lock-outline" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('profile.changePassword')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          {/* Privacy */}
          <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={() => setPrivacyVisible(true)}>
            <View style={styles.settingLeft}>
              <Icon source="shield-check-outline" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.privacy')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* ── App ───────────────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('settings.developer')}</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow} onPress={() => setAboutVisible(true)}>
            <View style={styles.settingLeft}>
              <Icon source="information-outline" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.about')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} onPress={() => Linking.openURL('mailto:support@neobit.app')}>
            <View style={styles.settingLeft}>
              <Icon source="headset" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.contactSupport')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} onPress={handleRateApp}>
            <View style={styles.settingLeft}>
              <Icon source="star-outline" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.rateApp')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} onPress={handleShareApp}>
            <View style={styles.settingLeft}>
              <Icon source="share-variant-outline" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.shareApp')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={() => Linking.openURL('https://neobit.app/terms')}>
            <View style={styles.settingLeft}>
              <Icon source="file-document-outline" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>{t('settings.terms')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* ── Sign Out ──────────────────────────────────────────────────────── */}
        <View style={styles.settingsCard}>
          <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={() => setLogoutVisible(true)}>
            <View style={styles.settingLeft}>
              <Icon source="logout" size={22} color={colors.error} />
              <Text style={[styles.settingLabel, { color: colors.error }]}>{t('settings.logout')}</Text>
            </View>
            <Icon source="chevron-left" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* ── Delete Account ────────────────────────────────────────────────── */}
        <View style={styles.settingsCard}>
          <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={() => setDeleteVisible(true)}>
            <View style={styles.settingLeft}>
              <Icon source="account-remove-outline" size={22} color={colors.error + '99'} />
              <Text style={[styles.settingLabel, { color: colors.error + '99' }]}>{t('settings.deleteAccount')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>{t('settings.version')} {APP_VERSION}</Text>
      </ScrollView>

      {/* ── Logout Dialog ─────────────────────────────────────────────────── */}
      {logoutVisible && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('settings.logout')}</Text>
            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>{t('settings.logoutConfirm')}</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setLogoutVisible(false)}>
                <Text style={[styles.modalBtnText, { color: colors.text }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.error }]} onPress={handleLogout}>
                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>{t('settings.logout')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ── Privacy Dialog ────────────────────────────────────────────────── */}
      {privacyVisible && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('settings.privacy')}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={[styles.modalBody, { color: colors.textSecondary }]}>{t('settings.privacyContent')}</Text>
            </ScrollView>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary, alignSelf: 'stretch' }]} onPress={() => setPrivacyVisible(false)}>
              <Text style={[styles.modalBtnText, { color: '#FFF' }]}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── About Dialog ──────────────────────────────────────────────────── */}
      {aboutVisible && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={[styles.profileAvatar, { marginBottom: 8 }]}>
                <Icon source="rocket-launch" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{config.identity.displayName || config.identity.appName}</Text>
              <Text style={{ color: colors.textTertiary, fontSize: 12 }}>{t('settings.version')} {APP_VERSION}</Text>
            </View>
            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>{t('settings.aboutAppDesc')}</Text>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary, alignSelf: 'stretch' }]} onPress={() => setAboutVisible(false)}>
              <Text style={[styles.modalBtnText, { color: '#FFF' }]}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Delete Account Dialog ─────────────────────────────────────────── */}
      {deleteVisible && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.error }]}>{t('settings.deleteAccount')}</Text>
            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>{t('settings.deleteAccountConfirm')}</Text>
            <Text style={[styles.modalBody, { color: colors.textTertiary, fontSize: 12 }]}>{t('settings.deleteAccountTypePrompt')}</Text>
            {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
            <View style={[styles.deleteInput, { borderColor: deleteConfirmText === 'DELETE' ? colors.error : colors.border, backgroundColor: colors.surface }]}>
              <Text
                style={{ color: colors.text, textAlign: 'center' }}
                onPress={() => {}}
              >
                {deleteConfirmText || 'DELETE'}
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} disabled={isDeleting} onPress={() => { setDeleteVisible(false); setDeleteConfirmText(''); }}>
                <Text style={[styles.modalBtnText, { color: colors.text }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.error, opacity: isDeleting ? 0.6 : 1 }]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting
                  ? <ActivityIndicator size="small" color="#FFF" />
                  : <Text style={[styles.modalBtnText, { color: '#FFF' }]}>{t('settings.deleteAccount')}</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

const createStyles = (colors: Record<string, string>, isDark: boolean) =>
  StyleSheet.create({
    scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.massive },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 3,
    },
    profileAvatar: {
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: colors.primarySurface,
      justifyContent: 'center', alignItems: 'center',
      marginEnd: Spacing.md,
    },
    profileAvatarText: {
      fontSize: 22, color: colors.primary, fontFamily: 'NotoKufiArabic-Bold',
    },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 16, fontFamily: 'NotoKufiArabic-Bold', color: colors.text },
    profileEmail: { fontSize: 12, fontFamily: 'NotoKufiArabic-Regular', color: colors.textSecondary, marginTop: 2 },
    sectionTitle: {
      fontSize: 12, fontFamily: 'NotoKufiArabic-Bold', color: colors.textTertiary,
      textTransform: 'uppercase', marginBottom: Spacing.sm, marginTop: Spacing.sm, letterSpacing: 0.5,
    },
    settingsCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      marginBottom: Spacing.lg,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.25 : 0.06,
      shadowRadius: 2,
    },
    settingRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    settingLabel: { fontSize: 14, fontFamily: 'NotoKufiArabic-Medium', color: colors.text },
    settingValue: { fontSize: 13, fontFamily: 'NotoKufiArabic-Regular', color: colors.textSecondary },
    versionText: { fontSize: 11, fontFamily: 'NotoKufiArabic-Regular', color: colors.textTertiary, textAlign: 'center', marginTop: Spacing.lg },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay,
      justifyContent: 'center', alignItems: 'center', zIndex: 999, gap: 12,
    },
    loadingText: { fontSize: 14, fontFamily: 'NotoKufiArabic-Regular' },
    modalOverlay: {
      ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 24,
    },
    modalCard: {
      width: '100%', borderRadius: 20, padding: 24, gap: 12,
      elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12,
    },
    modalTitle: { fontSize: 18, fontFamily: 'NotoKufiArabic-Bold', textAlign: 'center' },
    modalBody: { fontSize: 14, fontFamily: 'NotoKufiArabic-Regular', lineHeight: 22, textAlign: 'center' },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
    modalBtn: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
    modalBtnText: { fontSize: 15, fontFamily: 'NotoKufiArabic-SemiBold' },
    deleteInput: {
      borderWidth: 1.5, borderRadius: 10, padding: 12,
      alignItems: 'center', marginVertical: 8,
    },
  });

export default SettingsScreen;
