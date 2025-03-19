// components/product-forms/ChineseTrademarkForm.tsx
import { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chineseTrademarkSchema, ChineseTrademarkFormData } from "@/schemas/chineseTrademarkSchema";
import { FormPage1, FormPage2, FormPage3, FormPage4, OrderConfirmation } from "@/components/form-pages/TrademarkFormPages";
import { useRouter } from "next/navigation";
import { z } from "zod";

interface ProductType {
  _id: string;
  name: string;
  description?: string;
  basePrice: number;
  stripePriceId?: string;
  stripeProductId?: string;
  slug: string;
}

interface ChineseTrademarkFormProps {
  product: ProductType;
  schema: z.ZodType<ChineseTrademarkFormData>;
  onChange: (data: Partial<ChineseTrademarkFormData>) => void;
  onSubmit: (data: ChineseTrademarkFormData) => void;
}

const ChineseTrademarkForm = ({ product, onChange, onSubmit }: ChineseTrademarkFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Including confirmation page
  const firstRender = useRef(true);
  const router = useRouter();
  
  // File upload references
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [idDocFile, setIdDocFile] = useState<File | null>(null);
  
  // Add states for form processing
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const methods = useForm<ChineseTrademarkFormData>({
    resolver: zodResolver(chineseTrademarkSchema),
    mode: "onChange",
    defaultValues: {
      applicantType: "Individual",
      trademarkType: "Word Mark",
      trademarkClasses: [],
      priorityClaim: false,
      expressExamination: false,
    },
  });
  
  const { handleSubmit, watch, formState, setError: setFormError, clearErrors, trigger } = methods;
  
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
  
  const validateCurrentPage = async (): Promise<boolean> => {
    let fieldsToValidate: string[] = [];
    
    // Determine which fields to validate based on current page
    if (currentPage === 1) {
      fieldsToValidate = [
        "applicantType", 
        "applicantName", 
        "applicantAddress", 
        "applicantCountry", 
        "applicantEmail", 
        "applicantPhone"
      ];
    } else if (currentPage === 2) {
      fieldsToValidate = [
        "trademarkName", 
        "trademarkType", 
        "trademarkDescription"
      ];
      // Logo validation handled separately with file input
    } else if (currentPage === 3) {
      fieldsToValidate = ["trademarkClasses"];
      // Additional validation for priority claim if checked
      if (formValues.priorityClaim) {
        fieldsToValidate.push("priorityCountry", "priorityDate", "priorityNumber");
      }
    } else if (currentPage === 4) {
      // ID document validation handled separately with file input
      fieldsToValidate = [];
    }
    
    // Use trigger to validate specific fields
    const isValid = await trigger(fieldsToValidate as any[]);
    
    // Additional validation for files if needed
    if (isValid) {
      if (currentPage === 2) {
        // Validate logo file is present for logo trademark types
        const needsLogo = ["Logo/Design Mark", "Combined Word and Design Mark", "3D Mark"].includes(formValues.trademarkType);
        if (needsLogo && !logoFile) {
          setFormError("logoFile" as any, { 
            type: "manual", 
            message: "Please upload your logo/design" 
          });
          return false;
        }
      }
      
      if (currentPage === 4) {
        // Validate ID document
        if (!idDocFile) {
          setFormError("idDocFile" as any, { 
            type: "manual", 
            message: "Please upload an identification document" 
          });
          return false;
        }
      }
    }
    
    return isValid;
  };
  
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
      const isValid = await methods.trigger();
      if (!isValid) {
        throw new Error("Please fix the form errors before continuing");
      }
      
      const validatedData = methods.getValues();
      
      // In a real implementation, you would need to handle file uploads
      // For this example, we'll just note that files would be uploaded
      
      // Calculate price based on selections
      let basePrice = product.basePrice;
      
      // Add price for each trademark class (example: $100 per class)
      const classPrice = 100;
      const classesCount = validatedData.trademarkClasses.length;
      const classesTotal = classPrice * classesCount;
      
      // Add price for express examination if selected (example: $200)
      const expressPrice = validatedData.expressExamination ? 200 : 0;
      
      // Final price
      const totalPrice = basePrice + classesTotal + expressPrice;
      
      // Store form data in localStorage for retrieval after payment
      localStorage.setItem('chineseTrademarkFormData', JSON.stringify(validatedData));
      
      // Call the create-checkout-session API
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          productName: `${product.name} (${classesCount} classes${validatedData.expressExamination ? ', Express' : ''})`,
          price: totalPrice * 100, // Convert to cents
          description: `Chinese Trademark Application for "${validatedData.trademarkName}" - ${classesCount} classes${validatedData.expressExamination ? ', Express Examination' : ''}`,
          stripePriceId: product.stripePriceId,
          stripeProductId: product.stripeProductId,
          slug: product.slug,
          email: validatedData.applicantEmail,
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
  const handleFormSubmit = async (data: ChineseTrademarkFormData) => {
    try {
      // Reset error state
      setError(null);
      
      // Validate the entire form data
      const validatedData = chineseTrademarkSchema.parse(data);
      
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
            setFormError(path as any, { 
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
  
  // Get base price for display with classes
  const calculatePrice = () => {
    if (!formValues.trademarkClasses) return product.basePrice;
    
    // Base price + $100 per class
    const classPrice = 100;
    const classesTotal = classPrice * formValues.trademarkClasses.length;
    
    // Add express examination fee if selected
    const expressPrice = formValues.expressExamination ? 200 : 0;
    
    return product.basePrice + classesTotal + expressPrice;
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto pb-4 max-h-[60vh]">
          {currentPage === 1 && <FormPage1 />}
          {currentPage === 2 && <FormPage2 />}
          {currentPage === 3 && <FormPage3 />}
          {currentPage === 4 && <FormPage4 />}
          {currentPage === 5 && <OrderConfirmation data={formValues} />}
          
          {/* Price estimate */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-lg">Estimated Price: ${calculatePrice().toFixed(2)}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Base fee: ${product.basePrice.toFixed(2)} + 
              Class fees: ${(100 * (formValues.trademarkClasses?.length || 0)).toFixed(2)}
              {formValues.expressExamination && (" + Express fee: $200.00")}
            </p>
          </div>
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

export default ChineseTrademarkForm;