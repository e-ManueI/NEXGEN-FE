import { z } from "zod";
import { signupSchema } from "@/lib/zod/auth";
import { loginSchema } from "@/lib/zod/auth";

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

export type LoginFormErrors = {
  email?: string[];
  password?: string[];
};

export type SignupFormErrors = {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  companyName?: string[];
  password?: string[];
  retypePassword?: string[];
};

export type LoginState = {
  success: boolean;
  errors?: LoginFormErrors;
  message?: string;
};

export type SignupState = {
  success: boolean;
  errors?: SignupFormErrors;
  message?: string;
};
