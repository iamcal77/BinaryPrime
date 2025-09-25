import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {/* Home */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.tabButton}
        >
          <Ionicons
            name={state.index === state.routes.findIndex(r => r.name === "Home") ? "home" : "home-outline"}
            size={24}
            color={state.index === state.routes.findIndex(r => r.name === "Home") ? "#32ba1a" : "#666"}
          />
          <Text style={[
            styles.tabLabel,
            state.index === state.routes.findIndex(r => r.name === "Home") && styles.activeTabLabel
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Account */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Account")}
          style={styles.tabButton}
        >
          <Ionicons
            name={state.index === state.routes.findIndex(r => r.name === "Account") ? "person" : "person-outline"}
            size={24}
            color={state.index === state.routes.findIndex(r => r.name === "Account") ? "#32ba1a" : "#666"}
          />
          <Text style={[
            styles.tabLabel,
            state.index === state.routes.findIndex(r => r.name === "Account") && styles.activeTabLabel
          ]}>
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    left: 0, // Touch left side
    right: 0, // Touch right side
    bottom: 0, // Touch bottom
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 0, // No horizontal padding
    paddingVertical: 12,
    height: 70, // Fixed height
    width: "100%", // Full width
    justifyContent: "space-around", // Evenly distribute space
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2, // Shadow above the tab bar
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    flex: 1, // Equal distribution of space
    height: "100%", // Full height of tab bar
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    marginTop: 4,
  },
  activeTabLabel: {
    color: "#32ba1a",
    fontWeight: "600",
  },
});

export default function TabNavigator() {
  return (
    <>
      <Navbar />
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ 
          headerShown: false,
          // Add safe area insets for content
          contentStyle: { 
            backgroundColor: '#f8f9fa',
            paddingBottom: 70 // Add padding to prevent content from being hidden behind tab bar
          }
        }}
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