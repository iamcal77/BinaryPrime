// app/screens/HomeScreen.tsx
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoanLimit from "../screens/LoanLimitDashboard";


const API_BASE_URL = "https://loan-backened.onrender.com";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"request" | "view">("request");

  const [showBalance, setShowBalance] = useState(false);
  const balance = "KES 25,000"; 

  const [fullName, setFullName] = useState("");

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // 👈 use AsyncStorage
      if (!token) return;

      const { data } = await axios.get(`${API_BASE_URL}/api/Users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFullName(data.fullName || "");
    } catch (e) {
      console.error("Error fetching user:", e);
      setFullName("");
    }
  };
  fetchUser();
}, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70 }}>
      {/* Greeting Section */}
      <Text style={styles.greetingText}>
        {getGreeting()}, {fullName || "User"}! 👋
      </Text>

      {/* Balance Section */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>
            {showBalance ? balance : "******"}
          </Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Ionicons
              name={showBalance ? "eye-off" : "eye"}
              size={22}
              color="#374151"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Header buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            activeTab === "request" ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => {
            setActiveTab("request");
            navigation.navigate("LoanProcess" as never);
          }}
        >
          <FontAwesome name="file-text" size={18} color="green" />
          <Text style={activeTab === "request" ? styles.activeText : styles.inactiveText}>
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
            navigation.navigate("MyLoans" as never);
          }}
        >
          <FontAwesome name="list-alt" size={18} color="blue" />
          <Text style={activeTab === "view" ? styles.activeText : styles.inactiveText}>
            My Loans
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* LoanLimit component */}
      <LoanLimit />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#343232",
    marginBottom: 12,
    textAlign: "center",
  },
  balanceCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
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
    backgroundColor: "#2563eb",
  },
  inactiveButton: {
    backgroundColor: "#e5e7eb",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#374151",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
});
