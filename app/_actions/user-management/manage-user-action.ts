import { toast } from "sonner";
import { manageUserAction } from "./delete-user-action";

/**
 * Handles a user management action.
 *
 * @param operation - The type of action to perform on the user: "delete" or "activate".
 * @param userId - The ID of the user to manage.
 * @param refreshAll - A function to refresh all relevant data after a successful action.
 *
 * @returns void
 *
 * The function will first ask the user to confirm the action. If the user confirms, the
 * action will be performed. If the action is successful, a success message will be displayed
 * and the `refreshAll` function will be called. If the action fails, an error message will be
 * displayed.
 */
export const handleUserMgtAction = async (
  operation: "delete" | "activate",
  userId: string,
  refreshAll: () => void,
) => {
  const confirmMsg =
    operation === "delete"
      ? "Are you sure you want to delete this user?"
      : "Are you sure you want to activate this user?";

  if (!confirm(confirmMsg)) return;

  try {
    const result = await manageUserAction({ userId, operation });
    if (result.success) {
      toast.success(operation === "delete" ? "User deleted" : "User activated");
      refreshAll();
    } else {
      toast.error(result.message ?? `Failed to ${operation} user`);
    }
  } catch (err) {
    console.error(err);
    toast.error(`Failed to ${operation} user`);
  }
};
