import { z } from "zod";

export const hostelValidationSchema = z.object({
  hostel_name: z
    .string()
    .trim()
    .min(3, "Hostel name must be at least 3 characters")
    .max(100, "Hostel name cannot exceed 100 characters")
    .refine((val) => /^[a-zA-Z0-9\s\-']+$/.test(val), {
      message:
        "Hostel name can only contain letters, numbers, spaces, hyphens, and apostrophes",
    }),

  description: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters long")
    .refine((val) => val.split(/\s+/).length >= 10, {
      message: "Description must contain at least 10 words",
    }),

  monthly_rent: z
    .string()
    .trim()
    .nonempty("Monthly rent is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Monthly rent must be a valid positive number",
    })
    .refine((val) => Number(val) >= 100 && Number(val) <= 1000, {
      message: "Monthly rent must be between $100 and $1000",
    }),

  deposit_amount: z
    .string()
    .trim()
    .nonempty("Security deposit amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Security deposit must be a valid number",
    }),

  deposit_terms: z
    .string()
    .trim()
    .nonempty("Deposit terms are required")
    .min(20, "Deposit terms must be at least 20 characters long")
    .max(500, "Deposit terms cannot exceed 500 characters")
    .refine(
      (val) =>
        val.toLowerCase().includes("refund") ||
        val.toLowerCase().includes("return"),
      {
        message: "Deposit terms must mention refund or return policy",
      }
    ),

  maximum_occupancy: z
    .string()
    .trim()
    .nonempty("Maximum occupancy is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Maximum occupancy must be a valid positive number",
    })
    .refine((val) => Number(val) >= 1 && Number(val) <= 100, {
      message: "Maximum occupancy must be between 1 and 100",
    }),

  rules: z
    .string()
    .trim()
    .nonempty("House rules are required")
    .min(50, "House rules must be at least 50 characters long")
    .max(1000, "House rules cannot exceed 1000 characters")
    .refine(
      (val) => {
        const requiredTerms = ["quiet", "smoking", "visitors", "cleaning"];
        return requiredTerms.some((term) => val.toLowerCase().includes(term));
      },
      {
        message:
          "Please include policies about: quiet hours, smoking, visitors, or cleaning",
      }
    ),

  gender: z.enum(["male", "female", "unisex"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),

  total_space: z
    .string()
    .trim()
    .nonempty("Total space is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Total space must be a valid positive number",
    }),

  address: z.string().nonempty("Address is required"),

  amenities: z
    .array(z.string(), {
      required_error: "Select at least one amenity",
      invalid_type_error: "Amenities must be an array",
    })
    .min(1, "Select at least one amenity"),

  facilities: z
    .array(z.string(), {
      required_error: "Select at least one facility",
      invalid_type_error: "Facilities must be an array",
    })
    .min(1, "Select at least one facility"),
});

export type HostelFormData = z.infer<typeof hostelValidationSchema>;
