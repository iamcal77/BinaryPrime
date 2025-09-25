// src/hooks/useLoans.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import Toast from "react-native-toast-message";
import { AuthContext } from "../context/AuthProvider"; // 👈 if you manage token

const API_BASE_URL ="https://loan-backened.onrender.com";


const fetchLoans = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/Loans`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const postLoan = async(newLoan: any, token:string) => {
  const response = await axios.post(`${API_BASE_URL}/api/Loans/borrow`,newLoan,{
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

const useLoan = () => {
     const { token } = useContext(AuthContext);
    const { data: loans, error, isLoading, refetch } = useQuery({
    queryKey: ["loans"],
    queryFn: () => fetchLoans(token!),
    enabled: !!token, // only run if token exists
  }); 
  
  const {mutateAsync: createLoan} = useMutation({
    mutationFn: (newLoan: any) => postLoan(newLoan, token!),
    onSuccess: () => {
      refetch();
           Toast.show({
              type: "success",
              text1: "Success",
              text2: "Loan request submitted!",
            });
    },
    onError: () => {
            Toast.show({
              type: "error",
              text1: "Missing Fields",
              text2: "Please fill all fields",
            });
    }
  });
    return {
        loans,
        createLoan,
        error,
        isLoading,
        refetch
    };
};
export default useLoan;
