import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, TouchableOpacity, View } from "react-native";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Navbar from "../../context/Navbar";
import DetailScreen from "../../screens/DetailScreen";
import HomeScreen from "../../screens/HomeScreen";
import LoanProcess from "../../screens/LoanProcess";
import ManageAccount from "../../screens/ManageAccount";
import MyLoans from "../../screens/MyLoans";

const Tab = createBottomTabNavigator();

// Custom Tab Bar
function CustomTabBar({ state, navigation }: Pick<BottomTabBarProps, "state" | "navigation">) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#e9edf4ff",
        paddingVertical: 8,
        paddingHorizontal: 15,
        position: "absolute",  // 👈 place above bottom
        left: 0,
        right: 0,
        bottom: 20,            // 👈 lift upwards (adjust this value as needed)
        elevation: 5,          // 👈 shadow for Android
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      {/* Home */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{ alignItems: "center" }}
      >
        <Ionicons
          name="home"
          size={24}
          color={state.index === state.routes.findIndex(r => r.name === "Home") ? "#32ba1a" : "gray"}
        />
        <Text
          style={{
            fontSize: 12,
            color: state.index === state.routes.findIndex(r => r.name === "Home") ? "#32ba1a" : "gray",
          }}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Account */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Account")}
        style={{ alignItems: "center" }}
      >
        <Ionicons
          name="person"
          size={24}
          color={state.index === state.routes.findIndex(r => r.name === "Account") ? "#32ba1a" : "gray"}
        />
        <Text
          style={{
            fontSize: 12,
            color: state.index === state.routes.findIndex(r => r.name === "Account") ? "#32ba1a" : "gray",
          }}
        >
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}



export default function TabNavigator() {
  return (
    <>
      <Navbar /> {/* Keep your custom navbar at the top */}
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />} // 👈 use custom bar
        screenOptions={{ headerShown: false }}
      >
        {/* Visible Tabs */}
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Account" component={ManageAccount} />

        {/* Hidden Screens */}
        <Tab.Screen
          name="MyLoans"
          component={MyLoans}
          options={{ tabBarButton: () => null }}
        />
        <Tab.Screen
          name="Detail"
          component={DetailScreen}
          options={{ tabBarButton: () => null }}
        />
        <Tab.Screen
          name="LoanProcess"
          component={LoanProcess}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    </>
  );
}
