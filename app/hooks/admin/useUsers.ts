import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import {
  CreateUserPayload,
  CreateUserResponse,
  UserAnalyticsResponse,
  UserDetailResponse,
  UserInfo,
} from "@/app/_types/user-info";
import fetchUsers from "@/app/services/admin/fetch-users";
import fetchUserAnalytics from "@/app/services/admin/fetch-users-analytics";
import fetchUserDetail from "@/app/services/admin/fetch-user-details";
import createUser from "@/app/services/admin/create-user";
import editUserFetcher from "@/app/services/admin/edit-user-details";

/**
 * Custom hook to retrieve user analytics data such as total users, new users,
 * active users, and deactivated users.
 *
 * @returns An object with the following properties:
 *   - `analytics`: The user analytics data or null if not available.
 *   - `loading`: A boolean indicating whether the data is currently being fetched.
 *   - `error`: An error object if the data could not be fetched.
 *   - `refresh`: A function to refresh the data.
 */
export function useUserAnalytics() {
  // Using SWR for data fetching and caching
  const { data, error, isLoading, mutate } =
    useSWR<UserAnalyticsResponse | null>(
      "/api/admin/users/analytics", // Endpoint to fetch user analytics
      fetchUserAnalytics, // Function to fetch the analytics data
    );

  // Return the analytics data and associated states
  return {
    analytics: data, // Fetched analytics data
    loading: isLoading, // Loading state
    error, // Error state
    refresh: mutate, // Function to refresh/re-fetch the data
  };
}

/**
 * Custom hook to retrieve a list of users.
 *
 * Utilizes SWR for data fetching and caching, providing a seamless way to manage
 * remote data with support for revalidation and error handling.
 *
 * @returns An object containing:
 *   - `users`: An array of user objects.
 *   - `loading`: A boolean indicating if the user data is being fetched.
 *   - `error`: An error object if there was an issue fetching the data.
 *   - `refresh`: A function to manually refresh/re-fetch the user data.
 */
export function useUsers() {
  // Destructure SWR response to manage user data
  const { data, error, isLoading, mutate } = useSWR<UserInfo[]>(
    "/api/admin/users", // Endpoint to fetch the list of users
    fetchUsers, // Function responsible for fetching users data from the API
  );

  // Return user data along with loading and error states
  return {
    users: data || [], // Provide an empty array as a default value
    loading: isLoading, // Track loading state
    error, // Capture any error encountered during fetch
    refresh: mutate, // Allow manual re-fetching of user data
  };
}

/**
 * Retrieves a user by ID.
 *
 * @param {string} userId - The ID of the user to fetch.
 *
 * @returns An object with the following properties:
 *   - `user`: The user object, or undefined if the user is not found.
 *   - `loading`: A boolean indicating whether the user is currently being fetched.
 *   - `error`: An error object if the user could not be fetched.
 */
export function useUserDetail(userId: string) {
  const { data, error, isValidating, mutate } = useSWR<UserDetailResponse>(
    `/api/admin/users/${userId}`,
    fetchUserDetail,
  );

  return {
    user: data ?? null,
    loading: isValidating,
    error,
    refresh: () => mutate(),
  };
}

/**
 * @deprecated This hook is deprecated and will be removed in the future
 * Creates a new user using the `createUser` action.
 *
 * @returns An object with the following properties:
 *   - `submit`: A function to submit the user creation form.
 *   - `loading`: A boolean indicating whether the form is currently being submitted.
 *   - `error`: An error object if the form could not be submitted, or null if the form was submitted successfully.
 *   - `data`: The created user object if the form was submitted successfully, or null if the form is not yet submitted or encountered an error.
 *   - `fieldErrors`: An object containing any validation errors for each field, or an empty object if no errors were encountered.
 */
export function useCreateUserSimple() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<CreateUserResponse | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CreateUserPayload, string>>
  >({});

  async function submit(payload: CreateUserPayload): Promise<void> {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const result = await createUser(payload);
      setData(result);
    } catch (err) {
      const error = err as { cause: Error | unknown };
      setError(error as Error);
      console.log("hook error", err);
      if (error.cause && typeof error.cause === "object") {
        setFieldErrors(
          error.cause as Partial<Record<keyof CreateUserPayload, string>>,
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error, data, fieldErrors };
}

/**
 * Edits a user using the `editUser` action.
 *
 * @returns An object with the following properties:
 *   - `editUser`: A function to edit the user.
 *   - `isEditing`: A boolean indicating whether the user is currently being edited.
 *   - `editError`: An error object if the user could not be edited, or null if the user was edited successfully.
 */
export function useEditUser() {
  const { refresh: refreshUsers } = useUsers();
  const { refresh: refreshAnalytics } = useUserAnalytics();
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/admin/users",
    editUserFetcher,
  );

  const editUser = async (data: Partial<UserInfo> & { id: string }) => {
    const result = await trigger(data);
    // after success, revalidate the users list
    await refreshUsers();
    await refreshAnalytics();
    return result;
  };

  return { editUser, isEditing: isMutating, editError: error };
}
