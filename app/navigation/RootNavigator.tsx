// app/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import LoginScreen from "../../screens/Login";
import Register from "../../screens/Register";
import TabNavigator from "./TabNavigator";

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { token, loading } = useContext(AuthContext);

  // Show a loading screen while checking authentication state
  if (loading) {
    return null; // Or a loading component
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        // Authenticated user - show main app
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      ) : (
        // Unauthenticated user - show auth screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}