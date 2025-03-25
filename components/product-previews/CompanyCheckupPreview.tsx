// components/product-previews/CompanyCheckupPreview.tsx
import { useState } from "react";
import { CompanyCheckupFormData } from "@/schemas/companyCheckupSchema";
import { Building, FileText, AlertCircle, CheckCircle, User, Map, Phone, Calendar, Users, Package, Factory } from "lucide-react";

interface ProductType {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  stripePriceId?: string;
  stripeProductId?: string;
  slug: string;
}

interface CompanyCheckupPreviewProps {
  product: ProductType;
  formData: Partial<CompanyCheckupFormData>; // Use Partial to allow incomplete form data during editing
  isGenerating?: boolean;
}

const CompanyCheckupPreview = ({ product, formData, isGenerating = false }: CompanyCheckupPreviewProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);
  
  // Safe casting of form data to our expected type
  const data = formData as Partial<CompanyCheckupFormData>;
  
  // Calculate price based on tier and additional services
  const calculatePrice = (): number => {
    const basePrices: Record<string, number> = {
      Basic: product.basePrice || 199,
      Premium: (product.basePrice || 199) * 2.5, // $497.50
      Complete: (product.basePrice || 199) * 5, // $995
    };
    
    let price = basePrices[data.tier || "Basic"];
    
    // Add additional services costs for Complete tier
    if (data.tier === "Complete") {
      if (data.factoryInspection) price += 300;
      if (data.recordsCheck) price += 200;
      if (data.meetingWithManufacturer) price += 500;
      if (data.backgroundCheck) price += 250;
    }
    
    return price;
  };
  
  // Check if we have sufficient data to show a meaningful preview
  const hasBasicInfo = data.manufacturerName;
  
  // Handle loading/generating state
  if (isGenerating) {
    return (
      <div className="h-full border border-gray-300 rounded shadow-sm p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your report preview...</p>
        </div>
      </div>
    );
  }
  
  // Empty state when not enough data
  if (!hasBasicInfo) {
    return (
      <div className="h-full border border-gray-300 rounded shadow-sm p-8 flex flex-col items-center justify-center text-center">
        <Building className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500">Company Checkup Preview</h3>
        <p className="text-sm text-gray-400 mt-2 max-w-md">
          Start by providing the manufacturer name and selecting a service tier to see a preview of your report.
        </p>
      </div>
    );
  }
  
  // Format the report preview
  const reportPreview = (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Company Checkup Report</h1>
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            PREVIEW
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manufacturer Verification and Due Diligence Report
        </p>
      </div>
      
      {/* Report Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <Building className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Manufacturer</p>
              <p className="font-medium">{data.manufacturerName}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Level</p>
              <p className="font-medium">{data.tier || "Basic"} Tier</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Report Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Company Profile */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold flex items-center">
          <Building className="h-4 w-4 mr-2 text-gray-500" />
          Company Profile
        </h2>
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b">
              <td className="py-2 text-gray-500 w-1/3">Company Name (EN):</td>
              <td className="py-2 font-medium">{data.manufacturerName}</td>
            </tr>
            {data.manufacturerNameChinese && (
              <tr className="border-b">
                <td className="py-2 text-gray-500">Company Name (CN):</td>
                <td className="py-2">{data.manufacturerNameChinese}</td>
              </tr>
            )}
            {data.usccNumber && (
              <tr className="border-b">
                <td className="py-2 text-gray-500">USCC:</td>
                <td className="py-2">{data.usccNumber}</td>
              </tr>
            )}
            {(data.address || data.city || data.province) && (
              <tr className="border-b">
                <td className="py-2 text-gray-500">Address:</td>
                <td className="py-2">
                  {[data.address, data.city, data.province].filter(Boolean).join(", ")}
                </td>
              </tr>
            )}
            {data.yearEstablished && (
              <tr className="border-b">
                <td className="py-2 text-gray-500">Year Established:</td>
                <td className="py-2">{data.yearEstablished}</td>
              </tr>
            )}
            {data.employeeCount && (
              <tr className="border-b">
                <td className="py-2 text-gray-500">Employee Count:</td>
                <td className="py-2">{data.employeeCount}</td>
              </tr>
            )}
            {data.productsManufactured && (
              <tr className="border-b">
                <td className="py-2 text-gray-500">Products:</td>
                <td className="py-2">{data.productsManufactured}</td>
              </tr>
            )}
            {data.industryFocus && (
              <tr>
                <td className="py-2 text-gray-500">Industry Focus:</td>
                <td className="py-2">{data.industryFocus}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Services Included */}
      <div className="space-y-2">
        <h2 className="text-base font-semibold">Services Included in This Report</h2>
        <div className="bg-gray-50 p-4 rounded">
          <div className="space-y-2">
            {/* Basic tier services - always included */}
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <div>
                <p className="font-medium">USCC Verification</p>
                <p className="text-sm text-gray-600">Confirmation of Unified Social Credit Code registration</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <div>
                <p className="font-medium">Chinese Name Check</p>
                <p className="text-sm text-gray-600">Validation of official Chinese company name</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <div>
                <p className="font-medium">Incorporation Verification</p>
                <p className="text-sm text-gray-600">Confirmation of legal registration status</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <div>
                <p className="font-medium">Company Stamp Validation</p>
                <p className="text-sm text-gray-600">Verification of official company chop/seal</p>
              </div>
            </div>
            
            {/* Premium tier services */}
            {(data.tier === "Premium" || data.tier === "Complete") && (
              <>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Business License Verification</p>
                    <p className="text-sm text-gray-600">Confirmation of valid business license and scope</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Litigation Status Check</p>
                    <p className="text-sm text-gray-600">Research on current and past legal proceedings</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Owner and Key Personnel Verification</p>
                    <p className="text-sm text-gray-600">Identification and verification of legal owners</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Related Entities Research</p>
                    <p className="text-sm text-gray-600">Identification of subsidiary and parent companies</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Trademark History</p>
                    <p className="text-sm text-gray-600">Research on registered trademarks and IP filings</p>
                  </div>
                </div>
              </>
            )}
            
            {/* Complete tier custom services */}
            {data.tier === "Complete" && (
              <>
                {data.factoryInspection && (
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Factory Inspection</p>
                      <p className="text-sm text-gray-600">On-site visit to verify manufacturing facilities</p>
                    </div>
                  </div>
                )}
                
                {data.recordsCheck && (
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Comprehensive Records Check</p>
                      <p className="text-sm text-gray-600">In-depth research into local business filings and compliance</p>
                    </div>
                  </div>
                )}
                
                {data.meetingWithManufacturer && (
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Meeting with Manufacturer</p>
                      <p className="text-sm text-gray-600">Arranged meeting with company representatives</p>
                    </div>
                  </div>
                )}
                
                {data.backgroundCheck && (
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Management Background Check</p>
                      <p className="text-sm text-gray-600">Detailed background check on key personnel</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Report Sections Preview */}
      <div className="mt-6 space-y-4">
        <h2 className="text-base font-semibold">Report Sections</h2>
        
        <div className="border rounded p-3">
          <div className="flex items-center text-blue-600 font-medium mb-2">
            <FileText className="h-4 w-4 mr-2" />
            <h3>1. Executive Summary</h3>
          </div>
          <p className="text-sm text-gray-600">
            Overview of key findings and recommendations based on our investigation of {data.manufacturerName}.
          </p>
        </div>
        
        <div className="border rounded p-3">
          <div className="flex items-center text-blue-600 font-medium mb-2">
            <Building className="h-4 w-4 mr-2" />
            <h3>2. Company Information</h3>
          </div>
          <p className="text-sm text-gray-600">
            Detailed findings about company structure, management, and legal status based on official records.
          </p>
        </div>
        
        <div className="border rounded p-3">
          <div className="flex items-center text-blue-600 font-medium mb-2">
            <Factory className="h-4 w-4 mr-2" />
            <h3>3. Manufacturing Capabilities</h3>
          </div>
          <p className="text-sm text-gray-600">
            Assessment of production facilities, capacity, and quality control processes.
          </p>
        </div>
        
        {(data.tier === "Premium" || data.tier === "Complete") && (
          <>
            <div className="border rounded p-3">
              <div className="flex items-center text-blue-600 font-medium mb-2">
                <Users className="h-4 w-4 mr-2" />
                <h3>4. Ownership Structure</h3>
              </div>
              <p className="text-sm text-gray-600">
                Analysis of corporate ownership, related entities, and key stakeholders.
              </p>
            </div>
            
            <div className="border rounded p-3">
              <div className="flex items-center text-blue-600 font-medium mb-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                <h3>5. Risk Assessment</h3>
              </div>
              <p className="text-sm text-gray-600">
                Evaluation of potential risks associated with this manufacturer and mitigation strategies.
              </p>
            </div>
          </>
        )}
        
        {data.tier === "Complete" && (
          <div className="border rounded p-3">
            <div className="flex items-center text-blue-600 font-medium mb-2">
              <Package className="h-4 w-4 mr-2" />
              <h3>6. Custom Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">
              In-depth analysis based on your specific requirements and selected additional services.
            </p>
          </div>
        )}
      </div>
      
      {/* Timeline */}
      <div className="space-y-2 mt-6">
        <h2 className="text-base font-semibold">Estimated Timeline</h2>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm">
            <span className="font-medium">Report Delivery:</span> 5-7 business days after payment
          </p>
          {data.tier === "Complete" && data.meetingWithManufacturer && (
            <p className="text-sm mt-1">
              <span className="font-medium">Manufacturer Meeting:</span> To be scheduled within 14 business days
            </p>
          )}
          {data.tier === "Complete" && data.factoryInspection && (
            <p className="text-sm mt-1">
              <span className="font-medium">Factory Inspection:</span> To be conducted within 14 business days
            </p>
          )}
        </div>
      </div>
      
      {/* Price Summary */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold">Total Price</h2>
          <span className="text-lg font-bold">${calculatePrice().toFixed(2)}</span>
        </div>
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Base {data.tier || "Basic"} Tier:</span>
            <span>
              ${data.tier === "Basic" ? "199.00" : 
                data.tier === "Premium" ? "499.00" : "999.00"}
            </span>
          </div>
          
          {data.tier === "Complete" && (
            <>
              {data.factoryInspection && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Factory Inspection:</span>
                  <span>$300.00</span>
                </div>
              )}
              {data.recordsCheck && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Records Check:</span>
                  <span>$200.00</span>
                </div>
              )}
              {data.meetingWithManufacturer && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Meeting with Manufacturer:</span>
                  <span>$500.00</span>
                </div>
              )}
              {data.backgroundCheck && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Background Check:</span>
                  <span>$250.00</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Notes */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-3">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">Important Notes:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>This preview is a representation of the final report format.</li>
              <li>The actual report will contain detailed findings from our investigation.</li>
              <li>Additional services may require more time for completion.</li>
              <li>All information will be verified through multiple sources.</li>
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
        {reportPreview}
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
              </svg>
            </button>
            
            <div className="prose max-w-none relative">
              {reportPreview}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyCheckupPreview;