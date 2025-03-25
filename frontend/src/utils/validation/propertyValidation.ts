import { z } from "zod";

export const propertyValidationSchema = z.object({
  // Basic Information
  title: z.string()
    .min(3, "Hostel name must be at least 3 characters")
    .max(100, "Hostel name cannot exceed 100 characters")
    .refine((val) => /^[a-zA-Z0-9\s\-']+$/.test(val), {
      message: "Hostel name can only contain letters, numbers, spaces, hyphens and apostrophes"
    }),

  description: z.string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .refine((val) => val.trim().split(/\s+/).length >= 10, {
      message: "Description must contain at least 10 words"
    }),

  propertyType: z.enum(["hostel"], {
    errorMap: () => ({ message: "Please select a valid property type" })
  }),

  // Location
  address: z.string()
    .min(5, "Address is required")
    .max(200, "Address is too long"),

  latitude: z.number({
    required_error: "Location is required",
    invalid_type_error: "Invalid latitude",
  })
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude")
    .nullable()
    .refine((val) => val !== null, "Please select a location on the map"),

  longitude: z.number({
    required_error: "Location is required",
    invalid_type_error: "Invalid longitude",
  })
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude")
    .nullable()
    .refine((val) => val !== null, "Please select a location on the map"),

  // Details
  price: z.string()
    .min(1, "Monthly rent is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Monthly rent must be a valid positive number"
    })
    .refine((val) => Number(val) >= 1000 && Number(val) <= 100000, {
      message: "Monthly rent must be between ₹1,000 and ₹100,000"
    }),

  deposit: z.string()
    .min(1, "Security deposit is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Security deposit must be a valid number"
    }),

  depositTerms: z.string()
    .min(20, "Deposit terms must be at least 20 characters")
    .max(500, "Deposit terms cannot exceed 500 characters")
    .refine((val) => val.includes("refund") || val.includes("return"), {
      message: "Please specify refund or return policy in deposit terms"
    }),

  totalSpace: z.string()
    .min(1, "Total space is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Total space must be a valid positive number"
    })
    .refine((val) => Number(val) >= 100 && Number(val) <= 10000, {
      message: "Total space must be between 100 and 10,000 sq ft"
    }),

  bedrooms: z.string()
    .min(1, "Number of beds is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Number of beds must be a valid positive number"
    })
    .refine((val) => Number(val) >= 1 && Number(val) <= 50, {
      message: "Number of beds must be between 1 and 50"
    }),

  bathrooms: z.string()
    .min(1, "Number of bathrooms is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Number of bathrooms must be a valid positive number"
    }),

  maxOccupancy: z.string()
    .min(1, "Maximum occupancy is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Maximum occupancy must be a valid positive number"
    })
    .refine((val) => Number(val) >= 1 && Number(val) <= 100, {
      message: "Maximum occupancy must be between 1 and 100"
    }),

  // House Rules
  rules: z.string()
    .min(50, "House rules must be at least 50 characters")
    .max(1000, "House rules cannot exceed 1000 characters")
    .refine((val) => {
      const requiredTerms = ['quiet', 'smoking', 'visitors', 'cleaning'];
      return requiredTerms.some(term => val.toLowerCase().includes(term));
    }, {
      message: "Please include policies about: quiet hours, smoking, visitors, or cleaning"
    }),

  // Images validation will be handled separately in the component
  images: z.array(z.any())
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),

  amenities: z.array(z.string())
    .min(1, "Select at least one amenity"),

  facilities: z.array(z.string())
    .min(1, "Select at least one facility"),
});

export type PropertyFormData = z.infer<typeof propertyValidationSchema>; 