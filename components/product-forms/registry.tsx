// components/product-forms/registry.tsx
import { z } from 'zod';
import { nnnAgreementSchema } from "@/schemas/nnnAgreementSchema";
import NNNAgreementForm from "@/components/product-forms/NnnAgreementForm";

// Import any future form components here
// import OEMAgreementForm from "@/components/OEMAgreementForm";

// Define the registry type
type FormRegistry = {
  [key: string]: {
    Component: React.ComponentType<any>;
    schema: z.ZodType<any>;
  };
};

// Add new form components to this registry
const formRegistry: FormRegistry = {
  'nnn-agreement-cn': {
    Component: NNNAgreementForm,
    schema: nnnAgreementSchema,
  },
  // Commented placeholder for future OEM Agreement
  /*
  'oem-agreement': {
    Component: OEMAgreementForm,
    schema: oemAgreementSchema,
  },
  */
};

// Fallback form component when nothing is found
const DefaultForm = () => (
  <div className="p-4 border border-red-300 bg-red-50 rounded">
    <p>No form component found for this product.</p>
  </div>
);

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