import React, { useState, useEffect } from 'react';
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
import AppButton from '../../components/AppButton';
import AppHeader from '../../components/AppHeader';

interface VerifyEmailScreenProps {
  navigation: any;
}

export default function VerifyEmailScreen({ navigation }: VerifyEmailScreenProps) {
  const { t } = useTranslation();
  const { colors, fonts, borderRadius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    if (resendDisabled) {
      const timer = setTimeout(() => setResendDisabled(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [resendDisabled]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      setVerified(true);
      setTimeout(() => navigation.replace('MainTabs'), 1500);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = () => {
    setResendCount(prev => prev + 1);
    setResendDisabled(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent />
      <View style={{ height: insets.top, backgroundColor: colors.primaryDark }} />
      <AppHeader
        title={t('auth.verifyEmail')}
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
              <Icon
                source={verified ? 'check-circle' : 'email-check-outline'}
                size={56}
                color={verified ? colors.success : colors.primary}
              />
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xl }]}>
                {verified ? t('auth.otpVerified') : t('auth.verifyEmail')}
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary, fontFamily: fonts.family.regular }]}>
                {verified
                  ? t('common.loading')
                  : t('auth.verifyEmailDesc')}
              </Text>
            </View>

            {!verified && (
              <>
                {/* Instructions */}
                <View style={[styles.instructionBox, { backgroundColor: colors.surface, borderRadius: borderRadius.sm }]}>
                  {[
                    { step: '1', text: 'Check your email inbox' },
                    { step: '2', text: 'Click the verification link' },
                    { step: '3', text: 'Return here to continue' },
                  ].map(({ step, text }) => (
                    <View key={step} style={styles.instructionRow}>
                      <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.stepText, { fontFamily: fonts.family.bold }]}>{step}</Text>
                      </View>
                      <Text style={[styles.stepLabel, { color: colors.text, fontFamily: fonts.family.regular }]}>{text}</Text>
                    </View>
                  ))}
                </View>

                <AppButton
                  label={verifying ? t('auth.checkingVerification') : t('auth.iVerifiedMyEmail')}
                  onPress={handleVerify}
                  loading={verifying}
                />

                <View style={styles.resendRow}>
                  <Text style={[{ color: colors.textSecondary, fontFamily: fonts.family.regular, fontSize: 14 }]}>
                    {t('auth.resendVerification')}{' '}
                  </Text>
                  <TouchableOpacity onPress={handleResendEmail} disabled={resendDisabled}>
                    <Text style={[{
                      color: resendDisabled ? colors.textTertiary : colors.primary,
                      fontFamily: fonts.family.bold,
                      fontSize: 14,
                    }]}>
                      {resendDisabled ? t('auth.resendOtp') : t('auth.resendVerification')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  instructionBox: { padding: 16, gap: 12 },
  instructionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  stepText: { color: '#fff', fontSize: 13 },
  stepLabel: { flex: 1, fontSize: 14 },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
