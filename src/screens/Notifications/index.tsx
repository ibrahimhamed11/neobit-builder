/**
 * Notifications Screen
 * Displays list of push notifications with read/unread state.
 * Matches Hesba's implementation pattern.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import ScreenWrapper from '../../components/ScreenWrapper';
import EmptyState from '../../components/EmptyState';
import { useAppTheme } from '../../hooks/useAppTheme';
import { IconSize } from '../../theme/spacing';

// ── Types ─────────────────────────────────────────────────────────────────────

type NotificationType = 'expense' | 'budget' | 'gift' | 'household' | 'system';

interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// ── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  { id: '1', type: 'budget', title: 'Budget Alert', body: "You've used 80% of your monthly budget.", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '2', type: 'expense', title: 'New Expense Added', body: 'A new expense of 150 EGP was recorded.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '3', type: 'gift', title: 'Gift Reminder', body: "Don't forget Ahmed's wedding gift!", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '4', type: 'system', title: 'Welcome to Neobit', body: 'Your account is ready. Start tracking your expenses!', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ── Notification Item ─────────────────────────────────────────────────────────

const NotificationItem: React.FC<{
  item: AppNotification;
  colors: Record<string, string>;
  isDark: boolean;
  onPress: (id: string) => void;
}> = ({ item, colors, isDark, onPress }) => {
  const iconMap: Record<NotificationType, { icon: string; color: string; bg: string }> = {
    expense: { icon: 'cash-minus', color: colors.error, bg: isDark ? 'rgba(239,68,68,0.12)' : '#FEE2E2' },
    budget: { icon: 'alert-circle', color: colors.warning, bg: isDark ? 'rgba(245,158,11,0.12)' : '#FEF3C7' },
    gift: { icon: 'gift', color: colors.accent, bg: isDark ? 'rgba(212,160,23,0.12)' : '#FFF8E1' },
    household: { icon: 'account-group', color: colors.primary, bg: isDark ? 'rgba(15,118,110,0.12)' : '#E6F5F3' },
    system: { icon: 'bell', color: colors.textSecondary, bg: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
  };

  const config = iconMap[item.type] ?? iconMap.system;

  return (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: item.read ? colors.card : (isDark ? 'rgba(15,118,110,0.08)' : '#F0FAF9') },
      ]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
        <Icon source={config.icon} size={IconSize.sm} color={config.color} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: colors.text, fontFamily: 'NotoKufiArabic-SemiBold' }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!item.read && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
        </View>
        <Text
          style={[styles.body, { color: colors.textSecondary, fontFamily: 'NotoKufiArabic-Regular' }]}
          numberOfLines={2}
        >
          {item.body}
        </Text>
        <Text style={[styles.time, { color: colors.textTertiary, fontFamily: 'NotoKufiArabic-Regular' }]}>
          {formatRelativeTime(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ── Screen ────────────────────────────────────────────────────────────────────

const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise<void>((r) => setTimeout(r, 800));
    setIsRefreshing(false);
  }, []);

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon source="arrow-left" size={24} color={colors.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText, fontFamily: 'NotoKufiArabic-Bold' }]}>
          {t('notifications.title')}
        </Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllAsRead} style={styles.backBtn}>
            <Icon source="check-all" size={22} color={colors.headerText} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            colors={colors}
            isDark={isDark}
            onPress={markAsRead}
          />
        )}
        contentContainerStyle={[
          { padding: 16, paddingBottom: 40 },
          notifications.length === 0 && { flex: 1, justifyContent: 'center' },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title={t('notifications.empty')}
            subtitle={t('notifications.emptySubtitle')}
          />
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backBtn: { width: 44, alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  title: { fontSize: 14, flex: 1 },
  body: { fontSize: 12, lineHeight: 18, marginBottom: 4 },
  time: { fontSize: 11 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
});

export default NotificationsScreen;
