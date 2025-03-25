// components/form-pages/CompanyCheckupFormPages.tsx
import { useFormContext } from "react-hook-form";
import { CompanyCheckupFormData, checkupTiers } from "@/schemas/companyCheckupSchema";
import { useState } from "react";
import { Info, Check, AlertTriangle } from "lucide-react";

export function FormPage1() {
  const { register, watch, formState: { errors } } = useFormContext<CompanyCheckupFormData>();
  const selectedTier = watch("tier");
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Company Information</h2>
      <p className="text-gray-600 mb-4">
        Please provide basic information about the Chinese manufacturer you want to verify.
      </p>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Manufacturer Name (English) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("manufacturerName")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Official company name in English"
        />
        {errors.manufacturerName && (
          <p className="text-red-500 text-xs mt-1">{errors.manufacturerName.message}</p>
        )}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Manufacturer Name (Chinese)
        </label>
        <input
          type="text"
          {...register("manufacturerNameChinese")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="中文公司名称"
        />
        <p className="text-xs text-gray-500 mt-1">
          Providing the Chinese name helps ensure accurate identification
        </p>
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          USCC Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("usccNumber")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="18-character Unified Social Credit Code"
        />
        {errors.usccNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.usccNumber.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          The USCC is an 18-character code that uniquely identifies businesses in China
        </p>
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("address")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Street address"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("city")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Province <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("province")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.province && (
            <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-2">
          Select Service Tier <span className="text-red-500">*</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {checkupTiers.map((tier) => (
            <div 
              key={tier} 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedTier === tier 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300 hover:border-blue-300"
              }`}
              onClick={() => {
                const tierInput = document.querySelector(`input[value="${tier}"]`) as HTMLInputElement;
                if (tierInput) tierInput.checked = true;
                // Trigger a change event to update the form
                const event = new Event("change", { bubbles: true });
                tierInput.dispatchEvent(event);
              }}
            >
              <div className="flex items-start mb-2">
                <input
                  type="radio"
                  id={`tier-${tier}`}
                  value={tier}
                  {...register("tier")}
                  className="mt-1 mr-2"
                />
                <label htmlFor={`tier-${tier}`} className="font-medium cursor-pointer">
                  {tier} Tier
                </label>
              </div>
              
              <div className="ml-5 text-sm text-gray-600">
                {tier === "Basic" && (
                  <>
                    <p className="font-medium text-gray-800 mb-1">$199</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>USCC Verification</li>
                      <li>Chinese Name Check</li>
                      <li>Incorporation Verification</li>
                      <li>Company Stamp Validation</li>
                    </ul>
                  </>
                )}
                
                {tier === "Premium" && (
                  <>
                    <p className="font-medium text-gray-800 mb-1">$499</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>All Basic features</li>
                      <li>Business License Verification</li>
                      <li>Litigation Status Check</li>
                      <li>Owner Verification</li>
                      <li>Trademark History</li>
                    </ul>
                  </>
                )}
                
                {tier === "Complete" && (
                  <>
                    <p className="font-medium text-gray-800 mb-1">$999</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>All Premium features</li>
                      <li>Custom options available</li>
                      <li>Factory inspection (optional)</li>
                      <li>In-person meeting (optional)</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {errors.tier && (
          <p className="text-red-500 text-xs mt-1">{errors.tier.message}</p>
        )}
      </div>
    </div>
  );
}

export function FormPage2() {
  const { register, formState: { errors } } = useFormContext<CompanyCheckupFormData>();
  const [fileSelected, setFileSelected] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileSelected(e.target.files && e.target.files.length > 0);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Additional Company Details</h2>
      <p className="text-gray-600 mb-4">
        The more information you provide, the more comprehensive our check will be.
      </p>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Year Established
        </label>
        <input
          type="text"
          {...register("yearEstablished")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="YYYY"
        />
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Number of Employees
        </label>
        <input
          type="text"
          {...register("employeeCount")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Approximate employee count"
        />
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Business Scope
        </label>
        <input
          type="text"
          {...register("businessScope")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Official business scope from license"
        />
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Products Manufactured
        </label>
        <input
          type="text"
          {...register("productsManufactured")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Key products or product categories"
        />
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Industry Focus
        </label>
        <input
          type="text"
          {...register("industryFocus")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Main industry sectors"
        />
      </div>
      
      <div className="mt-6">
        <h3 className="text-base font-medium mb-2">Contact Information</h3>
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register("contactEmail")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Where we'll send the report"
          />
          {errors.contactEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Contact Name
            </label>
            <input
              type="text"
              {...register("contactName")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              {...register("contactPhone")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-base font-medium mb-2">Supporting Documents (Optional)</h3>
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Upload Business License or Other Documentation
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-blue-600">Click to upload</p>
              <p className="mt-1 text-xs text-gray-500">
                PDF, JPG, JPEG or PNG (max 10MB)
              </p>
            </label>
            {fileSelected && (
              <div className="mt-3 text-sm text-green-600 flex items-center justify-center">
                <Check className="h-4 w-4 mr-1" />
                <span>File selected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormPage3() {
  const { register, watch, formState: { errors } } = useFormContext<CompanyCheckupFormData>();
  const tier = watch("tier");
  
  // Only show additional services for Complete tier
  if (tier !== "Complete") {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
            <Info className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Additional Services</h3>
          <p className="text-gray-600">
            Additional services are only available with the Complete tier.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Complete Tier Customization</h2>
      <p className="text-gray-600 mb-4">
        Select additional services to customize your Complete package.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Each additional service will be added to the base price of the Complete tier.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="factoryInspection"
              {...register("factoryInspection")}
              className="mt-1 mr-3"
            />
            <div>
              <label htmlFor="factoryInspection" className="font-medium text-gray-900 cursor-pointer">
                Factory Inspection (+$300)
              </label>
              <p className="text-sm text-gray-600 mt-1">
                An on-site visit to verify the manufacturing facilities and production capabilities.
                Our team will document the visit with photos and detailed observations.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="recordsCheck"
              {...register("recordsCheck")}
              className="mt-1 mr-3"
            />
            <div>
              <label htmlFor="recordsCheck" className="font-medium text-gray-900 cursor-pointer">
                Comprehensive Records Check (+$200)
              </label>
              <p className="text-sm text-gray-600 mt-1">
                In-depth research into all available public records, including tax filings,
                customs records, and additional business registrations.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="meetingWithManufacturer"
              {...register("meetingWithManufacturer")}
              className="mt-1 mr-3"
            />
            <div>
              <label htmlFor="meetingWithManufacturer" className="font-medium text-gray-900 cursor-pointer">
                Meeting with Manufacturer (+$500)
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Our representative will arrange a meeting with the manufacturer&apos;s management team
                to discuss your interests and assess their communication and professionalism.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="backgroundCheck"
              {...register("backgroundCheck")}
              className="mt-1 mr-3"
            />
            <div>
              <label htmlFor="backgroundCheck" className="font-medium text-gray-900 cursor-pointer">
                Management Background Check (+$250)
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Detailed background check on key personnel, including professional history,
                legal issues, and reputation in the industry.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-group mt-6">
        <label className="block text-sm font-medium mb-1">
          Additional Notes or Requirements
        </label>
        <textarea
          {...register("additionalNotes")}
          rows={4}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Any specific concerns or areas to focus on during the investigation..."
        ></textarea>
      </div>
    </div>
  );
}

export function OrderConfirmation({ data }: { data: CompanyCheckupFormData }) {
  // Calculate price based on tier and selected services
  const calculatePrice = () => {
    // Base prices for each tier
    const basePrices = {
      Basic: 199,
      Premium: 499,
      Complete: 999
    };
    
    let totalPrice = basePrices[data.tier];
    
    // Add additional services for Complete tier
    if (data.tier === "Complete") {
      if (data.factoryInspection) totalPrice += 300;
      if (data.recordsCheck) totalPrice += 200;
      if (data.meetingWithManufacturer) totalPrice += 500;
      if (data.backgroundCheck) totalPrice += 250;
    }
    
    return totalPrice;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Order Confirmation</h2>
      <p className="text-gray-600 mb-6">Please review your information before completing your order.</p>
      
      <div className="bg-gray-50 rounded-lg border p-6 space-y-6">
        <div>
          <h3 className="font-medium text-gray-800 mb-3">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Manufacturer Name</p>
              <p className="font-medium">
                {data.manufacturerName}
                {data.manufacturerNameChinese && ` (${data.manufacturerNameChinese})`}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">USCC Number</p>
              <p className="font-medium">{data.usccNumber}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium">{data.address}, {data.city}, {data.province}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Service Package</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium">{data.tier} Tier</span>
            </div>
            <span className="font-medium">${data.tier === "Basic" ? "199" : data.tier === "Premium" ? "499" : "999"}</span>
          </div>
          
          {data.tier === "Complete" && (
            <div className="ml-11 space-y-2 mt-2">
              {data.factoryInspection && (
                <div className="flex justify-between">
                  <span>Factory Inspection</span>
                  <span>$300</span>
                </div>
              )}
              
              {data.recordsCheck && (
                <div className="flex justify-between">
                  <span>Comprehensive Records Check</span>
                  <span>$200</span>
                </div>
              )}
              
              {data.meetingWithManufacturer && (
                <div className="flex justify-between">
                  <span>Meeting with Manufacturer</span>
                  <span>$500</span>
                </div>
              )}
              
              {data.backgroundCheck && (
                <div className="flex justify-between">
                  <span>Management Background Check</span>
                  <span>$250</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Contact Information</h3>
          <p>
            <span className="text-gray-500">Email:</span> {data.contactEmail}
          </p>
          {data.contactName && (
            <p>
              <span className="text-gray-500">Name:</span> {data.contactName}
            </p>
          )}
          {data.contactPhone && (
            <p>
              <span className="text-gray-500">Phone:</span> {data.contactPhone}
            </p>
          )}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total Price:</span>
            <span className="text-lg font-bold">${calculatePrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-700 font-medium">Important Information</p>
            <p className="text-sm text-yellow-600 mt-1">
              By clicking &quot;Proceed to Payment&quot;, you agree to our Terms of Service. Report delivery typically
              takes 5-10 business days depending on the selected service tier and additional options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}