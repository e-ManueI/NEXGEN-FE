import { useEffect, useState } from "react";
import { fetchUserAnalytics, fetchUsers } from "@/app/services/users";
import { UserAnalytics } from "@/app/_types/user-analytics";
import { UserInfo } from "@/app/_types/user-info";

export function useUserAnalytics() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUserAnalytics()
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { analytics, loading };
}

export function useUsers() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => {
        console.error(err);
        setError(err);
        setUsers([]); // ← explicitly set empty on error
      })
      .finally(() => setLoading(false));
  }, []);
  return { users, loading, error };
}
