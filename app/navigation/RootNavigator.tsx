import MyLoans from "@/screens/MyLoans";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailScreen from "../../screens/DetailScreen";
import HomeScreen from "../../screens/HomeScreen";
import LoanForm from "../../screens/LoanForm";
import LoginScreen from "../../screens/Login";

export type RootStackParamList = {
  Home: undefined;
  Detail: undefined;
  LoanProcess: undefined;
  Login: undefined;
  Loans: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Detail" component={DetailScreen} />
    <Stack.Screen name="LoanProcess" component={LoanForm} />
    <Stack.Screen name="Loans" component={MyLoans} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>

  );
}
