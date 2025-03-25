// components/product-forms/registry.tsx
import { z } from 'zod';
import { nnnAgreementSchema } from "@/schemas/nnnAgreementSchema";
import { companyCheckupSchema } from "@/schemas/companyCheckupSchema";
import NNNAgreementForm from "@/components/product-forms/NnnAgreementForm";
import CompanyCheckupForm from "@/components/product-forms/CompanyCheckupForm";
import DefaultForm from "@/components/product-forms/DefaultForm";

// Define the registry type
type FormRegistry = {
  [key: string]: {
    Component: React.ComponentType<any>;
    schema: z.ZodType<any>;
  };
};

// Add form components to this registry
const formRegistry: FormRegistry = {
  'nnn-agreement-cn': {
    Component: NNNAgreementForm,
    schema: nnnAgreementSchema,
  },
  'company-checkup': {
    Component: CompanyCheckupForm,
    schema: companyCheckupSchema,
  },
  // Add future form components here
};

// Function to get the form component by slug
export function getFormComponent(slug: string) {
  if (!slug || !formRegistry[slug]) {
    console.warn(`Form component not found for slug: ${slug}`);
    return {
      Component: DefaultForm,
      schema: z.object({}),
    };
  }

  return formRegistry[slug];
}