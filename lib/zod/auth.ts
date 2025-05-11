import { UserType } from "@/app/_db/enum";
import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    companyName: z.string().min(1, "Company name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    retypePassword: z.string(),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createUserSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().min(1, "Company name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserType),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name cannot be empty if provided")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name cannot be empty if provided")
    .optional(),
  email: z.string().email("Invalid email address").optional(),

  role: z.nativeEnum(UserType).optional(),
});
