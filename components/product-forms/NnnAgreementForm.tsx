// components/NNNAgreementForm.tsx
import { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { nnnAgreementSchema, NNNAgreementFormData } from "@/schemas/nnnAgreementSchema";
import { FormPage1, FormPage2, FormPage3, OrderConfirmation } from "@/components/form-pages/NnnFormPages";
import { z } from "zod";

interface NNNAgreementFormProps {
  product: any;
  schema: any;
  onChange: (data: Partial<NNNAgreementFormData>) => void;
  onSubmit: (data: NNNAgreementFormData) => void;
}

const NNNAgreementForm = ({ product, schema, onChange, onSubmit }: NNNAgreementFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Including confirmation page
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const firstRender = useRef(true);
  
  // Add states for document generation
  const [generatingDocument, setGeneratingDocument] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>('');
  const [documentSuccess, setDocumentSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const methods = useForm<NNNAgreementFormData>({
    mode: "onChange",
    defaultValues: {
      disclosingPartyType: "Individual",
      productTrademark: "notInterested",
      arbitration: "ICC International Court of Arbitration",
      penaltyDamages: "liquidatedDamages",
      email: "", // Add email field with empty default
    },
  });
  
  const { handleSubmit, watch, formState, setError, clearErrors, register } = methods;
  
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
    const partialSchema: any = {};
    fieldsToValidate.forEach(field => {
      // Get the field's schema from the main schema
      const fieldSchema = (nnnAgreementSchema as any).shape[field];
      if (fieldSchema) {
        partialSchema[field] = fieldSchema;
      }
    });
    
    // Create a new partial schema
    const validationSchema = z.object(partialSchema);
    
    try {
      // Only validate the specified fields
      const dataToValidate: any = {};
      fieldsToValidate.forEach(field => {
        dataToValidate[field] = formValues[field as keyof NNNAgreementFormData];
      });
      
      validationSchema.parse(dataToValidate);
      clearErrors();
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = err.path.join('.');
            errors[path] = err.message;
            setError(path as any, { 
              type: 'manual', 
              message: err.message 
            });
          }
        });
        setValidationErrors(errors);
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
  
  // Updated form submission handler to generate PDF and enable download
  const handleFormSubmit = async (data: NNNAgreementFormData) => {
    try {
      // Reset error state
      setDocumentError(null);
      
      // Validate the entire form data
      const validatedData = nnnAgreementSchema.parse(data);
      setValidationErrors({});
      
      // Call the original onSubmit (to maintain compatibility)
      onSubmit(validatedData);
      
      // Start document generation
      setGeneratingDocument(true);
      
      try {
        // Call the API to generate the PDF with longer timeout
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentType: 'nnn-agreement',
            data: validatedData,
            userEmail: validatedData.email || '',
          }),
        });
        
        // First check if the response is valid
        if (!response.ok) {
          let errorMessage = `Server returned ${response.status}: ${response.statusText}`;
          
          // Try to parse error message from JSON
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            // If response is empty or invalid JSON
            console.error('Error parsing error response:', parseError);
            
            // Try to get response as text instead
            try {
              const errorText = await response.text();
              // If we got response text, use it for debugging
              if (errorText && errorText.length > 0) {
                console.error('Server returned non-JSON response:', errorText.substring(0, 500));
                errorMessage = 'Server returned invalid response format';
              } else {
                errorMessage = 'Server returned empty response';
              }
            } catch (textError) {
              console.error('Could not read error response body', textError);
            }
          }
          
          throw new Error(errorMessage);
        }
        
        // Get the PDF data from the response - with proper error handling for truncation
        let responseData;
        try {
          // First get response as text
          const responseText = await response.text();
          
          // Check if text is empty
          if (!responseText || responseText.trim() === '') {
            throw new Error('Response is empty');
          }
          
          // Try to parse JSON from text
          try {
            responseData = JSON.parse(responseText);
          } catch (jsonError) {
            console.error('Invalid JSON in response:', responseText.substring(0, 500));
            throw new Error('Server returned invalid JSON');
          }
        } catch (readError) {
          console.error('Error reading response:', readError);
          throw new Error('Failed to read server response');
        }
        
        // Validate response data
        if (!responseData) {
          throw new Error('Response data is missing');
        }
        
        if (!responseData.success) {
          const errorMsg = responseData.message || responseData.error || 'Failed to generate document';
          throw new Error(errorMsg);
        }
        
        // Verify PDF data exists
        if (!responseData.pdfData) {
          throw new Error('PDF data missing from response');
        }
        
        // All checks passed - store the data
        setPdfData(responseData.pdfData);
        setPdfFilename(responseData.filename || 'nnn-agreement.pdf');
        setEmailSent(responseData.emailSent);
        
        // Set success state
        setDocumentSuccess(true);
        
      } catch (requestError) {
        console.error("Request error:", requestError);
        throw requestError;
      }
      
    } catch (error) {
      console.error("Error generating document:", error);
      
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = err.path.join('.');
            errors[path] = err.message;
            setError(path as any, { 
              type: 'manual', 
              message: err.message 
            });
          }
        });
        setValidationErrors(errors);
      } else {
        setDocumentError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    } finally {
      setGeneratingDocument(false);
    }
  };
  
  // Handle document download
  const handleDownloadPDF = () => {
    if (!pdfData) return;
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfData}`;
    link.download = pdfFilename || 'nnn-agreement.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // If document generation was successful, show download UI
  if (documentSuccess && pdfData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-8 h-8 text-green-600"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Ready!</h2>
        
        <p className="text-gray-600 mb-6">
          {emailSent 
            ? 'Your document has been generated and sent to your email.' 
            : 'Your document has been generated successfully.'}
        </p>
        
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-5 h-5 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Document
        </button>
        
        <button
          onClick={() => {
            setDocumentSuccess(false);
            setPdfData(null);
            setCurrentPage(1);
          }}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Create another document
        </button>
      </div>
    );
  }
  
  // During document generation, show loading state
  if (generatingDocument) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Generating your document...</p>
      </div>
    );
  }
  
  // Normal form view
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto pb-4 max-h-[60vh]">
          {currentPage === 1 && <FormPage1 />}
          {currentPage === 2 && <FormPage2 />}
          {currentPage === 3 && <FormPage3 />}
          {currentPage === 4 && (
            <>
              <OrderConfirmation data={formValues} />
              
              {/* Add email field to confirmation page */}
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
            </>
          )}
        </div>
        
        {/* Error message */}
        {documentError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {documentError}
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
              type="submit"
              disabled={generatingDocument}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {generatingDocument ? 'Generating...' : 'Generate Document'}
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

export default NNNAgreementForm;