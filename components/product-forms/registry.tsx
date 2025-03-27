// components/product-forms/registry.tsx
import { z } from 'zod';
import { nnnAgreementSchema } from "@/schemas/nnnAgreementSchema";
import { companyCheckupSchema } from "@/schemas/companyCheckupSchema";
import { trademarkChinaSchema } from "@/schemas/trademarkChinaSchema";
import NNNAgreementForm from "@/components/product-forms/NnnAgreementForm";
import CompanyCheckupForm from "@/components/product-forms/CompanyCheckupForm";
import TrademarkChinaForm from "@/components/product-forms/TrademarkChinaForm";
import DefaultForm from "@/components/product-forms/DefaultForm";

// Define a common interface for all form components
interface FormComponentProps<T> {
  product: {
    id: string;
    name: string;
    description?: string;
    basePrice: number;
    stripePriceId?: string;
    stripeProductId?: string;
    slug: string;
  };
  schema: z.ZodType<T>;
  onChange: (data: Partial<T>) => void;
  onSubmit: (data: T) => void;
}

// Use generics in the registry type
type FormRegistry = {
  [key: string]: {
    Component: React.ComponentType<FormComponentProps<any>>;
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
  'trademark-china': {
    Component: TrademarkChinaForm,
    schema: trademarkChinaSchema,
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