import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput as RNTextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';

interface ResetOTPScreenProps {
  navigation: any;
  route: any;
}

export default function ResetOTPScreen({ navigation, route }: ResetOTPScreenProps) {
  const { t } = useTranslation();
  const { colors, fonts, borderRadius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const email = route.params?.email || 'your@email.com';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, '');
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setVerifying(true);
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      navigation.navigate('NewPassword', { email, resetToken: otpValue });
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent />
      <View style={{ height: insets.top, backgroundColor: colors.primaryDark }} />
      <AppHeader
        title={t('auth.enterOtp')}
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
              <Icon source="shield-check" size={56} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xl }]}>
                {t('auth.enterOtp')}
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontFamily: fonts.family.regular }]}>
                {t('auth.enterOtp')} {email}
              </Text>
            </View>

            {/* OTP Inputs */}
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <RNTextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    {
                      borderColor: error ? colors.error : digit ? colors.primary : colors.border,
                      color: colors.text,
                      backgroundColor: colors.inputBackground,
                      borderRadius: borderRadius.md,
                      fontFamily: fonts.family.bold,
                    },
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  maxLength={1}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.placeholder}
                  editable={!verifying}
                  selectTextOnFocus
                />
              ))}
            </View>

            {error ? (
              <Text style={[styles.errorText, { color: colors.error, fontFamily: fonts.family.regular }]}>
                {error}
              </Text>
            ) : null}

            <AppButton
              label={verifying ? t('auth.verifying') : t('auth.verifyOtp')}
              onPress={handleVerifyOtp}
              loading={verifying}
            />

            <View style={styles.resendRow}>
              <Text style={[{ color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: 14 }]}>
                {t('auth.resendOtp')}{' '}
              </Text>
              <TouchableOpacity disabled={verifying}>
                <Text style={[{ color: colors.primary, fontFamily: fonts.family.bold, fontSize: 14 }]}>
                  {t('auth.resendOtp')}
                </Text>
              </TouchableOpacity>
            </View>
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
    gap: 16,
  },
  iconWrap: { alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { textAlign: 'center' },
  cardSubtitle: { textAlign: 'center', fontSize: 13, opacity: 0.8 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  otpInput: {
    width: 48, height: 56, borderWidth: 2,
    textAlign: 'center', fontSize: 22,
  },
  errorText: { textAlign: 'center', fontSize: 13 },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
