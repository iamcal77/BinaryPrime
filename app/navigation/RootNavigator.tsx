import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider'; // Import your AuthContext
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
  const { token } = useContext(AuthContext); // Get authentication state

  return (
    <Stack.Navigator 
      initialRouteName={token ? "MainTabs" : "Login"} // Conditionally set initial route
      screenOptions={{ headerShown: false }}
    >
      {token ? (
        // Authenticated user - show main app with tabs
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