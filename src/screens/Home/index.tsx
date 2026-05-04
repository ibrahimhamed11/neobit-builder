/**
 * Home Screen
 *
 * Sections:
 *  - Welcome header with user name + avatar
 *  - Stats row (4 metric cards)
 *  - Quick action grid
 *  - Recent activity feed
 *
 * TO CUSTOMIZE:
 *  Replace SAMPLE_* imports with real API calls.
 *  Each section is clearly labeled.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-paper';

import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import AppAvatar from '../../components/AppAvatar';
import AppBadge from '../../components/AppBadge';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';

// ── Replace with real API data ──────────────────────────────────────────────
import {
  SAMPLE_STATS,
  SAMPLE_QUICK_ACTIONS,
  SAMPLE_ACTIVITIES,
} from '../../data/sampleData';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, fonts, spacing, borderRadius } = useAppTheme();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  // ── Pull to refresh ─────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: refetch your data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  // ── Render helpers ───────────────────────────────────────────────────────
  const renderStat = ({ item }: any) => (
    <AppCard style={[styles.statCard, { flex: 1 }]} padded>
      <Text style={[styles.statValue, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.xl }]}>
        {item.value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: fonts.size.sm }]}>
        {item.label}
      </Text>
      <View style={styles.trendRow}>
        <Icon
          source={item.trendUp ? 'trending-up' : 'trending-down'}
          size={14}
          color={item.trendUp ? colors.success : colors.error}
        />
        <Text style={{ color: item.trendUp ? colors.success : colors.error, fontSize: fonts.size.xs }}>
          {item.trend}
        </Text>
      </View>
    </AppCard>
  );

  const renderQuickAction = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        { backgroundColor: `${item.color}18`, borderRadius: borderRadius.lg, padding: spacing.md },
      ]}
      onPress={() => {/* Navigate to item.screen */}}
    >
      <View style={[styles.actionIcon, { backgroundColor: item.color, borderRadius: borderRadius.md }]}>
        <Icon source={item.icon} size={22} color="#FFFFFF" />
      </View>
      <Text style={[styles.actionLabel, { color: colors.text, fontFamily: fonts.family.medium, fontSize: fonts.size.sm, marginTop: spacing.xs }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderActivity = ({ item }: any) => (
    <View style={[styles.activityRow, { paddingVertical: spacing.sm }]}>
      <View style={styles.activityAvatarWrap}>
        <AppAvatar initials={item.initials} uri={item.avatar} size={42} />
        <View style={[styles.activityIconBadge, { backgroundColor: item.iconColor, borderRadius: 10 }]}>
          <Icon source={item.icon} size={11} color="#FFF" />
        </View>
      </View>
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={{ color: colors.text, fontFamily: fonts.family.medium, fontSize: fonts.size.sm }}>
          <Text style={{ fontFamily: fonts.family.bold }}>{item.user}</Text>
          {' '}{item.action}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: fonts.size.xs, marginTop: 2 }}>
          {item.time}
        </Text>
      </View>
      {item.unread && <AppBadge dot color={colors.primary} />}
    </View>
  );

  return (
    <ScreenWrapper scroll onRefresh={handleRefresh} refreshing={refreshing} padded={false}>

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingHorizontal: spacing.base, paddingBottom: spacing.xxxl }]}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={[styles.heroGreet, { fontFamily: fonts.family.regular, fontSize: fonts.size.sm }]}>
              {t('home.welcomeBack')} 👋
            </Text>
            <Text style={[styles.heroName, { fontFamily: fonts.family.bold, fontSize: fonts.size.xxl }]}>
              {firstName}
            </Text>
          </View>
          <View style={styles.heroRight}>
            <TouchableOpacity style={[styles.notifBtn, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22 }]}>
              <Icon source="bell-outline" size={22} color="#FFFFFF" />
              <AppBadge count={2} style={styles.notifBadge} />
            </TouchableOpacity>
            <AppAvatar
              uri={user?.photoURL}
              initials={(user?.displayName ?? 'U').slice(0, 2)}
              size={40}
              color="rgba(255,255,255,0.25)"
              style={{ marginLeft: spacing.sm }}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: spacing.base }}>

        {/* ── Stats Grid ──────────────────────────────────────────────────── */}
        {/* TODO: replace SAMPLE_STATS with your API data */}
        <View style={[styles.statsGrid, { marginTop: -spacing.xl }]}>
          {SAMPLE_STATS.map((item) => (
            <AppCard key={item.id} style={[styles.statCard]} padded>
              <Text style={[{ color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.lg }]}>
                {item.value}
              </Text>
              <Text style={[{ color: colors.textSecondary, fontSize: fonts.size.xs, marginTop: 2 }]}>
                {item.label}
              </Text>
              <View style={styles.trendRow}>
                <Icon
                  source={item.trendUp ? 'trending-up' : 'trending-down'}
                  size={12}
                  color={item.trendUp ? colors.success : colors.error}
                />
                <Text style={{ color: item.trendUp ? colors.success : colors.error, fontSize: fonts.size.xs, marginLeft: 2 }}>
                  {item.trend}
                </Text>
              </View>
            </AppCard>
          ))}
        </View>

        {/* ── Quick Actions ────────────────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.md, marginTop: spacing.xl }]}>
          {t('home.quickActions')}
        </Text>
        <View style={styles.actionsGrid}>
          {SAMPLE_QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.actionBtn, { backgroundColor: `${item.color}15`, borderRadius: borderRadius.lg, padding: spacing.md }]}
              onPress={() => {/* Navigate */}}
            >
              <View style={[styles.actionIcon, { backgroundColor: item.color, borderRadius: borderRadius.sm }]}>
                <Icon source={item.icon} size={20} color="#FFFFFF" />
              </View>
              <Text style={[{ color: colors.text, fontFamily: fonts.family.medium, fontSize: fonts.size.sm, marginTop: spacing.xs, textAlign: 'center' }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Recent Activity ──────────────────────────────────────────────── */}
        {/* TODO: replace SAMPLE_ACTIVITIES with your API data */}
        <View style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.family.bold, fontSize: fonts.size.md }]}>
            {t('home.recentActivity')}
          </Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontFamily: fonts.family.medium, fontSize: fonts.size.sm }}>
              {t('home.viewAll')}
            </Text>
          </TouchableOpacity>
        </View>

        <AppCard padded={false} style={{ overflow: 'hidden' }}>
          {SAMPLE_ACTIVITIES.map((item, idx) => (
            <View key={item.id}>
              <View style={[styles.activityRow, { paddingVertical: spacing.sm, paddingHorizontal: spacing.md }]}>
                <View style={styles.activityAvatarWrap}>
                  <AppAvatar initials={item.initials} uri={item.avatar} size={40} />
                  <View style={[styles.activityIconBadge, { backgroundColor: item.iconColor }]}>
                    <Icon source={item.icon} size={10} color="#FFF" />
                  </View>
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={{ color: colors.text, fontSize: fonts.size.sm }}>
                    <Text style={{ fontFamily: fonts.family.bold }}>{item.user} </Text>
                    <Text style={{ fontFamily: fonts.family.regular }}>{item.action}</Text>
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: fonts.size.xs, marginTop: 2 }}>
                    {item.time}
                  </Text>
                </View>
                {item.unread && <AppBadge dot color={colors.primary} />}
              </View>
              {idx < SAMPLE_ACTIVITIES.length - 1 && (
                <View style={{ height: 1, backgroundColor: colors.border, marginLeft: spacing.md }} />
              )}
            </View>
          ))}
        </AppCard>

      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  hero: { paddingTop: 12, paddingBottom: 48 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroGreet: { color: 'rgba(255,255,255,0.75)' },
  heroName: { color: '#FFFFFF', marginTop: 2 },
  heroRight: { flexDirection: 'row', alignItems: 'center' },
  notifBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: -2, right: -2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { minWidth: '47%' },
  statValue: {},
  statLabel: { marginTop: 2 },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 2 },
  sectionTitle: {},
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  actionBtn: { width: '22%', alignItems: 'center', minWidth: 72 },
  actionIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  actionLabel: {},
  activityRow: { flexDirection: 'row', alignItems: 'center' },
  activityAvatarWrap: { position: 'relative' },
  activityIconBadge: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF' },
});

export default HomeScreen;
