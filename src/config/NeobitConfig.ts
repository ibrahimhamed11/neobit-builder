import React from 'react';

export interface ThemeConfig {
  primaryColor?: string;
  mode?: 'light' | 'dark' | 'system';
  fonts?: {
    regular?: string;
    medium?: string;
    semiBold?: string;
    bold?: string;
  };
}

export interface ApiConfig {
  baseUrl?: string;
  localIp?: string;
  timeout?: number;
}

export interface AuthConfig {
  googleWebClientId?: string;
  googleIosClientId?: string;
}

export interface FeatureFlags {
  googleSignIn?: boolean;
  appleSignIn?: boolean;
  guestMode?: boolean;
  remoteConfig?: boolean;
  pushNotifications?: boolean;
  /**
   * demoMode: true — skips real API/Firebase and uses static demo credentials.
   * Use this when you have no backend yet, or for testing/demo purposes.
   * Demo credentials: email: "demo@example.com" / password: "demo1234"
   */
  demoMode?: boolean;
}

export interface I18nConfig {
  defaultLanguage?: string;
  resources?: Record<string, { translation: Record<string, string> }>;
}

export interface AppIdentityConfig {
  appName?: string;
  displayName?: string;
}

export interface ScreenOverrides {
  home?: React.ComponentType<any>;
  profile?: React.ComponentType<any>;
  settings?: React.ComponentType<any>;
  login?: React.ComponentType<any>;
  signup?: React.ComponentType<any>;
  extraAppScreens?: Array<{
    name: string;
    component: React.ComponentType<any>;
    options?: object;
  }>;
  extraTabs?: Array<{
    name: string;
    component: React.ComponentType<any>;
    icon: string;
    activeIcon?: string;
  }>;
}

export interface NeobitConfig {
  theme?: ThemeConfig;
  api?: ApiConfig;
  auth?: AuthConfig;
  features?: FeatureFlags;
  i18n?: I18nConfig;
  identity?: AppIdentityConfig;
}

export const DEFAULT_CONFIG: Required<NeobitConfig> = {
  theme: {
    primaryColor: '#1a7f5a',
    mode: 'system',
    fonts: { regular: 'System', medium: 'System', semiBold: 'System', bold: 'System' },
  },
  api: {
    baseUrl: 'https://api.example.com',
    localIp: '192.168.1.1',
    timeout: 15000,
  },
  auth: {
    googleWebClientId: '',
    googleIosClientId: '',
  },
  features: {
    googleSignIn: true,
    appleSignIn: true,
    guestMode: true,
    remoteConfig: true,
    pushNotifications: true,
    demoMode: false,
  },
  i18n: {
    defaultLanguage: 'en',
    resources: {},
  },
  identity: {
    appName: 'NeobitApp',
    displayName: 'Neobit App',
  },
};
