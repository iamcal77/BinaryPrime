import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "BinaryPrime",
  slug: "binaryprime",
  version: "1.0.0",
  orientation: "portrait",
  icon: "https://i.pinimg.com/1200x/3f/43/1e/3f431ec1cd80c97a6619f10bda596c9e.jpg",
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
      foregroundImage: "https://i.pinimg.com/1200x/3f/43/1e/3f431ec1cd80c97a6619f10bda596c9e.jpg",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  ios: {
    ...config.ios,
    supportsTablet: true,
    bundleIdentifier: "com.calvinrotich.binaryprime", // 👈 add this

  },
  web: {
    ...config.web,
    bundler: "metro",
    output: "static",
    favicon: "https://i.pinimg.com/1200x/3f/43/1e/3f431ec1cd80c97a6619f10bda596c9e.jpg",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "https://i.pinimg.com/1200x/3f/43/1e/3f431ec1cd80c97a6619f10bda596c9e.jpg",
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
