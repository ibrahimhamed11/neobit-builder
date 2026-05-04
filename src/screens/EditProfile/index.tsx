/**
 * EditProfile Screen
 *
 * Lets the user update their display name, email, and profile photo.
 *
 * TO CUSTOMIZE:
 *  - Wire handleSave to your authApi.updateMe() call
 *  - Add your own fields (bio, phone number, etc.)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ScreenWrapper from '../../components/ScreenWrapper';
import AppHeader from '../../components/AppHeader';
import AppAvatar from '../../components/AppAvatar';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppSnackbar from '../../components/AppSnackbar';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuthStore } from '../../store/authStore';

const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, fonts, spacing } = useAppTheme();
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [email] = useState(user?.email ?? '');       // read-only for now
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as any });

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  // ── Validate + save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!displayName.trim()) {
      setSnackbar({ visible: true, message: t('validation.required'), type: 'error' });
      return;
    }
    try {
      setIsSaving(true);
      // TODO: replace with your authApi.updateMe() call
      // const { authApi } = await import('../../api/services/authApi');
      // await authApi.updateMe({ displayName });
      await new Promise((r) => setTimeout(r, 800)); // simulate save
      setSnackbar({ visible: true, message: t('editProfile.updated'), type: 'success' });
      setTimeout(() => navigation.goBack(), 1000);
    } catch {
      setSnackbar({ visible: true, message: t('common.error'), type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenWrapper scroll padded={false}>

      {/* Header */}
      <AppHeader
        title={t('editProfile.title')}
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={{ paddingHorizontal: spacing.base }}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <AppAvatar uri={user?.photoURL} initials={initials} size={90} />
            <TouchableOpacity
              style={[styles.cameraBtn, { backgroundColor: colors.primary }]}
              onPress={() => {/* image picker → upload → update photoURL */}}
            >
              <Text style={{ color: '#FFF', fontSize: 12 }}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: fonts.size.sm, marginTop: spacing.sm }}>
            Tap to change photo
          </Text>
        </View>

        {/* Form fields */}
        <AppInput
          label={t('editProfile.displayName')}
          value={displayName}
          onChangeText={setDisplayName}
          leftIcon="account-outline"
          placeholder={t('editProfile.displayNamePlaceholder')}
          autoCapitalize="words"
          returnKeyType="done"
        />

        <AppInput
          label={t('editProfile.email')}
          value={email}
          editable={false}
          leftIcon="email-outline"
          containerStyle={{ opacity: 0.6 }}
        />
        <Text style={{ color: colors.textSecondary, fontSize: fonts.size.xs, marginTop: -8, marginBottom: 16 }}>
          Email cannot be changed here.
        </Text>

        {/* Add your own fields here */}
        {/* <AppInput label="Phone" value={phone} onChangeText={setPhone} leftIcon="phone-outline" /> */}
        {/* <AppInput label="Bio" value={bio} onChangeText={setBio} multiline numberOfLines={3} /> */}

        <AppButton
          label={t('editProfile.saveChanges')}
          onPress={handleSave}
          loading={isSaving}
          style={{ marginTop: spacing.lg }}
        />

      </View>

      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatarWrap: { position: 'relative' },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});

export default EditProfileScreen;
