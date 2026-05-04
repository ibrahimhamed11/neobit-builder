/**
 * {{APP_NAME}} — App Stack
 * Wraps MainTabs + any full-screen modals (EditProfile, etc.)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import EditProfileScreen from '../screens/EditProfile';
import NotificationsScreen from '../screens/Notifications';

export type AppStackParamList = {
  MainTabs: undefined;
  EditProfile: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * AppStack
 *
 * - MainTabs is the root (home, profile, settings)
 * - EditProfile is a full-screen stack screen over the tabs
 *
 * TO ADD SCREENS:
 *  1. Import your component
 *  2. Add a <Stack.Screen> below
 *  3. Register in AppStackParamList above
 */
const AppStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs"      component={MainTabs} />
    <Stack.Screen name="EditProfile"   component={EditProfileScreen} options={{ animation: 'slide_from_right' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ animation: 'slide_from_right' }} />
    {/* Add more screens below */}
  </Stack.Navigator>
);

export default AppStack;
