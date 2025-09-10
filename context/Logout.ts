// utils/logout.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token"); // remove saved token
  } catch (e) {
    console.error("Error logging out:", e);
  }
};
