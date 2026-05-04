import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';

interface NewPasswordScreenProps {
  navigation: any;
  route: any;
}

export default function NewPasswordScreen({ navigation, route }: NewPasswordScreenProps) {
  const { t } = useTranslation();
  const { colors, fonts, borderRadius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleResetPassword = async () => {
    const newErrors: any = {};
    if (!password) newErrors.password = t('validation.required');
    if (!confirmPassword) newErrors.confirmPassword = t('validation.required');
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordMismatch');
    }
    if (password && password.length < 8) {
      newErrors.password = t('validation.passwordMin');
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      navigation.navigate('Login');
    } catch (error) {
      console.error('Reset password failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checks = [
    { label: t('auth.passwordRules'), pass: password.length >= 8 },
    { label: t('validation.required'), pass: /[A-Z]/.test(password) },
    { label: t('validation.required'), pass: /[0-9]/.test(password) },
    { label: t('validation.required'), pass: /[!@#$%^&*]/.test(password) },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent />
      <View style={{ height: insets.top, backgroundColor: colors.primaryDark }} />
      <AppHeader
        title={t('auth.newPassword')}
        showBack
        onBack={() => navigation.goBack()}
        style={{ backgroundColor: colors.primaryDark }}
        light
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: colors.card, borderRadius: borderRadius.xl }]}>
            {/* Header Icon */}
            <View style={styles.iconWrap}>
              <Icon source="lock-reset" size={48} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xl }]}>
                {t('auth.newPassword')}
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontFamily: fonts.family.regular }]}>
                {t('auth.passwordRules')}
              </Text>
            </View>

            {/* Info Box */}
            <View style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderRadius: borderRadius.sm }]}>
              <Icon source="information-outline" size={18} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.primary, fontFamily: fonts.family.regular }]}>
                {t('auth.passwordRules')}
              </Text>
            </View>

            <AppInput
              label={t('auth.newPassword')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              placeholder={t('auth.passwordPlaceholder')}
              error={errors.password}
            />

            <AppInput
              label={t('auth.confirmPassword')}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              secureTextEntry={!showConfirmPassword}
              leftIcon="lock-check"
              rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder={t('auth.passwordPlaceholder')}
              error={errors.confirmPassword}
            />

            {/* Password Requirements */}
            {password.length > 0 && (
              <View style={[styles.requirementsBox, { backgroundColor: colors.surface, borderRadius: borderRadius.sm }]}>
                {checks.map((check, i) => (
                  <View key={i} style={styles.requirementRow}>
                    <Icon
                      source={check.pass ? 'check-circle' : 'circle-outline'}
                      size={16}
                      color={check.pass ? colors.success : colors.textTertiary}
                    />
                    <Text style={[
                      styles.requirementText,
                      { color: check.pass ? colors.success : colors.textSecondary, fontFamily: fonts.family.regular },
                    ]}>
                      {check.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <AppButton
              label={loading ? t('common.loading') : t('auth.setNewPassword')}
              onPress={handleResetPassword}
              loading={loading}
              style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  formCard: {
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  iconWrap: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    textAlign: 'center',
  },
  cardSubtitle: {
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.8,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
  },
  requirementsBox: {
    padding: 12,
    gap: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
  },
  submitBtn: { marginTop: 4 },
});
