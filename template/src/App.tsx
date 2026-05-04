/**
 * {{APP_NAME}} — Root Component
 */

import React from 'react';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './navigation/RootNavigator';
import { useThemeStore } from './store/themeStore';
import { getAppTheme } from './theme';

const App = () => {
  const { isDark } = useThemeStore();
  const theme = getAppTheme(isDark);

  return (
    <PaperProvider theme={theme}>
      <RootNavigator />
    </PaperProvider>
  );
};

export default App;
