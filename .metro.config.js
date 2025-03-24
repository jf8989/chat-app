// .metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add exclusions for problematic Firebase paths
config.resolver.blacklistRE = [
    /node_modules[/\\].*[/\\]firebase[/\\].*[/\\]dist[/\\]esm[/\\].*[/\\]firestore/,
    /node_modules[/\\].*[/\\]firebase[/\\].*[/\\]dist[/\\].*[/\\]platform_react_native/,
    /node_modules[/\\].*[/\\]firebase[/\\].*[/\\]dist[/\\].*[/\\]compat[/\\]auth/,
    /node_modules[/\\].*[/\\]firebase[/\\].*[/\\]dist[/\\].*[/\\]compat[/\\]database/,
];

// Use CommonJS for all node_modules
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'];
config.resolver.assetExts = ['pb', 'ttf', 'html'];

module.exports = config;