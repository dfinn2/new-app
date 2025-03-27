// schemas/trademarkChinaSchema.ts
import { z } from "zod";

// Define trademark types
const trademarkTypes = [
  "Word Mark", 
  "Logo/Design Mark", 
  "Combined Word and Design Mark",
  "Sound Mark",
  "3D Mark"
] as const;

// Define service tiers
const serviceTiers = ["Standard", "Premium", "Comprehensive"] as const;

// Define classification of goods/services (Nice Classification)
// These are the international trademark classes
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

// Define China's provinces and administrative regions
const chinaRegions = [
  "Beijing",
  "Shanghai",
  "Guangdong",
  "Jiangsu",
  "Zhejiang",
  "Shandong",
  "Fujian",
  "Sichuan",
  "Hubei",
  "Henan",
  "Liaoning",
  "Shaanxi",
  "Anhui",
  "Tianjin",
  "Chongqing",
  "Jilin",
  "Yunnan",
  "Hebei",
  "Hunan",
  "Guangxi",
  "Shanxi",
  "Guizhou",
  "Jiangxi",
  "Heilongjiang",
  "Hainan",
  "Gansu",
  "Inner Mongolia",
  "Xinjiang",
  "Tibet",
  "Ningxia",
  "Qinghai",
  "Hong Kong SAR",
  "Macau SAR",
  "Taiwan Region"
] as const;

// Define countries for priority claim
const priorityCountries = [
  "United States",
  "European Union",
  "United Kingdom",
  "Japan",
  "South Korea",
  "Australia",
  "Canada",
  "Singapore",
  "Switzerland",
  "New Zealand",
  "Other"
] as const;

// Define the main schema
export const trademarkChinaSchema = z.object({
  // Service Tier
  serviceTier: z.enum(serviceTiers),
  
  // Applicant Information
  applicantType: z.enum(["Individual", "Corporation", "Partnership", "LLC"]),
  applicantName: z.string().min(1, "Applicant name is required"),
  applicantNameChinese: z.string().optional(),
  applicantAddress: z.string().min(1, "Applicant address is required"),
  applicantCity: z.string().min(1, "City is required"),
  applicantCountry: z.string().min(1, "Country is required"),
  applicantEmail: z.string().email("Valid email is required"),
  applicantPhone: z.string().min(1, "Phone number is required"),
  
  // Chinese Agent Information (Optional)
  hasChineseAgent: z.boolean().default(false),
  agentName: z.string().optional(),
  agentAddress: z.string().optional(),
  agentCity: z.string().optional(),
  agentProvince: z.enum(chinaRegions).optional(),
  
  // Trademark Information
  trademarkName: z.string().min(1, "Trademark name is required"),
  trademarkNameChinese: z.string().optional(),
  trademarkType: z.enum(trademarkTypes),
  trademarkDescription: z.string().min(10, "Please provide a detailed description of at least 10 characters"),
  
  // Classification
  trademarkClasses: z.array(z.enum(trademarkClasses))
    .min(1, "Select at least one classification"),
  
  // Priority Claim (if applicable)
  priorityClaim: z.boolean().default(false),
  priorityCountry: z.enum(priorityCountries).optional(),
  priorityApplicationNumber: z.string().optional(),
  priorityFilingDate: z.string().optional(),
  
  // Additional Services
  expeditedExamination: z.boolean().default(false),
  preliminaryClearanceSearch: z.boolean().default(false),
  chineseNameCreation: z.boolean().default(false),
  oppositionMonitoring: z.boolean().default(false),
  
  // Document Upload
  // Handled separately as file uploads
  
  // Additional Information or Special Instructions
  additionalInstructions: z.string().optional(),
  
  // Contact preference
  contactPreference: z.enum(["Email", "Phone", "Both"]).default("Email"),
  
  // Agreement to Terms and Conditions
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

// Type definition for form data
export type TrademarkChinaFormData = z.infer<typeof trademarkChinaSchema>;