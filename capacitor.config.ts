import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pop.securechat',
  appName: 'POP Chat',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
