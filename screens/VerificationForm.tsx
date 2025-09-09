// src/screens/VerificationForm.tsx
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  onSubmit: (data: FormData) => Promise<void> | void;
  onCancel?: () => void;
};

export default function VerificationForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    idNumber: "",
    idDocument: null as any,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setForm((prev) => ({ ...prev, idDocument: file }));
        if (file.mimeType?.startsWith("image/")) setPreview(file.uri);
      }
    } catch (err) {
      console.error("DocPicker error:", err);
      Toast.show({ type: "error", text1: "File pick failed" });
    }
  };

  const handleSubmit = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.dateOfBirth ||
      !form.idNumber ||
      !form.idDocument
    ) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Please complete all fields",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      
      // Use exact field names that match your backend DTO (case-sensitive!)
      payload.append("FirstName", form.firstName);
      payload.append("LastName", form.lastName);
      payload.append("DateOfBirth", form.dateOfBirth);
      payload.append("IdNumber", form.idNumber);
      
      // For the file, use the exact field name "IdDocument"
      payload.append("IdDocument", {
        uri: form.idDocument.uri,
        type: form.idDocument.mimeType || "application/octet-stream",
        name: form.idDocument.name || "document.jpg",
      } as any);

      console.log("Submitting verification with form data");
      await onSubmit(payload);
      
    } catch (err) {
      console.error("Submission error:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Submission failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Verification</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(v) => setForm((p) => ({ ...p, firstName: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(v) => setForm((p) => ({ ...p, lastName: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={form.dateOfBirth}
        onChangeText={(v) => setForm((p) => ({ ...p, dateOfBirth: v }))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="ID Number"
        value={form.idNumber}
        onChangeText={(v) => setForm((p) => ({ ...p, idNumber: v }))}
        keyboardType="numeric"
      />

      <Pressable style={styles.uploadBtn} onPress={pickDocument}>
        <Text style={styles.uploadText}>
          {form.idDocument ? form.idDocument.name : "Upload ID Document"}
        </Text>
      </Pressable>

      {preview && (
        <Image 
          source={{ uri: preview }} 
          style={styles.preview} 
          resizeMode="contain"
        />
      )}

      {form.idDocument && !preview && (
        <Text style={styles.fileName}>
          📄 {form.idDocument.name}
        </Text>
      )}

      <Pressable 
        style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitText}>
          {isSubmitting ? "Submitting..." : "Submit Verification"}
        </Text>
      </Pressable>

      {onCancel && (
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#1f2937"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
    fontSize: 16,
  },
  uploadBtn: {
    padding: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  uploadText: { 
    color: "#374151", 
    fontWeight: "500",
    fontSize: 16,
  },
  preview: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fileName: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 12,
    fontSize: 14,
  },
  submitBtn: {
    padding: 16,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: "#93c5fd",
  },
  submitText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  cancelBtn: {
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  cancelText: { 
    color: "#1f1e1eff", 
    fontWeight: "500",
    fontSize: 16,
  },
});