// .metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    config.resolver = {
        ...config.resolver,
        blacklistRE: exclusionList([
            // exclude any hidden .firebase-xyz folders
            /node_modules\/\.firebase.*\/.*/,
        ]),
    };

    return config;
})();
