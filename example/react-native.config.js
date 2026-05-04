module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: [
    './node_modules/react-native-vector-icons/Fonts',
    './assets/fonts',
  ],
  dependency: {
    platforms: {
      android: {
        packageInstance: 'new RNVectorIconsPackage()',
        haste: false,
        scriptPhases: null,
      },
    },
  },
};
