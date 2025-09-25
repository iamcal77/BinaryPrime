import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useContext, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { AuthContext } from "../context/AuthProvider";

type Props = {
  onSubmit: (data: FormData) => Promise<void> | void;
  onCancel?: () => void;
};

export default function VerificationForm({ onSubmit, onCancel }: Props) {
  const { token } = useContext(AuthContext);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    idNumber: "",
    idDocument: null as any,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Fallback to raw string if parsing fails
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        let fileUri = file.uri;

        if (Platform.OS !== "web" && fileUri.startsWith("data:")) {
          // Native only: convert base64 → file://
          const base64 = fileUri.split(",")[1];
          const path = FileSystem.cacheDirectory + (file.name || "document.jpg");

          await FileSystem.writeAsStringAsync(path, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          fileUri = path;
        }

        const fixedFile = {
          uri: fileUri,
          type: file.mimeType || "application/octet-stream",
          name: file.name || "document.jpg",
        };

        console.log("Fixed File Data:", fixedFile);
        setForm((prev) => ({ ...prev, idDocument: fixedFile }));

        if (fixedFile.type.startsWith("image/")) {
          setPreview(fixedFile.uri);
        }
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

      // Append fields
      payload.append("FirstName", form.firstName);
      payload.append("LastName", form.lastName);
      payload.append("DateOfBirth", form.dateOfBirth);
      payload.append("IdNumber", form.idNumber);

      // Create Blob from file URI
      const fileResponse = await fetch(form.idDocument.uri);
      const blob = await fileResponse.blob();

      // Add file to FormData
      payload.append("IdDocument", blob, form.idDocument.name);

      // Make request with full error handling
      const uploadResponse = await fetch(
        "https://loan-backened.onrender.com/api/Verification/upload-id",
        {
          method: "POST",
          body: payload,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error("Upload failed:", errorData);
        Toast.show({
          type: "error",
          text1: "Upload failed",
          text2: errorData?.message || "Please try again later",
        });
        return;
      }

      const data = await uploadResponse.json();
      console.log("Upload successful:", data);
      await onSubmit(data);
    } catch (err) {
      console.error("Upload error:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Upload failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      
      {/* Date of Birth Field */}
      <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: form.dateOfBirth ? "#111827" : "#9ca3af" }}>
          {form.dateOfBirth ? formatDateForDisplay(form.dateOfBirth) : "Select Date of Birth"}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={form.dateOfBirth ? new Date(form.dateOfBirth) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
            if (selectedDate) {
              // Convert to YYYY-MM-DD string for storage
              const isoDate = selectedDate.toISOString().split("T")[0];
              setForm((p) => ({ ...p, dateOfBirth: isoDate }));
              
              // Close picker on Android after selection
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
              }
            }
          }}
        />
      )}

      {/* For iOS, add a Done button to close the picker */}
      {Platform.OS === 'ios' && showDatePicker && (
        <View style={styles.iosDatePickerActions}>
          <Pressable 
            style={styles.iosDoneButton}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={styles.iosDoneButtonText}>Done</Text>
          </Pressable>
        </View>
      )}

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
        <Text style={styles.fileName}>📄 {form.idDocument.name}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1f2937",
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
    fontSize: 16,
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
  iosDatePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  iosDoneButton: {
    padding: 10,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  iosDoneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});