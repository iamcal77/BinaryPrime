import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL ="https://loan-backened.onrender.com";

export interface Notification {
  id: number;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

async function fetchNotifications(): Promise<Notification[]> {
  const response = await axios.get(`${API_BASE_URL}/api/notifications`);
  return response.data || [];
}

export function useNotifications() {
  const {
    data: notifications = [],
    error,
    isLoading,
    refetch,
  } = useQuery<Notification[], Error>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60, // 1 min (optional: avoids unnecessary refetches)
    refetchOnWindowFocus: true, // refresh when tab is focused again
  });

  return {
    notifications,
    loading: isLoading,
    error: error?.message || null,
    refresh: refetch,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
}
