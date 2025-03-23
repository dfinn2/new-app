'use client';

import React, { useState, useCallback } from 'react';
import { getFormComponent } from '@/components/product-forms/registry';
import { getPreviewComponent } from '@/components/product-previews/registry';
import BuyNowButton from '@/components/BuyNowButton';

// Define the product interface
interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  stripe_price_id?: string;
  stripe_product_id?: string;
  slug: string;
  content?: string;
  category?: string;
}

// Client component that handles the UI and state
export default function ProductClient({ 
  product, 
  slug 
}: { 
  product: Product;
  slug: string;
}) {
  const [formData, setFormData] = useState<unknown>({});
  const [showForm, setShowForm] = useState(false);
  const [generatingDocument, setGeneratingDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  // Get the appropriate form component and schema based on the product slug
  const { Component: FormComponent, schema } = getFormComponent(slug);
  const PreviewComponent = getPreviewComponent(slug);

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

  return (
    <section className="section_container py-10 pb-26">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Column - Container with animation */}
        <div className="relative min-h-[500px] max-h-[80vh] overflow-auto">
          {/* Information Card */}
          <div 
            className={`absolute inset-0 bg-white p-6 rounded-lg shadow-md transition-all duration-500 ease-in-out ${
              showForm ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="category-tag">{product.category || 'Standard'}</p>
                <p className="">{product.basePrice || "nothing"}</p>
              </div>
                          
              <p className="text-gray-600">{product.description}</p>
              
              {product.base_price && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Base Price</h3>
                  <p className="text-xl font-bold text-emerald-600">${product.base_price}</p>
                </div>
              )}
              
              {/* Buy Now and Custom Quote buttons */}
              <div className="mt-6 space-y-4">
                <BuyNowButton
                  productId={product.id} 
                  productName={product.name}
                  price={product.base_price || 0}
                  description={product.description}
                  stripePriceId={product.stripe_price_id}
                  stripeProductId={product.stripe_product_id}
                  slug={slug}
                />
                
                <p className="text-center text-gray-500 text-sm">or</p>
                
                <button 
                  onClick={() => setShowForm(true)}
                  className="w-full border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50"
                >
                  Customize Document
                </button>
              </div>
            </div>
          </div>
          
          {/* Dynamic Form Component with Zod validation */}
          <div 
            className={`absolute inset-0 bg-white p-6 transition-all duration-300 ease-in-out ${
              showForm ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
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