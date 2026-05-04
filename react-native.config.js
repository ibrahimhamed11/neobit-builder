/**
 * React Native auto-linking config for neobit-builder.
 *
 * This exposes the MaterialCommunityIcons font (used by react-native-paper's
 * Icon component) so that clients who run `npx react-native-asset` or any
 * RN asset-linking tool automatically get the font bundled in their app.
 */
module.exports = {
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
};
