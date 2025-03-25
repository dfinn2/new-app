// schemas/companyCheckupSchema.ts
import { z } from "zod";

// Define the service tiers
export const checkupTiers = ["Basic", "Premium", "Complete"] as const;

// Custom USCC validation function
const isValidUSCC = (uscc: string) => {
  // USCC (Unified Social Credit Code) is typically 18 characters
  // This is a simplified validation for the Chinese business registration number
  const usccRegex = /^[0-9A-Z]{18}$/;
  return usccRegex.test(uscc);
};

// Define the main schema
export const companyCheckupSchema = z.object({
  // Basic information - required for all tiers
  manufacturerName: z.string().min(1, "Manufacturer name is required"),
  manufacturerNameChinese: z.string().optional(),
  usccNumber: z.string().refine(isValidUSCC, {
    message: "Please enter a valid 18-character USCC number",
  }),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  
  // Select tier of service
  tier: z.enum(checkupTiers),
  
  // Basic company information - optional but recommended
  yearEstablished: z.string().optional(),
  employeeCount: z.string().optional(),
  businessScope: z.string().optional(),
  productsManufactured: z.string().optional(),
  industryFocus: z.string().optional(),
  
  // Contact information for the report
  contactName: z.string().optional(),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().optional(),
  
  // Additional services - only for Complete tier
  factoryInspection: z.boolean().optional(),
  recordsCheck: z.boolean().optional(),
  meetingWithManufacturer: z.boolean().optional(),
  backgroundCheck: z.boolean().optional(),
  
  // File uploads will be handled separately during form processing
  // These can include business license copies, photos, etc.
  
  // Additional notes or special requirements
  additionalNotes: z.string().optional(),
});

// Type definition for form data
export type CompanyCheckupFormData = z.infer<typeof companyCheckupSchema>;