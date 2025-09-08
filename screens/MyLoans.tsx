// src/screens/MyLoans.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import useLoan from "../hooks/useLoan";

export default function MyLoans() {
  const { loans, isLoading } = useLoan();
  const navigation = useNavigation<any>();

  const renderStatus = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <View style={[styles.statusContainer, { backgroundColor: "#dcfce7" }]}>
            <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
            <Text style={[styles.statusText, { color: "#166534" }]}>
              Approved
            </Text>
          </View>
        );
      case "Rejected":
        return (
          <View style={[styles.statusContainer, { backgroundColor: "#fee2e2" }]}>
            <Ionicons name="close-circle" size={18} color="#dc2626" />
            <Text style={[styles.statusText, { color: "#7f1d1d" }]}>
              Rejected
            </Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusContainer, { backgroundColor: "#fef9c3" }]}>
            <Ionicons name="time" size={18} color="#f59e0b" />
            <Text style={[styles.statusText, { color: "#92400e" }]}>
              Pending
            </Text>
          </View>
        );
    }
  };

  const renderLoanItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.userFullName}</Text>
        {renderStatus(item.status)}
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="cash-outline" size={16} color="#475569" />
        <Text style={styles.detailText}>
          Amount: KES {item.amount.toLocaleString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="trending-up-outline" size={16} color="#475569" />
        <Text style={styles.detailText}>
          Total Repayable: KES {item.totalRepayable.toLocaleString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="bar-chart-outline" size={16} color="#475569" />
        <Text style={styles.detailText}>
          Interest Rate: {item.interestRate}%
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={16} color="#475569" />
        <Text style={styles.detailText}>
          Due: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="time-outline" size={16} color="#475569" />
        <Text style={styles.detailText}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate("LoanDetails", { id: item.id })}
      >
        <Ionicons name="eye" size={18} color="white" />
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 16, color: "#6b7280" }}>Loading loans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📌 My Loans</Text>
      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        renderItem={renderLoanItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f1f5f9" },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "600", color: "#1f2937" },
  detailRow: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  detailText: { marginLeft: 8, fontSize: 14, color: "#475569" },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: { marginLeft: 6, fontWeight: "600", fontSize: 13 },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    justifyContent: "center",
  },
  viewButtonText: { marginLeft: 6, color: "white", fontWeight: "600" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
});
