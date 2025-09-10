// src/screens/LoanProcess.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import useVerification from "../hooks/useVerification";
import LoanForm from "./LoanForm";
import StepProgress from "./StepProgress";
import VerificationForm from "./VerificationForm";

export default function LoanProcess({ navigation }: any) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  const { checkVerificationStatus, sendVerification } = useVerification();

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      const status = await checkVerificationStatus();
      if (status === "Approved") {
        setStep(2);
      } else if (status === "Pending") {
        setStep(1);
      } else {
        setStep(0);
      }
      setLoading(false);
    };

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", 
 }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24, backgroundColor: "#fff", 
 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Loan Application Process
      </Text>
      <Text
        style={{
          textAlign: "center",
          marginBottom: 24,
          color: "#6b7280",
        }}
      >
        Complete the steps below to apply for your loan.
      </Text>

      {/* ✅ Balanced margin for StepProgress */}
      <View style={{ marginTop: 16 }}>
        <StepProgress currentStep={step} />
      </View>

      {/* Step 0 → Verification Form */}
      {step === 0 && (
       <VerificationForm
            onSubmit={async (formData: FormData) => {
                try {
                await sendVerification(formData);
                setStep(1); // ✅ now moves to pending step
                Toast.show({
                    type: "success",
                    text1: "Verification submitted",
                    text2: "Your application is pending review",
                });
                } catch {
                Toast.show({
                    type: "error",
                    text1: "Failed to submit verification.",
                });
                }
            }}
            onCancel={() => navigation.goBack()}
            />

      )}

      {/* Step 1 → Pending */}
      {step === 1 && (
        <View style={{ alignItems: "center", marginTop: 48 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Your verification is pending...
          </Text>
          <Text style={{ marginTop: 8, color: "#6b7280" }}>
            Please wait while we review your details.
          </Text>

          <Pressable
            onPress={async () => {
              const status = await checkVerificationStatus();
              if (status === "Approved") {
                setStep(2);
                Toast.show({
                  type: "success",
                  text1: "Verification approved!",
                });
              } else if (status === "Rejected") {
                setStep(0);
                Toast.show({
                  type: "error",
                  text1: "Verification rejected. Please resubmit.",
                });
              } else {
                Toast.show({
                  type: "info",
                  text1: "Still pending review.",
                });
              }
            }}
            style={{
              marginTop: 20,
              backgroundColor: "#2563eb",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Check Status
            </Text>
          </Pressable>
        </View>
      )}

      {/* Step 2 → Loan Form */}
      {step === 2 && <LoanForm navigation={navigation} />}
    </View>
  );
}
