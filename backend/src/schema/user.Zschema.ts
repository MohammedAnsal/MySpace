// import { z } from "zod";

// const nameRegex = /^[a-zA-Z\s]+$/;
// const phoneRegex = /^[0-9]{10,15}$/;
// const passwordRegex =
//   /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// const objectIdRegex = /^[0-9a-fA-F]{24}$/;
// const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

// // ✅ User Registration Validation Schema:-

// export const registerSchema = z.object({
//   fullName: z
//     .string()
//     .min(3, "Full name must be at least 3 characters long")
//     .max(50, "Full name must be at most 50 characters long")
//     .regex(nameRegex, "Full name can only contain letters and spaces"),

//   email: z
//     .string()
//     .regex(
//       gmailRegex,
//       "Email must be a valid Gmail address (e.g., example@gmail.com)"
//     ),

//   phone: z
//     .string()
//     .regex(phoneRegex, "Phone number must be between 10-15 digits"),

//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters long")
//     .regex(
//       passwordRegex,
//       "Password must contain at least one uppercase letter, one number, and one special character"
//     ),

//   // profile_picture: z.string().url("Invalid URL for profile picture"),

//   gender: z.enum(["Male", "Female", "Other"]),

//   // address_id: z.string().regex(objectIdRegex, "Invalid Address ID"),

//   role: z.enum(["user", "provider", "admin"]),
// });

// export type RegisterInput = z.infer<typeof registerSchema>;

import { z } from "zod";

const nameRegex = /^[a-zA-Z\s]+$/;
const phoneRegex = /^[0-9]{10,15}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

// ✅ User Registration Validation Schema
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters long")
      .max(50, "Full name must be at most 50 characters long")
      .regex(nameRegex, "Full name can only contain letters and spaces"),

    email: z
      .string()
      .regex(
        gmailRegex,
        "Email must be a valid Gmail address (e.g., example@gmail.com)"
      ),

    phone: z
      .string()
      .regex(phoneRegex, "Phone number must be between 10-15 digits"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one number, and one special character"
      ),

    confirmPassword: z.string(),

    gender: z.enum(["male", "female", "other"]),

    role: z.enum(["user", "provider"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ✅ User Sign-In Validation Schema
export const signInSchema = z.object({
  email: z
    .string()
    .regex(
      gmailRegex,
      "Email must be a valid Gmail address (e.g., example@gmail.com)"
    ),

  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SignInInput = z.infer<typeof signInSchema>;
