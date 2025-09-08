// app/screens/LoanLimitDashboard.tsx
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

export default function LoanLimitDashboard() {
  const usedAmount = 3000;
  const totalLimit = 5000;
  const availableAmount = totalLimit - usedAmount;
  const percentageUsed = usedAmount / totalLimit; // decimal (0–1)

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loan Limit Utilization</Text>

      {/* Donut Chart */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Donut Chart</Text>
        <ProgressChart
          data={{ labels: ["Used"], data: [percentageUsed] }}
          width={Dimensions.get("window").width - 60}
          height={180}
          strokeWidth={16}
          radius={40}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // blue
            labelColor: () => "#334155",
          }}
          hideLegend={false}
        />
        <View style={styles.row}>
          <Text style={styles.used}>Used: Ksh {usedAmount.toLocaleString()}</Text>
          <Text style={styles.available}>
            Available: Ksh {availableAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Progress Bar</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { flex: usedAmount }]} />
          <View style={{ flex: availableAmount, backgroundColor: "#e2e8f0" }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Used: {Math.round(percentageUsed * 100)}%</Text>
          <Text style={styles.label}>Total: Ksh {totalLimit.toLocaleString()}</Text>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summary}>
        <View style={[styles.summaryCard, { backgroundColor: "#eff6ff" }]}>
          <Text style={styles.summaryTitle}>Used Amount</Text>
          <Text style={styles.summaryValue}>Ksh {usedAmount.toLocaleString()}</Text>
          <Text style={styles.summaryNote}>
            {Math.round(percentageUsed * 100)}% of limit
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#f0fdf4" }]}>
          <Text style={styles.summaryTitle}>Available</Text>
          <Text style={styles.summaryValue}>Ksh {availableAmount.toLocaleString()}</Text>
          <Text style={styles.summaryNote}>
            {100 - Math.round(percentageUsed * 100)}% remaining
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#f1f5f9" }]}>
          <Text style={styles.summaryTitle}>Total Limit</Text>
          <Text style={styles.summaryValue}>Ksh {totalLimit.toLocaleString()}</Text>
          <Text style={styles.summaryNote}>Your approved limit</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  header: { fontSize: 20, fontWeight: "bold", color: "#1e293b", textAlign: "center", marginBottom: 20 },
  card: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  subHeader: { fontSize: 16, fontWeight: "600", color: "#334155", textAlign: "center", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  used: { color: "#3b82f6", fontWeight: "600" },
  available: { color: "#16a34a", fontWeight: "600" },
  label: { fontSize: 12, color: "#334155" },
  progressBar: { flexDirection: "row", height: 20, borderRadius: 10, overflow: "hidden", backgroundColor: "#e2e8f0" },
  progressFill: { backgroundColor: "#3b82f6" },
  summary: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  summaryCard: { flex: 1, margin: 5, padding: 12, borderRadius: 8, alignItems: "center" },
  summaryTitle: { fontSize: 14, color: "#334155" },
  summaryValue: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  summaryNote: { fontSize: 12, color: "#64748b" },
});
