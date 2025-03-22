'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NNNAgreementFormData } from '@/schemas/nnnAgreementSchema';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Mail, 
  RefreshCw,
  ArrowRight,
  Loader
} from 'lucide-react';

interface OrderDetails {
  status: string;
  customer?: {
    name: string;
    email: string;
  };
  items?: {
    name: string;
    quantity: number;
    amount: number;
  }[];
  payment: {
    amount: number;
    created: string;
  };
  receiptId: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingOrder, setVerifyingOrder] = useState(true);
  
  // Document generation states
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [documentStatusMessage, setDocumentStatusMessage] = useState('');
  const [uploadingToStorage, setUploadingToStorage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Function to upload PDF to Supabase Storage
  const uploadPdfToStorage = async (pdfBase64: string, filename: string, userId: string | undefined) => {
    try {
      setUploadingToStorage(true);
      console.log("Uploading PDF to Supabase Storage");
      
      if (!pdfBase64 || !filename) {
        throw new Error("Missing PDF data or filename for upload");
      }
      
      if (!userId) {
        throw new Error("Missing user ID for document storage");
      }
      
      // Initialize Supabase client
      const supabase = createClient();
      
      // Verify user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user || session.user.id !== userId) {
        throw new Error("User authentication failed or user ID mismatch");
      }
      
      // Convert base64 to Blob
      const byteCharacters = atob(pdfBase64);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: 'application/pdf' });
      
      // Create a file object from the blob
      const file = new File([blob], filename, { type: 'application/pdf' });
      
      // Define the storage path based on user ID
      const filePath = `${userId}/${filename}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      console.log("PDF uploaded successfully:", data);
      
      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      console.log("File URL:", urlData.publicUrl);
      
      setFileUrl(urlData.publicUrl);
      setUploadSuccess(true);
      setDocumentStatusMessage(`Your document has been generated and stored in your account.`);
      
      // Save document record to the database - includes purchase information
      // This would normally happen in a server action or API route
      // Here we're making a direct API call
      await saveDocumentRecord(userId, filename, urlData.publicUrl, sessionId);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading PDF to storage:', error);
      throw error;
    } finally {
      setUploadingToStorage(false);
    }
  };
  
  // Save document record to database
  const saveDocumentRecord = async (
    userId: string, 
    filename: string, 
    fileUrl: string, 
    sessionId: string | null
  ) => {
    try {
      console.log("Saving document record to database");
      
      // Prepare document record data
      const documentData = {
        userId,
        filename,
        fileUrl,
        sessionId,
        documentType: 'nnn-agreement',
        status: 'completed',
        createdAt: new Date().toISOString()
      };
      
      // Call API to save document record
      const response = await fetch('/api/save-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save document record: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Document record saved:", result);
      
      return result;
    } catch (error) {
      console.error('Error saving document record:', error);
    }
  };
  
  // Function to generate PDF after payment
  const generatePdfAfterPayment = async (formData: NNNAgreementFormData, email: string | undefined) => {
    try {
      setGeneratingPdf(true);
      console.log("Generating PDF with form data");
      
      // Get current user ID from Supabase
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // Call your generate-pdf API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType: 'nnn-agreement',
          data: formData,
          userEmail: email || formData.email || '',
          userId: userId, // Include the user ID
        }),
      });
      
      console.log("PDF API response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to generate document: ${response.status}`);
      }
      
      // Get response as text first for debugging
      const responseText = await response.text();
      console.log("PDF API response text (preview):", responseText.substring(0, 100) + "...");
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Invalid JSON response:', responseText.substring(0, 500));
        if (e instanceof Error) {
          console.error('JSON parse error:', e.message);
        }
        throw new Error('Server returned invalid JSON response');
      }
      
      if (result.success) {
        console.log("PDF generated successfully");
        setPdfData(result.pdfData);
        setPdfFilename(result.filename || 'nnn-agreement.pdf');
        setEmailSent(result.emailSent || false);
        
        // If we have a document ID, you could do something with it like redirect to document view
        if (result.documentId) {
          console.log("Document saved with ID:", result.documentId);
        }
        
        // Upload PDF to Storage if we have a user ID
        if (userId && result.pdfData) {
          try {
            await uploadPdfToStorage(result.pdfData, result.filename, userId);
          } catch (uploadError) {
            console.error("Error uploading to storage:", uploadError);
            // Continue anyway - the user still has the PDF
          }
        }
      } else {
        throw new Error(result.message || 'Failed to generate document');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError(error instanceof Error ? error.message : 'Error generating document');
    } finally {
      setGeneratingPdf(false);
    }
  };
  
  // Handle document download
  const handleDownloadPDF = () => {
    if (!pdfData) {
      console.error("No PDF data available for download");
      return;
    }
    
    try {
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfData}`;
      link.download = pdfFilename || 'nnn-agreement.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Download initiated");
    } catch (error) {
      console.error("Error during download:", error);
      alert("There was an error downloading your document. Please try again.");
    }
  };
  
  // Function to manually retry PDF generation
  const handleRetryGeneration = async () => {
    const storedFormData = localStorage.getItem('nnnAgreementFormData');
    if (storedFormData) {
      try {
        const formData = JSON.parse(storedFormData);
        await generatePdfAfterPayment(formData, orderDetails?.customer?.email);
      } catch (error) {
        console.error("Error retrying PDF generation:", error);
        setPdfError("Failed to regenerate PDF. Please contact support.");
      }
    } else {
      setPdfError("No form data available. Please contact support.");
    }
  };
  
  // Verify the Stripe session and get order details
  useEffect(() => {
    const getOrderDetails = async () => {
      if (!sessionId) return;
      
      try {
        setVerifyingOrder(true);
        console.log("Fetching order details for session:", sessionId);
        
        // Call your verification API endpoint
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        console.log("Verify session response status:", response.status);
        
        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }
        
        const data = await response.json();
        console.log("Order details received:", data);
        setOrderDetails(data);
        
      } catch (error) {
        console.error('Error fetching session details:', error);
        setPdfError("Could not verify your payment. Please contact support with your session ID.");
      } finally {
        setVerifyingOrder(false);
      }
    };
    
    getOrderDetails();
  }, [sessionId]);
  
  // Generate PDF after order details are verified
  useEffect(() => {
    if (orderDetails && !generatingPdf && !pdfData && !pdfError) {
      const generateDocument = async () => {
        setLoading(true);
        
        // First, verify that the user is authenticated with Supabase
        const supabase = createClient();
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session) {
          console.error("Authentication error:", authError || "No active session");
          setPdfError("Authentication error. Please log in and try again.");
          setLoading(false);
          return;
        }
        
        // Check if we have stored form data for PDF generation
        const storedFormData = localStorage.getItem('nnnAgreementFormData');
        console.log("Form data found in localStorage:", !!storedFormData);
        
        if (storedFormData) {
          try {
            const formData = JSON.parse(storedFormData);
            
            // Generate PDF using the form data and customer email
            await generatePdfAfterPayment(formData, orderDetails.customer?.email);
            
            // Don't remove the form data yet - keep it for potential retries
            // localStorage.removeItem('nnnAgreementFormData');
          } catch (error) {
            console.error("Error parsing stored form data:", error);
            setPdfError("Could not retrieve your form data. Please contact support.");
          }
        } else {
          setPdfError("No form data found. Please contact support.");
        }
        
        setLoading(false);
      };
      
      generateDocument();
    }
  }, [orderDetails, generatingPdf, pdfData, pdfError]);
  
  const isLoading = loading || verifyingOrder;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {verifyingOrder ? "Verifying your payment..." : "Loading order details..."}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          {orderDetails?.status === 'paid' 
            ? "Your payment has been confirmed and we're preparing your document." 
            : "Your order has been received and will be processed once payment is confirmed."}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          {/* PDF Generation Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Document Status
            </h2>
            
            {generatingPdf && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Generating your document...</p>
                <p className="text-gray-500 text-sm mt-2">This typically takes 15-30 seconds</p>
              </div>
            )}
            
            {uploadingToStorage && !generatingPdf && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Saving document to your account...</p>
                <p className="text-gray-500 text-sm mt-2">This should only take a moment</p>
              </div>
            )}

            {pdfError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <XCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Document Generation Failed</h3>
                <p className="text-red-600 mb-4">{pdfError}</p>
                <Button 
                  onClick={handleRetryGeneration} 
                  variant="outline"
                  className="inline-flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Generation
                </Button>
                <p className="text-sm mt-3 text-gray-500">
                  If the problem persists, please contact our support team.
                </p>
              </div>
            )}

            {pdfData && !pdfError && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-green-800 mb-2">Your Document is Ready!</h3>
                <p className="text-green-600 mb-4">{documentStatusMessage || "Your document has been successfully generated."}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  <Button
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </Button>
                  
                  {fileUrl && (
                    <Button
                      variant="outline"
                      className="inline-flex items-center justify-center"
                      asChild
                    >
                      <Link href={fileUrl} target="_blank">
                        <FileText className="mr-2 h-4 w-4" />
                        View Online
                      </Link>
                    </Button>
                  )}
                </div>
                
                {emailSent && (
                  <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>Document sent to {orderDetails?.customer?.email}</span>
                  </div>
                )}
                
                {uploadSuccess && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-600">
                    This document has been saved to your account and will be available in your Documents dashboard.
                  </div>
                )}
              </div>
            )}
            
            {!generatingPdf && !pdfData && !pdfError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <Clock className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Document Pending</h3>
                <p className="text-yellow-600 mb-4">
                  We're waiting for your payment to be processed before generating your document.
                </p>
                <Button
                  variant="outline"
                  className="inline-flex items-center"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Status
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              {/* Order Status */}
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  orderDetails?.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {orderDetails?.status === 'paid' ? 'Paid' : 'Processing'}
                </span>
              </div>
              
              {/* Order Items */}
              {orderDetails?.items && orderDetails.items.length > 0 && (
                <div className="pt-2 pb-3 border-b border-gray-100">
                  {orderDetails.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Total */}
              <div className="flex justify-between pt-2 font-bold">
                <span>Total:</span>
                <span>${orderDetails?.payment?.amount?.toFixed(2) || '0.00'}</span>
              </div>
              
              {/* Order Details */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-sm">
                <p className="text-gray-500 mb-1">Order ID:</p>
                <p className="font-mono break-all text-xs mb-3">{sessionId}</p>
                
                <p className="text-gray-500 mb-1">Date:</p>
                <p className="mb-3">{orderDetails?.payment?.created ? new Date(orderDetails.payment.created).toLocaleString() : 'Not available'}</p>
                
                {orderDetails?.customer?.email && (
                  <>
                    <p className="text-gray-500 mb-1">Email:</p>
                    <p>{orderDetails.customer.email}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6 mt-6">
            <h3 className="font-bold text-blue-800 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                <span>Your document has been securely saved in your account</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                <span>Access your document anytime from your dashboard</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                <span>Need changes? Our support team is here to help</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Button asChild className="inline-flex items-center justify-center">
          <Link href="/dashboard/documents">
            <FileText className="mr-2 h-4 w-4" />
            Go to My Documents
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="inline-flex items-center justify-center">
          <Link href="/product">
            <ArrowRight className="mr-2 h-4 w-4" />
            Browse More Products
          </Link>
        </Button>
      </div>
    </div>
  );
}