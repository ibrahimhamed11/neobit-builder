/**
 * Profile Screen
 *
 * Shows user info, stats row, and quick links to edit profile.
 *
 * TO CUSTOMIZE:
 *  - Replace SAMPLE_PROFILE_STATS with your real data
 *  - Add your own sections below the stats row
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import AppAvatar from '../../components/AppAvatar';
import AppCard from '../../components/AppCard';
import AppListItem from '../../components/AppListItem';
import AppDivider from '../../components/AppDivider';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuthStore } from '../../store/authStore';
import { SAMPLE_PROFILE_STATS } from '../../data/sampleData';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, fonts, spacing, borderRadius } = useAppTheme();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const initials = (user?.displayName ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero banner ────────────────────────────────────────────────── */}
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
      >
        {/* Edit button top-right */}
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Icon source="pencil-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <AppAvatar
            uri={user?.photoURL}
            initials={initials}
            size={90}
            color="rgba(255,255,255,0.25)"
          />
          <TouchableOpacity
            style={[styles.cameraBtn, { backgroundColor: colors.primary, borderRadius: 16, borderWidth: 2, borderColor: '#FFF' }]}
            onPress={() => {/* Image picker */}}
          >
            <Icon source="camera" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Name + email */}
        <Text style={[styles.name, { fontFamily: fonts.family.bold, fontSize: fonts.size.xl, color: '#FFFFFF' }]}>
          {user?.displayName ?? 'Your Name'}
        </Text>
        <Text style={[styles.email, { fontFamily: fonts.family.regular, fontSize: fonts.size.sm, color: 'rgba(255,255,255,0.75)' }]}>
          {user?.email ?? 'your@email.com'}
        </Text>

        {/* Verified badge */}
        {user?.emailVerified && (
          <View style={[styles.verifiedBadge, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }]}>
            <Icon source="check-decagram" size={14} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: fonts.size.xs, fontFamily: fonts.family.medium, marginLeft: 4 }}>
              Verified
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      {/* TODO: Replace SAMPLE_PROFILE_STATS with real data */}
      <AppCard
        style={[styles.statsCard, { marginHorizontal: spacing.base, marginTop: -spacing.lg }]}
        padded
      >
        {SAMPLE_PROFILE_STATS.map((stat, idx) => (
          <React.Fragment key={stat.label}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xl }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: fonts.size.sm }]}>
                {stat.label}
              </Text>
            </View>
            {idx < SAMPLE_PROFILE_STATS.length - 1 && (
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            )}
          </React.Fragment>
        ))}
      </AppCard>

      {/* ── Account section ────────────────────────────────────────────── */}
      <View style={[styles.section, { paddingHorizontal: spacing.base, marginTop: spacing.xl }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: fonts.family.medium, fontSize: fonts.size.sm }]}>
          {t('common.edit').toUpperCase()}
        </Text>
        <AppCard padded={false} style={{ overflow: 'hidden', marginTop: spacing.sm }}>
          <AppListItem
            icon="account-edit-outline"
            label={t('profile.editProfile')}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <AppDivider inset={60} />
          <AppListItem
            icon="lock-outline"
            label={t('profile.changePassword')}
            onPress={() => {/* navigate */}}
          />
          <AppDivider inset={60} />
          <AppListItem
            icon="bell-outline"
            label={t('profile.notificationPreferences')}
            onPress={() => {/* navigate */}}
          />
        </AppCard>
      </View>

      {/* ── Danger zone ────────────────────────────────────────────────── */}
      <View style={[styles.section, { paddingHorizontal: spacing.base, marginTop: spacing.lg }]}>
        <AppCard padded={false} style={{ overflow: 'hidden' }}>
          <AppListItem
            icon="delete-outline"
            iconColor={colors.error}
            label={t('profile.deleteAccount')}
            destructive
            onPress={() => {/* confirm delete */}}
          />
        </AppCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  editBtn: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { marginBottom: 4 },
  email: {},
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  statValue: {},
  statLabel: { marginTop: 2 },
  statDivider: { width: 1, height: '80%', alignSelf: 'center' },
  section: {},
  sectionTitle: { marginBottom: 4, letterSpacing: 0.5 },
});

export default ProfileScreen;
