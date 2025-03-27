// components/form-pages/TrademarkChinaFormPages.tsx
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { TrademarkChinaFormData } from "@/schemas/trademarkChinaSchema";
import { Check, AlertTriangle, Info, Upload } from "lucide-react";

export function FormPage1() {
  const { register, watch, formState: { errors } } = useFormContext<TrademarkChinaFormData>();
  const serviceTier = watch("serviceTier");
  const applicantType = watch("applicantType");
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Service Tier & Applicant Information</h2>
      
      {/* Service Tier Selection */}
      <div className="form-group">
        <label className="block text-sm font-medium mb-2">
          Select Service Tier <span className="text-red-500">*</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Standard", "Premium", "Comprehensive"].map((tier) => (
            <div 
              key={tier} 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                serviceTier === tier 
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
                  {...register("serviceTier")}
                  className="mt-1 mr-2"
                />
                <label htmlFor={`tier-${tier}`} className="font-medium cursor-pointer">
                  {tier} Tier
                </label>
              </div>
              
              <div className="ml-5 text-sm text-gray-600">
                {tier === "Standard" && (
                  <>
                    <p className="font-medium text-gray-800 mb-1">$895</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Basic filing service</li>
                      <li>1 trademark class</li>
                      <li>Standard processing time</li>
                      <li>Email status updates</li>
                    </ul>
                  </>
                )}
                
                {tier === "Premium" && (
                  <>
                    <p className="font-medium text-gray-800 mb-1">$1,495</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>All Standard features</li>
                      <li>Up to 2 trademark classes</li>
                      <li>Preliminary search</li>
                      <li>Chinese name recommendation</li>
                      <li>Priority processing</li>
                    </ul>
                  </>
                )}
                
                {tier === "Comprehensive" && (
                  <>
                    <p className="font-medium text-gray-800 mb-1">$2,495</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>All Premium features</li>
                      <li>Up to 3 trademark classes</li>
                      <li>Custom Chinese name creation</li>
                      <li>24-month opposition monitoring</li>
                      <li>Dedicated case manager</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {errors.serviceTier && (
          <p className="text-red-500 text-xs mt-1">{errors.serviceTier.message}</p>
        )}
      </div>
      
      {/* Applicant Information */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-4">Applicant Information</h3>
        
        <div className="form-group mb-4">
          <label className="block text-sm font-medium mb-1">
            Applicant Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("applicantType")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="Individual">Individual</option>
            <option value="Corporation">Corporation</option>
            <option value="LLC">LLC</option>
            <option value="Partnership">Partnership</option>
          </select>
          {errors.applicantType && (
            <p className="text-red-500 text-xs mt-1">{errors.applicantType.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Applicant Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("applicantName")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder={applicantType === "Individual" ? "Full Name" : "Company Name"}
            />
            {errors.applicantName && (
              <p className="text-red-500 text-xs mt-1">{errors.applicantName.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Applicant Name (Chinese) <span className="text-gray-500 font-normal">(if known)</span>
            </label>
            <input
              type="text"
              {...register("applicantNameChinese")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="中文名称"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank if you don't have a Chinese name. Our Premium and Comprehensive tiers include Chinese name creation.
            </p>
          </div>
        </div>
        
        <div className="form-group mt-4">
          <label className="block text-sm font-medium mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("applicantAddress")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Street Address"
          />
          {errors.applicantAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.applicantAddress.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("applicantCity")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.applicantCity && (
              <p className="text-red-500 text-xs mt-1">{errors.applicantCity.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("applicantCountry")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.applicantCountry && (
              <p className="text-red-500 text-xs mt-1">{errors.applicantCountry.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("applicantEmail")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.applicantEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.applicantEmail.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register("applicantPhone")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.applicantPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.applicantPhone.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Chinese Agent Section - Optional */}
      <div className="form-group">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="hasChineseAgent"
            {...register("hasChineseAgent")}
            className="mr-2"
          />
          <label htmlFor="hasChineseAgent" className="text-sm font-medium">
            I already have a Chinese agent/representative
          </label>
        </div>
        
        {watch("hasChineseAgent") && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
            <h4 className="font-medium text-gray-800 mb-3">Chinese Agent Information</h4>
            
            <div className="form-group mb-3">
              <label className="block text-sm font-medium mb-1">
                Agent Name
              </label>
              <input
                type="text"
                {...register("agentName")}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="form-group mb-3">
              <label className="block text-sm font-medium mb-1">
                Agent Address
              </label>
              <input
                type="text"
                {...register("agentAddress")}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...register("agentCity")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">
                  Province
                </label>
                <select
                  {...register("agentProvince")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a province</option>
                  {["Beijing", "Shanghai", "Guangdong", "Jiangsu", "Zhejiang"].map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FormPage2() {
  const { register, watch, formState: { errors } } = useFormContext<TrademarkChinaFormData>();
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const trademarkType = watch("trademarkType");
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedLogo(e.target.files[0]);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Trademark Information</h2>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Trademark Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register("trademarkType")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="Word Mark">Word Mark (Text Only)</option>
          <option value="Logo/Design Mark">Logo/Design Mark (No Text)</option>
          <option value="Combined Word and Design Mark">Combined Word and Design Mark</option>
          <option value="Sound Mark">Sound Mark</option>
          <option value="3D Mark">3D Mark</option>
        </select>
        {errors.trademarkType && (
          <p className="text-red-500 text-xs mt-1">{errors.trademarkType.message}</p>
        )}
        
        <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-blue-700">
          <Info className="inline-block h-4 w-4 mr-1" />
          {trademarkType === "Word Mark" && "A Word Mark protects the text of your trademark regardless of font or style."}
          {trademarkType === "Logo/Design Mark" && "A Logo/Design Mark protects the visual elements of your trademark without any text."}
          {trademarkType === "Combined Word and Design Mark" && "This type protects both the text and visual elements together as they appear."}
          {trademarkType === "Sound Mark" && "A Sound Mark protects a distinctive sound associated with your brand."}
          {trademarkType === "3D Mark" && "A 3D Mark protects the three-dimensional shape of your product or packaging."}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Trademark Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("trademarkName")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Your trademark name"
          />
          {errors.trademarkName && (
            <p className="text-red-500 text-xs mt-1">{errors.trademarkName.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Trademark Name (Chinese) <span className="text-gray-500 font-normal">(if applicable)</span>
          </label>
          <input
            type="text"
            {...register("trademarkNameChinese")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="中文商标名称"
          />
          <p className="text-xs text-gray-500 mt-1">
            If you don't have a Chinese name yet, we can help create one with our Premium or Comprehensive packages.
          </p>
        </div>
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Trademark Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("trademarkDescription")}
          rows={4}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Provide a detailed description of your trademark..."
        ></textarea>
        {errors.trademarkDescription && (
          <p className="text-red-500 text-xs mt-1">{errors.trademarkDescription.message}</p>
        )}
      </div>
      
      {/* Logo Upload Section - Only show for Logo/Design or Combined marks */}
      {(trademarkType === "Logo/Design Mark" || trademarkType === "Combined Word and Design Mark" || trademarkType === "3D Mark") && (
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Upload Logo/Design <span className="text-red-500">*</span>
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept=".jpg,.jpeg,.png,.svg,.pdf"
              onChange={handleLogoUpload}
            />
            
            {!uploadedLogo ? (
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-blue-600">Click to upload</p>
                <p className="mt-1 text-xs text-gray-500">
                  SVG, PNG, JPG or PDF (max. 5MB)
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  High resolution recommended (min. 600px × 600px)
                </p>
              </label>
            ) : (
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-600">File uploaded</p>
                <p className="mt-1 text-xs text-gray-500">{uploadedLogo.name}</p>
                <button
                  type="button"
                  onClick={() => setUploadedLogo(null)}
                  className="mt-2 text-xs text-red-600 hover:text-red-800"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Classification Section */}
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Trademark Classification <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select the classes of goods or services for which you want to register your trademark. 
          Additional fees apply for each class beyond what's included in your selected package.
        </p>
        
        {/* Placeholder for classification selector */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Nice Classification</h4>
            <input
              type="text"
              placeholder="Search classes..."
              className="p-2 border rounded"
            />
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[
              "Class 9: Electrical and scientific apparatus",
              "Class 25: Clothing",
              "Class 35: Advertising and business services",
              "Class 41: Education and entertainment",
              "Class 42: Scientific & technological services"
            ].map((cls) => (
              <div key={cls} className="flex items-start">
                <input
                  type="checkbox"
                  id={cls}
                  value={cls}
                  {...register("trademarkClasses")}
                  className="mt-1 mr-2"
                />
                <label htmlFor={cls} className="text-sm">
                  {cls}
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-sm text-gray-500">
            <p>Standard package includes 1 class, Premium includes 2 classes, Comprehensive includes 3 classes.</p>
            <p>Additional classes: $200 per class.</p>
          </div>
        </div>
        {errors.trademarkClasses && (
          <p className="text-red-500 text-xs mt-1">{errors.trademarkClasses.message}</p>
        )}
      </div>
      
      {/* Priority Claim Section */}
      <div className="form-group">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="priorityClaim"
            {...register("priorityClaim")}
            className="mr-2"
          />
          <label htmlFor="priorityClaim" className="text-sm font-medium">
            Claim Priority of an Earlier Application
          </label>
        </div>
        
        {watch("priorityClaim") && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">
                  Priority Country
                </label>
                <select
                  {...register("priorityCountry")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select country</option>
                  {["United States", "European Union", "United Kingdom", "Japan", "South Korea", "Australia", "Other"].map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">
                  Application Number
                </label>
                                  <input
                  type="text"
                  {...register("priorityApplicationNumber")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Application number"
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">
                  Filing Date
                </label>
                <input
                  type="date"
                  {...register("priorityFilingDate")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              <p>Priority must be claimed within 6 months of your original application.</p>
              <p>You'll need to provide a certified copy of your priority application.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FormPage3() {
  const { register, watch, formState: { errors } } = useFormContext<TrademarkChinaFormData>();
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    businessLicense: File | null;
    powerOfAttorney: File | null;
    idDocument: File | null;
    priorityDocument: File | null;
  }>({
    businessLicense: null,
    powerOfAttorney: null,
    idDocument: null,
    priorityDocument: null,
  });
  
  const serviceTier = watch("serviceTier");
  const applicantType = watch("applicantType");
  const isPriorityClaim = watch("priorityClaim");
  
  const handleFileUpload = (documentType: keyof typeof uploadedDocuments) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedDocuments(prev => ({
        ...prev,
        [documentType]: e.target.files![0]
      }));
    }
  };
  
  const removeFile = (documentType: keyof typeof uploadedDocuments) => () => {
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Documents & Additional Services</h2>
      
      {/* Document Upload Section */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-4">Required Documents</h3>
        
        {/* Business License/Registration (for companies) */}
        {applicantType !== "Individual" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Business License/Registration <span className="text-red-500">*</span>
              </label>
              {uploadedDocuments.businessLicense && (
                <span className="text-xs text-green-600">
                  <Check className="inline-block h-3 w-3 mr-1" />
                  Uploaded
                </span>
              )}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="business-license-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload('businessLicense')}
              />
              
              {!uploadedDocuments.businessLicense ? (
                <label htmlFor="business-license-upload" className="cursor-pointer flex items-center justify-center">
                  <Upload className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-blue-600">Upload business license</span>
                </label>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{uploadedDocuments.businessLicense.name}</span>
                  <button
                    type="button"
                    onClick={removeFile('businessLicense')}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a copy of your business registration/license, or equivalent document.
            </p>
          </div>
        )}
        
        {/* ID Document (for individuals) */}
        {applicantType === "Individual" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                ID Document <span className="text-red-500">*</span>
              </label>
              {uploadedDocuments.idDocument && (
                <span className="text-xs text-green-600">
                  <Check className="inline-block h-3 w-3 mr-1" />
                  Uploaded
                </span>
              )}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="id-document-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload('idDocument')}
              />
              
              {!uploadedDocuments.idDocument ? (
                <label htmlFor="id-document-upload" className="cursor-pointer flex items-center justify-center">
                  <Upload className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-blue-600">Upload ID document</span>
                </label>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{uploadedDocuments.idDocument.name}</span>
                  <button
                    type="button"
                    onClick={removeFile('idDocument')}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a copy of your passport, ID card, or other government-issued ID.
            </p>
          </div>
        )}
        
        {/* Power of Attorney */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Power of Attorney <span className="text-red-500">*</span>
            </label>
            {uploadedDocuments.powerOfAttorney && (
              <span className="text-xs text-green-600">
                <Check className="inline-block h-3 w-3 mr-1" />
                Uploaded
              </span>
            )}
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              id="poa-upload"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload('powerOfAttorney')}
            />
            
            {!uploadedDocuments.powerOfAttorney ? (
              <label htmlFor="poa-upload" className="cursor-pointer flex items-center justify-center">
                <Upload className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-blue-600">Upload power of attorney</span>
              </label>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm">{uploadedDocuments.powerOfAttorney.name}</span>
                <button
                  type="button"
                  onClick={removeFile('powerOfAttorney')}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            We'll provide a template for you to sign and upload. You can upload a blank document now and update later.
          </p>
        </div>
        
        {/* Priority Document (if priority claimed) */}
        {isPriorityClaim && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Priority Document <span className="text-red-500">*</span>
              </label>
              {uploadedDocuments.priorityDocument && (
                <span className="text-xs text-green-600">
                  <Check className="inline-block h-3 w-3 mr-1" />
                  Uploaded
                </span>
              )}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="priority-doc-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload('priorityDocument')}
              />
              
              {!uploadedDocuments.priorityDocument ? (
                <label htmlFor="priority-doc-upload" className="cursor-pointer flex items-center justify-center">
                  <Upload className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-blue-600">Upload priority document</span>
                </label>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{uploadedDocuments.priorityDocument.name}</span>
                  <button
                    type="button"
                    onClick={removeFile('priorityDocument')}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload a certified copy of your priority application.
            </p>
          </div>
        )}
      </div>
      
      {/* Additional Services */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-4">Additional Services</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select any additional services you would like to add to your {serviceTier} package:
        </p>
        
        <div className="space-y-3">
          {/* Expedited Examination */}
          <div className="border rounded-lg p-3 hover:bg-gray-50">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="expeditedExamination"
                {...register("expeditedExamination")}
                className="mt-1 mr-3"
              />
              <div>
                <label htmlFor="expeditedExamination" className="font-medium text-gray-900 cursor-pointer">
                  Expedited Examination (+$300)
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Priority examination to reduce processing time. Results typically within 9-12 months instead of 12-18 months.
                </p>
              </div>
            </div>
          </div>
          
          {/* Preliminary Clearance Search */}
          {serviceTier === "Standard" && (
            <div className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="preliminaryClearanceSearch"
                  {...register("preliminaryClearanceSearch")}
                  className="mt-1 mr-3"
                />
                <div>
                  <label htmlFor="preliminaryClearanceSearch" className="font-medium text-gray-900 cursor-pointer">
                    Preliminary Clearance Search (+$250)
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Comprehensive search of existing Chinese trademarks to identify potential conflicts before filing.
                    <span className="text-blue-600 italic"> (Included in Premium and Comprehensive packages)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Chinese Name Creation */}
          {serviceTier === "Standard" && (
            <div className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="chineseNameCreation"
                  {...register("chineseNameCreation")}
                  className="mt-1 mr-3"
                />
                <div>
                  <label htmlFor="chineseNameCreation" className="font-medium text-gray-900 cursor-pointer">
                    Chinese Name Creation (+$350)
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Professional creation of a Chinese name for your brand that resonates with Chinese consumers.
                    <span className="text-blue-600 italic"> (Included in Premium and Comprehensive packages)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Opposition Monitoring */}
          {(serviceTier === "Standard" || serviceTier === "Premium") && (
            <div className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="oppositionMonitoring"
                  {...register("oppositionMonitoring")}
                  className="mt-1 mr-3"
                />
                <div>
                  <label htmlFor="oppositionMonitoring" className="font-medium text-gray-900 cursor-pointer">
                    Opposition Monitoring (+$400)
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    24-month monitoring service to identify and respond to potential oppositions to your trademark.
                    <span className="text-blue-600 italic">{serviceTier === "Standard" ? " (Included in Comprehensive package)" : ""}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Contact Preference */}
      <div className="form-group">
        <label className="block text-sm font-medium mb-2">
          Contact Preference
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="Email"
              {...register("contactPreference")}
              className="mr-2"
            />
            Email only
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="Phone"
              {...register("contactPreference")}
              className="mr-2"
            />
            Phone only
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="Both"
              {...register("contactPreference")}
              className="mr-2"
            />
            Both email and phone
          </label>
        </div>
      </div>
      
      {/* Additional Instructions */}
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">
          Additional Instructions or Requirements
        </label>
        <textarea
          {...register("additionalInstructions")}
          rows={4}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Any specific instructions or requirements for your trademark application..."
        ></textarea>
      </div>
      
      {/* Terms and Conditions */}
      <div className="form-group">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToTerms"
            {...register("agreeToTerms")}
            className="mt-1 mr-2"
          />
          <label htmlFor="agreeToTerms" className="text-sm">
            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and acknowledge that filing a trademark application does not guarantee registration. I understand that additional fees may apply depending on the scope of services required.
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms.message}</p>
        )}
      </div>
    </div>
  );
}

export function OrderConfirmation({ data }: { data: TrademarkChinaFormData }) {
  // Calculate total price based on selected options
  const calculatePrice = (): number => {
    let basePrice = 0;
    
    // Base price for each tier
    switch (data.serviceTier) {
      case "Standard":
        basePrice = 895;
        break;
      case "Premium":
        basePrice = 1495;
        break;
      case "Comprehensive":
        basePrice = 2495;
        break;
      default:
        basePrice = 895;
    }
    
    // Additional class fees - Standard includes 1, Premium includes 2, Comprehensive includes 3
    const includedClasses = data.serviceTier === "Standard" ? 1 
                          : data.serviceTier === "Premium" ? 2 
                          : 3;
    
    const selectedClasses = data.trademarkClasses.length;
    const additionalClasses = Math.max(0, selectedClasses - includedClasses);
    const additionalClassFees = additionalClasses * 200;
    
    // Additional services
    let additionalServicesFees = 0;
    
    if (data.expeditedExamination) {
      additionalServicesFees += 300;
    }
    
    if (data.serviceTier === "Standard" && data.preliminaryClearanceSearch) {
      additionalServicesFees += 250;
    }
    
    if (data.serviceTier === "Standard" && data.chineseNameCreation) {
      additionalServicesFees += 350;
    }
    
    if ((data.serviceTier === "Standard" || data.serviceTier === "Premium") && data.oppositionMonitoring) {
      additionalServicesFees += 400;
    }
    
    return basePrice + additionalClassFees + additionalServicesFees;
  };
  
  const totalPrice = calculatePrice();
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Order Confirmation</h2>
      <p className="text-gray-600 mb-6">Please review your information before completing your order.</p>
      
      <div className="bg-gray-50 rounded-lg border p-6 space-y-6">
        {/* Service Package */}
        <div>
          <h3 className="font-medium text-gray-800 mb-3">Service Package</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium">{data.serviceTier} Tier</span>
            </div>
            <span className="font-medium">${data.serviceTier === "Standard" ? "895" : data.serviceTier === "Premium" ? "1,495" : "2,495"}</span>
          </div>
          
          {/* Classes */}
          <div className="ml-11 mt-2">
            <div className="flex justify-between text-sm">
              <span>Selected Classes: {data.trademarkClasses.length}</span>
              <span>
                {data.trademarkClasses.length > 
                  (data.serviceTier === "Standard" ? 1 : 
                   data.serviceTier === "Premium" ? 2 : 3) && 
                 `+ ${(data.trademarkClasses.length - 
                   (data.serviceTier === "Standard" ? 1 : 
                    data.serviceTier === "Premium" ? 2 : 3)) * 200}`}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data.serviceTier === "Standard" ? "1 class included, $200 per additional class" : 
               data.serviceTier === "Premium" ? "2 classes included, $200 per additional class" : 
               "3 classes included, $200 per additional class"}
            </div>
          </div>
        </div>
        
        {/* Applicant Information */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Applicant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Applicant Type</p>
              <p className="font-medium">{data.applicantType}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Applicant Name</p>
              <p className="font-medium">
                {data.applicantName}
                {data.applicantNameChinese && ` (${data.applicantNameChinese})`}
              </p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium">{data.applicantAddress}, {data.applicantCity}, {data.applicantCountry}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium">{data.applicantEmail}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium">{data.applicantPhone}</p>
            </div>
          </div>
        </div>
        
        {/* Trademark Information */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Trademark Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <span className="font-medium">{data.trademarkType}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">
                {data.trademarkName}
                {data.trademarkNameChinese && ` (${data.trademarkNameChinese})`}
              </span>
            </div>
            
            <div>
              <div className="text-gray-500">Classes:</div>
              <div className="mt-1">
                {data.trademarkClasses.map((cls) => (
                  <div key={cls} className="text-sm">
                    • {cls}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Services */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Additional Services</h3>
          {(data.expeditedExamination || 
            (data.serviceTier === "Standard" && data.preliminaryClearanceSearch) || 
            (data.serviceTier === "Standard" && data.chineseNameCreation) || 
            ((data.serviceTier === "Standard" || data.serviceTier === "Premium") && data.oppositionMonitoring)) ? (
            <div className="space-y-2">
              {data.expeditedExamination && (
                <div className="flex justify-between">
                  <span>Expedited Examination</span>
                  <span>$300</span>
                </div>
              )}
              
              {data.serviceTier === "Standard" && data.preliminaryClearanceSearch && (
                <div className="flex justify-between">
                  <span>Preliminary Clearance Search</span>
                  <span>$250</span>
                </div>
              )}
              
              {data.serviceTier === "Standard" && data.chineseNameCreation && (
                <div className="flex justify-between">
                  <span>Chinese Name Creation</span>
                  <span>$350</span>
                </div>
              )}
              
              {(data.serviceTier === "Standard" || data.serviceTier === "Premium") && data.oppositionMonitoring && (
                <div className="flex justify-between">
                  <span>Opposition Monitoring (24 months)</span>
                  <span>$400</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No additional services selected</p>
          )}
        </div>
        
        {/* Total Price */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total Price:</span>
            <span className="text-lg font-bold">${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-700 font-medium">Important Information</p>
            <p className="text-sm text-yellow-600 mt-1">
              By clicking "Proceed to Payment", you agree to the terms and conditions. The application process typically
              takes 12-18 months. Additional office actions or responses may require additional fees not included in this
              package.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}