import React from 'react';
import { FileText, Loader2 } from 'lucide-react';

interface DefaultPreviewProps {
  product?: unknown;
  formData?: Record<string, any>;
  isGenerating?: boolean;
}

export const DefaultPreview: React.FC<DefaultPreviewProps> = ({
  product = {},
  formData = {},
  isGenerating = false,
}) => {
  // Extract data from form
  const {
    disclosingPartyName,
    disclosingPartyAddress,
    receivingPartyName, 
    receivingPartyChineseName,
    receivingPartyUSCC,
    receivingPartyAddress,
    productName,
    productDescription,
    protectionLevel,
    jurisdiction,
    includeCompete,
    includeCircumvention
  } = formData;

  // Check if we have enough data to show a meaningful preview
  const hasPartyInfo = disclosingPartyName && receivingPartyName;
  const hasProductInfo = productName && productDescription;
  
  return (
    <div className="h-full min-h-[600px] flex flex-col">
      {/* Preview header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium text-gray-700">NNN Agreement Preview</span>
          </div>
          <div className="text-xs text-gray-500">Live Preview</div>
        </div>
      </div>
      
      {/* Document preview area */}
      <div className="flex-1 bg-white border-l border-r border-gray-200 p-8 overflow-y-auto">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Generating your document...</p>
          </div>
        ) : !hasPartyInfo ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">Enter party information to see preview</h3>
            <p className="text-sm text-gray-400">
              Fill in the Disclosing Party and Receiving Party fields to generate a preview
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Document header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                NON-DISCLOSURE, NON-USE & NON-CIRCUMVENTION AGREEMENT
              </h2>
              <p className="text-gray-600 mb-4">
                {jurisdiction ? `Governed by the laws of ${jurisdiction}` : 'Governed by the laws of Hong Kong'}
              </p>
              
              <p className="text-gray-600">
                This agreement is made by and between:
              </p>
            </div>
            
            {/* Party information */}
            <div className="mb-8">
              <p className="font-medium text-gray-800 mb-1">
                {disclosingPartyName || "Disclosing Party"}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {disclosingPartyAddress || "Address will appear here"}
              </p>
              
              <div className="my-4 text-center">- and -</div>
              
              <p className="font-medium text-gray-800 mb-1">
                {receivingPartyName || "Receiving Party"}
                {receivingPartyChineseName && ` (${receivingPartyChineseName})`}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                {receivingPartyAddress || "Address will appear here"}
              </p>
              {receivingPartyUSCC && (
                <p className="text-gray-600 text-sm mb-4">
                  USCC Number: {receivingPartyUSCC}
                </p>
              )}
            </div>
            
            {/* Product Information */}
            {hasProductInfo && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-2">SUBJECT MATTER</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Product:</span> {productName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Description:</span> {productDescription}
                </p>
              </div>
            )}
            
            {/* Document body - preview content */}
            <div className="space-y-4">
              {/* Introduction */}
              <p className="text-gray-700">
                <span className="font-medium">WHEREAS</span>, the Disclosing Party wishes to disclose certain confidential and proprietary information to the Receiving Party for the purpose of manufacturing the {productName || "product"};
              </p>
              
              <p className="text-gray-700">
                <span className="font-medium">AND WHEREAS</span>, the Receiving Party is willing to receive such information on the terms and conditions set forth herein;
              </p>
              
              <p className="text-gray-700">
                <span className="font-medium">NOW THEREFORE</span>, in consideration of the mutual covenants contained herein, the parties agree as follows:
              </p>
              
              {/* Sections - showing conditionally based on form data */}
              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="font-bold text-gray-800 mb-2">1. CONFIDENTIALITY</h3>
                  <div className="pl-4">
                    <p className="text-gray-700">
                      The Receiving Party will maintain in confidence all Confidential Information disclosed by the Disclosing Party.
                    </p>
                  </div>
                </section>
                
                {includeCompete && (
                  <section>
                    <h3 className="font-bold text-gray-800 mb-2">2. NON-COMPETITION</h3>
                    <div className="pl-4">
                      <p className="text-gray-700">
                        The Receiving Party agrees not to compete directly with the Disclosing Party's products based on the Confidential Information.
                      </p>
                    </div>
                  </section>
                )}
                
                {includeCircumvention && (
                  <section>
                    <h3 className="font-bold text-gray-800 mb-2">3. NON-CIRCUMVENTION</h3>
                    <div className="pl-4">
                      <p className="text-gray-700">
                        The Receiving Party shall not attempt to circumvent the Disclosing Party in business relationships established through the introduction of Confidential Information.
                      </p>
                    </div>
                  </section>
                )}
                
                <section>
                  <h3 className="font-bold text-gray-800 mb-2">{includeCompete && includeCircumvention ? "4" : includeCompete || includeCircumvention ? "3" : "2"}. GOVERNING LAW</h3>
                  <div className="pl-4">
                    <p className="text-gray-700">
                      This Agreement shall be governed by the laws of {jurisdiction || "Hong Kong"}.
                    </p>
                  </div>
                </section>
              </div>
              
              {/* Protection Level Message */}
              <div className="mt-8 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  {protectionLevel === 'standard' && 'Standard protection level: Basic NDA and non-compete provisions.'}
                  {protectionLevel === 'enhanced' && 'Enhanced protection level: Additional penalties for breach and stricter confidentiality requirements.'}
                  {protectionLevel === 'comprehensive' && 'Comprehensive protection level: Maximum legal protections including injunctive relief and significant penalty clauses.'}
                </p>
              </div>
              
              {/* Watermark text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <div className="transform rotate-45 text-6xl font-bold text-gray-400">
                  PREVIEW
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Preview footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 rounded-b-lg">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Document ID: PREVIEW-{Math.random().toString(36).substring(2, 9)}</span>
          <span>This is a preview only</span>
        </div>
      </div>
    </div>
  );
};

export default DefaultPreview;