// components/product-previews/ChineseTrademarkPreview.tsx
import { useState } from "react";
import { ChineseTrademarkFormData } from "@/schemas/trademarkChinaSchema";
import { FileText, AlertCircle, CheckCircle, Users, Globe, Clock } from "lucide-react";
import { Product } from "@/lib/db/types";


interface ChineseTrademarkPreviewProps {
  product: Product;
  formData: Partial<ChineseTrademarkFormData>; // Use Partial to allow incomplete form data during editing
  isGenerating?: boolean;
}

const ChineseTrademarkPreview = ({ product, formData, isGenerating = false }: ChineseTrademarkPreviewProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);
  
  // Safe casting of form data to our expected type
  const data = formData as Partial<ChineseTrademarkFormData>;
  
  // Check if we have sufficient data to show a meaningful preview
  const hasApplicantInfo = data.applicantName && data.applicantAddress;
  const hasTrademarkInfo = data.trademarkName && data.trademarkType;
  
  // Calculate price based on selections
  const calculatePrice = () => {
    const basePrice = product.basePrice || 250; // Default base price if not provided
    
    // Add price for each trademark class (example: $100 per class)
    const classPrice = 100;
    const classesCount = data.trademarkClasses?.length || 0;
    const classesTotal = classPrice * classesCount;
    
    // Add price for express examination if selected (example: $200)
    const expressPrice = data.expressExamination ? 200 : 0;
    
    // Final price
    return basePrice + classesTotal + expressPrice;
  };
  
  // Handle loading/generating state
  if (isGenerating) {
    return (
      <div className="h-full border border-gray-300 rounded shadow-sm p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your application...</p>
        </div>
      </div>
    );
  }
  
  // Empty state when not enough data
  if (!hasApplicantInfo && !hasTrademarkInfo) {
    return (
      <div className="h-full border border-gray-300 rounded shadow-sm p-8 flex flex-col items-center justify-center text-center">
        
        <h3 className="text-lg font-medium text-gray-500">Chinese Trademark Application Preview</h3>
        <p className="text-sm text-gray-400 mt-2 max-w-md">
          Fill out the form to see a preview of your trademark application. We will guide you through the entire process.
        </p>
      </div>
    );
  }
  
  // Format the application preview
  const applicationPreview = (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Chinese Trademark Application</h1>
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            PREVIEW
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Application for trademark registration with the China National Intellectual Property Administration (CNIPA)
        </p>
      </div>
      
      {hasApplicantInfo && (
        <div className="space-y-1">
          <h2 className="text-base font-semibold flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            Applicant Information
          </h2>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-gray-500 w-1/3">Applicant Type:</td>
                <td>{data.applicantType || "Not specified"}</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-500">Name (English):</td>
                <td className="font-medium">{data.applicantName}</td>
              </tr>
              {data.applicantNameChinese && (
                <tr>
                  <td className="py-1 text-gray-500">Name (Chinese):</td>
                  <td>{data.applicantNameChinese}</td>
                </tr>
              )}
              <tr>
                <td className="py-1 text-gray-500">Address:</td>
                <td>{data.applicantAddress}</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-500">Country:</td>
                <td>{data.applicantCountry}</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-500">Contact:</td>
                <td>{data.applicantEmail} | {data.applicantPhone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {hasTrademarkInfo && (
        <div className="space-y-1">
          <h2 className="text-base font-semibold flex items-center">
            
            Trademark Details
          </h2>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-gray-500 w-1/3">Trademark Name:</td>
                <td className="font-medium">{data.trademarkName}</td>
              </tr>
              {data.trademarkNameChinese && (
                <tr>
                  <td className="py-1 text-gray-500">Chinese Name:</td>
                  <td>{data.trademarkNameChinese}</td>
                </tr>
              )}
              <tr>
                <td className="py-1 text-gray-500">Type:</td>
                <td>{data.trademarkType}</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-500">Description:</td>
                <td>{data.trademarkDescription}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Logo placeholder for design marks */}
          {(data.trademarkType === "Logo/Design Mark" || data.trademarkType === "Combined Word and Design Mark") && (
            <div className="mt-2 border border-dashed border-gray-300 rounded p-3 flex justify-center">
              <div className="text-center">
                <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">Logo will be included in your application</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {data.trademarkClasses && data.trademarkClasses.length > 0 && (
        <div className="space-y-1">
          <h2 className="text-base font-semibold flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-500" />
            Classification
          </h2>
          <div className="mt-1 bg-gray-50 p-2 rounded">
            <p className="text-sm font-medium mb-2">Selected Classes ({data.trademarkClasses.length}):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {data.trademarkClasses.map((cls) => (
                <div key={cls} className="flex items-center text-xs">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                  <span className="truncate">{cls}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Additional services */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          Additional Services
        </h2>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-1 text-gray-500 w-1/3">Priority Claim:</td>
              <td>{data.priorityClaim ? "Yes" : "No"}</td>
            </tr>
            {data.priorityClaim && (
              <>
                <tr>
                  <td className="py-1 text-gray-500">Priority Country:</td>
                  <td>{data.priorityCountry}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Priority Date:</td>
                  <td>{data.priorityDate}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Priority Number:</td>
                  <td>{data.priorityNumber}</td>
                </tr>
              </>
            )}
            <tr>
              <td className="py-1 text-gray-500">Express Examination:</td>
              <td>{data.expressExamination ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Price estimate */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold">Estimated Fees</h2>
          <span className="text-lg font-bold">${calculatePrice().toFixed(2)}</span>
        </div>
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Base Application Fee:</span>
            <span>${(product.basePrice || 250).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Class Fees ({data.trademarkClasses?.length || 0} × $100):</span>
            <span>${((data.trademarkClasses?.length || 0) * 100).toFixed(2)}</span>
          </div>
          {data.expressExamination && (
            <div className="flex justify-between">
              <span className="text-gray-500">Express Examination:</span>
              <span>$200.00</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Notes */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">Important Notes:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Registration process typically takes 12-18 months.</li>
              <li>Preliminary approval is usually issued within 9 months.</li>
              <li>Our team will handle all communications with CNIPA.</li>
              <li>Additional fees may apply for Office Actions or oppositions.</li>
            </ul>
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
        {applicationPreview}
      </div>
      
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto p-6 relative">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >XXX
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="prose max-w-none relative">
              {applicationPreview}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChineseTrademarkPreview;