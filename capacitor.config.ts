import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.udo.capacitorSample',
  appName: 'capacitor-sample',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
