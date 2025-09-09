import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import Toast from "react-native-toast-message";
import { AuthContext } from "../context/AuthProvider";

const API_BASE_URL = "https://loan-backened.onrender.com";

// ================= TYPES ==================
export interface Verification {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  idNumber: string;
  status: "Pending" | "Approved" | "Rejected" | "NotSubmitted";
  createdAt?: string;
  updatedAt?: string;
}

export interface VerificationStatusResponse {
  status: Verification["status"];
}

// ================= API CALLS ==================
const fetchVerifications = async (token: string): Promise<Verification[]> => {
  const response = await axios.get<Verification[]>(
    `${API_BASE_URL}/api/Verification/all`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const postVerification = async (
  newVerification: FormData,
  token: string
): Promise<Verification> => {
  const response = await axios.post<Verification>(
    `${API_BASE_URL}/api/Verification/upload-id`,
    newVerification,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const fetchVerificationStatus = async (
  token: string
): Promise<VerificationStatusResponse> => {
  const response = await axios.get<VerificationStatusResponse>(
    `${API_BASE_URL}/api/Verification/status`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const verifyVerification = async (
  id: string,
  token: string
): Promise<Verification> => {
  const response = await axios.put<Verification>(
    `${API_BASE_URL}/api/Verification/${id}/verify`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const rejectVerification = async (
  id: string,
  token: string
): Promise<Verification> => {
  const response = await axios.put<Verification>(
    `${API_BASE_URL}/api/Verification/${id}/reject`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// ================= HOOK ==================
const useVerification = () => {
  const { token } = useContext(AuthContext) as { token: string | null };

  const {
    data: verifications,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["verifications", token],
    queryFn: () => fetchVerifications(token!),
    enabled: !!token,
  });

  const { mutateAsync: sendVerification } = useMutation({
    mutationFn: (newVerification: FormData) =>
      postVerification(newVerification, token!),
    onSuccess: () => {
      refetch();
      Toast.show({
        type: "success",
        text1: "Verification details submitted successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Error submitting details:", error);
      Toast.show({
        type: "error",
        text1: "Failed to submit verification details",
      });
    },
  });

  const checkVerificationStatus = async (): Promise<
    Verification["status"] | null
  > => {
    if (!token) {
      Toast.show({
        type: "error",
        text1: "You must be logged in",
      });
      return null;
    }
    try {
      const { status } = await fetchVerificationStatus(token);
      return status;
    } catch (error) {
      console.error("Error checking status:", error);
      Toast.show({
        type: "error",
        text1: "Failed to check verification status",
      });
      return null;
    }
  };





  return {
    verifications,
    isLoading,
    refetch,
    sendVerification,
    checkVerificationStatus,
  };
};

export default useVerification;
