import { Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function RootLayout() {
  const { token } = useContext(AuthContext);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </>
      )}
    </Stack>
  );
}
