let _appName = 'NeobitApp';
let _config: any = null;

export const setAppName = (name: string) => {
  _appName = name;
};

export const getAppName = () => _appName;

export const setConfig = (config: any) => {
  _config = config;
};

export const getConfig = () => _config;
