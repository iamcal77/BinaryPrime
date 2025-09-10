import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE_URL = "https://loan-backened.onrender.com";

export default function ManageAccount({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Authentication required");
          setFetching(false);
          return;
        }

        const { data } = await axios.get(`${API_BASE_URL}/api/Users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          profilePicture: data.profileImage || null,
          username: data.username || `user_${data.userId}`,
          fullName: data.fullName || "Not provided",
          email: data.email || "no-email@example.com",
          contact: data.contact || "N/A",
          isActive: data.isActive,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
        Alert.alert("Error", "Failed to load account data");
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser((prev: any) => ({
        ...prev,
        profilePicture: result.assets[0].uri,
      }));
      Alert.alert("Success", "Profile picture updated!");
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Here you would make an API call to save user changes
      setIsEditing(false);
      Alert.alert("Success", "Account updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save changes");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("token");
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.error("Error during logout", error);
            }
          } 
        }
      ]
    );
  };

  if (fetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Unable to load user data.</Text>
        <Button title="Retry" onPress={() => {}} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
  

      {/* Profile Picture */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri:
                user.profilePicture || "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
          <View style={styles.cameraOverlay}>
            <Ionicons name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.smallText}>Tap image to change</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>


        {/* Full Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={user.fullName}
              onChangeText={(text) => setUser({ ...user, fullName: text })}
            />
          ) : (
            <Text style={styles.value}>{user.fullName}</Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        {/* Phone */}
        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={user.contact}
              onChangeText={(text) => setUser({ ...user, contact: text })}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{user.contact}</Text>
          )}
        </View>
      </View>

     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f3f4f6" 
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 16,
  },

  headerText: { 
    color: "white", 
    fontSize: 22, 
    fontWeight: "700" 
  },

  profileSection: { 
    alignItems: "center", 
    marginVertical: 20 
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  smallText: { 
    fontSize: 14, 
    color: "#6b7280", 
    marginTop: 8 
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  field: { 
    marginVertical: 12, 
  },
  label: { 
    fontSize: 14, 
    color: "#374151", 
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    fontSize: 16,
  },
  value: { 
    padding: 12, 
    backgroundColor: "#f9fafb", 
    borderRadius: 8,
    fontSize: 16,
    color: "#1f2937",
  },
  statusBadge: { 
    position: "absolute", 
    right: 0, 
    top: 10 
  },
  active: { 
    color: "#10b981", 
    fontWeight: "600" 
  },
  inactive: { 
    color: "#ef4444", 
    fontWeight: "600" 
  },
  buttonContainer: { 
    marginTop: 20 
  },


});