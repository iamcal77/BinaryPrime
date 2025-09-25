import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import useLoan from "../hooks/useLoan";

const API_BASE_URL = "https://loan-backened.onrender.com";

export default function LoanForm({ navigation }: any) {
  const [loan, setLoan] = useState({
    amount: "",
    loanProductId: null,
    status: "Pending",
  });
  const [loanProducts, setLoanProducts] = useState<any[]>([]);

  // useLoan hook
  const { createLoan } = useLoan();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/LoanProduct/products`)
      .then((res) => {
        const products = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setLoanProducts(products);
      })
      .catch((err) => {
        console.error("Error fetching loan products", err);
        setLoanProducts([]);
      });
  }, []);

  const handleSubmit = async () => {
    if (!loan.loanProductId || !loan.amount) {
      // validation only
      return;
    }

    await createLoan({
      loanProductId: loan.loanProductId,
      amount: Number(loan.amount),
      status: "Pending",
    });

    navigation.goBack(); // hook already shows toast
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request a Loan</Text>

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
        <Pressable style={[styles.button, styles.submitBtn]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Request Loan</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.cancelBtn]}
          onPress={() => navigation.goBack()}
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
    backgroundColor: "#21b93fff",
  },
  cancelBtn: {
    backgroundColor: "#6b7280",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
