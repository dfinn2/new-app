// components/product-forms/NnnAgreementForm.tsx - Updated version
import { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyCheckupSchema, CompanyCheckupFormData } from "@/schemas/companyCheckupSchema";
import { FormPage1, FormPage2, FormPage3, OrderConfirmation } from "@/components/form-pages/NnnFormPages";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface ProductType {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  stripePriceId?: string;
  stripeProductId?: string;
  slug: string;
}

interface CompanyCheckupFormProps {
  product: ProductType;
  schema: z.ZodType<CompanyCheckupFormData>;
  onChange: (data: Partial<CompanyCheckupFormData>) => void;
  onSubmit: (data: CompanyCheckupFormData) => void;
}

const CompanyCheckupForm = ({ product, onChange, onSubmit }: CompanyCheckupFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Including confirmation page
  const firstRender = useRef(true);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Add states for form processing
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get user session/email on component mount
  useEffect(() => {
    const getUserData = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
      }
    };
    
    getUserData();
  }, []);
  
  const methods = useForm<CompanyCheckupFormData>({
    mode: "onChange",
    defaultValues: {
      disclosingPartyType: "Individual",
      productTrademark: "notInterested",
      arbitration: "ICC International Court of Arbitration",
      penaltyDamages: "liquidatedDamages",
      email: "", // Email field with empty default - will be populated from user
    },
  });
  
  const { handleSubmit, watch, formState, setError: setFormError, clearErrors, register, setValue } = methods;
  
  // Set email value from user data when available
  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email);
    }
  }, [user, setValue]);
  
  // Watch for changes to update preview
  const formValues = watch();
  
  // Update preview whenever form values change - with fix for infinite loop
  useEffect(() => {
    // Skip the initial render to prevent infinite loops
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    
    // Create a debounce effect to limit updates
    const timeoutId = setTimeout(() => {
      onChange(formValues);
    }, 100);
    
    // Cleanup
    return () => clearTimeout(timeoutId);
  }, [formValues, onChange]);
  
  const validateFields = async (fieldsToValidate: string[]) => {
    // Create a partial schema with only the fields we want to validate
    const partialSchema: Record<string, z.ZodTypeAny> = {};
    fieldsToValidate.forEach(field => {
      // Get the field's schema from the main schema
      const schema = nnnAgreementSchema.shape as Record<string, z.ZodTypeAny>;
      const fieldSchema = schema[field];
      if (fieldSchema) {
        partialSchema[field] = fieldSchema;
      }
    });
    
    // Create a new partial schema
    const validationSchema = z.object(partialSchema);
    
    try {
      // Only validate the specified fields
      const dataToValidate = {} as Partial<NNNAgreementFormData>;
      fieldsToValidate.forEach(field => {
        const key = field as keyof NNNAgreementFormData;
        if (key in formValues) {
          // Use type assertion to maintain the correct type
          (dataToValidate as any)[key] = formValues[key];
        }
      });
      
      validationSchema.parse(dataToValidate);
      clearErrors();
      return true;
    
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = err.path.join('.');
            setFormError(path as keyof NNNAgreementFormData, { 
              type: 'manual', 
              message: err.message 
            });
          }
        });
      }
      return false;
    }
  };
  
  const handleNext = async () => {
    let fieldsToValidate: string[] = [];
    
    // Determine which fields to validate based on current page
    if (currentPage === 1) {
      fieldsToValidate = ["disclosingPartyType", "disclosingPartyName"];
      if (formValues.disclosingPartyType === "Corporation") {
        fieldsToValidate.push("disclosingPartyBusinessNumber");
      }
    } else if (currentPage === 2) {
      fieldsToValidate = ["receivingPartyName", "receivingPartyAddress", "receivingPartyUSCC"];
    } else if (currentPage === 3) {
      fieldsToValidate = ["productName", "productDescription", "productTrademark", "arbitration", "penaltyDamages"];
    }
    
    const isValid = await validateFields(fieldsToValidate);
    if (isValid) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };
  
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  // Direct payment handler - creates Stripe session and redirects
  const processPayment = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      // Validate the form data first
      const isValid = await methods.trigger();
      if (!isValid) {
        throw new Error("Please fix the form errors before continuing");
      }
      
      const validatedData = methods.getValues();
      
      // Use user's email if not provided or empty in the form
      if (!validatedData.email && user?.email) {
        validatedData.email = user.email;
      }
      
      // Store form data in localStorage for retrieval after payment
      localStorage.setItem('nnnAgreementFormData', JSON.stringify(validatedData));
      
      // Call the create-checkout-session API
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.basePrice * 100, // Convert to cents
          description: product.description || '',
          stripePriceId: product.stripePriceId,
          stripeProductId: product.stripeProductId,
          slug: product.slug,
          email: validatedData.email || user?.email || '',
          formData: validatedData,
        }),
      });
      
      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment session creation failed");
      }
      
      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        router.push(data.url);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setProcessing(false);
    }
  };
  
  // Form submission handler
  const handleFormSubmit = async (data: CompanyCheckupFormData) => {
    try {
      // Reset error state
      setError(null);
      
      // Validate the entire form data
      const validatedData = companyCheckupSchema.parse(data);
      
      // Call the original onSubmit (for compatibility)
      onSubmit(validatedData);
      
      // Process payment directly
      await processPayment();
      
    } catch (error) {
      console.error("Error processing form:", error);
      
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = err.path.join('.');
            setFormError(path as keyof CompanyCheckupFormData, { 
              type: 'manual', 
              message: err.message 
            });
          }
        });
      } else {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    }
  };
  
  // Create a modified OrderConfirmation component that doesn't show email field if user is logged in
  const ModifiedOrderConfirmation = () => {
    return (
      <>
        <OrderConfirmation data={formValues} />
        
        {/* Only show email field if user email is not available */}
        {!user?.email && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <label className="block text-sm font-medium mb-1">
              Your Email (to receive the document)
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
            {formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {formState.errors.email.message as string}
              </p>
            )}
          </div>
        )}
        
        {/* If user is logged in, show which email will be used */}
        {user?.email && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-700">
              Your document will be sent to: <strong>{user.email}</strong>
            </p>
          </div>
        )}
      </>
    );
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto pb-4 max-h-[60vh]">
          {currentPage === 1 && <FormPage1 />}
          {currentPage === 2 && <FormPage2 />}
          {currentPage === 3 && <FormPage3 />}
          {currentPage === 4 && <ModifiedOrderConfirmation />}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <div className="mt-4 flex justify-between border-t pt-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          
          {currentPage < totalPages ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={processPayment}
              disabled={processing}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
            >
              {processing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      </form>
    </FormProvider>
  );
};

export default CompanyCheckupForm;