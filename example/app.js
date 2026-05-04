import { NeobitBuilder } from '../lib/module/index.js';

const App = NeobitBuilder.create()
  .withConfig({
    theme: { primaryColor: '#1a7f5a', mode: 'system' },
    identity: { appName: 'NeobitExample', displayName: 'Neobit Example' },
    api: { baseUrl: 'https://api.hesba-app.com' },
    features: {
      googleSignIn: false,
      appleSignIn: false,
      guestMode: true,
      remoteConfig: false,
      pushNotifications: false,
      demoMode: true,
    },
  })
  .launch();

export default App;

