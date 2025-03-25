// schemas/nnnAgreementSchema.ts
import { z } from "zod";

// Custom USCC validation function
const isValidUSCC = (uscc: string) => {
  // USCC (Unified Social Credit Code) is typically 18 characters
  // This is a simplified validation - should be improved for production
  const usccRegex = /^[0-9A-Z]{18}$/;
  return usccRegex.test(uscc);
};

export const companyCheckupSchema = z.object({
  // Disclosing Party Information
  disclosingPartyType: z.enum(["Individual", "Corporation", "Other"]),
  disclosingPartyName: z.string().min(1, "Disclosing party name is required"),
  disclosingPartyBusinessNumber: z.string().optional(),
  
  // Receiving Party Information
  receivingPartyName: z.string().min(1, "Receiving party name is required"),
  receivingPartyNameChinese: z.string().optional(),
  receivingPartyAddress: z.string().min(1, "Receiving party address is required"),
  receivingPartyUSCC: z.string().refine(isValidUSCC, {
    message: "Please enter a valid USCC number (18 characters)",
  }),
  
  // Product Information
  productName: z.string().min(1, "Product name is required"),
  productTrademark: z.enum(["want", "have", "notInterested"]),
  productDescription: z.string().min(10, "Product description should be at least 10 characters"),
  
  // Agreement Terms
  arbitration: z.enum([
    "ICC International Court of Arbitration",
    "Singapore International Arbitration Centre",
    "Hong Kong International Arbitration Centre",
    "London Court of International Arbitration",
    "American Arbitration Association"
  ]),
  penaltyDamages: z.enum([
    "liquidatedDamages",
    "provableDamages"
  ]),
  
  // New email field (optional, but validated as email if provided)
  email: z.string().email("Please enter a valid email address").optional(),
});

export type CompanyCheckupFormData = z.infer<typeof companyCheckupSchema>;