// components/product-previews/registry.tsx
import NNNAgreementPreview from "@/components/product-previews/NnnAgreementPreview";

// Import any future preview components here
// import OEMAgreementPreview from "@/components/OEMAgreementPreview";

// Define the registry type
type PreviewRegistry = {
  [key: string]: React.ComponentType<any>;
};

// Add new preview components to this registry
const previewRegistry: PreviewRegistry = {
  'nnn-agreement-cn': NNNAgreementPreview,
  // Commented placeholder for future OEM Agreement
  /*
  'oem-agreement': OEMAgreementPreview,
  */
};

// Fallback preview component when nothing is found
const DefaultPreview = () => (
  <div className="p-4 border border-gray-300 bg-gray-50 rounded">
    <p>No preview component found for this product.</p>
  </div>
);

// Function to get the preview component by slug
export function getPreviewComponent(slug: string) {
  if (!slug || !previewRegistry[slug]) {
    console.warn(`Preview component not found for slug: ${slug}`);
    return DefaultPreview;
  }

  return previewRegistry[slug];
}