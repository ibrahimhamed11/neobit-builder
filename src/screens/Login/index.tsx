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
import { Text, Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAuthStore } from '../../store/authStore';
import { useNeobitConfig } from '../../config/ConfigContext';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { t } = useTranslation();
  const { colors, fonts, spacing, borderRadius } = useAppTheme();
  const config = useNeobitConfig();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loginAsGuest, isLoading, error: authError } = useAuthStore();

  const handleLogin = async () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = t('validation.required');
    if (!password) newErrors.password = t('validation.required');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      await login({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const showGoogle = config.features.googleSignIn;
  const showApple = config.features.appleSignIn;
  const showGuest = config.features.guestMode;
  const showSocial = showGoogle || showApple;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent />
      <View style={{ height: insets.top, backgroundColor: colors.primaryDark }} />
      <AppHeader
        title=""
        showBack={false}
        style={{ backgroundColor: colors.primaryDark }}
        light
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner */}
          <LinearGradient
            colors={[colors.primaryDark, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={styles.heroIconWrap}>
              <Icon source="shield-key-outline" size={56} color="#FFFFFF" />
            </View>
            <Text style={[styles.heroTitle, { fontFamily: fonts.family.bold }]}>
              {config.identity.displayName || config.identity.appName}
            </Text>
            <Text style={[styles.heroSubtitle, { fontFamily: fonts.family.regular }]}>
              {t('auth.login')}
            </Text>
          </LinearGradient>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: colors.card, borderRadius: borderRadius.xl }]}>
            <Text style={[styles.formTitle, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xl }]}>
              {t('auth.login')}
            </Text>

            {authError ? (
              <View style={[styles.errorBanner, { backgroundColor: colors.errorLight, borderRadius: borderRadius.sm }]}>
                <Icon source="alert-circle-outline" size={18} color={colors.error} />
                <Text style={[styles.errorBannerText, { color: colors.error, fontFamily: fonts.family.regular }]}>
                  {authError}
                </Text>
              </View>
            ) : null}

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

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: colors.primary, fontFamily: fonts.family.medium }]}>
                {t('auth.forgotPassword')}
              </Text>
            </TouchableOpacity>

            <AppButton
              label={isLoading ? t('common.loading') : t('auth.login')}
              onPress={handleLogin}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </View>

          {/* Social Login */}
          {showSocial && (
            <>
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary, fontFamily: fonts.family.regular }]}>
                  {t('auth.orContinueWith')}
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              <View style={styles.socialRow}>
                {showGoogle && (
                  <TouchableOpacity style={[styles.socialBtn, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: borderRadius.md }]}>
                    <Icon source="google" size={22} color="#DB4437" />
                    <Text style={[styles.socialText, { color: colors.text, fontFamily: fonts.family.medium }]}>{t('auth.loginWithGoogle')}</Text>
                  </TouchableOpacity>
                )}
                {showApple && (
                  <TouchableOpacity style={[styles.socialBtn, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: borderRadius.md }]}>
                    <Icon source="apple" size={22} color={colors.text} />
                    <Text style={[styles.socialText, { color: colors.text, fontFamily: fonts.family.medium }]}>{t('auth.loginWithApple')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          {/* Guest Login */}
          {showGuest && (
            <TouchableOpacity style={styles.guestBtn} activeOpacity={0.7} onPress={loginAsGuest}>
              <Icon source="account-eye-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.guestText, { color: colors.textSecondary, fontFamily: fonts.family.regular }]}>
                {t('auth.continueAsGuest')}
              </Text>
            </TouchableOpacity>
          )}

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.textSecondary, fontFamily: fonts.family.regular }]}>
              {t('auth.noAccount')}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.footerLink, { color: colors.primary, fontFamily: fonts.family.bold }]}>
                {t('auth.signup')}
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
  scrollContent: { paddingBottom: 40 },
  heroBanner: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  heroIconWrap: {
    marginBottom: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  formCard: {
    marginHorizontal: 16,
    marginTop: -28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    gap: 12,
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  errorBannerText: { flex: 1, fontSize: 13 },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: { fontSize: 13 },
  submitBtn: { marginTop: 4 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 8,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  socialRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingVertical: 12,
    gap: 8,
  },
  socialText: { fontSize: 14 },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  guestText: { fontSize: 13 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14 },
});
