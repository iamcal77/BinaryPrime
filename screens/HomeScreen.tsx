// app/screens/HomeScreen.tsx
import { FontAwesome } from "@expo/vector-icons"; // for icons
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoanLimit from "../screens/LoanLimitDashboard"; // adjust path if needed

export default function HomeScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"request" | "view">("request");

  return (
    <View style={styles.container}>
      {/* Header buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            activeTab === "request" ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => {
            setActiveTab("request");
            navigation.navigate("LoanProcess" as never); // <-- adjust screen name
          }}
        >
          <FontAwesome name="file-text" size={18} color="green" />
          <Text
            style={
              activeTab === "request" ? styles.activeText : styles.inactiveText
            }
          >
            Request Loan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            activeTab === "view" ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => {
            setActiveTab("view");
            navigation.navigate("MyLoans" as never); // <-- adjust screen name
          }}
        >
          <FontAwesome name="list-alt" size={18} color="blue" />
          <Text
            style={
              activeTab === "view" ? styles.activeText : styles.inactiveText
            }
          >
            My Loans
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* LoanLimit component */}
      <LoanLimit />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#2563eb", // blue
  },
  inactiveButton: {
    backgroundColor: "#e5e7eb", // gray-200
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#374151", // gray-700
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
});
