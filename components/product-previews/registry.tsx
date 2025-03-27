// components/product-previews/registry.tsx
import NNNAgreementPreview from "@/components/product-previews/NnnAgreementPreview";
import CompanyCheckupPreview from "@/components/product-previews/CompanyCheckupPreview";
import TrademarkChinaPreview from "@/components/product-previews/TrademarkChinaPreview";
import DefaultPreview from "@/components/product-previews/DefaultPreview";

// Define the registry type
type PreviewRegistry = {
  [key: string]: React.ComponentType<any>;
};

// Add preview components to this registry
const previewRegistry: PreviewRegistry = {
  'nnn-agreement-cn': NNNAgreementPreview,
  'company-checkup': CompanyCheckupPreview,
  'trademark-china': TrademarkChinaPreview,
  // Add future preview components here
};

// Function to get the preview component by slug
export function getPreviewComponent(slug: string) {
  if (!slug || !previewRegistry[slug]) {
    console.warn(`Preview component not found for slug: ${slug}`);
    return DefaultPreview;
  }

  return previewRegistry[slug];
}