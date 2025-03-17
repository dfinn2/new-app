'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NNNAgreementFormData } from '@/schemas/nnnAgreementSchema';

interface OrderDetails {
  confirmed: boolean;
  sessionId: string | null;
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
  
  // Add state for PDF generation
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  
  // Function to generate PDF after payment
  const generatePdfAfterPayment = async (formData: NNNAgreementFormData, email: string | undefined) => {
    try {
      setGeneratingPdf(true);
      console.log("Generating PDF with form data");
      
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
  
  useEffect(() => {
    const getOrderDetails = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
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
        
        // Check if we have stored form data for PDF generation
        const storedFormData = localStorage.getItem('nnnAgreementFormData');
        console.log("Form data found in localStorage:", !!storedFormData);
        
        if (storedFormData) {
          try {
            const formData = JSON.parse(storedFormData);
            
            // Generate PDF using the form data and customer email
            await generatePdfAfterPayment(formData, data.customer?.email);
            
            // Don't remove the form data yet - keep it for potential retries
            // localStorage.removeItem('nnnAgreementFormData');
          } catch (error) {
            console.error("Error parsing stored form data:", error);
            setPdfError("Could not retrieve your form data. Please contact support.");
          }
        } else {
          setPdfError("No form data found. Please contact support.");
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
        setPdfError("Could not verify your payment. Please contact support with your session ID.");
      } finally {
        setLoading(false);
      }
    };
    
    getOrderDetails();
  }, [sessionId]);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    </div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been confirmed and you will receive a confirmation email shortly.
        </p>
        
        {sessionId && (
          <div className="bg-gray-50 p-4 rounded mb-8 text-left">
            <p className="text-sm text-gray-500 mb-1">Order Reference:</p>
            <p className="font-mono text-sm">{sessionId}</p>
            <p className="text-sm text-gray-500 mt-4 mb-1">
              {orderDetails && `Order Status: ${orderDetails.status === 'paid' ? 'Paid' : 'Processing'}`}
            </p>
          </div>
        )}
        
        {/* PDF Generation Status */}
        {generatingPdf && (
          <div className="mt-8 p-4 bg-blue-50 rounded text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Generating your document...</p>
          </div>
        )}

        {pdfError && (
          <div className="mt-8 p-4 bg-red-50 rounded text-center">
            <p className="text-red-600">{pdfError}</p>
            <button 
              onClick={handleRetryGeneration} 
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry Generation
            </button>
            <p className="text-sm mt-2">
              If the problem persists, please contact support.
            </p>
          </div>
        )}

        {pdfData && !pdfError && (
          <div className="mt-8 p-6 bg-green-50 rounded text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your Document is Ready!</h3>
            
            {emailSent && (
              <p className="mb-4 text-gray-600">
                We have also sent a copy to your email for safekeeping.
              </p>
            )}
            
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
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
          </div>
        )}
        
        {sessionId && orderDetails && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {/* Payment Status */}
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  orderDetails.status === 'paid' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {orderDetails.status === 'paid' ? 'Paid' : 'Processing'}
                </span>
              </div>
              
              {/* Customer Info */}
              {orderDetails.customer && (
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500 mb-1">Customer:</p>
                  <p className="font-medium">{orderDetails.customer.name || 'Not provided'}</p>
                  <p className="text-gray-600">{orderDetails.customer.email || 'Not provided'}</p>
                </div>
              )}
              
              {/* Order Items */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500 mb-2">Items:</p>
                  {orderDetails.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{item.name} {item.quantity > 1 && `(${item.quantity})`}</span>
                      <span className="font-medium">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Total */}
              <div className="flex justify-between pt-2 font-bold">
                <span>Total:</span>
                <span>${orderDetails.payment?.amount?.toFixed(2) || '0.00'}</span>
              </div>
              
              {/* Receipt ID */}
              <div className="mt-4 pt-4 border-t text-sm">
                <p className="text-gray-500">Receipt ID:</p>
                <p className="font-mono break-all">{orderDetails.receiptId || sessionId}</p>
                <p className="text-gray-500 mt-2">Date:</p>
                <p>{orderDetails.payment?.created ? new Date(orderDetails.payment.created).toLocaleString() : 'Not available'}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/product">
              Browse More Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}