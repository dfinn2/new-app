// components/form-pages/NnnFormPages.tsx
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { NNNAgreementFormData } from "@/schemas/nnnAgreementSchema";
import { AlertTriangle, Check, Info } from "lucide-react";

export function FormPage1() {
  const { register, watch, formState: { errors }, setValue } = useFormContext<NNNAgreementFormData>();
  const disclosingPartyType = watch("disclosingPartyType");
  const receivingPartyNameChinese = watch("receivingPartyNameChinese");
  const receivingPartyUSCC = watch("receivingPartyUSCC");
  const [showChineseNameAlert, setShowChineseNameAlert] = useState(false);
  const [showUSCCAlert, setShowUSCCAlert] = useState(false);
  const chineseNameVerified = watch("chineseNameVerified");
  const usccVerified = watch("usccVerified");
  const orderCheckup = watch("orderCheckup");

  // Handle changes to Chinese name field
  const handleChineseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("receivingPartyNameChinese", value);

    // Show alert if field is empty or contains no Chinese characters
    if (!value || !/[\u4e00-\u9fff]/.test(value)) {
      setShowChineseNameAlert(true);
    } else {
      setShowChineseNameAlert(false);
      setValue("chineseNameVerified", undefined);
    }
  };

  // Handle changes to USCC field
  const handleUSCCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("receivingPartyUSCC", value);
    
    // If USCC doesn't match the required format, show the alert
    if (!value || !/^[0-9A-Z]{18}$/.test(value)) {
      setShowUSCCAlert(true);
    } else {
      setShowUSCCAlert(false);
      setValue("usccVerified", undefined);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Party Information</h2>
      
      {/* Disclosing Party Information */}
      <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
        <h3 className="text-lg font-medium mb-2">Disclosing Party (You)</h3>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Type of Entity</label>
          <select
            {...register("disclosingPartyType")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="Individual">Individual</option>
            <option value="Corporation">Corporation</option>
            <option value="Other">Other</option>
          </select>
          {errors.disclosingPartyType && (
            <p className="text-red-500 text-xs mt-1">{errors.disclosingPartyType.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("disclosingPartyName")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder={`Your ${disclosingPartyType === "Individual" ? "full name" : "company name"}`}
          />
          {errors.disclosingPartyName && (
            <p className="text-red-500 text-xs mt-1">{errors.disclosingPartyName.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("disclosingPartyAddress")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Full address"
          />
          {errors.disclosingPartyAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.disclosingPartyAddress.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("disclosingPartyCountry")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Country"
            />
            {errors.disclosingPartyCountry && (
              <p className="text-red-500 text-xs mt-1">{errors.disclosingPartyCountry.message}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Legal Jurisdiction <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("disclosingPartyJurisdiction")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="State/Province or Country of registration"
            />
            {errors.disclosingPartyJurisdiction && (
              <p className="text-red-500 text-xs mt-1">{errors.disclosingPartyJurisdiction.message}</p>
            )}
          </div>
        </div>
        
        {disclosingPartyType === "Corporation" && (
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Business Registration Number</label>
            <input
              type="text"
              {...register("disclosingPartyBusinessNumber")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Company registration/business number"
            />
          </div>
        )}
      </div>
      
      {/* Receiving Party (Manufacturer) Information */}
      <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
        <h3 className="text-lg font-medium mb-2">Receiving Party (Manufacturer)</h3>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Manufacturer Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("receivingPartyName")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Official English name"
          />
          {errors.receivingPartyName && (
            <p className="text-red-500 text-xs mt-1">{errors.receivingPartyName.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Manufacturer Name (Chinese) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("receivingPartyNameChinese")}
            onChange={handleChineseNameChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="中文名称"
          />
          
          {showChineseNameAlert && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>
                      It is very important that you use the Manufacturer's full Chinese name, or the agreement might not be enforceable. If you do not know your manufacturer's name, we strongly advise you to order a Chinese Checkup to confirm the identity of your manufacturer.
                    </p>
                    <div className="mt-2 space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="needCheckup"
                          {...register("chineseNameVerified")}
                          className="mr-2"
                          onChange={() => setValue("orderCheckup", true)}
                        />
                        Yes, I would like to order a Checkup (+$99)
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="willConfirm"
                          {...register("chineseNameVerified")}
                          className="mr-2"
                        />
                        No, I will continue without company verification
                      </label>
                    </div>
                    {errors.chineseNameVerified && (
                      <p className="text-red-500 text-xs mt-1">{errors.chineseNameVerified.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Manufacturer Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("receivingPartyAddress")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Full address in China"
          />
          {errors.receivingPartyAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.receivingPartyAddress.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            USCC Number <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">(18-character Unified Social Credit Code)</span>
          </label>
          <input
            type="text"
            {...register("receivingPartyUSCC")}
            onChange={handleUSCCChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 91330000MA2HYPJT7N"
            maxLength={18}
          />
          {errors.receivingPartyUSCC && (
            <p className="text-red-500 text-xs mt-1">{errors.receivingPartyUSCC.message}</p>
          )}
          
          {showUSCCAlert && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>
                      Your manufacturer's USCC number is a unique business identifier, and it is very important that you include the correct number. If you do not know your manufacturer's USCC number, you can request this from your manufacturer, or order a company check and we will verify this information for you.
                    </p>
                    <div className="mt-2 space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="needCheckup"
                          {...register("usccVerified")}
                          className="mr-2"
                          onChange={() => setValue("orderCheckup", true)}
                        />
                        I would like to order a Chinese Checkup
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="willConfirm"
                          {...register("usccVerified")}
                          className="mr-2"
                        />
                        I will confirm this with my manufacturer directly
                      </label>
                    </div>
                    {errors.usccVerified && (
                      <p className="text-red-500 text-xs mt-1">{errors.usccVerified.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Company Checkup Order Summary (Only shows if selected) */}
      {orderCheckup && (
        <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Company Checkup Added to Your Order</h3>
              <p className="mt-1 text-sm text-blue-700">
                We'll verify your manufacturer's identity, business registration, and USCC number to ensure your NNN Agreement is enforceable.
              </p>
              <div className="mt-2 text-sm">
                <span className="font-medium text-blue-800">Price: $99</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FormPage2() {
  const { register, watch, formState: { errors } } = useFormContext<NNNAgreementFormData>();
  const productTrademark = watch("productTrademark");
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Product Information</h2>
      
      <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("productName")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Name of your product"
          />
          {errors.productName && (
            <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Product Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("productDescription")}
            rows={4}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description of your product including features, specifications, etc."
          ></textarea>
          {errors.productDescription && (
            <p className="text-red-500 text-xs mt-1">{errors.productDescription.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Trademark Status</label>
          
          <div className="bg-white p-4 rounded border">
            <p className="mb-3 text-sm">
              Having a registered trademark in China can significantly increase your legal protection. Select your current trademark status:
            </p>
            
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="radio"
                  value="have"
                  {...register("productTrademark")}
                  className="mt-1 mr-2"
                />
                <div>
                  <span className="font-medium">I already have a Chinese trademark</span>
                  <p className="text-xs text-gray-600">You have already registered your product name/logo as a trademark in China</p>
                </div>
              </label>
              
              <label className="flex items-start">
                <input
                  type="radio"
                  value="want"
                  {...register("productTrademark")}
                  className="mt-1 mr-2"
                />
                <div>
                  <span className="font-medium">I want to register a Chinese trademark</span>
                  <p className="text-xs text-gray-600">We can help you register your trademark in China (recommended)</p>
                </div>
              </label>
              
              <label className="flex items-start">
                <input
                  type="radio"
                  value="notInterested"
                  {...register("productTrademark")}
                  className="mt-1 mr-2"
                />
                <div>
                  <span className="font-medium">I'm not interested in a Chinese trademark</span>
                  <p className="text-xs text-gray-600">Not recommended - your protection will be limited without a trademark</p>
                </div>
              </label>
            </div>
            
            {productTrademark === "want" && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <div className="flex">
                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-700">
                      We will contact you after purchase to discuss trademark registration options.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Chinese trademark registration typically costs between $750-$1,500 depending on your specific needs.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormPage3() {
  const { register, watch, formState: { errors }, setValue } = useFormContext<NNNAgreementFormData>();
  const penaltyDamages = watch("penaltyDamages");
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Agreement Terms</h2>
      
      <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Agreement Duration <span className="text-red-500">*</span>
          </label>
          
          <div className="flex items-center space-x-3">
            <input
              type="number"
              {...register("agreementDuration", { valueAsNumber: true })}
              className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              min={1}
              max={99}
            />
            
            <select
              {...register("durationType")}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
          
          {errors.agreementDuration && (
            <p className="text-red-500 text-xs mt-1">{errors.agreementDuration.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Arbitration Venue <span className="text-red-500">*</span>
          </label>
          <select
            {...register("arbitration")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="CIETAC Beijing">China International Economic and Trade Arbitration Commission (CIETAC) Beijing</option>
            <option value="CIETAC Shanghai">China International Economic and Trade Arbitration Commission (CIETAC) Shanghai</option>
            <option value="HKIAC">Hong Kong International Arbitration Centre (HKIAC)</option>
            <option value="SHENZHEN COURT OF INTERNATIONAL ARBITRATION">Shenzhen Court of International Arbitration (SCIA)</option>
          </select>
          {errors.arbitration && (
            <p className="text-red-500 text-xs mt-1">{errors.arbitration.message}</p>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            The arbitration venue determines where disputes will be resolved. Hong Kong (HKIAC) is often preferred by Western companies, while Chinese venues may be more convenient for enforcement in mainland China.
          </p>
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">
            Penalty for Breach <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="radio"
                value="fixedAmount"
                {...register("penaltyDamages")}
                className="mt-1 mr-2"
                onChange={() => setValue("penaltyMultiple", "")}
              />
              <div>
                <span className="font-medium">Fixed Amount (Liquidated Damages)</span>
                <p className="text-xs text-gray-600">Set a specific dollar amount as penalty for breach</p>
                
                {penaltyDamages === "fixedAmount" && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input
                        type="text"
                        {...register("penaltyAmount")}
                        className="w-32 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 100,000"
                      />
                      <span className="ml-2 text-xs text-gray-500">USD</span>
                    </div>
                  </div>
                )}
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                value="contractMultiple"
                {...register("penaltyDamages")}
                className="mt-1 mr-2"
                onChange={() => setValue("penaltyAmount", "")}
              />
              <div>
                <span className="font-medium">Contract Value Multiple</span>
                <p className="text-xs text-gray-600">Penalty based on a multiple of the contract value</p>
                
                {penaltyDamages === "contractMultiple" && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <input
                        type="text"
                        {...register("penaltyMultiple")}
                        className="w-20 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 3"
                      />
                      <span className="ml-2 text-xs text-gray-500">times the contract value</span>
                    </div>
                  </div>
                )}
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="radio"
                value="slidingScale"
                {...register("penaltyDamages")}
                className="mt-1 mr-2"
                onChange={() => {
                  setValue("penaltyAmount", "");
                  setValue("penaltyMultiple", "");
                }}
              />
              <div>
                <span className="font-medium">Sliding Scale Based on Severity</span>
                <p className="text-xs text-gray-600">Different penalty amounts based on the type and severity of breach</p>
                
                {penaltyDamages === "slidingScale" && (
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Minor breach (accidental disclosure): $50,000</li>
                      <li>Significant breach (unauthorized use): $100,000</li>
                      <li>Severe breach (manufacturing/circumvention): $250,000</li>
                    </ul>
                  </div>
                )}
              </div>
            </label>
          </div>
          
          {errors.penaltyDamages && (
            <p className="text-red-500 text-xs mt-1">{errors.penaltyDamages.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function OrderConfirmation({ data }: { data: NNNAgreementFormData }) {
  // Calculate total price
  const calculatePrice = () => {
    let basePrice = 299; // Base price for NNN Agreement
    
    // Add price for company checkup if selected
    if (data.orderCheckup) {
      basePrice += 99;
    }
    
    return basePrice;
  };
  
  const totalPrice = calculatePrice();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="bg-gray-50 rounded-lg border p-6 space-y-6">
        {/* Agreement Overview */}
        <div>
          <h3 className="font-medium text-gray-800 mb-3">Agreement Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Document Type</p>
              <p className="font-medium">Non-Disclosure, Non-Use, Non-Circumvention Agreement (NNN)</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-medium">{data.agreementDuration} {data.durationType}</p>
            </div>
          </div>
        </div>
        
        {/* Party Information */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Party Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold mb-2">Disclosing Party:</p>
              <p className="text-sm">{data.disclosingPartyName}</p>
              <p className="text-sm">{data.disclosingPartyAddress}</p>
              <p className="text-sm">{data.disclosingPartyCountry}</p>
              {data.disclosingPartyType === "Corporation" && data.disclosingPartyBusinessNumber && (
                <p className="text-sm">Business #: {data.disclosingPartyBusinessNumber}</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-semibold mb-2">Receiving Party (Manufacturer):</p>
              <p className="text-sm">{data.receivingPartyName}</p>
              {data.receivingPartyNameChinese && (
                <p className="text-sm">{data.receivingPartyNameChinese}</p>
              )}
              <p className="text-sm">{data.receivingPartyAddress}</p>
              <p className="text-sm">USCC: {data.receivingPartyUSCC}</p>
            </div>
          </div>
        </div>
        
        {/* Product Information */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Product Information</h3>
          <div>
            <p className="text-sm text-gray-500 mb-1">Product</p>
            <p className="font-medium">{data.productName}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-sm">{data.productDescription}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Trademark Status</p>
            <p className="text-sm">
              {data.productTrademark === "have" ? "Already registered in China" : 
               data.productTrademark === "want" ? "Interested in registration" : 
               "Not interested in trademark registration"}
            </p>
          </div>
        </div>
        
        {/* Agreement Terms */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Legal Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Arbitration Venue</p>
              <p className="text-sm">{data.arbitration}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Penalty for Breach</p>
              <p className="text-sm">
                {data.penaltyDamages === "fixedAmount" ? 
                  `Fixed amount: $${data.penaltyAmount} USD` : 
                 data.penaltyDamages === "contractMultiple" ? 
                  `${data.penaltyMultiple}× contract value` : 
                  "Sliding scale based on severity"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Added Services */}
        {data.orderCheckup && (
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-800 mb-3">Added Services</h3>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="font-medium">Chinese Company Checkup</p>
                <p className="text-sm text-gray-600">Verification of manufacturer's identity and business information</p>
              </div>
              <div className="ml-auto text-sm font-medium">
                $99.00
              </div>
            </div>
          </div>
        )}
        
        {/* Price Summary */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total Price:</span>
            <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>NNN Agreement:</span>
              <span>$299.00</span>
            </div>
            {data.orderCheckup && (
              <div className="flex justify-between">
                <span>Company Checkup:</span>
                <span>$99.00</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-700 font-medium">What happens next?</p>
            <p className="text-sm text-blue-600 mt-1">
              After completing your order, you'll receive your customized NNN Agreement by email. The document will be in both English and Chinese, ready to send to your manufacturer for signature.
              {data.orderCheckup && " We'll also begin the company verification process and provide a report within 2-3 business days."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}