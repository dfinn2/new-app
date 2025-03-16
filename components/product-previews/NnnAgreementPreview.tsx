// components/NNNAgreementPreview.tsx
import { useState } from "react";
import { NNNAgreementFormData } from "@/schemas/nnnAgreementSchema";

interface Product {
    name: string;
    category?: string;
    description?: string;
    basePrice?: number;
    _id?: string;
    productId?: string;
    stripePriceId?: string;
    stripeProductId?: string;
    title?: string;
    content?: string;
  }

interface NNNAgreementPreviewProps {
    product: Product;
    formData: Partial<NNNAgreementFormData>; // Use Partial to allow incomplete form data during editing
    isGenerating?: boolean;
}

const NNNAgreementPreview = ({ product, formData, isGenerating = false }: NNNAgreementPreviewProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);
  
  // Safe casting of form data to our expected type
  const data = formData as Partial<NNNAgreementFormData>;
  
  // Format the agreement text based on form data
  const agreementText = (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-center mb-6">{product.name}</h1>
      
      <p>
        This Non-Disclosure, Non-Use and Non-Circumvention Agreement (the &quot;Agreement&quot;) is entered into as of the date of signature by and between:
      </p>
      
      <div className="space-y-2">
        <p><strong>DISCLOSING PARTY:</strong></p>
        <p>
          {data.disclosingPartyName || "[Disclosing Party Name]"}, 
          a {data.disclosingPartyType || "Individual"}
          {data.disclosingPartyBusinessNumber && data.disclosingPartyType === "Corporation" ? 
            ` with business number ${data.disclosingPartyBusinessNumber}` : 
            ""}
        </p>
      </div>
      
      <div className="space-y-2">
        <p><strong>RECEIVING PARTY:</strong></p>
        <p>
          {data.receivingPartyName || "[Receiving Party Name]"}
          {data.receivingPartyNameChinese ? ` (${data.receivingPartyNameChinese})` : ""}
        </p>
        <p>Address: {data.receivingPartyAddress || "[Address]"}</p>
        <p>USCC: {data.receivingPartyUSCC || "[USCC]"}</p>
      </div>
      
      <p><strong>WHEREAS:</strong></p>
      
      <p>
        Disclosing Party wishes to disclose to Receiving Party certain confidential information in 
        relation to {data.productName || "[Product Name]"} (the &quot;Product&quot;) for the purpose of 
        [purpose of disclosure], and Receiving Party wishes to receive such information subject to 
        the terms and conditions set forth in this Agreement.
      </p>
      
      <p><strong>NOW, THEREFORE, THE PARTIES AGREE AS FOLLOWS:</strong></p>
      
      <div className="space-y-2">
        <p><strong>1. Confidential Information</strong></p>
        <p>
        &quot;Confidential Information&quot; means any and all information disclosed by Disclosing Party 
          to Receiving Party, whether orally, in writing, or by any other means, relating to the 
          Product, including but not limited to technical data, trade secrets, know-how, research, 
          product plans, products, services, customers, markets, software, developments, inventions, 
          processes, formulas, technology, designs, drawings, engineering, hardware configuration 
          information, marketing, finances or other business information.
        </p>
      </div>
      
      <div className="space-y-2">
        <p><strong>2. Non-Disclosure and Non-Use</strong></p>
        <p>
          Receiving Party agrees not to disclose any Confidential Information to any third party 
          and not to use any Confidential Information for any purpose other than [purpose of disclosure]. 
          Receiving Party shall protect the Confidential Information with at least the same degree 
          of care it uses to protect its own confidential information, but in no case less than 
          reasonable care.
        </p>
      </div>
      
      <div className="space-y-2">
        <p><strong>3. Non-Circumvention</strong></p>
        <p>
          Receiving Party agrees not to circumvent Disclosing Party in any way with respect to the 
          Product or any business opportunity related to the Product, including but not limited to 
          contacting manufacturers, suppliers, distributors, customers or business partners of 
          Disclosing Party without the prior written consent of Disclosing Party.
        </p>
      </div>
      
      <div className="space-y-2">
        <p><strong>4. Product Description</strong></p>
        <p>{data.productDescription || "[Product Description]"}</p>
        {data.productTrademark === "have" && (
          <p>The Product is a registered trademark owned by Disclosing Party.</p>
        )}
        {data.productTrademark === "want" && (
          <p>Disclosing Party intends to register the Product as a trademark.</p>
        )}
      </div>
      
      <div className="space-y-2">
        <p><strong>5. Arbitration</strong></p>
        <p>
          Any dispute arising out of or in connection with this Agreement shall be referred to and 
          finally resolved by arbitration administered by the {data.arbitration || "ICC International Court of Arbitration"} 
          in accordance with its rules, which rules are deemed to be incorporated by reference in this clause.
        </p>
      </div>
      
      <div className="space-y-2">
        <p><strong>6. Penalty for Breach</strong></p>
        {data.penaltyDamages === "liquidatedDamages" ? (
          <p>
            In the event of a breach of this Agreement by Receiving Party, Receiving Party shall pay 
            to Disclosing Party, as liquidated damages and not as a penalty, the sum of USD 100,000. 
            The parties acknowledge that the harm caused by such breach would be impossible or very 
            difficult to accurately estimate at the time of breach, and that this liquidated damages 
            provision is a reasonable forecast of just compensation.
          </p>
        ) : (
          <p>
            In the event of a breach of this Agreement by Receiving Party, Receiving Party shall be 
            liable to Disclosing Party for all direct, indirect, consequential and special damages, 
            including but not limited to lost profits, suffered by Disclosing Party as a result of 
            such breach, and Disclosing Party shall be entitled to seek all available legal and 
            equitable remedies, including injunctive relief.
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <p><strong>7. Governing Law</strong></p>
        <p>
          This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction], 
          without giving effect to any choice of law or conflict of law provisions.
        </p>
      </div>
      
      <div className="space-y-2 mt-8">
        <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the date first above written.</p>
        
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <p><strong>DISCLOSING PARTY:</strong></p>
            <p className="mt-8">____________________________</p>
            <p>Name: {data.disclosingPartyName || "[Name]"}</p>
            <p>Title: </p>
            <p>Date: </p>
          </div>
          
          <div>
            <p><strong>RECEIVING PARTY:</strong></p>
            <p className="mt-8">____________________________</p>
            <p>Name: {data.receivingPartyName || "[Name]"}</p>
            <p>Title: </p>
            <p>Date: </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Handle loading/generating state
  if (isGenerating) {
    return (
      <div className="h-full border border-gray-300 rounded shadow-sm p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your document...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div 
        onClick={openLightbox}
        className="h-full border border-gray-300 rounded shadow-sm p-4 overflow-y-auto cursor-pointer hover:border-blue-500 transition-colors max-h-[70vh]"
      >
        <div className="text-sm">
          {agreementText}
        </div>
      </div>
      
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto p-6 relative">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>X
            </button>
            
            <div className="prose max-w-none">
              {agreementText}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NNNAgreementPreview;