import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits")
      .transform((val) => val.trim())
      .refine((val) => !isNaN(Number(val)), {
        message: "Invalid phone number format",
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
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
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// interface UserFormData {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// interface FormErrors {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// export const validateForm = (
//   formData: UserFormData
// ): { isValid: boolean; errors: FormErrors } => {
//   let isValid = true;
//   const errors: FormErrors = {
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   };

//   if (formData.username.trim().length < 3) {
//     errors.username = "Name must be at least 3 characters long.";
//     isValid = false;
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(formData.email)) {
//     errors.email = "Please enter a valid email address.";
//     isValid = false;
//   }

//   if (formData.password.length < 8) {
//     errors.password = "Password must be at least 8 characters long.";
//     isValid = false;
//   }

//   if (formData.password !== formData.confirmPassword) {
//     errors.confirmPassword = "Passwords do not match.";
//     isValid = false;
//   }

//   return { isValid, errors };
// };
