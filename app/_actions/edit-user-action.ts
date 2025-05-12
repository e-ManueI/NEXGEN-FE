import { toast } from "sonner";
import { UserInfo } from "../_types/user-info";

/**
 * Handles the editing of a user's details.
 *
 * @param updated - An object containing the user's updated details, including
 * the user ID, first name, last name, email, optional new password, and role.
 * @param editUser - A function to edit the user using the provided details.
 * @param refreshAll - A function to refresh all relevant data after a successful edit.
 * @param editError - An optional error message to be displayed if the edit fails.
 *
 * @returns void
 *
 * The function attempts to update the user's details using the `editUser` function.
 * If successful, a success message is displayed and the `refreshAll` function is called.
 * If the update fails, an error message is logged and displayed.
 */

export const handleUserEdit = async (
  updated: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    newPassword?: string;
    role: string;
  },
  editUser: (user: Partial<UserInfo> & { id: string }) => Promise<void>,
  refreshAll: () => void,
  editError?: string,
) => {
  try {
    await editUser(updated);
    toast.success("User updated successfully");
    refreshAll();
  } catch (err) {
    console.error(err);
    toast.error(editError ?? "Failed to update user");
  }
};
