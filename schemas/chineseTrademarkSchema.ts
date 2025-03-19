// schemas/chineseTrademarkSchema.ts
import { z } from "zod";

// Define trademark types
const trademarkTypes = [
  "Word Mark", 
  "Logo/Design Mark", 
  "Combined Word and Design Mark",
  "Sound Mark",
  "3D Mark"
] as const;

// Define classification of goods/services (Nice Classification)
const trademarkClasses = [
  "Class 1: Chemicals",
  "Class 2: Paints",
  "Class 3: Cosmetics and cleaning preparations",
  "Class 4: Lubricants and fuels",
  "Class 5: Pharmaceuticals",
  "Class 6: Metal goods",
  "Class 7: Machinery",
  "Class 8: Hand tools",
  "Class 9: Electrical and scientific apparatus",
  "Class 10: Medical apparatus",
  "Class 11: Environmental control apparatus",
  "Class 12: Vehicles",
  "Class 13: Firearms",
  "Class 14: Jewelry",
  "Class 15: Musical instruments",
  "Class 16: Paper goods and printed matter",
  "Class 17: Rubber goods",
  "Class 18: Leather goods",
  "Class 19: Non-metallic building materials",
  "Class 20: Furniture and articles not otherwise classified",
  "Class 21: Housewares and glass",
  "Class 22: Cordage and fibers",
  "Class 23: Yarns and threads",
  "Class 24: Fabrics",
  "Class 25: Clothing",
  "Class 26: Fancy goods",
  "Class 27: Floor coverings",
  "Class 28: Toys and sporting goods",
  "Class 29: Meats and processed foods",
  "Class 30: Staple foods",
  "Class 31: Natural agricultural products",
  "Class 32: Light beverages",
  "Class 33: Wines and spirits",
  "Class 34: Smokers' articles",
  "Class 35: Advertising and business services",
  "Class 36: Insurance and financial services",
  "Class 37: Building construction and repair",
  "Class 38: Telecommunications",
  "Class 39: Transportation and storage",
  "Class 40: Treatment of materials",
  "Class 41: Education and entertainment",
  "Class 42: Scientific & technological services",
  "Class 43: Food services",
  "Class 44: Medical, beauty & agricultural services",
  "Class 45: Personal and legal services",
] as const;

// Define file validation helper function
const validateFileSize = (file: File | undefined): boolean => {
  if (!file) return false;
  return file.size <= 5 * 1024 * 1024; // 5MB max
};

export const chineseTrademarkSchema = z.object({
  // Applicant Information
  applicantType: z.enum(["Individual", "Corporation", "Partnership", "LLC"]),
  applicantName: z.string().min(1, "Applicant name is required"),
  applicantNameChinese: z.string().optional(),
  applicantAddress: z.string().min(1, "Applicant address is required"),
  applicantCountry: z.string().min(1, "Country is required"),
  applicantEmail: z.string().email("Valid email is required"),
  applicantPhone: z.string().min(1, "Phone number is required"),
  
  // Trademark Information
  trademarkName: z.string().min(1, "Trademark name is required"),
  trademarkNameChinese: z.string().optional(),
  trademarkType: z.enum(trademarkTypes),
  trademarkDescription: z.string().min(10, "Please provide a description of your trademark"),
  
  // Logo Upload (for design marks)
  // This will be handled separately - we can't directly validate File objects with Zod in the schema
  // Instead, we'll use a custom validation function in the form component
  
  // Classification
  trademarkClasses: z.array(z.enum(trademarkClasses))
    .min(1, "Select at least one classification"),
  
  // Additional Services
  priorityClaim: z.boolean().default(false),
  priorityCountry: z.string().optional(),
  priorityDate: z.string().optional(),
  priorityNumber: z.string().optional(),
  
  expressExamination: z.boolean().default(false),
  
  // ID Document Upload
  // This will be handled separately similar to logo upload
  
  // Additional Information
  additionalInfo: z.string().optional(),
});

// Type definition
export type ChineseTrademarkFormData = z.infer<typeof chineseTrademarkSchema>;