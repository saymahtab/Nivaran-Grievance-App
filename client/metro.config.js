const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Enable SVG transformer
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts.push("svg");

// Enable NativeWind
module.exports = withNativeWind(config, { input: "./app/global.css" });
