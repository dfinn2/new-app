// components/product-forms/TrademarkChinaForm.tsx
import { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trademarkChinaSchema, TrademarkChinaFormData } from "@/schemas/trademarkChinaSchema";
import { FormPage1, FormPage2, FormPage3, OrderConfirmation } from "@/components/form-pages/TrademarkChinaFormPages";
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

interface TrademarkChinaFormProps {
  product: ProductType;
  schema: z.ZodType<TrademarkChinaFormData>;
  onChange: (data: Partial<TrademarkChinaFormData>) => void;
  onSubmit: (data: TrademarkChinaFormData) => void;
}

const TrademarkChinaForm = ({ product, onChange, onSubmit }: TrademarkChinaFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Including confirmation page
  const firstRender = useRef(true);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Add states for form processing
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
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
  
  const methods = useForm<TrademarkChinaFormData>({
    resolver: zodResolver(trademarkChinaSchema),
    mode: "onChange",
    defaultValues: {
      serviceTier: "Standard",
      applicantType: "Individual",
      trademarkType: "Word Mark",
      trademarkClasses: [],
      priorityClaim: false,
      expeditedExamination: false,
      preliminaryClearanceSearch: false,
      chineseNameCreation: false,
      oppositionMonitoring: false,
      hasChineseAgent: false,
      contactPreference: "Email",
      agreeToTerms: false
    }
  });
  
  const { handleSubmit, watch, formState, trigger, setValue } = methods;
  
  // Set email value from user data when available
  useEffect(() => {
    if (user?.email) {
      setValue('applicantEmail', user.email);
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
  
  // Validation functions for each page
  const validateCurrentPage = async (): Promise<boolean> => {
    let fieldsToValidate: Array<keyof TrademarkChinaFormData> = [];
    
    // Determine which fields to validate based on current page
    if (currentPage === 1) {
      fieldsToValidate = ['serviceTier', 'applicantType', 'applicantName', 'applicantAddress', 'applicantCity', 'applicantCountry', 'applicantEmail', 'applicantPhone'];
      
      // Conditionally add fields based on user selections
      if (formValues.hasChineseAgent) {
        fieldsToValidate.push('agentName', 'agentAddress', 'agentCity', 'agentProvince');
      }
    } else if (currentPage === 2) {
      fieldsToValidate = ['trademarkType', 'trademarkName', 'trademarkDescription', 'trademarkClasses'];
      
      // Conditionally add fields for priority claim
      if (formValues.priorityClaim) {
        fieldsToValidate.push('priorityCountry', 'priorityApplicationNumber', 'priorityFilingDate');
      }
    } else if (currentPage === 3) {
      fieldsToValidate = ['contactPreference', 'agreeToTerms'];
      // Additional services don't need validation as they're optional
    }
    
    // Trigger validation for the specified fields
    const result = await trigger(fieldsToValidate);
    return result;
  };
  
  // Navigation handlers
  const handleNext = async () => {
    const isValid = await validateCurrentPage();
    if (isValid) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      // Scroll to top
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    // Scroll to top
    window.scrollTo(0, 0);
  };
  
  // Direct payment handler - creates Stripe session and redirects
  const processPayment = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      // Validate the form data first
      const isValid = await trigger();
      if (!isValid) {
        throw new Error("Please fix the form errors before continuing");
      }
      
      const validatedData = methods.getValues();
      
      // Calculate price based on selections
      let totalPrice = 0;
      switch (validatedData.serviceTier) {
        case "Standard":
          totalPrice = 895;
          break;
        case "Premium":
          totalPrice = 1495;
          break;
        case "Comprehensive":
          totalPrice = 2495;
          break;
      }
      
      // Add additional class fees
      const includedClasses = validatedData.serviceTier === "Standard" ? 1 
                            : validatedData.serviceTier === "Premium" ? 2 
                            : 3;
      
      const additionalClasses = Math.max(0, validatedData.trademarkClasses.length - includedClasses);
      totalPrice += additionalClasses * 200;
      
      // Add additional services
      if (validatedData.expeditedExamination) totalPrice += 300;
      if (validatedData.serviceTier === "Standard" && validatedData.preliminaryClearanceSearch) totalPrice += 250;
      if (validatedData.serviceTier === "Standard" && validatedData.chineseNameCreation) totalPrice += 350;
      if ((validatedData.serviceTier === "Standard" || validatedData.serviceTier === "Premium") && validatedData.oppositionMonitoring) totalPrice += 400;
      
      // Store form data in localStorage for retrieval after payment
      localStorage.setItem('trademarkChinaFormData', JSON.stringify(validatedData));
      
      // Call the create-checkout-session API
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          productName: `${product.name} - ${validatedData.serviceTier} Tier`,
          price: totalPrice * 100, // Convert to cents
          description: `${validatedData.serviceTier} tier trademark registration for "${validatedData.trademarkName}" in ${validatedData.trademarkClasses.length} classes`,
          stripePriceId: product.stripePriceId,
          stripeProductId: product.stripeProductId,
          slug: product.slug,
          email: validatedData.applicantEmail,
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
  const handleFormSubmit = async (data: TrademarkChinaFormData) => {
    try {
      // Reset error state
      setError(null);
      
      // Call the original onSubmit (for compatibility)
      onSubmit(data);
      
      // Process payment directly
      await processPayment();
      
    } catch (error) {
      console.error("Error processing form:", error);
      
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = err.path.join('.');
            methods.setError(path as any, { 
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
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto pb-4 max-h-[60vh]">
          {currentPage === 1 && <FormPage1 />}
          {currentPage === 2 && <FormPage2 />}
          {currentPage === 3 && <FormPage3 />}
          {currentPage === 4 && <OrderConfirmation data={formValues} />}
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

export default TrademarkChinaForm;  