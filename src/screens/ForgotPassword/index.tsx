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
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const { t } = useTranslation();
  const { colors, fonts, borderRadius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleSendReset = async () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = t('validation.required');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      setSent(true);
      setTimeout(() => {
        navigation.navigate('ResetOTP', { email });
      }, 2000);
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent />
      <View style={{ height: insets.top, backgroundColor: colors.primaryDark }} />
      <AppHeader
        title={t('auth.forgotPassword')}
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
          <View style={[styles.formCard, { backgroundColor: colors.card, borderRadius: borderRadius.xl }]}>
            <View style={styles.iconWrap}>
              <Icon source={sent ? 'email-check' : 'lock-reset'} size={56} color={sent ? colors.success : colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xl }]}>
                {sent ? t('auth.otpSent') : t('auth.resetPassword')}
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontFamily: fonts.family.regular }]}>
                {sent
                  ? `${t('auth.resetPasswordDesc')} ${email}`
                  : t('auth.resetPasswordDesc')}
              </Text>
            </View>

            {!sent && (
              <>
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
                <AppButton
                  label={loading ? t('common.loading') : t('auth.resetPassword')}
                  onPress={handleSendReset}
                  loading={loading}
                  style={styles.submitBtn}
                />
              </>
            )}

            {sent && (
              <View style={[styles.infoBox, { backgroundColor: colors.successLight, borderRadius: borderRadius.sm }]}>
                <Icon source="information-outline" size={18} color={colors.success} />
                <Text style={[styles.infoText, { color: colors.success, fontFamily: fonts.family.regular }]}>
                  Click the link in the email to continue resetting your password.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footerRow}>
            <Text style={[{ color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: 14 }]}>
              {t('auth.hasAccount')}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[{ color: colors.primary, fontFamily: fonts.family.bold, fontSize: 14 }]}>
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
  iconWrap: { alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { textAlign: 'center' },
  cardSubtitle: { textAlign: 'center', fontSize: 13, opacity: 0.8 },
  infoBox: { flexDirection: 'row', padding: 10, gap: 8, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 13 },
  submitBtn: { marginTop: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
});
