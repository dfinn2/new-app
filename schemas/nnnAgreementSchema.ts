// schemas/nnnAgreementSchema.ts
import { z } from "zod";

// Custom USCC validation function
const isValidUSCC = (uscc: string) => {
  // USCC (Unified Social Credit Code) is typically 18 characters
  // This is a simplified validation for the Chinese business registration number
  const usccRegex = /^[0-9A-Z]{18}$/;
  return usccRegex.test(uscc);
};

export const nnnAgreementSchema = z.object({
  // Disclosing Party Information
  disclosingPartyType: z.enum(["Individual", "Corporation", "Other"]),
  disclosingPartyName: z.string().min(1, "Disclosing party name is required"),
  disclosingPartyAddress: z.string().min(1, "Disclosing party address is required"),
  disclosingPartyBusinessNumber: z.string().optional(),
  disclosingPartyCountry: z.string().min(1, "Country is required"),
  disclosingPartyJurisdiction: z.string().min(1, "Jurisdiction is required"),
  
  // Receiving Party Information (Manufacturer)
  receivingPartyName: z.string().min(1, "Manufacturer name is required"),
  receivingPartyNameChinese: z.string().min(1, "Manufacturer name in Chinese is required"),
  chineseNameVerified: z.enum(["needCheckup", "willConfirm"]).optional(),
  receivingPartyAddress: z.string().min(1, "Manufacturer address is required"),
  receivingPartyUSCC: z.string().refine(isValidUSCC, {
    message: "Please enter a valid USCC number (18 characters)",
  }),
  usccVerified: z.enum(["needCheckup", "willConfirm"]).optional(),
  orderCheckup: z.boolean().optional(),
  
  // Product Information
  productName: z.string().min(1, "Product name is required"),
  productDescription: z.string().min(10, "Product description should be at least 10 characters"),
  productTrademark: z.enum(["want", "have", "notInterested"]),
  
  // Agreement Terms
  arbitration: z.enum([
    "CIETAC Beijing",
    "CIETAC Shanghai",
    "HKIAC",
    "SHENZHEN COURT OF INTERNATIONAL ARBITRATION",
  ]),
  
  penaltyDamages: z.enum([
    "fixedAmount",
    "contractMultiple",
    "slidingScale",
  ]),
  
  penaltyAmount: z.string().optional(),
  penaltyMultiple: z.string().optional(),
  
  // Duration
  agreementDuration: z.number().int().min(1, "Agreement duration is required"),
  durationType: z.enum(["years", "months"]),
  
  // New email field (optional, but validated as email if provided)
  email: z.string().email("Please enter a valid email address").optional(),
});

export type NNNAgreementFormData = z.infer<typeof nnnAgreementSchema>;