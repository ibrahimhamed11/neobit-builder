import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';

interface SignupScreenProps {
  navigation: any;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const { t } = useTranslation();
  const { colors, fonts, borderRadius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { signup, isLoading, error: authError } = useAuthStore();

  const handleSignup = async () => {
    const newErrors: any = {};
    if (!displayName) newErrors.displayName = t('validation.required');
    if (!email) newErrors.email = t('validation.required');
    if (!password) newErrors.password = t('validation.required');
    if (password !== confirmPassword) newErrors.confirmPassword = t('validation.passwordMismatch');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      await signup({ displayName, email, password });
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent />
      <View style={{ height: insets.top, backgroundColor: colors.primaryDark }} />
      <AppHeader
        title={t('auth.createAccount')}
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
            {authError ? (
              <View style={[styles.errorBanner, { backgroundColor: colors.errorLight, borderRadius: borderRadius.sm }]}>
                <Text style={[{ color: colors.error, fontFamily: fonts.family.regular, fontSize: 13 }]}>
                  {authError}
                </Text>
              </View>
            ) : null}

            <AppInput
              label={t('auth.fullName')}
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                if (errors.displayName) setErrors({ ...errors, displayName: undefined });
              }}
              leftIcon="account"
              placeholder={t('auth.fullNamePlaceholder')}
              error={errors.displayName}
            />

            <AppInput
              label={t('auth.email')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              placeholder={t('auth.emailPlaceholder')}
              error={errors.email}
            />

            <AppInput
              label={t('auth.password')}
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

            <AppButton
              label={isLoading ? t('common.loading') : t('auth.signup')}
              onPress={handleSignup}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.textSecondary, fontFamily: fonts.family.regular }]}>
              {t('auth.hasAccount')}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.footerLink, { color: colors.primary, fontFamily: fonts.family.bold }]}>
                {t('auth.login')}
              </Text>
            </TouchableOpacity>
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
    marginBottom: 16,
  },
  errorBanner: {
    padding: 10,
  },
  submitBtn: { marginTop: 4 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14 },
});
