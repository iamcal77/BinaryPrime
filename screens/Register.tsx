import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

const API_BASE_URL = "https://loan-backened.onrender.com";

export default function Register() {
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "User",
    contact: "",
  });
  const [idDocument, setIdDocument] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

const pickDocument = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
  });

  

  if (!result.canceled) {
    setIdDocument(result);
  }
};


  const handleRegister = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.contact ||
      !idDocument
    ) {
      Toast.show({ type: "error", text1: "All fields are required!" });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key as keyof typeof formData]);
      });
      data.append("idDocument", {
        uri: idDocument.uri,
        name: idDocument.name,
        type: idDocument.mimeType || "application/octet-stream",
      } as any);

      const response = await axios.post(`${API_BASE_URL}/api/Auth/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        Toast.show({ type: "success", text1: "Registration successful!" });
        setFormData({ fullName: "", email: "", password: "", role: "User", contact: "" });
        setIdDocument(null);
      } else {
        Toast.show({ type: "error", text1: "Something went wrong" });
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: "error", text1: "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      {["fullName", "email", "contact"].map((field) => (
        <TextInput
          key={field}
          placeholder={`Your ${field}`}
          style={styles.input}
          value={formData[field as keyof typeof formData]}
          onChangeText={(value) => handleChange(field, value)}
          keyboardType={field === "email" ? "email-address" : "default"}
        />
      ))}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
        />
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Text>{idDocument ? "Document Selected" : "Upload ID Document"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>I am already a member</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  passwordContainer: { position: "relative", marginBottom: 12 },
  showButton: { position: "absolute", right: 12, top: 12 },
  uploadButton: {
    backgroundColor: "#e0f2fe",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButton: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center" },
  disabledButton: { backgroundColor: "#9ca3af" },
  submitText: { color: "#fff", fontWeight: "600" },
  loginLink: { color: "#2563eb", textAlign: "center", marginTop: 12 },
  image: { width: "100%", height: 200, marginTop: 20 },
});
