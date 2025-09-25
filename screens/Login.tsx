import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { AuthContext } from "../context/AuthProvider";

const API_BASE_URL = "https://loan-backened.onrender.com"; // or from process.env if configured

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { setToken } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Please enter both email and password",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      if (token) {
        setToken(token);
        await AsyncStorage.setItem("token", token);

        Toast.show({
          type: "success",
          text1: "Login successful",
        });

        // Fetch user role
        const userResponse = await axios.get(`${API_BASE_URL}/api/Users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role = userResponse.data.role;
        if (role === "Admin") {
          navigation.navigate("MainTabs", { screen: "Home" });
        } else {
          navigation.navigate("MainTabs", { screen: "Home" });
        }
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: "Please check your credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0,color: "#111827" }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Text style={{ color: "#2563eb", fontWeight: "600" }}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#111827"

  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  showButton: {
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    color: "#2563eb",
    fontSize: 14,
    marginTop: 8,
  },
});
