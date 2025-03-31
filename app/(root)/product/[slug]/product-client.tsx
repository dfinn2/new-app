'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { getFormComponent } from '@/components/product-forms/registry';
import { getPreviewComponent } from '@/components/product-previews/registry';
import ProductInfoPage from '@/components/ProductInfoPage';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// Define the product interface
interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  stripePriceId?: string;
  stripeProductId?: string;
  slug: string;
  content?: string;
  category?: string;
}

// Client component that handles the UI and state
export default function UpdatedProductClient({ 
  product, 
  slug 
}: { 
  product: Product;
  slug: string;
}) {
  useEffect(() => {
    // Store the current product page path when component mounts
    localStorage.setItem('authReturnPath', `/product/${slug}`);
  }, [slug]);

  const router = useRouter();
  const [formData, setFormData] = useState<unknown>({});
  const [showForm, setShowForm] = useState(false);
  const [generatingDocument, setGeneratingDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Get the appropriate form component and schema based on the product slug
  const { Component: FormComponent, schema } = getFormComponent(slug);
  const PreviewComponent = getPreviewComponent(slug);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const supabase = createClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        
        // If user logs out while on the form page, return to info page
        if (event === 'SIGNED_OUT' && showForm) {
          setShowForm(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [showForm]);

  // Handle form data changes (for real-time preview)
  const handleFormChange = useCallback((newData: unknown) => {
    setFormData((prevData: unknown) => {
      const prevObj = typeof prevData === 'object' && prevData !== null ? prevData : {};
      const newObj = typeof newData === 'object' && newData !== null ? newData : {};
      return {...prevObj, ...newObj};
    });
  }, []);

  // Handle form submission
  const handleFormSubmit = async (data: unknown) => {
    try {
      setGeneratingDocument(true);
      
      // Validate with the schema
      const validData = schema.parse(data);
      
      console.log("Generating document with:", validData);
      
      // Example API call:
      // const response = await fetch('/api/generate-document', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     documentType: slug,
      //     data: validData,
      //   }),
      // });
      // 
      // if (response.ok) {
      //   const result = await response.json();
      //   setDocumentUrl(result.documentUrl);
      // }
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDocumentUrl('/sample-document.pdf');
      
    } catch (error) {
      console.error("Failed to generate document:", error);
    } finally {
      setGeneratingDocument(false);
    }
  };

  // Handle continue button click
  const handleContinue = () => {
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated or not showing form, display product info page
  if (!isAuthenticated || !showForm) {
    return (
      <section className="section_container py-10 pb-26">
        <div className="max-w-4xl mx-auto">
          <ProductInfoPage
            product={product}
            isAuthenticated={isAuthenticated}
            user={user}
            onContinue={handleContinue}
          />
        </div>
      </section>
    );
  }

  // If authenticated and showing form, display the form and preview
  return (
    <section className="section_container py-10 pb-26">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Column - Form Container */}
        <div className="relative min-h-[500px] max-h-[80vh] overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customize Your {product.name}</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times; Close
              </button>
            </div>
            
            <FormComponent 
              product={product}
              schema={schema}
              onChange={handleFormChange}
              onSubmit={handleFormSubmit}
            />
            
            {documentUrl && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 font-medium">Document successfully generated!</p>
                <a 
                  href={documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Download your document
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Dynamic Preview Component with real-time updates */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Document Preview</h2>
          <PreviewComponent 
            product={product}
            formData={formData}
            isGenerating={generatingDocument}
          />
        </div>
      </div>
    </section>
  );
}