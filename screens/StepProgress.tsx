// src/components/StepProgress.tsx
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    {
      label: "Verification",
      icon: <FontAwesome name="check-circle" size={20} color="white" />,
    },
    {
      label: "Pending",
      icon: <MaterialIcons name="hourglass-empty" size={20} color="white" />,
    },
    {
      label: "Loan Request",
      icon: <MaterialIcons name="request-quote" size={20} color="white" />,
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 12,
        paddingHorizontal: 16, // ✅ prevents touching screen edges
      }}
    >
      {steps.map((step, index) => (
        <View
          key={step.label}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: index <= currentStep ? "#22c55e" : "#d1d5db",
            }}
          >
            {step.icon}
          </View>
          <Text
            style={{
              marginLeft: 4,
              fontSize: 12,
              color: index <= currentStep ? "#22c55e" : "#9ca3af",
              fontWeight: index <= currentStep ? "700" : "400",
            }}
          >
            {step.label}
          </Text>
          {index < steps.length - 1 && (
            <View
              style={{
                width: 32, // narrower line
                height: 2,
                backgroundColor: index < currentStep ? "#22c55e" : "#d1d5db",
                marginHorizontal: 4,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );
}
