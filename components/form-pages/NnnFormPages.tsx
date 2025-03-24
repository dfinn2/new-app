// components/form-pages/NnnFormPages.tsx
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { NNNAgreementFormData } from "@/schemas/nnnAgreementSchema";

// Make sure to use named exports correctly
export function FormPage1() {
  const { register, watch, formState: { errors } } = useFormContext<NNNAgreementFormData>();
  const disclosingPartyType = watch("disclosingPartyType");
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Disclosing Party Information</h2>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Disclosing Party Type</label>
        <select
          {...register("disclosingPartyType")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="Individual">Individual</option>
          <option value="Corporation">Corporation</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Disclosing Party Name</label>
        <input
          type="text"
          {...register("disclosingPartyName")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {errors.disclosingPartyName && (
          <p className="text-red-500 text-xs mt-1">{errors.disclosingPartyName.message}</p>
        )}
      </div>
      
      {disclosingPartyType === "Corporation" && (
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Business Number</label>
          <input
            type="text"
            {...register("disclosingPartyBusinessNumber")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}

export function FormPage2() {
  const { register, watch, formState: { errors } } = useFormContext<NNNAgreementFormData>();
  const receivingPartyNameChinese = watch("receivingPartyNameChinese");
  const receivingPartyUSCC = watch("receivingPartyUSCC");
  const [showChineseWarning, setShowChineseWarning] = useState(false);
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Receiving Party Information</h2>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Receiving Party Name (English)</label>
        <input
          type="text"
          {...register("receivingPartyName")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {errors.receivingPartyName && (
          <p className="text-red-500 text-xs mt-1">{errors.receivingPartyName.message}</p>
        )}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Receiving Party Name (Chinese)</label>
        <input
          type="text"
          {...register("receivingPartyNameChinese")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          onBlur={() => setShowChineseWarning(!receivingPartyNameChinese)}
        />
        {(!receivingPartyNameChinese && showChineseWarning) && (
          <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
            <summary className="cursor-pointer font-medium">Warning</summary>
            <p className="text-sm">Chinese name is important</p>
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Receiving Party Address</label>
        <input
          type="text"
          {...register("receivingPartyAddress")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {errors.receivingPartyAddress && (
          <p className="text-red-500 text-xs mt-1">{errors.receivingPartyAddress.message}</p>
        )}
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Receiving Party USCC Number</label>
        <input
          type="text"
          {...register("receivingPartyUSCC")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="18 characters (e.g., 91110000MA0FL1XH2B)"
        />
        {errors.receivingPartyUSCC && (
          <p className="text-red-500 text-xs mt-1">{errors.receivingPartyUSCC.message}</p>
        )}
        {!receivingPartyUSCC && (
          <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
            <p className="text-sm">USCC number is required</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function FormPage3() {
  const { register, formState: { errors } } = useFormContext<NNNAgreementFormData>();
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Product Information</h2>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          {...register("productName")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {errors.productName && (
          <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>
        )}
        
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Trademark Status</p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="want"
                {...register("productTrademark")}
                className="mr-2"
              />
              I would like TM
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="have"
                {...register("productTrademark")}
                className="mr-2"
              />
              I already have TM
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="notInterested"
                {...register("productTrademark")}
                className="mr-2"
              />
              I am not interested
            </label>
          </div>
        </div>
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Product Description</label>
        <textarea
          {...register("productDescription")}
          rows={3}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {errors.productDescription && (
          <p className="text-red-500 text-xs mt-1">{errors.productDescription.message}</p>
        )}
      </div>
      
      <h2 className="text-lg font-semibold pt-4">Agreement Terms</h2>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Arbitration</label>
        <select
          {...register("arbitration")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="ICC International Court of Arbitration">ICC International Court of Arbitration</option>
          <option value="Singapore International Arbitration Centre">Singapore International Arbitration Centre</option>
          <option value="Hong Kong International Arbitration Centre">Hong Kong International Arbitration Centre</option>
          <option value="London Court of International Arbitration">London Court of International Arbitration</option>
          <option value="American Arbitration Association">American Arbitration Association</option>
        </select>
      </div>
      
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Penalty Damages</label>
        <select
          {...register("penaltyDamages")}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="liquidatedDamages">Liquidated Damages</option>
          <option value="provableDamages">Provable Damages</option>
        </select>
      </div>
    </div>
  );
}

export function OrderConfirmation({ data }: { data: NNNAgreementFormData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Order Confirmation</h2>
      <p>Please review your information before completing your order.</p>
      
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium">Disclosing Party</h3>
        <div className="ml-4">
          <p><span className="text-gray-600">Type:</span> {data.disclosingPartyType}</p>
          <p><span className="text-gray-600">Name:</span> {data.disclosingPartyName}</p>
          {data.disclosingPartyType === "Corporation" && (
            <p><span className="text-gray-600">Business Number:</span> {data.disclosingPartyBusinessNumber || "Not provided"}</p>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium">Receiving Party</h3>
        <div className="ml-4">
          <p><span className="text-gray-600">Name (English):</span> {data.receivingPartyName}</p>
          <p><span className="text-gray-600">Name (Chinese):</span> {data.receivingPartyNameChinese || "Not provided"}</p>
          <p><span className="text-gray-600">Address:</span> {data.receivingPartyAddress}</p>
          <p><span className="text-gray-600">USCC:</span> {data.receivingPartyUSCC}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium">Product Information</h3>
        <div className="ml-4">
          <p><span className="text-gray-600">Name:</span> {data.productName}</p>
          <p>
            <span className="text-gray-600">Trademark:</span> {
              data.productTrademark === "want" ? "I would like TM" :
              data.productTrademark === "have" ? "I already have TM" :
              "I'm not interested"
            }
          </p>
          <p><span className="text-gray-600">Description:</span> {data.productDescription}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium">Agreement Terms</h3>
        <div className="ml-4">
          <p><span className="text-gray-600">Arbitration:</span> {data.arbitration}</p>
          <p>
            <span className="text-gray-600">Penalty Damages:</span> {
              data.penaltyDamages === "liquidatedDamages" ? "Liquidated Damages" : "Provable Damages"
            }
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm">By clicking "Proceed to Payment", you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
}