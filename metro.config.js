/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 */

// Get the default configuration from Expo
const { getDefaultConfig } = require('expo/metro-config');

// Get the default config for the current project
const config = getDefaultConfig(__dirname);

// Add 'pmtiles' to the list of asset extensions.
// This allows the Metro bundler to recognize and package .pmtiles files.
config.resolver.assetExts.push('pmtiles');

module.exports = config;
