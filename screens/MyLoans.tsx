// src/screens/MyLoans.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useLoan from "../hooks/useLoan";

export default function MyLoans() {
  const { loans, isLoading, refetch } = useLoan();
  const navigation = useNavigation<any>();

  const renderStatus = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <View style={[styles.statusContainer, { backgroundColor: "#dcfce7" }]}>
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text style={[styles.statusText, { color: "#166534" }]}>
              Approved
            </Text>
          </View>
        );
      case "Rejected":
        return (
          <View style={[styles.statusContainer, { backgroundColor: "#fee2e2" }]}>
            <Ionicons name="close-circle" size={16} color="#dc2626" />
            <Text style={[styles.statusText, { color: "#7f1d1d" }]}>
              Rejected
            </Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusContainer, { backgroundColor: "#fef9c3" }]}>
            <Ionicons name="time" size={16} color="#f59e0b" />
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
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#2563eb" />
          </View>
          <Text style={styles.name}>{item.userFullName}</Text>
        </View>
        {renderStatus(item.status)}
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="cash-outline" size={16} color="#2563eb" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Loan Amount</Text>
            <Text style={styles.detailValue}>
              KES {item.amount.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="trending-up-outline" size={16} color="#2563eb" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Total Repayable</Text>
            <Text style={styles.detailValue}>
              KES {item.totalRepayable.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="bar-chart-outline" size={16} color="#2563eb" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Interest Rate</Text>
            <Text style={styles.detailValue}>{item.interestRate}%</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="calendar-outline" size={16} color="#2563eb" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>
              {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="time-outline" size={16} color="#2563eb" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Applied On</Text>
            <Text style={styles.detailValue}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2563eb" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Loans</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={32} color="#2563eb" />
          <Text style={styles.loadingText}>Loading your loans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Loans</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color="#2563eb" />
            <Text style={styles.statNumber}>{loans.length}</Text>
            <Text style={styles.statLabel}>Total Loans</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
            <Text style={styles.statNumber}>
              {loans.filter((loan: any) => loan.status === 'Approved').length}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>

        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          renderItem={renderLoanItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={['#2563eb']}
              tintColor={'#2563eb'}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document" size={64} color="#cbd5e1" />
              <Text style={styles.emptyText}>No loans found</Text>
              <Text style={styles.emptySubtext}>
                You haven't applied for any loans yet.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  headerRight: {
    width: 32,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusText: {
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  detailsContainer: {
    marginBottom: 0, // Removed margin since there's no button anymore
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
});