import { z } from "zod";
import parsePhoneNumberFromString from "libphonenumber-js";

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    // phone: z
    //   .string()
    //   .min(10, "Phone number must be at least 10 digits")
    //   .max(15, "Phone number cannot exceed 15 digits")
    //   .regex(/^[0-9]+$/, "Phone number must contain only digits")
    //   .transform((val) => val.trim())
    //   .refine((val) => !isNaN(Number(val)), {
    //     message: "Invalid phone number format",
    //   }),
    phone: z
      .string({ required_error: "Phone number is required" })
      .min(1, "Phone number is required")
      .refine(
        (value) => {
          const phone = parsePhoneNumberFromString(value);
          return phone?.isValid();
        },
        {
          message: "Enter a valid international phone number",
        }
      ),

    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#^]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: z
      .string()
      .trim()
      .min(8, "confirmPassword must be at least 8 characters"),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Please select a gender" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Profile validation schema
export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, "Phone number is required")
    .refine(
      (value) => {
        const phone = parsePhoneNumberFromString(value);
        return phone?.isValid();
      },
      {
        message: "Enter a valid international phone number",
      }
    ),
});

export type ProfileEditSchema = z.infer<typeof profileSchema>;
