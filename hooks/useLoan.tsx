// src/hooks/useLoans.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider"; // 👈 if you manage token

const API_BASE_URL ="https://loan-backened.onrender.com";


const fetchLoans = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/Loans`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const useLoan = () => {
      const { token } = useContext(AuthContext);
    const { data: loans, error, isLoading, refetch } = useQuery({
    queryKey: ["loans"],
    queryFn: () => fetchLoans(token!),
    enabled: !!token, // only run if token exists
  });   
    return {
        loans,
        error,
        isLoading,
        refetch
    };
};
export default useLoan;
