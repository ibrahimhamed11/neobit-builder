import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { NeobitConfig, DEFAULT_CONFIG, ScreenOverrides } from './NeobitConfig';
import { setAppName } from '../store/_config';
import { setAuthStoreConfig } from '../store/authStore';

interface ConfigContextValue {
  config: Required<NeobitConfig>;
  screens: ScreenOverrides;
}

const ConfigContext = createContext<ConfigContextValue>({
  config: DEFAULT_CONFIG,
  screens: {},
});

export const ConfigProvider: React.FC<{
  config?: NeobitConfig;
  screens?: ScreenOverrides;
  children: React.ReactNode;
}> = ({ config, screens = {}, children }) => {
  const mergedConfig = useMemo(() => deepMerge(DEFAULT_CONFIG, config ?? {}), [config]);

  useEffect(() => {
    if (mergedConfig.identity.appName) {
      setAppName(mergedConfig.identity.appName);
    }
    setAuthStoreConfig(
      mergedConfig.features.demoMode ?? false,
      mergedConfig.api.baseUrl ?? ''
    );
  }, [mergedConfig.identity.appName, mergedConfig.features.demoMode, mergedConfig.api.baseUrl]);

  return (
    <ConfigContext.Provider value={{ config: mergedConfig, screens }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useNeobitConfig = () => {
  const ctx = useContext(ConfigContext);
  return ctx.config;
};

export const useScreenOverrides = () => {
  const ctx = useContext(ConfigContext);
  return ctx.screens;
};

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] !== undefined && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] ?? {}, source[key]);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  return result;
}
