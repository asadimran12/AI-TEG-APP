module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // FIX: Add the plugins array
    plugins: [
      "react-native-reanimated/plugin", // <--- ADD THIS LINE (Must be the last one)
    ],
  };
};