import MyLoans from "@/screens/MyLoans";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Navbar from '../../context/Navbar';
import DetailScreen from "../../screens/DetailScreen";
import HomeScreen from "../../screens/HomeScreen";
import LoanProcess from "../../screens/LoanProcess";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <>
      <Navbar /> {/* Your custom navbar at the top */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Hide default headers
          tabBarStyle: { display: 'none' } // Hide bottom tab bar if you want only your custom navbar
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="MyLoans" component={MyLoans} />
        <Tab.Screen name="Detail" component={DetailScreen} />
        <Tab.Screen name="LoanProcess" component={LoanProcess} />
      </Tab.Navigator>
    </>
  );
}