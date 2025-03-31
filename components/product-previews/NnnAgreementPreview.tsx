// components/product-previews/NnnAgreementPreview.tsx
import { useState } from "react";
import { NNNAgreementFormData } from "@/schemas/nnnAgreementSchema";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NNNAgreementPreviewProps {
  formData: Partial<NNNAgreementFormData>; // Use Partial to allow incomplete form data during editing
  isGenerating?: boolean;
}

const NNNAgreementPreview = ({ formData, isGenerating = false }: NNNAgreementPreviewProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);
  
  // Safe casting of form data to our expected type
  const data = formData as Partial<NNNAgreementFormData>;
  
 
  
  // Helper function to format the current date in a readable format
  const formatDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    return `${day} ${month}, ${year}`;
  };
  
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
  
  // Empty state when not enough data
  
  
  // Format the agreement preview based on form data
  const agreementPreview = (
    <div className="relative">
      {/* Document Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-4">NON-DISCLOSURE, NON-USE, AND NON-CIRCUMVENTION AGREEMENT</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-6">保密、不使用和不规避协议</h2>
        
        <p className="text-gray-700">
          THIS AGREEMENT is made on this {formatDate()} (&apos;Effective Date&apos;)
        </p>
        <p className="text-gray-500 text-sm">
          本协议于{formatDate()}（&apos;生效日期&apos;）订立
        </p>
      </div>
      
      {/* Parties Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">BETWEEN:</h2>
        <p className="text-gray-700 mb-2">
          <strong>{data.disclosingPartyName || "[DISCLOSING PARTY NAME]"}</strong>, 
          a {data.disclosingPartyType || "company"} incorporated under the laws of {data.disclosingPartyJurisdiction || "[Jurisdiction]"}, 
          with its registered office at {data.disclosingPartyAddress || "[Address]"} 
          (hereinafter referred to as the &apos;Disclosing Party&apos;)
        </p>
        
        <h2 className="text-lg font-bold my-4">AND:</h2>
        <p className="text-gray-700 mb-2">
          <strong>{data.receivingPartyName || "[MANUFACTURER NAME IN ENGLISH]"}</strong> / 
          <strong>{data.receivingPartyNameChinese || "[MANUFACTURER CHINESE NAME]"}</strong>, 
          a company incorporated under the laws of the People&apos;s Republic of China, 
          with its registered office at {data.receivingPartyAddress || "[Manufacturer Address]"}, 
          with Unified Social Credit Code (USCC) {data.receivingPartyUSCC || "[USCC Number]"} 
          (hereinafter referred to as the &apos;Manufacturer&apos;)
        </p>
        
        <p className="text-gray-700 mt-4">
          (each a &apos;Party&apos; and collectively the &apos;Parties&apos;)
        </p>
      </div>
      
      {/* Recitals Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">RECITALS:</h2>
        
        <p className="text-gray-700 mb-3">
          <strong>A.</strong> The Disclosing Party is engaged in the business of manufacturing, marketing and selling {data.productName || "[Product Name]"} (the &apos;Product&apos;). 
          The Product is described as follows: {data.productDescription || "[Product Description]"}.
        </p>
        
        <p className="text-gray-700 mb-3">
          <strong>B.</strong> The Manufacturer has expertise in manufacturing similar products and the Parties are exploring a potential business relationship whereby the Manufacturer would manufacture the Product for the Disclosing Party.
        </p>
        
        <p className="text-gray-700 mb-3">
          <strong>C.</strong> In the course of their discussions and potential business relationship, the Disclosing Party may provide the Manufacturer with certain confidential and proprietary information relating to the Product, its design, specifications, manufacturing processes, marketing strategies, and other business information.
        </p>
        
        <p className="text-gray-700 mb-5">
          <strong>D.</strong> The Parties wish to ensure that such information remains confidential and is not used by the Manufacturer except as expressly permitted by this Agreement.
        </p>
        
        <p className="text-gray-700 font-semibold">
          NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:
        </p>
      </div>
      
      {/* Definitions Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">1. DEFINITIONS</h2>
        
        <p className="text-gray-700 mb-3">
          <strong>1.1</strong> &apos;Confidential Information&apos; means any and all information disclosed by the Disclosing Party to the Manufacturer, whether oral, written, electronic or in any other form, that:
        </p>
        
        <div className="ml-6 mb-4">
          <p className="text-gray-700 mb-2">
            (a) is designated as confidential at the time of disclosure or within 14 days thereafter; or
          </p>
          
          <p className="text-gray-700 mb-2">
            (b) a reasonable person would understand to be confidential or proprietary in nature, including but not limited to information relating to the Product, its design, specifications, components, manufacturing processes, prototypes, samples, costs, pricing, marketing strategies, business plans, customer lists, supplier details, and other business information; or
          </p>
          
          <p className="text-gray-700">
            (c) constitutes trade secrets under applicable law.
          </p>
        </div>
      </div>
      
      {/* Non-Disclosure Obligations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">2. NON-DISCLOSURE OBLIGATIONS</h2>
        
        <p className="text-gray-700 mb-3">
          <strong>2.1</strong> The Manufacturer agrees to maintain in strict confidence all Confidential Information and shall not disclose any Confidential Information to any third party without the prior written consent of the Disclosing Party.
        </p>
        
        <p className="text-gray-700 mb-3">
          <strong>2.2</strong> The Manufacturer shall limit access to the Confidential Information to only those of its officers, directors, employees, consultants, and advisors who:
        </p>
        
        <div className="ml-6 mb-4">
          <p className="text-gray-700 mb-2">
            (a) have a need to know such information for the purpose of evaluating or performing the potential business relationship;
          </p>
          
          <p className="text-gray-700 mb-2">
            (b) have been informed of the confidential nature of the information; and
          </p>
          
          <p className="text-gray-700">
            (c) are bound by confidentiality obligations no less restrictive than those contained in this Agreement.
          </p>
        </div>
      </div>
      
      {/* Non-Use Obligations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">3. NON-USE OBLIGATIONS</h2>
        
        <p className="text-gray-700 mb-3">
          <strong>3.1</strong> The Manufacturer shall not use any Confidential Information for any purpose other than to evaluate and perform the potential business relationship with the Disclosing Party.
        </p>
        
        <p className="text-gray-700 mb-3">
          <strong>3.2</strong> Without limiting the generality of Section 3.1, the Manufacturer shall not:
        </p>
        
        <div className="ml-6 mb-4">
          <p className="text-gray-700 mb-2">
            (a) use the Confidential Information to design, develop, manufacture, market, or sell any product that is the same as or similar to the Product;
          </p>
          
          <p className="text-gray-700 mb-2">
            (b) reverse engineer, disassemble, or decompile any prototypes, software, or other tangible objects that embody the Confidential Information;
          </p>
          
          <p className="text-gray-700 mb-2">
            (c) analyze the composition or structure of any samples or materials provided by the Disclosing Party, except as expressly authorized in writing; or
          </p>
          
          <p className="text-gray-700">
            (d) file any patent, trademark, copyright, or other intellectual property application based upon or derived from the Confidential Information.
          </p>
        </div>
      </div>
      
      {/* Non-Circumvention Obligations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">4. NON-CIRCUMVENTION OBLIGATIONS</h2>
        
        <p className="text-gray-700 mb-3">
          <strong>4.1</strong> The Manufacturer shall not, directly or indirectly:
        </p>
        
        <div className="ml-6 mb-4">
          <p className="text-gray-700 mb-2">
            (a) contact, solicit, or enter into any agreement with any customer, supplier, distributor, or business partner of the Disclosing Party that has been identified in or introduced through the Confidential Information, without the prior written consent of the Disclosing Party;
          </p>
          
          <p className="text-gray-700 mb-2">
            (b) interfere with or disrupt the Disclosing Party&apos;s relationships with its customers, suppliers, distributors, or business partners;
          </p>
          
          <p className="text-gray-700 mb-2">
            (c) circumvent the Disclosing Party in any transaction with any customer, supplier, distributor, or business partner of the Disclosing Party; or
          </p>
          
          <p className="text-gray-700">
            (d) compete with the Disclosing Party in any business opportunity related to the Product or arising from the Confidential Information.
          </p>
        </div>
      </div>
      
      {/* Liquidated Damages Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">10. LIQUIDATED DAMAGES</h2>
        
        {data.penaltyDamages === "fixedAmount" ? (
          <>
            <p className="text-gray-700 mb-3">
              <strong>10.1</strong> The Parties acknowledge that a breach of this Agreement may result in irreparable harm to the Disclosing Party for which monetary damages would be inadequate. In the event of a breach or threatened breach of this Agreement by the Manufacturer, the Manufacturer shall pay to the Disclosing Party, as liquidated damages and not as a penalty, the sum of ${data.penaltyAmount || "[AMOUNT]"} (USD), which the Parties agree is a reasonable estimate of the damages that would be suffered by the Disclosing Party.
            </p>
          </>
        ) : data.penaltyDamages === "contractMultiple" ? (
          <>
            <p className="text-gray-700 mb-3">
              <strong>10.1</strong> The Parties acknowledge that a breach of this Agreement may result in irreparable harm to the Disclosing Party for which monetary damages would be inadequate. In the event of a breach or threatened breach of this Agreement by the Manufacturer, the Manufacturer shall pay to the Disclosing Party, as liquidated damages and not as a penalty, an amount equal to {data.penaltyMultiple || "[NUMBER]"} times the total value of all purchase orders or contracts between the Parties during the previous twelve (12) months (or the term of the relationship if shorter), which the Parties agree is a reasonable estimate of the damages that would be suffered by the Disclosing Party.
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-3">
              <strong>10.1</strong> The Parties acknowledge that a breach of this Agreement may result in irreparable harm to the Disclosing Party for which monetary damages would be inadequate. In the event of a breach or threatened breach of this Agreement by the Manufacturer, the Manufacturer shall pay to the Disclosing Party, as liquidated damages and not as a penalty:
            </p>
            
            <div className="ml-6 mb-4">
              <p className="text-gray-700 mb-2">
                (a) For a minor breach (such as limited accidental disclosure without commercial use): $50,000 (USD);
              </p>
              
              <p className="text-gray-700 mb-2">
                (b) For a significant breach (such as unauthorized use without widespread disclosure): $100,000 (USD); or
              </p>
              
              <p className="text-gray-700 mb-2">
                (c) For a severe breach (such as unauthorized manufacturing, widespread disclosure, or circumvention): $250,000 (USD).
              </p>
            </div>
            
            <p className="text-gray-700">
              The Parties agree that these amounts are reasonable estimates of the damages that would be suffered by the Disclosing Party based on the severity of the breach.
            </p>
          </>
        )}
        
        <p className="text-gray-700 mt-3">
          <strong>10.2</strong> The payment of liquidated damages shall not be the exclusive remedy for a breach of this Agreement, and the Disclosing Party shall be entitled to seek other remedies available at law or in equity, including but not limited to injunctive relief, specific performance, and actual damages to the extent they exceed the liquidated damages amount.
        </p>
      </div>
      
      {/* Governing Law and Dispute Resolution Sections */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">11. GOVERNING LAW AND LANGUAGE</h2>
        
        <p className="text-gray-700 mb-3">
          <strong>11.1</strong> This Agreement shall be governed by and construed in accordance with the laws of the People&apos;s Republic of China.
        </p>
        
        <p className="text-gray-700">
          <strong>11.2</strong> This Agreement is executed in both Chinese and English languages. In case of any inconsistency between the two language versions, the Chinese version shall prevail.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">12. DISPUTE RESOLUTION</h2>
        
        <p className="text-gray-700 mb-3">
          <strong>12.1</strong> Any dispute, controversy or claim arising out of or relating to this Agreement, or the breach, termination or invalidity thereof, shall be settled by arbitration.
        </p>
        
        <p className="text-gray-700 mb-3">
          <strong>12.2</strong> The arbitration shall be administered by:
        </p>
        
        <p className="text-gray-700 font-medium ml-6 mb-3">
          {data.arbitration === "CIETAC Beijing" ? (
            "The China International Economic and Trade Arbitration Commission (CIETAC) in accordance with its arbitration rules in effect at the time of the application for arbitration. The seat of arbitration shall be Beijing, China."
          ) : data.arbitration === "CIETAC Shanghai" ? (
            "The China International Economic and Trade Arbitration Commission (CIETAC) Shanghai Sub-Commission in accordance with its arbitration rules in effect at the time of the application for arbitration. The seat of arbitration shall be Shanghai, China."
          ) : data.arbitration === "HKIAC" ? (
            "The Hong Kong International Arbitration Centre (HKIAC) in accordance with its administered arbitration rules in effect at the time of the application for arbitration. The seat of arbitration shall be Hong Kong SAR, China."
          ) : (
            "The Shenzhen Court of International Arbitration (SCIA) in accordance with its arbitration rules in effect at the time of the application for arbitration. The seat of arbitration shall be Shenzhen, China."
          )}
        </p>
      </div>
      
      {/* Duration Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">9. TERM AND TERMINATION</h2>
        
        <p className="text-gray-700 mb-3">
          <strong>9.2</strong> Notwithstanding termination of this Agreement, the Manufacturer&apos;s obligations regarding non-disclosure, non-use, and non-circumvention shall continue for a period of {data.agreementDuration || "five (5)"} {data.durationType === "years" ? "years" : "months"} following the later of:
        </p>
        
        <div className="ml-6 mb-4">
          <p className="text-gray-700 mb-2">
            (a) the termination of this Agreement; or
          </p>
          
          <p className="text-gray-700">
            (b) the completion or termination of the manufacturing relationship between the Parties.
          </p>
        </div>
      </div>
      
      {/* Signatory Section */}
      <div className="mt-12">
        <p className="text-gray-700 mb-8">
          IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
        </p>
        
        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="font-bold mb-4">DISCLOSING PARTY:</p>
            <div className="mt-10 border-t border-gray-400 pt-2">
              <p>[Authorized Signatory Name]</p>
              <p>[Title]</p>
              <p>[Date]</p>
            </div>
          </div>
          
          <div>
            <p className="font-bold mb-4">MANUFACTURER:</p>
            <div className="mt-10 border-t border-gray-400 pt-2">
              <p>[Authorized Signatory Name]</p>
              <p>[Title]</p>
              <p>[Date]</p>
            </div>
            <div className="mt-5 border border-dashed border-gray-400 h-20 flex items-center justify-center">
              <p className="text-gray-500">[COMPANY CHOP/STAMP]</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="transform rotate-45 text-6xl font-bold text-gray-400">
          PREVIEW
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      <div 
        onClick={openLightbox}
        className="h-full border border-gray-300 rounded shadow-sm p-6 overflow-y-auto cursor-pointer hover:border-blue-500 transition-colors relative max-h-[70vh]"
      >
        {agreementPreview}
      </div>
      
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto p-6 relative">
            <Button
              onClick={closeLightbox}
              className="absolute top-4 right-4"
              variant="outline"
            >
              Close
            </Button>
            
            <div className="prose max-w-none">
              {agreementPreview}
            </div>
            
            <div className="mt-6 text-center">
              <Button className="inline-flex items-center">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NNNAgreementPreview;