import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
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
  const [progressAnim] = useState(new Animated.Value(0));

  // Password validation function
  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUniqueChars: new Set(password).size >= 5,
    };

    const isValid = Object.values(requirements).every(Boolean);
    const strength = Object.values(requirements).filter(Boolean).length;

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: (strength / 6) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();

    return { requirements, isValid, strength };
  };

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
  if (!formData.fullName || !formData.email || !formData.password || !formData.contact || !idDocument) {
    Toast.show({ type: "error", text1: "All fields are required!" });
    return;
  }

  setLoading(true);
  try {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const file = idDocument.assets[0];
    data.append("IdDocument", {
      uri: file.uri,
      name: file.name || "document",
      type: file.mimeType || "application/octet-stream",
    });

    const response = await axios.post(`${API_BASE_URL}/api/Auth/register`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      transformRequest: () => data, // ⬅️ ensures correct boundary
    });

    Toast.show({ type: "success", text1: "Registration successful!" });
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    const msg = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat().join(", ")
      : "Registration failed";
    Toast.show({ type: "error", text1: msg });
  } finally {
    setLoading(false);
  }
};



  const passwordValidation = validatePassword(formData.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong", "Excellent"];
  const strengthColors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60", "#2196f3", "#9b59b6"];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subtitle}>Join us and get started today</Text>

        {/* Input Fields */}
        {[
          { field: "fullName", placeholder: "Full Name", icon: "person" },
          { field: "email", placeholder: "Email Address", icon: "mail", keyboardType: "email-address" },
          { field: "contact", placeholder: "Phone Number", icon: "call", keyboardType: "phone-pad" }
        ].map(({ field, placeholder, icon, keyboardType = "default" }) => (
          <View key={field} style={styles.inputContainer}>
            <Ionicons name={icon as any} size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              placeholder={placeholder}
              style={styles.input}
              value={formData[field as keyof typeof formData]}
              onChangeText={(value) => handleChange(field, value)}
              keyboardType={keyboardType}
              placeholderTextColor="#9ca3af"
            />
          </View>
        ))}

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput
            placeholder="Create Password"
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            style={styles.showButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#6b7280" 
            />
          </TouchableOpacity>
        </View>

        {/* Password Strength Indicator */}
        {formData.password.length > 0 && (
          <PasswordStrengthIndicator 
            password={formData.password}
            progressAnim={progressAnim}
          />
        )}

        {/* ID Document Upload */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Ionicons name="document-attach" size={24} color="#2563eb" />
          <View style={styles.uploadTextContainer}>
            <Text style={styles.uploadTitle}>
              {idDocument ? "Document Selected" : "Upload ID Document"}
            </Text>
            {idDocument && (
              <Text style={styles.fileName} numberOfLines={1}>
                {idDocument.assets[0].name}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity 
          style={styles.loginContainer}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <Toast />
      </View>
    </ScrollView>
  );
}

// Password Strength Indicator Component
const PasswordStrengthIndicator = ({ password, progressAnim }: any) => {
  const validatePassword = (pwd: string) => {
    const requirements = {
      length: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      hasUniqueChars: new Set(pwd).size >= 5,
    };

    const strength = Object.values(requirements).filter(Boolean).length;
    return { requirements, strength };
  };

  const { requirements, strength } = validatePassword(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong", "Excellent"];
  const strengthColors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60", "#2196f3", "#9b59b6"];

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthHeader}>
        <Text style={styles.strengthTitle}>Password Strength</Text>
        <Text style={[styles.strengthLabel, { color: strengthColors[strength] }]}>
          {strengthLabels[strength]}
        </Text>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { 
              width: progressWidth,
              backgroundColor: strengthColors[strength]
            }
          ]} 
        />
      </View>

      {/* Requirements Grid */}
      <View style={styles.requirementsGrid}>
        <RequirementItem met={requirements.length} text="8+ characters" />
        <RequirementItem met={requirements.hasUpperCase} text="Uppercase letter" />
        <RequirementItem met={requirements.hasLowerCase} text="Lowercase letter" />
        <RequirementItem met={requirements.hasNumber} text="Number" />
        <RequirementItem met={requirements.hasSpecialChar} text="Special character" />
        <RequirementItem met={requirements.hasUniqueChars} text="5+ unique chars" />
      </View>
    </View>
  );
};

// Requirement Item Component
const RequirementItem = ({ met, text }: any) => (
  <View style={styles.requirementItem}>
    <Ionicons 
      name={met ? "checkmark-circle" : "ellipse-outline"} 
      size={16} 
      color={met ? "#10b981" : "#9ca3af"} 
    />
    <Text style={[styles.requirementText, met && styles.requirementMet]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: { 
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    padding: 24, 
    backgroundColor: "#f9fafb"
  },
  header: { 
    fontSize: 32, 
    fontWeight: "bold", 
    marginBottom: 8, 
    textAlign: "center",
    color: "#1f2937"
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    height: "100%",
  },
  showButton: { 
    padding: 4,
  },
  strengthContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  strengthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  requirementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 8,
  },
  requirementMet: {
    color: "#10b981",
    fontWeight: "500",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#dbeafe",
    borderStyle: "dashed",
    width: "100%",
    maxWidth: 400,
  },
  uploadTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
  fileName: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  submitButton: { 
    backgroundColor: "#2563eb", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: { 
    backgroundColor: "#9ca3af",
    shadowColor: "#9ca3af",
  },
  submitText: { 
    color: "#fff", 
    fontWeight: "600",
    fontSize: 16,
  },
  loginContainer: {
    marginTop: 24,
  },
  loginText: {
    color: "#6b7280",
    textAlign: "center",
    fontSize: 14,
  },
  loginLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
});