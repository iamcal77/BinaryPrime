import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import useLoan from "../hooks/useLoan";

const API_BASE_URL = "https://loan-backened.onrender.com";

export default function LoanForm({ navigation }: any) {
  const [loan, setLoan] = useState({
    amount: "",
    loanProductId: null,
    guarantorUserId: null,
    status: "Pending",
  });

  const [loanProducts, setLoanProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // 👈 added loading state

  const { createLoan } = useLoan();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/LoanProduct/products`),
          axios.get(`${API_BASE_URL}/api/Users`),
        ]);

        const products = Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.data || [];
        const userData = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data?.data || [];

        setLoanProducts(products);
        setUsers(userData);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!loan.loanProductId || !loan.amount || !loan.guarantorUserId) {
      alert("Please fill in all fields including the guarantor.");
      return;
    }

    try {
      setLoading(true); // start loading
      await createLoan({
        loanProductId: loan.loanProductId,
        amount: Number(loan.amount),
        guarantorUserIds: [loan.guarantorUserId],
        status: "Pending",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Loan creation failed:", error);
      alert("Failed to request loan. Please try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request a Loan</Text>

      {/* Loan Product Picker */}
      <Text style={styles.label}>Loan Product</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={loan.loanProductId}
          onValueChange={(value) =>
            setLoan((prev) => ({ ...prev, loanProductId: value }))
          }
          style={styles.picker}
          dropdownIconColor="#111827"
        >
          <Picker.Item label="Select a product..." value={null} color="#374151" />
          {loanProducts.map((p) => (
            <Picker.Item key={p.id} label={p.name} value={p.id} color="#111827" />
          ))}
        </Picker>
      </View>

      {/* Guarantor Picker */}
      <Text style={styles.label}>Select Guarantor</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={loan.guarantorUserId}
          onValueChange={(value) =>
            setLoan((prev) => ({ ...prev, guarantorUserId: value }))
          }
          style={styles.picker}
          dropdownIconColor="#111827"
        >
          <Picker.Item label="Select guarantor..." value={null} color="#374151" />
          {users.map((u) => (
            <Picker.Item key={u.id} label={u.fullName} value={u.id} color="#111827" />
          ))}
        </Picker>
      </View>

      {/* Loan Amount */}
      <Text style={styles.label}>Loan Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={loan.amount}
        onChangeText={(text) => setLoan((prev) => ({ ...prev, amount: text }))}
        placeholder="Enter loan amount"
        placeholderTextColor="#999"
      />

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.submitBtn, loading && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Request Loan</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, styles.cancelBtn]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
    color: "#111827",
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
    color: "#374151",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitBtn: {
    backgroundColor: "#21b93f",
  },
  cancelBtn: {
    backgroundColor: "#6b7280",
  },
  disabledBtn: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
