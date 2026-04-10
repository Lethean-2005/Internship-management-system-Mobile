const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];
// Let Metro treat .jfif files as importable image assets (JPEG variant).
config.resolver.assetExts = [...config.resolver.assetExts, 'jfif'];

module.exports = config;
