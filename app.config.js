import "dotenv/config";

console.log("Loaded API_BASE_URL:", process.env.API_BASE_URL);

export default ({ config }) => ({
  ...config,
  name: "BinaryPrime",
  slug: "binaryprime",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "binaryprime",
  userInterfaceStyle: "automatic",
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
    eas: {
      projectId: "2b7ff116-53e2-45a0-aba1-c79f86921d23", // Add your EAS project ID here
    },
  },
  android: {
    package: "com.calvinrotich.binaryprime", // <-- Add this line
    ...config.android,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  ios: {
    ...config.ios,
    supportsTablet: true,
  },
  web: {
    ...config.web,
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
