import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Toast from "react-native-toast-message";
import RootNavigator from "../../app/navigation/RootNavigator";
import { AuthProvider } from "../../context/AuthProvider";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false, // not relevant in mobile apps
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigator />
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
}
