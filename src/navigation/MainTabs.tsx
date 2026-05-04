/**
 * {{APP_NAME}} — Main Tab Navigator
 *
 * Tabs: Home · Profile · Settings
 *
 * TO ADD A TAB:
 *  1. Import your screen
 *  2. Add it as a <Tab.Screen> below
 *  3. Register in src/types/index.ts → MainTabParamList
 *
 * TO CUSTOMIZE TAB BAR:
 *  Edit the tabBarStyle / tabBarIcon / tabBarLabel options below.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import SettingsScreen from '../screens/Settings';
import { useAppTheme } from '../hooks/useAppTheme';

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// ── Custom Tab Bar ───────────────────────────────────────────────────────────
// Delete this and use tabBarStyle if you want the default system tab bar.
const CustomTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  const { colors, fonts, spacing, shadows } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const TABS = [
    { name: 'Home',         icon: 'home-outline',    activeIcon: 'home',           labelKey: 'navigation.home' },
    { name: 'Profile',      icon: 'account-outline', activeIcon: 'account',        labelKey: 'navigation.profile' },
    { name: 'Settings',     icon: 'cog-outline',     activeIcon: 'cog',            labelKey: 'navigation.settings' },
  ];

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.tabBar,
          paddingBottom: insets.bottom + 4,
          borderTopColor: colors.border,
          ...shadows.md,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const tab = TABS[index];

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
          >
            {/* Active indicator pill */}
            {isFocused && (
              <View style={[styles.activePill, { backgroundColor: `${colors.primary}18` }]} />
            )}

            <MaterialCommunityIcons
              name={isFocused ? tab.activeIcon : tab.icon}
              size={24}
              color={isFocused ? colors.tabBarActive : colors.tabBarInactive}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? colors.tabBarActive : colors.tabBarInactive,
                  fontFamily: isFocused ? fonts.family.bold : fonts.family.regular,
                  fontSize: fonts.size.xs,
                },
              ]}
            >
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ── Main Tabs ────────────────────────────────────────────────────────────────
const MainTabs: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home"         component={HomeScreen}           />
    <Tab.Screen name="Profile"      component={ProfileScreen}        />
    <Tab.Screen name="Settings"     component={SettingsScreen}       />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
    gap: 3,
  },
  activePill: {
    position: 'absolute',
    top: -4,
    width: 48,
    height: 36,
    borderRadius: 18,
  },
  tabLabel: {},
});

export default MainTabs;
