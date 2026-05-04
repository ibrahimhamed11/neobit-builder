const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const neobitBuilderRoot = path.resolve(projectRoot, '..');
const exampleNodeModules = path.resolve(projectRoot, 'node_modules');
const builderNodeModules = path.resolve(neobitBuilderRoot, 'node_modules');
const builderLibRoot = path.resolve(neobitBuilderRoot, 'lib');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const defaultConfig = getDefaultConfig(projectRoot);

// Block Metro from ever resolving anything inside neobit-builder/node_modules.
// The library is pre-built (lib/ is shipped), so Metro only needs the lib output —
// not the builder's devDependencies. Without this block, Metro can find the wrong
// react-native version (0.76 in builder vs 0.85 in example), causing TurboModule
// lookup failures (e.g. "DeviceInfo could not be found").
const config = {
  projectRoot,
  watchFolders: [projectRoot, neobitBuilderRoot],
  resolver: {
    blockList: [new RegExp(`^${escapeRegex(builderNodeModules)}/.*$`)],
    extraNodeModules: {
      'neobit-builder': neobitBuilderRoot,
    },
    nodeModulesPaths: [exampleNodeModules],
    resolveRequest: (context, moduleName, platform) => {
      // When resolving modules from the neobit-builder lib folder,
      // use the example app's node_modules for dependencies
      if (context.originModulePath && context.originModulePath.includes(builderLibRoot)) {
        context.nodeModulesPaths = [exampleNodeModules];
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
