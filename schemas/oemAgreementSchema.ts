// schema/oemAgreementSchema.ts
/*
import { z } from "zod";

export const oemAgreementSchema = z.object({
  // Supplier Information
  supplierName: z.string().min(1, "Supplier name is required"),
  supplierAddress: z.string().min(1, "Supplier address is required"),
  supplierContact: z.string().min(1, "Supplier contact information is required"),
  
  // Buyer Information
  buyerName: z.string().min(1, "Buyer name is required"),
  buyerAddress: z.string().min(1, "Buyer address is required"),
  buyerContact: z.string().min(1, "Buyer contact information is required"),
  
  // Product Details
  productName: z.string().min(1, "Product name is required"),
  productSpecifications: z.string().min(10, "Product specifications should be at least 10 characters"),
  initialOrderQuantity: z.number().min(1, "Initial order quantity must be at least 1"),
  
  // Contract Terms
  contractDuration: z.number().min(1, "Contract duration must be at least 1 month"),
  durationType: z.enum(["months", "years"]),
  exclusivity: z.enum(["exclusive", "non-exclusive"]),
  territory: z.string().min(1, "Territory information is required"),
  
  // Financial Terms
  pricingModel: z.enum(["fixed", "volume-based", "tiered"]),
  paymentTerms: z.enum(["net30", "net60", "net90", "advance"]),
  currency: z.enum(["USD", "EUR", "GBP", "CNY", "JPY"]),
  
  // Legal Terms
  governingLaw: z.string().min(1, "Governing law is required"),
  disputeResolution: z.enum(["arbitration", "litigation", "mediation"]),
});

export type OEMAgreementFormData = z.infer<typeof oemAgreementSchema>;
*/

// components/OEMAgreementForm.tsx
/*
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { oemAgreementSchema, OEMAgreementFormData } from "@/schema/oemAgreementSchema";

interface OEMAgreementFormProps {
  product: any;
  schema: any;
  onChange: (data: Partial<OEMAgreementFormData>) => void;
  onSubmit: (data: OEMAgreementFormData) => void;
}

const OEMAgreementForm = ({ product, schema, onChange, onSubmit }: OEMAgreementFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Including confirmation page
  
  const methods = useForm<OEMAgreementFormData>({
    resolver: zodResolver(oemAgreementSchema),
    mode: "onChange",
    defaultValues: {
      // Default values here
      pricingModel: "fixed",
      paymentTerms: "net30",
      currency: "USD",
      durationType: "months",
      exclusivity: "non-exclusive",
      disputeResolution: "arbitration",
    },
  });
  
  const { handleSubmit, watch } = methods;
  const formValues = watch();
  
  useEffect(() => {
    onChange(formValues);
  }, [formValues, onChange]);
  
  // Pagination and validation logic would go here
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        {/* OEM Agreement form pages would go here *//*}
      </form>
    </FormProvider>
  );
};

export default OEMAgreementForm;
*/

// components/OEMAgreementPreview.tsx
/*
import { useState } from "react";
import { OEMAgreementFormData } from "@/schema/oemAgreementSchema";

interface OEMAgreementPreviewProps {
  product: any;
  formData: any;
  isGenerating?: boolean;
}

const OEMAgreementPreview = ({ product, formData, isGenerating = false }: OEMAgreementPreviewProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Safe casting of form data to our expected type
  const data = formData as Partial<OEMAgreementFormData>;
  
  // Preview implementation would go here
  
  return (
    // OEM Agreement preview implementation
    <div>OEM Agreement Preview</div>
  );
};

export default OEMAgreementPreview;
*/